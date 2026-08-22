// AUDIT — le bloc « séance en cours » envoyé au coach.
//
// Vérifie sur un brouillon fabriqué que le coach reçoit bien : le rang de
// l'exercice en cours, tous les exercices déjà entamés avec leurs séries, la
// fatigue déclarée, et les douleurs signalées pendant la séance. Et qu'il ne
// reçoit RIEN quand aucune séance n'est ouverte (sinon on paierait un bloc de
// prompt pour du vide à chaque message).
//
// Lancer :
//   npx esbuild program-data/audit-contexte-seance.mjs --bundle --platform=node \
//     --format=cjs --alias:@=./src --outfile=<tmp>.cjs && node <tmp>.cjs
import './_stubs-navigateur.js';
import { contexteSeanceEnCours } from '@/lib/session-context';

const BROUILLON = {
  currentExIdx: 6,
  fatigue: 4,
  sessionExercises: [
    { name: 'Front squat barre', sets: 4 },
    { name: 'Presse à cuisses', sets: 3 },
    { name: 'Leg curl allongé', sets: 3 },
    { name: 'Fentes haltères', sets: 3 },
    { name: 'Extension mollets', sets: 4 },
    { name: 'Gainage', sets: 3 },
    { name: 'Leg extension', sets: 3 },
  ],
  logs: {
    '0-0': { weight: 60, reps: 8, mode: 'RIR_2', quality: 'good' },
    '0-1': { weight: 60, reps: 7, mode: 'RIR_1', quality: 'degraded' },
    '1-0': { weight: 120, reps: 10, mode: 'RIR_2', quality: 'good' },
    '2-0': { weight: 35, reps: 12, mode: 'RIR_3', quality: 'good',
             pain_note: 'Où : Genou — Quand : En bas du mouvement — Comment : Pincement, ça accroche' },
    '3-0': { weight: 20, reps: 10, mode: 'RIR_2', quality: 'good' },
    '4-0': { weight: 50, reps: 15, mode: 'RIR_2', quality: 'good' },
    '5-0': { weight: 0, reps: 45, mode: 'RIR_2', quality: 'bad' },
  },
};

let echecs = 0;
const attendu = (condition, quoi) => {
  if (condition) console.log(`  ✓ ${quoi}`);
  else { echecs++; console.log(`  ✗ ${quoi}`); }
};

console.log('\n██ CONTEXTE « SÉANCE EN COURS » ██\n');

localStorage.setItem('active_session_id', 'S1');
localStorage.setItem('session_draft_S1', JSON.stringify(BROUILLON));
const bloc = contexteSeanceEnCours();

console.log(bloc.trim().split('\n').map((l) => '    ' + l).join('\n') + '\n');

attendu(/exercice 7 sur 7/.test(bloc), "situe l'exercice en cours (7 sur 7)");
attendu(/6 déjà entamé/.test(bloc), 'compte les exercices déjà entamés');
attendu(bloc.includes('Front squat barre'), 'nomme le premier exercice');
attendu(bloc.includes('60 kg 8 reps RIR 2'), 'détaille poids, reps et RIR');
attendu(bloc.includes('exécution dégradée'), "signale une exécution dégradée");
attendu(!/exécution propre/.test(bloc), "n'encombre pas avec les exécutions propres");
attendu(bloc.includes('(Leg extension)'), "NOMME l'exercice en cours, même sans série saisie");
attendu(/Fatigue déclarée pour cette séance : 4\/5/.test(bloc), 'transmet la fatigue déclarée');
attendu(/Douleurs signalées/.test(bloc) && bloc.includes('Leg curl allongé série 1'), 'transmet la douleur avec son exercice et sa série');
attendu(!bloc.includes('Leg extension :'), "ne liste pas les exercices non entamés");

// Aucune séance ouverte → aucun bloc.
localStorage.removeItem('active_session_id');
attendu(contexteSeanceEnCours() === '', 'ne renvoie rien hors séance');

// Séance ouverte mais rien de saisi → aucun bloc non plus.
localStorage.setItem('active_session_id', 'S2');
localStorage.setItem('session_draft_S2', JSON.stringify({ currentExIdx: 0, sessionExercises: [{ name: 'Squat', sets: 3 }], logs: {} }));
attendu(contexteSeanceEnCours() === '', 'ne renvoie rien quand rien n\'est encore saisi');

// Brouillon corrompu → pas d'exception.
localStorage.setItem('session_draft_S2', '{{{pas du json');
let survecu = true;
try { contexteSeanceEnCours(); } catch { survecu = false; }
attendu(survecu, 'survit à un brouillon illisible');

console.log(echecs === 0 ? '\n✓ contexte de séance conforme\n' : `\n✗ ${echecs} problème(s)\n`);
process.exit(echecs === 0 ? 0 : 1);
