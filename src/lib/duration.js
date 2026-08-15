// Durée d'une séance — UN seul modèle pour toute l'app.
//
// Il en existait deux, qui ne tombaient pas d'accord :
//   • la génération et le garde-fou temps (program-activation.js) comptaient
//     8 min d'échauffement et arrondissaient à la minute ;
//   • `calcDuration`, utilisé pour l'affichage des séances IMPORTÉES et des
//     programmes restaurés depuis la Bibliothèque, comptait 5 min et
//     arrondissait au multiple de 5.
// Écart typique : 4 min. Deux séances identiques pouvaient donc s'afficher
// 45 et 49 min côte à côte dans la même liste, selon leur provenance — et le
// garde-fou raisonnait sur un chiffre que l'écran ne montrait pas.
//
// C'est le modèle de la GÉNÉRATION qui fait foi : c'est lui qui décide de
// bloquer une validation, il ne peut pas être le moins exact des deux.

/** Exécution moyenne d'une série, hors repos (secondes). */
export const EXEC_SECONDS_PER_SET = 45;
/** Échauffement forfaitaire en tête de séance (minutes). */
export const WARMUP_MINUTES = 8;

/** Minutes d'un exercice : séries × (repos + exécution). */
export const exerciseMinutes = (x) =>
  ((x?.sets || 0) * ((x?.rest_seconds || 90) + EXEC_SECONDS_PER_SET)) / 60;

/** Minutes d'une séance, échauffement compris. */
export const sessionMinutes = (exercises = []) =>
  WARMUP_MINUTES + exercises.reduce((n, x) => n + exerciseMinutes(x), 0);

/**
 * Durée affichée d'une séance dont `estimated_duration` est absent — séances
 * importées et anciens programmes. Même modèle que la génération ; seule
 * différence, un exercice importé sans nombre de séries est supposé en avoir 3
 * (le catalogue, lui, les renseigne toujours : vérifié sur ses 4942 exercices).
 */
export function calcDuration(exercises) {
  if (!exercises || exercises.length === 0) return 60;
  return Math.round(sessionMinutes(exercises.map((x) => (x?.sets ? x : { ...x, sets: 3 }))));
}
