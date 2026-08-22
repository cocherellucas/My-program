// ─────────────────────────────────────────────────────────────────────────────
// PLAN D'ABONNEMENT ACTIF — source unique.
//
// L'expression `user?.subscription_plan || localStorage.cached_subscription_plan
// || 'starter'` était recopiée dans cinq écrans. Un seul endroit désormais :
// une règle d'abonnement qui diverge d'un écran à l'autre, c'est un client qui
// paie et qui voit quand même le guichet.
//
// ⚠️ RAPPEL : cette résolution est de l'AFFICHAGE. Elle vit dans le navigateur,
// donc elle est modifiable par n'importe qui. La vraie barrière de coût est le
// relais serveur qui portera la clé du modèle — c'est là que la vérification du
// plan doit se faire avant tout appel payant.
//
// ── OUTIL DE TEST (console F12) ──────────────────────────────────────────────
//   __plan.elite()    → passe l'app en Elite
//   __plan.coach()    → passe l'app en Coach
//   __plan.starter()  → repasse en Starter (plan gratuit)
//   __plan.reset()    → retire la simulation, retour au vrai plan du compte
//   __plan.status()   → affiche le plan simulé et le plan réel
//
// Non destructif : rien n'est écrit côté serveur, ton abonnement réel n'est pas
// touché. Même esprit que `dev-time.js`.
// ⚠️ Outil de dev : à retirer avant commercialisation.
// ─────────────────────────────────────────────────────────────────────────────

const CLE_SIMULATION = 'dev_plan';
const CLE_CACHE = 'cached_subscription_plan';
const PLANS = ['starter', 'coach', 'elite'];

function lire(cle) {
  try { return localStorage.getItem(cle); } catch { return null; }
}

/** Plan simulé pour les tests, ou null. */
export function planSimule() {
  const p = lire(CLE_SIMULATION);
  return PLANS.includes(p) ? p : null;
}

/**
 * Plan à appliquer maintenant.
 * Ordre : simulation de test → plan du compte → cache local → 'starter'.
 *
 * Le cache n'est écrit que par la page Profil : un abonné qui ne l'a jamais
 * ouverte n'en a pas. C'est pourquoi les écrans doivent attendre que `user`
 * soit chargé avant d'afficher un mur — sinon on montre le guichet à quelqu'un
 * qui paie déjà, le pire bug possible ici.
 */
export function planActif(user) {
  return planSimule() || user?.subscription_plan || lire(CLE_CACHE) || 'starter';
}

/** Le plan donne-t-il accès aux fonctions payantes ? */
export function estPayant(user) {
  return planActif(user) !== 'starter';
}

if (typeof window !== 'undefined') {
  const poser = (p) => {
    try { localStorage.setItem(CLE_SIMULATION, p); } catch {}
    console.log(`[plan] simulation → ${p.toUpperCase()} (abonnement réel inchangé)`);
    location.reload();
  };
  window.__plan = {
    elite() { poser('elite'); },
    coach() { poser('coach'); },
    starter() { poser('starter'); },
    reset() {
      try { localStorage.removeItem(CLE_SIMULATION); } catch {}
      console.log('[plan] simulation retirée → retour au plan réel du compte');
      location.reload();
    },
    status() {
      console.log(`[plan] simulé : ${planSimule() || 'aucun'} · cache local : ${lire(CLE_CACHE) || 'aucun'}`);
    },
  };
}
