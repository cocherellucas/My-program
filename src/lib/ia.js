// ─────────────────────────────────────────────────────────────────────────────
// POINT D'ENTRÉE UNIQUE VERS LE MODÈLE DE LANGAGE
//
// Toute l'app ne parle au modèle QUE par ici. Avant, l'appel vivait au milieu de
// CoachIA.jsx : changer de fournisseur voulait dire retrouver l'appel dans 500
// lignes d'interface, et emporter avec lui le temps d'attente et le nom du
// modèle. Maintenant, c'est un fichier.
//
// ── CHANGER DE FOURNISSEUR ───────────────────────────────────────────────────
// Il n'y a que `appelerIA` à réécrire. Le contrat à respecter :
//   • rendre une CHAÎNE (la réponse du modèle) ;
//   • LEVER en cas d'échec, de coupure ou de dépassement du temps d'attente —
//     l'appelant s'en sert pour basculer sur ses réponses codées (douleur).
// Rien d'autre dans l'app ne connaît le fournisseur.
//
// ⚠ Le dépôt est PUBLIC : la clé du futur fournisseur ne doit jamais arriver
//   ici. Elle vit dans une fonction relais côté serveur, que ce fichier
//   appellera. Voir la note « relais serveur » avant de rebrancher quoi que ce
//   soit.
//
// ⚠ Vérifier le CACHE DE PROMPT du fournisseur retenu : le référentiel envoyé à
//   chaque message pèse ~9 400 jetons identiques, soit les trois quarts du coût
//   d'entrée. Mis en cache, la facture est divisée par plus de deux.
// ─────────────────────────────────────────────────────────────────────────────
import { base44 } from '@/api/base44Client';

/** Modèle utilisé aujourd'hui, côté base44. */
export const MODELE = 'claude_sonnet_4_6';

/** Au-delà, on considère que ça ne répondra pas (millisecondes). */
export const DELAI_MAX = 30000;

/**
 * Envoie un prompt au modèle et rend sa réponse en texte.
 * @param {object}   options
 * @param {string}   options.prompt   le prompt complet, déjà assemblé
 * @param {string[]} [options.images] images en base64, si le modèle les accepte
 * @returns {Promise<string>}
 * @throws  si l'IA est coupée, indisponible, ou trop lente
 */
export async function appelerIA({ prompt, images } = {}) {
  const params = { prompt, model: MODELE };
  if (images?.length) params.add_context_from_images = images;

  const tropLong = new Promise((_, rejeter) =>
    setTimeout(() => rejeter(new Error('timeout')), DELAI_MAX));

  // `InvokeLLM` est `async` : quand l'IA est coupée, le throw devient une
  // promesse rejetée — d'où le `race` plutôt qu'un try/catch synchrone.
  return Promise.race([
    base44.integrations.Core.InvokeLLM(params),
    tropLong,
  ]);
}
