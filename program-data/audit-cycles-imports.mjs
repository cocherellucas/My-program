// Cycles d'import dans src/. Un cycle ne casse pas toujours l'app, mais il rend
// l'ordre d'initialisation dépendant du point d'entrée : un `const` d'un module
// peut valoir `undefined` au moment où l'autre le lit. Bug intermittent typique.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'src');
const fichiers = (dir, acc = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) fichiers(p, acc);
    else if (/\.(jsx?|tsx?)$/.test(e.name)) acc.push(p);
  }
  return acc;
};

// Résout '@/lib/x' et './x' vers un fichier réel (extensions implicites).
const resoudre = (spec, depuis) => {
  let base;
  if (spec.startsWith('@/')) base = path.join(SRC, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(depuis), spec);
  else return null; // paquet npm
  for (const suf of ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx']) {
    const p = base + suf;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
};

const graphe = new Map();
for (const f of fichiers(SRC)) {
  const txt = fs.readFileSync(f, 'utf8');
  const cibles = new Set();
  for (const m of txt.matchAll(/(?:^|\n)\s*import\s[^;]*?from\s*['"]([^'"]+)['"]/g)) {
    const r = resoudre(m[1], f); if (r) cibles.add(r);
  }
  for (const m of txt.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    const r = resoudre(m[1], f); if (r) cibles.add(r);
  }
  graphe.set(f, [...cibles]);
}

const rel = (p) => path.relative(process.cwd(), p);
const cycles = [];
const etat = new Map(); // 0 = en cours, 1 = fini
const pile = [];
function visiter(n) {
  etat.set(n, 0); pile.push(n);
  for (const v of graphe.get(n) || []) {
    if (etat.get(v) === 0) {
      const i = pile.indexOf(v);
      cycles.push([...pile.slice(i), v].map(rel));
    } else if (etat.get(v) === undefined) visiter(v);
  }
  pile.pop(); etat.set(n, 1);
}
for (const n of graphe.keys()) if (etat.get(n) === undefined) visiter(n);

console.log('\n██ CYCLES D’IMPORT ██\n');
console.log(`  fichiers analysés : ${graphe.size}`);
if (!cycles.length) console.log('\n✓ aucun cycle\n');
else {
  // Dédoublonner (le même cycle est trouvé depuis plusieurs points d'entrée).
  const vus = new Set();
  const uniques = cycles.filter((c) => {
    const cle = [...c].slice(0, -1).sort().join('|');
    if (vus.has(cle)) return false; vus.add(cle); return true;
  });
  console.log(`\n✗ ${uniques.length} cycle(s) :\n`);
  for (const c of uniques) console.log(`    ${c.join('\n      → ')}\n`);
}
