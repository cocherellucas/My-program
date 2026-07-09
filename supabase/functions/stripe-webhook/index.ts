// ─────────────────────────────────────────────────────────────────────────────
//  Webhook Stripe → active le plan payé sur le profil utilisateur.
//  PRÊT À DÉPLOYER quand le compte Stripe sera créé — rien à coder de plus.
//
//  Mise en place (une fois le compte Stripe créé) :
//  1. Stripe → Produits : créer « Coach » et « Elite » (prix mensuel + annuel).
//  2. Stripe → Liens de paiement : créer un lien par prix, et dans chaque lien
//     ajouter la métadonnée  plan = coach  (ou  plan = elite ).
//     Coller ces liens dans l'app : /admin/pricing → champs « Lien de paiement ».
//  3. Déployer cette fonction :
//       supabase functions deploy stripe-webhook --no-verify-jwt
//     puis définir les secrets :
//       supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//       supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
//  4. Stripe → Développeurs → Webhooks : ajouter l'endpoint
//       https://<ref-projet>.supabase.co/functions/v1/stripe-webhook
//     avec l'événement  checkout.session.completed .
//
//  Sécurité : la mise à jour utilise la clé service_role (fournie automatiquement
//  aux Edge Functions) — c'est la SEULE voie autorisée à changer
//  subscription_plan (le trigger anti-escalade bloque les clients).
// ─────────────────────────────────────────────────────────────────────────────
import Stripe from 'npm:stripe@14';
import { createClient } from 'npm:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature ?? '',
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '',
    );
  } catch (e) {
    return new Response(`Signature invalide : ${(e as Error).message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Paiement réussi → activer le plan sur le profil
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;           // passé par l'app au clic
    const plan = session.metadata?.plan;                  // metadata du Payment Link
    if (userId && (plan === 'coach' || plan === 'elite')) {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: plan })
        .eq('id', userId);
      if (error) return new Response(`Erreur profil : ${error.message}`, { status: 500 });
    }
  }

  // Abonnement annulé/expiré → retour au plan gratuit
  // (nécessite l'événement customer.subscription.deleted sur le webhook et la
  //  metadata user_id sur l'abonnement — à activer quand les abonnements tournent)
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const userId = (sub.metadata?.user_id as string) || null;
    if (userId) {
      await supabase.from('profiles').update({ subscription_plan: 'starter' }).eq('id', userId);
    }
  }

  return new Response('ok', { status: 200 });
});
