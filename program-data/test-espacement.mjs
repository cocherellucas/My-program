// GARDE-FOU D'ESPACEMENT — le test qui manquait.
//
// Un muscle ne doit pas revenir à 24 h d'écart quand sa fenêtre de récupération
// en demande plus (48 h en hypertrophie, 72 h en force ; 24 h suffisent en
// endurance). On vérifie sur des utilisateurs qui déclarent des jours COLLÉS,
// le seul cas où la question se pose.
//
// Ce test aurait dû exister au moment où la détection de conflit a été modifiée
// pour exclure les abdominaux. Il ne l'a pas été, et le défaut est passé.
//
// Muscles PRIMAIRES uniquement (`muscle_group`) : les synergistes ne sont jamais
// menés à l'échec, ils ne créent pas la même dette de récupération.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { SRA_WINDOWS } from '../src/lib/coaching-engine.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
// Vrai matériel de salle : sans ça la substitution remplace tout par des replis
// au sac, et le test mesure autre chose que ce qu'il croit.
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];

const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
const ZONES = ['full_body', 'upper_body', 'lower_body'];
const TYPES = ['strength', 'hypertrophy', 'endurance'];
const CONTEXTES = [['full_gym', GYM], ['bodyweight', []]];

let testes = 0;
const accessoires = [];   // bloc C : ce qui DOIT être corrigé
const principaux = [];    // bloc A/B : contraint par le planning, pas corrigeable ici

// Le programme TOURNE : la semaine se referme, dimanche précède lundi. Partir
// systématiquement du lundi (`ORDRE.slice(0, n)`) laissait donc dans l'ombre tous
// les jours collés qui traversent la fin de semaine — dimanche+lundi en tête.
// On fait glisser le jour de départ sur les sept jours de la semaine.
const joursDepuis = (debut, n) => Array.from({ length: n }, (_, k) => ORDRE[(debut + k) % 7]);
// Écart CYCLIQUE en jours : dimanche (6) et lundi (0) sont à 1 jour, pas 6.
const ecartCyclique = (a, b) => { const d = Math.abs(a - b); return Math.min(d, 7 - d); };

for (const level of NIVEAUX) {
  for (const [ctx, eq] of CONTEXTES) {
    for (const zone of ZONES) {
      for (const type of TYPES) {
        for (let n = 2; n <= 5; n++) {
          for (let debut = 0; debut < 7; debut++) {
            const jours = joursDepuis(debut, n); // COLLÉS à dessein
            const user = {
              level, training_context: ctx, equipment: eq,
              availability_optimal: false, available_days: jours, frequency_max: n,
              duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
            };
            let res;
            try { res = await buildActivationResult(user, [{ type, zone, priority: 'primary' }]); } catch { continue; }
            const sem = (res?.sessions || []).filter((s) => s.week === 1)
              .map((s) => ({ s, i: ORDRE.indexOf(s.day) }));
            if (sem.length < 2) continue;
            testes++;

            // Toutes les PAIRES à un jour d'écart, bouclage compris — et non plus
            // seulement les voisines dans l'ordre lundi→dimanche.
            for (let a = 0; a < sem.length; a++) {
              for (let b = 0; b < sem.length; b++) {
                if (a === b) continue;
                if (ecartCyclique(sem[a].i, sem[b].i) !== 1) continue;
                // Sur un programme qui boucle, chacune des deux séances est la
                // veille de l'autre une semaine sur deux : on retient la fenêtre
                // la plus exigeante des deux.
                const fenetre = Math.max(
                  SRA_WINDOWS[sem[a].s.type || type] || 48,
                  SRA_WINDOWS[sem[b].s.type || type] || 48,
                );
                if (fenetre <= 24) continue;

                const veille = new Set(sem[a].s.exercises.map((x) => x.muscle_group));
                for (const m of new Set(sem[b].s.exercises.map((x) => x.muscle_group))) {
                  if (!veille.has(m)) continue;
                  const blocs = sem[b].s.exercises.filter((x) => x.muscle_group === m).map((x) => x.block);
                  const cible = blocs.every((bl) => bl === 'C') ? accessoires : principaux;
                  cible.push(`${level}/${ctx} · ${type}/${zone} · ${n}j dès ${jours[0]} · ${m} (bloc ${[...new Set(blocs)].join('')}) — ${res.matched_program_name}`);
                }
              }
            }
          }
        }
      }
    }
  }
}

console.log('\n══ ESPACEMENT SUR JOURS COLLÉS ══\n');
console.log(`  configurations testées : ${testes}`);
console.log(`\n  ✗ ACCESSOIRES (bloc C) répétés à 24 h : ${accessoires.length}   ← doit valoir 0`);
for (const a of accessoires.slice(0, 15)) console.log(`      ${a}`);
if (accessoires.length > 15) console.log(`      … et ${accessoires.length - 15} autres`);

console.log(`\n  ✗ Travail PRINCIPAL (bloc A/B) répété à 24 h : ${principaux.length}   ← doit valoir 0`);
console.log('      Le retrait d\'accessoire ne peut rien ici : retirer le squat viderait la');
console.log('      séance. C\'est le DÉCOUPAGE qui doit séparer (haut/bas, puis poussée/tirage');
console.log('      ou quadriceps/chaîne postérieure), et le rattrapage des muscles perdus qui');
console.log('      évite d\'y renoncer pour deux séries de curl.');
for (const p of principaux.slice(0, 8)) console.log(`      ${p}`);
if (principaux.length > 8) console.log(`      … et ${principaux.length - 8} autres`);

const ok = accessoires.length === 0 && principaux.length === 0;
console.log(ok
  ? '\n✓ aucun muscle ne revient à 24 h\n'
  : '\n✗ des muscles reviennent encore à 24 h\n');
process.exitCode = ok ? 0 : 1;
