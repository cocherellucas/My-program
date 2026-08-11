// Instantané du profil au moment de la génération, et détection d'obsolescence.
//
// UNE seule liste de champs, partagée par les deux usages. Elles vivaient
// séparément — Program.jsx écrivait onze champs, Profile.jsx en comparait sept —
// et deux des champs comparés n'étaient jamais écrits : `training_context` et
// `availability_optimal`. Ils valaient donc `undefined` dans l'instantané et
// autre chose dans le profil, si bien que la comparaison échouait TOUJOURS. Le
// bandeau « ton programme n'est plus optimisé » apparaissait pour n'importe quel
// changement, même le sexe, et revenait aussitôt après une régénération.

import { tierDuContexte } from './equipment';

const CLE = 'program_generated_snapshot';

// Champs LUS par la génération de programme (src/lib/program-activation.js).
// Ni plus — sinon l'app réclame une régénération pour des réglages sans effet —
// ni moins : `training_context` fait basculer de catalogue (salle ↔ poids du
// corps), l'oublier laissait passer un vrai changement.
export const CHAMPS_PROGRAMME = [
  'level',
  'training_context',
  'equipment',
  'availability_optimal',
  'available_days',
  'duration_per_day',
  'frequency_max',
];

/** Enregistre l'état du profil ayant servi à construire le programme. */
export function ecrireSnapshot(user) {
  const snapshot = {};
  for (const champ of CHAMPS_PROGRAMME) snapshot[champ] = user?.[champ] ?? null;
  try { localStorage.setItem(CLE, JSON.stringify(snapshot)); } catch { /* stockage plein ou bloqué */ }
}

export function lireSnapshot() {
  try { return JSON.parse(localStorage.getItem(CLE) || 'null'); } catch { return null; }
}

export function effacerSnapshot() {
  try { localStorage.removeItem(CLE); } catch { /* rien à faire */ }
}

/**
 * Le programme est-il périmé par rapport au profil courant ?
 * Un champ ABSENT de l'instantané est ignoré : les instantanés écrits avant
 * l'ajout d'un champ n'en portent pas la trace, et on ne peut pas conclure d'une
 * absence qu'il y a eu changement — sinon tous les utilisateurs existants
 * verraient le bandeau à tort.
 */
export function programmePerime(profil, snapshot) {
  if (!snapshot) return false;
  return CHAMPS_PROGRAMME.some((champ) => {
    if (!(champ in snapshot)) return false;
    return valeurComparable(champ, profil?.[champ]) !== valeurComparable(champ, snapshot[champ]);
  });
}

// Deux champs ne peuvent pas être comparés bruts, sinon le bandeau s'affiche pour
// des changements qui ne changent RIEN au programme :
//   • `training_context` : « salle complète » et « personnalisé » pointent vers le
//     même catalogue. Basculer de l'un à l'autre avec le même matériel produisait
//     un programme identique et affichait quand même le bandeau (vérifié).
//   • `equipment` : c'est un ENSEMBLE. Cocher le même matériel dans un autre ordre
//     donnait deux listes différentes pour un contenu identique.
function valeurComparable(champ, valeur) {
  if (champ === 'training_context') return tierDuContexte(valeur);
  if (champ === 'equipment') {
    const liste = Array.isArray(valeur)
      ? valeur
      : (() => { try { return JSON.parse(valeur || '[]'); } catch { return []; } })();
    return JSON.stringify([...new Set(liste)].sort());
  }
  return JSON.stringify(valeur ?? null);
}
