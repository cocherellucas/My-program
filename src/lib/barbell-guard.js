// Garde-fou BARRE : un objectif de force sur un mouvement précis exige le
// matériel de ce mouvement. Sans lui, aucun programme n'existe — l'app dérive
// alors autre chose, avec les temps de repos de la force, et l'utilisateur se
// retrouve avec des séances interminables pour un objectif qu'il ne peut de
// toute façon pas travailler.
//
// On ne vérifie QUE la barre : un rack ou un banc peuvent s'improviser, une
// barre olympique non. La traction lestée est volontairement absente de la
// liste — une porte, un escalier ou une barre de parc suffisent.
//
// Ce contrôle vivait uniquement dans l'onboarding. Depuis le profil, on pouvait
// donc garder un objectif « squat » et passer à « aucun matériel » sans que rien
// ne l'empêche. Il est désormais partagé par les deux écrans, et il se déclenche
// des DEUX côtés : quand on change d'objectif, et quand on change de matériel.
import { equipementPossede } from './equipment';

const BARBELL = 'Barre olympique';

// Mouvement → nom tel qu'on l'écrit à l'utilisateur.
const MOUVEMENTS_A_BARRE = {
  'Squat barre': 'Squat',
  'Développé couché': 'Développé couché',
  'Soulevé de terre': 'Soulevé de terre',
};

/**
 * @returns {string} '' si tout va bien, sinon le message à afficher.
 */
export function messageBarreManquante(equipment, objectives) {
  const possede = equipementPossede(equipment);
  if (possede.has(BARBELL)) return '';

  const manquants = [];
  for (const o of objectives || []) {
    const movs = Array.isArray(o?.focus_movement)
      ? o.focus_movement
      : (o?.focus_movement ? String(o.focus_movement).split(',').map((s) => s.trim()) : []);
    for (const mv of movs) {
      const label = MOUVEMENTS_A_BARRE[mv];
      if (label && !manquants.includes(label)) manquants.push(label);
    }
  }
  if (!manquants.length) return '';

  const liste = manquants.length > 1
    ? `${manquants.slice(0, -1).join(', ')} et ${manquants[manquants.length - 1]}`
    : manquants[0];
  return `${liste} ${manquants.length > 1 ? 'demandent' : 'demande'} une barre — impossible avec ton matériel actuel. `
    + `Ajoute une barre, ou choisis un autre objectif.`;
}
