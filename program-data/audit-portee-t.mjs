// Cherche les composants qui appellent t(...) sans avoir appelé useI18n().
// C'est le bug « t is not defined » : l'import en haut du fichier ne suffit pas,
// c'est le HOOK qui doit être appelé dans CE composant-là.
//
// Découpage par déclaration de composant de niveau supérieur (colonne 0), ce qui
// couvre `function X(`, `export function X(`, `export default function X(`,
// et `const X = (...) =>`. Les fonctions imbriquées héritent de la portée du
// parent, donc les ignorer est correct.
import fs from 'node:fs';
import path from 'node:path';

const RACINE = process.cwd();

function fichiers(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) fichiers(p, acc);
    else if (/\.jsx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}

// Bornes : composants (majuscule) ET fonctions exportées en minuscule — sans
// ces dernières, une fonction utilitaire comme `libelleStructure(structure, t)`
// était rattachée au bloc précédent, dont la signature ne portait pas `t`.
const DEBUT = /^(?:export\s+)?(?:default\s+)?(?:function\s+(\w+)|const\s+([A-Za-z]\w*)\s*=\s*(?:\(|function|async))/;
let suspects = 0;

for (const f of fichiers(path.join(RACINE, 'src'))) {
  const rel = path.relative(RACINE, f).split(path.sep).join('/');
  if (rel.endsWith('lib/i18n.jsx')) continue;
  const lignes = fs.readFileSync(f, 'utf8').split('\n');

  // Bornes de chaque composant de niveau supérieur
  const bornes = [];
  lignes.forEach((l, i) => { const m = l.match(DEBUT); if (m) bornes.push({ nom: m[1] || m[2], debut: i }); });
  bornes.forEach((b, i) => { b.fin = i + 1 < bornes.length ? bornes[i + 1].debut : lignes.length; });

  for (const b of bornes) {
    const corps = lignes.slice(b.debut, b.fin);
    const texte = corps.join('\n');
    // Appels de traduction : t('cle') ou t(`...`) ou t(variable)
    const appels = [...texte.matchAll(/(?<![.\w])t\(/g)];
    if (!appels.length) continue;
    if (/useI18n\s*\(/.test(texte)) continue;
    // `t` peut aussi arriver en PROP (`function X({ t })`) ou en PARAMÈTRE
    // (`function f(x, t)`) — c'est légitime, la portée vient de l'appelant.
    const signature = corps[0] || '';
    if (/\{[^}]*\bt\b[^}]*\}/.test(signature) || /\(\s*[^)]*\bt\s*[,)]/.test(signature)) continue;
    // Faux positifs classiques : setX(t => ...) — un paramètre nommé t.
    const vraisAppels = corps
      .map((l, k) => ({ l, n: b.debut + k + 1 }))
      .filter(({ l }) => /(?<![.\w])t\(\s*['"`]/.test(l));
    if (!vraisAppels.length) continue;
    suspects++;
    console.log(`\n✗ ${rel} — ${b.nom}() appelle t() sans useI18n()`);
    vraisAppels.slice(0, 4).forEach(({ l, n }) => console.log(`    l.${n}: ${l.trim().slice(0, 90)}`));
  }
}

console.log(suspects === 0
  ? '\n✓ tout composant qui traduit appelle bien useI18n()\n'
  : `\n✗ ${suspects} composant(s) à corriger\n`);
