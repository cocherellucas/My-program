// Le garde-fou temps attrape-t-il TOUS les dépassements de durée ?
//
// audit-aleatoire signale des dépassements étiquetés « inévitable ». Encore
// faut-il vérifier que l'app les REFUSE avant d'y arriver : un dépassement
// bloqué à la validation n'atteint jamais l'utilisateur, un dépassement non
// bloqué lui donne une séance plus longue que la durée qu'il a annoncée.
//
// On tire des profils, on demande son verdict au garde-fou, et on compare avec
// la durée réellement produite — avec le MÊME modèle de durée que le moteur
// (8 min d'échauffement, 45 s d'exécution par série).
import { buildActivationResult, verifierBudgetTemps } from '../src/lib/program-activation.js';

const EXEC_SECONDS_PER_SET = 45;
const WARMUP_MINUTES = 8;
const dureeSeance = (exercises) => WARMUP_MINUTES + exercises.reduce(
  (n, x) => n + ((x.sets || 0) * ((x.rest_seconds || 90) + EXEC_SECONDS_PER_SET)) / 60, 0);

const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
const CONTEXTES = ['bodyweight', 'full_gym', 'home_barbell'];
const ZONES = ['full_body', 'upper_body', 'lower_body'];
const TYPES = ['strength', 'hypertrophy', 'endurance'];
const DUREES = [30, 45, 60, 75, 90];
const JOURS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Tirage reproductible (même graine → même rapport).
let graine = 20260811;
const rnd = () => { graine = (graine * 1103515245 + 12345) & 0x7fffffff; return graine / 0x7fffffff; };
const pick = (a) => a[Math.floor(rnd() * a.length)];

const compte = { total: 0, bloques: 0, passesOk: 0, PASSES_TROP_LONGS: 0 };
const fuites = [];

for (let i = 0; i < 1200; i++) {
  const duree = pick(DUREES);
  const nbJours = 2 + Math.floor(rnd() * 5);
  const jours = [...JOURS].sort(() => rnd() - 0.5).slice(0, nbJours);
  const duration_per_day = Object.fromEntries(jours.map((d) => [d, duree]));
  const user = {
    level: pick(NIVEAUX),
    training_context: pick(CONTEXTES),
    equipment: '[]',
    available_days: jours,
    duration_per_day,
    availability_optimal: false,
    frequency_max: nbJours,
  };
  const objectives = [{ type: pick(TYPES), zone: pick(ZONES), priority: 'primary' }];
  if (rnd() > 0.6) objectives.push({ type: pick(TYPES), zone: pick(ZONES), priority: 'secondary' });

  let verdict; let res;
  try {
    verdict = await verifierBudgetTemps(user, objectives);
    res = await buildActivationResult(user, objectives);
  } catch { continue; }
  if (!res?.sessions?.length) continue;
  compte.total++;

  // Même tolérance que le garde-fou : une série de marge, et semaine 1 seulement.
  const trop = res.sessions.filter((s) => {
    if (s.week !== 1 || !s.exercises?.length) return false;
    const annonce = Number(duration_per_day[s.day]) || 0;
    if (!annonce) return false;
    const uneSerie = Math.min(...s.exercises.map((x) => ((x.rest_seconds || 90) + EXEC_SECONDS_PER_SET) / 60));
    return dureeSeance(s.exercises) > annonce + uneSerie;
  });

  if (!verdict.ok) compte.bloques++;
  else if (trop.length) {
    compte.PASSES_TROP_LONGS++;
    if (fuites.length < 10) {
      fuites.push(`${user.level}/${user.training_context} · ${objectives.map((o) => `${o.type}:${o.zone}:${o.priority}`).join(' + ')} · ${nbJours}j × ${duree} min`
        + `  →  « ${trop[0].day_label || trop[0].day} » ${Math.round(dureeSeance(trop[0].exercises))} min`);
    }
  } else compte.passesOk++;
}

console.log('\n██ LE GARDE-FOU TEMPS LAISSE-T-IL PASSER DES SÉANCES TROP LONGUES ? ██\n');
console.log(`  profils testés            : ${compte.total}`);
console.log(`  refusés par le garde-fou  : ${compte.bloques}`);
console.log(`  acceptés et conformes     : ${compte.passesOk}`);
console.log(`  ACCEPTÉS MAIS TROP LONGS  : ${compte.PASSES_TROP_LONGS}`);
if (fuites.length) {
  console.log('\n  Exemples de fuites :');
  for (const f of fuites) console.log(`    ✗ ${f}`);
}
console.log(compte.PASSES_TROP_LONGS === 0
  ? '\n✓ aucune fuite : tout dépassement est refusé avant d’atteindre l’utilisateur\n'
  : '\n✗ des séances plus longues que la durée annoncée atteignent l’utilisateur\n');
