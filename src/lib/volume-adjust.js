// Application des propositions d'autorégulation du volume (écrit en base) + anti-spam.
import { base44 } from '@/api/base44Client';
import { queryClientInstance } from '@/lib/query-client';
import { repSetCap } from '@/lib/coaching-engine';

const HANDLED_KEY = (programId) => `volume_adjust_handled_${programId}`;
const SUPPRESS_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours (≈ 1 semaine d'entraînement)

// Mémorise qu'une proposition a été traitée (appliquée / ignorée / faite manuellement)
export function markVolumeHandled(programId) {
  if (!programId) return;
  try { localStorage.setItem(HANDLED_KEY(programId), String(Date.now())); } catch {}
}

// Vrai si une proposition a été traitée il y a moins de 7 jours → on ne re-propose pas
export function isVolumeSuppressed(programId) {
  if (!programId) return false;
  try {
    const ts = parseInt(localStorage.getItem(HANDLED_KEY(programId)) || '0', 10);
    return ts > 0 && (Date.now() - ts) < SUPPRESS_MS;
  } catch { return false; }
}

const todayStr = () => new Date().toISOString().split('T')[0];

async function invalidateSessions() {
  await Promise.all([
    queryClientInstance.invalidateQueries({ queryKey: ['program-sessions'] }),
    queryClientInstance.invalidateQueries({ queryKey: ['sessions'] }),
  ]);
}

// Applique la proposition aux séances PLANIFIÉES à venir. Retourne le nb de séances modifiées.
export async function applyVolumeProposal(programId, apply) {
  if (!programId || !apply || apply.mode === 'rest') return 0;

  const all = await base44.entities.Session.filter({ program_id: programId });
  const today = todayStr();
  let upcoming = all.filter(s => s.status === 'planned' && s.planned_date && s.planned_date >= today);
  const updates = [];

  if (apply.mode === 'increase') {
    const names = new Set(apply.exercises || []);
    const delta = apply.deltaSets || 1;
    for (const s of upcoming) {
      if (!s.exercises?.length) continue;
      let changed = false;
      const exercises = s.exercises.map(ex => {
        if (!names.has(ex.name)) return ex;
        const cur = ex.sets || 3;
        const next = Math.min(repSetCap(ex.target_reps), cur + delta); // plafond par plage de reps
        if (next !== cur) { changed = true; return { ...ex, sets: next }; }
        return ex;
      });
      if (changed) updates.push(base44.entities.Session.update(s.id, { exercises }));
    }
  } else if (apply.mode === 'trim') {
    const remove = apply.removeSets || 1;
    // Décharge douce = uniquement les 7 prochains jours
    const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    upcoming = upcoming.filter(s => s.planned_date <= weekEndStr);
    for (const s of upcoming) {
      if (!s.exercises?.length) continue;
      const exercises = s.exercises.map(ex => ({ ...ex }));
      // retirer `remove` séries au total, en partant du DERNIER exercice (souvent isolation)
      let toRemove = remove;
      for (let i = exercises.length - 1; i >= 0 && toRemove > 0; i--) {
        const cur = exercises[i].sets || 3;
        if (cur > 1) {
          const dec = Math.min(toRemove, cur - 1); // plancher 1 série/exo
          exercises[i].sets = cur - dec;
          toRemove -= dec;
        }
      }
      if (toRemove < remove) updates.push(base44.entities.Session.update(s.id, { exercises }));
    }
  }

  await Promise.all(updates);
  await invalidateSessions();
  return updates.length;
}
