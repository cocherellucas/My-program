// ═══════════════════════════════════════════════════════════════════════════
// gym-presets.js
// Équipements types par enseigne de salle commerciale française
//
// USAGE :
//   import { GYM_PRESETS, getGymPreset } from './gym-presets';
//   const preset = getGymPreset('Fitness Park'); // → { equipment, training_context, note }
//
// NOTE : Les noms correspondent EXACTEMENT aux chaînes de StepEquipment.
//
// ⚠️  Ces listes sont les configurations TYPIQUES de chaque enseigne.
//   Certaines salles peuvent avoir plus ou moins d'équipements selon
//   leur taille et leur date d'ouverture. L'utilisateur peut modifier
//   la sélection après avoir choisi son enseigne.
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTES PARTAGÉES
// Blocs d'équipements communs à plusieurs enseignes
// ─────────────────────────────────────────────────────────────────────────

const BASE_BARBELL = [
  'Barre olympique',
  'Barre EZ',
  'Rack squat',
  'Banc plat',
  'Banc réglable',
  'Disques olympiques',
];

const FULL_BARBELL = [
  ...BASE_BARBELL,
  'Rack demi-cage',
  'Banc décliné',
];

const BASE_FREE_WEIGHTS = [
  'Haltères',
  'Kettlebells',
];

const BASE_CABLES = [
  'Câble poulie haute',
  'Câble poulie basse',
  'Station câbles double',
];

const FULL_CABLES = [
  ...BASE_CABLES,
  'Poulie réglable',
];

const BASE_PULLUP = [
  'Barre de traction',
  'Barre de dips',
];

// ─────────────────────────────────────────────────────────────────────────
// MACHINES — noms exacts de StepEquipment / exercise-database.js
// ─────────────────────────────────────────────────────────────────────────

// Machines présentes dans TOUTES les salles commerciales standards
const MACHINES_STANDARD = [
  'Leg press',
  'Leg extension',
  'Leg curl allongé',
  'Pec deck',
  'Tirage vertical',              // lat pulldown machine
  'Rowing assis machine',         // seated cable row machine
  'Rowing horizontal machine',
  'Développé couché machine',
  'Développé épaules machine',
  'Curl biceps machine',
  'Triceps machine',
  'Abducteur machine',
  'Adducteur machine',
  'Mollets debout machine',
  'Mollets assis machine',
  'Crunch abdos machine',
];

// Machines présentes dans les salles mid/premium mais pas partout
const MACHINES_MID = [
  ...MACHINES_STANDARD,
  'Hack squat machine',
  'Leg curl assis',
  'Hip thrust machine',
  'Développé incliné machine',
  'Pullover machine',
  'Rowing T-bar machine',
  'Preacher curl machine',
  'Dips triceps machine',
  'Élévations latérales machine',
  'Captain chair',
  'Rotation obliques machine',
];

// Machines des grandes salles bien équipées
const MACHINES_PREMIUM = [
  ...MACHINES_MID,
  'Fessier machine',
  'Élévations frontales machine',
  'Belt squat machine',
];

// ─────────────────────────────────────────────────────────────────────────
// PRESETS PAR ENSEIGNE
// ─────────────────────────────────────────────────────────────────────────

export const GYM_PRESETS = {

  // ── BASIC-FIT ──────────────────────────────────────────────────────────
  // Low-cost, ~200 salles en France. Setup standardisé.
  // PAS de rack demi-cage dans la plupart, pas de trap bar.
  // Kettlebells présents dans ~60% des salles.
  'Basic-Fit': {
    training_context: 'full_gym',
    equipment: [
      ...BASE_BARBELL,
      'Smith machine',
      'Haltères',
      // Kettlebells : présents dans beaucoup mais pas toutes
      // Laisser l'utilisateur confirmer
      ...BASE_CABLES,
      ...BASE_PULLUP,
      ...MACHINES_STANDARD,
      'Corde à sauter',
    ],
    note: 'Kettlebells selon la salle. Pas de rack demi-cage dans la majorité des locations.',
  },

  // ── FITNESS PARK ──────────────────────────────────────────────────────
  // Mid-range, ~350 clubs. Un des plus équipés de France.
  // Setup très complet, souvent rack demi-cage et trap bar dans les grandes salles.
  'Fitness Park': {
    training_context: 'full_gym',
    equipment: [
      ...FULL_BARBELL,
      'Smith machine',
      ...BASE_FREE_WEIGHTS,
      'Disques olympiques',
      ...FULL_CABLES,
      ...BASE_PULLUP,
      'Barres parallèles',
      ...MACHINES_MID,
      'Swiss ball',
      'Corde à sauter',
      'Boîte pliométrique',
      'Mini-bands',
      'Élastiques de résistance',
    ],
    note: 'Trap bar et Barre trap/hex selon la taille de la salle.',
  },

  // ── ORANGE BLEUE ──────────────────────────────────────────────────────
  // Mid-range, ~470 clubs. Réseau le plus étendu en France.
  // Setup correct mais plus variable selon les salles (franchise).
  'Orange Bleue': {
    training_context: 'full_gym',
    equipment: [
      ...BASE_BARBELL,
      'Smith machine',
      ...BASE_FREE_WEIGHTS,
      ...BASE_CABLES,
      ...BASE_PULLUP,
      ...MACHINES_STANDARD,
      'Swiss ball',
      'Élastiques de résistance',
    ],
    note: 'Rack demi-cage et Kettlebells selon les salles (franchise, équipement variable).',
  },

  // ── NEONESS ──────────────────────────────────────────────────────────
  // Mid-range, urban (Paris/IDF principalement).
  // Bon équipement câbles et poids libres. Pas toujours de gros barbell setup.
  'Neoness': {
    training_context: 'full_gym',
    equipment: [
      ...BASE_BARBELL,
      'Smith machine',
      ...BASE_FREE_WEIGHTS,
      ...FULL_CABLES,
      ...BASE_PULLUP,
      ...MACHINES_STANDARD,
      'Swiss ball',
      'Mini-bands',
    ],
    note: 'Rack demi-cage rare. Focus poids libres et câbles.',
  },

  // ── KEEPCOOL ──────────────────────────────────────────────────────────
  // Mid-range, ~200 clubs. Setup standard salle commerciale.
  'Keepcool': {
    training_context: 'full_gym',
    equipment: [
      ...BASE_BARBELL,
      'Smith machine',
      'Haltères',
      ...BASE_CABLES,
      ...BASE_PULLUP,
      ...MACHINES_STANDARD,
      'Élastiques de résistance',
    ],
    note: 'Équipement standard. Kettlebells selon la salle.',
  },

  // ── L'APPART FITNESS ─────────────────────────────────────────────────
  // Low-mid, ~100 clubs. Tailles variables (certaines salles petites).
  "L'Appart Fitness": {
    training_context: 'full_gym',
    equipment: [
      ...BASE_BARBELL,
      'Smith machine',
      'Haltères',
      ...BASE_CABLES,
      'Barre de traction',
      ...MACHINES_STANDARD,
    ],
    note: 'Petites salles : équipement parfois réduit. Vérifier sur place.',
  },

  // ── ON AIR ───────────────────────────────────────────────────────────
  // Premium boutique, Paris/grandes villes. Philosophie training fonctionnel.
  // Souvent PAS de barbell classique. Focus kettlebells, câbles, TRX.
  'On Air': {
    training_context: 'full_gym',
    equipment: [
      'Haltères',
      'Kettlebells',
      ...FULL_CABLES,
      'Barre de traction',
      'Barre de dips',
      'Barres parallèles',
      'Sangles TRX',
      ...MACHINES_STANDARD,
      'Swiss ball',
      'Medicine ball',
      'Boîte pliométrique',
      'Mini-bands',
      'Élastiques de résistance',
      'Corde à sauter',
    ],
    note: 'Peu ou pas de barbell libre selon la salle. Focus fonctionnel.',
  },

  // ── MOVING ───────────────────────────────────────────────────────────
  // Mid-range, réseau régional.
  'Moving': {
    training_context: 'full_gym',
    equipment: [
      ...BASE_BARBELL,
      'Smith machine',
      'Haltères',
      ...BASE_CABLES,
      ...BASE_PULLUP,
      ...MACHINES_STANDARD,
    ],
    note: 'Setup classique salle commerciale.',
  },

};

// ─────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Retourne le preset complet pour une enseigne donnée.
 * @param {string} gymName
 * @returns {{ equipment: string[], training_context: string, note: string } | null}
 */
export function getGymPreset(gymName) {
  return GYM_PRESETS[gymName] ?? null;
}

/**
 * Liste toutes les enseignes disponibles.
 * @returns {string[]}
 */
export function getGymNames() {
  return Object.keys(GYM_PRESETS);
}

/**
 * Fusionne un preset avec des overrides utilisateur.
 * @param {string}   gymName   - Enseigne sélectionnée
 * @param {string[]} additions - Équipements à ajouter
 * @param {string[]} removals  - Équipements à supprimer
 * @returns {string[]}
 */
export function mergeGymEquipment(gymName, additions = [], removals = []) {
  const preset = GYM_PRESETS[gymName];
  if (!preset) return [];

  const base = new Set(preset.equipment);
  additions.forEach(e => base.add(e));
  removals.forEach(e => base.delete(e));

  return [...base];
}

// ─────────────────────────────────────────────────────────────────────────
// LISTE DES ENSEIGNES POUR L'UI
// ─────────────────────────────────────────────────────────────────────────

export const GYM_CHAINS_UI = [
  { key: 'Basic-Fit',          label: 'Basic-Fit',          color: '#F05A00' },
  { key: 'Fitness Park',       label: 'Fitness Park',       color: '#1A2535' },
  { key: 'Orange Bleue',       label: 'Orange Bleue',       color: '#1A7BC4' },
  { key: 'Keepcool',           label: 'Keepcool',           color: '#00BA96' },
  { key: "L'Appart Fitness",   label: "L'Appart Fitness",   color: '#F26522' },
  { key: 'Moving',             label: 'Moving',             color: '#00AEEF' },
  { key: 'Neoness',            label: 'Neoness',            color: '#E0003C' },
  { key: 'On Air',             label: 'On Air',             color: '#A81212' },
];
