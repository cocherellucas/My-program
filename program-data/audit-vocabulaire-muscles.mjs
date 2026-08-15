// Le vocabulaire des muscles est-il le MÊME partout ?
//
// L'app manipule deux vocabulaires : celui de la base d'exercices
// (« Poitrine », « Abdos ») et celui de l'application (« Pectoraux »,
// « Abdominaux »). program-activation traduit le premier vers le second via
// appMuscle(). Tout consommateur qui compare un muscle_group GÉNÉRÉ à une liste
// écrite en vocabulaire de BASE ne matche donc jamais — en silence.
//
// Ce script produit la vérité empirique : quels muscle_group sortent vraiment de
// la génération, et quelles listes du code ne les reconnaissent pas.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { FRAGILE_ZONE_MUSCLES, LARGE_MUSCLES, SMALL_MUSCLES, nomBaseMuscle } from '../src/lib/coaching-engine.js';

const PROFILS = [
  ['débutant · salle · corps entier', { level: 'beginner', training_context: 'full_gym', availability_optimal: true, available_days: ['monday', 'wednesday', 'friday'], frequency_max: 3 },
    [{ type: 'hypertrophy', zone: 'full_body', priority: 'primary' }]],
  ['inter · salle · haut du corps', { level: 'intermediate', training_context: 'full_gym', availability_optimal: true, available_days: ['monday', 'tuesday', 'thursday', 'friday'], frequency_max: 4 },
    [{ type: 'hypertrophy', zone: 'upper_body', priority: 'primary' }]],
  ['avancé · poids du corps · corps entier', { level: 'advanced', training_context: 'bodyweight', equipment: '[]', availability_optimal: true, available_days: ['monday', 'wednesday', 'friday', 'saturday'], frequency_max: 4 },
    [{ type: 'hypertrophy', zone: 'full_body', priority: 'primary' }]],
  ['inter · salle · force', { level: 'intermediate', training_context: 'full_gym', availability_optimal: true, available_days: ['monday', 'thursday'], frequency_max: 2 },
    [{ type: 'strength', zone: 'full_body', priority: 'primary' }]],
];

const vus = new Set();
for (const [, user, objectives] of PROFILS) {
  const res = await buildActivationResult(user, objectives);
  for (const s of res?.sessions || []) for (const x of s.exercises || []) if (x.muscle_group) vus.add(x.muscle_group);
}

console.log('\n██ VOCABULAIRE DES MUSCLES ██\n');
console.log('  muscle_group réellement produits par la génération :');
console.log(`    ${[...vus].sort().join(', ')}\n`);

// L'INVARIANT à tenir n'est pas « les listes ne contiennent que des noms
// produits » — elles sont écrites dans le vocabulaire de la base, et c'est
// voulu : pain-engine les confronte aussi aux `muscles.primary` de la base.
// L'invariant est : tout muscle_group produit, une fois normalisé par
// nomBaseMuscle(), doit être reconnu par les listes qui le concernent.
const problemes = [];

// 1. Chaque muscle produit est-il classé grand ou petit ?
const classes = new Set([...LARGE_MUSCLES, ...SMALL_MUSCLES]);
for (const m of vus) {
  if (!classes.has(m) && !classes.has(nomBaseMuscle(m))) {
    problemes.push(`« ${m} » est produit mais n'est NI dans LARGE_MUSCLES NI dans SMALL_MUSCLES, même normalisé → traité comme petit muscle par défaut`);
  }
}

// 2. Chaque zone fragile retrouve-t-elle au moins un muscle réellement produit ?
//    Une zone dont aucun muscle n'est atteignable ne se déclencherait jamais.
for (const [zone, muscles] of Object.entries(FRAGILE_ZONE_MUSCLES)) {
  const atteignables = muscles.filter((m) => [...vus].some((v) => nomBaseMuscle(v) === m));
  if (!atteignables.length) problemes.push(`FRAGILE_ZONE_MUSCLES.${zone} ne cite aucun muscle atteignable par la génération → zone jamais signalée`);
  const orphelins = muscles.filter((m) => !atteignables.includes(m));
  if (orphelins.length) {
    problemes.push(`FRAGILE_ZONE_MUSCLES.${zone} cite ${orphelins.map((m) => `« ${m} »`).join(', ')} — nom sans équivalent produit (à surveiller, pas bloquant si la zone a d'autres muscles)`);
  }
}

console.log('  Confrontation avec les listes du code (après normalisation) :');
if (!problemes.length) console.log('    ✓ aucune divergence');
else for (const p of problemes) console.log(`    ✗ ${p}`);
console.log('');
