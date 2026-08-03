// ─────────────────────────────────────────────────────────────────────────────
// AUDIT DE LA SEMAINE GÉNÉRÉE
// Balaie une matrice de profils réalistes, génère la semaine comme le ferait
// l'app, et vérifie tout ce qui est vérifiable SANS s'entraîner.
// Ce qui dépend du ressenti (charge, fatigue) est hors périmètre : c'est
// l'autorégulation en séance qui s'en occupe.
// ─────────────────────────────────────────────────────────────────────────────
import { buildActivationResult } from '../src/lib/program-activation.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const canon = new Set(EXERCISES.map((e) => e.name.toLowerCase()));
const UPPER = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'];
const LOWER = ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'];
const GROS = new Set(['Pectoraux', 'Dos', 'Quadriceps', 'Ischio-jambiers', 'Fessiers']);
const MAV = { beginner: { gros: 10, petit: 8 }, intermediate: { gros: 14, petit: 10 }, advanced: { gros: 16, petit: 12 } };
const IDX = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };
const GYM = ['Barre de traction', 'Haltères', 'Barre EZ', 'Banc plat', 'Banc réglable', 'Barre olympique',
  'Disques olympiques', 'Rack squat', 'Câble poulie haute', 'Câble poulie basse', 'Station câbles double',
  'Curl biceps machine', 'Preacher curl machine', 'Tirage vertical', 'Tirage horizontal', 'Presse à cuisses',
  'Leg extension machine', 'Leg curl machine', 'Hack squat machine', 'Mollets debout machine',
  'Mollets assis machine', 'Pec deck', 'Développé machine', 'Barres parallèles', 'Hip thrust machine',
  'Fessier machine', 'Abducteur machine', 'Kettlebells', 'Élastiques de résistance', 'Gilet lesté', 'Ceinture de lest'];

const EXEC = 45, WARM = 8;
const minutes = (ex) => WARM + ex.reduce((n, x) => n + ((x.sets || 0) * ((x.rest_seconds || 90) + EXEC)) / 60, 0);

function targetedMuscles(objectives, onlyPrimary = false) {
  const s = new Set();
  for (const o of objectives) {
    if (onlyPrimary && o.priority === 'secondary') continue;
    if (o.zone === 'specific_group') (o.focus_group || []).forEach((m) => s.add(m));
    else if (o.zone === 'upper_body') UPPER.forEach((m) => s.add(m));
    else if (o.zone === 'lower_body') LOWER.forEach((m) => s.add(m));
    else if (o.zone === 'full_body') [...UPPER, ...LOWER].forEach((m) => s.add(m));
  }
  return s;
}

// Meilleur écart minimum atteignable en plaçant n séances sur ces jours.
function bestGap(available, n) {
  const idx = available.map((d) => IDX[d]).filter((i) => i >= 0).sort((a, b) => a - b);
  if (n >= idx.length || n < 2) return 7;
  let best = 0; const combo = [];
  const walk = (start) => {
    if (combo.length === n) {
      let min = Infinity;
      for (let k = 0; k < combo.length; k++) {
        const g = k === combo.length - 1 ? 7 - combo[k] + combo[0] : combo[k + 1] - combo[k];
        min = Math.min(min, g);
      }
      best = Math.max(best, min); return;
    }
    for (let i = start; i < idx.length; i++) { combo.push(idx[i]); walk(i + 1); combo.pop(); }
  };
  walk(0); return best;
}

const problems = [];
const flag = (profil, msg) => problems.push(`${profil} → ${msg}`);

async function audit(profil, user, objectives) {
  const r = await buildActivationResult(user, objectives);
  if (!r) { flag(profil, 'AUCUN programme généré (null)'); return; }
  const wk = r.sessions.filter((s) => s.week === 1);
  if (!wk.length) { flag(profil, 'semaine vide'); return; }

  const isMovementObj = objectives.some((o) => (o.focus_movement || []).length);
  const tg = targetedMuscles(objectives);
  const tgPrimary = targetedMuscles(objectives, true);
  const dispo = user.available_days?.length || 7;

  // 1. Jamais plus de séances que de jours disponibles
  if (wk.length > dispo) flag(profil, `${wk.length} séances pour ${dispo} jours disponibles`);

  // 2. Espacement : deux séances collées alors que les jours permettaient mieux
  const days = [...new Set(wk.map((s) => IDX[s.day]))].sort((a, b) => a - b);
  if (days.length > 1 && days.length < dispo) {
    let min = Infinity;
    for (let k = 0; k < days.length; k++) {
      const g = k === days.length - 1 ? 7 - days[k] + days[0] : days[k + 1] - days[k];
      min = Math.min(min, g);
    }
    const best = bestGap(user.available_days || [], days.length);
    if (min < 2 && min < best) flag(profil, `séances collées (écart ${min} j) alors que ${best} j étaient atteignables`);
  }

  const vol = {}, eff = {};
  for (const s of wk) {
    // 3. Exercices résolus dans la base
    const seen = new Set();
    for (const x of s.exercises) {
      if (!canon.has(String(x.name).toLowerCase())) flag(profil, `exercice inconnu « ${x.name} »`);
      if (seen.has(x.name)) flag(profil, `doublon « ${x.name} » dans « ${s.day_label} »`);
      seen.add(x.name);
      vol[x.muscle_group] = (vol[x.muscle_group] || 0) + (x.sets || 0);
      eff[x.muscle_group] = (eff[x.muscle_group] || 0) + (x.sets || 0);
      for (const sm of x.muscles_secondary || []) eff[sm] = (eff[sm] || 0) + 0.5 * (x.sets || 0);
    }
    // 4. Ordre des blocs A → B → C
    const rank = { A: 0, B: 1, C: 2 };
    const seq = s.exercises.map((x) => rank[x.block] ?? 3);
    if (seq.some((v, i) => i && v < seq[i - 1])) flag(profil, `blocs désordonnés dans « ${s.day_label} »`);
    // 5. Séance vide
    if (!s.exercises.length) flag(profil, `séance vide « ${s.day_label} »`);
    // 6. Durée respectée
    const dispoMin = user.duration_per_day?.[s.day];
    if (dispoMin && minutes(s.exercises) > dispoMin + 1) {
      flag(profil, `« ${s.day_label} » dure ${Math.round(minutes(s.exercises))} min pour ${dispoMin} min dispo`);
    }
  }

  // 7. Volume des muscles ciblés. En dessous de 3 jours, le budget est
  //    intrinsèquement insuffisant : ce n'est pas un défaut du programme mais le
  //    cas « dispo trop faible pour le niveau » (→ message d'honnêteté à écrire).
  if (dispo < 3) { flag(profil, 'BUDGET: ' + dispo + ' jours ne suffisent pas au volume optimal (attendu)'); return { r, wk }; }
  const seuil = MAV[user.level];
  for (const m of tgPrimary) {
    const need = GROS.has(m) ? seuil.gros : seuil.petit;
    const got = eff[m] || 0;
    const contraint = !!user.duration_per_day; // temps limité → sous-volume assumé
    if (got < need && !contraint) flag(profil, `${m} sous l'optimal : ${got} < ${need}`);
  }

  // 8. Aucun volume DIRECT sur un muscle non ciblé (hors objectifs de mouvement)
  if (!isMovementObj) {
    for (const [m, v] of Object.entries(vol)) {
      if (v > 0 && !tg.has(m)) flag(profil, `${m} travaillé (${v} séries) alors qu'il n'est pas ciblé`);
    }
  }
  return { r, wk };
}

// ── Matrice de profils ───────────────────────────────────────────────────────
const OBJ = {
  'corps entier': [{ type: 'hypertrophy', zone: 'full_body', priority: 'primary' }],
  'haut du corps': [{ type: 'hypertrophy', zone: 'upper_body', priority: 'primary' }],
  'bas du corps': [{ type: 'hypertrophy', zone: 'lower_body', priority: 'primary' }],
  'haut + bas 2e': [{ type: 'hypertrophy', zone: 'upper_body', priority: 'primary' }, { type: 'hypertrophy', zone: 'lower_body', priority: 'secondary' }],
  'spé pecs': [{ type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Pectoraux'] }],
  'spé biceps+triceps': [{ type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Biceps', 'Triceps'] }],
  'spé fessiers': [{ type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Fessiers'] }],
  'force SBD': [{ type: 'strength', zone: '', priority: 'primary', focus_movement: ['Squat barre', 'Développé couché', 'Soulevé de terre'] }],
};
const DISPOS = [
  { nom: '3j espacés', days: ['monday', 'wednesday', 'friday'] },
  { nom: '4j', days: ['monday', 'tuesday', 'thursday', 'friday'] },
  { nom: '2j collés', days: ['saturday', 'sunday'] },
  { nom: '5j', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
];

let n = 0;
for (const level of ['beginner', 'intermediate', 'advanced']) {
  for (const ctx of ['full_gym', 'bodyweight']) {
    for (const [onom, objectives] of Object.entries(OBJ)) {
      for (const d of DISPOS) {
        const user = { level, training_context: ctx, availability_optimal: false,
          frequency_max: d.days.length, available_days: d.days, equipment: GYM };
        n++;
        await audit(`${level}/${ctx} · ${onom} · ${d.nom}`, user, objectives);
      }
    }
  }
}
// Quelques profils avec contrainte de temps
for (const mins of [30, 45, 60]) {
  const days = ['monday', 'wednesday', 'friday'];
  const user = { level: 'intermediate', training_context: 'full_gym', availability_optimal: false,
    frequency_max: 3, available_days: days, equipment: GYM,
    duration_per_day: Object.fromEntries(days.map((d) => [d, mins])) };
  n++;
  await audit(`intermediate/full_gym · corps entier · 3j × ${mins} min`, user, OBJ['corps entier']);
}

console.log(`\n██ AUDIT DE LA SEMAINE GÉNÉRÉE — ${n} profils testés ██\n`);
if (!problems.length) {
  console.log('✓ Aucun problème détecté.');
} else {
  const groupes = {};
  for (const p of problems) {
    const cle = p.split('→')[1].trim().replace(/«[^»]*»/g, '«…»').replace(/\d+/g, 'N');
    (groupes[cle] = groupes[cle] || []).push(p);
  }
  console.log(`✗ ${problems.length} signalement(s), ${Object.keys(groupes).length} type(s) :\n`);
  for (const [cle, list] of Object.entries(groupes).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`── ${cle}  (${list.length}×)`);
    list.slice(0, 3).forEach((l) => console.log('     ' + l));
    if (list.length > 3) console.log(`     … et ${list.length - 3} autres`);
  }
}
