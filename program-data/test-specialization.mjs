import { buildActivationResult } from '../src/lib/program-activation.js';

const GYM = [
  'Barre de traction', 'Haltères', 'Barre EZ', 'Banc plat', 'Banc réglable', 'Banc décliné',
  'Barre olympique', 'Disques olympiques', 'Rack squat', 'Rack demi-cage',
  'Câble poulie haute', 'Câble poulie basse', 'Station câbles double', 'Poulie vis-à-vis',
  'Curl biceps machine', 'Preacher curl machine', 'Tirage vertical', 'Tirage horizontal',
  'Presse à cuisses', 'Leg extension machine', 'Leg curl machine', 'Hack squat machine',
  'Mollets debout machine', 'Mollets assis machine', 'Pec deck', 'Développé machine',
  'Barres parallèles', 'Ceinture de lest', 'Hip thrust machine', 'Kettlebells', 'Élastiques de résistance',
];

function eff(sessions) {
  const wk1 = sessions.filter((s) => s.week === 1);
  const e = {};
  for (const s of wk1) for (const x of s.exercises) {
    e[x.muscle_group] = (e[x.muscle_group] || 0) + (x.sets || 0);
    for (const sm of (x.muscles_secondary || [])) e[sm] = (e[sm] || 0) + 0.5 * (x.sets || 0);
  }
  return e;
}
function direct(sessions) {
  const wk1 = sessions.filter((s) => s.week === 1);
  const d = {};
  for (const s of wk1) for (const x of s.exercises) d[x.muscle_group] = (d[x.muscle_group] || 0) + (x.sets || 0);
  return d;
}

async function show(name, user, objectives, full = false) {
  const r = await buildActivationResult(user, objectives);
  console.log('\n════ ' + name + ' ════');
  if (!r) { console.log('  ✗ NULL'); return; }
  console.log('  → ' + r.matched_program_name);
  if (full) {
    for (const s of r.sessions.filter((s) => s.week === 1)) {
      console.log('   « ' + s.day_label + ' » (' + s.estimated_duration + ' min)');
      for (const x of s.exercises) console.log('      [' + x.block + '] ' + x.name.padEnd(34) + x.muscle_group.padEnd(13) + x.sets + '×' + x.target_reps + (x.muscles_secondary?.length ? '  (2e: ' + x.muscles_secondary.join(',') + ')' : ''));
    }
  }
  const d = direct(r.sessions), e = eff(r.sessions);
  const fmt = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([m, v]) => m + ':' + v).join('  ');
  console.log('  DIRECT   : ' + fmt(d));
  console.log('  EFFECTIF : ' + fmt(e));
}

const inter4 = { level: 'intermediate', training_context: 'full_gym', availability_optimal: false, frequency_max: 4, available_days: ['monday', 'tuesday', 'thursday', 'friday'], equipment: GYM };

await show('CAS 2 · Biceps SEUL (inter, 4j) — chin-up ajouté + comptage dos', inter4, [
  { type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Biceps'] },
], true);

await show('CAS 1 · Fessiers seul (inter, 4j)', inter4, [
  { type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Fessiers'] },
]);

await show('CAS 4 · Triceps seul (inter, 4j) — DC prise serrée attendu', inter4, [
  { type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Triceps'] },
], true);

await show('RÉGRESSION · Haut du corps large (doit rester intact)', inter4, [
  { type: 'hypertrophy', zone: 'upper_body', priority: 'primary' },
]);
