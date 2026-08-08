// ─────────────────────────────────────────────────────────────────────────────
// REPLIS SANS MATÉRIEL
// Quand un exercice du programme n'est pas réalisable avec le matériel déclaré,
// on ne le laisse pas tel quel : on lui substitue un mouvement qui n'exige rien.
// Table établie exercice par exercice (et non par préréglage), donc valable pour
// n'importe quelle configuration, y compris personnalisée.
//
// La valeur est une LISTE de candidats, du plus proche au plus accessible : le
// premier qui convient au NIVEAU de l'utilisateur est retenu. Un handstand
// push-up remplace bien un développé militaire, mais pas pour un débutant — d'où
// les pompes piquées en second choix.
//
// GÉNÉRÉ par program-data/gen-integration.mjs depuis program-data/substitutions-*.csv
// NE PAS ÉDITER À LA MAIN : modifier les CSV puis relancer les deux générateurs.
// ─────────────────────────────────────────────────────────────────────────────

export const SUBSTITUTIONS = {
  "Abducteur machine": ["Abduction de hanche allongé sur le côté"],
  "Crunch câble": ["Crunch au sol"],
  "Crunch machine": ["Crunch au sol"],
  "Curl aux anneaux": ["Curl avec sac"],
  "Curl barre EZ": ["Curl avec sac"],
  "Curl élastique": ["Curl avec sac"],
  "Curl haltères alternés": ["Curl avec sac alterné"],
  "Curl incliné haltères": ["Curl incliné sur chaise avec sac"],
  "Curl marteau": ["Curl marteau avec sac"],
  "Développé couché barre": ["Pompe"],
  "Développé couché haltères": ["Pompe"],
  "Développé incliné barre": ["Pompe pieds surélevés (chaise)"],
  "Développé incliné haltères": ["Pompe large pieds surélevés (chaise)"],
  "Développé militaire barre": ["Handstand push-up contre un mur","Pompes piquées"],
  "Développé militaire haltères": ["Handstand push-up contre un mur","Pompes piquées"],
  "Dips (poitrine)": ["Dips entre deux chaises (buste penché)"],
  "Dips lestés aux barres parallèles": ["Dips entre deux chaises (buste penché)"],
  "Dips triceps machine": ["Dips entre deux chaises (buste droit)"],
  "Écarté incliné haltères": ["Pompe large"],
  "Écarté poulie": ["Pompe large"],
  "Élévations latérales câble": ["Élévations latérales avec sac ou bouteilles"],
  "Élévations latérales haltères": ["Élévations latérales avec sac ou bouteilles"],
  "Extension triceps élastique": ["Extension triceps avec sac"],
  "Face pull câble": ["Face pull avec sac"],
  "Fente bulgare haltères": ["Fente bulgare (chaise)"],
  "Fente marchée haltères": ["Fente marchée avec sac"],
  "Front squat barre": ["Front squat avec sac"],
  "Good morning": ["Good morning avec sac"],
  "Hack squat machine": ["Fente bulgare (chaise)"],
  "Hip thrust barre": ["Pont fessier avec sac ou unilatéral"],
  "Hip thrust machine": ["Pont fessier avec sac ou unilatéral"],
  "L-sit": ["L-sit au sol"],
  "Leg curl allongé": ["Leg curl au sol avec sac"],
  "Leg curl assis": ["Leg curl au sol avec sac"],
  "Leg extension": ["Leg extension assis avec sac"],
  "Leg press": ["Fente bulgare (chaise)"],
  "Mollets assis machine": ["Mollets assis avec sac"],
  "Mollets debout machine": ["Mollets unilatéraux avec sac"],
  "Mollets leg press": ["Mollets unilatéraux avec sac"],
  "Mollets lestés une jambe": ["Mollets unilatéraux avec sac"],
  "Oiseau haltères (deltoïde postérieur)": ["Oiseau avec sac ou bouteilles"],
  "Pec deck": ["Pompe large"],
  "Pompe pieds surélevés": ["Pompe pieds surélevés (chaise)"],
  "Pull-over poulie": ["Pullover avec sac"],
  "Relevés de jambes suspendu": ["Relevés de jambes au sol"],
  "Roulette abdominale": ["Crunch bras tendus au-dessus de la tête"],
  "Rowing barre": ["Rowing avec sac"],
  "Rowing haltère unilatéral": ["Rowing unilatéral avec sac"],
  "Rowing TRX": ["Rowing bûcheron avec sac"],
  "Skull crusher barre EZ": ["Skull crusher avec sac"],
  "Soulevé de terre": ["Soulevé de terre avec sac"],
  "Soulevé de terre roumain barre": ["Soulevé de terre roumain avec sac"],
  "Squat barre": ["Squat avec sac"],
  "Tirage poulie bras tendus": ["Pullover avec sac"],
  "Tirage vertical pronation": ["Traction pronation (barre de fortune)"],
  "Traction pronation": ["Traction pronation (barre de fortune)"],
  "Traction supination (chin-up)": ["Traction supination (barre de fortune)"],
  "Triceps poulie haute corde": ["Extension triceps nuque avec sac"],
};

/** Candidats de repli pour cet exercice, du meilleur au plus accessible. */
export function substitutsDe(nomExercice) {
  return SUBSTITUTIONS[nomExercice] || [];
}
