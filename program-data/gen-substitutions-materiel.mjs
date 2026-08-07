// Génère program-data/substitutions-materiel.csv : TOUS les exercices du
// catalogue qui exigent du matériel, hors ceux déjà traités dans le tableau
// « poids du corps ». Une table par EXERCICE (et non par préréglage) couvre
// n'importe quelle configuration de matériel, y compris les choix personnalisés.
import fs from 'node:fs';
import path from 'node:path';
import { EXERCISES } from '../src/lib/exercise-database.js';
import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';
import { equipementPossede, exerciceFaisable } from '../src/lib/equipment.js';

const ICI = path.join(process.cwd(), 'program-data');
const byName = new Map(EXERCISES.map((e) => [e.name.toLowerCase(), e]));
const APP_MUSCLE = { Poitrine: 'Pectoraux', Abdos: 'Abdominaux' };
const appMuscle = (m) => APP_MUSCLE[m] || m;
const NIVEAU_FR = { beginner: 'déb.', intermediate: 'inter.', advanced: 'avancé' };

// Déjà couverts par le tableau poids du corps (rempli par Lucas).
const DEJA_TRAITES = new Set(['Curl aux anneaux', 'Curl élastique', 'Curl marteau',
  'Tirage poulie bras tendus', 'Rowing TRX', 'Hip thrust barre', 'Good morning',
  'Mollets lestés une jambe', 'Écarté poulie', 'Dips lestés aux barres parallèles',
  'Pompe pieds surélevés', 'Fente bulgare haltères', 'Fente marchée haltères',
  'Dips triceps machine', 'Extension triceps élastique', 'Élévations latérales haltères',
  'Oiseau haltères (deltoïde postérieur)']);

// Configurations de référence : sert à dire À QUI l'exercice manque.
const CONFIGS = {
  'street complet': ['Barre de traction haute', 'Barres parallèles', 'Barre basse', 'Anneaux de gymnaste',
    'Sangles de suspension (TRX)', 'Élastiques de résistance', 'Gilet lesté', 'Ceinture de lest', 'Sac à dos lesté'],
  'home_barbell': ['Barre olympique', 'Rack squat', 'Banc réglable', 'Haltères', 'Barre de traction', 'Élastiques de résistance'],
  'haltères seuls': ['Haltères', 'Banc réglable', 'Élastiques de résistance'],
};
const possedes = Object.fromEntries(Object.entries(CONFIGS).map(([k, v]) => [k, equipementPossede(v)]));
const RIEN = new Set();

// Occurrences dans le catalogue, tous tiers confondus.
const compte = new Map();
for (const p of PRE_GENERATED_PROGRAMS) {
  for (const s of p.program.sessions) for (const x of s.exercises) {
    const c = compte.get(x.name) || { n: 0, muscles: new Set() };
    c.n++;
    c.muscles.add(x.muscle_group);
    compte.set(x.name, c);
  }
}

const lignes = [];
for (const [nom, c] of compte) {
  const e = byName.get(nom.toLowerCase());
  if (!e) continue;
  if (exerciceFaisable(e, RIEN)) continue;   // déjà faisable sans rien
  if (DEJA_TRAITES.has(nom)) continue;       // couvert par le tableau poids du corps
  const manqueA = Object.keys(CONFIGS).filter((k) => !exerciceFaisable(e, possedes[k]));
  lignes.push({
    muscle: [...c.muscles].join(', '),
    nom,
    type: e.type === 'compound' ? 'poly' : 'iso',
    n: c.n,
    niveaux: (e.level || []).map((l) => NIVEAU_FR[l] || l).join(' '),
    materiel: (e.equipmentOptions || []).map((o) => o.join(' + ')).join('  OU  '),
    manqueA: manqueA.length ? manqueA.join(' · ') : 'personne (matériel courant)',
  });
}

// Palette : ce qui se fait sans AUCUN matériel, par muscle — la cible d'un repli
// universel (une substitution qui marche pour tout le monde).
const sansRien = {};
for (const e of EXERCISES) {
  if (!exerciceFaisable(e, RIEN)) continue;
  const m = appMuscle(e.muscles?.primary?.[0] || '?');
  (sansRien[m] = sansRien[m] || []).push(`${e.name} (${(e.level || []).map((l) => NIVEAU_FR[l] || l).join(' ')})`);
}
const alternativesPour = (muscle) => {
  const premier = String(muscle).split(',')[0].trim();
  return sansRien[premier]?.join(' · ') || 'AUCUNE — exercice à créer';
};

const csvChamp = (v) => {
  const s = String(v ?? '');
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const enTetes = ['Muscle', 'Exercice à remplacer', 'Type', 'Occurrences', 'Niveaux',
  'Matériel exigé', 'Manque à', 'Alternatives sans aucun matériel (même muscle)',
  'SUBSTITUTION (à remplir)', 'Remarque'];

lignes.sort((a, b) => a.muscle.localeCompare(b.muscle) || b.n - a.n);
const csv = [enTetes.map(csvChamp).join(';')];
for (const l of lignes) {
  csv.push([l.muscle, l.nom, l.type, l.n, l.niveaux, l.materiel, l.manqueA,
    alternativesPour(l.muscle), '', ''].map(csvChamp).join(';'));
}

const sortie = path.join(ICI, 'substitutions-materiel.csv');
fs.writeFileSync(sortie, '﻿' + csv.join('\r\n') + '\r\n', 'utf8');
console.log(`✓ ${sortie}`);
console.log(`  ${lignes.length} exercices à substituer`);
for (const k of Object.keys(CONFIGS)) {
  console.log(`    manquent à « ${k} » : ${lignes.filter((l) => l.manqueA.includes(k)).length}`);
}
