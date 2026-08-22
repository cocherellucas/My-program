// ─────────────────────────────────────────────────────────────────────────────
// CHOIX DU FORMULAIRE DOULEUR EN SÉANCE
//
// Avant, les trois champs étaient du texte libre. Or `buildPainAdvice` ne lit
// pas des phrases : il cherche des MOTS-CLÉS. Deux conséquences mesurées :
//   • « ekzjbvhvv » et trois champs VIDES donnaient exactement la même réponse
//     — la branche par défaut, qui dit de CONTINUER ;
//   • « ça a craqué » déclenchait « stop, avis médical », mais « un truc a
//     lâché » — le même accident — renvoyait l'utilisateur sous la barre.
// Un échec de reconnaissance ressemblait donc à un feu vert.
//
// D'où des choix à toucher. Le LIBELLÉ TRADUIT EST AUSSI LA VALEUR ENVOYÉE au
// moteur : une seule chaîne, donc aucun risque qu'un libellé et un mot-clé
// divergent. En contrepartie, chaque libellé DOIT contenir le mot que la regex
// attend, dans les deux langues.
//
// ⚠ `program-data/audit-puces-douleur.mjs` vérifie que chaque choix déclenche
//   bien une branche distincte, et que les trois cas graves sont détectés comme
//   graves — en français ET en anglais. À relancer après toute retouche de
//   libellé, sinon une reformulation innocente peut éteindre le message d'arrêt.
// ─────────────────────────────────────────────────────────────────────────────

// Où — alimente `detectZoneFromText`, qui est déjà bilingue.
export const OU = [
  { id: 'shoulders', tk: 'pd_ou_epaule' },
  { id: 'knees', tk: 'pd_ou_genou' },
  { id: 'elbows', tk: 'pd_ou_coude' },
  { id: 'wrists', tk: 'pd_ou_poignet' },
  { id: 'lower_back', tk: 'pd_ou_dos' },
  { id: 'neck', tk: 'pd_ou_nuque' },
];

// Quand — une entrée par branche « moment » de buildPainAdvice.
export const QUAND = [
  { id: 'montee', tk: 'pd_qd_montee' },
  { id: 'descente', tk: 'pd_qd_descente' },
  { id: 'bas', tk: 'pd_qd_bas' },
  { id: 'verrouillage', tk: 'pd_qd_haut' },
  { id: 'apres', tk: 'pd_qd_apres' },
  { id: 'echauffement', tk: 'pd_qd_echauffement' },
  { id: 'constant', tk: 'pd_qd_constant' },
];

// Comment — une entrée par branche « nature », plus les TROIS cas de gravité.
// `grave: true` les affiche en rouge : ce sont ceux qui déclenchent « arrête et
// consulte », et qui restent gratuits quel que soit l'abonnement.
export const COMMENT = [
  { id: 'gene', tk: 'pd_cm_gene' },
  { id: 'brulure', tk: 'pd_cm_brulure' },
  { id: 'tension', tk: 'pd_cm_tension' },
  { id: 'pincement', tk: 'pd_cm_pincement' },
  { id: 'crampe', tk: 'pd_cm_crampe' },
  { id: 'coup', tk: 'pd_cm_coup', grave: true },
  { id: 'fourmis', tk: 'pd_cm_fourmis', grave: true },
  { id: 'gonfle', tk: 'pd_cm_gonfle', grave: true },
];

// Assemble la note envoyée au moteur. Les étiquettes restent en français : le
// moteur les reconnaît dans les deux langues (`seg('où','ou','where')`), et les
// changer casserait la lecture des notes déjà enregistrées en base.
export function composerNote({ ou, quand, comment }) {
  return [`Où : ${ou}`, `Quand : ${quand}`, `Comment : ${comment}`].join(' — ');
}
