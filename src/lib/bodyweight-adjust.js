// Réglage de difficulté au poids du corps — « plus simple » / « plus dur ».
//
// POURQUOI CE FICHIER PLUTÔT QU'UNE TABLE DE VARIANTES
// Lucas a passé en revue les 34 exercices au poids du corps sans chaîne de
// progression. Dans 30 cas sur 34, ce qu'il décrit n'est PAS un autre exercice :
// c'est le même mouvement avec un réglage. Et toujours les quatre mêmes :
//
//   • BRAS DE LEVIER — rapprocher ou éloigner les segments du point d'appui
//   • ASSISTANCE     — un genou au sol, un mur, une chaise, les jambes qui poussent
//   • LEST           — sac à dos, poids au bout des membres, élastique
//   • UNILATÉRAL     — un bras, une jambe
//
// Sa remarque revient MOT POUR MOT cinq fois pour les cinq pompes (« sur les
// genoux, contre un mur et pour plus dur il faut mettre un sac à dos ou
// élastique »). Une table exercice → variante aurait donc recopié une même règle
// cinq fois. On déclare les règles UNE fois, par famille, et on ne nomme
// individuellement que les exercices qui échappent à leur famille.
//
// Ce fichier REMPLACE les anciennes « chaînes de progression »
// (src/lib/progression-chains.js, supprimé). Sur leurs 48 étapes, 47 nommaient
// des exercices ABSENTS de la base : « Pompes sur les genoux », « Traction
// assistée élastique »… n'existaient nulle part. Le bouton « variante plus
// simple » renommait donc l'exercice de la séance vers un nom inconnu de l'app —
// la consigne disparaissait, le GIF aussi, et l'historique de performances
// repartait de zéro sur ce nom. Seul « Pistol squat » existait réellement.
//
// Il alimente deux choses, et uniquement pour les exercices listés ici :
//   • le contenu du « ? » (bloc « Ajuster la difficulté ») ;
//   • les boutons de la bulle de coaching en séance, qui expliquent le réglage
//     au lieu de renommer l'exercice.
//
// Les textes reprennent les formulations de Lucas, remises au propre.

// `charge: true` → l'exercice se durcit en ajoutant du POIDS (sac à dos, lest).
// C'est ce drapeau, et lui seul, qui autorise les boutons rapides de charge en
// séance. Il vaut false quand passer au niveau supérieur est une affaire de
// technique et non de kilos : un handstand push-up ne s'obtient pas en
// remplissant un sac.
//
// Rien n'est proposé pour un exercice absent de ces tables : les boutons ne
// s'affichent QUE pour la liste passée en revue, jamais par défaut.

// Règles par FAMILLE — déclarées une seule fois.
const FAMILLES = {
  // Les 25 exercices « avec sac » : leur progression EST la charge, il n'y a
  // aucune variante à proposer — c'est la conclusion de la revue.
  charge_sac: {
    simple: 'Allège le sac. Si c\'est encore trop, réduis l\'amplitude avant de réduire les répétitions.',
    dur: 'Ajoute du poids dans le sac. C\'est la progression normale de cet exercice — pas besoin d\'en changer.',
    charge: true,
  },
  pompes: {
    simple: 'Pose les genoux au sol, ou fais-les debout contre un mur — plus tu es proche de la verticale, plus c\'est facile.',
    dur: 'Mets un sac à dos chargé, ou passe un élastique dans le dos. Pieds surélevés sur une chaise pour aller plus loin.',
    charge: true,
  },
  dips_chaises: {
    simple: 'Aide-toi en poussant avec les jambes : plus tu gardes de poids dans les pieds, plus c\'est léger.',
    dur: 'Pose un sac chargé sur les cuisses, et tends les jambes pour mettre tout le poids sur les bras.',
    charge: true,
  },
  tractions: {
    simple: 'Garde les pieds au sol ou sur une chaise et pousse avec les jambes pour t\'aider — juste ce qu\'il faut pour finir la série.',
    dur: 'Sac à dos chargé. Quand ça passe facilement, va vers la version à un bras assistée.',
    charge: true,
  },
  gainage: {
    simple: 'Descends sur les genoux, ou pose l\'avant-bras au sol — et rapproche les appuis l\'un de l\'autre.',
    dur: 'Éloigne les appuis, tends le bras libre, ou tiens une charge. Un sac sur le bas du dos marche aussi.',
    charge: true,
  },
  // Abdos au sol : la difficulté vient de la longueur du bras de levier.
  abdos_levier: {
    simple: 'Replie les jambes et rapproche-les du buste : plus les segments sont courts, plus c\'est facile.',
    dur: 'Tends les jambes et les bras pour allonger le levier, puis ajoute un poids au bout (pieds ou mains).',
    charge: true,
  },
  squat_fente: {
    simple: 'Tiens-toi à un support (chaise, mur, poignée de porte) et laisse-le prendre une partie du poids. Réduis aussi la profondeur.',
    dur: 'Sac à dos chargé, ou une charge tenue à bout de bras. Ensuite, passe sur une seule jambe.',
    charge: true,
  },
  mollets: {
    simple: 'Fais-le sur les deux pieds plutôt qu\'un seul.',
    dur: 'Sac à dos chargé, ou un poids dans chaque main. Sur une marche pour gagner de l\'amplitude.',
    charge: true,
  },
  hanche: {
    simple: 'Plie la jambe qui travaille pour raccourcir le levier.',
    dur: 'Jambe tendue, et un poids attaché ou posé en bout de jambe.',
    charge: true,
  },
};

// Exercice → famille. Un exercice absent d'ici n'affiche aucun réglage : mieux
// vaut ne rien dire qu'un conseil générique qui ne correspond pas au mouvement.
const PAR_EXERCICE = {
  // ── Pompes et dérivés ──
  'Pompe': 'pompes',
  'Pompe large': 'pompes',
  'Pompe pieds surélevés (chaise)': 'pompes',
  'Pompe large pieds surélevés (chaise)': 'pompes',
  'Pompe diamant': 'pompes',
  'Pompes piquées': 'pompes',

  // ── Appuis type dips ──
  'Dips entre deux chaises (buste droit)': 'dips_chaises',
  'Dips entre deux chaises (buste penché)': 'dips_chaises',

  // ── Tirage ──
  'Tirage australien': 'tractions',
  'Traction pronation (barre de fortune)': 'tractions',
  'Traction supination (barre de fortune)': 'tractions',

  // ── Gainage ──
  'Planche': 'gainage',
  'Gainage latéral': 'gainage',
  'Mountain climbers': 'gainage',

  // ── Abdos, réglage par le bras de levier ──
  'Crunch au sol': 'abdos_levier',
  'Relevés de jambes au sol': 'abdos_levier',
  'Hollow body hold': 'abdos_levier',
  'L-sit au sol': 'abdos_levier',
  'Russian twist': 'abdos_levier',
  'Dead bug': 'abdos_levier',
  'Dragon flag': 'abdos_levier',

  // ── Jambes ──
  'Squat au poids du corps': 'squat_fente',
  'Fentes alternées': 'squat_fente',
  'Fente bulgare (chaise)': 'squat_fente',
  'Sissy squat': 'squat_fente',
  'Pistol squat': 'squat_fente',
  'Wall sit': 'squat_fente',
  'Burpees': 'squat_fente',
  'Pont fessier au sol': 'squat_fente',

  'Mollets unilatéraux poids du corps': 'mollets',
  'Abduction de hanche allongé sur le côté': 'hanche',
  'Copenhagen plank': 'hanche',

  // ── Les 25 « avec sac » : progression = charge, aucune variante ──
  'Curl avec sac': 'charge_sac',
  'Curl avec sac alterné': 'charge_sac',
  'Curl incliné sur chaise avec sac': 'charge_sac',
  'Curl marteau avec sac': 'charge_sac',
  'Pullover avec sac': 'charge_sac',
  'Rowing avec sac': 'charge_sac',
  'Rowing bûcheron avec sac': 'charge_sac',
  'Rowing unilatéral avec sac': 'charge_sac',
  'Soulevé de terre avec sac': 'charge_sac',
  'Élévations latérales avec sac ou bouteilles': 'charge_sac',
  'Face pull avec sac': 'charge_sac',
  'Oiseau avec sac ou bouteilles': 'charge_sac',
  'Pont fessier avec sac ou unilatéral': 'charge_sac',
  'Good morning avec sac': 'charge_sac',
  'Leg curl au sol avec sac': 'charge_sac',
  'Soulevé de terre roumain avec sac': 'charge_sac',
  'Mollets assis avec sac': 'charge_sac',
  'Mollets unilatéraux avec sac': 'charge_sac',
  'Fente marchée avec sac': 'charge_sac',
  'Front squat avec sac': 'charge_sac',
  'Leg extension assis avec sac': 'charge_sac',
  'Squat avec sac': 'charge_sac',
  'Extension triceps avec sac': 'charge_sac',
  'Kickback triceps avec sac': 'charge_sac',
  'Skull crusher avec sac': 'charge_sac',
};

// Exercices dont le réglage ne suit PAS sa famille — remarques spécifiques.
const EXCEPTIONS = {
  'Crunch au sol': {
    simple: 'Attrape un pied de meuble ou un support derrière toi pour t\'aider à monter.',
    dur: 'Tends les bras au-dessus de la tête (ça suffit à durcir nettement), puis tiens un sac chargé entre les mains.',
    charge: true,
  },
  'Wall sit': {
    simple: 'Reste plus haut : moins tu plies les genoux, plus c\'est tenable.',
    dur: 'Descends jusqu\'à 90° aux genoux, et pose une charge sur les cuisses.',
    charge: true,
  },
  'Copenhagen plank': {
    simple: 'Rapproche-toi du banc et pose le genou dessus plutôt que le pied.',
    dur: 'Pose un sac sur la hanche du dessus.',
    charge: true,
  },
  'Nordic curl': {
    simple: 'Penche le buste vers l\'avant en gardant les fessiers près des mollets : ça raccourcit le bras de levier.',
    dur: 'Buste droit du début à la fin, puis lest sur le haut du dos.',
    charge: true,
  },
  'Burpees': {
    simple: 'Fais la pompe sur les genoux (ou saute-la), et remplace le saut par une simple extension debout.',
    dur: 'Sac à dos chargé, et cherche de la hauteur sur le saut.',
    charge: true,
  },
  'Pont fessier au sol': {
    simple: 'Garde les deux pieds au sol et rapproche les talons des fessiers.',
    dur: 'Passe sur une seule jambe, ou pose un sac chargé sur le bassin.',
    charge: true,
  },
  // Les deux seuls où la marche suivante est une question de TECHNIQUE et non de
  // kilos : pas de bouton de charge, ce serait un mauvais conseil.
  'Pompes piquées': {
    simple: 'Recule les pieds pour redresser le buste — plus tu es proche de la pompe classique, plus c\'est facile.',
    dur: 'Pieds sur une chaise, puis passe au handstand push-up contre un mur.',
    charge: false,
  },
  'Handstand push-up contre un mur': {
    simple: 'Reviens à la pompe piquée pieds surélevés, c\'est le même mouvement avec moins de poids sur les bras.',
    dur: 'Descends plus bas en surélevant les mains sur deux appuis.',
    charge: false,
  },
  'Mollets unilatéraux poids du corps': FAMILLES.mollets,
};

/**
 * Réglages « plus simple / plus dur » d'un exercice au poids du corps.
 * @returns {{simple: string, dur: string} | null}
 */
export function reglagesPoidsDuCorps(nomExercice) {
  const exception = EXCEPTIONS[nomExercice];
  if (exception) return exception;
  const famille = PAR_EXERCICE[nomExercice];
  return famille ? FAMILLES[famille] : null;
}
