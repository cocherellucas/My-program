// Garde-fou TEMPS (verifierBudgetTemps) : vérifie qu'on bloque bien les cas
// matériellement impossibles, et SEULEMENT ceux-là.
import { verifierBudgetTemps } from '../src/lib/program-activation.js';

const GYM = ['Barre de traction', 'Haltères', 'Barre EZ', 'Banc plat', 'Banc réglable', 'Barre olympique',
  'Disques olympiques', 'Rack squat', 'Câble poulie haute', 'Câble poulie basse', 'Station câbles double',
  'Curl biceps machine', 'Preacher curl machine', 'Tirage vertical', 'Tirage horizontal', 'Presse à cuisses',
  'Leg extension machine', 'Leg curl machine', 'Hack squat machine', 'Mollets debout machine',
  'Mollets assis machine', 'Pec deck', 'Développé machine', 'Barres parallèles', 'Hip thrust machine',
  'Fessier machine', 'Abducteur machine', 'Kettlebells', 'Élastiques de résistance', 'Gilet lesté', 'Ceinture de lest'];

const profil = (o) => ({
  level: 'intermediate', training_context: 'full_gym', equipment: GYM,
  availability_optimal: false, frequency_max: (o.days || ['monday', 'wednesday', 'friday']).length,
  available_days: o.days || ['monday', 'wednesday', 'friday'],
  duration_per_day: Object.fromEntries((o.days || ['monday', 'wednesday', 'friday']).map((d) => [d, o.duree])),
  ...o.extra,
});

const cas = [
  { nom: 'force corps entier · 3j × 30 min', doitBloquer: true,
    user: profil({ duree: 30 }), obj: [{ type: 'strength', zone: 'full_body', priority: 'primary' }] },
  { nom: 'force corps entier · 3j × 90 min', doitBloquer: false,
    user: profil({ duree: 90 }), obj: [{ type: 'strength', zone: 'full_body', priority: 'primary' }] },
  { nom: 'hypertrophie corps entier · 3j × 30 min', doitBloquer: true,
    user: profil({ duree: 30 }), obj: [{ type: 'hypertrophy', zone: 'full_body', priority: 'primary' }] },
  { nom: 'hypertrophie corps entier · 3j × 60 min', doitBloquer: false,
    user: profil({ duree: 60 }), obj: [{ type: 'hypertrophy', zone: 'full_body', priority: 'primary' }] },
  { nom: 'endurance corps entier · 3j × 30 min', doitBloquer: false,
    user: profil({ duree: 30 }), obj: [{ type: 'endurance', zone: 'full_body', priority: 'primary' }] },
  { nom: 'hypertrophie haut du corps · 4j × 45 min', doitBloquer: false,
    user: profil({ duree: 45, days: ['monday', 'tuesday', 'thursday', 'friday'] }),
    obj: [{ type: 'hypertrophy', zone: 'upper_body', priority: 'primary' }] },
  { nom: 'spécialisation biceps · 3j × 45 min', doitBloquer: false,
    user: profil({ duree: 45 }),
    obj: [{ type: 'hypertrophy', zone: 'specific_group', focus_group: ['Biceps'], priority: 'primary' }] },
  { nom: 'force sur mouvements · 3j × 30 min', doitBloquer: true,
    user: profil({ duree: 30 }),
    obj: [{ type: 'strength', zone: '', focus_movement: ['Squat barre', 'Développé couché'], priority: 'primary' }] },
];

// TOLÉRANCE : un écart plus court qu'UNE série est dans le bruit du modèle
// (échauffement forfaitaire, 40 s d'exécution par série en moyenne). Bloquer
// dessus obligerait à sauter au palier de durée suivant pour rien. Sans elle,
// 55 profils étaient refusés à tort — dont certains pour 0,3 min.
cas.push(
  // Dépassement réel de +0,3 min → sous une série (4,7 min en force) → doit passer.
  { nom: 'force corps entier · 2j × 45 min (écart +0,3 min)', doitBloquer: false,
    user: { level: 'beginner', training_context: 'full_gym', equipment: GYM,
      availability_optimal: false, frequency_max: 2, available_days: ['monday', 'tuesday'],
      duration_per_day: { monday: 45, tuesday: 45 } },
    obj: [{ type: 'strength', zone: 'full_body', priority: 'primary' }] },
  // Même profil, 30 min : l'écart dépasse largement une série → doit bloquer.
  { nom: 'force corps entier · 2j × 30 min (écart >> 1 série)', doitBloquer: true,
    user: { level: 'beginner', training_context: 'full_gym', equipment: GYM,
      availability_optimal: false, frequency_max: 2, available_days: ['monday', 'tuesday'],
      duration_per_day: { monday: 30, tuesday: 30 } },
    obj: [{ type: 'strength', zone: 'full_body', priority: 'primary' }] },
);

let ko = 0;
console.log('══ GARDE-FOU TEMPS ══\n');
for (const c of cas) {
  const { ok, problemes } = await verifierBudgetTemps(c.user, c.obj);
  const bloque = !ok;
  const bon = bloque === c.doitBloquer;
  if (!bon) ko++;
  const detail = problemes.length
    ? `  (${problemes.map((p) => `${p.jour} ${p.requis}min>${p.annonce}min`).join(', ')})`
    : '';
  console.log(`  ${bon ? '✓' : '✗'} ${c.nom.padEnd(42)} ${bloque ? 'BLOQUE' : 'passe '}${detail}`);
}

// Non-régression : « je m'entraîne quand je veux » ne doit JAMAIS bloquer.
const libre = await verifierBudgetTemps({ ...profil({ duree: 30 }), availability_optimal: true },
  [{ type: 'strength', zone: 'full_body', priority: 'primary' }]);
if (!libre.ok) { ko++; console.log('  ✗ availability_optimal ne doit jamais bloquer'); }
else console.log('  ✓ « je m\'entraîne quand je veux » ne bloque jamais');

// Non-régression : aucune durée renseignée → rien à vérifier.
const sansDuree = await verifierBudgetTemps({ ...profil({ duree: 30 }), duration_per_day: {} },
  [{ type: 'strength', zone: 'full_body', priority: 'primary' }]);
if (!sansDuree.ok) { ko++; console.log('  ✗ sans durée renseignée, ne doit pas bloquer'); }
else console.log('  ✓ sans durée renseignée, ne bloque pas');

console.log(`\n${ko === 0 ? '✓ tout est conforme' : `✗ ${ko} cas non conforme(s)`}`);
