// AUDIT — les libellés de séance décrivent-ils vraiment la séance ?
//
// Le catalogue nommait certaines journées d'après UN mouvement (« Jour Développé
// couché barre (lourd) ») alors qu'elles travaillaient tout le corps. On vérifie
// qu'aucun libellé rendu à l'utilisateur ne fait plus ça, et qu'un libellé ne
// promet jamais une moitié du corps qu'il ne travaille pas.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];
const BAS = new Set(['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets']);
const MOUVEMENTS = ['Squat barre', 'Développé couché', 'Soulevé de terre', 'Traction lestée'];

const JEUX = [
  ...['strength', 'hypertrophy', 'endurance'].flatMap((t) =>
    ['full_body', 'upper_body', 'lower_body'].map((z) => ({
      nom: `${t}/${z}`, obj: [{ type: t, zone: z, priority: 'primary' }],
    }))),
  { nom: 'force SBD', obj: [{ type: 'strength', zone: '', focus_movement: MOUVEMENTS.slice(0, 3), priority: 'primary' }] },
  { nom: 'force squat', obj: [{ type: 'strength', zone: '', focus_movement: ['Squat barre'], priority: 'primary' }] },
  { nom: 'force SBD + hyper', obj: [
    { type: 'strength', zone: '', focus_movement: MOUVEMENTS.slice(0, 3), priority: 'primary' },
    { type: 'hypertrophy', zone: 'full_body', priority: 'secondary' },
  ] },
];

let seances = 0;
const nommeUnExo = [];
const promesseFausse = [];
const vides = [];

for (const level of ['beginner', 'intermediate', 'advanced']) {
  for (const [ctx, eq] of [['full_gym', GYM], ['bodyweight', []]]) {
    for (const jeu of JEUX) {
      for (let n = 2; n <= 5; n++) {
        for (const debut of [0, 6]) {
          const jours = Array.from({ length: n }, (_, k) => ORDRE[(debut + k) % 7]);
          const user = {
            level, training_context: ctx, equipment: eq,
            availability_optimal: false, available_days: jours, frequency_max: n,
            duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
          };
          let res;
          try { res = await buildActivationResult(user, jeu.obj); } catch { continue; }
          if (!res) continue;
          const cle = `${level}/${ctx} · ${jeu.nom} · ${n}j`;

          for (const s of res.sessions.filter((x) => x.week === 1)) {
            seances++;
            const lab = String(s.day_label || '');
            if (!lab.trim()) { vides.push(cle); continue; }

            // 1. Plus aucun libellé ne doit nommer un exercice.
            if (/^jour\s/i.test(lab)) nommeUnExo.push(`${cle} · « ${lab} »`);

            // 2. Un libellé ne doit pas promettre une moitié absente.
            const muscles = [...new Set(s.exercises.map((x) => x.muscle_group))];
            const aBas = muscles.some((m) => BAS.has(m));
            const aHaut = muscles.some((m) => !BAS.has(m) && m !== 'Abdominaux');
            const l = lab.toLowerCase();
            const ditBas = /bas du corps|jambes/.test(l);
            const ditHaut = /haut du corps|poussée|tirage/.test(l);
            const ditEntier = /corps entier/.test(l);
            if ((ditBas && !aBas) || (ditHaut && !aHaut) || (ditEntier && !(aHaut && aBas))) {
              promesseFausse.push(`${cle} · « ${lab} » → ${muscles.join(', ')}`);
            }
          }
        }
      }
    }
  }
}

const bloc = (titre, liste) => {
  console.log(`\n  ${liste.length ? '✗' : '✓'} ${titre} : ${liste.length}`);
  for (const l of [...new Set(liste)].slice(0, 8)) console.log(`      ${l}`);
  const u = new Set(liste).size;
  if (u > 8) console.log(`      … et ${u - 8} autres`);
};

console.log('\n██ LIBELLÉS DE SÉANCE ██\n');
console.log(`  séances analysées : ${seances}`);
bloc('libellé qui nomme un EXERCICE au lieu de la séance', nommeUnExo);
bloc('libellé qui promet une moitié du corps absente', promesseFausse);
bloc('libellé vide', vides);

const total = nommeUnExo.length + promesseFausse.length + vides.length;
console.log(total === 0 ? '\n✓ tous les libellés décrivent leur séance\n' : `\n✗ ${total} libellé(s) trompeur(s)\n`);
process.exitCode = total === 0 ? 0 : 1;
