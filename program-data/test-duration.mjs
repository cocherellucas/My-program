import { buildActivationResult } from '../src/lib/program-activation.js';
import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';

// Même modèle que program-activation (garder synchronisé si on le change).
const EXEC = 45, WARM = 8;
const mins = (ex) => WARM + ex.reduce((n, x) => n + ((x.sets || 0) * ((x.rest_seconds || 90) + EXEC)) / 60, 0);

// ── 1. CALIBRATION : modèle de temps vs estimated_duration du catalogue ──────
let diffs = [];
for (const p of PRE_GENERATED_PROGRAMS) for (const s of p.program.sessions) {
  diffs.push(mins(s.exercises) - (s.estimated_duration || 60));
}
diffs.sort((a, b) => a - b);
const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
console.log('=== CALIBRATION (modèle − estimation catalogue), en minutes ===');
console.log(`  séances: ${diffs.length} | écart moyen: ${avg.toFixed(1)} | médian: ${diffs[Math.floor(diffs.length / 2)].toFixed(1)} | min: ${diffs[0].toFixed(1)} | max: ${diffs[diffs.length - 1].toFixed(1)}`);

const GYM = ['Barre de traction', 'Haltères', 'Barre EZ', 'Banc plat', 'Banc réglable', 'Barre olympique', 'Disques olympiques', 'Rack squat', 'Câble poulie haute', 'Câble poulie basse', 'Station câbles double', 'Curl biceps machine', 'Tirage vertical', 'Tirage horizontal', 'Presse à cuisses', 'Leg extension machine', 'Leg curl machine', 'Mollets debout machine', 'Mollets assis machine', 'Pec deck', 'Barres parallèles', 'Hip thrust machine'];
const OBJ_UPPER = [{ type: 'hypertrophy', zone: 'upper_body', priority: 'primary' }];

const dump = (r, label) => {
  console.log('\n--- ' + label + ' → ' + r.matched_program_name);
  for (const s of r.sessions.filter((x) => x.week === 1)) {
    console.log(`  « ${s.day_label} » ${s.day} · ${s.estimated_duration} min`);
    for (const x of s.exercises) console.log(`     [${x.block}] ${x.name.padEnd(32)} ${String(x.muscle_group).padEnd(13)} ${x.sets}×${x.target_reps}`);
  }
};

// ── 2. NON-RÉGRESSION : voir test-regression.mjs (compare par match exact, pas
//      par NOM — plusieurs programmes partagent le même nom → faux positifs).

// ── 3. ROGNAGE : 30 min/jour ────────────────────────────────────────────────
const short = { level: 'intermediate', training_context: 'full_gym', availability_optimal: false, frequency_max: 4, available_days: ['monday', 'tuesday', 'thursday', 'friday'], duration_per_day: { monday: 30, tuesday: 30, thursday: 30, friday: 30 }, equipment: GYM };
const rShort = await buildActivationResult(short, OBJ_UPPER);
dump(rShort, 'ROGNAGE 30 min');
const over = rShort.sessions.filter((s) => s.week === 1 && mins(s.exercises) > 30 + 0.6);
console.log('  → séances qui dépassent 30 min : ' + over.length + (over.length ? ' ✗' : ' ✓'));

// ── 4. Temps confortable (90 min) → ne doit RIEN rogner ─────────────────────
const roomy = { ...short, duration_per_day: { monday: 90, tuesday: 90, thursday: 90, friday: 90 } };
const rRoomy = await buildActivationResult(roomy, OBJ_UPPER);
const setsOf = (r) => r.sessions.filter((s) => s.week === 1).reduce((n, s) => n + s.exercises.reduce((a, x) => a + x.sets, 0), 0);
console.log('\n=== 90 min (aucun rognage attendu) ===');
console.log(`  séries totales S1 : 90min=${setsOf(rRoomy)}  vs  30min=${setsOf(rShort)}  (le 30 min doit être PLUS BAS)`);

// ── 5. Compounds préservés à séries pleines en 30 min ? ─────────────────────
const compoundSets = (r) => { const m = {}; for (const s of r.sessions.filter((x) => x.week === 1)) for (const x of s.exercises) if (x.block === 'A') m[x.name] = (m[x.name] || 0) + x.sets; return m; };
const cRoomy = compoundSets(rRoomy), cShort = compoundSets(rShort);
const lost = Object.keys(cRoomy).filter((k) => (cShort[k] || 0) < cRoomy[k]);
console.log('\n=== COMPOUNDS (bloc A) en 30 min ===');
console.log('  compounds réduits/perdus : ' + (lost.length ? '⚠ ' + lost.map((k) => `${k} ${cRoomy[k]}→${cShort[k] || 0}`).join(', ') : '✓ aucun (séries pleines)'));

// ── 6. Spécialisation toujours OK + rognée ──────────────────────────────────
const rSpec = await buildActivationResult(short, [{ type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Biceps'] }]);
console.log('\n=== SPÉCIALISATION + 30 min ===');
console.log(rSpec ? '  ✓ ' + rSpec.matched_program_name : '  ✗ NULL');
if (rSpec) {
  const bad = rSpec.sessions.filter((s) => s.week === 1 && mins(s.exercises) > 30 + 0.6).length;
  const bic = rSpec.sessions.filter((s) => s.week === 1).reduce((n, s) => n + s.exercises.filter((x) => x.muscle_group === 'Biceps').reduce((a, x) => a + x.sets, 0), 0);
  console.log(`  séances hors temps: ${bad} ${bad ? '✗' : '✓'} | volume biceps S1: ${bic}`);
}
