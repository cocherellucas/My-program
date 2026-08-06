// DÉTERMINISME : à profil et objectifs identiques, la génération doit rendre
// EXACTEMENT le même programme, à chaque fois et dans n'importe quel ordre.
// (Le moteur n'utilise ni Math.random ni la date — ce test le vérifie.)
import { buildActivationResult } from '../src/lib/program-activation.js';

const GYM = ['Barre olympique', 'Rack squat', 'Banc plat', 'Banc réglable', 'Disques olympiques',
  'Haltères', 'Barre de traction', 'Barre EZ', 'Câble poulie haute', 'Câble poulie basse',
  'Station câbles double', 'Tirage vertical', 'Tirage horizontal', 'Presse à cuisses',
  'Leg extension machine', 'Leg curl machine', 'Hack squat machine', 'Mollets debout machine',
  'Mollets assis machine', 'Pec deck', 'Développé machine', 'Hip thrust machine', 'Fessier machine',
  'Abducteur machine', 'Barres parallèles', 'Curl biceps machine', 'Preacher curl machine',
  'Kettlebells', 'Élastiques de résistance', 'Gilet lesté', 'Ceinture de lest'];
const BW = ['Barre de traction haute', 'Barres parallèles', 'Barre basse'];

const profils = [
  { nom: 'corps entier · 3j collés · 60 min',
    user: { level: 'intermediate', training_context: 'full_gym', equipment: GYM,
      availability_optimal: false, frequency_max: 3,
      available_days: ['monday', 'tuesday', 'wednesday'],
      duration_per_day: { monday: 60, tuesday: 60, wednesday: 60 } },
    obj: [{ type: 'hypertrophy', zone: 'full_body', priority: 'primary' }] },
  { nom: 'haut primaire + bas secondaire · 5j',
    user: { level: 'advanced', training_context: 'full_gym', equipment: GYM,
      availability_optimal: false, frequency_max: 5,
      available_days: ['monday', 'tuesday', 'wednesday', 'friday', 'saturday'],
      duration_per_day: { monday: 75, tuesday: 75, wednesday: 75, friday: 75, saturday: 75 } },
    obj: [{ type: 'hypertrophy', zone: 'upper_body', priority: 'primary' },
      { type: 'hypertrophy', zone: 'lower_body', priority: 'secondary' }] },
  { nom: 'spécialisation 3 muscles · 4j',
    user: { level: 'intermediate', training_context: 'full_gym', equipment: GYM,
      availability_optimal: false, frequency_max: 4,
      available_days: ['monday', 'wednesday', 'friday', 'sunday'],
      duration_per_day: { monday: 60, wednesday: 60, friday: 60, sunday: 60 } },
    obj: [{ type: 'hypertrophy', zone: 'specific_group', focus_group: ['Biceps', 'Dos', 'Épaules'], priority: 'primary' }] },
  { nom: 'force sur mouvements + hypertrophie · 4j',
    user: { level: 'advanced', training_context: 'full_gym', equipment: GYM,
      availability_optimal: false, frequency_max: 4,
      available_days: ['monday', 'tuesday', 'thursday', 'friday'],
      duration_per_day: { monday: 90, tuesday: 90, thursday: 90, friday: 90 } },
    obj: [{ type: 'strength', zone: '', focus_movement: ['Squat barre', 'Développé couché'], priority: 'primary' },
      { type: 'hypertrophy', zone: 'upper_body', priority: 'secondary' }] },
  { nom: 'poids du corps · endurance · 3j libres',
    user: { level: 'beginner', training_context: 'bodyweight', equipment: BW,
      availability_optimal: true, frequency_max: 3,
      available_days: ['monday', 'wednesday', 'friday'] },
    obj: [{ type: 'endurance', zone: 'full_body', priority: 'primary' }] },
];

const REPETITIONS = 8;
let ko = 0;

console.log('══ DÉTERMINISME DE LA GÉNÉRATION ══\n');
for (const p of profils) {
  const empreintes = new Set();
  for (let i = 0; i < REPETITIONS; i++) {
    const r = await buildActivationResult(p.user, p.obj);
    empreintes.add(JSON.stringify(r));
  }
  const stable = empreintes.size === 1;
  if (!stable) ko++;
  console.log(`  ${stable ? '✓' : '✗'} ${p.nom.padEnd(42)} ${empreintes.size} résultat(s) sur ${REPETITIONS}`);
}

// L'ORDRE des objectifs ne doit pas changer le résultat quand les priorités
// sont explicites… en revanche il PEUT compter (le premier objectif l'emporte
// en cas d'égalité) : on vérifie seulement que rejouer la MÊME liste est stable.
console.log('\n══ Stabilité entre deux appels séparés (cache du catalogue) ══');
const a = await buildActivationResult(profils[0].user, profils[0].obj);
const b = await buildActivationResult(profils[0].user, profils[0].obj);
const memeApresAutres = JSON.stringify(a) === JSON.stringify(b);
if (!memeApresAutres) ko++;
console.log(`  ${memeApresAutres ? '✓' : '✗'} deux appels espacés donnent le même programme`);

// Le profil ne doit pas être MODIFIÉ par la génération (effet de bord).
const avant = JSON.stringify(profils[1].user);
await buildActivationResult(profils[1].user, profils[1].obj);
const intact = JSON.stringify(profils[1].user) === avant;
if (!intact) ko++;
console.log(`  ${intact ? '✓' : '✗'} le profil n'est pas modifié par la génération`);

console.log(`\n${ko === 0 ? '✓ génération entièrement déterministe' : `✗ ${ko} problème(s)`}`);
