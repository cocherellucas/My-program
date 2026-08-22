import { EXERCISES } from '../src/lib/exercise-database.js';
import idx from './images-tournage/_index.json' with { type: 'json' };
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const base = EXERCISES.map((e) => ({ nom: e.name, n: norm(e.name) }));
const exact = [], proche = [], absent = [];
for (const c of idx) {
  const n = norm(c.exercice);
  const e = base.find((b) => b.n === n);
  if (e) { exact.push(c); continue; }
  const mots = n.split(' ').filter((w) => w.length > 3);
  let best = null, score = 0;
  for (const b of base) {
    const s = mots.filter((w) => b.n.includes(w)).length / Math.max(1, mots.length);
    if (s > score) { score = s; best = b; }
  }
  if (score >= 0.5) proche.push({ ...c, sugg: best.nom, score });
  else absent.push({ ...c, sugg: best?.nom, score });
}
console.log(`\n██ NOMS DES CLIPS vs BASE D'EXERCICES ██\n`);
console.log(`  correspondance exacte : ${exact.length}/${idx.length}`);
console.log(`\n  ~ a rapprocher (${proche.length}) :`);
for (const c of proche) console.log(`      ${String(c.rang).padStart(2, '0')}  « ${c.exercice} »  ->  ${c.sugg}`);
console.log(`\n  ✗ introuvable dans la base (${absent.length}) :`);
for (const c of absent) console.log(`      ${String(c.rang).padStart(2, '0')}  « ${c.exercice} »` + (c.sugg ? `   (plus proche : ${c.sugg})` : ''));
console.log('');
