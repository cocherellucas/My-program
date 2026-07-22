// ─────────────────────────────────────────────────────────────────────────────
// Outil de TEST — voyage dans le temps côté client.
//
// Décale la date « aujourd'hui » vue par l'app, SANS toucher aucune donnée
// serveur (non destructif) et réversible instantanément. Utile pour tester les
// fonctions qui dépendent du temps (cycle menstruel, etc.).
//
// Utilisation depuis la console du navigateur (F12) :
//   __time.advance()     → +7 jours (avance d'une semaine)
//   __time.advance(3)    → +3 jours
//   __time.back()        → −7 jours
//   __time.reset()       → retour au temps réel
//   __time.status()      → affiche le décalage actuel + la date simulée
//
// ⚠️ Outil de dev : à retirer avant commercialisation.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'dev_time_offset_ms';
const DAY = 86400000;

function getOffset() {
  try { return parseInt(localStorage.getItem(KEY) || '0', 10) || 0; } catch { return 0; }
}
function setOffset(ms) {
  try { if (ms) localStorage.setItem(KEY, String(ms)); else localStorage.removeItem(KEY); } catch {}
}

// Date « maintenant » décalée. À utiliser à la place de `new Date()` là où on veut
// que le voyage dans le temps s'applique.
export function devNow() { return new Date(Date.now() + getOffset()); }
export function devOffsetDays() { return Math.round(getOffset() / DAY); }

if (typeof window !== 'undefined') {
  window.__time = {
    advance(days = 7) { setOffset(getOffset() + days * DAY); this.status(); location.reload(); },
    back(days = 7) { setOffset(getOffset() - days * DAY); this.status(); location.reload(); },
    reset() { setOffset(0); console.log('[time] ⏳ retour au temps réel'); location.reload(); },
    status() {
      const d = devOffsetDays();
      console.log(`[time] décalage : ${d >= 0 ? '+' : ''}${d} j → aujourd'hui simulé = ${devNow().toLocaleDateString('fr-FR')}`);
      return d;
    },
  };
}
