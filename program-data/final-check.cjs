const fs = require('fs');
const ROOT = 'c:/Users/coche/OneDrive/Desktop/my-program (1)';
const db = fs.readFileSync(ROOT + '/src/lib/exercise-database.js', 'utf8');
const canon = new Set();
const re = /name:\s*'((?:[^'\\]|\\.)*)'/g;
let m;
while ((m = re.exec(db))) canon.add(m[1].replace(/\\'/g, "'").toLowerCase());

let txt = fs.readFileSync(ROOT + '/src/lib/pre-generated-programs.js', 'utf8');
txt = txt.slice(txt.indexOf('[')); txt = txt.slice(0, txt.lastIndexOf(']') + 1);
const P = JSON.parse(txt);

const tier = (ctx) => (ctx === 'bodyweight' ? 'bodyweight' : 'full_gym');
function match({ level, ctx, sig, optimal, freq }) {
  const cands = P.filter((p) => p.match.level === level && p.match.training_context === tier(ctx) && p.match.objectives_signature === sig);
  if (!cands.length) return null;
  if (optimal) return cands.find((p) => p.match.recommended_for_optimal) || cands[0];
  return cands.find((p) => p.match.weekly_frequency === freq) || cands[0];
}

const tests = [
  { name: 'Débutant · poids du corps · full body · dispo optimales', level: 'beginner', ctx: 'bodyweight', sig: 'hypertrophy:full_body:primary', optimal: true },
  { name: 'Avancé · salle · powerbuilding · 5j', level: 'advanced', ctx: 'full_gym', sig: 'strength:movements[Squat barre,Développé couché,Soulevé de terre]:primary+hypertrophy:full_body:secondary', freq: 5 },
  { name: 'Inter · salle · haut prio + bas sec · 4j', level: 'intermediate', ctx: 'full_gym', sig: 'hypertrophy:upper_body:primary+hypertrophy:lower_body:secondary', freq: 4 },
  { name: 'Débutant · maison/barre (→full_gym) · bas · 3j', level: 'beginner', ctx: 'home_barbell', sig: 'hypertrophy:lower_body:primary', freq: 3 },
  { name: 'Avancé · poids du corps · bas prio + haut sec · 6j', level: 'advanced', ctx: 'bodyweight', sig: 'hypertrophy:lower_body:primary+hypertrophy:upper_body:secondary', freq: 6 },
];

let allOk = true;
for (const t of tests) {
  const p = match(t);
  if (!p) { console.log('✗ AUCUN programme —', t.name); allOk = false; continue; }
  let n = 0, bad = 0;
  for (const s of p.program.sessions) for (const x of s.exercises) { n++; if (!canon.has(x.name.toLowerCase())) bad++; }
  console.log(`${bad === 0 ? '✓' : '✗'} ${t.name}\n    → "${p.program.name}" (${p.program.weekly_frequency}j, split ${p.program.split}) · ${p.program.sessions.length} séances · ${n} exos · non résolus: ${bad}`);
  if (bad) allOk = false;
}
console.log('\n' + (allOk ? '✓ TOUS les profils testés activent un programme 100% résolu.' : '✗ échec'));
process.exit(allOk ? 0 : 1);
