// AUDIT — l'ORDRE des exercices à l'intérieur d'une séance.
//
// Le découpage haut/bas ne réordonne pas : il fusionne le volume de la semaine par
// exercice puis le redistribue en tourniquet sur les séances de la moitié. Rien ne
// garantit alors que l'ordre reste tenable. Deux exigences :
//
//  1. ORDRE DES BLOCS — A (composé lourd) avant B avant C (isolation). C'est la
//     règle du brief du catalogue, et toute la logique de danger en dépend : le
//     lift le plus risqué doit être fait à froid. Un bloc C placé avant un bloc A
//     ferait passer l'isolation avant le lourd.
//  2. GROUPEMENT PAR MUSCLE — mesuré, mais NON EXIGÉ, et c'est délibéré.
//     Débat tranché le 2026-07-30, données à l'appui : grouper les exercices d'un
//     même muscle ou les alterner est un quasi match nul pour la croissance. La
//     TENSION MÉCANIQUE domine ; le stress métabolique est un mécanisme secondaire
//     revu à la baisse. L'avantage penche même légèrement vers l'ALTERNANCE —
//     espacer deux exercices d'un même muscle le laisse récupérer, donc porter
//     plus lourd. Ce qui compte est couvert par le contrôle 1 et par l'ordre de
//     première apparition (muscle prioritaire en tête).
//     On garde donc la mesure pour surveiller la dérive, sans en faire un échec.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];
const RANG = { A: 0, B: 1, C: 2 };

// Bloc en recul par rapport au précédent (C avant A, B avant A…).
const blocsDesordre = (exs) => {
  let pire = -1; let n = 0;
  for (const x of exs) {
    const r = RANG[x.block] ?? 3;
    if (r < pire) n++;
    else pire = r;
  }
  return n;
};

// Muscle qui réapparaît après avoir été quitté, À L'INTÉRIEUR d'un même bloc.
// Entre blocs, revenir sur un muscle est normal (développé en A, écarté en C).
const rebonds = (exs) => {
  let n = 0;
  for (const bloc of ['A', 'B', 'C']) {
    const suite = exs.filter((x) => x.block === bloc).map((x) => x.muscle_group);
    const vus = new Set(); let precedent = null;
    for (const m of suite) {
      if (m !== precedent && vus.has(m)) n++;
      vus.add(m); precedent = m;
    }
  }
  return n;
};

// ── Référence : ce que le CATALOGUE contient déjà ───────────────────────────
let catBlocs = 0; let catRebonds = 0; let catSeances = 0;
for (const p of PRE_GENERATED_PROGRAMS) {
  for (const s of p.program.sessions) {
    catSeances++;
    if (blocsDesordre(s.exercises)) catBlocs++;
    if (rebonds(s.exercises)) catRebonds++;
  }
}

// ── Ce que la GÉNÉRATION produit ────────────────────────────────────────────
let genSeances = 0; const genBlocs = []; const genRebonds = [];
for (const level of ['beginner', 'intermediate', 'advanced']) {
  for (const [ctx, eq] of [['full_gym', GYM], ['bodyweight', []]]) {
    for (const zone of ['full_body', 'upper_body', 'lower_body']) {
      for (const type of ['strength', 'hypertrophy', 'endurance']) {
        for (let n = 2; n <= 5; n++) {
          for (const debut of [0, 6]) { // lundi · dimanche (bouclage)
            const jours = Array.from({ length: n }, (_, k) => ORDRE[(debut + k) % 7]);
            const user = {
              level, training_context: ctx, equipment: eq,
              availability_optimal: false, available_days: jours, frequency_max: n,
              duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
            };
            let res;
            try { res = await buildActivationResult(user, [{ type, zone, priority: 'primary' }]); } catch { continue; }
            for (const s of (res?.sessions || []).filter((x) => x.week === 1)) {
              genSeances++;
              const cle = `${level}/${ctx} · ${type}/${zone} · ${n}j dès ${jours[0]} · « ${s.day_label} »`;
              if (blocsDesordre(s.exercises)) {
                genBlocs.push(`${cle} : ${s.exercises.map((x) => `${x.block}:${x.muscle_group}`).join(' → ')}`);
              }
              if (rebonds(s.exercises)) {
                genRebonds.push(`${cle} : ${s.exercises.map((x) => `${x.block}:${x.muscle_group}`).join(' → ')}`);
              }
            }
          }
        }
      }
    }
  }
}

const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) : '0.0');
console.log('\n██ ORDRE DES EXERCICES DANS LA SÉANCE ██\n');
console.log(`  catalogue  : ${catSeances} séances — blocs en désordre ${catBlocs} (${pct(catBlocs, catSeances)} %) · rebonds de muscle ${catRebonds} (${pct(catRebonds, catSeances)} %)`);
console.log(`  généré     : ${genSeances} séances — blocs en désordre ${genBlocs.length} (${pct(genBlocs.length, genSeances)} %) · rebonds de muscle ${genRebonds.length} (${pct(genRebonds.length, genSeances)} %)`);

console.log(`\n  ${genBlocs.length ? '✗' : '✓'} BLOCS EN DÉSORDRE (isolation avant le lourd) : ${genBlocs.length}   ← doit valoir 0`);
for (const l of genBlocs.slice(0, 6)) console.log(`      ${l}`);
if (genBlocs.length > 6) console.log(`      … et ${genBlocs.length - 6} autres`);

console.log(`\n  ~ REBONDS DE MUSCLE dans un même bloc : ${genRebonds.length}   (mesuré, pas exigé)`);
console.log('      La tension mécanique domine le stress métabolique : grouper ou alterner');
console.log('      est un match nul, avec un léger avantage à l\'alternance. Ce n\'est donc');
console.log('      pas un défaut — seulement un indicateur de dérive.');
for (const l of genRebonds.slice(0, 6)) console.log(`      ${l}`);
if (genRebonds.length > 6) console.log(`      … et ${genRebonds.length - 6} autres`);
console.log('');
process.exitCode = genBlocs.length === 0 ? 0 : 1;
