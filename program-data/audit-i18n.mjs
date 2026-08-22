// Audit des traductions : clés appelées mais absentes, clés FR sans EN,
// clés mortes, et appels dynamiques t(`prefixe_${…}`) dont toutes les valeurs
// possibles n'existent pas forcément.
//
// t() renvoie la CLÉ quand elle manque (i18n.jsx : `DICT[lang]?.[key] ?? DICT.fr[key] ?? key`).
// Une clé oubliée ne casse donc rien : elle affiche « struct_ul_ppl » à
// l'utilisateur. Silencieux à l'exécution, visible à l'écran — d'où cet audit.
import fs from 'node:fs';
import path from 'node:path';

const RACINE = process.cwd();
const SRC = path.join(RACINE, 'src');

function fichiers(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) fichiers(p, acc);
    else if (/\.(jsx?|tsx?)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

// ── Clés déclarées ──────────────────────────────────────────────────────────
// Le dictionnaire est un objet de chaînes pures : on l'ÉVALUE (plutôt que de le
// lire à la regex — plusieurs clés par ligne, une regex ancrée en début de ligne
// n'en voyait qu'une sur cinq et inventait 237 clés manquantes).
const i18n = fs.readFileSync(path.join(SRC, 'lib', 'i18n.jsx'), 'utf8');
const debut = i18n.indexOf('const DICT = {');
if (debut < 0) { console.error('✗ DICT introuvable'); process.exit(1); }
let profondeur = 0; let fin = -1;
for (let i = i18n.indexOf('{', debut); i < i18n.length; i++) {
  if (i18n[i] === '{') profondeur++;
  else if (i18n[i] === '}') { profondeur--; if (profondeur === 0) { fin = i + 1; break; } }
}
if (fin < 0) { console.error('✗ accolade fermante de DICT introuvable'); process.exit(1); }
// eslint-disable-next-line no-new-func
const DICT = new Function(`return ${i18n.slice(i18n.indexOf('{', debut), fin)};`)();
const FR = new Set(Object.keys(DICT.fr || {}));
const EN = new Set(Object.keys(DICT.en || {}));

// ── Clés appelées ───────────────────────────────────────────────────────────
const litterales = new Map(); // clé → fichiers
const dynamiques = new Map(); // préfixe → fichiers
const citees = new Set();     // clés écrites en dur ailleurs que dans un t()
for (const f of fichiers(SRC)) {
  const rel = path.relative(RACINE, f);
  const txt = fs.readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/\bt\(\s*'([a-z0-9_]+)'\s*\)/gi)) {
    if (!litterales.has(m[1])) litterales.set(m[1], new Set());
    litterales.get(m[1]).add(rel);
  }
  for (const m of txt.matchAll(/\bt\(\s*`([a-z0-9_]*)\$\{/gi)) {
    if (!dynamiques.has(m[1])) dynamiques.set(m[1], new Set());
    dynamiques.get(m[1]).add(rel);
  }
  // Troisième forme : la clé est stockée puis traduite au rendu — `t(m)`,
  // `t(s.descKey)`. Invisible aux deux regex ci-dessus, ce qui faisait passer
  // pour mortes des clés bel et bien affichées (les libellés d'échauffement).
  // On considère donc comme citée toute chaîne qui EST une clé du dictionnaire.
  if (path.basename(f) === 'i18n.jsx') continue;
  for (const m of txt.matchAll(/'([a-z0-9_]+)'/gi)) citees.add(m[1]);
  for (const m of txt.matchAll(/"([a-z0-9_]+)"/gi)) citees.add(m[1]);
}

const lignes = [];
const manquantes = [...litterales.keys()].filter((k) => !FR.has(k)).sort();
const sansEn = [...FR].filter((k) => !EN.has(k)).sort();
const sansFr = [...EN].filter((k) => !FR.has(k)).sort();
const mortes = [...FR].filter((k) => !litterales.has(k) && !citees.has(k)
  && ![...dynamiques.keys()].some((p) => p && k.startsWith(p))).sort();

console.log('\n██ AUDIT I18N ██\n');
console.log(`  clés FR déclarées : ${FR.size}`);
console.log(`  clés EN déclarées : ${EN.size}`);
console.log(`  clés appelées en dur : ${litterales.size}`);

const section = (titre, liste, detail) => {
  console.log(`\n── ${titre} : ${liste.length}`);
  for (const k of liste.slice(0, 40)) console.log(`     ${k}${detail ? detail(k) : ''}`);
  if (liste.length > 40) console.log(`     … et ${liste.length - 40} autres`);
};

section('APPELÉES MAIS ABSENTES du dictionnaire (affichent la clé brute)', manquantes,
  (k) => `   ← ${[...litterales.get(k)].join(', ')}`);
section('déclarées en FR mais PAS en EN (l’anglais retombe sur le français)', sansEn);
section('déclarées en EN mais pas en FR', sansFr);
section('déclarées mais jamais appelées (probablement mortes)', mortes);

// ── Appels dynamiques : on vérifie les préfixes connus ──────────────────────
console.log('\n── appels dynamiques t(`préfixe_${…}`)');
for (const [p, fs_] of [...dynamiques].sort()) {
  const existantes = [...FR].filter((k) => p && k.startsWith(p));
  console.log(`     \`${p}\${…}\`  → ${existantes.length} clé(s) : ${existantes.sort().join(', ') || '(aucune)'}`);
  console.log(`        appelé depuis ${[...fs_].join(', ')}`);
}

const dur = manquantes.length + sansEn.length + sansFr.length;
console.log(dur === 0 ? '\n✓ dictionnaire cohérent\n' : `\n✗ ${dur} problème(s) de dictionnaire\n`);
void lignes;
