// AUDIT — la JONCTION entre deux semaines.
//
// Angle mort de toute la batterie : chaque test filtre `week === 1`. Or l'app
// génère les semaines en ALTERNANT deux variantes (`shapedParite[(w-1) % 2]`),
// pour qu'une moitié du corps ne soit pas toujours servie deux fois sur un nombre
// impair de séances. Les deux variantes n'ont donc PAS la même attribution
// haut/bas — et rien ne vérifie ce qui se passe entre la dernière séance d'une
// semaine et la première de la suivante.
//
// On déplie ici deux semaines sur une ligne de temps absolue (jour + 7 × semaine)
// et on cherche les retours d'un même muscle sous sa fenêtre de récupération.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { SRA_WINDOWS } from '../src/lib/coaching-engine.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];

const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
const ZONES = ['full_body', 'upper_body', 'lower_body'];
const TYPES = ['strength', 'hypertrophy', 'endurance'];
const CONTEXTES = [['full_gym', GYM], ['bodyweight', []]];

// Même définition que le moteur : la fenêtre de STRUCTURE est plafonnée à celle
// de l'hypertrophie, le stimulus lourd étant traité par la conversion
// lourd→volume. On ne mesure donc que ce que le moteur prétend garantir.
const fenetreDe = (type) => Math.min(SRA_WINDOWS[type] || 48, SRA_WINDOWS.hypertrophy);

let testes = 0;
const dansSemaine = [];   // rappel : déjà couvert par test-espacement
const aLaJonction = [];   // ce que personne ne regardait

for (const level of NIVEAUX) {
  for (const [ctx, eq] of CONTEXTES) {
    for (const zone of ZONES) {
      for (const type of TYPES) {
        for (let n = 2; n <= 5; n++) {
          for (let debut = 0; debut < 7; debut++) {
            const jours = Array.from({ length: n }, (_, k) => ORDRE[(debut + k) % 7]);
            const user = {
              level, training_context: ctx, equipment: eq,
              availability_optimal: false, available_days: jours, frequency_max: n,
              duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
            };
            let res;
            try { res = await buildActivationResult(user, [{ type, zone, priority: 'primary' }]); } catch { continue; }
            const sem12 = (res?.sessions || []).filter((s) => s.week <= 2);
            if (sem12.length < 3) continue;
            testes++;

            // Ligne de temps absolue. Le jour d'ouverture du bloc sert d'origine :
            // sur dimanche+lundi+mardi, dimanche est le jour 0 de la semaine.
            const origine = ORDRE.indexOf(jours[0]);
            const abs = (s) => {
              const dans = ((ORDRE.indexOf(s.day) - origine) + 7) % 7;
              return (s.week - 1) * 7 + dans;
            };
            const pts = sem12.map((s) => ({ s, t: abs(s) })).sort((a, b) => a.t - b.t);

            for (let a = 0; a < pts.length; a++) {
              for (let b = a + 1; b < pts.length; b++) {
                const heures = (pts[b].t - pts[a].t) * 24;
                if (heures === 0) continue;
                if (heures >= fenetreDe(type)) break; // trié : au-delà, tout l'est
                const avant = new Set(pts[a].s.exercises.map((x) => x.muscle_group));
                for (const m of new Set(pts[b].s.exercises.map((x) => x.muscle_group))) {
                  if (!avant.has(m)) continue;
                  const memeSemaine = pts[a].s.week === pts[b].s.week;
                  const ligne = `${level}/${ctx} · ${type}/${zone} · ${n}j dès ${jours[0]} · ${m} à ${heures} h`
                    + ` (S${pts[a].s.week} ${pts[a].s.day} → S${pts[b].s.week} ${pts[b].s.day})`;
                  (memeSemaine ? dansSemaine : aLaJonction).push(ligne);
                }
              }
            }
          }
        }
      }
    }
  }
}

console.log('\n██ JONCTION ENTRE DEUX SEMAINES ██\n');
console.log(`  configurations testées : ${testes}`);
console.log(`\n  rappel — retours DANS une même semaine : ${dansSemaine.length}   (couvert par test-espacement)`);
console.log(`\n  ${aLaJonction.length ? '✗' : '✓'} retours À LA JONCTION semaine N → N+1 : ${aLaJonction.length}   ← doit valoir 0`);
for (const l of aLaJonction.slice(0, 12)) console.log(`      ${l}`);
if (aLaJonction.length > 12) console.log(`      … et ${aLaJonction.length - 12} autres`);
console.log('');
process.exitCode = aLaJonction.length === 0 ? 0 : 1;
