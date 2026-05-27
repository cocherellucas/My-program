/**
 * Chaînes de progression biomécanique par famille de mouvement.
 * Chaque chaîne est ordonnée du plus simple au plus difficile.
 * Utilisé pour enrichir les prompts IA avec un contexte précis.
 */

export const PROGRESSION_CHAINS = {
  // ── POUSSÉ HORIZONTAL ──────────────────────────────────────────────────────
  pompes: [
    "Pompes sur les genoux",
    "Pompes normales",
    "Pompes pieds surélevés",
    "Pompes archer",
    "Pompes 1 bras sur les genoux",
    "Pompes 1 bras",
  ],
  dips: [
    "Dips triceps banc (jambes fléchies)",
    { or: ["Dips triceps banc (jambes tendues)", "Dips triceps pieds surélevés"] },
    { or: ["Dips barres parallèles assistés élastique", "Dips barres parallèles (descente seule)"] },
    "Dips barres parallèles",
  ],

  // ── TIRAGE VERTICAL ────────────────────────────────────────────────────────
  tractions: [
    "Traction australienne (rowing barre basse)",
    "Traction assistée élastique",
    "Traction prise neutre",
    "Traction supination",
    "Traction prise large",
    "Traction",
    "Traction 1 bras assistée élastique",
    "Traction 1 bras",
  ],


  // ── SQUAT / JAMBES ─────────────────────────────────────────────────────────
  squat: [
    "Squat assisté (chaise derrière)",
    "Squat",
    "Squat goblet haltère",
    "Fente bulgare",
    "Pistol squat assisté (TRX/anneau)",
    "Pistol squat",
  ],
  fente: [
    "Fente statique poids de corps",
    "Fente marchée poids de corps",
    "Fente marchée haltères",
    "Fente bulgare poids de corps",
    "Fente bulgare haltères",
    "Fente bulgare barre",
  ],
  "pont fessier": [
    "Pont fessier sol poids de corps",
    "Pont fessier sur banc",
    "Hip thrust poids de corps",
    "Hip thrust haltère/plaque",
    "Hip thrust barre",
    "Pont fessier 1 jambe sol",
    "Hip thrust 1 jambe",
  ],

  // ── GAINAGE / CORE ─────────────────────────────────────────────────────────
  gainage: [
    "Gainage sur les genoux (30s)",
    "Gainage normal (30s)",
    "Gainage long (60s)",
    "Gainage avec extension bras alternés",
    "Gainage avec extension jambe alternée",
    "Gainage avec rotation (mountain climber lent)",
    "Gainage sur 1 bras",
    "Gainage sur anneaux",
  ],

  // ── ÉPAULES ────────────────────────────────────────────────────────────────
  "développé épaules": [
    "Élévations latérales élastique",
    "Développé militaire haltères assis",
    "Développé militaire haltères debout",
    "Développé militaire barre assis",
    "Développé militaire barre debout",
    "Press Arnold haltères",
  ],

  // ── BICEPS ─────────────────────────────────────────────────────────────────
  curl: [
    "Curl élastique",
    "Curl haltères assis",
    "Curl haltères marteau",
    "Curl haltères supination debout",
    "Curl barre EZ",
    "Curl barre droite",
    "Curl concentration",
    "Curl incliné haltères",
  ],

  // ── TRICEPS ────────────────────────────────────────────────────────────────
  triceps: [
    "Extension triceps élastique vertical",
    "Extension triceps corde câble",
    "Diamond push-up sur les genoux",
    "Diamond push-up",
    "Skull crusher haltères légers",
    "Skull crusher barre EZ",
    "Extension triceps 1 bras haltère",
  ],

  // ── MOLLETS ────────────────────────────────────────────────────────────────
  mollets: [
    "Élévation mollets sol 2 jambes",
    "Élévation mollets marche 2 jambes",
    "Élévation mollets 1 jambe sol",
    "Élévation mollets marche 1 jambe",
  ],
};

/**
 * Trouve la chaîne la plus pertinente pour un exercice donné.
 * Retourne { chainName, chain, currentIndex } ou null si non trouvé.
 */
const stepNames = (step) => step?.or ? step.or : [step];

export function findExerciseInChains(exerciseName) {
  const nameLower = (exerciseName || '').toLowerCase();
  // Passe 1 : correspondance exacte
  for (const [chainName, chain] of Object.entries(PROGRESSION_CHAINS)) {
    for (let idx = 0; idx < chain.length; idx++) {
      const names = stepNames(chain[idx]);
      if (names.some(n => nameLower === n.toLowerCase())) {
        return { chainName, chain, currentIndex: idx };
      }
    }
  }
  // Passe 2 : correspondance partielle
  for (const [chainName, chain] of Object.entries(PROGRESSION_CHAINS)) {
    for (let idx = 0; idx < chain.length; idx++) {
      const names = stepNames(chain[idx]);
      if (names.some(n => nameLower.includes(n.toLowerCase()) || n.toLowerCase().includes(nameLower.split(' ')[0]))) {
        return { chainName, chain, currentIndex: idx };
      }
    }
  }
  for (const [chainName, chain] of Object.entries(PROGRESSION_CHAINS)) {
    const keywords = chainName.split(' ');
    if (keywords.some(k => nameLower.includes(k))) {
      return { chainName, chain, currentIndex: -1 };
    }
  }
  return null;
}

/**
 * Vérifie si l'exercice est au bas de sa chaîne (niveau minimum).
 */
export function isAtChainBottom(exerciseName) {
  const found = findExerciseInChains(exerciseName);
  if (!found) return false; // inconnu = on ne sait pas, on laisse l'IA décider
  return found.currentIndex === 0;
}

