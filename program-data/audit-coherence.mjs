// ─────────────────────────────────────────────────────────────────────────────
// AUDIT DE COHÉRENCE — sur TOUT l'espace de paramètres que l'interface autorise
// (objectifs multiples, spécialisation par muscles, objectifs sur mouvement,
// n'importe quels jours, n'importe quelles durées), tirés au hasard.
// Vérifie les invariants STRUCTURELS d'une séance, et la cohérence entre ce que
// le garde-fou temps annonce et ce que la génération produit réellement.
// ─────────────────────────────────────────────────────────────────────────────
import { buildActivationResult, verifierBudgetTemps } from '../src/lib/program-activation.js';
import { EXERCISES } from '../src/lib/exercise-database.js';
import { equipementPossede, exerciceFaisable } from '../src/lib/equipment.js';

const canon = new Set(EXERCISES.map((e) => e.name.toLowerCase()));
const UPPER = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'];
const LOWER = ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'];
const GROUPES = [...UPPER, ...LOWER];
const MOUVEMENTS = ['Squat barre', 'Développé couché', 'Soulevé de terre', 'Traction lestée'];
const TYPES = ['hypertrophy', 'strength', 'endurance'];
const ZONES = ['full_body', 'upper_body', 'lower_body', 'specific_group'];
const JOURS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
// « Salle complète » = TOUT le matériel que la base d'exercices connaît. Écrire
// cette liste à la main donnait des faux positifs (des noms qui ne collaient pas
// à ceux de la base), et surtout ce n'est pas ce que l'app envoie : le preset
// full_gym de StepEquipment coche l'intégralité du matériel.
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];
const BW = ['Barre de traction haute', 'Barres parallèles', 'Barre basse'];

const EXEC = 40, WARM = 8;
const minutes = (ex) => WARM + ex.reduce((n, x) => n + ((x.sets || 0) * ((x.rest_seconds || 90) + EXEC)) / 60, 0);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const N = Number(process.argv[2]) || 3000;

const pb = {};
const exemples = {};
const flag = (cle, detail) => {
  pb[cle] = (pb[cle] || 0) + 1;
  if (!exemples[cle]) exemples[cle] = detail;
};

let testes = 0, sansProgramme = 0;

for (let iter = 0; iter < N; iter++) {
  const level = pick(NIVEAUX);
  const salle = Math.random() < 0.7;
  const nbJours = 2 + Math.floor(Math.random() * 6);
  const jours = [...JOURS].sort(() => Math.random() - 0.5).slice(0, nbJours);
  const libre = Math.random() < 0.2;
  const duration_per_day = {};
  for (const d of jours) duration_per_day[d] = pick([30, 45, 60, 75, 90, 120]);

  const nbObj = 1 + Math.floor(Math.random() * 3);
  const objectives = [];
  for (let k = 0; k < nbObj; k++) {
    const type = pick(TYPES);
    const surMouvement = type === 'strength' && Math.random() < 0.3;
    if (surMouvement) {
      const movs = [...MOUVEMENTS].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3));
      objectives.push({ type, zone: '', focus_movement: movs, priority: k === 0 ? 'primary' : 'secondary' });
    } else {
      const zone = pick(ZONES);
      const o = { type, zone, priority: k === 0 ? 'primary' : 'secondary' };
      if (zone === 'specific_group') {
        o.focus_group = [...GROUPES].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 4));
      }
      objectives.push(o);
    }
  }

  const user = {
    level,
    training_context: salle ? 'full_gym' : 'bodyweight',
    equipment: salle ? GYM : BW,
    availability_optimal: libre,
    frequency_max: nbJours,
    available_days: jours,
    duration_per_day: libre ? undefined : duration_per_day,
  };

  let r;
  try {
    r = await buildActivationResult(user, objectives);
  } catch (e) {
    flag('CRASH de la génération', `${e.message} | ${JSON.stringify(objectives)}`);
    continue;
  }
  if (!r) { sansProgramme++; continue; }
  testes++;

  const id = `${level}/${user.training_context} ${nbJours}j`
    + `${libre ? ' (libre)' : ''} | ${objectives.map((o) => `${o.type}:${o.zone || 'mvt'}:${o.priority}`).join(' + ')}`;

  // Le garde-fou dit-il la même chose que ce qui est produit ?
  let garde;
  try {
    garde = await verifierBudgetTemps(user, objectives);
  } catch (e) {
    flag('CRASH du garde-fou temps', `${e.message} | ${id}`);
    garde = { ok: true, problemes: [] };
  }

  const semaine1 = r.sessions.filter((s) => s.week === 1);
  if (!semaine1.length) flag('semaine vide', id);

  for (const s of r.sessions) {
    const ou = `${id} « ${s.day_label} »`;
    if (!s.exercises?.length) { flag('séance sans exercice', ou); continue; }

    const noms = s.exercises.map((x) => String(x.name).toLowerCase());
    if (new Set(noms).size !== noms.length) flag('exercice en double dans la séance', ou);

    for (const x of s.exercises) {
      if (!canon.has(String(x.name).toLowerCase())) flag('exercice inconnu de la base', `${ou} — ${x.name}`);
      if (!(x.sets > 0)) flag('séries <= 0', `${ou} — ${x.name}`);
      if (!(x.rest_seconds > 0)) flag('repos manquant', `${ou} — ${x.name}`);
      if (!x.target_reps) flag('plage de reps manquante', `${ou} — ${x.name}`);
      if (!x.muscle_group) flag('muscle manquant', `${ou} — ${x.name}`);
      if (salle && (x.sets || 0) > 6) flag('empilement > 6 séries en salle', `${ou} — ${x.name} ${x.sets}s`);
      if ((x.sets || 0) > 12) flag('plus de 12 séries sur un exercice', `${ou} — ${x.name} ${x.sets}s`);
    }

    // Matériel : chaque exercice doit être faisable avec ce qui est déclaré.
    // On passe par le MÊME helper que l'app (équivalences de vocabulaire
    // comprises), sinon l'audit mesurerait une autre règle que la génération.
    const possede = equipementPossede(salle ? GYM : BW);
    for (const x of s.exercises) {
      const e = EXERCISES.find((y) => y.name.toLowerCase() === String(x.name).toLowerCase());
      if (!e) continue;
      if (!exerciceFaisable(e, possede)) flag('exercice infaisable avec le matériel', `${ou} — ${x.name}`);
    }

    // Un jour ne doit jamais porter deux séances.
    if (!s.day) flag('séance sans jour', ou);
  }

  // Jours : jamais plus de séances que de jours disponibles, et uniquement des
  // jours que l'utilisateur a cochés.
  const joursUtilises = new Set(semaine1.map((s) => s.day));
  if (joursUtilises.size !== semaine1.length) flag('deux séances le même jour', id);
  if (!libre && [...joursUtilises].some((d) => !jours.includes(d))) {
    flag('séance un jour non disponible', `${id} → ${[...joursUtilises].join(',')}`);
  }

  // Cohérence garde-fou ↔ génération : si le garde-fou laisse passer, aucune
  // séance ne doit dépasser sa durée de plus d'une série.
  if (!libre && garde.ok) {
    for (const s of semaine1) {
      const budget = Number(duration_per_day[s.day]) || 0;
      if (!budget) continue;
      const uneSerie = Math.min(...s.exercises.map((x) => ((x.rest_seconds || 90) + EXEC) / 60));
      if (minutes(s.exercises) > budget + uneSerie + 0.01) {
        flag('garde-fou OK mais séance hors budget',
          `${id} « ${s.day_label} » ${Math.round(minutes(s.exercises))}min > ${budget}min`);
      }
    }
  }
}

console.log(`\n██ AUDIT DE COHÉRENCE — ${N} tirages ██\n`);
console.log(`  programmes générés : ${testes}`);
console.log(`  aucun programme    : ${sansProgramme}`);
const cles = Object.keys(pb);
if (!cles.length) {
  console.log('\n  ✓ AUCUNE incohérence détectée');
} else {
  console.log(`\n  ✗ ${cles.length} type(s) d'incohérence :\n`);
  for (const k of cles.sort((a, b) => pb[b] - pb[a])) {
    console.log(`   ${String(pb[k]).padStart(5)}×  ${k}`);
    console.log(`          ex. ${exemples[k]}`);
  }
}
