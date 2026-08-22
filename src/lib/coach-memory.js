// ─────────────────────────────────────────────────────────────────────────────
// MÉMOIRE DU COACH — `UserMemory.coach_notes`
//
// C'est un simple champ texte, une entrée par ligne, injecté EN ENTIER dans
// chaque prompt. Il n'était jamais élagué : au bout de quelques mois on payait
// un pavé à chaque message, et les informations utiles s'y noyaient.
//
// Deux règles, décidées le 2026-08-22 :
//   1. On ne stocke QUE ce que l'utilisateur fait ou signale. Les réponses du
//      coach n'y ont plus leur place — c'est ce qu'il a dit, pas ce qu'il a
//      appris, et c'était de loin le plus gros contributeur (réponses markdown
//      complètes).
//   2. Plafond à LIMITE_ENTREES. Au-delà, les PLUS ANCIENNES tombent : une gêne
//      d'il y a six mois pèse moins qu'une d'hier.
//
// L'utilisateur peut lire et supprimer ses entrées (bouton « mémoire » du
// coach) : c'est sa donnée, et une mémoire qu'on ne peut pas corriger finit
// par se tromper sur quelqu'un sans recours.
// ─────────────────────────────────────────────────────────────────────────────

export const LIMITE_ENTREES = 40;

// Une entrée commence par « [2026-08-22 … ] » ; les lignes suivantes qui ne
// commencent pas par une date appartiennent à l'entrée précédente (le détail
// des douleurs par série est écrit sur plusieurs lignes).
const DEBUT_ENTREE = /^\[(\d{4}-\d{2}-\d{2})([^\]]*)\]\s*(.*)$/;

/** Texte brut → liste d'entrées { date, source, texte, brut }. */
export function lireNotes(brut) {
  const lignes = String(brut || '').split('\n');
  const entrees = [];
  for (const ligne of lignes) {
    const m = ligne.match(DEBUT_ENTREE);
    if (m) {
      entrees.push({ date: m[1], source: (m[2] || '').replace(/^\s*—\s*/, '').trim(), texte: m[3], brut: ligne });
    } else if (entrees.length && ligne.trim()) {
      // Ligne de continuation : on la rattache à l'entrée en cours.
      const e = entrees[entrees.length - 1];
      e.texte += '\n' + ligne.trim();
      e.brut += '\n' + ligne;
    } else if (ligne.trim()) {
      // Entrée sans date (ancien format) — conservée telle quelle.
      entrees.push({ date: '', source: '', texte: ligne.trim(), brut: ligne });
    }
  }
  return entrees;
}

/** Liste d'entrées → texte brut à réenregistrer. */
export function ecrireNotes(entrees) {
  return entrees.map((e) => e.brut).join('\n');
}

// Marqueur de source pour une note ÉCRITE PAR L'UTILISATEUR. Volontairement
// stable et non traduit : il sert de test dans le code, et un mot traduit
// aurait cessé d'être reconnu au changement de langue. L'affichage, lui, le
// traduit (voir `cm_source_you`).
export const SOURCE_PERSO = 'perso';

/** Cette entrée a-t-elle été écrite par l'utilisateur lui-même ? */
export function estNotePerso(entree) {
  return entree?.source === SOURCE_PERSO;
}

/**
 * Ajoute une note, SANS jamais rien supprimer.
 *
 * Décision du 2026-08-22 : **aucune éviction automatique**. Ni les notes
 * écrites à la main, ni les observations de l'app. Une gêne signalée il y a
 * trois mois peut être précisément l'information qui explique la douleur
 * d'aujourd'hui — la machine n'a aucun moyen de savoir laquelle compte, donc
 * elle ne choisit pas. Quand c'est plein, c'est à l'utilisateur de faire le tri.
 *
 * Retourne le texte INCHANGÉ si la note est déjà présente ou si le plafond est
 * atteint. L'appelant doit donc prévenir l'utilisateur (voir `memoirePleine`).
 */
export function ajouterNote(brut, note) {
  if (!note) return brut || '';
  const anciennes = lireNotes(brut);
  // Déduplication sur le texte complet, pas sur les 40 premiers caractères :
  // deux gênes différentes au même endroit commencent souvent pareil.
  if (anciennes.some((e) => e.brut.trim() === String(note).trim())) return brut || '';

  const entrees = [...anciennes, ...lireNotes(note)];
  if (entrees.length > LIMITE_ENTREES) return brut || ''; // plein : on n'écrase rien
  return ecrireNotes(entrees);
}

/** Le plafond est-il atteint ? Plus rien ne s'enregistre tant qu'on n'a pas trié. */
export function memoirePleine(brut) {
  return lireNotes(brut).length >= LIMITE_ENTREES;
}

// Seuil d'alerte, aligné sur la couleur ambre de l'anneau.
export const SEUIL_ALERTE = 0.75;

/**
 * Assez pleine pour prévenir, pas encore bloquée.
 * Sans ça, l'utilisateur découvre le mur au moment où il veut écrire — alors
 * qu'il aurait pu trier tranquillement avant.
 */
export function memoireBientotPleine(brut) {
  const n = lireNotes(brut).length;
  return n >= LIMITE_ENTREES * SEUIL_ALERTE && n < LIMITE_ENTREES;
}

/** Part du plafond occupée, entre 0 et 1 — pour la jauge circulaire. */
export function tauxRemplissage(brut) {
  return Math.min(1, lireNotes(brut).length / LIMITE_ENTREES);
}
