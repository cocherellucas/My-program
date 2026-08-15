// AUDIT — cohérence de bout en bout de la CRÉATION de programme.
//
// La chaîne d'activation a plusieurs endroits où DEUX sources de vérité peuvent
// diverger : une valeur écrite par le catalogue, et la même valeur recalculée par
// l'app quand la séance a été remaniée. Une séance rendue INCHANGÉE garde celle du
// catalogue ; une séance remaniée reçoit celle de l'app. On vérifie ici qu'elles
// racontent la même chose, sur un balayage large de profils.
//
// Cinq contrôles :
//  1. durée annoncée  vs  durée du modèle partagé (src/lib/duration.js)
//  2. active_zones    vs  muscles réellement présents dans la séance
//  3. libellé du jour vs  moitié du corps réellement travaillée
//  4. type de séance  vs  type d'objectif dominant du muscle
//  5. exercices en double dans une même séance
import { buildActivationResult } from '../src/lib/program-activation.js';
import { sessionMinutes } from '../src/lib/duration.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];
const BAS = new Set(['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets']);

const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
const ZONES = ['full_body', 'upper_body', 'lower_body'];
const TYPES = ['strength', 'hypertrophy', 'endurance'];
const CONTEXTES = [['full_gym', GYM], ['bodyweight', []]];

const ecarts = [];      // 1
const zonesFausses = []; // 2
const libellesFaux = []; // 3
const typesFaux = [];    // 4
const doublons = [];     // 5
let seances = 0;
let profils = 0;

for (const level of NIVEAUX) {
  for (const [ctx, eq] of CONTEXTES) {
    for (const zone of ZONES) {
      for (const type of TYPES) {
        for (let n = 2; n <= 5; n++) {
          for (const debut of [0, 4, 6]) { // lundi · vendredi · dimanche (bouclage)
            for (const optimal of [false, true]) {
              const jours = Array.from({ length: n }, (_, k) => ORDRE[(debut + k) % 7]);
              const user = {
                level, training_context: ctx, equipment: eq,
                availability_optimal: optimal, available_days: jours, frequency_max: n,
                duration_per_day: optimal ? undefined : Object.fromEntries(jours.map((d) => [d, 90])),
              };
              let res;
              try { res = await buildActivationResult(user, [{ type, zone, priority: 'primary' }]); } catch { continue; }
              if (!res) continue;
              profils++;
              const cle = `${level}/${ctx} · ${type}/${zone} · ${n}j dès ${jours[0]}${optimal ? ' · sans contrainte' : ''}`;

              for (const s of res.sessions.filter((x) => x.week === 1)) {
                seances++;
                const muscles = [...new Set(s.exercises.map((x) => x.muscle_group))];

                // 1) Durée annoncée vs modèle partagé
                const reelle = sessionMinutes(s.exercises);
                const ecart = Math.abs((s.estimated_duration || 0) - reelle);
                if (ecart > 5) ecarts.push({ cle, label: s.day_label, annonce: s.estimated_duration, reelle: Math.round(reelle), ecart: Math.round(ecart) });

                // 2) active_zones vs muscles présents
                const zonesDeclarees = (s.active_zones || []).map((z) => (typeof z === 'string' ? z : z?.muscle_group));
                const manquants = muscles.filter((m) => !zonesDeclarees.includes(m));
                const enTrop = zonesDeclarees.filter((m) => !muscles.includes(m));
                if (manquants.length || enTrop.length) {
                  zonesFausses.push({ cle, label: s.day_label, manquants, enTrop, zonesDeclarees });
                }

                // 3) Libellé vs moitié du corps réellement travaillée
                const aBas = muscles.some((m) => BAS.has(m));
                const aHaut = muscles.some((m) => !BAS.has(m) && m !== 'Abdominaux');
                const lab = String(s.day_label || '').toLowerCase();
                const ditBas = /bas du corps|jambes|quadriceps|postérieure/.test(lab);
                const ditHaut = /haut du corps|poussée|tirage|pectoraux|dos/.test(lab);
                if ((ditBas && !aBas) || (ditHaut && !aHaut)) {
                  libellesFaux.push({ cle, label: s.day_label, muscles });
                }

                // 4) Type de séance vs objectif (un seul objectif ici → doit coller)
                if (s.type && s.type !== type) typesFaux.push({ cle, label: s.day_label, annonce: s.type, attendu: type });

                // 5) Exercices en double dans la même séance
                const noms = s.exercises.map((x) => x.name);
                const vus = new Set(); const dbl = new Set();
                for (const nm of noms) { if (vus.has(nm)) dbl.add(nm); vus.add(nm); }
                if (dbl.size) doublons.push({ cle, label: s.day_label, noms: [...dbl] });
              }
            }
          }
        }
      }
    }
  }
}

const bloc = (titre, liste, format) => {
  console.log(`\n${liste.length ? '✗' : '✓'} ${titre} : ${liste.length}`);
  for (const e of liste.slice(0, 6)) console.log(`      ${format(e)}`);
  if (liste.length > 6) console.log(`      … et ${liste.length - 6} autres`);
};

console.log(`\n██ COHÉRENCE DE LA CRÉATION DE PROGRAMME ██\n`);
console.log(`  profils testés : ${profils}   ·   séances analysées : ${seances}`);

bloc('1. Durée annoncée ≠ modèle partagé (écart > 5 min)', ecarts,
  (e) => `${e.cle} · « ${e.label} » : annoncé ${e.annonce} min, calculé ${e.reelle} min (écart ${e.ecart})`);
bloc('2. active_zones ≠ muscles présents', zonesFausses,
  (e) => `${e.cle} · « ${e.label} » : manquants [${e.manquants.join(', ')}] · en trop [${e.enTrop.join(', ')}]`);
bloc('3. Libellé du jour ≠ muscles travaillés', libellesFaux,
  (e) => `${e.cle} · « ${e.label} » : ${e.muscles.join(', ')}`);
bloc('4. Type de séance ≠ type de l’objectif', typesFaux,
  (e) => `${e.cle} · « ${e.label} » : annoncé ${e.annonce}, attendu ${e.attendu}`);
bloc('5. Même exercice deux fois dans une séance', doublons,
  (e) => `${e.cle} · « ${e.label} » : ${e.noms.join(', ')}`);

const total = ecarts.length + zonesFausses.length + libellesFaux.length + typesFaux.length + doublons.length;
console.log(total === 0 ? '\n✓ aucune incohérence\n' : `\n✗ ${total} incohérence(s)\n`);
