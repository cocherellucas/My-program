// Génère program-data/substitutions-poids-du-corps.md : la liste des exercices
// prescrits par les programmes « poids du corps » du catalogue mais INFAISABLES
// avec le matériel de rue, avec une colonne à remplir pour la substitution.
import fs from 'node:fs';
import path from 'node:path';
import { EXERCISES } from '../src/lib/exercise-database.js';
import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';
import { equipementPossede, exerciceFaisable } from '../src/lib/equipment.js';

// Chemin basé sur le dossier d'exécution : ce script est bundlé par esbuild
// avant d'être lancé (les imports du projet sont sans extension), donc
// import.meta.url pointerait sur le bundle temporaire, pas sur le dépôt.
const ICI = path.join(process.cwd(), 'program-data');

// Les deux niveaux de matériel que l'app propose au poids du corps.
const DEFAUT = ['Barre de traction haute', 'Barres parallèles', 'Barre basse'];
const COMPLET = ['Barre de traction haute', 'Barres parallèles', 'Barre basse', 'Anneaux de gymnaste',
  'Sangles de suspension (TRX)', 'Élastiques de résistance', 'Gilet lesté', 'Ceinture de lest', 'Sac à dos lesté'];
const possedeDefaut = equipementPossede(DEFAUT);
const possedeComplet = equipementPossede(COMPLET);
const RIEN = new Set(); // strictement aucun matériel

const byName = new Map(EXERCISES.map((e) => [e.name.toLowerCase(), e]));
const APP_MUSCLE = { Poitrine: 'Pectoraux', Abdos: 'Abdominaux' };
const appMuscle = (m) => APP_MUSCLE[m] || m;

// ── 1. Ce qui est prescrit et infaisable ────────────────────────────────────
const compte = new Map(); // nom → { occurrences, muscles: Set, programmes: Set }
for (const p of PRE_GENERATED_PROGRAMS) {
  if (p.match.training_context !== 'bodyweight') continue;
  for (const s of p.program.sessions) for (const x of s.exercises) {
    const e = byName.get(String(x.name).toLowerCase());
    if (!e || exerciceFaisable(e, possedeDefaut)) continue;
    const c = compte.get(x.name) || { n: 0, muscles: new Set(), niveaux: new Set() };
    c.n++;
    c.muscles.add(x.muscle_group);
    c.niveaux.add(p.match.level);
    compte.set(x.name, c);
  }
}

const NIVEAU_FR = { beginner: 'déb.', intermediate: 'inter.', advanced: 'avancé' };
const lignes = [...compte.entries()].map(([nom, c]) => {
  const e = byName.get(nom.toLowerCase());
  return {
    nom,
    n: c.n,
    muscle: [...c.muscles].join(', '),
    niveaux: [...c.niveaux].map((l) => NIVEAU_FR[l] || l).join(' '),
    type: e?.type === 'compound' ? 'poly' : 'iso',
    materiel: (e?.equipmentOptions || []).map((o) => o.join(' + ')).join('  OU  '),
    avecStreetComplet: exerciceFaisable(e, possedeComplet),
  };
});

// ── 2. La palette : ce qui est déjà faisable ────────────────────────────────
const faisables = EXERCISES
  .filter((e) => exerciceFaisable(e, possedeDefaut))
  .map((e) => ({
    nom: e.name,
    muscle: appMuscle(e.muscles?.primary?.[0] || '?'),
    type: e.type === 'compound' ? 'poly' : 'iso',
    sansRien: exerciceFaisable(e, RIEN),
    niveaux: (e.level || []).map((l) => NIVEAU_FR[l] || l).join(' '),
  }));

// ── 3. Écriture ─────────────────────────────────────────────────────────────
const parMuscle = {};
for (const l of lignes) {
  const cle = l.muscle || '(?)';
  (parMuscle[cle] = parMuscle[cle] || []).push(l);
}
const paletteParMuscle = {};
for (const f of faisables) (paletteParMuscle[f.muscle] = paletteParMuscle[f.muscle] || []).push(f);

const total = lignes.reduce((n, l) => n + l.n, 0);
let md = `# Substitutions — exercices infaisables au poids du corps

Généré par \`program-data/gen-substitutions.mjs\` — à régénérer après toute
modification du catalogue.

Ces exercices sont prescrits par les programmes **« poids du corps »** du
catalogue mais exigent du matériel que l'utilisateur n'a pas. Matériel de
référence : le préréglage street par défaut — **barre de traction, barres
parallèles, barre basse** (les équivalences de \`src/lib/equipment.js\` sont
appliquées).

- **${lignes.length}** exercices distincts concernés, **${total}** occurrences dans le catalogue.
- Colonne **Street+** : l'exercice devient faisable si l'utilisateur coche tout
  le matériel de rue (anneaux, élastiques, gilet et ceinture de lest, TRX).
  Un « oui » signifie qu'il n'a besoin d'une substitution que pour le préréglage
  par défaut.

**À remplir** : la colonne *Substitution*. Un exercice de remplacement par
ligne ; s'il dépend du muscle visé, écris-en un par muscle.

`;

// ── Couverture : y a-t-il seulement de quoi remplacer ? ─────────────────────
const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
const musclesConcernes = [...new Set(lignes.map((l) => l.muscle).filter(Boolean))].sort();
const dispoPour = (muscle, niveau) => EXERCISES.filter((e) =>
  exerciceFaisable(e, possedeDefaut)
  && appMuscle(e.muscles?.primary?.[0] || '') === muscle
  && (e.level || []).includes(niveau)).length;

md += `\n## ⚠ À lire d'abord — ce que la base permet vraiment\n\n`;
md += `Nombre d'exercices DÉJÀ faisables pour chaque muscle à remplacer, par niveau.\n`;
md += `Un **0** signifie qu'aucune substitution n'existe : il faudra ajouter un\n`;
md += `exercice à la base, pas seulement en désigner un autre.\n\n`;
md += '| Muscle | débutant | intermédiaire | avancé |\n|---|---|---|---|\n';
const trous = [];
for (const m of musclesConcernes) {
  const n = NIVEAUX.map((lv) => dispoPour(m, lv));
  md += `| ${m} | ${n.map((v) => (v === 0 ? '**0**' : v)).join(' | ')} |\n`;
  NIVEAUX.forEach((lv, i) => { if (n[i] === 0) trous.push(`${m} (${NIVEAU_FR[lv]})`); });
}
md += `\n${trous.length ? `**Trous à combler dans la base : ${trous.join(' · ')}**` : 'Chaque muscle a au moins une option à chaque niveau.'}\n`;

for (const muscle of Object.keys(parMuscle).sort()) {
  const l = parMuscle[muscle].sort((a, b) => b.n - a.n);
  md += `\n## ${muscle}\n\n`;
  md += '| Exercice | Type | Occ. | Niveaux | Matériel exigé | Street+ | Substitution |\n';
  md += '|---|---|---|---|---|---|---|\n';
  for (const x of l) {
    md += `| ${x.nom} | ${x.type} | ${x.n} | ${x.niveaux} | ${x.materiel || '—'} | ${x.avecStreetComplet ? 'oui' : 'non'} |  |\n`;
  }
}

md += `\n\n---\n\n# Palette disponible — ce qui est DÉJÀ faisable\n\n`;
md += `Les ${faisables.length} exercices utilisables avec le matériel street par défaut, par muscle.\n`;
md += `« sans rien » = aucun matériel du tout.\n`;
for (const muscle of Object.keys(paletteParMuscle).sort()) {
  const l = paletteParMuscle[muscle].sort((a, b) => a.nom.localeCompare(b.nom));
  md += `\n## ${muscle}\n\n`;
  md += '| Exercice | Type | Niveaux | Sans rien |\n|---|---|---|---|\n';
  for (const x of l) md += `| ${x.nom} | ${x.type} | ${x.niveaux} | ${x.sansRien ? 'oui' : 'non'} |\n`;
}

const sortie = path.join(ICI, 'substitutions-poids-du-corps.md');
fs.writeFileSync(sortie, md, 'utf8');
console.log(`✓ ${sortie}`);

// ── 4. Version tableur (LibreOffice Calc / Excel) ───────────────────────────
// Séparateur POINT-VIRGULE et BOM UTF-8 : c'est ce qu'attendent Calc et Excel
// en configuration française. Avec une virgule ou sans BOM, tout atterrit dans
// une seule colonne et les accents sont cassés.
const csvChamp = (v) => {
  const s = String(v ?? '');
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const alternativesPour = (muscle) => {
  const l = faisables.filter((f) => f.muscle === muscle);
  return l.length ? l.map((f) => `${f.nom} (${f.niveaux})`).join(' · ') : 'AUCUNE — exercice à créer';
};

const enTetes = ['Muscle', 'Exercice à remplacer', 'Type', 'Occurrences', 'Niveaux',
  'Matériel exigé', 'OK si street complet', 'Alternatives déjà faisables (même muscle)',
  'SUBSTITUTION (à remplir)', 'Remarque'];
const csvLignes = [enTetes.map(csvChamp).join(';')];
for (const muscle of Object.keys(parMuscle).sort()) {
  for (const x of parMuscle[muscle].sort((a, b) => b.n - a.n)) {
    csvLignes.push([muscle, x.nom, x.type, x.n, x.niveaux, x.materiel || '—',
      x.avecStreetComplet ? 'oui' : 'non', alternativesPour(muscle), '', ''].map(csvChamp).join(';'));
  }
}
const sortieCsv = path.join(ICI, 'substitutions-poids-du-corps.csv');
fs.writeFileSync(sortieCsv, '﻿' + csvLignes.join('\r\n') + '\r\n', 'utf8');
console.log(`✓ ${sortieCsv}`);
console.log(`  ${lignes.length} exercices à substituer (${total} occurrences)`);
console.log(`  ${faisables.length} exercices disponibles comme remplacement`);
const sansMuscle = lignes.filter((l) => !l.muscle);
if (sansMuscle.length) console.log(`  ⚠ ${sansMuscle.length} sans muscle identifié`);
