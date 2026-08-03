import { EXERCISES } from '../src/lib/exercise-database.js';

const P = EXERCISES.filter((e) => e.muscles?.primary?.includes('Fessiers'));
const S = EXERCISES.filter((e) => e.muscles?.secondary?.includes('Fessiers'));

console.log('=== Fessiers en PRIMAIRE (comptés en volume DIRECT) ===');
P.forEach((e) => console.log('  ' + e.name.padEnd(36) + e.type.padEnd(11) + 'niveaux: ' + e.level.join(',')));
console.log('\n=== Fessiers en SECONDAIRE (comptés 0,5×) ===');
S.forEach((e) => console.log('  ' + e.name.padEnd(36) + e.type.padEnd(11) + 'primaire: ' + e.muscles.primary.join(',')));
console.log(`\nprimaire: ${P.length} · secondaire: ${S.length}`);

// Idem pour les autres petits muscles qui plafonnent
for (const m of ['Biceps', 'Triceps', 'Mollets']) {
  const p = EXERCISES.filter((e) => e.muscles?.primary?.includes(m));
  console.log(`\n${m} — ${p.length} exos en primaire : ${p.map((e) => e.name).join(', ')}`);
}
