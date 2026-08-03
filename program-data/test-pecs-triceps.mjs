import { buildActivationResult } from '../src/lib/program-activation.js';

const GYM = ['Barre de traction', 'Haltères', 'Barre EZ', 'Banc plat', 'Banc réglable', 'Barre olympique',
  'Disques olympiques', 'Rack squat', 'Câble poulie haute', 'Câble poulie basse', 'Station câbles double',
  'Curl biceps machine', 'Tirage vertical', 'Tirage horizontal', 'Pec deck', 'Développé machine',
  'Barres parallèles', 'Presse à cuisses', 'Leg extension machine', 'Leg curl machine',
  'Mollets debout machine', 'Mollets assis machine', 'Hip thrust machine'];

// Objectif de Lucas : « Prendre du muscle » + Groupe spécifique = Pectoraux + Triceps
const objectives = [{ type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Pectoraux', 'Triceps'] }];

for (const freq of [4]) {
  const user = { level: 'intermediate', training_context: 'full_gym', availability_optimal: true, frequency_max: freq, equipment: GYM };
  const r = await buildActivationResult(user, objectives);
  console.log(`\n════ ${r.matched_program_name} ════`);
  const vol = {};
  for (const s of r.sessions.filter((x) => x.week === 1)) {
    console.log(`\n  « ${s.day_label} » — ${s.estimated_duration} min · ${s.exercises.length} exos`);
    for (const x of s.exercises) {
      vol[x.muscle_group] = (vol[x.muscle_group] || 0) + x.sets;
      console.log(`     [${x.block}] ${x.name.padEnd(32)} ${String(x.muscle_group).padEnd(13)} ${x.sets}×${x.target_reps}`);
    }
  }
  console.log('\n  ► Volume hebdo : ' + Object.entries(vol).sort((a, b) => b[1] - a[1]).map(([m, v]) => `${m}:${v}`).join('  '));
}
