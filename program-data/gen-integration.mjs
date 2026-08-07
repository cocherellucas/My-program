// Intègre les substitutions validées :
//   1. insère les nouveaux exercices dans src/lib/exercise-database.js
//   2. élargit les niveaux des entrées existantes concernées
//   3. écrit src/lib/exercise-substitutions.js (exercice → remplaçant)
//
// IDEMPOTENT : le bloc inséré est délimité par des marqueurs, relancer le script
// le remplace au lieu d'empiler des doublons.
import fs from 'node:fs';
import path from 'node:path';
import { EXERCISES } from '../src/lib/exercise-database.js';

const RACINE = process.cwd();
const ICI = path.join(RACINE, 'program-data');
const DB = path.join(RACINE, 'src', 'lib', 'exercise-database.js');
const SUBS = path.join(RACINE, 'src', 'lib', 'exercise-substitutions.js');
const DEBUT = '  // ══ DÉBUT bloc généré : replis sans matériel ══';
const FIN = '  // ══ FIN bloc généré ══';

const byName = new Map(EXERCISES.map((e) => [e.name.toLowerCase(), e]));
const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
const NIV = { 'déb.': 'beginner', 'inter.': 'intermediate', 'avancé': 'advanced' };

function parseCsv(txt, sep) {
  const rows = []; let row = [], champ = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"' && txt[i + 1] === '"') { champ += '"'; i++; } else if (c === '"') q = false; else champ += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(champ); champ = ''; }
    else if (c === '\n') { row.push(champ); rows.push(row); row = []; champ = ''; }
    else if (c !== '\r') champ += c;
  }
  if (champ || row.length) { row.push(champ); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}
const lire = (f, sep) => parseCsv(fs.readFileSync(path.join(ICI, f), 'utf8').replace(/^﻿/, ''), sep);

// Identifiant technique : sans accent, sans ponctuation.
const slug = (nom) => nom.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// ── 1. Les propositions relues ──────────────────────────────────────────────
const propositions = lire('nouveaux-exercices-proposes.csv', ';').slice(1).map((c) => ({
  primaires: c[0].split(',').map((s) => s.trim()).filter(Boolean),
  nom: c[1].trim(),
  aElargir: c[2].includes('EXISTANTE'),
  type: c[3].trim() === 'poly' ? 'compound' : 'isolation',
  block: c[4].trim(),
  level: c[5].split(' ').map((s) => NIV[s.trim()]).filter(Boolean),
  secondaires: c[8].split(',').map((s) => s.trim()).filter((s) => s && s !== '—'),
  remplace: c[10],
  cue: c[11].trim(),
}));

// ── 2. La table de correspondance ───────────────────────────────────────────
// Produite par gen-nouveaux-exercices.mjs, seul endroit qui sait résoudre une
// saisie libre (« squat sac ») vers le nom retenu (« Squat avec sac »), y compris
// les cas séparés par muscle et ceux qui pointent vers un exercice existant.
const MAP = path.join(ICI, '_correspondances-substitutions.json');
if (!fs.existsSync(MAP)) {
  throw new Error('lance d\'abord program-data/gen-nouveaux-exercices.mjs');
}
// Chaque exercice pointe vers une LISTE de candidats : le premier adapté au
// niveau de l'utilisateur est retenu (voir CANDIDATS_SUP côté générateur).
const substitutions = new Map(Object.entries(JSON.parse(fs.readFileSync(MAP, 'utf8'))));
for (const [exo, cibles] of substitutions) {
  for (const cible of cibles) {
    const connu = propositions.some((p) => p.nom === cible) || byName.has(norm(cible));
    if (!connu) console.warn(`  ⚠ remplaçant inconnu : « ${cible} » (pour ${exo})`);
  }
}

// ── 3. Nouvelles entrées de la base ─────────────────────────────────────────
const nouveaux = propositions.filter((p) => !p.aElargir);
const entrees = nouveaux.map((p) => {
  // Objectifs hérités des exercices remplacés (union), défaut hypertrophie.
  const sources = [...substitutions.entries()].filter(([, v]) => v.includes(p.nom))
    .map(([k]) => byName.get(norm(k))).filter(Boolean);
  const objectifs = [...new Set(sources.flatMap((e) => e.objectives || []))];
  const obj = objectifs.length ? objectifs : ['hypertrophy'];
  const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return `  {
    id: ${q(slug(p.nom))}, name: ${q(p.nom)},
    equipmentOptions: [[]],
    muscles: { primary: [${p.primaires.map(q).join(',')}], secondary: [${p.secondaires.map(q).join(',')}] },
    type: ${q(p.type)}, block: ${q(p.block)}, objectives: [${obj.map(q).join(',')}],
    level: [${p.level.map(q).join(',')}], failureAllowed: true,
    fallback: true,
    cue: ${q(p.cue)},
  },`;
}).join('\n');

const bloc = `${DEBUT}
  // Exercices de repli, générés par program-data/gen-integration.mjs à partir des
  // substitutions validées (program-data/substitutions-*.csv). NE PAS ÉDITER À LA
  // MAIN : relancer le script.
  // Aucun n'exige de matériel — le sac lesté, une chaise ou un lit ne sont pas du
  // matériel suivi, ils vivent dans la consigne. Un repli existe donc toujours,
  // quelle que soit la configuration déclarée.
  // Le drapeau fallback les réserve à ce rôle : comme ils ne demandent rien, ils
  // seraient sinon éligibles partout, et un utilisateur en salle pourrait se voir
  // proposer un « curl avec sac ». Les sélections normales les placent en dernier
  // et ne les retiennent que si plus rien d'autre n'est faisable.
${entrees}
${FIN}`;

// ── 4. Écriture dans la base ────────────────────────────────────────────────
let db = fs.readFileSync(DB, 'utf8');
if (db.includes(DEBUT)) {
  db = db.replace(new RegExp(`${DEBUT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${FIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), bloc);
} else {
  const i = db.lastIndexOf('\n];');
  if (i < 0) throw new Error('fin du tableau EXERCISES introuvable');
  db = db.slice(0, i) + '\n\n' + bloc + db.slice(i);
}

// Élargissement des niveaux d'entrées existantes.
let elargies = 0;
for (const p of propositions.filter((x) => x.aElargir)) {
  const src = byName.get(norm(p.nom));
  if (!src) { console.warn(`  ⚠ entrée à élargir introuvable : ${p.nom}`); continue; }
  const avant = `level: [${(src.level || []).map((l) => `'${l}'`).join(',')}]`;
  const apres = `level: [${p.level.map((l) => `'${l}'`).join(',')}]`;
  // On cible la ligne de CET exercice précis, pas toutes celles qui se ressemblent.
  const bornes = new RegExp(`(name: '${p.nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]{0,600}?)${avant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  if (!bornes.test(db)) { console.warn(`  ⚠ niveaux introuvables pour ${p.nom} (${avant})`); continue; }
  db = db.replace(bornes, `$1${apres}`);
  elargies++;
}

fs.writeFileSync(DB, db, 'utf8');
console.log(`✓ ${DB}`);
console.log(`  ${nouveaux.length} exercices insérés · ${elargies} entrée(s) élargie(s)`);

// ── 5. Table de substitution ────────────────────────────────────────────────
const lignes = [...substitutions.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n');
const moduleSubs = `// ─────────────────────────────────────────────────────────────────────────────
// REPLIS SANS MATÉRIEL
// Quand un exercice du programme n'est pas réalisable avec le matériel déclaré,
// on ne le laisse pas tel quel : on lui substitue un mouvement qui n'exige rien.
// Table établie exercice par exercice (et non par préréglage), donc valable pour
// n'importe quelle configuration, y compris personnalisée.
//
// La valeur est une LISTE de candidats, du plus proche au plus accessible : le
// premier qui convient au NIVEAU de l'utilisateur est retenu. Un handstand
// push-up remplace bien un développé militaire, mais pas pour un débutant — d'où
// les pompes piquées en second choix.
//
// GÉNÉRÉ par program-data/gen-integration.mjs depuis program-data/substitutions-*.csv
// NE PAS ÉDITER À LA MAIN : modifier les CSV puis relancer les deux générateurs.
// ─────────────────────────────────────────────────────────────────────────────

export const SUBSTITUTIONS = {
${lignes}
};

/** Candidats de repli pour cet exercice, du meilleur au plus accessible. */
export function substitutsDe(nomExercice) {
  return SUBSTITUTIONS[nomExercice] || [];
}
`;
fs.writeFileSync(SUBS, moduleSubs, 'utf8');
console.log(`✓ ${SUBS}`);
console.log(`  ${substitutions.size} correspondances`);
