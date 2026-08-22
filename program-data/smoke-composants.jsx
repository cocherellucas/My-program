// Rendu RÉEL des composants retouchés, hors navigateur.
//
// Pourquoi : lint et build passent au vert sur un `t is not defined` — c'est une
// erreur d'EXÉCUTION. Le seul moyen de la voir sans navigateur est d'exécuter
// vraiment la fonction du composant. `renderToString` le fait : tout hook
// manquant, toute variable non définie dans le corps, lève ici.
//
// Ce n'est pas un test d'interface (pas de clic, pas de mise en page) : c'est un
// test de MONTAGE. Il répond à « est-ce que cet écran s'affiche sans planter ».
//
// Lancer :
//   npx esbuild program-data/smoke-composants.jsx --bundle --platform=node \
//     --format=cjs --alias:@=./src --loader:.js=jsx \
//     --define:import.meta.env='{"VITE_SUPABASE_URL":"https://exemple.supabase.co","VITE_SUPABASE_ANON_KEY":"x"}' \
//     --outfile=<tmp>.cjs && node <tmp>.cjs
// EN PREMIER : plusieurs dépendances lisent `window` dès leur chargement.
// esbuild respecte l'ordre des imports, donc ce module s'exécute avant elles.
import './_stubs-navigateur.js';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '@/lib/i18n';

import VolumeProposalCard from '@/components/coaching/VolumeProposalCard';
import PainCheckCard from '@/components/coaching/PainCheckCard';
import { RestTimerControl } from '@/components/session/RestTimer';
import ExerciseGif from '@/components/session/ExerciseGif';
import ExerciseCueButton from '@/components/session/ExerciseCueButton';
import ProgramSummaryCard from '@/components/dashboard/ProgramSummaryCard';
import AllegerGuide from '@/pages/AllegerGuide';
import { AnneauMemoire } from '@/components/coach/CoachMemoryPanel';

const enveloppe = (el) => React.createElement(MemoryRouter, null,
  React.createElement(I18nProvider, null, el));

// Une proposition de chaque forme, telle que computeVolumeProposal la rend.
const PROPOSITION_BAISSE = {
  direction: 'decrease', gravite: 'decharge', label: 'Fatigue élevée',
  faits: [
    { tk: 'fait_fatigue_moyenne', n: 4.2 },
    { tk: 'fait_stagnation', n: 3 },
    { tk: 'fait_sans_decharge', n: 9 },
  ],
  conseil: 'Allège nettement cette semaine.',
};
const PROPOSITION_HAUSSE = {
  direction: 'increase', gravite: 'hausse', label: 'Tu stagnes, mais tu récupères bien',
  faits: [
    { tk: 'fait_stagne_exos', liste: ['Développé couché', 'Rowing barre'] },
    { tk: 'fait_fatigue_ok', n: 2.4 },
  ],
  conseil: 'Tu peux ajouter du volume sur ces exercices.',
};
const EPISODE = { zone: 'shoulders', level: 1, status: 'active', history: [], betterStreak: 0 };
const PRESCRIPTION = {
  direction: 'decrease', label: 'On protège ton épaule',
  detail: 'Baisse la charge de 20 %…', apply: { zone: 'shoulders', toLevel: 2 },
};

const CAS = [
  ['VolumeProposalCard — baisse', () => React.createElement(VolumeProposalCard, { proposal: PROPOSITION_BAISSE })],
  ['VolumeProposalCard — hausse', () => React.createElement(VolumeProposalCard, { proposal: PROPOSITION_HAUSSE })],
  ['PainCheckCard — question', () => React.createElement(PainCheckCard, { episode: EPISODE, proposal: null })],
  ['PainCheckCard — conseil', () => React.createElement(PainCheckCard, { episode: EPISODE, proposal: PRESCRIPTION })],
  ['PainCheckCard — en pause', () => React.createElement(PainCheckCard, { episode: { ...EPISODE, status: 'stop_advised' }, proposal: null })],
  ['RestTimerControl', () => React.createElement(RestTimerControl, { seconds: 90 })],
  ['ExerciseGif — avec vidéo', () => React.createElement(ExerciseGif, { exerciseName: 'Pec deck' })],
  ['ExerciseGif — inconnu', () => React.createElement(ExerciseGif, { exerciseName: 'Exercice inexistant' })],
  ['ExerciseCueButton', () => React.createElement(ExerciseCueButton, { name: 'Développé couché' })],
  ['ProgramSummaryCard — vide', () => React.createElement(ProgramSummaryCard, { program: null })],
  ['AllegerGuide (page entière)', () => React.createElement(AllegerGuide, null)],
  ['AnneauMemoire — vide', () => React.createElement(AnneauMemoire, { taux: 0 })],
  ['AnneauMemoire — plein', () => React.createElement(AnneauMemoire, { taux: 1 })],
];

// `useLayoutEffect` prévient à chaque rendu qu'il ne sert à rien côté serveur.
// C'est attendu ici (on teste le montage, pas les effets) et ça noie le résultat.
const avertir = console.error;
console.error = (...a) => { if (!String(a[0]).includes('useLayoutEffect')) avertir(...a); };

console.log('\n██ MONTAGE DES COMPOSANTS RETOUCHÉS ██\n');
let casses = 0;
for (const [nom, fabrique] of CAS) {
  try {
    const html = renderToString(enveloppe(fabrique()));
    // Une clé non traduite ressort telle quelle (t() rend la clé) — on le signale.
    const brutes = [...html.matchAll(/>([a-z][a-z0-9_]{4,})</g)]
      .map((m) => m[1]).filter((s) => /^(se|pg|mem|an|sb|pr|im|al|vp|fait|zl|cue|gif|rt|nf|pf|lib|co|ot|ps|day|sp|tuto|pain)_/.test(s));
    if (brutes.length) {
      casses++;
      console.log(`  ✗ ${nom} — clés non traduites affichées : ${[...new Set(brutes)].join(', ')}`);
    } else {
      console.log(`  ✓ ${nom}  (${html.length} car.)`);
    }
  } catch (e) {
    casses++;
    console.log(`  ✗ ${nom} — ${e.message}`);
  }
}
console.log(casses === 0
  ? `\n✓ ${CAS.length}/${CAS.length} montés sans erreur\n`
  : `\n✗ ${casses} cas en échec sur ${CAS.length}\n`);
process.exit(casses === 0 ? 0 : 1);
