// Fréquence des muscles PRIMAIRES dans chaque programme du catalogue.
//
// Un muscle présent dans N séances sur N reviendra forcément à 24 h dès que deux
// jours d'entraînement sont collés. C'est ce qui déclenche le retour à 24 h en
// hypertrophie (fenêtre 48 h) et en force (72 h).
//
// SEULS LES MUSCLES PRIMAIRES SONT COMPTÉS. `muscle_group` est le muscle ciblé,
// mené près de l'échec sur son exercice dédié ; `muscles_secondary` (les
// synergistes, jamais à l'échec) est volontairement ignoré — ils ne créent pas
// la même dette de récupération.
import fs from 'node:fs';
import path from 'node:path';
import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';

const lignes = [];
const parMuscleTous = new Map();   // muscle → nb de programmes où il est dans TOUTES les séances
const parMuscleDeux = new Map();   // muscle → nb de programmes où il est dans ≥2 séances

for (const p of PRE_GENERATED_PROGRAMS) {
  const sessions = p.program?.sessions || [];
  if (sessions.length < 2) continue;

  const compte = new Map();
  for (const s of sessions) {
    for (const m of new Set(s.exercises.map((x) => x.muscle_group))) {
      compte.set(m, (compte.get(m) || 0) + 1);
    }
  }

  const m = p.match || {};
  const id = `${m.level}/${m.training_context}/${m.objectives_signature}/${m.weekly_frequency}j`;

  for (const [muscle, n] of compte) {
    if (n < 2) continue;
    parMuscleDeux.set(muscle, (parMuscleDeux.get(muscle) || 0) + 1);
    if (n === sessions.length) parMuscleTous.set(muscle, (parMuscleTous.get(muscle) || 0) + 1);
    lignes.push({
      programme: id,
      nom: p.program?.name || '',
      muscle,
      seances: n,
      total: sessions.length,
      partout: n === sessions.length ? 'OUI' : '',
    });
  }
}

const total = PRE_GENERATED_PROGRAMS.filter((p) => (p.program?.sessions || []).length >= 2).length;
console.log(`\n██ FRÉQUENCE DES MUSCLES PRIMAIRES — ${total} programmes (≥ 2 séances) ██\n`);
console.log('  Muscle présent dans TOUTES les séances du programme :');
for (const [mus, n] of [...parMuscleTous].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${mus.padEnd(20)} ${String(n).padStart(3)} programmes  (${Math.round((n / total) * 100)} %)`);
}
console.log('\n  Muscle présent dans au moins 2 séances :');
for (const [mus, n] of [...parMuscleDeux].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${mus.padEnd(20)} ${String(n).padStart(3)} programmes  (${Math.round((n / total) * 100)} %)`);
}

// Les programmes les plus chargés : plusieurs muscles présents PARTOUT.
const parProgramme = new Map();
for (const l of lignes) {
  if (l.partout !== 'OUI') continue;
  if (!parProgramme.has(l.programme)) parProgramme.set(l.programme, []);
  parProgramme.get(l.programme).push(l.muscle);
}
const pires = [...parProgramme]
  .map(([prog, muscles]) => [prog, [...new Set(muscles)]])
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 12);
console.log('\n  Programmes où le PLUS de muscles reviennent à CHAQUE séance :');
for (const [prog, muscles] of pires) {
  console.log(`    ${String(muscles.length).padStart(2)} muscles · ${prog}`);
  console.log(`         ${muscles.join(', ')}`);
}

// Le cas qui pose problème : muscle partout ET programme à 3 séances ou plus
// (à 2 séances sur jours espacés, il n'y a pas de retour à 24 h).
const risque = [...parProgramme].filter(([prog]) => {
  const j = parseInt(String(prog).split('/').pop(), 10);
  return j >= 3;
});
console.log(`\n  Programmes à 3 séances ou plus avec au moins un muscle partout : ${risque.length}`);

// Export CSV pour travailler le catalogue.
const csv = ['Programme;Nom;Muscle;Seances;Total;Dans toutes les seances'];
for (const l of lignes.sort((a, b) => (b.seances / b.total) - (a.seances / a.total) || a.programme.localeCompare(b.programme))) {
  csv.push([l.programme, l.nom, l.muscle, l.seances, l.total, l.partout].join(';'));
}
const sortie = path.join(process.cwd(), 'program-data', 'frequence-muscles-catalogue.csv');
fs.writeFileSync(sortie, '﻿' + csv.join('\r\n') + '\r\n', 'utf8');
console.log(`\n  → détail complet (${lignes.length} lignes) : ${sortie}\n`);
