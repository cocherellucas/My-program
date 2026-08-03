// Couverture : quelles combinaisons d'objectifs que l'interface AUTORISE
// produisent réellement un programme ?
import { buildActivationResult } from '../src/lib/program-activation.js';

const TYPES = ['hypertrophy', 'strength', 'endurance'];
const ZONES = ['full_body', 'upper_body', 'lower_body'];
const GROUPES = ['Pectoraux', 'Dos', 'Quadriceps', 'Biceps', 'Fessiers'];
const MOUVEMENTS = ['Squat barre', 'Développé couché', 'Soulevé de terre', 'Traction lestée'];
const GYM = ['Barre olympique', 'Rack squat', 'Banc plat', 'Banc réglable', 'Disques olympiques', 'Haltères',
  'Barre de traction', 'Barre EZ', 'Câble poulie haute', 'Câble poulie basse', 'Station câbles double',
  'Tirage vertical', 'Tirage horizontal', 'Presse à cuisses', 'Leg extension machine', 'Leg curl machine',
  'Mollets debout machine', 'Mollets assis machine', 'Pec deck', 'Hip thrust machine', 'Barres parallèles',
  'Curl biceps machine', 'Fessier machine', 'Développé machine', 'Hack squat machine'];

const user = (level, ctx) => ({
  level, training_context: ctx, availability_optimal: false, frequency_max: 4,
  available_days: ['monday', 'tuesday', 'thursday', 'friday'], equipment: GYM,
});

const ok = [];
const ko = [];
async function essai(nom, objectives) {
  for (const level of ['beginner', 'intermediate', 'advanced']) {
    const r = await buildActivationResult(user(level, 'full_gym'), objectives);
    (r ? ok : ko).push(`${level} · ${nom}`);
  }
}

// 1 objectif — zone
for (const t of TYPES) for (const z of ZONES) {
  await essai(`${t} / ${z}`, [{ type: t, zone: z, priority: 'primary' }]);
}
// 1 objectif — groupe spécifique
for (const t of TYPES) for (const g of GROUPES) {
  await essai(`${t} / groupe ${g}`, [{ type: t, zone: 'specific_group', priority: 'primary', focus_group: [g] }]);
}
// 1 objectif — mouvements (toutes les combinaisons non vides)
for (let m = 1; m < 16; m++) {
  const movs = MOUVEMENTS.filter((_, i) => m & (1 << i));
  await essai(`force / mouvements [${movs.length}]`, [{ type: 'strength', zone: '', priority: 'primary', focus_movement: movs }]);
}
// 2 objectifs — zone primaire + zone secondaire
for (const t1 of TYPES) for (const z1 of ZONES) for (const t2 of TYPES) for (const z2 of ZONES) {
  if (t1 === t2 && z1 === z2) continue;
  await essai(`${t1}/${z1} + ${t2}/${z2} (2e)`, [
    { type: t1, zone: z1, priority: 'primary' },
    { type: t2, zone: z2, priority: 'secondary' },
  ]);
}
// 2 objectifs — groupe primaire + zone secondaire
for (const g of GROUPES) for (const z of ZONES) {
  await essai(`groupe ${g} + hyper/${z} (2e)`, [
    { type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: [g] },
    { type: 'hypertrophy', zone: z, priority: 'secondary' },
  ]);
}

const tot = ok.length + ko.length;
console.log(`\n██ COUVERTURE DES OBJECTIFS — ${tot} combinaisons testées ██\n`);
console.log(`  ✓ programme généré : ${ok.length}  (${Math.round(ok.length / tot * 100)} %)`);
console.log(`  ✗ AUCUN programme  : ${ko.length}  (${Math.round(ko.length / tot * 100)} %)\n`);
if (ko.length) {
  const familles = {};
  for (const k of ko) {
    const cle = k.split('·')[1].trim().replace(/\[\d+\]/, '[n]');
    (familles[cle] = familles[cle] || []).push(k);
  }
  console.log('Combinaisons SANS programme, par famille :');
  Object.entries(familles).sort((a, b) => b[1].length - a[1].length)
    .forEach(([c, l]) => console.log(`  ${String(l.length).padStart(3)}×  ${c}`));
}
