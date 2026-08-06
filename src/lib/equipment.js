// Vocabulaire du MATÉRIEL — un seul endroit pour dire « ce que l'utilisateur
// possède permet-il de faire cet exercice ? ».
//
// Pourquoi ce fichier : l'écran Équipement nomme deux fois le même objet selon
// la section où il apparaît. La liste « street » propose « Barre de traction
// haute » et « Sangles de suspension (TRX) », là où la section Suspension &
// Traction — et la base d'exercices — disent « Barre de traction » et
// « Sangles TRX ». Un utilisateur au poids du corps se retrouvait donc SANS
// aucune traction ni exercice TRX : son matériel ne correspondait à rien.
//
// On ne RENOMME pas : les profils déjà enregistrés contiennent les anciens
// noms. On ÉLARGIT — chaque nom déclaré vaut aussi pour ses équivalents.

// Équivalences : nom déclaré → noms qui comptent aussi comme possédés.
// Uniquement des objets réellement identiques, jamais des substitutions
// d'entraînement (un sac à dos lesté n'est pas déclaré équivalent à un gilet :
// ça, c'est une décision de coaching, pas de vocabulaire).
const EQUIVALENCES = {
  'Barre de traction haute': ['Barre de traction'],
  'Sangles de suspension (TRX)': ['Sangles TRX'],
};

/**
 * Matériel possédé, équivalences comprises. Accepte une liste ou le JSON
 * stocké en base (le champ `equipment` du profil peut être l'un ou l'autre).
 */
export function equipementPossede(equipment) {
  const liste = Array.isArray(equipment)
    ? equipment
    : (() => { try { return JSON.parse(equipment || '[]'); } catch { return []; } })();
  const set = new Set(liste);
  for (const item of liste) for (const alias of EQUIVALENCES[item] || []) set.add(alias);
  return set;
}

/**
 * Un exercice est faisable si AU MOINS UNE de ses options de matériel est
 * entièrement possédée. Un exercice sans exigence est toujours faisable.
 */
export function exerciceFaisable(exercice, possede) {
  const options = exercice?.equipmentOptions;
  if (!options?.length) return false; // pas d'option connue → on ne l'invente pas
  return options.some((opt) => opt.every((item) => possede.has(item)));
}
