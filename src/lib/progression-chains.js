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
    "Pompes pieds surélevés (30cm)",
    "Pompes pieds surélevés (60cm) + lestage sac à dos",
    "Pompes archer",
    "Pompes archer lestées",
    "Pompes 1 bras sur les genoux",
    "Pompes 1 bras",
    "Pompes 1 bras lestées",
  ],
  dips: [
    "Dips assistés élastique",
    "Dips chaise (jambes tendues)",
    "Dips barres parallèles",
    "Dips lestés (+5kg)",
    "Dips lestés (+10kg)",
    "Dips lestés (+20kg+)",
  ],
  développé: [
    "Développé haltères légers (banc incliné)",
    "Développé haltères plat",
    "Développé haltères décliné",
    "Développé barre plat",
    "Développé barre prise serrée",
  ],

  // ── TIRAGE VERTICAL ────────────────────────────────────────────────────────
  tractions: [
    "Traction australienne (rowing barre basse)",
    "Traction assistée élastique épais",
    "Traction assistée élastique léger",
    "Traction prise large",
    "Traction prise neutre",
    "Traction prise serrée supination (chin-up)",
    "Traction lestée (+5kg)",
    "Traction lestée (+10kg)",
    "Traction lestée (+20kg+)",
    "Traction 1 bras assistée élastique",
    "Traction 1 bras",
  ],
  tirage: [
    "Tirage élastique assis",
    "Tirage verticale machine / câble prise large",
    "Tirage verticale prise neutre",
    "Tirage verticale prise serrée",
    "Tirage lestage progressif",
  ],

  // ── TIRAGE HORIZONTAL ──────────────────────────────────────────────────────
  rowing: [
    "Rowing haltère 1 bras léger",
    "Rowing haltère 1 bras lourd",
    "Rowing barre penché",
    "Rowing barre penché prise supination",
    "Rowing barre T",
  ],

  // ── SQUAT / JAMBES ─────────────────────────────────────────────────────────
  squat: [
    "Squat assisté (chaise derrière)",
    "Squat poids de corps",
    "Squat goblet haltère",
    "Squat bulgare poids de corps",
    "Squat bulgare haltères",
    "Squat barre",
    "Squat barre front",
    "Pistol squat assisté (TRX/anneau)",
    "Pistol squat",
    "Pistol squat lesté",
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
    "Hip thrust barre lesté",
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
    "Dips lestés (triceps focus)",
  ],

  // ── MOLLETS ────────────────────────────────────────────────────────────────
  mollets: [
    "Élévation mollets sol 2 jambes",
    "Élévation mollets marche 2 jambes",
    "Élévation mollets 1 jambe sol",
    "Élévation mollets marche 1 jambe",
    "Élévation mollets 1 jambe lestée",
  ],
};

/**
 * Trouve la chaîne la plus pertinente pour un exercice donné.
 * Retourne { chainName, chain, currentIndex } ou null si non trouvé.
 */
export function findExerciseInChains(exerciseName) {
  const nameLower = (exerciseName || '').toLowerCase();
  for (const [chainName, chain] of Object.entries(PROGRESSION_CHAINS)) {
    const idx = chain.findIndex(ex => nameLower.includes(ex.toLowerCase()) || ex.toLowerCase().includes(nameLower.split(' ')[0]));
    if (idx !== -1) return { chainName, chain, currentIndex: idx };
  }
  // Fallback: cherche par mot-clé partiel
  for (const [chainName, chain] of Object.entries(PROGRESSION_CHAINS)) {
    const keywords = chainName.split(' ');
    if (keywords.some(k => nameLower.includes(k))) {
      return { chainName, chain, currentIndex: -1 }; // chaîne trouvée mais position inconnue
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

/**
 * Génère le contexte de progression pour le prompt IA.
 */
export function buildProgressionContext(exerciseName, equipment = []) {
  const found = findExerciseInChains(exerciseName);
  const hasWeightVest = equipment.some(e => e.toLowerCase().includes('gilet'));
  const hasBackpack = true; // toujours possible
  const hasResistanceBand = equipment.some(e => e.toLowerCase().includes('élastique') || e.toLowerCase().includes('elastique'));
  const hasWeights = equipment.some(e => e.toLowerCase().includes('haltère') || e.toLowerCase().includes('barre') || e.toLowerCase().includes('kettlebell'));

  let chainContext = '';
  if (found && found.currentIndex !== -1) {
    const { chain, currentIndex } = found;
    const nextStep = chain[currentIndex + 1];
    const prevStep = chain[currentIndex - 1];
    const isAtTop = currentIndex === chain.length - 1;
    const isAtBottom = currentIndex === 0;

    chainContext = `
POSITION DANS LA CHAÎNE DE PROGRESSION :
- Exercice actuel : "${chain[currentIndex]}" (étape ${currentIndex + 1}/${chain.length})
- Étape précédente (régression) : ${prevStep ? `"${prevStep}"` : 'AUCUNE — c\'est le niveau le plus simple'}
- Étape suivante (progression) : ${nextStep ? `"${nextStep}"` : 'AUCUNE — c\'est le niveau maximum'}
- Chaîne complète : ${chain.map((e, i) => `[${i + 1}] ${e}`).join(' → ')}
${isAtTop ? '\n⚠️ NIVEAU MAXIMUM ATTEINT : Propose du lestage (élastiques, sac à dos) ou surcharge mécanique (tempo excentrique 5s, pause en bas 3s). Si pas d\'élastiques disponibles, suggère-les explicitement.' : ''}
${isAtBottom ? '\n⚠️ NIVEAU MINIMUM ATTEINT : Propose de réduire le volume (-1 série), l\'amplitude, ou un tempo plus lent.' : ''}`;
  } else if (found) {
    chainContext = `\nChaîne de référence identifiée : ${found.chainName}\nChaîne complète : ${found.chain.join(' → ')}\nPosition exacte dans la chaîne inconnue — détermine-la par logique.`;
  } else {
    chainContext = `\nAucune chaîne prédéfinie trouvée pour cet exercice. Applique les principes biomécaniques généraux.`;
  }

  const equipmentContext = `
MATÉRIEL DISPONIBLE :
- Gilet lesté : ${hasWeightVest ? 'OUI' : 'NON'}
- Élastiques de résistance : ${hasResistanceBand ? 'OUI' : 'NON'}
- Haltères/Barre/Kettlebell : ${hasWeights ? 'OUI' : 'NON'}
- Sac à dos (lestage DIY) : toujours possible`;

  return chainContext + equipmentContext;
}