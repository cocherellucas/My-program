import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

// Combien de séries le catalogue pose-t-il RÉELLEMENT sur un exercice, selon
// qu'il est polyarticulaire ou d'isolation, et selon le bloc ?
const byName = new Map(EXERCISES.map((e) => [e.name.toLowerCase(), e]));
const kindOf = (x) => {
  const e = byName.get(String(x.name).toLowerCase());
  return e ? e.type : x.block === 'A' ? 'compound' : 'isolation';
};

const stats = {};
for (const p of PRE_GENERATED_PROGRAMS) {
  for (const s of p.program.sessions) {
    for (const x of s.exercises) {
      const key = `${kindOf(x)} / bloc ${x.block}`;
      (stats[key] = stats[key] || []).push(x.sets || 0);
    }
  }
}

const fmt = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  const mode = Object.entries(arr.reduce((m, v) => ((m[v] = (m[v] || 0) + 1), m), {}))
    .sort((a, b) => b[1] - a[1])[0];
  return `n=${String(arr.length).padStart(4)}  moyenne ${avg.toFixed(2)}  médiane ${sorted[Math.floor(sorted.length / 2)]}  le + fréquent ${mode[0]} (${Math.round((mode[1] / arr.length) * 100)}%)  min-max ${sorted[0]}-${sorted[sorted.length - 1]}`;
};

console.log('██ SÉRIES PAR EXERCICE dans le catalogue ██\n');
for (const k of Object.keys(stats).sort()) console.log(`  ${k.padEnd(24)} ${fmt(stats[k])}`);

// Vue agrégée : polyarticulaire vs isolation, tous blocs confondus
const agg = { compound: [], isolation: [] };
for (const [k, v] of Object.entries(stats)) agg[k.startsWith('compound') ? 'compound' : 'isolation'].push(...v);
console.log('\n██ AGRÉGÉ ██');
console.log(`  polyarticulaire          ${fmt(agg.compound)}`);
console.log(`  isolation                ${fmt(agg.isolation)}`);
