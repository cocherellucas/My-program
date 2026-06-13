// @ts-nocheck
// ─────────────────────────────────────────────────────────────────────────────
// PROGRAM BUILDER — Pré-calcul déterministe avant appel LLM
// Transforme toutes les données utilisateur en un brief structuré et précis
// L'IA reçoit un contexte complet → moins de devinettes, plus de précision
// ─────────────────────────────────────────────────────────────────────────────

import { VOLUME_TABLES, TRAINING_PARAMS, LARGE_MUSCLES, getVolumeRange, computeSessionTechniques } from './coaching-engine';
import { getExercisesForMuscle } from './exercise-database';

// ─── Durée moyenne par série selon l'objectif ET le niveau (minutes) ───
// Débutant : charges légères → ATP/CP resynthèse plus rapide → repos 60-90s suffisent
// Intermédiaire : repos standard 90-120s
// Avancé : charges élevées → repos 120-150s nécessaires
// SET_DURATION = durée totale par série = exécution (~0.6 min) + repos
// Strength   : plus avancé → charges plus lourdes → plus de repos (PCr + SNC)
// Hypertrophy: débutant → charges légères → repos 90-100s suffisants (vs 150s intermédiaire)
// Endurance  : INVERSÉ — débutant → moins conditionné → plus de repos
//              avancé → repos courts INTENTIONNELLEMENT pour adapter le métabolisme
const SET_DURATION_BY_LEVEL = {
  strength:    { beginner: 2.8, intermediate: 5,   advanced: 6   },
  hypertrophy: { beginner: 2.2, intermediate: 3,   advanced: 3.5 },
  endurance:   { beginner: 1.8, intermediate: 1.5, advanced: 1.2 },
};
const WARMUP_MINUTES = 8;

function getSetDuration(objective, level) {
  return (SET_DURATION_BY_LEVEL[objective] || SET_DURATION_BY_LEVEL.hypertrophy)[level]
    || SET_DURATION_BY_LEVEL.hypertrophy.intermediate;
}

// ─── Temps de transition entre exercices ───
// Déplacement, ajustement des charges, installation = ~1.5 min par exercice
// Réparti sur ~4 séries en moyenne → 0.375 min par série
const TRANSITION_PER_SET = 1.5 / 4;

// ─── Muscles ciblés par zone d'objectif ───
const ZONE_MUSCLES = {
  upper_body:  ['Poitrine', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdos'],
  lower_body:  ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Adducteurs'],
  full_body:   ['Poitrine', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdos'],
  specific_group: [], // défini par focus_group
};

// ─── Structures disponibles avec description pour le brief LLM ───
const SPLIT_DESCRIPTIONS = {
  full_body:    { label: 'Full Body', sessions: 'Tous les groupes musculaires à chaque séance' },
  upper_lower:  { label: 'Upper / Lower', sessions: 'Séances Haut du corps alternées avec Bas du corps (2+2 ou 2+3)' },
  ppl:          { label: 'Push / Pull / Legs', sessions: 'Push (Poitrine+Épaules+Triceps) · Pull (Dos+Biceps) · Legs (Quadriceps+Ischio+Fessiers) — 1 ou 2 rotations selon les jours' },
  arnold_split: { label: 'Arnold Split', sessions: 'Jour 1 : Poitrine+Dos · Jour 2 : Épaules+Bras · Jour 3 : Jambes — 2 rotations en 6 jours' },
  phul:         { label: 'PHUL (Power Hypertrophy Upper Lower)', sessions: 'Jour 1 : Upper Power (force, composés lourds) · Jour 2 : Lower Power · Jour 3 : repos · Jour 4 : Upper Hypertrophy (volume, accessoires) · Jour 5 : Lower Hypertrophy' },
  ul_ppl:       { label: 'Upper / Lower / Push / Pull / Legs', sessions: 'Jour 1 : Upper · Jour 2 : Lower · Jour 3 : Push · Jour 4 : Pull · Jour 5 : Legs — haute fréquence 5 jours' },
  bro_split:    { label: 'Bro Split (1 muscle/jour)', sessions: 'Jour 1 : Poitrine · Jour 2 : Dos · Jour 3 : Jambes · Jour 4 : Épaules · Jour 5 : Bras — volume maximal par muscle, fréquence 1×/sem' },
};

export { SPLIT_DESCRIPTIONS };

// ─── Durée de programme recommandée selon le niveau ───
const PLANNED_WEEKS = { beginner: 10, intermediate: 8, advanced: 6 };

// ─── Sélection intelligente des jours ───
// - frequency_max défini → garde les N meilleurs jours (N = frequency_max)
// - 7 jours sans frequency_max → garde les 6 meilleurs
// - < 7 jours sans frequency_max → tous utilisés
function selectTrainingDays(availableDays, durations, frequencyMax, level) {
  if (!availableDays.length) return { trainingDays: [], shortDays: [] };

  const sorted = [...availableDays]
    .map(d => ({ day: d, mins: parseInt(durations[d]) || 0 }))
    .sort((a, b) => b.mins - a.mins);

  let targetCount;
  if (frequencyMax) {
    // Débutant : cap à 5 sauf si il demande explicitement 6
    const effective = (level === 'beginner' && frequencyMax < 6)
      ? Math.min(frequencyMax, 5)
      : frequencyMax;
    targetCount = Math.min(effective, availableDays.length);
  } else if (level === 'beginner') {
    // Débutant sans préférence → cap à 5
    targetCount = Math.min(5, availableDays.length);
    if (availableDays.length <= 5) return { trainingDays: availableDays, shortDays: [] };
  } else if (availableDays.length === 7) {
    targetCount = 6;
  } else {
    return { trainingDays: availableDays, shortDays: [] };
  }

  const trainingDays = sorted.slice(0, targetCount).map(d => d.day);
  const shortDays    = sorted.slice(targetCount).map(d => d.day);

  return { trainingDays, shortDays };
}

// ─── Muscles impactés par les zones fragiles ───
const FRAGILE_ZONE_IMPACTS = {
  wrists:     ['Biceps', 'Triceps', 'Poitrine', 'Épaules'],
  shoulders:  ['Épaules', 'Poitrine', 'Triceps'],
  elbows:     ['Biceps', 'Triceps'],
  knees:      ['Quadriceps', 'Ischio-jambiers', 'Mollets'],
  lower_back: ['Dos', 'Ischio-jambiers', 'Fessiers'],
  neck:       ['Épaules', 'Dos'],
};

// Normalise fragile_zones — supporte ancien format (string[]) et nouveau ({ key, goal }[])
function normalizeFragileZones(raw) {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map(z => typeof z === 'string' ? { key: z, goal: 'protect' } : z);
}

// ─── Seuils de temps par split (minutes/session) ───
// std  = sans supersets | ss = avec supersets antagonistes optimaux
// pairs = paires antagonistes à supersetter en priorité pour ce split
const SPLIT_THRESHOLDS = {
  full_body:    { std: 25, ss: 15, pairs: [['Poitrine','Dos'], ['Biceps','Triceps'], ['Quadriceps','Ischio-jambiers']] },
  upper_lower:  { std: 42, ss: 28, pairs: [['Poitrine','Dos'], ['Biceps','Triceps']] },
  ppl:          { std: 42, ss: 32, pairs: [['Biceps','Triceps']] },
  arnold_split: { std: 62, ss: 40, pairs: [['Poitrine','Dos']] }, // le superset chest/back EST le point fort de l'Arnold
  phul:         { std: 55, ss: 44, pairs: [['Poitrine','Dos'], ['Biceps','Triceps']] }, // power days : pas de supersets (repos SNC) ; hyp days : ok
  ul_ppl:       { std: 42, ss: 32, pairs: [['Biceps','Triceps']] },
};

// ─────────────────────────────────────────────────────────────────────────────
// SÉLECTION DU SPLIT
// Retourne { structure, needsSupersets, supersetPairs }
// ─────────────────────────────────────────────────────────────────────────────
function selectStructure(availableDays, durations, objectives, level) {
  const days    = availableDays.length;
  const primary = objectives.find(o => o.priority === 'primary');
  const objType = primary?.type || 'hypertrophy';
  const hasStrength    = objectives.some(o => o.type === 'strength');
  const hasHypertrophy = objectives.some(o => o.type === 'hypertrophy');

  // Métriques de durée
  const sessionMins = availableDays.map(d => parseInt(durations[d]) || 60);
  const avgDuration = Math.round(sessionMins.reduce((s, v) => s + v, 0) / sessionMins.length);

  // Helpers : faisabilité et besoin de supersets
  const canDo      = (s) => avgDuration >= (SPLIT_THRESHOLDS[s]?.ss  ?? 15);
  const needsSS    = (s) => canDo(s) && avgDuration < (SPLIT_THRESHOLDS[s]?.std ?? 25);
  const result     = (s) => ({
    structure:      s,
    needsSupersets: needsSS(s),
    supersetPairs:  needsSS(s) ? (SPLIT_THRESHOLDS[s]?.pairs || []) : [],
  });

  // 1–2 jours : full body uniquement
  if (days <= 2) return result('full_body');

  // Force → full body jusqu'à 4 jours (fréquence composés prioritaire)
  if (objType === 'strength' && days <= 4) return result('full_body');

  // Groupe spécifique → upper_lower (bro split retiré de la sélection auto)
  if (primary?.zone === 'specific_group' && days >= 4) return result('upper_lower');

  // 3 jours
  if (days === 3) {
    if (level === 'beginner') return result('full_body');
    return canDo('ppl') ? result('ppl') : result('full_body');
  }

  // 4 jours
  if (days === 4) {
    if (hasStrength && hasHypertrophy && canDo('phul')) return result('phul');
    return result('upper_lower');
  }

  // 5 jours
  if (days === 5) {
    if (level === 'beginner') return result('upper_lower');
    return canDo('ul_ppl') ? result('ul_ppl') : result('upper_lower');
  }

  // 6 jours
  if (days === 6) {
    if (level === 'advanced' && canDo('arnold_split')) return result('arnold_split');
    return canDo('ppl') ? result('ppl') : result('full_body');
  }

  return result('full_body');
}

// ─────────────────────────────────────────────────────────────────────────────
// VOLUME PAR SÉANCE
// Calcule le nombre de séries réalisables dans le temps disponible
// ─────────────────────────────────────────────────────────────────────────────
function calcSessionVolume(durationMinutes, objective, level = 'intermediate') {
  const minPerSet = getSetDuration(objective, level) + TRANSITION_PER_SET;
  const available = Math.max(0, durationMinutes - WARMUP_MINUTES);
  return Math.floor(available / minPerSet);
}

// ─────────────────────────────────────────────────────────────────────────────
// RÉPARTITION DU VOLUME PAR MUSCLE
// Alloue les séries disponibles par groupe selon priorité + objectif
// ─────────────────────────────────────────────────────────────────────────────
function allocateVolumeByMuscle(objectives, totalSetsPerSession, level, phase, structure) {
  // Premier objectif principal (pour déterminer le type "dominant" et la cible hebdo)
  const primary   = objectives.find(o => o.priority === 'primary') || objectives[0];
  const objType   = primary?.type || 'hypertrophy';
  const objTable  = VOLUME_TABLES[objType] || VOLUME_TABLES.hypertrophy;
  const largeMEV  = objTable.large?.[level]?.MAV || objTable.large?.intermediate?.MAV || 14;
  const smallMEV  = objTable.small?.[level]?.MAV || objTable.small?.intermediate?.MAV || 10;
  const weeklyTarget = Math.round((largeMEV + smallMEV) / 2);

  const getMuscles = (obj) => obj.zone === 'specific_group'
    ? (Array.isArray(obj.focus_group) ? obj.focus_group : [obj.focus_group])
    : ZONE_MUSCLES[obj.zone] || (obj.priority === 'primary' ? ZONE_MUSCLES.full_body : []);

  // Allocation PAR OBJECTIF (pas par muscle) :
  // chaque primary = poids 1, chaque secondary = poids 2/3
  // L'allocation d'un objectif est répartie sur ses muscles
  const objWeights = objectives.map(o => o.priority === 'primary' ? 1 : 2/3);
  const totalWeight = objWeights.reduce((a, b) => a + b, 0) || 1;

  // Pour chaque muscle, choisir l'objectif "gagnant" :
  // - priorité au "primary" si présent dans plusieurs objectifs
  // - sinon, premier trouvé
  const muscleToObj = {};
  objectives.forEach((obj, idx) => {
    for (const m of getMuscles(obj)) {
      const current = muscleToObj[m];
      if (!current || (obj.priority === 'primary' && objectives[current.objIdx].priority !== 'primary')) {
        muscleToObj[m] = { objIdx: idx, priority: obj.priority };
      }
    }
  });

  // Compter combien de muscles chaque objectif "possède" après attribution
  const objMuscleCount = {};
  for (const { objIdx } of Object.values(muscleToObj)) {
    objMuscleCount[objIdx] = (objMuscleCount[objIdx] || 0) + 1;
  }

  return Object.entries(muscleToObj).map(([muscle, { objIdx, priority }]) => {
    const objShare = objWeights[objIdx] / totalWeight;
    const count    = objMuscleCount[objIdx] || 1;
    const ratio    = objShare / count;
    const weekly   = Math.round(weeklyTarget * ratio);
    const perSession = structure === 'full_body'
      ? Math.ceil(weekly / (objectives[0]?.pref_frequency || 2))
      : Math.ceil(weekly / 2);

    return { muscle, weekly, perSession: Math.min(perSession, 8), isPrimary: priority === 'primary' };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIAGE DES EXERCICES
// Classe et filtre la liste par priorité avant de l'envoyer à l'IA
// ─────────────────────────────────────────────────────────────────────────────
function triageExercises({ muscle, userEquipment, objectives, level, isPrimary, fragileZones, preferred, disliked }) {
  const objType = objectives.find(o => o.priority === 'primary')?.type || 'hypertrophy';

  // 1. Récupérer tous les exercices disponibles pour ce muscle
  let exercises = getExercisesForMuscle(muscle, userEquipment, { objectives: [objType], level });

  // 2. Retirer les exercices détestés
  exercises = exercises.filter(ex => !disliked.some(d => ex.name.toLowerCase().includes(d.toLowerCase())));

  // 3. Filtrage zones fragiles — exclure les composés lourds sur zones sensibles
  const fragileImpacted = fragileZones.flatMap(z => FRAGILE_ZONE_IMPACTS[z] || []);
  const muscleIsFragile = fragileImpacted.includes(muscle);

  const zones      = normalizeFragileZones(fragileZones);
  const zoneGoal   = zones.find(z => (FRAGILE_ZONE_IMPACTS[z.key] || []).includes(muscle))?.goal;

  if (zoneGoal === 'protect') {
    // Protéger → supprimer tous les poids libres (barre, haltères, kettlebells), garder machines et câbles uniquement
    const FREE_WEIGHTS = ['Barre olympique', 'Barre EZ', 'Barre trap/hex', 'Haltères', 'Kettlebells', 'Smith machine'];
    exercises = exercises.filter(ex =>
      !ex.equipmentOptions.every(opt => opt.some(eq => FREE_WEIGHTS.includes(eq)))
    );
  } else if (zoneGoal === 'strengthen') {
    // Renforcer → prioriser les exercices ciblés de ce muscle, progression conservative
    exercises = exercises.map(ex => ({ ...ex, score: (ex.score || 0) + 25, note: 'prioritaire — renforcement zone' }));
  }

  // 4. Priorité selon rôle du muscle dans le programme
  const blockPriority = isPrimary
    ? ['A', 'B', 'C']   // muscle principal → composés d'abord
    : ['B', 'C', 'A'];  // muscle secondaire → accessoires d'abord, pas de composés lourds

  // 5. Score de pertinence pour classement
  const scored = exercises.map(ex => {
    let score = 0;
    // Bloc préféré selon priorité
    score += (3 - blockPriority.indexOf(ex.block)) * 10;
    // Exercice aimé → boost
    if (preferred.some(p => ex.name.toLowerCase().includes(p.toLowerCase()))) score += 20;
    // Objectif force → favoriser composés
    if (objType === 'strength' && ex.type === 'compound') score += 15;
    // Objectif endurance → favoriser machines + câbles (plus sûr en hautes reps)
    if (objType === 'endurance' && ex.failureAllowed) score += 8;
    // Niveau débutant → machines en priorité (plus sécurisées)
    if (level === 'beginner' && ex.equipmentOptions.some(o => o.length === 1 && o[0].includes('machine'))) score += 10;
    return { ...ex, score };
  });

  // 6. Trier par score décroissant
  scored.sort((a, b) => b.score - a.score);

  // 7. Retourner les meilleurs par bloc (max 2 par bloc)
  const result = { A: [], B: [], C: [] };
  scored.forEach(ex => {
    const b = ex.block;
    if (result[b].length < 2) result[b].push(ex);
  });

  return {
    muscle,
    isPrimary,
    isFragile: muscleIsFragile,
    blockA: result.A,
    blockB: result.B,
    blockC: result.C,
    all: [...result.A, ...result.B, ...result.C],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ZONES FRAGILES — muscles à adapter
// ─────────────────────────────────────────────────────────────────────────────
function getFragileAdaptations(rawZones = []) {
  const zones = normalizeFragileZones(rawZones);
  const protect    = zones.filter(z => z.goal === 'protect');
  const strengthen = zones.filter(z => z.goal === 'strengthen');
  // goal: 'info' → noté uniquement, aucune adaptation programme, visible par le Coach IA

  const protectedMuscles  = new Set(protect.flatMap(z => FRAGILE_ZONE_IMPACTS[z.key] || []));
  const strengthenMuscles = new Set(strengthen.flatMap(z => FRAGILE_ZONE_IMPACTS[z.key] || []));

  const rules = [
    ...protect.map(z => {
      const muscles = FRAGILE_ZONE_IMPACTS[z.key] || [];
      return `${z.key} (protéger) → éviter exercices qui chargent directement cette zone en amplitude extrême sur ${muscles.join(', ')} · préférer machines et câbles pour les exercices isolés ciblant ces muscles · jamais à l'échec · les composés multi-articulaires qui ne surchargent pas directement la zone restent autorisés`;
    }),
    ...strengthen.map(z => {
      const muscles = FRAGILE_ZONE_IMPACTS[z.key] || [];
      return `${z.key} (renforcer) → prioriser exercices de renforcement ciblé sur ${muscles.join(', ')} · progression conservative · qualité d'exécution prioritaire`;
    }),
  ];

  return {
    protectedMuscles:  [...protectedMuscles],
    strengthenMuscles: [...strengthenMuscles],
    impactedMuscles:   [...new Set([...protectedMuscles, ...strengthenMuscles])],
    rules,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SEMAINE DE PEAKING — uniquement pour l'objectif force
// Ciblée sur les muscles/mouvement de l'objectif force uniquement
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {Array<{type: string, zone: string, focus_movement?: string, focus_group?: any, priority: string}>} objectives
 * @param {string} level
 */
/**
 * @param {boolean} enabled
 */
function buildPeakingWeek(objectives, level, enabled) {
  if (!enabled) return null;
  const strengthObj = objectives.find(o => o.type === 'strength');
  if (!strengthObj) return null;

  // Cible : mouvement spécifique ou zone musculaire de l'objectif force
  let targetMuscles = /** @type {string[]} */ ([]);
  let targetMovement = /** @type {string|null} */ (null);
  let targetDescription = '';

  if (strengthObj.focus_movement && (Array.isArray(strengthObj.focus_movement) ? strengthObj.focus_movement.length > 0 : true)) {
    // Multi-select : focus sur les mouvements eux-mêmes (l'IA priorise ces exercices),
    // pas un mapping muscle. La progression cible directement la barre.
    const movements = Array.isArray(strengthObj.focus_movement)
      ? strengthObj.focus_movement
      : [strengthObj.focus_movement];
    targetMovement = movements.join(' + ');
    targetDescription = `mouvement(s) : ${movements.join(', ')}`;
    targetMuscles = []; // pas de mapping — l'objectif est de progresser sur le mouvement directement
  } else {
    const zoneMap = /** @type {Record<string, string[]>} */ (ZONE_MUSCLES);
    targetMuscles = zoneMap[strengthObj.zone] || ZONE_MUSCLES.full_body;
    targetDescription = `zone : ${strengthObj.zone}`;
  }

  // Protocole de peaking selon le niveau
  const protocols = /** @type {Record<string, {week1: string, testDay: string}>} */ ({
    beginner:     { week1: '80–85% × 3 reps × 3 séries', testDay: '87% → 92% → tentative 1RM' },
    intermediate: { week1: '85–90% × 2–3 reps × 3 séries', testDay: '90% → 95% → 100%+ tentative 1RM' },
    advanced:     { week1: '88–92% × 1–2 reps × 3 séries', testDay: '93% → 97% → 102% tentative 1RM' },
  });
  const protocol = protocols[level] || protocols.intermediate;

  return {
    targetDescription,
    targetMuscles,
    targetMovement,
    volumeReduction: 0.4,     // −60% du volume habituel sur muscles ciblés
    intensityRange:  '85–102% 1RM',
    singlesMax:      3,
    protocol,
    rules: [
      `Peaking : test 1RM sur ${targetDescription}`,
      'TOUS les objectifs (hypertrophie, endurance, force) sont en deload : volume RÉDUIT de 50% partout — la fatigue accumulée par n\'importe quel entraînement empêche d\'exprimer le max au test 1RM',
      'Force : intensité MAINTENUE haute (85-102% 1RM) mais volume coupé à -60% — garder uniquement les composés principaux',
      'Hypertrophie/Endurance : volume coupé à -50%, intensité légère (RIR 3+, charges modérées) — maintenir le pattern sans accumuler de fatigue',
      'Pas d\'échec nulle part — qualité d\'exécution maximale',
      'Repos entre singles force : 5–8 min minimum',
      'Annuler la tentative si technique défaillante — ne pas grinder',
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAMÈTRES D'ENTRAÎNEMENT PAR BLOC
// A = composés lourds, B = accessoires, C = isolation
// ─────────────────────────────────────────────────────────────────────────────
function buildTrainingBlocks(objectives, phase, accepts_advanced_techniques, level = 'intermediate') {
  const primary = objectives.find(o => o.priority === 'primary');
  const type    = primary?.type || 'hypertrophy';
  const params  = TRAINING_PARAMS[type]?.[phase] || TRAINING_PARAMS.hypertrophy.MAV;

  // Repos par bloc — différencié selon le nombre de muscles impliqués
  // Force : repos fixes (récupération SNC complète obligatoire)
  // Hypertrophie : composés → 2min30-3min, accessoires → 90-120s, isolation → 60-90s
  // Endurance : repos courts volontaires pour maintenir la fatigue métabolique
  const REST = {
    strength:    { A: params.rest,   B: Math.round(params.rest * 0.75), C: Math.round(params.rest * 0.5) },
    hypertrophy: { A: 150,           B: 120,                            C: 90 },
    endurance:   { A: params.rest,   B: Math.round(params.rest * 0.8),  C: Math.round(params.rest * 0.6) },
  };
  const restByBlock = REST[type] || REST.hypertrophy;

  return {
    A: {
      sets: params.sets[1],
      reps: type === 'strength' ? '3–5 (composés lourds, neural)' : type === 'hypertrophy' ? '6–10 (adapter selon exercice : composé lourd → bas de fourchette, composé modéré → haut)' : '12–15 (composés tempo)',
      rir:  params.rir + 1,
      rest: restByBlock.A,
      note: type === 'strength'
        ? 'Composés principaux uniquement — qualité d\'exécution maximale. JAMAIS à l\'échec sur squat barre, deadlift, bench barre, OHP barre.'
        : type === 'hypertrophy'
          ? `Composés prioritaires — RIR = POINT DE DÉPART semaine 1, ajuster selon plan de phases. JAMAIS à l\'échec sur squat barre, deadlift, bench barre, OHP barre.${level !== 'beginner' ? ' Tu peux inclure 1 composé lourd (4–6 reps) par séance si ça sert un objectif de force secondaire.' : ''}`
          : 'Composés en tempo contrôlé (2-0-2). RIR = POINT DE DÉPART semaine 1.',
    },
    B: {
      sets: params.sets[0],
      reps: type === 'strength' ? '5–8' : type === 'hypertrophy' ? '8–15 (adapter selon exercice : composé → 8–10, isolation → 12–15)' : '12–20',
      rir:  params.rir,
      rest: restByBlock.B,
      note: 'RIR = POINT DE DÉPART semaine 1. Réduire RIR progressivement selon plan de phases. Échec dernière série (haltères, câbles uniquement).',
    },
    C: {
      sets: Math.max(2, params.sets[0] - 1),
      reps: type === 'strength' ? '8–12' : type === 'hypertrophy' ? '12–20 (isolation → haut de fourchette préférable, moins de stress articulaire)' : '15–30',
      rir:  Math.max(0, params.rir - 1),
      rest: restByBlock.C,
      note: accepts_advanced_techniques ? 'Dropsets / rest-pause autorisés en dernière série. RIR selon plan de phases.' : 'Échec autorisé en dernière série. RIR selon plan de phases.',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN DE PHASES PAR SEMAINE (MEV → MAV → MRV → Décharge)
// Source : Israetel RP — period_001, rp_002, rp_003
// ─────────────────────────────────────────────────────────────────────────────
function buildWeeklyPhasePlan(totalWeeks, level) {
  // Débutants : progression linéaire pure, pas de mésocycle ni de décharge planifiée
  // Source : period_004 (KB) — les débutants n'ont pas besoin de mésocycles
  if (level === 'beginner') {
    return Array.from({ length: totalWeeks }, (_, i) => ({
      week: i + 1,
      phase: 'MEV',
      rir: 3,
      volumeInstruction: `Semaine ${i + 1} — Volume constant, RIR 3. Progression charge à chaque séance. Pas de décharge planifiée — uniquement sur signaux (fatigue ≥4/5, RIR drift).`,
    }));
  }

  // Pas de décharge automatique — auto-régulée sur signaux est supérieure (deload_002)
  // Exception unique validée : force ≥ 7 semaines → décharge préventive tendineuse (deload_003)
  // Le LLM intègre cette règle via les références scientifiques injectées dans le prompt
  const trainingWeeks = totalWeeks;

  // Répartition MEV/MAV/MRV — source : period_001, rp_003
  const mevCount = Math.max(1, Math.round(trainingWeeks * 0.25));
  const mrvCount = trainingWeeks >= 4 ? Math.max(1, Math.round(trainingWeeks * 0.25)) : 0;
  const mavCount = trainingWeeks - mevCount - mrvCount;

  const plan = [];
  for (let i = 0; i < totalWeeks; i++) {
    const w = i + 1;
    if (i < mevCount) {
      plan.push({ week: w, phase: 'MEV', rir: 3, volumeInstruction: `Semaine ${w} — MEV : volume plancher, RIR 3. Construire les patterns moteurs.` });
    } else if (i < mevCount + mavCount) {
      plan.push({ week: w, phase: 'MAV', rir: 2, volumeInstruction: `Semaine ${w} — MAV : +1 série/muscle vs semaine précédente. RIR 2. Volume optimal.` });
    } else {
      plan.push({ week: w, phase: 'MRV', rir: 1, volumeInstruction: `Semaine ${w} — MRV : +1 série/muscle vs semaine précédente. RIR 1. Intensité maximale.` });
    }
  }
  return plan;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESSION RECOMMANDÉE
// ─────────────────────────────────────────────────────────────────────────────
function buildProgressionRules(level, objectives) {
  const primary = objectives.find(o => o.priority === 'primary');
  const type    = primary?.type || 'hypertrophy';

  const frequency = {
    beginner:     'chaque séance',
    intermediate: 'chaque semaine',
    advanced:     'toutes les 2–4 semaines',
  }[level] || 'chaque semaine';

  const densityFloor = type === 'strength'
    ? '120s pour composés lourds, 60s pour accessoires'
    : type === 'endurance'
      ? '30s (levier primaire pour endurance)'
      : '60s';

  return {
    double_progression: `MÉCANISME PRINCIPAL : double progression. Progresser en REPS d'abord jusqu'au HAUT de la fourchette définie par le bloc (RIR cible maintenu sur toutes les séries). Quand le haut est atteint → +2,5 kg ET retour au bas de la fourchette. Ne jamais augmenter charge ET reps simultanément. Les fourchettes sont libres selon l'exercice et le bloc : l'hypertrophie se produit sur toute plage 5–30 reps à effort équivalent (Schoenfeld 2017)`,
    load: `Fréquence de progression charge (${frequency}) — déclencheur : haut de fourchette atteint sur TOUTES les séries au RIR cible`,
    volume: `Si charge maintenue sur plusieurs semaines → augmenter d'1 série par groupe/semaine jusqu'au MRV`,
    density: `Si volume au MRV ET charge bloquée → réduire le repos de 10–15s/semaine (plancher : ${densityFloor}). En endurance : levier de progression primaire dès le départ`,
    rule: 'Hiérarchie : Reps dans fourchette → Charge → Volume → Densité → Variation. Ne jamais progresser sur deux leviers simultanément',
    bodyweight: 'Poids du corps : reps → tempo → ROM → unilatéral → lestage (dans cet ordre)',
    deload: `Décharge auto-régulée sur signaux (drift RIR, fatigue ≥4/5, stagnation) : −40% volume, charges identiques. En force uniquement : décharge préventive tendineuse après 7 semaines même sans signaux`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER PRINCIPAL — retourne le brief complet pour l'IA
// ─────────────────────────────────────────────────────────────────────────────
export function buildProgramContext(user, objectives = []) {
  const level    = user.level || 'intermediate';
  const equipment = user.equipment || [];
  const phase     = 'MEV';
  const primary   = objectives.find(o => o.priority === 'primary');
  const objType   = primary?.type || 'hypertrophy';

  const optimal   = user.availability_optimal === true;
  const rawDays   = user.available_days || [];

  // Quand disponibilités optimales : dériver la fréquence depuis les données scientifiques
  // Sources : freq_opt_001 (KB), rp_007 (RP), split_001 (full body débutant)
  // Fréquence optimale par niveau × objectif (Israetel RP, Colquhoun 2018, Ralston 2017)
  const OPTIMAL_FREQ = {
    beginner:     { hypertrophy: 3, strength: 3, endurance: 4 }, // neural adaptation → fréquence modérée
    intermediate: { hypertrophy: 4, strength: 4, endurance: 5 }, // upper/lower ou PPL optimal
    advanced:     { hypertrophy: 5, strength: 5, endurance: 5 }, // volume élevé → répartition nécessaire
  };
  // Durée par séance selon niveau — basée sur volume MEV × durée série (SET_DURATION_BY_LEVEL)
  const OPTIMAL_DURATION = {
    beginner: 45, intermediate: 60, advanced: 75,
  };
  // Jours-gabarits selon fréquence (pour le calcul du brief uniquement — le LLM choisit les vrais jours)
  const WEEK_TEMPLATES = ['monday','tuesday','wednesday','thursday','friday','saturday'];
  const optimalFreq = OPTIMAL_FREQ[level]?.[objType] || 4;
  // Sélectionner les N premiers jours du gabarit avec espacement (ex: 3j → lun/mer/ven)
  const getSpacedDays = (n) => {
    if (n >= 6) return WEEK_TEMPLATES;
    const step = Math.floor(6 / n);
    return Array.from({ length: n }, (_, i) => WEEK_TEMPLATES[Math.min(i * step, 5)]);
  };

  const days = optimal && rawDays.length === 0 ? getSpacedDays(optimalFreq) : rawDays;

  const defaultDuration = optimal && rawDays.length === 0 ? OPTIMAL_DURATION[level] || 60 : null;

  const durations = days.reduce((acc, d) => {
    acc[d] = (user.duration_per_day || {})[d] || defaultDuration || 60;
    return acc;
  }, {});

  // Sélection intelligente des jours — préfère les jours avec assez de temps
  const { trainingDays, shortDays } = selectTrainingDays(days, durations, user.frequency_max, level);
  // Avertissement si moins de jours disponibles que le minimum souhaité
  const freqMinWarning = user.frequency_min && trainingDays.length < user.frequency_min
    ? `⚠️ Seulement ${trainingDays.length} séances disponibles alors que le minimum souhaité est ${user.frequency_min}.`
    : null;
  const activeDays = trainingDays.length > 0 ? trainingDays : days;

  // Structure — prend en compte durée des sessions + objectifs + niveau
  const { structure, needsSupersets, supersetPairs } = selectStructure(activeDays, durations, objectives, level);
  const plannedWeeks   = PLANNED_WEEKS[level] || 8;
  const weeklyPhasePlan = buildWeeklyPhasePlan(plannedWeeks, level);
  const volumeRange    = getVolumeRange(level, phase);
  const blocks         = buildTrainingBlocks(objectives, phase, user.accepts_advanced_techniques, level);
  const progression    = buildProgressionRules(level, objectives);
  const peakingWeek    = buildPeakingWeek(objectives, level, user.peaking_enabled === true);
  const { impactedMuscles, rules: fragileRules } = getFragileAdaptations(user.fragile_zones);

  // Volume par séance pour chaque jour actif
  const sessionVolumes = activeDays.reduce((acc, day) => {
    const duration = parseInt(durations[day]) || 60;
    acc[day] = {
      duration,
      maxSets: calcSessionVolume(duration, objType, level),
      exercises: Math.floor(calcSessionVolume(duration, objType, level) / 4),
    };
    return acc;
  }, {});

  // Muscles volontairement exclus du volume direct
  const noVolumeMuscles = (() => {
    try { return JSON.parse(user.no_volume_muscles || '[]'); } catch { return []; }
  })();

  // Volume overrides (mode précis)
  const volumeMode      = user.volume_mode || 'auto';
  const volumeOverrides = (() => {
    try { return JSON.parse(user.volume_overrides || '{}'); } catch { return {}; }
  })();

  // Allocation musculaire — mode auto (VOLUME_TABLES) ou précis (overrides utilisateur)
  let rawAllocation;
  if (volumeMode === 'manual' && Object.keys(volumeOverrides).length > 0) {
    const objTable = VOLUME_TABLES[objType] || VOLUME_TABLES.hypertrophy;
    const primaryMuscles = primary?.zone === 'specific_group'
      ? (Array.isArray(primary.focus_group) ? primary.focus_group : [])
      : ZONE_MUSCLES[primary?.zone] || ZONE_MUSCLES.full_body;
    rawAllocation = Object.entries(volumeOverrides)
      .filter(([muscle, weekly]) => !noVolumeMuscles.includes(muscle) && weekly > 0)
      .map(([muscle, weekly]) => {
        const size = LARGE_MUSCLES.has(muscle) ? 'large' : 'small';
        const mev  = objTable[size]?.[level]?.MEV || 0;
        return { muscle, weekly, mev, isPrimary: primaryMuscles.includes(muscle) };
      });
  } else {
    rawAllocation = allocateVolumeByMuscle(objectives, 0, level, phase, structure)
      .filter(item => !noVolumeMuscles.includes(item.muscle));
  }

  // ── Correction déterministe selon disponibilités réelles ─────────────────────
  // Principe : on compare le total de séries réalisables (durée × jours) au total idéal.
  // Si insuffisant, on scale down proportionnellement, puis on retire les muscles
  // qui ne peuvent pas atteindre 50% du MEV (progression impossible).
  const objTable          = VOLUME_TABLES[objType] || VOLUME_TABLES.hypertrophy;
  const totalAchievable   = activeDays.reduce((sum, day) => sum + (sessionVolumes[day]?.maxSets || 0), 0);
  const totalIdeal        = rawAllocation.reduce((sum, m) => sum + m.weekly, 0);
  const scaleFactor       = totalIdeal > 0 ? Math.min(1, totalAchievable / totalIdeal) : 1;

  const removedMuscles = [];
  const cappedMuscles  = [];

  const muscleAllocation = rawAllocation
    .map(item => {
      const size         = LARGE_MUSCLES.has(item.muscle) ? 'large' : 'small';
      const mev          = objTable[size]?.[level]?.MEV || 0;
      const mrv          = objTable[size]?.[level]?.MRV || 0;
      const scaledWeekly = Math.max(1, Math.round(item.weekly * scaleFactor));
      return { ...item, weekly: scaledWeekly, mev, mrv };
    })
    .filter(item => {
      // Seuil de suppression contextuel — dépend de l'objectif
      // Maintenance : 1 série/sem suffit → seuil bas (25% MEV)
      // Hypertrophie/Force : sous 50% MEV = progression impossible
      // Endurance : plus tolérant aux volumes faibles (adaptations métaboliques partielles)
      const removalThreshold = objType === 'endurance' ? 0.35 : objType === 'hypertrophy' ? 0.5 : 0.4;
      if (item.weekly < item.mev * removalThreshold) {
        removedMuscles.push({ muscle: item.muscle, weekly: item.weekly, mev: item.mev });
        return false;
      }
      if (item.weekly < item.mev) {
        cappedMuscles.push({ muscle: item.muscle, weekly: item.weekly, mev: item.mev, gap: item.mev - item.weekly });
      }
      return true;
    })
    .map(item => {
      const perSession = structure === 'full_body'
        ? Math.ceil(item.weekly / Math.max(1, activeDays.length))
        : Math.ceil(item.weekly / 2);
      return { ...item, perSession: Math.min(perSession, 8) };
    });

  const availabilityConstraints = {
    isConstrained: scaleFactor < 1,
    scalePct:      Math.round(scaleFactor * 100),
    removedMuscles,
    cappedMuscles,
  };

  // Techniques avancées par jour selon durée + préférences
  const techniquesByDay = days.reduce((acc, day) => {
    const duration = parseInt(durations[day]) || 60;
    acc[day] = computeSessionTechniques({
      durationMinutes:  duration,
      acceptsAdvanced:  user.accepts_advanced_techniques || false,
      objective:        objType,
    });
    return acc;
  }, {});

  // Triage complet des exercices — utilise l'allocation corrigée, pas l'idéale
  const availableExercisesByMuscle = muscleAllocation.reduce((acc, { muscle, isPrimary }) => {
    acc[muscle] = triageExercises({
      muscle,
      userEquipment: equipment,
      objectives,
      level,
      isPrimary,
      fragileZones: user.fragile_zones || [],
      preferred: user.preferred_exercises || [],
      disliked:  user.disliked_exercises  || [],
    });
    return acc;
  }, {});

  return {
    // Métadonnées programme
    structure,
    phase,
    plannedWeeks,
    weeklyPhasePlan,
    weeklyVolumeTarget: volumeRange.current,
    weeklyVolumeMax: volumeRange.mrv,

    // Profil
    level,
    age:    user.age,
    weight: user.weight,
    height: user.height,

    // Disponibilités
    availableDays: activeDays,
    shortDays,
    sessionVolumes,
    frequencyMin: user.frequency_min || null,
    frequencyMax: user.frequency_max || null,
    availabilityOptimal: optimal,
    freqMinWarning,

    // Objectifs
    primaryObjective:   primary ? `${primary.type} — ${primary.zone}${primary.focus_group ? ` (${Array.isArray(primary.focus_group) ? primary.focus_group.join(', ') : primary.focus_group})` : ''}${primary.focus_muscles?.length ? ` [chefs ciblés : ${primary.focus_muscles.join(', ')}]` : ''}` : null,
    secondaryObjective: objectives.find(o => o.priority === 'secondary') || null,
    focusMovement:      primary?.focus_movement || null,

    // Paramètres d'entraînement
    blocks,
    progression,
    peakingWeek,
    needsSupersets,
    supersetPairs,

    // Volume par muscle
    muscleAllocation,

    // Équipement
    equipment,
    hasBarbell:   equipment.includes('Barre olympique'),
    hasCables:    equipment.some(e => e.includes('câble') || e.includes('Câble') || e.includes('poulie')),
    hasMachines:  equipment.some(e => e.includes('machine') || e.includes('Machine')),
    isBodyweight: equipment.length === 0 || (user.training_context === 'bodyweight'),

    // Préférences
    preferredExercises: user.preferred_exercises || [],
    dislikedExercises:  user.disliked_exercises  || [],
    prefIntensity:      user.pref_intensity || 2,
    prefVolume:         user.pref_volume    || 2,
    prefFrequency:      user.pref_frequency || 2,
    acceptsAdvanced:    user.accepts_advanced_techniques || false,

    // Zones fragiles
    fragileZones:      user.fragile_zones || [],
    fragileRules,
    impactedMuscles,

    // Exercices disponibles (pré-filtrés par équipement)
    availableExercisesByMuscle,

    // Techniques avancées par jour
    techniquesByDay,

    // Muscles exclus du volume direct (choix utilisateur)
    noVolumeMuscles,

    // Contraintes disponibilités — appliquées automatiquement (allocation déjà corrigée)
    availabilityConstraints,

    // Règles absolues (non négociables)
    hardRules: [
      ...(user.availability_optimal ? ['DISPONIBILITÉS OPTIMALES — l\'utilisateur est flexible : optimise les jours, l\'ordre des séances et la répartition du volume pour un programme idéal. Ne te contrains pas aux jours exacts si un meilleur agencement existe.'] : []),
      ...(noVolumeMuscles.length > 0 ? [`Aucun exercice DIRECT sur : ${noVolumeMuscles.join(', ')} — stimulus indirect via composés uniquement, aucune série isolée`] : []),
      // Ordre intra-séance selon combinaison d'objectifs
      ...(objectives.map(o => o.type).includes('strength') && objectives.map(o => o.type).includes('hypertrophy')
        ? ['ORDRE INTRA-SÉANCE : composés force (bloc A) → accessoires hypertrophie (bloc B/C). La fatigue hypertrophique dégrade la qualité des composés lourds — jamais l\'inverse']
        : []),
      ...(objectives.map(o => o.type).includes('hypertrophy') && objectives.map(o => o.type).includes('endurance')
        ? ['ORDRE INTRA-SÉANCE : hypertrophie (charges modérées, repos 2-3 min) → endurance musculaire (hautes reps, repos courts). L\'acidose des séries d\'endurance bloque le recrutement des UM rapides nécessaires à l\'hypertrophie']
        : []),
      ...(objectives.map(o => o.type).includes('strength') && objectives.map(o => o.type).includes('endurance')
        ? ['ORDRE INTRA-SÉANCE : force → endurance musculaire. Sur mêmes muscles : privilégier des jours séparés — la fatigue métabolique de l\'endurance compromet les adaptations neurales de la force']
        : []),
      'Jamais à l\'échec sur : squat barre, deadlift, bench barre, OHP barre',
      'Maximum 3 composés lourds (bloc A) par séance — au-delà la fatigue SNC compromet la qualité d\'exécution',
      'Minimum 48h entre deux séances du même groupe musculaire en hypertrophie',
      'Minimum 72h entre deux séances à >80% 1RM sur le MÊME mouvement (squat lourd→squat lourd, bench lourd→bench lourd) — les accessoires légers peuvent reprendre à 48h',
      'Charge OU volume — jamais les deux en même semaine',
      `Respecter la durée max par séance : ${Object.entries(durations).map(([d, v]) => `${d} ${v}min`).join(', ')}`,
      ...fragileRules,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMATEUR — transforme le context en texte injecté dans le prompt LLM
// ─────────────────────────────────────────────────────────────────────────────
export function formatProgramBrief(ctx) {
  if (!ctx) return '';

  const sessionLines = Object.entries(ctx.sessionVolumes)
    .map(([day, v]) => `  ${day}: ${v.duration}min → max ${v.maxSets} séries (≈${v.exercises} exercices)`)
    .join('\n');

  const muscleLines = ctx.muscleAllocation
    .map(m => {
      const cap = m.weekly < m.mev ? ` ⚠️ sous MEV (${m.mev})` : '';
      const mrv = m.mrv ? ` — MRV ${m.mrv}/sem` : '';
      return `  ${m.muscle}: cible ${m.weekly}/sem (MEV ${m.mev}${mrv})${cap} — ${m.isPrimary ? 'PRIORITAIRE' : 'secondaire'}`;
    })
    .join('\n');

  const blockLines = Object.entries(ctx.blocks)
    .map(([b, p]) => `  Bloc ${b}: ${p.sets} séries × ${p.reps} reps — RIR ${p.rir} — repos ${p.rest}s — ${p.note}`)
    .join('\n');

  const pairsStr = (ctx.supersetPairs || []).map(p => p.join(' + ')).join(' · ');
  const supersetLine = ctx.needsSupersets
    ? 'SUPERSETS OBLIGATOIRES (sessions trop courtes sans) : ' + pairsStr + ' — alterner A/B sans repos entre, 45–60s après chaque paire'
    : pairsStr
    ? 'SUPERSETS RECOMMANDÉS (gain temps ~35–40%) : ' + pairsStr
    : '';

  return `
BRIEF PROGRAMME (référence scientifique — adapter si le profil le justifie) :

STRUCTURE : ${SPLIT_DESCRIPTIONS[ctx.structure]?.label || ctx.structure.toUpperCase()} — ${ctx.plannedWeeks} semaines — Phase ${ctx.phase}
ORGANISATION DES SÉANCES : ${SPLIT_DESCRIPTIONS[ctx.structure]?.sessions || ''}
${supersetLine}
NIVEAU : ${ctx.level} | ${ctx.age || '?'} ans | ${ctx.weight || '?'} kg

OBJECTIF PRINCIPAL : ${ctx.primaryObjective || 'non défini'}
${ctx.secondaryObjective ? `OBJECTIF SECONDAIRE : ${ctx.secondaryObjective.type} — ${ctx.secondaryObjective.zone}` : ''}
${ctx.focusMovement ? `MOUVEMENT FOCUS : ${ctx.focusMovement}` : ''}

VOLUME HEBDOMADAIRE CIBLE : ${ctx.weeklyVolumeTarget} séries/muscle (MRV : ${ctx.weeklyVolumeMax})

PLAN DE PHASES RECOMMANDÉ (±1 série / ±2 reps si le profil le justifie) :
${(ctx.weeklyPhasePlan || []).map(w => `  ${w.volumeInstruction}`).join('\n')}

${ctx.availabilityOptimal
  ? `DISPONIBILITÉS : Entièrement flexible — l'utilisateur n'a aucune contrainte d'horaire. Tu choisis toi-même les jours d'entraînement, la durée de chaque séance et la structure du programme. Base-toi uniquement sur les objectifs, le niveau et le matériel disponible pour définir le planning optimal.`
  : `FRÉQUENCE HEBDOMADAIRE : ${ctx.frequencyMin ? `min ${ctx.frequencyMin}×` : ''} ${ctx.frequencyMax ? `max ${ctx.frequencyMax}×` : ''} — générer exactement ${ctx.availableDays.length} séances/semaine${ctx.frequencyMin ? `, jamais moins de ${ctx.frequencyMin}` : ''}

SÉANCES DISPONIBLES :
${sessionLines}
${ctx.shortDays?.length ? `JOURS EXCLUS (durée trop courte vs autres jours) : ${ctx.shortDays.join(', ')}` : ''}
${ctx.freqMinWarning ? ctx.freqMinWarning : ''}`}

${ctx.availabilityConstraints?.isConstrained ? `
CONTRAINTES DE DISPONIBILITÉS (corrections automatiques appliquées — ${ctx.availabilityConstraints.scalePct}% du volume idéal atteignable) :
${ctx.availabilityConstraints.removedMuscles.length ? `  Muscles EXCLUS — volume < 50% MEV, progression impossible avec ces disponibilités :
${ctx.availabilityConstraints.removedMuscles.map(m => `    ✕ ${m.muscle} (${m.weekly} séries calculées vs MEV ${m.mev})`).join('\n')}` : ''}
${ctx.availabilityConstraints.cappedMuscles.length ? `  Muscles PLAFONNÉS — sous MEV, progression lente :
${ctx.availabilityConstraints.cappedMuscles.map(m => `    △ ${m.muscle} (${m.weekly}/${m.mev} séries, manque ${m.gap})`).join('\n')}` : ''}
  NE PAS ajouter de muscles exclus dans le programme — les disponibilités ne permettent pas de les entraîner efficacement.
  Pour débloquer : augmenter la durée de séance ou ajouter des jours.
` : ''}
${ctx.noVolumeMuscles?.length ? `MUSCLES EXCLUS DU VOLUME DIRECT : ${ctx.noVolumeMuscles.join(', ')}
  → Aucun exercice isolé ni accessoire direct — ces muscles reçoivent uniquement le stimulus indirect des composés.
` : ''}VOLUME PAR MUSCLE :
${muscleLines}

PARAMÈTRES PAR BLOC :
${blockLines}

PROGRESSION :
  ${ctx.progression.rule}
  Mécanisme : ${ctx.progression.double_progression}
  Charge    : ${ctx.progression.load}
  Volume    : ${ctx.progression.volume}
  Densité   : ${ctx.progression.density}
  Poids corps : ${ctx.progression.bodyweight}
  Décharge  : ${ctx.progression.deload}
${ctx.peakingWeek ? `
SEMAINE DE PEAKING (dernière semaine du cycle — force uniquement) :
  Cible : ${ctx.peakingWeek.targetDescription}
  Muscles concernés : ${ctx.peakingWeek.targetMuscles.join(', ')}
  Volume sur muscles cibles : −60% (composés principaux uniquement)
  Semaine peaking : ${ctx.peakingWeek.protocol.week1}
  Jour test 1RM : ${ctx.peakingWeek.protocol.testDay}
  Repos entre singles : 5–8 min
  Règles peaking :
${ctx.peakingWeek.rules.map((/** @type {string} */ r) => '    ⚠️ ' + r).join('\n')}` : ''}

ÉQUIPEMENT : ${ctx.equipment.join(', ') || 'aucun (poids du corps)'}
${ctx.fragileZones.length ? `\nZONES FRAGILES : ${ctx.fragileZones.join(', ')}\nADAPTATIONS REQUISES :\n${ctx.fragileRules.map(r => '  ' + r).join('\n')}` : ''}

PRÉFÉRENCES : exercices aimés : ${ctx.preferredExercises.join(', ') || 'aucun'} | à éviter : ${ctx.dislikedExercises.join(', ') || 'aucun'}
${ctx.acceptsAdvanced ? 'Techniques avancées autorisées : rest-pause, dropsets, excentriques lents' : ''}

${Object.entries(ctx.techniquesByDay || {}).some(([, t]) => t.notes?.length > 0) ? `
TECHNIQUES PAR SÉANCE :
${Object.entries(ctx.techniquesByDay || {}).map(([day, t]) => {
  if (!t.notes?.length) return null;
  const flags = [
    t.supersets && t.superset_pairs.length > 0 ? `supersets (${t.superset_pairs.map(p => p.join('+')). join(', ')})` : t.supersets ? 'supersets antagonistes' : null,
    t.restPause    ? 'rest-pause' : null,
    t.dropsets     ? 'dropsets' : null,
    t.slowEccentric ? 'excentrique lent' : null,
  ].filter(Boolean).join(', ');
  return `  ${day}: ${flags}`;
}).filter(Boolean).join('\n')}
${[...new Set(Object.values(ctx.techniquesByDay || {}).flatMap(t => t.notes))].map(n => '  → ' + n).join('\n')}
` : ''}
EXERCICES TRIÉS PAR MUSCLE (utiliser UNIQUEMENT ces exercices, dans l'ordre de priorité indiqué) :
${Object.entries(ctx.availableExercisesByMuscle || {}).map(([muscle, triage]) => {
  if (!triage || triage.all?.length === 0) return `  ${muscle}: aucun exercice disponible`;
  const role = triage.isPrimary ? 'PRIORITAIRE' : 'secondaire';
  const fragile = triage.isFragile ? ' ⚠️ zone fragile — bloc A interdit' : '';
  const a = triage.blockA.map(e => e.name).join(', ') || '—';
  const b = triage.blockB.map(e => e.name).join(', ') || '—';
  const c = triage.blockC.map(e => e.name).join(', ') || '—';
  return `  ${muscle} [${role}]${fragile}\n    Bloc A: ${a}\n    Bloc B: ${b}\n    Bloc C: ${c}`;
}).join('\n')}

RÈGLES ABSOLUES (non négociables) :
${ctx.hardRules.map(r => '  ⛔ ' + r).join('\n')}
`.trim();
}
