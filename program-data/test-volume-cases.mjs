import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';

const UPPER = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'];
const LOWER = ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'];

// Volume hebdo DIRECT par muscle (+ indirect 0,5× en info)
function volumes(program) {
  const d = {}, ind = {};
  for (const s of program.sessions) for (const x of s.exercises) {
    d[x.muscle_group] = (d[x.muscle_group] || 0) + (x.sets || 0);
    for (const m of (x.muscles_secondary || [])) ind[m] = (ind[m] || 0) + 0.5 * (x.sets || 0);
  }
  return { d, ind };
}

const LEVEL = process.argv[2] || 'intermediate';
const TIER = 'full_gym';

const sigs = [...new Set(PRE_GENERATED_PROGRAMS.map((p) => p.match.objectives_signature))].sort();
console.log(`\n██ RÉPARTITION DU VOLUME DANS LE CATALOGUE — ${LEVEL} / ${TIER} ██`);
console.log('   (séries hebdo DIRECTES par muscle · fréquence recommandée)\n');

for (const sig of sigs) {
  const cands = PRE_GENERATED_PROGRAMS.filter(
    (p) => p.match.level === LEVEL && p.match.training_context === TIER && p.match.objectives_signature === sig
  );
  if (!cands.length) continue;
  const p = cands.find((c) => c.match.recommended_for_optimal) || cands[0];
  const { d, ind } = volumes(p.program);
  const fmt = (list) => list.map((m) => {
    const v = d[m] || 0;
    const i = ind[m] || 0;
    return `${m} ${v}${i ? `(+${i})` : ''}`;
  }).join(' · ');
  console.log(`▸ ${sig}`);
  console.log(`   ${p.match.weekly_frequency}j · ${p.program.split}`);
  console.log(`   HAUT : ${fmt(UPPER)}`);
  console.log(`   BAS  : ${fmt(LOWER)}`);
  const all = Object.values(d).reduce((a, b) => a + b, 0);
  console.log(`   total direct : ${all} séries/sem\n`);
}
