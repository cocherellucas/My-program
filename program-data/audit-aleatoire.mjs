// Test à grande échelle : des combinaisons d'objectifs TIRÉES AU HASARD dans tout
// l'espace que l'interface autorise (y compris les sous-ensembles de muscles, qui
// à eux seuls font 1023 possibilités). Vérifie que chacune produit un programme
// STRUCTURELLEMENT valide.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const canon = new Set(EXERCISES.map((e) => e.name.toLowerCase()));
const UPPER = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'];
const LOWER = ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'];
const GROUPES = [...UPPER, ...LOWER];
const MOUVEMENTS = ['Squat barre', 'Développé couché', 'Soulevé de terre', 'Traction lestée'];
const TYPES = ['hypertrophy', 'strength', 'endurance'];
const ZONES = ['full_body', 'upper_body', 'lower_body', 'specific_group'];
const JOURS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = ['Barre olympique', 'Rack squat', 'Rack demi-cage', 'Banc plat', 'Banc réglable', 'Disques olympiques',
  'Haltères', 'Barre de traction', 'Barre EZ', 'Câble poulie haute', 'Câble poulie basse', 'Station câbles double',
  'Tirage vertical', 'Tirage horizontal', 'Presse à cuisses', 'Leg extension machine', 'Leg curl machine',
  'Hack squat machine', 'Mollets debout machine', 'Mollets assis machine', 'Pec deck', 'Développé machine',
  'Hip thrust machine', 'Fessier machine', 'Abducteur machine', 'Barres parallèles', 'Curl biceps machine',
  'Preacher curl machine', 'Kettlebells', 'Élastiques de résistance', 'Gilet lesté', 'Ceinture de lest'];

// Modèle de durée identique à celui de program-activation (à garder synchronisé).
const minutes = (ex) => 8 + ex.reduce((n, x) => n + ((x.sets || 0) * ((x.rest_seconds || 90) + 45)) / 60, 0);

const musclesDUnObjectif = (o) => {
  if ((o.focus_movement || []).length) return new Set(); // objectif de mouvement : géré à part
  if (o.zone === 'specific_group') return new Set(o.focus_group || []);
  if (o.zone === 'upper_body') return new Set(UPPER);
  if (o.zone === 'lower_body') return new Set(LOWER);
  if (o.zone === 'full_body') return new Set([...UPPER, ...LOWER]);
  return new Set();
};
const musclesCibles = (objs) => {
  const s = new Set();
  for (const o of objs) musclesDUnObjectif(o).forEach((m) => s.add(m));
  return s;
};
const typeParMuscle = (objs) => {
  const m = {};
  for (const o of objs) musclesDUnObjectif(o).forEach((x) => { if (!m[x]) m[x] = o.type; });
  return m;
};

// Existe-t-il un placement de `n` séances sur ces jours où AUCUNE paire n'est à
// moins de 48 h ? Sinon, la répétition d'un muscle est imposée par les
// disponibilités, pas par le programme.
function placementEspacePossible(joursDispo, n) {
  if (n < 2) return true;
  const idx = joursDispo.map((d) => JOURS.indexOf(d)).sort((a, b) => a - b);
  if (n > idx.length) return false;
  const combo = [];
  let possible = false;
  const walk = (start) => {
    if (possible) return;
    if (combo.length === n) {
      let min = Infinity;
      for (let k = 0; k < combo.length; k++) {
        const a = combo[k];
        const b = combo[(k + 1) % combo.length];
        const g = k === combo.length - 1 ? 7 - a + b : b - a;
        min = Math.min(min, g);
      }
      if (min >= 2) possible = true;
      return;
    }
    for (let i = start; i < idx.length; i++) { combo.push(idx[i]); walk(i + 1); combo.pop(); }
  };
  walk(0);
  return possible;
}

let graine = 12345;
const rnd = () => (graine = (graine * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = (a) => a[Math.floor(rnd() * a.length)];
const sample = (a, n) => a.slice().sort(() => rnd() - 0.5).slice(0, Math.max(1, n));

function objectifAleatoire(priorite) {
  const type = pick(TYPES);
  if (type === 'strength' && rnd() < 0.3) {
    return { type, zone: '', priority: priorite, focus_movement: sample(MOUVEMENTS, 1 + Math.floor(rnd() * 3)) };
  }
  const zone = pick(ZONES);
  if (zone === 'specific_group') {
    return { type, zone, priority: priorite, focus_group: sample(GROUPES, 1 + Math.floor(rnd() * 5)) };
  }
  return { type, zone, priority: priorite };
}

const N = Number(process.argv[2] || 2000);
const problemes = {};
const exemples = {};
let ctx = null;
const ajoute = (k, detail) => {
  problemes[k] = (problemes[k] || 0) + 1;
  if (!exemples[k]) exemples[k] = `${ctx}${detail ? '\n        ' + detail : ''}`;
};
let ok = 0;

for (let i = 0; i < N; i++) {
  const nbObj = 1 + Math.floor(rnd() * 3);
  const objectives = [objectifAleatoire('primary')];
  for (let k = 1; k < nbObj; k++) objectives.push(objectifAleatoire('secondary'));

  const jours = sample(JOURS, 2 + Math.floor(rnd() * 5));
  const avecDuree = rnd() < 0.4;
  const user = {
    level: pick(['beginner', 'intermediate', 'advanced']),
    training_context: rnd() < 0.25 ? 'bodyweight' : 'full_gym',
    availability_optimal: false,
    frequency_max: jours.length,
    available_days: jours,
    equipment: GYM,
    ...(avecDuree ? { duration_per_day: Object.fromEntries(jours.map((d) => [d, pick([30, 45, 60, 90])])) } : {}),
  };

  ctx = objectives.map(o=>o.type+":"+(o.zone||"mvt")+(o.focus_group?"["+o.focus_group.join(",")+"]":"")+":"+o.priority).join(" + ") + "  |  " + user.level + "/" + user.training_context + "  |  " + jours.join(",");
  let r;
  try { r = await buildActivationResult(user, objectives); }
  catch (e) { ajoute('EXCEPTION : ' + (e?.message || e).slice(0, 60)); continue; }
  if (!r) { ajoute('aucun programme produit'); continue; }

  const wk = r.sessions.filter((s) => s.week === 1);
  let bon = true;
  if (!wk.length) { ajoute('semaine vide'); bon = false; }
  if (wk.length > jours.length) { ajoute('plus de séances que de jours disponibles'); bon = false; }

  for (const s of wk) {
    if (!s.exercises.length) { ajoute('séance sans exercice'); bon = false; continue; }
    const vus = new Set();
    let rangPrec = -1;
    for (const x of s.exercises) {
      if (!canon.has(String(x.name).toLowerCase())) { ajoute('exercice absent de la base'); bon = false; }
      if (vus.has(x.name)) { ajoute('exercice en double dans la séance'); bon = false; }
      vus.add(x.name);
      if (!x.sets || x.sets < 1) { ajoute('séries invalides'); bon = false; }
      if (!x.target_reps) { ajoute('répétitions manquantes'); bon = false; }
      const rang = { A: 0, B: 1, C: 2 }[x.block] ?? 3;
      if (rang < rangPrec) { ajoute('blocs dans le désordre'); bon = false; }
      rangPrec = rang;
    }
    if (!s.day || !JOURS.includes(s.day)) { ajoute('jour invalide'); bon = false; }
    if (!jours.includes(s.day)) { ajoute('séance posée un jour NON disponible'); bon = false; }

    // Durée : quand l'utilisateur l'a fixée, la séance doit y tenir.
    const dispoMin = user.duration_per_day?.[s.day];
    if (dispoMin && minutes(s.exercises) > dispoMin + 1) {
      // Plancher atteignable : uniquement les polyarticulaires, à 2 séries (ce que
      // le rognage peut faire de mieux sans supprimer l'objectif). S'il dépasse
      // déjà le temps annoncé, aucune mise en forme ne peut y arriver — c'est le
      // budget qui est insuffisant, pas le programme qui est mal rogné.
      const composes = s.exercises.filter((x) => (EXERCISES.find((e) => e.name.toLowerCase() === x.name.toLowerCase())?.type) === 'compound');
      const plancher = 8 + composes.reduce((n, x) => n + (2 * ((x.rest_seconds || 90) + 45)) / 60, 0);
      if (plancher > dispoMin) ajoute('BUDGET : le temps annoncé ne suffit pas (inévitable)');
      else { ajoute('séance plus longue que le temps disponible'); bon = false; }
    }
  }

  // ── Qualité d'entraînement (au-delà de la structure) ──────────────────────
  const cibles = musclesCibles(objectives);
  const parMouvement = objectives.some((o) => (o.focus_movement || []).length);

  // Aucun volume DIRECT sur un muscle que l'utilisateur n'a pas demandé.
  if (!parMouvement) {
    const horsCible = new Set();
    for (const s of wk) for (const x of s.exercises) if (!cibles.has(x.muscle_group)) horsCible.add(x.muscle_group);
    if (horsCible.size) { ajoute('volume sur un muscle NON ciblé'); bon = false; }
  }

  // Récupération : jamais le même muscle à moins de 48 h (règle SRA du brief).
  const idx = (d) => JOURS.indexOf(d);
  for (let a = 0; a < wk.length; a++) {
    for (let b = a + 1; b < wk.length; b++) {
      const d = Math.abs(idx(wk[a].day) - idx(wk[b].day));
      if (Math.min(d, 7 - d) >= 2) continue;
      const ma = new Set(wk[a].exercises.map((x) => x.muscle_group));
      if (wk[b].exercises.some((x) => ma.has(x.muscle_group))) {
        // On ne le reproche au programme que si un placement SANS jours collés
        // existait vraiment pour ce nombre de séances. Avec lun/mar/mer/dim et 4
        // séances, aucun agencement ne l'évite : c'est la disponibilité qui
        // contraint, pas le programme.
        if (placementEspacePossible(jours, wk.length)) { ajoute('même muscle à moins de 48 h'); bon = false; }
      }
    }
  }

  // Répétitions cohérentes avec le type de l'objectif du muscle.
  // Deux exclusions nécessaires, sinon on signale des programmes corrects :
  //  • un exercice issu d'un objectif de MOUVEMENT suit la programmation de force
  //    de ce mouvement, même si son muscle appartient par ailleurs à une zone
  //    ciblée en endurance (ex. soulevé de terre en 6-8 dans un objectif dos
  //    endurance + force soulevé) ;
  //  • une ISOLATION ne se fait jamais en 3-5 reps — des abdos « en force » gardent
  //    des séries longues, et c'est correct.
  const tpm = typeParMuscle(objectives);
  const famille = /squat|développé (couché|incliné)|soulevé de terre|rack pull|traction/i;
  for (const s of wk) {
    for (const x of s.exercises) {
      const ty = tpm[x.muscle_group];
      const bas = parseInt(String(x.target_reps), 10);
      if (!ty || !bas) continue;
      if (parMouvement && famille.test(x.name)) continue;
      const estCompose = (EXERCISES.find((e) => e.name.toLowerCase() === x.name.toLowerCase())?.type) === 'compound';
      if (ty === 'endurance' && bas < 8) { ajoute('séries trop courtes pour un objectif endurance', `${x.name} ${x.sets}x${x.target_reps} (${x.muscle_group})`); bon = false; }
      if (ty === 'strength' && estCompose && bas > 15) { ajoute('séries trop longues pour un objectif force', `${x.name} ${x.sets}x${x.target_reps} (${x.muscle_group})`); bon = false; }
    }
  }

  if (bon) ok++;
}

console.log(`\n██ ${N} combinaisons tirées au hasard ██\n`);
console.log(`  ✓ programme valide : ${ok}  (${((ok / N) * 100).toFixed(1)} %)`);
const total = Object.values(problemes).reduce((a, b) => a + b, 0);
if (!total) console.log('  ✗ aucun problème');
else {
  console.log(`  ✗ problèmes : ${total}\n`);
  Object.entries(problemes).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`     ${String(n).padStart(5)}×  ${k}
        ex. ${exemples[k]}
`));
}
