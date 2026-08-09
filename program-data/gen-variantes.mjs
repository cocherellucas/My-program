// Génère program-data/variantes-poids-du-corps.csv : chaque exercice réalisable
// SANS MATÉRIEL, avec sa variante plus simple et sa variante plus dure.
//
// Pourquoi : la base ne contient aucune régression. Le plus facile pour les
// pectoraux est « Pompe » — quelqu'un qui n'en fait pas une n'a rien en dessous.
// Des chaînes de progression existent bien (src/lib/progression-chains.js) mais
// elles ne servent qu'à enrichir les prompts de l'IA, et leurs noms ne
// correspondent pas à ceux de la base (« Pompes normales » vs « Pompe »).
// Ce fichier sert à établir le lien à la main, exercice par exercice.
import fs from 'node:fs';
import path from 'node:path';
import { EXERCISES } from '../src/lib/exercise-database.js';
import { PROGRESSION_CHAINS, findExerciseInChains } from '../src/lib/progression-chains.js';

const ICI = path.join(process.cwd(), 'program-data');
const APP = { Poitrine: 'Pectoraux', Abdos: 'Abdominaux' };
const FR = { beginner: 'déb.', intermediate: 'inter.', advanced: 'avancé' };
const nomsEtape = (e) => (e?.or ? e.or : [e]);

const sansMateriel = EXERCISES
  .filter((e) => e.equipmentOptions?.some((o) => o.length === 0))
  .sort((a, b) => (APP[a.muscles?.primary?.[0]] || a.muscles?.primary?.[0] || '')
    .localeCompare(APP[b.muscles?.primary?.[0]] || b.muscles?.primary?.[0] || '')
    || a.name.localeCompare(b.name));

let exacts = 0, partiels = 0, absents = 0;
const lignes = sansMateriel.map((e) => {
  const trouve = findExerciseInChains(e.name);
  let chaine = '', position = '', plusSimple = '', plusDur = '', qualite = '';

  if (!trouve) { absents++; qualite = 'aucune chaîne'; }
  else {
    chaine = trouve.chainName;
    const exact = trouve.currentIndex >= 0
      && nomsEtape(trouve.chain[trouve.currentIndex]).some((n) => n.toLowerCase() === e.name.toLowerCase());
    if (exact) { exacts++; qualite = 'exacte'; }
    else if (trouve.currentIndex >= 0) { partiels++; qualite = 'approximative — À VÉRIFIER'; }
    else { partiels++; qualite = 'chaîne devinée par mot-clé — À VÉRIFIER'; }

    if (trouve.currentIndex >= 0) {
      position = `${trouve.currentIndex + 1}/${trouve.chain.length}`;
      const avant = trouve.chain[trouve.currentIndex - 1];
      const apres = trouve.chain[trouve.currentIndex + 1];
      plusSimple = avant ? nomsEtape(avant).join(' ou ') : '';
      plusDur = apres ? nomsEtape(apres).join(' ou ') : '';
    }
  }

  return {
    muscle: APP[e.muscles?.primary?.[0]] || e.muscles?.primary?.[0] || '?',
    nom: e.name,
    type: e.type === 'compound' ? 'poly' : 'iso',
    niveaux: (e.level || []).map((l) => FR[l] || l).join(' '),
    chaine, position, qualite, plusSimple, plusDur,
  };
});

const csvChamp = (v) => {
  const s = String(v ?? '');
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const enTetes = ['Muscle', 'Exercice', 'Type', 'Niveaux',
  'Chaîne existante', 'Position', 'Fiabilité du rattachement',
  'Proposition PLUS SIMPLE', 'Proposition PLUS DUR',
  'VARIANTE PLUS SIMPLE (à remplir)', 'VARIANTE PLUS DURE (à remplir)', 'Remarque'];
const csv = [enTetes.map(csvChamp).join(';')];
for (const l of lignes) {
  csv.push([l.muscle, l.nom, l.type, l.niveaux, l.chaine || '—', l.position || '—',
    l.qualite, l.plusSimple || '—', l.plusDur || '—', '', '', ''].map(csvChamp).join(';'));
}

// Les chaînes telles qu'elles existent, pour référence en bas de fichier.
csv.push('');
csv.push(['CHAÎNES EXISTANTES (src/lib/progression-chains.js) — du plus simple au plus dur'].map(csvChamp).join(';'));
for (const [nom, chaine] of Object.entries(PROGRESSION_CHAINS)) {
  csv.push([nom, ...chaine.map((s) => nomsEtape(s).join(' ou '))].map(csvChamp).join(';'));
}

const sortie = path.join(ICI, 'variantes-poids-du-corps.csv');
fs.writeFileSync(sortie, '﻿' + csv.join('\r\n') + '\r\n', 'utf8');
console.log(`✓ ${sortie}`);
console.log(`  ${lignes.length} exercices sans matériel`);
console.log(`     rattachement exact à une chaîne : ${exacts}`);
console.log(`     rattachement approximatif       : ${partiels}  (à vérifier)`);
console.log(`     aucune chaîne                   : ${absents}`);
