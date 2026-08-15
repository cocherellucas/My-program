// Vocabulaire des STRUCTURES hebdomadaires — un seul endroit.
//
// Ce module existe parce que la liste des structures connues vivait recopiée
// dans cinq fichiers, avec cinq contenus différents. Conséquence concrète :
// `ul_ppl`, que le catalogue produit bel et bien (profils avancés en salle,
// split `ppl_upper_lower`), n'était déclaré nulle part et n'avait aucun libellé.
// Le même programme s'affichait donc « struct_ul_ppl » en toutes lettres sur la
// carte résumé de l'Accueil, sans badge du tout sur la carte « prochaine
// séance », et se sauvegardait en `structure_type: 'unknown'` — c'est-à-dire
// sans nom — dans la Bibliothèque.
//
// À l'inverse `ppl` et `arnold_split` avaient un libellé partout alors que la
// génération ne les produit jamais : on entretenait des étiquettes mortes et on
// oubliait la vivante.
//
// Structures réellement produites (vérifié en énumérant les combinaisons de
// niveau × contexte × zone × type × nombre de jours) : full_body, upper_lower,
// ul_ppl, custom. `ppl` et `arnold_split` restent listés — ils sont valides et
// traduits, le catalogue peut en contenir un jour.
//
// `phul` n'y figure PAS volontairement : aucune entrée de SPLIT_MAP ne peut le
// produire et aucun libellé n'existe pour lui. Il était toléré par une seule des
// deux listes de Program.jsx, ce qui l'aurait laissé passer jusqu'à l'écran sous
// forme de clé brute.
export const STRUCTURES_CONNUES = ['full_body', 'upper_lower', 'ul_ppl', 'ppl', 'arnold_split', 'custom'];

/** La structure a-t-elle un libellé traduit ? Tolère la casse et les valeurs vides. */
export function estStructureConnue(structure) {
  return STRUCTURES_CONNUES.includes(String(structure || '').toLowerCase());
}

/**
 * Libellé traduit d'une structure, ou '' si elle est inconnue.
 * @param {string} structure  valeur de `weekly_structure` / `structure_type`
 * @param {(k: string) => string} t  fonction de traduction (useI18n)
 */
export function libelleStructure(structure, t) {
  if (!estStructureConnue(structure)) return '';
  return t(`struct_${String(structure).toLowerCase()}`);
}
