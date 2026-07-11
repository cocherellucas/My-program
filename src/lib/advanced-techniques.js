// ─────────────────────────────────────────────────────────────────────────────
// Guide des techniques avancées — contenu 100 % codé (aucune IA).
// Chaque technique : c'est quoi, QUAND l'utiliser (cas d'usage, mis en évidence),
// comment, précaution, et pour quels objectifs elle convient (`goals`).
// La page met en avant celles qui collent à l'objectif actif de l'utilisateur.
// ─────────────────────────────────────────────────────────────────────────────

// Un objectif "mixte" correspond à un peu tout → on l'étend aux trois.
export const OBJECTIVE_EXPAND = { mixed: ['hypertrophy', 'strength', 'endurance'] };

export const TECHNIQUES = [
  {
    id: 'superset',
    emoji: '🔗',
    goals: ['hypertrophy', 'endurance'],
    name: { fr: 'Superset', en: 'Superset' },
    when: {
      fr: 'Tu manques de temps, ou tu veux plus de densité et de congestion. Idéal aussi pour enchaîner deux muscles opposés (biceps/triceps).',
      en: "You're short on time, or you want more density and pump. Also great for pairing two opposing muscles (biceps/triceps).",
    },
    what: {
      fr: 'Enchaîner deux exercices sans repos entre les deux.',
      en: 'Two exercises back-to-back with no rest in between.',
    },
    how: {
      fr: "Série de l'exercice A, puis immédiatement l'exercice B, puis repos. On recommence.",
      en: 'Do a set of exercise A, then immediately exercise B, then rest. Repeat.',
    },
    caution: {
      fr: 'À éviter sur deux gros mouvements lourds (squat + soulevé) : la fatigue nuit à la technique et à la force.',
      en: 'Avoid pairing two heavy compounds (squat + deadlift): fatigue hurts your form and strength.',
    },
  },
  {
    id: 'dropset',
    emoji: '📉',
    goals: ['hypertrophy'],
    name: { fr: 'Dropset (série dégressive)', en: 'Drop set' },
    when: {
      fr: "Sur la DERNIÈRE série d'un exercice, surtout en isolation (curl, extensions), pour un maximum de stress métabolique.",
      en: 'On the LAST set of an exercise, especially isolation (curls, extensions), for maximum metabolic stress.',
    },
    what: {
      fr: "À l'échec, réduire la charge (~20-25 %) et continuer sans repos.",
      en: 'At failure, drop the load (~20-25%) and keep going with no rest.',
    },
    how: {
      fr: "Va à l'échec, baisse la charge de ~20-25 %, enchaîne jusqu'à l'échec. 1 à 2 descentes suffisent.",
      en: 'Go to failure, drop the load ~20-25%, continue to failure. 1-2 drops are enough.',
    },
    caution: {
      fr: 'Très fatigant : 1 exercice par séance maximum. Aucun intérêt en force pure.',
      en: 'Very taxing: one exercise per session max. No real benefit for pure strength.',
    },
  },
  {
    id: 'rest_pause',
    emoji: '⏸️',
    goals: ['hypertrophy', 'strength'],
    name: { fr: 'Rest-pause', en: 'Rest-pause' },
    when: {
      fr: "Pour gagner du volume à une charge donnée quand tu as peu de temps, ou pousser une série un peu plus loin.",
      en: 'To add volume at a given load when short on time, or to push a set a bit further.',
    },
    what: {
      fr: 'Prolonger une série avec de mini-pauses pour arracher plus de répétitions à la même charge.',
      en: 'Extend a set with mini-pauses to squeeze more reps out of the same load.',
    },
    how: {
      fr: "Va proche de l'échec, repose 15-20 s, reprends la même charge, répète 1 à 2 fois.",
      en: 'Go near failure, rest 15-20 s, resume with the same load, repeat 1-2 times.',
    },
    caution: {
      fr: 'Plutôt sur des exercices sûrs (machines, isolation) que sur des mouvements techniques lourds.',
      en: 'Prefer safe exercises (machines, isolation) over heavy technical lifts.',
    },
  },
  {
    id: 'tempo',
    emoji: '🐢',
    goals: ['hypertrophy', 'strength'],
    name: { fr: 'Tempo / excentrique (négatives)', en: 'Tempo / eccentric' },
    when: {
      fr: 'Pour mieux sentir le muscle, renforcer les tendons et progresser sur la technique. Utile en force comme en hypertrophie.',
      en: 'To feel the muscle better, strengthen tendons and improve technique. Useful for both strength and hypertrophy.',
    },
    what: {
      fr: 'Contrôler la descente (phase excentrique) sur 3-4 secondes.',
      en: 'Control the lowering (eccentric) phase over 3-4 seconds.',
    },
    how: {
      fr: 'Descends lentement (3-4 s) sans relâcher, puis remonte normalement.',
      en: 'Lower slowly (3-4 s) without letting go, then lift back up normally.',
    },
    caution: {
      fr: "Réduis un peu la charge : c'est plus dur qu'il n'y paraît.",
      en: "Reduce the load a bit: it's harder than it looks.",
    },
  },
  {
    id: 'myo_reps',
    emoji: '🔁',
    goals: ['hypertrophy'],
    name: { fr: 'Myo-reps', en: 'Myo-reps' },
    when: {
      fr: "Pour accumuler beaucoup de répétitions efficaces en peu de temps (hypertrophie).",
      en: 'To accumulate many effective reps in little time (hypertrophy).',
    },
    what: {
      fr: "Une série d'activation près de l'échec, suivie de mini-séries courtes avec très peu de repos.",
      en: 'An activation set near failure, followed by short mini-sets with very little rest.',
    },
    how: {
      fr: "Série jusqu'à 1-2 reps de l'échec, repose 5-10 s, fais 3-5 reps, répète 3 à 4 fois.",
      en: 'Set to 1-2 reps short of failure, rest 5-10 s, do 3-5 reps, repeat 3-4 times.',
    },
    caution: {
      fr: "Réservé aux exercices d'isolation/machines ; demande de l'expérience.",
      en: 'For isolation/machine exercises only; requires some experience.',
    },
  },
];

// La technique est-elle recommandée pour les objectifs actifs de l'utilisateur ?
export function isRecommendedFor(technique, objectiveTypes = []) {
  const expanded = objectiveTypes.flatMap((o) => OBJECTIVE_EXPAND[o] || [o]);
  return technique.goals.some((g) => expanded.includes(g));
}
