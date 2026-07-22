// ─────────────────────────────────────────────────────────────────────────────
// COACHING ENGINE — Moteur déterministe (zéro appel API)
// Hiérarchie : Spécificité → Overload → Fatigue → SRA → Variation → Phase → Individuel
// ─────────────────────────────────────────────────────────────────────────────
import { devNow } from './dev-time.js';

// ─── Grands muscles (fatigue systémique élevée, tolèrent plus de volume) ───
export const LARGE_MUSCLES = new Set(['Dos', 'Poitrine', 'Quadriceps', 'Fessiers', 'Épaules']);

// ─── Petits muscles (fatigue locale, récupèrent plus vite mais moins de volume) ───
export const SMALL_MUSCLES = new Set(['Biceps', 'Triceps', 'Mollets', 'Ischio-jambiers', 'Abdominaux', 'Adducteurs', 'Abducteurs']);

// ─── Volume par muscle par semaine (séries) — par objectif × taille × niveau ───
export const VOLUME_TABLES = {
  // Sources : Israetel RP Strength (2019-2024), Kraemer & Ratamess (2004), Rhea et al. (2003)
  // Débutant MEV abaissé à 8/5 (grands/petits) — recherche montre 6-8 séries/sem suffisantes
  // pour des débutants. L'ancien MEV=10 était la limite haute et trop restrictif.
  hypertrophy: {
    large: {
      beginner:     { MEV: 8,  MAV: 12, MRV: 16 },
      intermediate: { MEV: 12, MAV: 18, MRV: 22 },
      advanced:     { MEV: 14, MAV: 20, MRV: 26 },
    },
    small: {
      beginner:     { MEV: 5,  MAV: 8,  MRV: 12 },
      intermediate: { MEV: 8,  MAV: 12, MRV: 16 },
      advanced:     { MEV: 10, MAV: 14, MRV: 20 },
    },
  },
  strength: {
    large: {
      beginner:     { MEV: 6,  MAV: 10, MRV: 14 },
      intermediate: { MEV: 8,  MAV: 12, MRV: 16 },
      advanced:     { MEV: 10, MAV: 14, MRV: 18 },
    },
    small: {
      beginner:     { MEV: 4,  MAV: 6,  MRV: 10 },
      intermediate: { MEV: 6,  MAV: 8,  MRV: 12 },
      advanced:     { MEV: 6,  MAV: 10, MRV: 14 },
    },
  },
  endurance: {
    large: {
      beginner:     { MEV: 12, MAV: 18, MRV: 24 },
      intermediate: { MEV: 14, MAV: 20, MRV: 28 },
      advanced:     { MEV: 16, MAV: 22, MRV: 30 },
    },
    small: {
      beginner:     { MEV: 8,  MAV: 12, MRV: 18 },
      intermediate: { MEV: 10, MAV: 15, MRV: 22 },
      advanced:     { MEV: 12, MAV: 18, MRV: 25 },
    },
  },
};

// ─── Seuils de décharge par niveau ───
// Approche auto-régulée — décharge sur signaux uniquement
// Exception préventive tendineuse : seulement en force (charges >85% 1RM)
// En hypertrophie et endurance, charges trop faibles pour ce niveau de stress tendineux
const DELOAD_THRESHOLDS = {
  beginner:     { stagnationWeeks: 3, preventiveWeeks: { strength: 7, hypertrophy: null, endurance: null }, usesRirDrift: false },
  intermediate: { stagnationWeeks: 2, preventiveWeeks: { strength: 7, hypertrophy: null, endurance: null }, usesRirDrift: true  },
  advanced:     { stagnationWeeks: 2, preventiveWeeks: { strength: 7, hypertrophy: null, endurance: null }, usesRirDrift: true  },
};

export const TRAINING_PARAMS = {
  strength: {
    MEV: { sets: [3, 4], reps: [3, 5], rest: 240, rir: 3 },
    MAV: { sets: [4, 5], reps: [2, 4], rest: 270, rir: 2 },
    MRV: { sets: [5, 6], reps: [1, 3], rest: 300, rir: 1 },
  },
  // Hypertrophie : repos corrigé — augmente avec l'intensité de phase (Schoenfeld 2016 : 2-3 min > 1 min)
  // En MRV (le plus proche de l'échec) le repos doit être au moins aussi long qu'en MEV
  // Note : buildTrainingBlocks écrase ces valeurs par A:150/B:120/C:90 pour l'hypertrophie
  hypertrophy: {
    MEV: { sets: [3, 4], reps: [10, 12], rest: 120, rir: 3 },
    MAV: { sets: [4, 5], reps: [8,  12], rest: 120, rir: 2 },
    MRV: { sets: [4, 6], reps: [6,  10], rest: 150, rir: 1 },
  },
  endurance: {
    MEV: { sets: [2, 3], reps: [15, 20], rest: 45, rir: 3 },
    MAV: { sets: [3, 4], reps: [12, 20], rest: 40, rir: 2 },
    MRV: { sets: [3, 5], reps: [12, 25], rest: 30, rir: 1 },
  },
};

// Fenêtres SRA par type de séance (heures minimum entre deux stimuli du même groupe)
const SRA_WINDOWS = {
  strength:     72, // force composée lourde : 72-96h
  hypertrophy:  48, // hypertrophie modérée : 48-72h
  endurance:    24, // isolation légère : 24-36h
  mixed:        48,
};

// ─────────────────────────────────────────────────────────────────────────────
// POSITION DANS LE MÉSOCYCLE
// ─────────────────────────────────────────────────────────────────────────────
export function getMesocyclePosition(program) {
  if (!program) return null;

  const startDate    = new Date(program.created_date);
  const today        = devNow();
  const msPerWeek    = 7 * 24 * 60 * 60 * 1000;
  const weeksElapsed = Math.max(0, Math.floor((today - startDate) / msPerWeek));
  const plannedWeeks = program.planned_weeks || 8;
  const weekNumber   = Math.min(weeksElapsed + 1, plannedWeeks);
  const phase        = program.active_phase || 'MEV';

  const phaseLabels  = { MEV: 'Accumulation', MAV: 'Volume optimal', MRV: 'Charge maximale' };

  return {
    weekNumber,
    plannedWeeks,
    phase,
    phaseLabel:  phaseLabels[phase] || phase,
    weeksLeft:   Math.max(0, plannedWeeks - weekNumber),
    progressPct: Math.round((weekNumber / plannedWeeks) * 100),
    isDeloadTime: weekNumber >= plannedWeeks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DÉTECTION DE RÉGRESSION DE PERFORMANCE
// Vérifie si les charges ou les reps stagnent/régressent sur 2+ semaines
// ─────────────────────────────────────────────────────────────────────────────
export function detectPerformanceRegression(seriesLogs = []) {
  if (seriesLogs.length < 4) return { regressing: false, stagnating: false };

  // Grouper par exercice
  const byExercise = seriesLogs.reduce((acc, log) => {
    const key = log.exercise_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});

  let regressingCount = 0;
  let stagnatingCount = 0;

  Object.values(byExercise).forEach(logs => {
    const sorted = [...logs].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    if (sorted.length < 4) return;

    // Comparer le volume (weight × reps) entre la première moitié et la seconde
    const mid   = Math.floor(sorted.length / 2);
    const early = sorted.slice(0, mid);
    const late  = sorted.slice(mid);

    const avgEarly = early.reduce((s, l) => s + (l.weight || 0) * (l.reps_done || 0), 0) / early.length;
    const avgLate  = late.reduce((s, l) => s + (l.weight || 0) * (l.reps_done || 0), 0) / late.length;

    if (avgEarly > 0) {
      const delta = (avgLate - avgEarly) / avgEarly;
      if (delta < -0.05)      regressingCount++;   // -5% → régression (Gabbett 2016)
      else if (delta < 0.05)  stagnatingCount++;   // <+5% → stagnation (variabilité naturelle ±3-5%)
    }
  });

  const total = Object.keys(byExercise).length;
  return {
    regressing:  regressingCount >= Math.max(1, total * 0.4),
    stagnating:  stagnatingCount >= Math.max(1, total * 0.5),
    regressingCount,
    stagnatingCount,
    total,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DÉRIVE DE RIR — même charge perçue plus dure au fil des semaines
// Signal de fatigue chronique avant même que les perfs régressent
// ─────────────────────────────────────────────────────────────────────────────
export function detectRIRDrift(seriesLogs = []) {
  if (seriesLogs.length < 8) return false;

  const rirMap = { failure: 0, RIR_1: 1, RIR_2: 2, 'RIR_3+': 3 };
  const sorted = [...seriesLogs]
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
    .slice(-20);

  const mid      = Math.floor(sorted.length / 2);
  const avgEarly = sorted.slice(0, mid).reduce((s, l) => s + (rirMap[l.mode] ?? 2), 0) / mid;
  const avgLate  = sorted.slice(mid).reduce((s, l)  => s + (rirMap[l.mode] ?? 2), 0) / (sorted.length - mid);

  return (avgEarly - avgLate) > 0.8;
}

// ─────────────────────────────────────────────────────────────────────────────
// VOLUME EFFECTIF PAR MUSCLE
// Muscles primaires comptent 1×, muscles secondaires comptent 0.5×
// ─────────────────────────────────────────────────────────────────────────────
export function computeEffectiveVolumePerMuscle(exercises = []) {
  const volumeMap = {};

  exercises.forEach(ex => {
    const sets       = ex.sets || 3;
    const primary    = ex.muscles?.primary    || [];
    const secondary  = ex.muscles?.secondary  || [];

    primary.forEach(m   => { volumeMap[m] = (volumeMap[m] || 0) + sets;       });
    secondary.forEach(m => { volumeMap[m] = (volumeMap[m] || 0) + sets * 0.5; });
  });

  return volumeMap;
}

// ─────────────────────────────────────────────────────────────────────────────
// VÉRIFICATION SRA — espacement des séances
// Retourne les violations (même groupe musculaire < fenêtre SRA)
// ─────────────────────────────────────────────────────────────────────────────
export function checkSRAViolations(sessions = []) {
  const completed = sessions
    .filter(s => s.status === 'completed' && (s.actual_date || s.planned_date))
    .sort((a, b) => new Date(a.actual_date || a.planned_date) - new Date(b.actual_date || b.planned_date));

  const violations = [];

  for (let i = 1; i < completed.length; i++) {
    const prev = completed[i - 1];
    const curr = completed[i];

    const prevDate  = new Date(prev.actual_date || prev.planned_date);
    const currDate  = new Date(curr.actual_date || curr.planned_date);
    const diffHours = (currDate - prevDate) / (1000 * 60 * 60);

    const prevZones = prev.active_zones || [];
    const currZones = curr.active_zones || [];
    const overlap   = prevZones.filter(z => currZones.includes(z));

    if (overlap.length > 0) {
      const sessionType = prev.type || 'hypertrophy';
      const required    = SRA_WINDOWS[sessionType] || 48;

      if (diffHours < required) {
        violations.push({
          zones:    overlap,
          diffHours: Math.round(diffHours),
          required,
          dates:    [prev.actual_date || prev.planned_date, curr.actual_date || curr.planned_date],
        });
      }
    }
  }

  return violations;
}

// Muscles impactés par zone fragile (même map que program-builder)
export const FRAGILE_ZONE_MUSCLES = {
  wrists:     ['Biceps', 'Triceps', 'Poitrine', 'Épaules'],
  shoulders:  ['Épaules', 'Poitrine', 'Triceps'],
  elbows:     ['Biceps', 'Triceps'],
  knees:      ['Quadriceps', 'Ischio-jambiers', 'Mollets'],
  lower_back: ['Dos', 'Ischio-jambiers', 'Fessiers'],
  neck:       ['Épaules', 'Dos'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SCORE DE DÉCHARGE — distingue signaux SYSTÉMIQUES vs ZONAUX
// Systémique → décharge complète (fatigue SNC, RIR drift, régression globale)
// Zonal → décharge ciblée sur les muscles/zones concernés seulement
// ─────────────────────────────────────────────────────────────────────────────
export function computeDeloadScore({ sessions = [], program = null, user = {}, checkins = {}, seriesLogs = [] }) {
  let systemicScore = 0;
  let zonalScore    = 0;
  const flags       = [];
  const zonalMuscles = new Set();

  const level      = user.level || 'intermediate';
  const thresholds = DELOAD_THRESHOLDS[level] || DELOAD_THRESHOLDS.intermediate;
  const objective  = (user.objectives || []).find(o => o.priority === 'primary')?.type || 'hypertrophy';
  const preventive = thresholds.preventiveWeeks[objective] || null;

  // ── SIGNAUX SYSTÉMIQUES ──────────────────────────────────────────────────

  // 1. Semaines écoulées — préventif tendineux uniquement en force
  const meso = getMesocyclePosition(program);
  if (meso) {
    if (meso.weekNumber >= 8)                              { systemicScore += 30; flags.push('8+ semaines sans décharge'); }
    else if (preventive && meso.weekNumber >= preventive)  { systemicScore += 20; flags.push(`${preventive} sem en force — décharge préventive tendineuse`); }
    else if (meso.weekNumber >= 4)                         { systemicScore += 8;  flags.push('4 semaines écoulées — surveiller'); }
    if (meso.isDeloadTime)                                 { systemicScore += 15; flags.push('Fin de mésocycle atteinte'); }
  }

  // 2. Fatigue globale SNC — systémique par nature
  const completed = sessions.filter(s => s.status === 'completed').slice(-6);
  if (completed.length >= 2) {
    const avg       = completed.reduce((s, x) => s + (x.global_fatigue || 0), 0) / completed.length;
    const last2     = completed.slice(-2);
    const last3     = completed.slice(-3);
    const bothHigh  = last2.every(s => (s.global_fatigue || 0) >= 4);
    const anyMax    = last2.some(s => s.global_fatigue === 5);
    const underStim = last3.length === 3 && last3.every(s => (s.global_fatigue || 0) <= 2);

    if (anyMax)        { systemicScore += 55; flags.push('Fatigue maximale (5/5) — décharge immédiate'); }
    else if (bothHigh) { systemicScore += 40; flags.push('Fatigue ≥ 4 sur 2 séances — décharge complète −40% volume'); }
    else if (avg >= 3.5){ systemicScore += 15; flags.push('Fatigue moyenne élevée'); }

    if (underStim)     { systemicScore -= 10; flags.push('Sous-stimulation — augmenter volume ou intensité'); }
    else if (avg <= 2) { systemicScore -= 8; }
  }

  // 3. Dérive de fatigue globale
  if (completed.length >= 4) {
    const fatigues  = completed.map(s => s.global_fatigue || 0);
    const first2avg = (fatigues[0] + fatigues[1]) / 2;
    const last2avg  = (fatigues[fatigues.length - 2] + fatigues[fatigues.length - 1]) / 2;
    if (last2avg >= first2avg + 1.5) { systemicScore += 15; flags.push('Dérive de fatigue globale'); }
  }

  // 4. Régression + dérive RIR — systémiques si généralisés
  if (seriesLogs.length >= 4) {
    const { regressing, stagnating } = detectPerformanceRegression(seriesLogs);
    const rirDrift = thresholds.usesRirDrift && detectRIRDrift(seriesLogs);

    if (regressing) {
      systemicScore += 20;
      flags.push('Régression généralisée — suspicion fatigue SNC');
    } else if (stagnating) {
      // Appliquer le délai de grâce selon le niveau (stagnationWeeks)
      // Un débutant a besoin de 3 semaines de stagnation confirmée avant signal
      const sorted = [...seriesLogs].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
      const firstDate = new Date(sorted[0]?.created_date);
      const lastDate  = new Date(sorted[sorted.length - 1]?.created_date);
      const weeksSpanned = (lastDate - firstDate) / (7 * 24 * 60 * 60 * 1000);
      if (weeksSpanned >= (thresholds.stagnationWeeks || 2)) {
        systemicScore += 8;
        flags.push(`Stagnation des performances (${Math.round(weeksSpanned)} sem)`);
      }
    }
    if (rirDrift) { systemicScore += 15; flags.push('Dérive de RIR — fatigue chronique systémique'); }
  }

  // 5. Sommeil dégradé — systémique (récupération globale compromise)
  const recentIds    = sessions.filter(s => s.status === 'completed').slice(-4).map(s => s.id);
  const badSleepCount = recentIds.filter(id => checkins[id]?.sleep === 'bad').length;
  if (badSleepCount >= 2) { systemicScore += 10; flags.push('Sommeil dégradé répété'); }

  // ── SIGNAUX ZONAUX ───────────────────────────────────────────────────────

  // 6. Raideur post-séance (24h rule) — zonal si localisé
  const stifferSessions = recentIds
    .filter(id => checkins[id]?.feeling === 'stiffer')
    .map(id => sessions.find(s => s.id === id))
    .filter(Boolean);

  if (stifferSessions.length >= 2) {
    zonalScore += 18;
    flags.push('Raideur post-séance répétée (règle 24h)');
    stifferSessions.forEach(s => {
      (s.active_zones || []).forEach(z => {
        const muscles = FRAGILE_ZONE_MUSCLES[z] || [z];
        muscles.forEach(m => zonalMuscles.add(m));
      });
    });
  }

  // 7. Zones fragiles déclarées → muscles à risque
  const rawZones = (() => {
    const fz = user.fragile_zones;
    if (!fz) return [];
    if (Array.isArray(fz)) return fz;
    try { return JSON.parse(fz) || []; } catch { return []; }
  })();
  rawZones.forEach(z => {
    const key = typeof z === 'string' ? z : z.key;
    (FRAGILE_ZONE_MUSCLES[key] || []).forEach(m => zonalMuscles.add(m));
  });
  if (rawZones.length > 0) {
    zonalScore += rawZones.length * 8;
    systemicScore = Math.round(systemicScore * (1 + rawZones.length * 0.03)); // légère amplification systémique
  }

  // 8. Violations SRA — zonal (muscles concernés)
  const sraViolations = checkSRAViolations(sessions);
  if (sraViolations.length >= 2) {
    zonalScore += 12;
    flags.push(`${sraViolations.length} violations SRA`);
    sraViolations.forEach(v => v.zones.forEach(z => zonalMuscles.add(z)));
  }

  // ── CALCUL FINAL ─────────────────────────────────────────────────────────
  const totalScore = Math.max(0, Math.min(100, systemicScore + Math.round(zonalScore * 0.5)));

  // Détermine si la décharge doit être complète ou zonale
  // Systémique dominant → full | Zonal dominant avec systémique faible → zone
  const deloadType = systemicScore >= 25
    ? 'full'
    : zonalScore >= 25
    ? 'zone'
    : 'none';

  return {
    score:          totalScore,
    systemicScore:  Math.max(0, systemicScore),
    zonalScore:     Math.max(0, zonalScore),
    deloadType,
    affectedMuscles: [...zonalMuscles],
    flags,
  };
}

// Recommandation selon le score et le type de décharge
export function getDeloadRecommendation(score, deloadType = 'full', affectedMuscles = [], lang = 'fr') {
  const P = (fr, en) => (lang === 'en' ? en : fr);
  const muscleList = affectedMuscles.length > 0 ? affectedMuscles.join(', ') : null;

  // Signaux systémiques critiques → repos complet
  if (score >= 75) return {
    type:    'rest',
    label:   P('Repos 10–14 jours', 'Rest 10–14 days'),
    urgency: 'critical',
    scope:   'full',
    message: P('Signaux de sur-entraînement généralisés. Repos complet nécessaire.', 'Widespread overtraining signals. Full rest needed.'),
    action:  P('Activités légères uniquement (marche, mobilité). Aucun entraînement 10–14 jours.', 'Light activity only (walking, mobility). No training for 10–14 days.'),
  };

  // Signal zonal avec systémique faible → décharge ciblée seulement
  if (score >= 30 && deloadType === 'zone' && muscleList) {
    return {
      type:    'zone_deload',
      label:   P(`Décharge ciblée — ${muscleList}`, `Targeted deload — ${muscleList}`),
      urgency: 'medium',
      scope:   'zone',
      affectedMuscles,
      message: P(`Signaux localisés sur ${muscleList}. Les autres groupes peuvent continuer normalement.`, `Localized signals on ${muscleList}. Other groups can continue as usual.`),
      action:  P(`−40% volume sur ${muscleList} uniquement. Charges identiques. Reste du programme inchangé.`, `−40% volume on ${muscleList} only. Same loads. Rest of the program unchanged.`),
    };
  }

  // Signal systémique fort → décharge complète
  if (score >= 50) return {
    type:    'deload',
    label:   P('Décharge 7 jours', 'Deload 7 days'),
    urgency: 'high',
    scope:   'full',
    message: P('Fatigue systémique importante. Décharge complète nécessaire.', 'Significant systemic fatigue. Full deload needed.'),
    action:  P('−40% volume sur tous les groupes. Charges identiques. Fréquence et patterns inchangés.', '−40% volume on all groups. Same loads. Frequency and patterns unchanged.'),
  };

  // Signal faible → semaine légère
  if (score >= 30) return {
    type:    'light_week',
    label:   P('Semaine légère', 'Light week'),
    urgency: 'medium',
    scope:   'full',
    message: P('Quelques signaux de fatigue. Semaine plus légère conseillée.', 'Some fatigue signals. A lighter week is advised.'),
    action:  P('−20% volume, même charge. Observer l\'évolution.', '−20% volume, same load. Monitor how it goes.'),
  };

  return {
    type:    'continue',
    label:   P('Continuer', 'Keep going'),
    urgency: 'none',
    scope:   'none',
    message: P('Récupération bonne. Programme à poursuivre.', 'Good recovery. Keep following the program.'),
    action:  null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// READINESS DE PHASE — est-on prêt à passer à la phase suivante ?
// Bloque la progression si régression ou fatigue élevée
// ─────────────────────────────────────────────────────────────────────────────
export function checkPhaseReadiness({ sessions = [], seriesLogs = [], program = null, level = 'intermediate' }) {
  const meso = getMesocyclePosition(program);
  if (!meso) return { ready: true, reason: null };

  // Débutants : MRV interdit — trop de risque blessure sans bénéfice supplémentaire
  if (level === 'beginner' && meso.phase === 'MRV') {
    return {
      ready:  false,
      reason: 'Phase MRV déconseillée pour un débutant — rester en MAV pour progresser en sécurité.',
    };
  }

  const { regressing } = detectPerformanceRegression(seriesLogs);
  const completed  = sessions.filter(s => s.status === 'completed').slice(-4);
  const avgFatigue = completed.length
    ? completed.reduce((s, x) => s + (x.global_fatigue || 0), 0) / completed.length
    : 0;

  if (regressing && meso.phase !== 'MEV') {
    return {
      ready:  false,
      reason: 'Régression de performance détectée — rester en phase actuelle avant de progresser.',
    };
  }

  if (avgFatigue >= 4 && meso.phase === 'MAV') {
    return {
      ready:  false,
      reason: 'Fatigue trop élevée pour passer en MRV — effectuer une décharge d\'abord.',
    };
  }

  return { ready: true, reason: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// SURCHARGE PROGRESSIVE — charge ET poids de corps
// Règle : charge OU volume, jamais les deux simultanément
// ─────────────────────────────────────────────────────────────────────────────
export function computeProgressiveOverload(seriesLogs = [], exerciseName) {
  const logs = seriesLogs
    .filter(s => s.exercise_name === exerciseName)
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  if (logs.length < 2) return null;

  const lastDate   = logs[0].created_date?.split('T')[0];
  const lastLogs   = logs.filter(s => s.created_date?.startsWith(lastDate));
  const prevLogs   = logs.filter(s => !s.created_date?.startsWith(lastDate)).slice(0, lastLogs.length);

  if (!lastLogs.length) return null;

  const rirMap  = { failure: 0, RIR_1: 1, RIR_2: 2, 'RIR_3+': 3 };
  const modes   = lastLogs.map(s => s.mode || 'RIR_3+');
  const avgRIR  = modes.reduce((sum, m) => sum + (rirMap[m] ?? 3), 0) / modes.length;
  const lastRIR = rirMap[modes[modes.length - 1]] ?? 3;
  const weight  = lastLogs[0]?.weight || 0;
  const isBodyweight = weight === 0;

  // Détecter si volume ET charge ont augmenté simultanément (violation Overload)
  if (prevLogs.length > 0) {
    const prevWeight = prevLogs[0]?.weight || 0;
    const prevSets   = prevLogs.length;
    const currSets   = lastLogs.length;
    const weightUp   = weight > prevWeight;
    const volumeUp   = currSets > prevSets;

    if (weightUp && volumeUp && !isBodyweight) {
      return {
        action:     'warning',
        suggestion: 'Charge ET volume ont augmenté simultanément — violation du principe d\'Overload. Augmenter une variable à la fois.',
        delta:      0,
      };
    }
  }

  // Progression poids de corps — basée sur qualité + reps + RIR
  if (isBodyweight) {
    const allGoodQuality = lastLogs.every(l => l.execution_quality === 'good');
    const avgReps = lastLogs.reduce((s, l) => s + (l.reps_done || 0), 0) / lastLogs.length;

    if (lastRIR === 0 || (lastLogs.some(l => l.execution_quality === 'bad'))) {
      return {
        action:     'regress',
        suggestion: 'Qualité dégradée ou échec — régresser à la variante inférieure.',
        delta:      0,
      };
    }
    if (avgRIR >= 2 && allGoodQuality) {
      return {
        action:     'progress_variant',
        suggestion: 'Cible atteinte avec bonne qualité — progresser vers la variante suivante (reps → tempo → ROM → unilatéral → lestage).',
        delta:      0,
      };
    }
    return {
      action:     'maintain',
      suggestion: 'Maintenir la variante actuelle — continuer à progresser les reps.',
      delta:      0,
    };
  }

  // Progression avec charge
  if (lastRIR === 0) return {
    action:     'maintain',
    suggestion: 'Maintenir la charge — qualité et récupération à surveiller.',
    delta:      0,
  };
  if (avgRIR >= 2) return {
    action:     'increase',
    suggestion: `+2,5 kg recommandé (RIR moyen ${avgRIR.toFixed(1)}) — augmenter la charge uniquement, pas le volume.`,
    delta:      2.5,
    newWeight:  weight + 2.5,
  };
  if (lastRIR === 1) return {
    action:     'maintain',
    suggestion: 'Maintenir — RIR 1 sur la dernière série.',
    delta:      0,
  };

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// RÈGLE DES 24H — sessions complétées hier sans check-in
// ─────────────────────────────────────────────────────────────────────────────
export function getSessionsNeedingCheckin(sessions = [], checkins = {}) {
  const yesterday = devNow();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];

  return sessions.filter(s =>
    s.status === 'completed' &&
    (s.actual_date === yStr || s.planned_date === yStr) &&
    !checkins[s.id]
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VOLUME CIBLE
// ─────────────────────────────────────────────────────────────────────────────
export function getVolumeRange(level, phase, objective = 'hypertrophy', muscleName = '') {
  const objTable = VOLUME_TABLES[objective] || VOLUME_TABLES.hypertrophy;
  const sizeKey  = LARGE_MUSCLES.has(muscleName) ? 'large' : 'small';
  const table    = objTable[sizeKey][level] || objTable[sizeKey].intermediate;
  const current  = table[phase] || table.MAV;
  return { mev: table.MEV, mav: table.MAV, mrv: table.MRV, current, percentage: Math.round((current / table.MRV) * 100), phase };
}

export function getTrainingParams(objective = 'hypertrophy', phase = 'MAV') {
  return TRAINING_PARAMS[objective]?.[phase] || TRAINING_PARAMS.hypertrophy.MAV;
}

// ─────────────────────────────────────────────────────────────────────────────
// TECHNIQUES AVANCÉES — activation selon temps dispo + préférences
// ─────────────────────────────────────────────────────────────────────────────

// Paires d'exercices antagonistes — idéales en superset (repos croisé)
const ANTAGONIST_PAIRS = [
  ['Biceps',          'Triceps'],
  ['Poitrine',        'Dos'],
  ['Quadriceps',      'Ischio-jambiers'],
  ['Épaules',         'Dos'],
  ['Adducteurs',      'Abducteurs'],
];

export function computeSessionTechniques({ durationMinutes, acceptsAdvanced, exercises = [], objective = 'hypertrophy' }) {
  const techniques = {
    supersets:    false,
    restPause:    false,
    dropsets:     false,
    slowEccentric: false,
    superset_pairs: [],
    notes: [],
  };

  // Superset — activé si manque de temps (< 45 min) OU techniques avancées activées
  // Logique : on peut gagner 30-40% de temps en couplant des muscles antagonistes
  const timeShort = durationMinutes < 45;
  if (timeShort || acceptsAdvanced) {
    techniques.supersets = true;

    // Identifier les paires antagonistes dans les exercices de la séance
    const muscleGroups = [...new Set(exercises.map(e => e.muscle_group).filter(Boolean))];
    ANTAGONIST_PAIRS.forEach(([a, b]) => {
      const hasA = muscleGroups.some(m => m.includes(a));
      const hasB = muscleGroups.some(m => m.includes(b));
      if (hasA && hasB) techniques.superset_pairs.push([a, b]);
    });

    if (timeShort) {
      techniques.notes.push('Séance courte → supersets antagonistes pour économiser 30-40% du temps de repos');
    }
  }

  // Rest-pause — uniquement si techniques avancées + hypertrophie + isolation
  if (acceptsAdvanced && objective === 'hypertrophy') {
    techniques.restPause = true;
    techniques.notes.push('Rest-pause autorisé : à l\'échec sur isolation → pause 15s → 3-5 reps supplémentaires (dernière série uniquement)');
  }

  // Dropset — uniquement si techniques avancées + machines/câbles (sécurité)
  if (acceptsAdvanced) {
    techniques.dropsets = true;
    techniques.notes.push('Dropset autorisé : -20-30% de charge à l\'échec → continuer jusqu\'au 2e échec (machines et câbles uniquement, dernière série)');
  }

  // Excentrique lent — toujours bénéfique pour hypertrophie, pas dangereux
  if (acceptsAdvanced && objective === 'hypertrophy') {
    techniques.slowEccentric = true;
    techniques.notes.push('Excentrique lent : descente 3-4 secondes sur isolations pour maximiser le temps sous tension');
  }

  return techniques;
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCAGE STRUCTUREL — stagnation sans fatigue = problème de disponibilités
// Distinct du plateau de fatigue (résolu par décharge)
// ─────────────────────────────────────────────────────────────────────────────
export function detectStructuralPlateau({ seriesLogs = [], sessions = [], program = null }) {
  // Pas assez de données
  if (seriesLogs.length < 12) return { isStructural: false, confidence: 0, reason: null };

  const { stagnating, regressing } = detectPerformanceRegression(seriesLogs);
  if (!stagnating && !regressing) return { isStructural: false, confidence: 0, reason: null };

  // Trop tôt dans le cycle — adaptation neurale normale (pas un vrai plateau)
  const meso = getMesocyclePosition(program);
  if (meso && meso.weekNumber <= 3) {
    return { isStructural: false, confidence: 0, reason: 'Trop tôt dans le cycle — adaptation neurale normale' };
  }

  // Si la fatigue est élevée → plateau de fatigue, pas structurel
  const completed = sessions.filter(s => s.status === 'completed').slice(-4);
  const avgFatigue = completed.length
    ? completed.reduce((s, x) => s + (x.global_fatigue || 0), 0) / completed.length
    : 0;
  if (avgFatigue >= 3.5) return { isStructural: false, confidence: 0, reason: null };

  // Détecter si une décharge a eu lieu récemment (fatigue haute → basse → stagnation persiste)
  const last8 = sessions.filter(s => s.status === 'completed').slice(-8);
  let hadRecentDeload = false;
  if (last8.length >= 6) {
    const earlyFatigue = last8.slice(0, 3).reduce((s, x) => s + (x.global_fatigue || 0), 0) / 3;
    const midFatigue   = last8.slice(3, 5).reduce((s, x) => s + (x.global_fatigue || 0), 0) / 2;
    // Fatigue haute → chute (décharge) → stagnation sans fatigue = blocage structurel confirmé
    if (earlyFatigue >= 3 && midFatigue <= 2 && avgFatigue <= 2.5) hadRecentDeload = true;
  }

  return {
    isStructural: true,
    confidence:   hadRecentDeload ? 85 : 60,
    reason: hadRecentDeload
      ? 'Stagnation persistante après décharge — la récupération ne résout pas le problème. Blocage structurel de disponibilités.'
      : 'Stagnation sans fatigue — le problème n\'est pas la récupération mais le volume ou la fréquence disponible.',
    suggestions: [
      'Augmenter la durée de séance pour ajouter des séries (prioritaire si < 75 min)',
      'Ajouter un jour d\'entraînement pour augmenter la fréquence par muscle',
      'Changer la structure (full_body → split = plus de volume par muscle en même temps)',
      'Progresser uniquement via la charge si le volume ne peut plus augmenter',
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERTES DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function computeDashboardAlerts({ sessions = [], program = null, user = {}, checkins = {}, seriesLogs = [], lang = 'fr' }) {
  const P = (fr, en) => (lang === 'en' ? en : fr);
  const alerts = [];

  // Décharge / fatigue
  const { score, flags, deloadType, affectedMuscles } = computeDeloadScore({ sessions, program, user, checkins, seriesLogs });
  const rec = getDeloadRecommendation(score, deloadType, affectedMuscles, lang);

  if (rec.type !== 'continue') {
    alerts.push({
      type:    rec.urgency === 'critical' ? 'fatigue' : rec.urgency === 'high' ? 'fatigue' : 'plateau',
      message: `${rec.label} — ${rec.message}`,
      detail:  rec.action,
      score,
      flags,
    });
  }

  // Sous-stimulation — augmenter l'intensité
  if (flags.some(f => f.includes('Sous-stimulation'))) {
    alerts.push({ type: 'plateau', message: P('Fatigue faible sur 3 séances — sous-stimulation. Augmenter le volume ou l\'intensité.', 'Low fatigue over 3 sessions — under-stimulation. Increase volume or intensity.') });
  }

  // (Supprimé : « fin du mésocycle → décharge planifiée recommandée » — une
  // décharge au calendrier contredit l'autorégulation : c'est la FATIGUE qui
  // décide, via getDeloadRecommendation / la carte volume. La position dans le
  // cycle reste un simple facteur du score de décharge, pas une alerte.)

  // Readiness phase
  const { ready, reason } = checkPhaseReadiness({ sessions, seriesLogs, program });
  if (!ready) {
    alerts.push({ type: 'plateau', message: reason });
  }

  // Violations SRA
  const sraViolations = checkSRAViolations(sessions);
  if (sraViolations.length > 0) {
    const zonesStr = sraViolations.map(v => v.zones.join('/')).join(', ');
    alerts.push({
      type:    'imbalance',
      message: P(`${sraViolations.length} conflit${sraViolations.length > 1 ? 's' : ''} SRA — récupération insuffisante sur ${zonesStr}.`, `${sraViolations.length} SRA conflict${sraViolations.length > 1 ? 's' : ''} — insufficient recovery on ${zonesStr}.`),
    });
  }

  // Blocage structurel — stagnation sans fatigue après décharge
  const structural = detectStructuralPlateau({ seriesLogs, sessions, program });
  if (structural.isStructural) {
    alerts.push({
      type:        'structural_plateau',
      message:     structural.reason,
      detail:      structural.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n'),
      confidence:  structural.confidence,
    });
  }

  // Séances manquées
  const today   = devNow().toISOString().split('T')[0];
  const missed  = sessions.filter(s => s.status === 'planned' && s.planned_date && s.planned_date < today);
  if (missed.length >= 2) {
    alerts.push({ type: 'missed', message: P(`${missed.length} séances non complétées — adhérence à surveiller.`, `${missed.length} missed workouts — watch your consistency.`) });
  }

  // Fin de cycle — dernière séance planifiée dans les 7 prochains jours
  const planned = sessions.filter(s => s.status === 'planned' && s.planned_date);
  if (planned.length > 0 && program) {
    const lastPlanned = planned.map(s => s.planned_date).sort().pop();
    const daysLeft = Math.ceil((new Date(lastPlanned) - new Date(today)) / 86400000);
    if (daysLeft >= 0 && daysLeft <= 7) {
      const whenStr = lang === 'en'
        ? (daysLeft === 0 ? 'today' : `in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`)
        : (daysLeft === 0 ? "aujourd'hui" : `dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`);
      alerts.push({
        type: 'cycle_end',
        message: P(`Ton cycle se termine ${whenStr} — veux-tu repartir sur 4 nouvelles semaines ?`, `Your cycle ends ${whenStr} — want to start 4 new weeks?`),
      });
    }
  }

  return alerts;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTORÉGULATION DU VOLUME — proposer +/− volume selon fatigue & performances
// ─────────────────────────────────────────────────────────────────────────────

// Plafond de séries par exercice selon sa PLAGE DE REPS (borne basse) :
//  force 1-5 → 6 · hypertrophie 6-15 → 5 (junk volume au-delà) · endurance >15 → 8
export function repSetCap(targetReps) {
  const low = parseInt(String(targetReps ?? '').split(/[-–]/)[0], 10);
  if (!low || isNaN(low)) return 5;
  if (low <= 5)  return 6;
  if (low <= 15) return 5;
  return 8;
}

// Renvoie UNE proposition d'ajustement de volume, ou null.
// La décharge (fatigue) est prioritaire sur l'augmentation (stagnation).
export function computeVolumeProposal({ sessions = [], program = null, user = {}, seriesLogs = [], checkins = {}, lang = 'fr' }) {
  const P = (fr, en) => (lang === 'en' ? en : fr);
  const completed = sessions.filter(s => s.status === 'completed');
  if (completed.length < 3) return null; // pas assez de signal

  // ── DÉCHARGE (fatigue) — douce, prioritaire ────────────────────────────────
  const { score, deloadType, affectedMuscles } = computeDeloadScore({ sessions, program, user, checkins, seriesLogs });
  const rec = getDeloadRecommendation(score, deloadType, affectedMuscles);
  if (rec.type === 'rest') {
    return {
      direction: 'decrease',
      label: P('Repos conseillé', 'Rest recommended'),
      detail: P(rec.action || 'Signaux de fatigue importants — privilégie le repos quelques jours.', 'Strong fatigue signals — favor rest for a few days.'),
      apply: { mode: 'rest' },
    };
  }
  if (rec.type === 'deload') {
    return {
      direction: 'decrease',
      label: P('Fatigue élevée — alléger le volume', 'High fatigue — reduce volume'),
      detail: P('On retire 2 séries sur tes derniers exercices cette semaine (charges inchangées) pour mieux récupérer.', "We remove 2 sets from your last exercises this week (loads unchanged) to recover better."),
      apply: { mode: 'trim', removeSets: 2 },
    };
  }
  if (rec.type === 'light_week' || rec.type === 'zone_deload') {
    return {
      direction: 'decrease',
      label: P('Semaine plus légère', 'Lighter week'),
      detail: P('On retire 1 série sur ton dernier exercice cette semaine (charges inchangées).', 'We remove 1 set from your last exercise this week (loads unchanged).'),
      apply: { mode: 'trim', removeSets: 1 },
    };
  }

  // ── AUGMENTATION (stagnation 2 occurrences + fatigue OK) ────────────────────
  const recent = [...completed]
    .sort((a, b) => new Date(b.actual_date || b.planned_date) - new Date(a.actual_date || a.planned_date))
    .slice(0, 4);
  const fatigues = recent.map(s => s.global_fatigue || 0).filter(Boolean);
  const avgFatigue = fatigues.length ? fatigues.reduce((a, b) => a + b, 0) / fatigues.length : 0;
  if (avgFatigue > 3) return null; // fatigue pas OK → on ne monte pas le volume

  const sessById = {};
  sessions.forEach(s => { sessById[s.id] = s; });
  const sessDate = s => (s && (s.actual_date || s.planned_date)) || '';

  // Logs des séances complétées, groupés par exercice
  const byEx = {};
  seriesLogs.forEach(l => {
    const s = sessById[l.session_id];
    if (!s || s.status !== 'completed') return;
    (byEx[l.exercise_name] ||= []).push(l);
  });

  const stat = (ls) => {
    const target = parseInt(String(ls[0]?.reps_target ?? '').split(/[-–]/)[0], 10) || 0;
    const reps = ls.map(x => x.reps_done || 0);
    const goodExec = ls.every(x => (x.execution_quality || 'good') === 'good');
    const metTarget = target > 0 ? reps.every(r => r >= target) : reps.every(r => r > 0);
    const bestVol = Math.max(0, ...ls.map(x => (x.weight || 0) * (x.reps_done || 0)));
    const totalReps = reps.reduce((a, b) => a + b, 0);
    return { goodExec, metTarget, bestVol, totalReps, sets: ls.length, target: ls[0]?.reps_target };
  };

  const stagnating = [];
  for (const [name, logs] of Object.entries(byEx)) {
    const byOcc = {};
    logs.forEach(l => { (byOcc[l.session_id] ||= []).push(l); });
    const occ = Object.entries(byOcc)
      .map(([sid, ls]) => ({ date: sessDate(sessById[sid]), ls }))
      .filter(o => o.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (occ.length < 2) continue;

    const a = stat(occ[0].ls), b = stat(occ[1].ls);
    const progressed = a.bestVol > b.bestVol * 1.02 || a.totalReps > b.totalReps;
    if (a.metTarget && b.metTarget && a.goodExec && b.goodExec && !progressed && a.sets < repSetCap(a.target)) {
      stagnating.push(name);
    }
  }

  if (!stagnating.length) return null;
  return {
    direction: 'increase',
    label: P('Tu stagnes mais tu récupères bien — ajouter du volume ?', 'You\'re plateauing but recovering well — add volume?'),
    detail: P(`+1 série sur : ${stagnating.slice(0, 6).join(', ')}. (perfs stables 2 semaines, fatigue OK)`, `+1 set on: ${stagnating.slice(0, 6).join(', ')}. (stable perf 2 weeks, fatigue OK)`),
    apply: { mode: 'increase', exercises: stagnating, deltaSets: 1 },
  };
}
