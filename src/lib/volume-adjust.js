// ─────────────────────────────────────────────────────────────────────────────
// TRACE DES DÉCHARGES + mémoire des conseils écartés.
//
// Ce fichier appliquait les propositions d'autorégulation aux séances planifiées
// (ajout/retrait de séries, en base). Décision du 2026-08-16 : l'app conseille,
// elle ne modifie plus — `applyVolumeProposal` est retiré, avec son import de
// base44 et l'invalidation des caches.
//
// CONSÉQUENCE À CONNAÎTRE : le bouton « Appliquer » était le SEUL signal qui
// datait une décharge. Sans lui, `derniereDecharge` ne serait plus jamais écrit
// et le compteur « semaines sans décharge » repartirait de la création du
// programme — donc +30 à vie passé 8 semaines sur un programme en boucle,
// exactement le bug corrigé plus bas. La carte de conseil porte donc désormais
// un « J'ai allégé cette semaine » : ce n'est pas l'app qui agit, c'est
// l'utilisateur qui déclare ce qu'il a fait.
// ─────────────────────────────────────────────────────────────────────────────

const HANDLED_KEY = (programId) => `volume_adjust_handled_${programId}`;
const SUPPRESS_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours (≈ 1 semaine d'entraînement)

// ─── Trace des décharges effectuées ──────────────────────────────────────────
// Il n'existait AUCUN enregistrement d'une décharge dans le projet. Le score de
// décharge comptait donc les semaines depuis la création du programme — qui,
// tournant en boucle, n'est jamais recréé : passé 8 semaines, le signal
// « 8+ semaines sans décharge » (+30, soit le seuil de déclenchement) restait
// allumé à vie, même au lendemain d'une décharge.
//
// Stocké en local, comme l'anti-spam ci-dessus. Ce n'est donc PAS synchronisé
// entre appareils : sur un second appareil le compteur repart de la création du
// programme. Pour synchroniser il faudrait une colonne `profiles` ou un champ de
// UserMemory — décision à prendre, pas un oubli.
const DECHARGE_KEY = (programId) => `derniere_decharge_${programId}`;

/** Enregistre qu'une décharge vient d'être appliquée. */
export function marquerDecharge(programId) {
  if (!programId) return;
  try { localStorage.setItem(DECHARGE_KEY(programId), new Date().toISOString()); } catch { /* stockage bloqué */ }
}

/** Date ISO de la dernière décharge appliquée, ou null si aucune. */
export function lireDerniereDecharge(programId) {
  if (!programId) return null;
  try { return localStorage.getItem(DECHARGE_KEY(programId)) || null; } catch { return null; }
}

// Mémorise qu'un conseil a été traité (écarté, ou déclaré fait par l'utilisateur).
// L'anti-spam SURVIT au retrait de l'application : sans lui, une carte de conseil
// resterait affichée en permanence, sans moyen de la refermer.
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
