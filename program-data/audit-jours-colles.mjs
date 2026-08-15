// Jours COLLÉS : quels muscles reviennent à 24 h d'écart, et sur quels types ?
//
// Raisonnement de départ (Lucas) : seuls les jours collés posent problème, et
// seulement en hypertrophie et en force — puisque leurs fenêtres de récupération
// (48 h et 72 h) dépassent les 24 h d'écart. En endurance la fenêtre vaut 24 h,
// donc deux jours de suite passent tout juste.
//
// On vérifie ça sur les programmes réellement produits, pour des utilisateurs
// qui déclarent des jours COLLÉS (lundi→jeudi, ou week-end) — le seul cas où la
// question se pose.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { SRA_WINDOWS } from '../src/lib/coaching-engine.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
const ZONES = ['full_body', 'upper_body', 'lower_body'];
const TYPES = ['strength', 'hypertrophy', 'endurance'];

// Par type de séance : combien de fois un muscle revient à 24 h.
const parType = new Map();      // type → Map(muscle → n)
const exemples = [];
let testes = 0; let avecRetour = 0;

for (const level of NIVEAUX) {
  for (const zone of ZONES) {
    for (const type of TYPES) {
      for (let n = 2; n <= 5; n++) {
        const jours = ORDRE.slice(0, n); // COLLÉS à dessein
        const user = {
          level, training_context: 'full_gym', equipment: '[]',
          availability_optimal: false, available_days: jours, frequency_max: n,
          duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
        };
        let res;
        try { res = await buildActivationResult(user, [{ type, zone, priority: 'primary' }]); } catch { continue; }
        const sem = (res?.sessions || []).filter((s) => s.week === 1);
        if (sem.length < 2) continue;
        testes++;

        // Séances triées par jour réel.
        const parJour = sem
          .map((s) => ({ s, i: ORDRE.indexOf(s.day) }))
          .sort((a, b) => a.i - b.i);

        let trouve = false;
        for (let k = 1; k < parJour.length; k++) {
          if (parJour[k].i - parJour[k - 1].i !== 1) continue; // pas collés
          const a = new Set((parJour[k - 1].s.active_zones || []).map((z) => z.muscle_group));
          const b = new Set((parJour[k].s.active_zones || []).map((z) => z.muscle_group));
          const communs = [...a].filter((m) => b.has(m));
          if (!communs.length) continue;
          trouve = true;
          const t = parJour[k - 1].s.type || type;
          if (!parType.has(t)) parType.set(t, new Map());
          for (const m of communs) parType.get(t).set(m, (parType.get(t).get(m) || 0) + 1);
          if ((SRA_WINDOWS[t] || 48) > 24) {
            exemples.push({
              muscles: communs, type: t,
              config: `${level} · ${type}/${zone} · ${n}j collés`,
              jours: `${parJour[k - 1].s.day}+${parJour[k].s.day}`,
            });
          }
        }
        if (trouve) avecRetour++;
      }
    }
  }
}

console.log('\n██ MUSCLES QUI REVIENNENT SUR DEUX JOURS COLLÉS ██\n');
console.log('  (utilisateurs déclarant des jours consécutifs — le seul cas concerné)\n');
console.log(`  configurations testées      : ${testes}`);
console.log(`  avec au moins un retour 24h : ${avecRetour}`);

for (const [t, muscles] of [...parType].sort()) {
  const fenetre = SRA_WINDOWS[t] || 48;
  const verdict = fenetre <= 24 ? 'OK — 24 h suffit' : `PROBLÈME — il en faudrait ${fenetre} h`;
  console.log(`\n  Séances « ${t} » (fenêtre ${fenetre} h) → ${verdict}`);
  for (const [m, n] of [...muscles].sort((a, b) => b[1] - a[1])) console.log(`     ${m.padEnd(20)} ${n}`);
}

// Liste COMPLÈTE des configurations réellement en cause (hypertrophie et force
// seulement — en endurance 24 h suffit).
const parMuscle = new Map();
for (const e of exemples) {
  for (const m of e.muscles) {
    if (!parMuscle.has(m)) parMuscle.set(m, new Set());
    parMuscle.get(m).add(`${e.config}  (${e.jours}, séance ${e.type})`);
  }
}
console.log('\n██ CONFIGURATIONS EN CAUSE — hypertrophie et force uniquement ██');
for (const [m, configs] of [...parMuscle].sort((a, b) => b[1].size - a[1].size)) {
  console.log(`\n  ${m} — ${configs.size} configuration(s) :`);
  for (const c of [...configs].sort()) console.log(`      ${c}`);
}
console.log('');
