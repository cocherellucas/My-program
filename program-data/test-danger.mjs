import { EXERCISES } from '../src/lib/exercise-database.js';

const want = ['Front squat barre', 'Squat barre', 'Soulevé de terre', 'Soulevé de terre roumain barre',
  'Développé couché barre', 'Développé incliné barre', 'Développé militaire barre', 'Rowing barre',
  'Traction pronation', 'Pompe', 'Pompes piquées', 'Pistol squat', 'Nordic curl',
  'Dips triceps machine', 'Hip thrust machine', 'Hack squat machine'];

console.log('nom'.padEnd(34) + 'type'.padEnd(12) + 'failureAllowed');
for (const w of want) {
  const e = EXERCISES.find((x) => x.name === w);
  console.log(w.padEnd(34) + (e ? e.type : '—').padEnd(12) + (e ? String(e.failureAllowed) : 'ABSENT'));
}
const fa = EXERCISES.filter((e) => e.failureAllowed === false);
console.log(`\nTotal: ${EXERCISES.length} | failureAllowed:false = ${fa.length}`);
console.log('  → ' + fa.map((e) => e.name).join(', '));
