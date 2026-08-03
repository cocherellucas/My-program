import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';

// Quel volume MAXIMUM Claude a-t-il réellement donné à un muscle, par niveau ?
// C'est un indicateur empirique du plafond qu'il juge tenable — bien plus solide
// qu'une valeur inventée. On regarde le volume EFFECTIF (direct + 0,5 × indirect),
// comme le brief, et uniquement les muscles CIBLÉS par l'objectif du programme.
const UPPER = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'];
const LOWER = ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'];

function targeted(sig) {
  const s = new Set();
  for (const part of sig.split('+')) {
    const m = part.trim().match(/^([a-z_]+):(.+):(primary|secondary)$/i);
    if (!m || m[3] !== 'primary') continue;      // seulement les muscles PRIMAIRES
    const mid = m[2];
    if (/^movements\[/i.test(mid)) continue;
    if (mid === 'full_body') [...UPPER, ...LOWER].forEach((x) => s.add(x));
    else if (mid === 'upper_body') UPPER.forEach((x) => s.add(x));
    else if (mid === 'lower_body') LOWER.forEach((x) => s.add(x));
  }
  return s;
}

const byLevel = {};
const perExerciseMax = {};
for (const p of PRE_GENERATED_PROGRAMS) {
  const tg = targeted(p.match.objectives_signature);
  if (!tg.size) continue;
  const vol = {};
  for (const s of p.program.sessions) for (const x of s.exercises) {
    vol[x.muscle_group] = (vol[x.muscle_group] || 0) + (x.sets || 0);
    for (const sm of x.muscles_secondary || []) vol[sm] = (vol[sm] || 0) + 0.5 * (x.sets || 0);
    // séries max posées sur UN exercice, par type de séance
    const t = s.type || 'mixed';
    perExerciseMax[t] = Math.max(perExerciseMax[t] || 0, x.sets || 0);
  }
  const lvl = p.match.level;
  byLevel[lvl] = byLevel[lvl] || {};
  for (const m of tg) {
    const v = vol[m] || 0;
    if (v > (byLevel[lvl][m] || 0)) byLevel[lvl][m] = v;
  }
}

console.log('██ PLAFOND OBSERVÉ dans le catalogue — volume effectif hebdo d\'un muscle CIBLÉ ██\n');
for (const lvl of ['beginner', 'intermediate', 'advanced']) {
  const v = byLevel[lvl] || {};
  const vals = Object.values(v);
  const sorted = Object.entries(v).sort((a, b) => b[1] - a[1]);
  console.log(`${lvl.padEnd(13)} max global : ${Math.max(...vals)}  |  moyenne des max : ${(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)}`);
  console.log(`              top 4 : ${sorted.slice(0, 4).map(([m, x]) => `${m} ${x}`).join(' · ')}`);
}
console.log('\n██ SÉRIES MAX sur UN SEUL exercice, par type de séance ██');
for (const [t, n] of Object.entries(perExerciseMax)) console.log(`  ${t.padEnd(14)} ${n} séries`);
