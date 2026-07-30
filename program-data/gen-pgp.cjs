const fs = require('fs');
const ROOT = 'c:/Users/coche/OneDrive/Desktop/my-program (1)';
const SP = __dirname;

// canonical names (lower -> original), depuis exercise-database.js
const db = fs.readFileSync(ROOT + '/src/lib/exercise-database.js', 'utf8');
const canon = new Map();
const re = /name:\s*'((?:[^'\\]|\\.)*)'/g;
let m;
while ((m = re.exec(db))) { const n = m[1].replace(/\\'/g, "'"); canon.set(n.toLowerCase(), n); }

// mapping catalogue -> canonique (3 tables cumulées)
const map = {
  ...JSON.parse(fs.readFileSync(SP + '/map.json', 'utf8')),
  ...JSON.parse(fs.readFileSync(SP + '/map2.json', 'utf8')),
  ...JSON.parse(fs.readFileSync(SP + '/map3.json', 'utf8')),
};

function resolve(name) {
  if (canon.has(name.toLowerCase())) return canon.get(name.toLowerCase());
  const t = map[name];
  if (t && canon.has(t.toLowerCase())) return canon.get(t.toLowerCase());
  return null;
}

const cat = JSON.parse(fs.readFileSync(ROOT + '/program-data/catalogue_complet.json', 'utf8')).catalog;

// Construit les programmes : noms canoniques + active_zones dérivées.
const unresolved = new Set();
const out = cat.map((entry) => {
  const p = entry.program;
  const sessions = p.sessions.map((s) => {
    const seenZone = [];
    const exercises = s.exercises.map((x) => {
      const cn = resolve(x.name);
      if (!cn) { unresolved.add(x.name); }
      if (!seenZone.includes(x.muscle_group)) seenZone.push(x.muscle_group);
      const ex = {
        name: cn || x.name,
        muscle_group: x.muscle_group,
        muscles_secondary: x.muscles_secondary || [],
        block: x.block,
        equipment: x.equipment || [],
        sets: x.sets,
        target_reps: x.target_reps,
        rest_seconds: x.rest_seconds,
      };
      if (x.notes) ex.notes = x.notes; // cue tempo/excentrique (affiché en séance)
      return ex;
    });
    return {
      day_label: s.day_label,
      type: s.type,
      estimated_duration: s.estimated_duration,
      active_zones: seenZone.map((mg) => ({ muscle_group: mg })),
      exercises,
    };
  });
  return {
    match: entry.match,
    program: {
      name: p.name,
      level: p.level,
      planned_weeks: p.planned_weeks,
      split: p.split,
      weekly_frequency: p.weekly_frequency,
      sessions,
    },
  };
});

if (unresolved.size) {
  console.error('✗ NOMS NON RÉSOLUS (' + unresolved.size + ') — génération AVORTÉE :');
  [...unresolved].sort().forEach((n) => console.error('  • ' + n));
  process.exit(1);
}

const header = `// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMMES PRÉ-GÉNÉRÉS — catalogue complet (généré en amont par Claude, activé
// par le profil). Noms d'exercices normalisés vers exercise-database.js.
// NE PAS ÉDITER À LA MAIN — régénéré par scratchpad/gen-pgp.cjs depuis
// program-data/catalogue_complet.json (+ maps de normalisation).
// match: { level, training_context, objectives_signature, weekly_frequency,
//          recommended_for_optimal }.
// 6 TIERS : {beginner,intermediate,advanced} × {full_gym,bodyweight} — ${out.length} programmes.
// ─────────────────────────────────────────────────────────────────────────────

export const PRE_GENERATED_PROGRAMS = ${JSON.stringify(out, null, 2)};
`;

fs.writeFileSync(ROOT + '/src/lib/pre-generated-programs.js', header, 'utf8');
console.log('✓ pre-generated-programs.js écrit :', out.length, 'programmes.');
