// ─────────────────────────────────────────────────────────────────────────────
// Application d'un cran de l'échelle douleur aux séances PLANIFIÉES à venir
// (fenêtre 7 jours), miroir de volume-adjust.js.
//   Cran 0 : restauration complète depuis le baseline
//   Cran 1 : charge −20 % sur les exos de la zone
//   Cran 2 : + −1 série (plancher 1)
//   Cran 3 : + exos de la zone retirés d'une séance sur deux
//   Cran 4 : exos de la zone retirés de toutes les séances (douleur vive)
// Les valeurs d'origine (baseline) et les exos retirés sont mémorisés dans
// l'épisode → la remontée restaure exactement l'état d'avant.
// ─────────────────────────────────────────────────────────────────────────────
import { base44 } from '@/api/base44Client';
import { queryClientInstance } from '@/lib/query-client';
import { exerciseStressesZone } from '@/lib/pain-engine';

const todayStr = () => new Date().toISOString().split('T')[0];

// −20 % arrondi au cran de poids réaliste (0,5 kg sous 10 kg, sinon 2,5 kg),
// en garantissant une vraie baisse quand c'est possible.
function reduceWeight(w) {
  if (!w || w <= 0) return w;
  const step = w < 10 ? 0.5 : 2.5;
  let r = Math.round((w * 0.8) / step) * step;
  if (r >= w) r = Math.max(0, w - step);
  return Math.round(r * 100) / 100;
}

async function invalidateSessions() {
  await Promise.all([
    queryClientInstance.invalidateQueries({ queryKey: ['program-sessions'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['sessions'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['session'] }), // séance ouverte (SessionLog)
  ]);
}

// Applique `toLevel` et retourne l'épisode mis à jour (level, baseline, removed).
// Idempotent : on restaure d'abord tout (exos retirés + valeurs baseline), puis
// on ré-applique le cran cible — on peut donc monter ou descendre librement.
export async function applyPainLevel(programId, episode, toLevel) {
  if (!programId || !episode) return episode;
  const zone = episode.zone;
  const baseline = { ...(episode.baseline || {}) };

  const all = await base44.entities.Session.filter({ program_id: programId });
  const today = todayStr();
  const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  // Copies de travail des listes d'exercices, par séance
  const working = new Map(); // sessionId -> exercises[]
  const getExs = (s) => {
    if (!working.has(s.id)) working.set(s.id, (s.exercises || []).map(e => ({ ...e })));
    return working.get(s.id);
  };
  const touched = new Set(); // séances réellement modifiées

  // 1) Restaurer les exos retirés précédemment (dans leurs séances d'origine,
  //    si elles existent encore et sont toujours planifiées)
  for (const rem of episode.removed || []) {
    const s = all.find(x => x.id === rem.sessionId && x.status === 'planned');
    if (!s) continue;
    const exs = getExs(s);
    (rem.exercises || []).forEach((exo, i) => {
      if (exs.some(e => e.name === exo.name)) return;
      const pos = Math.min(rem.positions?.[i] ?? exs.length, exs.length);
      exs.splice(pos, 0, { ...exo });
      touched.add(s.id);
    });
  }
  const removed = [];

  // 2) Appliquer le cran cible aux séances planifiées de la fenêtre 7 jours
  const winSessions = all
    .filter(s => s.status === 'planned' && s.planned_date && s.planned_date >= today && s.planned_date <= weekEndStr)
    .sort((a, b) => (a.planned_date || '').localeCompare(b.planned_date || ''));

  let touchCount = 0;
  for (const s of winSessions) {
    const exs = getExs(s);
    // Ciblage tolérant aux exos importés : muscle_group OU base d'exercices
    // (nom) OU mots-clés du mouvement — voir exerciseStressesZone.
    const zoneIdxs = exs.map((e, i) => (exerciseStressesZone(e, zone) ? i : -1)).filter(i => i >= 0);
    if (!zoneIdxs.length) continue;
    touchCount++;

    // Baseline : capturé à la 1ʳᵉ rencontre de chaque exo (valeurs d'origine)
    for (const i of zoneIdxs) {
      const exo = exs[i];
      if (!(exo.name in baseline)) baseline[exo.name] = { weight: exo.target_weight ?? null, sets: exo.sets || 3 };
    }

    // Jamais de RETRAIT d'exos sur la séance du jour : si elle est en cours,
    // les logs du brouillon sont indexés par position → un retrait décalerait
    // tout. La séance du jour reçoit la réduction charge/séries à la place.
    const removeHere = (toLevel >= 4 || (toLevel === 3 && touchCount % 2 === 0)) && s.planned_date > today;
    if (removeHere) {
      removed.push({ sessionId: s.id, exercises: zoneIdxs.map(i => ({ ...exs[i] })), positions: zoneIdxs });
      working.set(s.id, exs.filter((_, i) => !zoneIdxs.includes(i)));
      touched.add(s.id);
    } else {
      for (const i of zoneIdxs) {
        const exo = exs[i];
        const base = baseline[exo.name];
        const nextWeight = base.weight > 0 ? (toLevel >= 1 ? reduceWeight(base.weight) : base.weight) : exo.target_weight;
        const nextSets = toLevel >= 2 ? Math.max(1, (base.sets || 3) - 1) : (base.sets || exo.sets || 3);
        if (nextWeight !== exo.target_weight || nextSets !== exo.sets) {
          exs[i] = { ...exo, target_weight: nextWeight, sets: nextSets };
          touched.add(s.id);
        }
      }
    }
  }

  await Promise.all([...touched].map(id => base44.entities.Session.update(id, { exercises: working.get(id) })));
  if (touched.size) await invalidateSessions();

  const goingUp = toLevel < (episode.level || 0);
  return {
    ...episode,
    level: toLevel,
    // remonter "consomme" les 2 mieux — il en faudra 2 nouveaux pour le cran suivant
    betterStreak: goingUp ? 0 : (episode.betterStreak || 0),
    baseline: toLevel === 0 ? {} : baseline,
    removed: toLevel === 0 ? [] : removed,
  };
}
