// AUDIT (il constate, il ne bloque pas) — `test-espacement.mjs` ne regarde que
// les retours à 24 h, désormais à zéro. Mais en FORCE la fenêtre SRA vaut 72 h :
// un muscle qui revient à 48 h est lui aussi hors fenêtre.
//
// MAIS un retour à 48 h n'est pas grave en soi : un programme de force bien
// construit alterne une exposition LOURDE et une exposition VOLUME sur le même
// muscle. Ce qui coûte cher nerveusement, c'est DEUX séances lourdes rapprochées.
// L'audit classe donc chaque retour par nature — c'est la remarque de Lucas, et
// elle change le verdict.
//
// Mesuré le 2026-08-14, sur 1512 configurations — 216 profils × les 7 jours de
// départ possibles, car la semaine boucle et un bloc dimanche+lundi+mardi ne se
// comporte pas comme lundi+mardi+mercredi. Les retours ne surviennent qu'en
// FORCE, dont la fenêtre est la plus large.
//                     avant   après
//    lourd/lourd        43       0     ← le seul vrai problème
//    lourd/volume       15     433
//    volume/volume     130     837
//
// RÉGLÉ par `allegerSecondeExpositionLourde` (src/lib/program-activation.js) :
// la première exposition reste lourde, les suivantes qui tombent dans la fenêtre
// passent en fourchette volume. Ce n'est PAS le découpage en trois qui avait été
// envisagé — il aurait donné des séances d'un seul muscle sur 5 jours collés en
// « haut du corps ».
//
// Cet audit reste utile comme filet : il doit continuer d'afficher 0 en
// lourd/lourd après toute modification de la chaîne de mise en forme.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { SRA_WINDOWS } from '../src/lib/coaching-engine.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];

const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
const ZONES = ['full_body', 'upper_body', 'lower_body'];
const TYPES = ['strength', 'hypertrophy', 'endurance'];
const CONTEXTES = [['full_gym', GYM], ['bodyweight', []]];

let testes = 0;
const horsFenetre = [];
const parJours = new Map();
const natures = new Map();
const lourdLourd = [];

// Un bon programme de force alterne une exposition LOURDE et une exposition
// VOLUME sur le même muscle : revenir dessus à 48 h n'est un problème que si les
// DEUX sont lourdes (c'est le système nerveux qui paie, pas le muscle).
// « Lourd » = bloc A dont TOUTE la fourchette tient dans la plage de force du
// brief (« Force (SBD) : reps 3-6 ») — donc le HAUT de la fourchette ≤ 6.
// « 3-5 » est lourd, « 6-8 » est du volume. Une première version regardait le BAS
// et classait « 6-8 » comme lourd : elle surestimait le problème.
const hautRep = (r) => {
  const n = String(r ?? '').match(/\d+/g);
  return n?.length ? parseInt(n[n.length - 1], 10) : 99;
};
const charge = (seance, muscle) => (
  seance.exercises.some((x) => x.muscle_group === muscle && x.block === 'A' && hautRep(x.target_reps) <= 6)
    ? 'lourd' : 'volume'
);

for (const level of NIVEAUX) {
  for (const [ctx, eq] of CONTEXTES) {
    for (const zone of ZONES) {
      for (const type of TYPES) {
        for (let n = 2; n <= 5; n++) {
         // La semaine boucle : on fait glisser le jour de départ pour couvrir les
         // blocs qui traversent la fin de semaine (dimanche+lundi+mardi…).
         for (let debut = 0; debut < 7; debut++) {
          const jours = Array.from({ length: n }, (_, k) => ORDRE[(debut + k) % 7]);
          const user = {
            level, training_context: ctx, equipment: eq,
            availability_optimal: false, available_days: jours, frequency_max: n,
            duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
          };
          let res;
          try { res = await buildActivationResult(user, [{ type, zone, priority: 'primary' }]); } catch { continue; }
          const sem = (res?.sessions || []).filter((s) => s.week === 1)
            .map((s) => ({ s, i: ORDRE.indexOf(s.day) })).sort((a, b) => a.i - b.i);
          if (sem.length < 2) continue;
          testes++;

          for (let a = 0; a < sem.length; a++) {
            for (let b = a + 1; b < sem.length; b++) {
              const brut = sem[b].i - sem[a].i;
              const ecart = Math.min(brut, 7 - brut); // bouclage hebdo
              const t = sem[a].s.type || type;
              const fenetre = SRA_WINDOWS[t] || 48;
              if (ecart * 24 >= fenetre) continue;
              if (ecart === 1) continue; // déjà couvert par test-espacement
              const veille = new Set(sem[a].s.exercises.map((x) => x.muscle_group));
              for (const m of new Set(sem[b].s.exercises.map((x) => x.muscle_group))) {
                if (!veille.has(m)) continue;
                const cle = `${level}/${ctx} · ${type}/${zone} · ${n}j dès ${jours[0]}`;
                const chargeA = charge(sem[a].s, m);
                const chargeB = charge(sem[b].s, m);
                const nature = chargeA === 'lourd' && chargeB === 'lourd' ? 'lourd/lourd'
                  : chargeA === 'lourd' || chargeB === 'lourd' ? 'lourd/volume' : 'volume/volume';
                natures.set(nature, (natures.get(nature) || 0) + 1);
                horsFenetre.push(`${cle} · ${m} à ${ecart * 24} h (fenêtre ${fenetre} h) — ${nature}`);
                if (nature === 'lourd/lourd') lourdLourd.push(`${cle} · ${m} à ${ecart * 24} h`);
                parJours.set(n, (parJours.get(n) || 0) + 1);
              }
            }
          }
         }
        }
      }
    }
  }
}

console.log(`\nconfigurations testées : ${testes}`);
console.log(`retours HORS FENÊTRE au-delà de 24 h : ${horsFenetre.length}`);
console.log('par nombre de jours collés :', [...parJours].sort());
console.log('\npar NATURE des deux expositions :');
for (const [n, c] of [...natures].sort((a, b) => b[1] - a[1])) {
  const verdict = n === 'lourd/lourd' ? '  ← LE seul vrai problème (nerveux)' : '  (acceptable : lourd + volume)';
  console.log(`   ${n.padEnd(14)} ${String(c).padStart(4)}${verdict}`);
}
const uniqLL = [...new Set(lourdLourd.map((s) => s.split(' · ').slice(0, 3).join(' · ')))];
console.log(`\nconfigurations distinctes en LOURD/LOURD : ${uniqLL.length}`);
for (const u of uniqLL.slice(0, 20)) console.log('   ' + u);
if (uniqLL.length > 20) console.log(`   … et ${uniqLL.length - 20} autres`);
const uniq = [...new Set(horsFenetre.map((s) => s.split(' · ').slice(0, 3).join(' · ')))];
console.log(`\nconfigurations distinctes concernées : ${uniq.length}`);
for (const u of uniq.slice(0, 25)) console.log('   ' + u);
if (uniq.length > 25) console.log(`   … et ${uniq.length - 25} autres`);
