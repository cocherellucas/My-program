// AUDIT — les branches d'activation que les autres tests ne touchent jamais.
//
// `test-espacement`, `audit-fenetre-sra` et `audit-jonction-semaines` n'envoient
// qu'UN objectif simple `{type, zone, priority}`. Or `buildActivationResult` a
// trois chemins, et deux ne sont jamais exercés par eux :
//   • objectifs COMPOSÉS (primaire + secondaire) → zonePrioritaire ≠ null, ce qui
//     désactive l'alternance de parité et change l'attribution des créneaux ;
//   • MUSCLES PRÉCIS (`specific_group`) → specializeProgram ;
//   • MOUVEMENTS (`focus_movement`) → pickStrengthBase + specializeMovements.
//
// On leur applique les mêmes exigences qu'au reste : pas de muscle qui revient
// sous sa fenêtre de récupération, et pas d'incohérence d'affichage.
import { buildActivationResult } from '../src/lib/program-activation.js';
import { SRA_WINDOWS } from '../src/lib/coaching-engine.js';
import { sessionMinutes } from '../src/lib/duration.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];
const fenetreDe = (t) => Math.min(SRA_WINDOWS[t] || 48, SRA_WINDOWS.hypertrophy);

// Jeux d'objectifs représentatifs des trois branches.
const JEUX = [];
for (const t1 of ['strength', 'hypertrophy', 'endurance']) {
  for (const t2 of ['hypertrophy', 'endurance']) {
    JEUX.push({ nom: `${t1} haut (prim) + ${t2} bas (sec)`, obj: [
      { type: t1, zone: 'upper_body', priority: 'primary' },
      { type: t2, zone: 'lower_body', priority: 'secondary' },
    ] });
  }
  JEUX.push({ nom: `${t1} muscles précis (Biceps, Pectoraux)`, obj: [
    { type: t1, zone: 'specific_group', focus_group: ['Biceps', 'Pectoraux'], priority: 'primary' },
  ] });
  JEUX.push({ nom: `${t1} muscles précis (Mollets, Fessiers)`, obj: [
    { type: t1, zone: 'specific_group', focus_group: ['Mollets', 'Fessiers'], priority: 'primary' },
  ] });
}
JEUX.push({ nom: 'force SBD (3 lifts)', obj: [
  { type: 'strength', zone: '', focus_movement: ['Squat barre', 'Développé couché', 'Soulevé de terre'], priority: 'primary' },
] });
JEUX.push({ nom: 'force squat seul', obj: [
  { type: 'strength', zone: '', focus_movement: ['Squat barre'], priority: 'primary' },
] });
JEUX.push({ nom: 'force SBD + hypertrophie corps entier (sec)', obj: [
  { type: 'strength', zone: '', focus_movement: ['Squat barre', 'Développé couché', 'Soulevé de terre'], priority: 'primary' },
  { type: 'hypertrophy', zone: 'full_body', priority: 'secondary' },
] });

// Fenêtre PAR MUSCLE, comme le moteur (`fenetreStructure`). Une première version
// appliquait la fenêtre de l'objectif dominant à tous les muscles : sur « force
// haut (primaire) + endurance bas (secondaire) », elle exigeait 48 h pour les
// mollets alors que l'endurance en demande 24. 212 faux positifs.
const HAUT = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'];
const BAS = ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'];
const ZONE_MUSCLES = { upper_body: HAUT, lower_body: BAS, full_body: [...HAUT, ...BAS] };
const MOUVEMENT_EXO = {
  'Squat barre': 'Squat barre',
  'Développé couché': 'Développé couché barre',
  'Soulevé de terre': 'Soulevé de terre',
  'Traction lestée': 'Traction pronation',
};
const APP_MUSCLE = { Poitrine: 'Pectoraux', Abdos: 'Abdominaux' };
const musclesDeObjectif = (o) => {
  const mv = [].concat(o.focus_movement || []);
  if (mv.length) {
    const set = new Set();
    for (const m of mv) {
      const e = EXERCISES.find((x) => x.name === (MOUVEMENT_EXO[m] || m));
      [...(e?.muscles?.primary || []), ...(e?.muscles?.secondary || [])]
        .forEach((n) => set.add(APP_MUSCLE[n] || n));
    }
    return [...set];
  }
  if (o.zone === 'specific_group') return [].concat(o.focus_group || []);
  return ZONE_MUSCLES[o.zone] || [];
};
const typesParMuscle = (obj) => {
  const t = {};
  for (const o of obj) for (const m of musclesDeObjectif(o)) if (!t[m]) t[m] = o.type;
  return t;
};
const typeDominant = (obj) => (obj.find((o) => o.priority !== 'secondary') || obj[0]).type;

let testes = 0;
const retours = [];
const zonesFausses = [];
const ecartsDuree = [];
const doublons = [];
const seancesVides = [];

for (const level of ['beginner', 'intermediate', 'advanced']) {
  for (const [ctx, eq] of [['full_gym', GYM], ['bodyweight', []]]) {
    for (const jeu of JEUX) {
      for (let n = 2; n <= 5; n++) {
        for (const debut of [0, 5, 6]) { // lundi · samedi · dimanche (bouclage)
          const jours = Array.from({ length: n }, (_, k) => ORDRE[(debut + k) % 7]);
          const user = {
            level, training_context: ctx, equipment: eq,
            availability_optimal: false, available_days: jours, frequency_max: n,
            duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
          };
          let res;
          try { res = await buildActivationResult(user, jeu.obj); } catch { continue; }
          if (!res) continue;
          testes++;
          const cle = `${level}/${ctx} · ${jeu.nom} · ${n}j dès ${jours[0]}`;

          // Deux semaines dépliées : la jonction compte autant que l'intérieur.
          const origine = ORDRE.indexOf(jours[0]);
          const pts = res.sessions.filter((s) => s.week <= 2)
            .map((s) => ({ s, t: (s.week - 1) * 7 + (((ORDRE.indexOf(s.day) - origine) + 7) % 7) }))
            .sort((a, b) => a.t - b.t);
          const parMuscle = typesParMuscle(jeu.obj);
          const dominant = typeDominant(jeu.obj);

          for (let a = 0; a < pts.length; a++) {
            for (let b = a + 1; b < pts.length; b++) {
              const heures = (pts[b].t - pts[a].t) * 24;
              if (heures === 0) continue;
              if (heures >= SRA_WINDOWS.hypertrophy) break; // plafond de structure
              const avant = new Set(pts[a].s.exercises.map((x) => x.muscle_group));
              for (const m of new Set(pts[b].s.exercises.map((x) => x.muscle_group))) {
                if (!avant.has(m)) continue;
                if (heures >= fenetreDe(parMuscle[m] || dominant)) continue;
                retours.push(`${cle} · ${m} à ${heures} h (S${pts[a].s.week} ${pts[a].s.day} → S${pts[b].s.week} ${pts[b].s.day})`);
              }
            }
          }

          for (const s of res.sessions.filter((x) => x.week === 1)) {
            if (!s.exercises.length) { seancesVides.push(`${cle} · ${s.day}`); continue; }
            const muscles = [...new Set(s.exercises.map((x) => x.muscle_group))];
            const declarees = (s.active_zones || []).map((z) => (typeof z === 'string' ? z : z?.muscle_group));
            if (muscles.some((m) => !declarees.includes(m)) || declarees.some((m) => !muscles.includes(m))) {
              zonesFausses.push(`${cle} · « ${s.day_label} » : présents [${muscles.join(', ')}] vs déclarés [${declarees.join(', ')}]`);
            }
            const ecart = Math.abs((s.estimated_duration || 0) - sessionMinutes(s.exercises));
            if (ecart > 5) ecartsDuree.push(`${cle} · « ${s.day_label} » : annoncé ${s.estimated_duration}, calculé ${Math.round(sessionMinutes(s.exercises))}`);
            const vus = new Set(); const dbl = new Set();
            for (const x of s.exercises) { if (vus.has(x.name)) dbl.add(x.name); vus.add(x.name); }
            if (dbl.size) doublons.push(`${cle} · « ${s.day_label} » : ${[...dbl].join(', ')}`);
          }
        }
      }
    }
  }
}

const bloc = (titre, liste) => {
  console.log(`\n  ${liste.length ? '✗' : '✓'} ${titre} : ${liste.length}`);
  for (const l of [...new Set(liste)].slice(0, 8)) console.log(`      ${l}`);
  const uniq = new Set(liste).size;
  if (uniq > 8) console.log(`      … et ${uniq - 8} autres`);
};

console.log('\n██ OBJECTIFS COMPOSÉS, MUSCLES PRÉCIS, MOUVEMENTS ██\n');
console.log(`  configurations testées : ${testes}`);
bloc('muscle revenant sous sa fenêtre (2 semaines dépliées)', retours);
bloc('active_zones ≠ muscles présents', zonesFausses);
bloc('durée annoncée ≠ modèle partagé (> 5 min)', ecartsDuree);
bloc('même exercice deux fois dans une séance', doublons);
bloc('séance VIDE', seancesVides);

const total = retours.length + zonesFausses.length + ecartsDuree.length + doublons.length + seancesVides.length;
console.log(total === 0 ? '\n✓ aucune incohérence\n' : `\n✗ ${total} incohérence(s)\n`);
process.exitCode = total === 0 ? 0 : 1;
