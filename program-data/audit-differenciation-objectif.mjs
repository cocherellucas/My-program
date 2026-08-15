// AUDIT — le moteur différencie-t-il ENDURANCE / HYPERTROPHIE / FORCE ?
//
// Les trois objectifs n'ont pas la même fenêtre de récupération (SRA_WINDOWS :
// 24 h / 48 h / 72 h). Sur jours collés, les passes de structure ne devraient donc
// PAS se déclencher en endurance — 24 h suffisent. On compare, pour chaque type,
// un programme sur jours collés au même programme sur jours espacés.
//
// Mesuré le 2026-08-15 (36 configurations par type) :
//                          avant   après
//    endurance  remaniée     15       0   ← corrigé
//    endurance  volume perdu  2       0   ← corrigé
//    hypertrophie remaniée   23      23   inchangé (48 h : 24 h d'écart ne suffit pas)
//    force        remaniée   20      20   inchangé
//
// La cause : les passes lisaient `session.type`, l'étiquette du programme du
// CATALOGUE, alors que la spécialisation avait changé l'objectif. Un « Full Body
// — Hypertrophie » spécialisé en endurance était traité comme de l'hypertrophie.
// Elles lisent désormais le type d'objectif DU MUSCLE (`fenetreStructure`).
import { buildActivationResult } from '../src/lib/program-activation.js';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const ESPACES = ['monday', 'wednesday', 'friday', 'sunday', 'tuesday'];
const GYM = [...new Set(EXERCISES.flatMap((e) => (e.equipmentOptions || []).flat()))];

const volume = (sessions) => {
  const m = {};
  for (const s of sessions) for (const x of s.exercises) m[x.muscle_group] = (m[x.muscle_group] || 0) + (x.sets || 0);
  return m;
};

for (const type of ['endurance', 'hypertrophy', 'strength']) {
  let testes = 0; let structureChangee = 0; let volumePerdu = 0; const exemples = [];
  for (const level of ['beginner', 'intermediate', 'advanced']) {
    for (const zone of ['full_body', 'upper_body', 'lower_body']) {
      for (let n = 2; n <= 5; n++) {
        const base = { level, training_context: 'full_gym', equipment: GYM, availability_optimal: false, frequency_max: n };
        const faire = async (jours) => buildActivationResult(
          { ...base, available_days: jours, duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])) },
          [{ type, zone, priority: 'primary' }],
        );
        let colle; let espace;
        try {
          colle = await faire(ORDRE.slice(0, n));
          espace = await faire(ESPACES.slice(0, n));
        } catch { continue; }
        if (!colle || !espace) continue;
        const sc = colle.sessions.filter((s) => s.week === 1);
        const se = espace.sessions.filter((s) => s.week === 1);
        if (!sc.length || !se.length) continue;
        testes++;

        const labelsC = sc.map((s) => s.day_label).join(' | ');
        const labelsE = se.map((s) => s.day_label).join(' | ');
        if (labelsC !== labelsE) structureChangee++;

        const vc = volume(sc); const ve = volume(se);
        const perdus = Object.keys(ve).filter((m) => (vc[m] || 0) < ve[m]);
        if (perdus.length) {
          volumePerdu++;
          if (exemples.length < 4) {
            exemples.push(`      ${level}/${zone}/${n}j — ${perdus.map((m) => `${m} ${ve[m]}→${vc[m] || 0}`).join(', ')}`);
          }
        }
      }
    }
  }
  console.log(`\n══ ${type.toUpperCase()} — ${testes} configurations (jours collés vs jours espacés)`);
  console.log(`   structure remaniee   : ${structureChangee}`);
  console.log(`   volume en BAISSE     : ${volumePerdu}`);
  exemples.forEach((e) => console.log(e));
}
