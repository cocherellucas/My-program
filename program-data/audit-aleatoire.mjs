// Test à grande échelle : des combinaisons d'objectifs TIRÉES AU HASARD dans tout
// l'espace que l'interface autorise (y compris les sous-ensembles de muscles, qui
// à eux seuls font 1023 possibilités). Vérifie que chacune produit un programme
// STRUCTURELLEMENT valide.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const canon = new Set(EXERCISES.map((e) => e.name.toLowerCase()));
const UPPER = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'];
const LOWER = ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'];
const GROUPES = [...UPPER, ...LOWER];
const MOUVEMENTS = ['Squat barre', 'Développé couché', 'Soulevé de terre', 'Traction lestée'];
const TYPES = ['hypertrophy', 'strength', 'endurance'];
const ZONES = ['full_body', 'upper_body', 'lower_body', 'specific_group'];
const JOURS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = ['Barre olympique', 'Rack squat', 'Rack demi-cage', 'Banc plat', 'Banc réglable', 'Disques olympiques',
  'Haltères', 'Barre de traction', 'Barre EZ', 'Câble poulie haute', 'Câble poulie basse', 'Station câbles double',
  'Tirage vertical', 'Tirage horizontal', 'Presse à cuisses', 'Leg extension machine', 'Leg curl machine',
  'Hack squat machine', 'Mollets debout machine', 'Mollets assis machine', 'Pec deck', 'Développé machine',
  'Hip thrust machine', 'Fessier machine', 'Abducteur machine', 'Barres parallèles', 'Curl biceps machine',
  'Preacher curl machine', 'Kettlebells', 'Élastiques de résistance', 'Gilet lesté', 'Ceinture de lest'];

let graine = 12345;
const rnd = () => (graine = (graine * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = (a) => a[Math.floor(rnd() * a.length)];
const sample = (a, n) => a.slice().sort(() => rnd() - 0.5).slice(0, Math.max(1, n));

function objectifAleatoire(priorite) {
  const type = pick(TYPES);
  if (type === 'strength' && rnd() < 0.3) {
    return { type, zone: '', priority: priorite, focus_movement: sample(MOUVEMENTS, 1 + Math.floor(rnd() * 3)) };
  }
  const zone = pick(ZONES);
  if (zone === 'specific_group') {
    return { type, zone, priority: priorite, focus_group: sample(GROUPES, 1 + Math.floor(rnd() * 5)) };
  }
  return { type, zone, priority: priorite };
}

const N = Number(process.argv[2] || 2000);
const problemes = {};
const ajoute = (k) => { problemes[k] = (problemes[k] || 0) + 1; };
let ok = 0;

for (let i = 0; i < N; i++) {
  const nbObj = 1 + Math.floor(rnd() * 3);
  const objectives = [objectifAleatoire('primary')];
  for (let k = 1; k < nbObj; k++) objectives.push(objectifAleatoire('secondary'));

  const jours = sample(JOURS, 2 + Math.floor(rnd() * 5));
  const avecDuree = rnd() < 0.4;
  const user = {
    level: pick(['beginner', 'intermediate', 'advanced']),
    training_context: rnd() < 0.25 ? 'bodyweight' : 'full_gym',
    availability_optimal: false,
    frequency_max: jours.length,
    available_days: jours,
    equipment: GYM,
    ...(avecDuree ? { duration_per_day: Object.fromEntries(jours.map((d) => [d, pick([30, 45, 60, 90])])) } : {}),
  };

  let r;
  try { r = await buildActivationResult(user, objectives); }
  catch (e) { ajoute('EXCEPTION : ' + (e?.message || e).slice(0, 60)); continue; }
  if (!r) { ajoute('aucun programme produit'); continue; }

  const wk = r.sessions.filter((s) => s.week === 1);
  let bon = true;
  if (!wk.length) { ajoute('semaine vide'); bon = false; }
  if (wk.length > jours.length) { ajoute('plus de séances que de jours disponibles'); bon = false; }

  for (const s of wk) {
    if (!s.exercises.length) { ajoute('séance sans exercice'); bon = false; continue; }
    const vus = new Set();
    let rangPrec = -1;
    for (const x of s.exercises) {
      if (!canon.has(String(x.name).toLowerCase())) { ajoute('exercice absent de la base'); bon = false; }
      if (vus.has(x.name)) { ajoute('exercice en double dans la séance'); bon = false; }
      vus.add(x.name);
      if (!x.sets || x.sets < 1) { ajoute('séries invalides'); bon = false; }
      if (!x.target_reps) { ajoute('répétitions manquantes'); bon = false; }
      const rang = { A: 0, B: 1, C: 2 }[x.block] ?? 3;
      if (rang < rangPrec) { ajoute('blocs dans le désordre'); bon = false; }
      rangPrec = rang;
    }
    if (!s.day || !JOURS.includes(s.day)) { ajoute('jour invalide'); bon = false; }
    if (!jours.includes(s.day)) { ajoute('séance posée un jour NON disponible'); bon = false; }
  }
  if (bon) ok++;
}

console.log(`\n██ ${N} combinaisons tirées au hasard ██\n`);
console.log(`  ✓ programme valide : ${ok}  (${((ok / N) * 100).toFixed(1)} %)`);
const total = Object.values(problemes).reduce((a, b) => a + b, 0);
if (!total) console.log('  ✗ aucun problème');
else {
  console.log(`  ✗ problèmes : ${total}\n`);
  Object.entries(problemes).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`     ${String(n).padStart(5)}×  ${k}`));
}
