/**
 * Calcule le RIR cible optimal pour un exercice donné en tenant compte de :
 * - Phase de progression (MEV / MAV / MRV)
 * - Type de séance (force, hypertrophie, endurance, mixed)
 * - Bloc de l'exercice (A = composés lourds, B = accessoires, C = isolation)
 * - Numéro de série (dernières séries plus intenses)
 * - Numéro de semaine (progression intra-bloc)
 * - Numéro de semaine dans le programme (fatigue accumulée)
 */

export function computeTargetRIR({ phase, sessionType, block, setIndex, totalSets, weekNumber, plannedWeeks }) {
  // Base RIR par phase
  const phaseBase = {
    MEV: 3,   // Accumulation légère — beaucoup de réserve
    MAV: 2,   // Volume maximal — réserve modérée
    MRV: 1,   // Charge maximale — quasi échec
  };

  let rir = phaseBase[phase] ?? 2;

  // Ajustement selon le type de séance
  if (sessionType === 'strength') rir += 1;       // Force : on gère plus de réserve sur les lourds
  if (sessionType === 'endurance') rir += 1;       // Endurance : cardio-musculaire, moins d'intensité
  if (sessionType === 'hypertrophy') rir += 0;     // Hypertrophie : on reste sur la base phase
  if (sessionType === 'mixed') rir += 0;

  // Ajustement selon le bloc (A = composé lourd, B = accessoire, C = isolation)
  const blockUpper = (block || 'B').toString().toUpperCase();
  if (blockUpper === 'A') rir += 1;   // Composés : une série en plus de réserve pour sécurité
  if (blockUpper === 'C') rir -= 1;   // Isolation : on peut aller plus près de l'échec

  // Progression intra-série (dernière série = plus proche de l'échec)
  // Hypertrophie: progression agressive (RIR 0 en dernier)
  // Force: progression modérée (RIR 1-2 en dernier)
  // Endurance: progression légère (RIR 2-3 en dernier)
  if (totalSets > 1) {
    const progressionFactor = sessionType === 'hypertrophy' ? 2.5 : sessionType === 'strength' ? 1.5 : 1;
    const serieProgression = Math.round((setIndex / (totalSets - 1)) * progressionFactor);
    rir -= serieProgression;
  }

  // Progression intra-programme (semaines avancées = plus proche de l'échec)
  if (weekNumber && plannedWeeks && plannedWeeks > 1) {
    const weekRatio = (weekNumber - 1) / (plannedWeeks - 1); // 0 → 1
    rir -= Math.round(weekRatio * 1);
  }

  // Clamp entre 0 (échec) et 4
  rir = Math.max(0, Math.min(4, rir));
  return rir;
}

export function ririLabel(rir) {
  if (rir === 0) return { label: 'Échec', color: 'text-red-400', short: 'RIR 0' };
  if (rir === 1) return { label: '1 rep. en réserve', color: 'text-orange-300', short: 'RIR 1' };
  if (rir === 2) return { label: '2 reps. en réserve', color: 'text-blue-300', short: 'RIR 2' };
  if (rir === 3) return { label: '3 reps. en réserve', color: 'text-emerald-300', short: 'RIR 3' };
  return { label: '4+ reps. en réserve', color: 'text-white/70', short: 'RIR 4+' };
}

export function rirToMode(rir) {
  if (rir === 0) return 'failure';
  if (rir === 1) return 'RIR_1';
  if (rir === 2) return 'RIR_2';
  return 'RIR_3+';
}

// ─────────────────────────────────────────────────────────────────────────────
// REPOS ADAPTATIF
// Ajuste le temps de repos selon le RIR réel, le type d'exercice et le bloc
// ─────────────────────────────────────────────────────────────────────────────
export function computeAdaptedRestTime({ baseRest = 90, mode = 'RIR_2', block = 'B', isBodyweight = false, isIsometric = false }) {
  // Isométrique (planche, gainage...) → toujours 90s fixe (récupération neuromusculaire)
  if (isIsometric) return 90;

  // Poids du corps non isométrique → minimum 60s, pas d'ajustement par RIR
  if (isBodyweight) return Math.max(60, Math.min(baseRest, 120));

  // Ajustement selon RIR réel atteint
  const rirAdjust = {
    failure:  +30, // à l'échec → besoin de plus de récup
    RIR_1:    +15, // quasi échec
    RIR_2:      0, // nominal, pas de changement
    'RIR_3+': -15, // beaucoup en réserve → peut récupérer plus vite
  };
  let rest = baseRest + (rirAdjust[mode] ?? 0);

  // Planchers et plafonds par bloc
  if (block === 'A') rest = Math.max(120, rest); // composés lourds : jamais < 2min
  if (block === 'B') rest = Math.max(60, Math.min(rest, 180));
  if (block === 'C') rest = Math.max(45, Math.min(rest, 120)); // isolation : pas besoin de plus de 2min

  // Arrondir à la dizaine de secondes
  return Math.round(rest / 10) * 10;
}