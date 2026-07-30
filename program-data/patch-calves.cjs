// PATCH ciblé : ajoute des mollets aux programmes POWERBUILDING (strength SBD
// primaire + hypertrophie full_body secondaire) où ils sont à 0 (fréquence ≤4).
// Les 3 barres ne touchent pas les mollets, même en indirect → un secondaire
// "full body" doit leur donner un dose MEV. On injecte "Mollets debout machine"
// (bloc C, isolation) sur les jours jambes (Squat / Soulevé), ~6 séries/sem.
// Idempotent : n'ajoute rien si le muscle Mollets est déjà présent dans la séance.

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'catalogue_complet.json');
const j = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const CALF = {
  name: 'Mollets debout machine',
  muscle_group: 'Mollets',
  muscles_secondary: [],
  block: 'C',
  equipment: ['Mollets debout machine'],
  sets: 3,
  target_reps: '12-15',
  rest_seconds: 60,
};

const isPowerFullSec = (sig) =>
  /^strength:movements\[.*\]:primary\+hypertrophy:full_body:secondary$/.test(sig);

let patched = 0, sessionsTouched = 0;
for (const entry of j.catalog) {
  const mt = entry.match, p = entry.program;
  if (!isPowerFullSec(mt.objectives_signature)) continue;
  if (mt.weekly_frequency > 4) continue; // 5-6 j ont déjà des mollets

  // séances "jambes" = Squat ou Soulevé dans le libellé, sans mollets déjà présents
  const legDays = p.sessions.filter(
    (s) => /squat|soulevé/i.test(s.day_label) &&
      !s.exercises.some((x) => x.muscle_group === 'Mollets')
  );
  // 2 jours max (≈6 séries/sem), priorité Squat puis Soulevé
  const targets = legDays.slice(0, 2);
  if (!targets.length) continue;
  for (const s of targets) {
    s.exercises.push({ ...CALF, muscles_secondary: [] });
    s.estimated_duration = (s.estimated_duration || 0) + 6; // +3 séries ≈ 6 min
    sessionsTouched++;
  }
  patched++;
}

fs.writeFileSync(FILE, JSON.stringify(j, null, 2) + '\n', 'utf8');
console.log(`Patch mollets : ${patched} programmes powerbuilding modifiés, ${sessionsTouched} séances (+3 séries chacune).`);
