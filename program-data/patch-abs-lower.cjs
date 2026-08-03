// ─────────────────────────────────────────────────────────────────────────────
// PATCH — retire le volume ABDOS des programmes qui ne ciblent QUE le bas du corps
//
// Les abdos font partie du HAUT du corps dans toute l'app (StepObjectives.jsx
// ZONE_TO_GROUPS, program-activation.js MUSCLE_ZONE). Le brief ne définissait pas
// la composition des zones → Claude a mis des abdos partout par convention, ce qui
// viole le §4bis (« muscles NON ciblés → aucun travail dédié »).
//
// PÉRIMÈTRE VOLONTAIREMENT ÉTROIT (décision de Lucas, 2026-08-02) :
//   • objectifs de ZONE ne couvrant pas les abdos  → on retire  ✔
//   • objectifs de MOUVEMENT (force SBD)           → on GARDE   ✘ (le gainage
//     participe directement au squat/soulevé : il fait partie de l'objectif)
//
// Idempotent : relancer ne change rien de plus.
// Usage : node program-data/patch-abs-lower.cjs   puis   node program-data/gen-pgp.cjs
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'catalogue_complet.json');
const UPPER = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'];
const LOWER = ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'];

// Muscles ciblés par une signature d'objectifs (zones uniquement).
function targetedMuscles(sig) {
  const set = new Set();
  let hasMovementObjective = false;
  for (const part of String(sig || '').split('+')) {
    const m = part.trim().match(/^([a-z_]+):(.+):(primary|secondary)$/i);
    if (!m) continue;
    const middle = m[2];
    if (/^movements\[/i.test(middle)) { hasMovementObjective = true; continue; }
    if (middle === 'full_body') [...UPPER, ...LOWER].forEach((x) => set.add(x));
    else if (middle === 'upper_body') UPPER.forEach((x) => set.add(x));
    else if (middle === 'lower_body') LOWER.forEach((x) => set.add(x));
  }
  return { set, hasMovementObjective };
}

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let touchedPrograms = 0;
let removedExercises = 0;
let removedSets = 0;

for (const entry of data.catalog) {
  const sig = entry.match?.objectives_signature || '';
  const { set, hasMovementObjective } = targetedMuscles(sig);
  if (hasMovementObjective) continue;      // force SBD → on garde le gainage
  if (set.has('Abdominaux')) continue;     // abdos réellement ciblés → rien à faire
  if (!set.size) continue;                 // signature non reconnue → on ne touche pas

  let touched = false;
  for (const s of entry.program.sessions) {
    const before = s.exercises;
    const after = before.filter((x) => x.muscle_group !== 'Abdominaux');
    if (after.length === before.length) continue;
    if (!after.length) continue;           // sécurité : ne jamais vider une séance

    const setsBefore = before.reduce((n, x) => n + (x.sets || 0), 0);
    const setsAfter = after.reduce((n, x) => n + (x.sets || 0), 0);
    removedExercises += before.length - after.length;
    removedSets += setsBefore - setsAfter;

    s.exercises = after;
    if (s.estimated_duration && setsBefore > 0) {
      s.estimated_duration = Math.max(20, Math.round(s.estimated_duration * (setsAfter / setsBefore)));
    }
    // active_zones est re-dérivé à la génération (gen-pgp.cjs) → rien à faire ici.
    touched = true;
  }
  if (touched) touchedPrograms++;
}

if (touchedPrograms) fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');

console.log(`Programmes modifiés : ${touchedPrograms}`);
console.log(`Exercices abdos retirés : ${removedExercises} (${removedSets} séries)`);
console.log(touchedPrograms ? '→ catalogue_complet.json mis à jour. Lance maintenant : node program-data/gen-pgp.cjs' : '→ rien à faire (déjà patché).');
