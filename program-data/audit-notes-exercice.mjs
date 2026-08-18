// AUDIT — les notes d'exercice contredisent-elles la prescription affichée ?
//
// Le catalogue attache à certains exercices une note du type « Jour volume :
// charge modérée » ou « Charge lourde (force) : 3-5 reps ». Elle est exacte DANS
// le catalogue (vérifié : 0 contradiction sur 579 notes). Mais l'activation
// respécialise les programmes — un « Full Body Hypertrophie » devient un
// programme de force — et réécrit alors `target_reps` et `rest_seconds` SANS
// toucher aux notes. La note reste celle du programme d'origine.
//
// Résultat à l'écran : « Jour volume : charge modérée, exécution stricte » sous
// un soulevé de terre programmé en 4×3-5 avec 3 min 30 de repos.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];
const MOUVEMENTS = ['Squat barre', 'Développé couché', 'Soulevé de terre'];

const hautRep = (r) => {
  const n = String(r ?? '').match(/\d+/g);
  return n?.length ? parseInt(n[n.length - 1], 10) : 99;
};

const JEUX = [
  ...['strength', 'hypertrophy', 'endurance'].flatMap((t) =>
    ['full_body', 'upper_body', 'lower_body'].map((z) => ({
      nom: `${t}/${z}`, obj: [{ type: t, zone: z, priority: 'primary' }],
    }))),
  { nom: 'force SBD', obj: [{ type: 'strength', zone: '', focus_movement: MOUVEMENTS, priority: 'primary' }] },
];

let avecNote = 0;
const contradictoires = [];

for (const level of ['beginner', 'intermediate', 'advanced']) {
  for (const [ctx, eq] of [['full_gym', GYM], ['bodyweight', []]]) {
    for (const jeu of JEUX) {
      for (let n = 2; n <= 5; n++) {
        const jours = ORDRE.slice(0, n);
        const user = {
          level, training_context: ctx, equipment: eq,
          availability_optimal: false, available_days: jours, frequency_max: n,
          duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
        };
        let res;
        try { res = await buildActivationResult(user, jeu.obj); } catch { continue; }
        if (!res) continue;
        for (const s of res.sessions.filter((x) => x.week === 1)) {
          for (const x of s.exercises) {
            if (!x.notes) continue;
            avecNote++;
            const dit = /volume/i.test(x.notes) ? 'volume'
              : /lourd|force/i.test(x.notes) ? 'lourd' : null;
            if (!dit) continue;
            const reel = hautRep(x.target_reps) <= 6 ? 'lourd' : 'volume';
            if (dit !== reel) {
              contradictoires.push(`${level}/${ctx} · ${jeu.nom} · ${n}j · ${x.name} `
                + `${x.sets}×${x.target_reps} repos ${x.rest_seconds}s → note « ${x.notes} »`);
            }
          }
        }
      }
    }
  }
}

console.log('\n██ NOTES D\'EXERCICE vs PRESCRIPTION ██\n');
console.log(`  exercices avec une note : ${avecNote}`);
console.log(`\n  ${contradictoires.length ? '✗' : '✓'} notes CONTRADICTOIRES : ${contradictoires.length}   ← doit valoir 0`);
for (const c of [...new Set(contradictoires)].slice(0, 8)) console.log(`      ${c}`);
const u = new Set(contradictoires).size;
if (u > 8) console.log(`      … et ${u - 8} autres`);
console.log('');
process.exitCode = contradictoires.length === 0 ? 0 : 1;
