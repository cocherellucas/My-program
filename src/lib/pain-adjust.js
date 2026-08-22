// ─────────────────────────────────────────────────────────────────────────────
// SUIVI DE DOULEUR — progression sur l'échelle, SANS toucher au programme.
//
// Ce fichier appliquait les crans de l'échelle aux séances planifiées : −20 % de
// charge, −1 série, retrait des exercices de la zone une séance sur deux, avec
// mémorisation d'un « baseline » pour pouvoir tout restaurer à la remontée.
// Décision du 2026-08-16 : l'app ne modifie plus le programme, elle conseille.
// Tout ce bloc d'écriture est retiré — il ne reste que le suivi du NIVEAU, qui
// sert à savoir où on en est d'une fois sur l'autre et quoi conseiller ensuite.
//
// Ce qui disparaît avec :
//  • toute écriture dans base44.entities.Session (le seul point d'écriture hors
//    séance avec volume-adjust) ;
//  • `baseline` / `removed` — ils n'existaient que pour défaire les
//    modifications, et il n'y a plus rien à défaire ;
//  • l'invalidation des caches de séances, devenue sans objet.
//
// L'ÉCHELLE ELLE-MÊME NE CHANGE PAS : les crans, leur ordre (charge → séries →
// fréquence) et les descriptions restent dans pain-engine (LEVEL_DETAILS). Ce
// sont eux que l'utilisateur lit maintenant comme un conseil à appliquer
// lui-même, avec le guide « comment alléger une semaine » en renfort.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Enregistre le passage à `toLevel` sur l'échelle de réduction.
 * Fonction PURE : elle rend un épisode mis à jour, n'écrit nulle part.
 * (L'appelant reste responsable de le persister via saveEpisodes.)
 */
export function passerAuNiveau(episode, toLevel) {
  if (!episode) return episode;
  const goingUp = toLevel < (episode.level || 0);
  return {
    ...episode,
    level: toLevel,
    // Remonter « consomme » les 2 « mieux » : il en faudra 2 nouveaux pour le
    // cran suivant. Comportement conservé à l'identique.
    betterStreak: goingUp ? 0 : (episode.betterStreak || 0),
  };
}
