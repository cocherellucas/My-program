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

let checked = 0, rotated = 0, redistributed = 0, lostContent = 0, otherDiff = 0;
const samples = [];
const key = (ex) => ex.map((x) => `${x.name}#${x.sets}`).sort().join('||'); // multiset ordre-insensible

// Volume hebdo par exercice, TOUTES séances confondues. C'est la seule mesure de
// contenu qui ait un sens : à partir de 5 séances/semaine, deux jours finissent
// forcément collés et l'activation bascule (à juste titre) en haut/bas, ce qui
// redistribue les exercices ENTRE les séances. Comparer la séance n° i à la
// séance n° i signalerait alors une « perte » qui n'en est pas une.
const weekVolume = (sessions) => {
  const m = {};
  for (const s of sessions) for (const x of s.exercises) m[x.name] = (m[x.name] || 0) + (x.sets || 0);
  return m;
};

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

  // 1) Le programme n'a RIEN perdu ni gagné sur la semaine ?
  const va = weekVolume(p.program.sessions), vb = weekVolume(got);
  const noms = [...new Set([...Object.keys(va), ...Object.keys(vb)])];
  const delta = noms.filter((n) => (va[n] || 0) !== (vb[n] || 0));
  if (delta.length) {
    lostContent++;
    if (samples.length < 3) {
      samples.push(`  ✗ VOLUME MODIFIÉ — ${p.match.level}/${p.match.training_context} sig=${p.match.objectives_signature}`
        + `\n      ${delta.map((n) => `${n} ${va[n] || 0}→${vb[n] || 0}`).join(', ')}`);
    }
  }

  // 2) Séance par séance : rotation de priorité (ordre) vs redistribution haut/bas.
  for (let i = 0; i < got.length; i++) {
    const src = p.program.sessions[i];
    const dst = got[i];
    checked++;
    const sameContent = key(src.exercises) === key(dst.exercises);
    const sameOrder = JSON.stringify(src.exercises.map((x) => x.name)) === JSON.stringify(dst.exercises.map((x) => x.name));
    if (!sameContent) {
      redistributed++;
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
console.log(`  séances vérifiées       : ${checked}`);
console.log(`  séances réordonnées     : ${rotated}  (${((rotated / checked) * 100).toFixed(1)} %)`);
console.log(`  séances redistribuées   : ${redistributed}  (split haut/bas — normal dès 5 séances/sem.)`);
console.log(`  séances inchangées      : ${checked - rotated - redistributed}`);
console.log(`  VOLUME HEBDO modifié    : ${lostContent} programme(s) ${lostContent === 0 ? '✓ (rien de perdu ni d’ajouté sur la semaine)' : '✗ PROBLÈME'}`);
if (samples.length) { console.log('\n  Exemples :'); samples.forEach((s) => console.log(s)); }
void otherDiff;
