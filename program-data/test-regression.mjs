import { buildActivationResult } from '../src/lib/program-activation.js';
import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';

// Objectifs reconstruits depuis la signature du catalogue → on rejoue EXACTEMENT
// le programme d'origine et on compare séance par séance.
function objectivesFromSignature(sig) {
  return sig.split('+').map((part) => {
    const m = part.trim().match(/^([a-z_]+):(.+):(primary|secondary)$/i);
    if (!m) return null;
    const [, type, middle, priority] = m;
    if (/^movements\[/i.test(middle)) {
      const list = middle.slice(middle.indexOf('[') + 1, middle.lastIndexOf(']')).split(',').map((s) => s.trim());
      return { type, zone: '', priority, focus_movement: list };
    }
    return { type, zone: middle.trim(), priority };
  }).filter(Boolean);
}

let checked = 0, rotated = 0, lostContent = 0, otherDiff = 0;
const samples = [];
const key = (ex) => ex.map((x) => `${x.name}#${x.sets}`).sort().join('||'); // multiset ordre-insensible

for (const p of PRE_GENERATED_PROGRAMS) {
  const objectives = objectivesFromSignature(p.match.objectives_signature);
  if (!objectives.length) continue;
  const user = {
    level: p.match.level,
    training_context: p.match.training_context === 'bodyweight' ? 'bodyweight' : 'full_gym',
    availability_optimal: false,
    frequency_max: p.match.weekly_frequency,
    // Jours ESPACÉS volontairement : avec des jours collés, l'activation bascule
    // (à juste titre) un corps entier en haut/bas, ce que ce test n'a pas vocation
    // à mesurer — il ne s'intéresse qu'à la rotation de priorité.
    available_days: ['monday', 'wednesday', 'friday', 'sunday', 'tuesday', 'thursday'].slice(0, p.match.weekly_frequency),
    // Pas de duration_per_day → aucune contrainte de temps → seule la rotation peut agir
  };
  const r = await buildActivationResult(user, objectives);
  if (!r) continue;
  const got = r.sessions.filter((s) => s.week === 1);
  if (got.length !== p.program.sessions.length) continue;

  for (let i = 0; i < got.length; i++) {
    const src = p.program.sessions[i];
    const dst = got[i];
    checked++;
    const sameContent = key(src.exercises) === key(dst.exercises);
    const sameOrder = JSON.stringify(src.exercises.map((x) => x.name)) === JSON.stringify(dst.exercises.map((x) => x.name));
    if (!sameContent) {
      lostContent++;
      if (samples.length < 3) samples.push(`  ✗ CONTENU MODIFIÉ — ${p.match.level}/${p.match.training_context} « ${src.day_label} »`);
    } else if (!sameOrder) {
      rotated++;
      if (samples.filter((s) => s.startsWith('  ↻')).length < 6) {
        samples.push(`  ↻ ${p.match.level}/${p.match.training_context} « ${src.day_label} » : ${src.exercises[0].name} → ${dst.exercises[0].name}`);
      }
    } else {
      otherDiff += 0;
    }
  }
}

console.log('=== IMPACT de la rotation de priorité (sans contrainte de temps) ===');
console.log(`  séances vérifiées      : ${checked}`);
console.log(`  séances réordonnées    : ${rotated}  (${((rotated / checked) * 100).toFixed(1)} %)`);
console.log(`  séances inchangées     : ${checked - rotated - lostContent}`);
console.log(`  CONTENU perdu/modifié  : ${lostContent} ${lostContent === 0 ? '✓ (la rotation ne fait que réordonner)' : '✗ PROBLÈME'}`);
console.log('\n  Exemples :');
samples.forEach((s) => console.log(s));
void otherDiff;
