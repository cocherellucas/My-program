// ─────────────────────────────────────────────────────────────────────────────
// ACTIVATION DES PROGRAMMES PRÉ-GÉNÉRÉS
// Plus de génération IA en runtime : on sélectionne un programme pré-généré
// (pre-generated-programs.js) en fonction du profil (niveau, contexte
// d'entraînement, disponibilités, objectifs), puis on le déplie en séances.
//
// La correspondance des objectifs est ENSEMBLISTE (l'ordre de sélection et
// l'ordre des muscles/mouvements n'importent pas) — on parse la signature
// stockée ET les objectifs de l'utilisateur en un même jeu de jetons canoniques.
// ─────────────────────────────────────────────────────────────────────────────

import { PRE_GENERATED_PROGRAMS } from './pre-generated-programs';

// Normalise en liste : tableau, OU chaîne "a, b, c" (format stocké en base pour
// focus_group / focus_movement), OU vide. Le split gère les deux formes.
const toList = (v) =>
  Array.isArray(v)
    ? v.map((x) => String(x).trim()).filter(Boolean)
    : typeof v === 'string'
      ? v.split(',').map((x) => x.trim()).filter(Boolean)
      : v
        ? [v]
        : [];

// Un objectif utilisateur → jeton canonique "type|kind|values(triés)|priority"
function objectiveToken(o) {
  const type = o.type || '';
  const priority = o.priority || 'primary';
  const movs = toList(o.focus_movement);
  if (movs.length) return `${type}|movement|${[...movs].sort().join(',')}|${priority}`;
  if (o.zone === 'specific_group') {
    const grp = toList(o.focus_group);
    return `${type}|group|${[...grp].sort().join(',')}|${priority}`;
  }
  return `${type}|zone|${o.zone || ''}|${priority}`;
}

// Signature stockée ("hypertrophy:full_body:primary+strength:lower_body:secondary")
// → même jeu de jetons canoniques.
function signatureToTokens(sig) {
  return (sig || '')
    .split('+')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^([a-z_]+):(.+):(primary|secondary)$/i);
      if (!m) return part; // non parsable → brut (ne matchera pas, tant mieux)
      const [, type, middle, priority] = m;
      const bracket = (str) =>
        str
          .slice(str.indexOf('[') + 1, str.lastIndexOf(']'))
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean);
      if (/^specific_group\[/i.test(middle)) {
        return `${type}|group|${bracket(middle).sort().join(',')}|${priority}`;
      }
      if (/^movements\[/i.test(middle)) {
        return `${type}|movement|${bracket(middle).sort().join(',')}|${priority}`;
      }
      return `${type}|zone|${middle.trim()}|${priority}`;
    });
}

function sameTokenSet(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((t, i) => t === sb[i]);
}

export function objectivesMatchSignature(objectives, signature) {
  return sameTokenSet((objectives || []).map(objectiveToken), signatureToTokens(signature));
}

function userTrainingContext(user) {
  return user?.training_context || 'custom';
}

// Mappe le contexte de l'utilisateur vers un TIER généré. Le catalogue n'existe
// qu'en full_gym (référence) et bodyweight ; home_barbell/custom retombent sur
// full_gym (le matériel exact sera géré par la substitution, à part).
function mapContextToTier(ctx) {
  return ctx === 'bodyweight' ? 'bodyweight' : 'full_gym';
}

// Programme pré-généré correspondant au profil (ou null).
// match = { level, training_context, objectives_signature, weekly_frequency,
//           recommended_for_optimal }. On sélectionne le niveau + tier +
//           objectifs, puis la fréquence (recommandée si dispo optimales, sinon
//           la fréquence demandée — ou la plus proche).
export function findMatchingProgram(user, objectives) {
  if (!user || !objectives?.length) return null;
  const level = user.level;
  const tier = mapContextToTier(userTrainingContext(user));

  const candidates = PRE_GENERATED_PROGRAMS.filter(
    (p) =>
      p.match.level === level &&
      p.match.training_context === tier &&
      objectivesMatchSignature(objectives, p.match.objectives_signature)
  );
  if (!candidates.length) return null;

  // Disponibilités optimales → la fréquence recommandée par défaut.
  if (user.availability_optimal === true) {
    return candidates.find((p) => p.match.recommended_for_optimal) || candidates[0];
  }
  // Sinon → la fréquence demandée (frequency_max), ou la plus proche.
  const wanted = Number(user.frequency_max) || null;
  if (wanted) {
    const exact = candidates.find((p) => p.match.weekly_frequency === wanted);
    if (exact) return exact;
    return candidates
      .slice()
      .sort((a, b) => Math.abs(a.match.weekly_frequency - wanted) - Math.abs(b.match.weekly_frequency - wanted))[0];
  }
  return candidates.find((p) => p.match.recommended_for_optimal) || candidates[0];
}

// ── Attribution des jours de la semaine ──────────────────────────────────────
const DAY_SPREAD = {
  1: ['monday'],
  2: ['monday', 'thursday'],
  3: ['monday', 'wednesday', 'friday'],
  4: ['monday', 'tuesday', 'thursday', 'friday'],
  5: ['monday', 'tuesday', 'wednesday', 'friday', 'saturday'],
  6: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  7: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
};
const DAY_NORM = {
  lundi: 'monday', mardi: 'tuesday', mercredi: 'wednesday', jeudi: 'thursday',
  vendredi: 'friday', samedi: 'saturday', dimanche: 'sunday',
  monday: 'monday', tuesday: 'tuesday', wednesday: 'wednesday', thursday: 'thursday',
  friday: 'friday', saturday: 'saturday', sunday: 'sunday',
};
function pickDays(user, frequency) {
  const provided = (user?.available_days || [])
    .map((d) => DAY_NORM[String(d).toLowerCase()])
    .filter(Boolean);
  if (provided.length >= frequency) return provided.slice(0, frequency);
  return DAY_SPREAD[frequency] || DAY_SPREAD[Math.min(7, Math.max(1, frequency))] || DAY_SPREAD[3];
}

// Split Claude → weekly_structure app (valeurs autorisées par Program.jsx)
const SPLIT_MAP = {
  full_body: 'full_body',
  upper_lower: 'upper_lower',
  legs_upper: 'upper_lower',
  ppl: 'ppl',
  push_pull_legs: 'ppl',
  ul_ppl: 'ul_ppl',
  ppl_upper_lower: 'ul_ppl',
  push: 'custom',
  powerbuilding: 'custom',
  movements: 'custom',
};
const mapStructure = (split) => SPLIT_MAP[split] || 'custom';

// Construit l'objet "result" attendu par generateProgram (même forme que
// l'ancienne sortie IA) : { weekly_structure, planned_weeks,
// multi_objective_mode, sessions:[{ week, day, day_label, type,
// estimated_duration, active_zones, exercises }] }. Retourne null si aucun
// programme ne correspond.
// Programme en BOUCLE par défaut : pas de durée définie. planned_weeks >= 52
// marque le programme comme « infini » côté app (cycle hebdomadaire) ; l'app
// étend les semaines à la volée (ensureInfiniteSessions) et la progression est
// pilotée par l'autorégulation (phase, deloads, double progression).
const INFINITE_WEEKS = 52;

export function buildActivationResult(user, objectives) {
  const match = findMatchingProgram(user, objectives);
  if (!match) return null;
  const p = match.program;
  const days = pickDays(user, p.weekly_frequency);

  // Buffer initial de séances (= durée conseillée du programme) ; le top-up
  // automatique de l'app prolonge ensuite le cycle indéfiniment.
  const initialWeeks = Math.max(1, p.planned_weeks || 4);
  const sessions = [];
  for (let w = 1; w <= initialWeeks; w++) {
    p.sessions.forEach((s, i) => {
      sessions.push({
        week: w,
        day: days[i % days.length],
        day_label: s.day_label,
        type: s.type,
        estimated_duration: s.estimated_duration,
        active_zones: s.active_zones,
        exercises: s.exercises,
      });
    });
  }
  return {
    weekly_structure: mapStructure(p.split),
    planned_weeks: INFINITE_WEEKS, // → programme en boucle (durée non définie)
    // Métadonnée uniquement (la gestion multi-objectifs est déjà bakée dans le
    // programme). 'simple' passe toujours la contrainte SQL programs_*_check.
    multi_objective_mode: 'simple',
    sessions,
    matched_program_name: p.name,
  };
}
