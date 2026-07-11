// ─────────────────────────────────────────────────────────────────────────────
// File de synchronisation hors-ligne (outbox).
//
// But : ne jamais perdre une séance validée sans réseau. L'opération est stockée
// localement (localStorage) avec un payload AUTONOME, puis rejouée automatiquement
// dès que la connexion revient (événement `online`) ou au prochain lancement.
//
// Règle d'or : chaque exécuteur doit être IDEMPOTENT (rejouable sans créer de
// doublon), car une opération peut être retentée plusieurs fois.
// ─────────────────────────────────────────────────────────────────────────────
import { base44 } from '@/api/base44Client';

const KEY = 'sync_outbox';
let flushing = false;
const listeners = new Set();

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(queue) {
  try { localStorage.setItem(KEY, JSON.stringify(queue)); } catch {}
  listeners.forEach((fn) => { try { fn(queue.length); } catch {} });
}

export function pendingCount() { return read().length; }

// S'abonner au nombre d'éléments en attente (pour l'UI). Renvoie une fonction de désabonnement.
export function subscribePending(fn) {
  listeners.add(fn);
  try { fn(read().length); } catch {}
  return () => listeners.delete(fn);
}

export function enqueue(type, payload) {
  const queue = read();
  queue.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, type, payload, createdAt: Date.now(), attempts: 0 });
  write(queue);
}

// ── Exécuteurs idempotents ───────────────────────────────────────────────────
const EXECUTORS = {
  // Finalisation d'une séance : on efface d'abord les logs déjà en base pour cette
  // séance (dédoublonnage) puis on recrée, et on marque la séance terminée.
  // Rejouable sans doublon.
  async session_complete(p) {
    const existing = await base44.entities.SeriesLog.filter({ session_id: p.sessionId });
    await Promise.all(existing.map((l) => base44.entities.SeriesLog.delete(l.id)));
    await Promise.all((p.logs || []).map((l) =>
      base44.entities.SeriesLog.create({ session_id: p.sessionId, user_id: p.userId, ...l })
    ));
    await base44.entities.Session.update(p.sessionId, {
      status: 'completed',
      actual_date: p.actual_date,
      actual_duration: p.actual_duration,
      global_fatigue: p.fatigue,
      notes: p.notes,
    });
  },
};

// Rejoue la file, en tête d'abord. S'arrête au premier échec (on réessaiera plus
// tard). Une opération de type inconnu ou qui échoue trop souvent est écartée
// pour ne pas bloquer indéfiniment la file.
const MAX_ATTEMPTS = 6;

export async function flushQueue() {
  if (flushing) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  if (!read().length) return;
  flushing = true;
  let synced = 0;
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const queue = read();
      if (!queue.length) break;
      const op = queue[0];
      const exec = EXECUTORS[op.type];
      if (!exec) { write(queue.filter((x) => x.id !== op.id)); continue; }
      try {
        await exec(op.payload);
        write(read().filter((x) => x.id !== op.id));
        synced++;
      } catch (e) {
        // Échec probablement réseau → on garde et on réessaiera. Si une opération
        // échoue de façon répétée (donnée invalide), on l'écarte après N tentatives
        // pour ne pas bloquer les suivantes.
        const q = read();
        const cur = q.find((x) => x.id === op.id);
        if (cur) {
          cur.attempts = (cur.attempts || 0) + 1;
          if (cur.attempts >= MAX_ATTEMPTS && (typeof navigator === 'undefined' || navigator.onLine)) {
            console.warn('[sync] opération écartée après échecs répétés :', op.type, e);
            write(q.filter((x) => x.id !== op.id));
            continue;
          }
          write(q);
        }
        break;
      }
    }
  } finally {
    flushing = false;
  }
  return synced;
}
