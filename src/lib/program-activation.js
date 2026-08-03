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

// Le catalogue (170 programmes, ~2,4 Mo) est chargé À LA DEMANDE, pas au
// démarrage : il n'est utile qu'au moment où l'on génère un programme. Sans ça,
// tout le monde téléchargeait et analysait ces 2,4 Mo à chaque ouverture de
// l'app, y compris pour aller voir une séance. Le module est mis en cache par le
// navigateur après le premier appel ; les appels concurrents partagent la même
// promesse (pas de double téléchargement).
let catalogCache = null;
let catalogLoading = null;
async function loadCatalog() {
  if (catalogCache) return catalogCache;
  if (!catalogLoading) {
    catalogLoading = import('./pre-generated-programs').then((m) => {
      catalogCache = m.PRE_GENERATED_PROGRAMS;
      return catalogCache;
    });
  }
  return catalogLoading;
}
import { EXERCISES } from './exercise-database';
// Tables de référence du projet — on ne réinvente PAS ces chiffres ici :
// TRAINING_PARAMS = séries/reps/repos par type d'objectif et par phase ;
// SRA_WINDOWS = heures de récupération mini entre deux stimuli d'un même muscle.
import { TRAINING_PARAMS, SRA_WINDOWS } from './coaching-engine';

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

// Choisit, parmi des candidats de même niveau/tier/objectifs, la variante de
// FRÉQUENCE : la recommandée si dispo optimales, sinon celle demandée
// (frequency_max) ou la plus proche.
function chooseByFrequency(candidates, user) {
  if (user.availability_optimal === true) {
    return candidates.find((p) => p.match.recommended_for_optimal) || candidates[0];
  }
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

// Programme pré-généré correspondant au profil (ou null).
// match = { level, training_context, objectives_signature, weekly_frequency,
//           recommended_for_optimal }. On sélectionne le niveau + tier +
//           objectifs, puis la fréquence (recommandée si dispo optimales, sinon
//           la fréquence demandée — ou la plus proche).
export async function findMatchingProgram(user, objectives) {
  if (!user || !objectives?.length) return null;
  const catalog = await loadCatalog();
  const level = user.level;
  const tier = mapContextToTier(userTrainingContext(user));

  const candidates = catalog.filter(
    (p) =>
      p.match.level === level &&
      p.match.training_context === tier &&
      objectivesMatchSignature(objectives, p.match.objectives_signature)
  );
  if (!candidates.length) return null;
  return chooseByFrequency(candidates, user);
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
const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Choisit `frequency` jours parmi les jours disponibles en maximisant l'écart
// MINIMUM entre deux séances — calculé en CIRCULAIRE, car la semaine se répète :
// lundi + dimanche paraissent éloignés dans la semaine mais ne le sont pas au
// bouclage (1 jour), alors que lundi + jeudi le sont vraiment (3 et 4 jours).
// Sert la règle SRA du brief (48 h mini entre 2 séances du même muscle).
function spreadPick(availableDays, frequency) {
  const idx = availableDays.map((d) => DAY_ORDER.indexOf(d)).filter((i) => i >= 0).sort((a, b) => a - b);
  if (frequency >= idx.length) return idx;
  const combo = [];
  let best = null;
  let bestScore = -1;
  const walk = (start) => {
    if (combo.length === frequency) {
      let min = Infinity;
      for (let i = 0; i < combo.length; i++) {
        const a = combo[i];
        const b = combo[(i + 1) % combo.length];
        const gap = i === combo.length - 1 ? 7 - a + b : b - a; // dernier → premier = bouclage
        if (gap < min) min = gap;
      }
      if (min > bestScore) { bestScore = min; best = [...combo]; }
      return;
    }
    for (let i = start; i < idx.length; i++) { combo.push(idx[i]); walk(i + 1); combo.pop(); }
  };
  walk(0);
  return best || idx.slice(0, frequency);
}

// Écart MINIMUM (en jours) entre des séances placées sur ces index de jours, en
// circulaire. Sert à vérifier la règle SRA (48 h mini) avant de choisir une fréquence.
function minCircularGap(dayIdx) {
  const i = [...new Set(dayIdx)].sort((a, b) => a - b);
  if (i.length < 2) return 7;
  let min = Infinity;
  for (let k = 0; k < i.length; k++) {
    const gap = k === i.length - 1 ? 7 - i[k] + i[0] : i[k + 1] - i[k];
    if (gap < min) min = gap;
  }
  return min;
}

const normalizedAvailableDays = (user) =>
  (user?.available_days || []).map((d) => DAY_NORM[String(d).toLowerCase()]).filter(Boolean);

function pickDays(user, frequency) {
  const provided = normalizedAvailableDays(user);
  if (provided.length >= frequency) return spreadPick(provided, frequency).map((i) => DAY_ORDER[i]);
  // MOINS de jours disponibles que de séances (ex. le catalogue intermédiaire
  // démarre à 3 j alors que l'utilisateur n'en a que 2). On rend quand même SES
  // jours : le nombre de séances sera réduit d'autant côté appelant. Retomber sur
  // une répartition théorique placerait les séances des jours où il ne peut PAS
  // s'entraîner (un utilisateur dispo le week-end recevait du lundi/mercredi/vendredi).
  if (provided.length) return provided;
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

// ─────────────────────────────────────────────────────────────────────────────
// SPÉCIALISATION — objectifs "specific_group" (muscles précis)
// Le catalogue n'a que des cibles LARGES (impossible de pré-générer 2^10 sous-
// ensembles de muscles). Quand l'utilisateur cible des muscles précis, on DÉRIVE
// un programme : on part de la cible large la plus proche, on RÉALLOUE le volume
// vers les muscles ciblés (↑ vers le MRV) en retirant les muscles non ciblés
// puis on remet les muscles focus EN TÊTE de séance (à froid). Chemin de repli
// only : les objectifs à cible large gardent le comportement d'origine.
// ─────────────────────────────────────────────────────────────────────────────
const MUSCLE_ZONE = {
  Pectoraux: 'upper', Dos: 'upper', 'Épaules': 'upper', Biceps: 'upper', Triceps: 'upper', Abdominaux: 'upper',
  Quadriceps: 'lower', 'Ischio-jambiers': 'lower', Fessiers: 'lower', Mollets: 'lower',
};

// Séries hebdo DIRECTES par muscle, par niveau (repères MEV < MAV < MRV).
const VOLUME_BANDS = {
  // mav = l'optimum (conforme aux fourchettes du brief §4) ; mrv = le plafond,
  // atteint uniquement par un muscle en objectif PRIMAIRE lors d'une
  // spécialisation. Pas de MEV ici : il ne sert plus (le secondaire vise le MAV,
  // et les muscles non ciblés sont retirés — brief §4bis).
  beginner: { mav: 12, mrv: 14 },
  intermediate: { mav: 16, mrv: 20 },
  advanced: { mav: 20, mrv: 24 },
};

const hasSpecificGroup = (objectives) =>
  (objectives || []).some((o) => o.zone === 'specific_group' && toList(o.focus_group).length);

// Muscles ciblés extraits des objectifs specific_group (primaire l'emporte).
function focusMusclesFromObjectives(objectives) {
  const primary = new Set();
  const secondary = new Set();
  for (const o of objectives || []) {
    if (o.zone !== 'specific_group') continue;
    const bucket = o.priority === 'secondary' ? secondary : primary;
    toList(o.focus_group).forEach((m) => bucket.add(m));
  }
  secondary.forEach((m) => { if (primary.has(m)) secondary.delete(m); });
  return { primary, secondary };
}

// Type de l'objectif specific_group primaire (défaut hypertrophie).
function primarySpecificType(objectives) {
  const list = objectives || [];
  const o = list.find((x) => x.zone === 'specific_group' && x.priority !== 'secondary')
    || list.find((x) => x.zone === 'specific_group');
  return o?.type || 'hypertrophy';
}

// Zone large qui COUVRE les muscles ciblés → sert à choisir le programme de base.
function coverZoneForMuscles(muscles) {
  const zones = new Set([...muscles].map((m) => MUSCLE_ZONE[m]).filter(Boolean));
  if (zones.size === 1) return zones.has('upper') ? 'upper_body' : 'lower_body';
  return 'full_body';
}

// Nombre de jours réellement disponibles pour s'entraîner.
function availableDayCount(user) {
  if (user?.availability_optimal === true) return 7;
  const days = (user?.available_days || []).length;
  return days || Number(user?.frequency_max) || 7;
}

// ── Objectifs de FORCE sur des mouvements précis ─────────────────────────────
// Le catalogue ne contient qu'UNE signature de force : les trois lifts ensemble
// (Squat + Développé + Soulevé). Or l'interface laisse choisir n'importe quelle
// combinaison parmi quatre mouvements — soit 15 possibilités, dont 14 tombaient
// dans le vide (« aucun programme ne correspond »). Les pré-générer toutes
// ferait exploser le catalogue : c'est au CODE de dériver, comme pour la
// spécialisation par muscles.
const MOVEMENT_TO_EXERCISE = {
  'Squat barre': 'Squat barre',
  'Développé couché': 'Développé couché barre',
  'Soulevé de terre': 'Soulevé de terre',
  'Traction lestée': 'Traction pronation',
};

const movementsOf = (objectives) => {
  const set = new Set();
  for (const o of objectives || []) toList(o.focus_movement).forEach((m) => set.add(m));
  return set;
};

// Familles de mouvement : quels exercices du catalogue « appartiennent » à quel
// lift. Motifs relevés sur les noms réellement utilisés par les programmes de
// force (Squat barre / Front squat · Développé couché / incliné · Soulevé de
// terre / roumain / rack pull · Traction pronation / supination). Le développé
// MILITAIRE n'appartient à aucune famille : c'est un accessoire, il reste.
// Profils d'une journée de force, RELEVÉS dans le catalogue (pas inventés) : un
// même lift s'y travaille lourd une fois et en volume une autre — c'est
// l'ondulation d'intensité qui fait progresser en force. Les cues font partie de
// la prescription au même titre que les séries.
const STRENGTH_HEAVY = { sets: 4, target_reps: '3-5', rest_seconds: 210, notes: 'Charge lourde, récupération complète entre séries.' };
const STRENGTH_VOLUME = { sets: 4, target_reps: '6-8', rest_seconds: 150, notes: 'Jour volume : charge modérée, exécution stricte.' };

const MOVEMENT_FAMILY = {
  'Squat barre': /squat/i,
  'Développé couché': /développé (couché|incliné)/i,
  'Soulevé de terre': /soulevé de terre|rack pull/i,
  'Traction lestée': /traction/i,
};

// Filtrer par MUSCLE serait faux ici : le soulevé sollicite les quadriceps, donc
// « soulevé seul » aurait gardé tout le squat. L'unité d'un objectif de force est
// le MOUVEMENT. On garde donc un exercice s'il appartient à un mouvement choisi,
// ou s'il n'appartient à aucune famille (accessoire) ; on ne retire que ce qui
// relève exclusivement d'un mouvement NON choisi.
function specializeMovements(program, selected, user) {
  const dropped = Object.keys(MOVEMENT_FAMILY).filter((mv) => !selected.has(mv));
  const belongsToDropped = (name) =>
    dropped.some((mv) => MOVEMENT_FAMILY[mv].test(name))
    && ![...selected].some((mv) => MOVEMENT_FAMILY[mv]?.test(name));

  // On garde TOUTES les séances à ce stade : une journée dont le lift a disparu
  // peut encore accueillir un mouvement choisi (sinon un objectif « traction »
  // seule ne récupérait qu'une séance, faute de place).
  // Muscles réellement concernés par les mouvements choisis : sert à écarter les
  // accessoires hérités du programme complet qui n'ont plus de rapport (un
  // objectif « traction » n'a que faire d'une leg press). Les abdos restent
  // toujours : le gainage soutient tous les lifts lourds.
  const musclesCibles = new Set(['Abdominaux']);
  for (const mv of selected) {
    const e = EXERCISES.find((x) => x.name === (MOVEMENT_TO_EXERCISE[mv] || mv));
    if (!e) continue;
    [...(e.muscles?.primary || []), ...(e.muscles?.secondary || [])].forEach((m) => musclesCibles.add(appMuscle(m)));
  }
  const estFamille = (name) => Object.values(MOVEMENT_FAMILY).some((re) => re.test(name));

  let sessions = program.sessions.map((s) => ({
    ...s,
    exercises: s.exercises.filter((x) => {
      if (belongsToDropped(x.name)) return false;
      if (estFamille(x.name)) return true;              // lift choisi → gardé
      return musclesCibles.has(x.muscle_group);         // accessoire → seulement s'il sert
    }),
  }));

  // Le brief impose ~2 séances par lift : on pose chaque mouvement choisi dans les
  // séances les plus légères tant qu'il n'y est pas deux fois.
  const isFamily = (name) => [...selected].some((mv) => MOVEMENT_FAMILY[mv]?.test(name));
  const estLourd = (x) => /^[1-5]\s*-\s*[1-5]$/.test(String(x.target_reps).trim());
  for (const mv of selected) {
    const exName = MOVEMENT_TO_EXERCISE[mv] || mv;
    const e = EXERCISES.find((x) => x.name === exName);
    if (!e) continue;
    const famille = MOVEMENT_FAMILY[mv];
    const occurrences = () => sessions.filter((s) => s.exercises.some((x) => famille?.test(x.name)));
    const ordre = sessions
      .map((s, i) => ({ i, charge: s.exercises.reduce((n, x) => n + (x.sets || 0), 0) }))
      .sort((a, b) => a.charge - b.charge);
    for (const { i } of ordre) {
      const actuelles = occurrences();
      if (actuelles.length >= 2) break;
      if (sessions[i].exercises.some((x) => famille?.test(x.name))) continue;
      // La séance manquante COMPLÈTE l'existante : si le lift a déjà son jour
      // lourd, on ajoute le jour VOLUME (et inversement). Deux jours lourds du
      // même lift dans la semaine seraient irrécupérables. Valeurs et cues repris
      // tels quels du catalogue, pas inventés.
      const dejaLourd = actuelles.some((s) => s.exercises.some((x) => famille?.test(x.name) && estLourd(x)));
      const profil = dejaLourd ? STRENGTH_VOLUME : STRENGTH_HEAVY;
      const ex = makeExercise(e, appMuscle(e.muscles?.primary?.[0] || 'Dos'), profil.sets);
      sessions[i] = { ...sessions[i], exercises: [{ ...ex, block: 'A', ...profil }, ...sessions[i].exercises] };
    }
  }

  // Une séance sans aucun mouvement choisi ne sert plus l'objectif → on la retire.
  sessions = sessions.filter((s) => s.exercises.some((x) => isFamily(x.name)));

  // Réordonnancement : deux séances du MÊME lift ne doivent pas se suivre (les
  // jours sont attribués dans l'ordre des séances). On alterne les mouvements, et
  // le jour LOURD passe avant le jour volume — on attaque le lourd plus frais.
  const leadOf = (s) => {
    const x = s.exercises.find((e) => e.block === 'A' && isFamily(e.name)) || s.exercises.find((e) => isFamily(e.name));
    if (!x) return '';
    return Object.keys(MOVEMENT_FAMILY).find((mv) => MOVEMENT_FAMILY[mv].test(x.name)) || x.name;
  };
  const reste = sessions
    .slice()
    .sort((a, b) => {
      const la = a.exercises.find((x) => x.block === 'A' && isFamily(x.name));
      const lb = b.exercises.find((x) => x.block === 'A' && isFamily(x.name));
      return (la && estLourd(la) ? 0 : 1) - (lb && estLourd(lb) ? 0 : 1); // lourd d'abord
    });
  const ordonnees = [];
  while (reste.length) {
    const precedent = ordonnees.length ? leadOf(ordonnees[ordonnees.length - 1]) : null;
    const i = reste.findIndex((s) => leadOf(s) !== precedent);
    ordonnees.push(reste.splice(i >= 0 ? i : 0, 1)[0]);
  }
  sessions = ordonnees;

  // Libellés REGÉNÉRÉS depuis le lift réellement en tête : ceux d'origine nomment
  // le lift du programme complet et deviennent faux après filtrage (« Jour
  // Développé couché » sans aucun développé couché).
  sessions = sessions.map((s) => {
    const lead = s.exercises.find((x) => x.block === 'A' && isFamily(x.name)) || s.exercises.find((x) => isFamily(x.name));
    if (!lead) return s;
    // On conserve la mention (lourd)/(volume) : elle dit à l'utilisateur quelle
    // séance il attaque, ce qui est le cœur d'un programme de force.
    return { ...s, day_label: `Jour ${lead.name} (${estLourd(lead) ? 'lourd' : 'volume'})` };
  });

  // active_zones + durée re-dérivées.
  sessions = sessions.map((s, idx) => {
    const seen = new Set();
    const active_zones = [];
    for (const x of s.exercises) {
      if (!seen.has(x.muscle_group)) { seen.add(x.muscle_group); active_zones.push({ muscle_group: x.muscle_group }); }
    }
    const orig = program.sessions[idx] || s;
    const oldSets = (orig.exercises || []).reduce((n, x) => n + (x.sets || 0), 0);
    const newSets = s.exercises.reduce((n, x) => n + (x.sets || 0), 0);
    const estimated_duration = oldSets > 0
      ? Math.max(20, Math.round((orig.estimated_duration || 60) * (newSets / oldSets)))
      : s.estimated_duration;
    return { ...s, active_zones, estimated_duration };
  });

  return {
    ...program,
    name: `Force — ${[...selected].join(' / ')}`,
    weekly_frequency: sessions.length || program.weekly_frequency,
    sessions,
  };
}

// Programme de force du catalogue le plus proche (les 3 lifts), pour le niveau et
// le tier de l'utilisateur — on en retirera ensuite les mouvements non choisis.
function pickStrengthBase(catalog, user, movements) {
  const tier = mapContextToTier(userTrainingContext(user));
  const cands = catalog.filter(
    (p) => p.match.level === user.level
      && p.match.training_context === tier
      && /^strength:movements\[[^\]]*\]:primary$/.test(p.match.objectives_signature)
  );
  // On vise ~1 séance par mouvement choisi (min 2), dans la limite des jours dispo.
  const maxDays = availableDayCount(user);
  const ideal = Math.min(Math.max(2, movements.size), maxDays);
  return cands.slice().sort((a, b) =>
    Math.abs(a.match.weekly_frequency - ideal) - Math.abs(b.match.weekly_frequency - ideal))[0] || null;
}

// Nombre de séances d'un programme qui travaillent au moins un muscle ciblé.
const focusSessionCount = (program, focusMuscles) =>
  program.sessions.filter((s) => s.exercises.some((x) => focusMuscles.has(x.muscle_group))).length;

// Parmi les variantes de fréquence, choisit celle qui donne la MEILLEURE fréquence
// pour les muscles ciblés — et non celle qui remplit le plus de jours. Une cible
// étroite se travaille idéalement ~3×/sem (ça RÉPARTIT la fatigue au lieu d'empiler
// 20 séries en une séance) ; au-delà de 2 muscles, 2×/sem suffit. On ne dépasse
// jamais le nombre de jours dont l'utilisateur dispose.
function chooseBaseForFocus(candidates, user, focusMuscles) {
  const maxDays = availableDayCount(user);
  const ideal = Math.min(focusMuscles.size <= 2 ? 3 : 2, maxDays);
  const days = normalizedAvailableDays(user);
  let best = null;
  let bestScore = Infinity;
  for (const c of candidates) {
    const n = focusSessionCount(c.program, focusMuscles);
    if (!n) continue;
    // Espacement réellement atteignable avec les jours de l'utilisateur : une
    // fréquence plus élevée ne vaut rien si elle colle deux séances (SRA : 48 h
    // mini entre 2 séances d'hypertrophie d'un même muscle). Mieux vaut 2 séances
    // bien espacées que 3 dont deux collées.
    const gap = days.length ? minCircularGap(spreadPick(days, n)) : 7;
    const score = (n > maxDays ? 100 : 0) + (n > 1 && gap < 2 ? 20 : 0) + Math.abs(n - ideal);
    if (score < bestScore) { bestScore = score; best = c; }
  }
  return best || chooseByFrequency(candidates, user);
}

// Programme de base = cible large la plus proche (type demandé, sinon hypertrophie ;
// zone couvrante, sinon full_body), en privilégiant la variante qui donne la bonne
// fréquence aux muscles ciblés.
function pickBaseProgram(catalog, user, type, zone, focusMuscles) {
  const level = user.level;
  const tier = mapContextToTier(userTrainingContext(user));
  const types = type === 'hypertrophy' ? ['hypertrophy'] : [type, 'hypertrophy'];
  const zones = zone === 'full_body' ? ['full_body'] : [zone, 'full_body'];
  for (const ty of types) {
    for (const zo of zones) {
      const sig = `${ty}:${zo}:primary`;
      const cands = catalog.filter(
        (p) => p.match.level === level && p.match.training_context === tier && p.match.objectives_signature === sig
      );
      if (cands.length) return chooseBaseForFocus(cands, user, focusMuscles);
    }
  }
  return null;
}

// Le muscle_group du catalogue/objectifs ('Pectoraux', 'Abdominaux') diffère du
// nom dans la base d'exos ('Poitrine', 'Abdos'). Tables de conversion.
const DB_MUSCLE = { Pectoraux: 'Poitrine', Abdominaux: 'Abdos' };
const APP_MUSCLE = { Poitrine: 'Pectoraux', Abdos: 'Abdominaux' };
const appMuscle = (m) => APP_MUSCLE[m] || m;
const REPS_BY_BLOCK = { A: '6-8', B: '8-12', C: '10-15' };
const REST_BY_BLOCK = { A: 150, B: 105, C: 75 };

// Fabrique un exercice de programme à partir d'une entrée de la base d'exos,
// étiqueté sur le muscle FOCUS (les autres muscles → secondaires). Sert à
// compléter un muscle focus plafonné (ex. chin-up pour biceps, DC serré triceps).
function makeExercise(e, focusMuscle, sets) {
  const block = e.block || 'C';
  const others = [
    ...(e.muscles?.primary || []).map(appMuscle).filter((p) => p !== focusMuscle),
    ...(e.muscles?.secondary || []).map(appMuscle),
  ];
  return {
    name: e.name,
    muscle_group: focusMuscle,
    muscles_secondary: [...new Set(others)],
    block,
    sets,
    target_reps: REPS_BY_BLOCK[block] || '8-12',
    rest_seconds: REST_BY_BLOCK[block] || 90,
  };
}

// Applique la spécialisation à UN programme (clone, ne mute pas l'original) :
// (1) réallocation du volume par muscle, (2) complément des muscles focus
// plafonnés via la base d'exos (matériel+niveau OK, compounds à haute tension
// d'abord), (3) réordonnancement muscles focus en tête de chaque séance.
function specializeProgram(program, focus, user, objectiveType = 'hypertrophy') {
  const level = user?.level || 'intermediate';
  const bands = VOLUME_BANDS[level] || VOLUME_BANDS.intermediate;
  // Plafond de séries PAR EXERCICE, repris de TRAINING_PARAMS (le primaire vise le
  // MAV : c'est la borne que le catalogue lui-même ne dépasse jamais — 5 séries en
  // hypertrophie, 4 en endurance. Mieux vaut répartir sur deux mouvements.
  const maxSetsPerExercise =
    TRAINING_PARAMS[objectiveType]?.MAV?.sets?.[1] || TRAINING_PARAMS.hypertrophy.MAV.sets[1];
  const { primary, secondary } = focus;
  const isFocus = (m) => primary.has(m) || secondary.has(m);
  const blockRank = { A: 0, B: 1, C: 2 };

  // Équipement de l'utilisateur (même parsing/filtre que SessionLog : un exo est
  // faisable si au moins une option de matériel est entièrement possédée ; les
  // exos au poids du corps ont une option vide → toujours faisables).
  const userEquipment = Array.isArray(user?.equipment)
    ? user.equipment
    : (() => { try { return JSON.parse(user?.equipment || '[]'); } catch { return []; } })();
  const canDo = (e) => !!e.equipmentOptions?.some((opt) => opt.every((item) => userEquipment.includes(item)));

  // Cible de séries hebdo directes par muscle. N'est appelée QUE pour les muscles
  // ciblés : les autres sont retirés (brief §4bis, aucun travail dédié).
  // Primaire → MRV (plafond) ; secondaire → MAV (l'optimum, « au mieux avec ce
  // qu'il reste ») et non MEV : quand la cible primaire est étroite, le budget de
  // récupération est loin d'être épuisé, brider le secondaire ne sert à rien.
  // L'écart primaire↔secondaire exigé par le brief reste garanti par les repères
  // eux-mêmes (MRV > MAV). Si le temps manque, le rognage redescend le secondaire
  // en premier — il n'y a donc rien à plafonner à la main.
  //
  // EXCEPTION FORCE : les repères ci-dessus sont ceux de l'HYPERTROPHIE. Un
  // programme de force est calibré autrement (« plus d'intensité, moins de
  // volume », brief §4 : ~9-12 séries/muscle contre 16-20). Y appliquer le MRV
  // d'hypertrophie doublerait le volume et casserait la programmation. Sur un
  // objectif de force on garde donc le volume tel quel : on se contente de
  // retirer les mouvements non choisis, le budget libéré profite à la récup.
  const targetFor = (m) => {
    if (objectiveType === 'strength') return current[m] || 0;
    return primary.has(m) ? bands.mrv : bands.mav;
  };

  // Volume hebdo direct actuel par muscle (somme des séries sur toutes les séances).
  const current = {};
  for (const s of program.sessions) {
    for (const x of s.exercises) {
      current[x.muscle_group] = (current[x.muscle_group] || 0) + (x.sets || 0);
    }
  }

  // ── PASS 1 : on ne garde QUE les exercices des muscles ciblés, scalés vers leur
  //    cible. Les muscles non ciblés sont IGNORÉS (règle du brief : « non-ciblé =
  //    ignoré, indirect seulement, pas de maintien forcé ») — l'utilisateur veut
  //    son objectif, pas des exercices en plus. ────────────────────────────────
  const built = program.sessions.map((s) => {
    const ranked = s.exercises
      .map((x, i) => ({ x, i }))
      .sort((a, b) => ((blockRank[a.x.block] ?? 3) - (blockRank[b.x.block] ?? 3)) || (a.i - b.i));
    const exercises = [];
    for (const { x } of ranked) {
      if (!isFocus(x.muscle_group)) continue;
      const cur = current[x.muscle_group] || (x.sets || 0);
      const ratio = cur > 0 ? targetFor(x.muscle_group) / cur : 1;
      const sets = Math.max(1, Math.min(maxSetsPerExercise, Math.round((x.sets || 0) * ratio)));
      exercises.push({ ...x, sets });
    }
    return { ...s, exercises };
  });

  // ── PASS 2 : compléter les muscles focus PRIMAIRES qui n'atteignent pas leur
  //    cible. Deux leviers, dans cet ordre :
  //      1. MONTER LES SÉRIES des exercices déjà présents (pas de mouvement en
  //         plus, pas de temps en plus), jusqu'au plafond par exercice du type
  //         d'objectif (TRAINING_PARAMS de coaching-engine, pas un chiffre à moi).
  //      2. AJOUTER un exercice depuis la base (matériel + niveau OK), composés
  //         d'abord pour la tension — MAIS en refusant celui qui solliciterait un
  //         muscle déjà travaillé dans sa fenêtre de récupération (SRA_WINDOWS :
  //         72 h force / 48 h hypertrophie / 24 h endurance). Comme les composés
  //         sont testés en premier, un composé en conflit est écarté et on
  //         retombe naturellement sur du mono-articulaire, qui ne touche presque
  //         rien d'autre. Si rien ne passe, on n'ajoute RIEN (mieux vaut un peu
  //         moins de volume qu'une semaine irrécupérable).

  // Jours réellement attribués aux séances conservées → écarts en heures.
  const keptIdx = built.map((_, i) => i).filter((i) => built[i].exercises.length);
  const plannedDays = pickDays(user, keptIdx.length || 1);
  const dayOfSession = {};
  keptIdx.forEach((sessionIdx, k) => {
    dayOfSession[sessionIdx] = DAY_ORDER.indexOf(plannedDays[k % plannedDays.length]);
  });
  const hoursBetween = (i, j) => {
    const a = dayOfSession[i];
    const b = dayOfSession[j];
    if (a == null || b == null) return 999;
    const d = Math.abs(a - b);
    return Math.min(d, 7 - d) * 24;
  };
  // Muscles qu'un exercice sollicite « assez directement » : ses primaires
  // toujours ; ses secondaires seulement s'il est polyarticulaire (sur une
  // isolation, la charge secondaire est négligeable).
  const loadedBy = (e) => {
    const list = (e.muscles?.primary || []).map(appMuscle);
    if (e.type === 'compound') list.push(...(e.muscles?.secondary || []).map(appMuscle));
    return new Set(list);
  };
  const sessionLoads = (idx) => {
    const set = new Set();
    for (const x of built[idx].exercises) {
      set.add(x.muscle_group);
      for (const sm of x.muscles_secondary || []) set.add(sm);
    }
    return set;
  };

  for (const M of primary) {
    const weeklyOf = (mg) =>
      built.reduce((n, s) => n + s.exercises.filter((x) => x.muscle_group === mg).reduce((a, x) => a + (x.sets || 0), 0), 0);
    let gap = targetFor(M) - weeklyOf(M);
    if (gap <= 2) continue;
    const focusIdx = built.map((_, i) => i).filter((i) => built[i].exercises.some((x) => x.muscle_group === M));
    if (!focusIdx.length) continue;

    // 1) Monter les séries des exercices déjà là.
    for (const i of focusIdx) {
      for (const x of built[i].exercises) {
        if (gap <= 2) break;
        if (x.muscle_group !== M) continue;
        const room = maxSetsPerExercise - (x.sets || 0);
        if (room <= 0) continue;
        const add = Math.min(room, gap);
        x.sets += add;
        gap -= add;
      }
    }
    if (gap <= 2) continue;

    // 2) Ajouter des exercices, en respectant les fenêtres de récupération.
    const used = new Set(built.flatMap((s) => s.exercises.map((x) => String(x.name).toLowerCase())));
    const dbM = DB_MUSCLE[M] || M;
    const pool = EXERCISES
      .filter((e) => e.muscles?.primary?.includes(dbM) && e.level?.includes(level) && canDo(e) && !used.has(e.name.toLowerCase()))
      .sort((a, b) => (a.type === 'compound' ? 0 : 1) - (b.type === 'compound' ? 0 : 1)); // composés d'abord
    let added = 0;
    for (const e of pool) {
      if (gap <= 2 || added >= 2) break; // au plus 2 nouveaux exercices par muscle
      const loads = loadedBy(e);
      // 3 séries : c'est la médiane ET la valeur la plus fréquente du catalogue,
      // pour les polyarticulaires comme pour les isolations (3,25 vs 3,03 de
      // moyenne — l'écart entre les deux est négligeable, mesuré sur 4942 exos).
      const perAdd = 3;
      let placed = false;
      for (const i of focusIdx) {
        if (gap <= 2) break;
        // Conflit de récupération ? On regarde les séances proches dans le temps.
        const win = SRA_WINDOWS[built[i].type] || SRA_WINDOWS.mixed;
        const conflict = keptIdx.some((j) => {
          if (j === i) return false;
          if (hoursBetween(i, j) >= win) return false; // assez loin → aucun souci
          const near = sessionLoads(j);
          // Le muscle ciblé est déjà prévu ce jour-là : c'est voulu, on l'ignore.
          return [...loads].some((m) => m !== M && near.has(m));
        });
        if (conflict) continue; // trop proche d'une autre sollicitation → exercice suivant
        const sets = Math.max(2, Math.min(perAdd, maxSetsPerExercise, gap));
        built[i] = { ...built[i], exercises: [...built[i].exercises, makeExercise(e, M, sets)] };
        gap -= sets;
        placed = true;
      }
      if (placed) added++;
    }
  }

  // ── PASS 3 : réordonnancement (bloc A→B→C = lourd à froid, focus d'abord dans
  //    chaque bloc) + active_zones re-dérivées + durée ré-estimée au prorata.
  const sessions = built.map((s, idx) => {
    const orig = program.sessions[idx];
    const ordered = s.exercises
      .map((x, i) => ({ x, i }))
      .sort((a, b) => {
        const br = (blockRank[a.x.block] ?? 3) - (blockRank[b.x.block] ?? 3);
        if (br !== 0) return br;
        const fr = (isFocus(a.x.muscle_group) ? 0 : 1) - (isFocus(b.x.muscle_group) ? 0 : 1);
        if (fr !== 0) return fr;
        return a.i - b.i;
      })
      .map((o) => o.x);

    const seen = new Set();
    const active_zones = [];
    for (const x of ordered) {
      if (!seen.has(x.muscle_group)) { seen.add(x.muscle_group); active_zones.push({ muscle_group: x.muscle_group }); }
    }

    const oldSets = orig.exercises.reduce((n, x) => n + (x.sets || 0), 0);
    const newSets = ordered.reduce((n, x) => n + (x.sets || 0), 0);
    const estimated_duration = oldSets > 0
      ? Math.max(20, Math.round((orig.estimated_duration || 60) * (newSets / oldSets)))
      : orig.estimated_duration;

    return { ...s, exercises: ordered, active_zones, estimated_duration };
  });

  // Les séances qui ne contenaient que des muscles non ciblés sont désormais
  // vides → on les retire (pas de journée fantôme) et la fréquence suit.
  const kept = sessions.filter((s) => s.exercises.length > 0);

  // Les libellés du programme de base ne décrivent plus la séance une fois les
  // muscles non ciblés retirés (« Haut du corps » pour une séance pecs/triceps).
  // On les regénère depuis les muscles réellement présents, avec un suffixe A/B/…
  // si plusieurs séances portent le même nom.
  const labelOf = (s) => [...new Set(s.exercises.map((x) => x.muscle_group))].join(' · ');
  const totals = {};
  for (const s of kept) { const l = labelOf(s); totals[l] = (totals[l] || 0) + 1; }
  const seenLabel = {};
  const labelled = kept.map((s) => {
    const l = labelOf(s);
    if (totals[l] <= 1) return { ...s, day_label: l };
    seenLabel[l] = (seenLabel[l] || 0) + 1;
    return { ...s, day_label: `${l} ${String.fromCharCode(64 + seenLabel[l])}` };
  });

  const focusList = [...primary];
  return {
    ...program,
    name: focusList.length ? `${program.name} — Spécial ${focusList.join(' / ')}` : program.name,
    weekly_frequency: labelled.length || program.weekly_frequency,
    sessions: labelled,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ADAPTATION À LA DURÉE (rognage) + ROTATION DE PRIORITÉ
// S'appliquent à TOUS les programmes (larges comme spécialisés), après le choix
// du programme et l'attribution des jours.
// ─────────────────────────────────────────────────────────────────────────────
const BLOCK_RANK = { A: 0, B: 1, C: 2 };

// Muscles couverts par une zone large (dérivé de MUSCLE_ZONE, source unique).
const ZONE_MUSCLES = {
  upper_body: Object.keys(MUSCLE_ZONE).filter((m) => MUSCLE_ZONE[m] === 'upper'),
  lower_body: Object.keys(MUSCLE_ZONE).filter((m) => MUSCLE_ZONE[m] === 'lower'),
  full_body: Object.keys(MUSCLE_ZONE),
};

// Index nom → entrée de la base d'exos (résolution par nom, insensible à la casse).
let DB_BY_NAME = null;
function dbExercise(name) {
  if (!DB_BY_NAME) {
    DB_BY_NAME = new Map();
    for (const e of EXERCISES) DB_BY_NAME.set(e.name.toLowerCase(), e);
  }
  return DB_BY_NAME.get(String(name || '').toLowerCase()) || null;
}

// Polyarticulaire ? (base d'exos ; repli sur le bloc A = gros exercice)
const isCompoundEx = (x) => {
  const e = dbExercise(x.name);
  return e ? e.type === 'compound' : x.block === 'A';
};

// Rang de priorité d'un muscle selon les objectifs : 0 = le plus prioritaire,
// plus le rang est grand, moins c'est prioritaire (99 = non ciblé). Sert à
// décider QUOI rogner en premier quand le temps manque.
function muscleObjectiveRank(objectives) {
  const rank = {};
  (objectives || []).forEach((o, i) => {
    const base = (o.priority === 'secondary' ? 10 : 0) + i;
    const muscles = o.zone === 'specific_group' ? toList(o.focus_group) : (ZONE_MUSCLES[o.zone] || []);
    for (const m of muscles) if (rank[m] === undefined || base < rank[m]) rank[m] = base;
  });
  return rank;
}

// Coût en TEMPS d'un exercice ≈ séries × (repos + exécution). Raisonner en temps
// encode automatiquement le nombre de muscles/objectifs ciblés (un full body
// "coûte" cher, un muscle précis "coûte" peu) — pas de règle séparée à écrire.
const EXEC_SECONDS_PER_SET = 45;
const WARMUP_MINUTES = 8;
const exerciseMinutes = (x) => ((x.sets || 0) * ((x.rest_seconds || 90) + EXEC_SECONDS_PER_SET)) / 60;
const sessionMinutes = (exercises) =>
  WARMUP_MINUTES + exercises.reduce((n, x) => n + exerciseMinutes(x), 0);

// Fait rentrer une séance dans le temps disponible. On coupe l'ISOLATION d'abord
// (bloc C avant B), en commençant par l'objectif le MOINS prioritaire ; les gros
// polyarticulaires gardent leurs séries pleines (meilleur rapport résultat/temps,
// et ils couvrent déjà tous les muscles). Jamais de blocage ni d'objectif
// abandonné : on rend toujours une séance cohérente pour le temps donné.
function fitSessionToDuration(exercises, availableMin, objRank) {
  if (!availableMin || availableMin <= 0) return exercises;
  let ex = exercises.map((x) => ({ ...x }));
  if (sessionMinutes(ex) <= availableMin) return exercises; // rentre déjà → intact

  const rankOf = (x) => objRank[x.muscle_group] ?? 99;
  // Le "moins précieux" = objectif le moins prioritaire, puis bloc le plus tardif.
  const worst = (pool) =>
    pool.sort(
      (a, b) =>
        rankOf(b) - rankOf(a) ||
        (BLOCK_RANK[b.block] ?? 3) - (BLOCK_RANK[a.block] ?? 3) ||
        (b.sets || 0) - (a.sets || 0)
    )[0];

  // 1) Rogner l'isolation (peut aller jusqu'au retrait de l'exercice).
  let guard = 200;
  while (sessionMinutes(ex) > availableMin && guard-- > 0) {
    const cand = worst(ex.filter((x) => !isCompoundEx(x) && (x.sets || 0) > 0));
    if (!cand) break;
    cand.sets -= 1;
  }
  ex = ex.filter((x) => (x.sets || 0) > 0);

  // 2) Dernier recours (temps très court) : alléger les polyarticulaires, en
  //    gardant un plancher de 2 séries et au moins un exercice dans la séance.
  guard = 200;
  while (sessionMinutes(ex) > availableMin && guard-- > 0) {
    const cand = worst(ex.filter((x) => (x.sets || 0) > 2));
    if (!cand) break;
    cand.sets -= 1;
  }
  return ex;
}

// Séance "dure" = du lourd en bloc A (plage de reps basse).
const isHardSession = (exercises) =>
  exercises.some((x) => x.block === 'A' && (parseInt(String(x.target_reps), 10) || 99) <= 8);

// Niveau de DANGER (0-2). Tous les lifts à la barre ne se valent pas : ceux qui
// chargent les lombaires en flexion de hanche sont les plus à risque sous fatigue
// (2). Un front squat, buste droit et facile à lâcher, l'est nettement moins (1).
const LUMBAR_LIFTS = /soulevé de terre|rack pull|good morning/i;
function dangerRank(x) {
  if (LUMBAR_LIFTS.test(x.name || '')) return 2;
  return dbExercise(x.name)?.failureAllowed === false ? 1 : 0;
}

// Rotation de priorité : fait tourner le muscle qui OUVRE la séance entre deux
// variantes (A/B) pour que chacun ait une exposition "à froid" sur la semaine.
// BRIDÉE PAR LE DANGER :
//   • on ne rétrograde JAMAIS un exercice plus dangereux que celui qu'on avance
//     (le lift le plus risqué doit rester à froid) ;
//   • sur une séance dure, deux gros lifts de danger égal ne s'échangent pas —
//     rien à y gagner. C'est la séance la plus légère qui absorbe la rotation.
function rotateLeadIfSafe(exercises) {
  const a = exercises.filter((x) => x.block === 'A');
  if (a.length < 2) return exercises;
  const muscles = [...new Set(a.map((x) => x.muscle_group))];
  if (muscles.length < 2) return exercises;

  const lead = muscles[1];
  const newLead = a.find((x) => x.muscle_group === lead);
  const dOld = dangerRank(a[0]);
  const dNew = dangerRank(newLead);
  if (dNew < dOld) return exercises; // reculerait le plus risqué → non
  if (dOld >= 1 && dNew === dOld && isHardSession(exercises)) return exercises; // sans bénéfice

  return [
    ...a.filter((x) => x.muscle_group === lead),
    ...a.filter((x) => x.muscle_group !== lead),
    ...exercises.filter((x) => x.block !== 'A'),
  ];
}

// Applique rotation + rognage aux séances d'un programme, une fois les jours
// attribués (le temps dispo dépend du jour). Retourne de NOUVELLES séances.
function shapeSessions(program, user, objectives, days) {
  const objRank = muscleObjectiveRank(objectives);
  const durations = user?.duration_per_day || {};
  const noTimeLimit = user?.availability_optimal === true;
  // Compte les variantes d'une même séance (mêmes muscles) pour alterner le lead.
  const variantSeen = {};

  return program.sessions.map((s, i) => {
    let exercises = s.exercises;

    const sig = [...new Set(exercises.map((x) => x.muscle_group))].sort().join('|');
    variantSeen[sig] = (variantSeen[sig] || 0) + 1;
    if (variantSeen[sig] % 2 === 0) exercises = rotateLeadIfSafe(exercises);

    if (!noTimeLimit) {
      const day = days[i % days.length];
      const available = Number(durations[day]) || 0;
      exercises = fitSessionToDuration(exercises, available, objRank);
    }

    if (exercises === s.exercises) return s; // rien changé → séance d'origine

    const seen = new Set();
    const active_zones = [];
    for (const x of exercises) {
      if (!seen.has(x.muscle_group)) { seen.add(x.muscle_group); active_zones.push({ muscle_group: x.muscle_group }); }
    }
    return { ...s, exercises, active_zones, estimated_duration: Math.round(sessionMinutes(exercises)) };
  });
}

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

// ASYNCHRONE : le catalogue est chargé à la demande (voir loadCatalog en tête de
// fichier). L'appelant doit donc `await`.
export async function buildActivationResult(user, objectives) {
  let match = await findMatchingProgram(user, objectives);
  let specialized = false;

  // Pas de correspondance exacte MAIS objectif "muscles précis" → on DÉRIVE un
  // programme spécialisé depuis la cible large la plus proche (voir plus haut).
  // Repli only : n'affecte JAMAIS les objectifs à cible large (match trouvé).
  if (!match && user && hasSpecificGroup(objectives)) {
    const focus = focusMusclesFromObjectives(objectives);
    if (focus.primary.size) {
      const allFocus = new Set([...focus.primary, ...focus.secondary]);
      const catalog = await loadCatalog();
      const base = pickBaseProgram(catalog, user, primarySpecificType(objectives), coverZoneForMuscles(focus.primary), allFocus);
      if (base) {
        match = { ...base, program: specializeProgram(base.program, focus, user, primarySpecificType(objectives)) };
        specialized = true;
      }
    }
  }

  // Objectif de FORCE sur une combinaison de mouvements absente du catalogue
  // (14 des 15 combinaisons possibles) → on part du programme des 3 lifts et on
  // retire ce qui ne sert pas les mouvements choisis. Le volume n'est PAS gonflé :
  // celui d'un programme de force est déjà le bon (cf. targetFor).
  if (!match && user) {
    const movements = movementsOf(objectives);
    if (movements.size) {
      const catalog = await loadCatalog();
      const base = pickStrengthBase(catalog, user, movements);
      if (base) {
        match = { ...base, program: specializeMovements(base.program, movements, user) };
        specialized = true;
      }
    }
  }

  if (!match) return null;
  const p = match.program;
  const days = pickDays(user, p.weekly_frequency);

  // Buffer initial de séances (= durée conseillée du programme) ; le top-up
  // automatique de l'app prolonge ensuite le cycle indéfiniment.
  const initialWeeks = Math.max(1, p.planned_weeks || 4);
  // Rotation de priorité + adaptation au temps disponible de chaque jour.
  // Les séances qui rentrent déjà et ne tournent pas sont rendues INCHANGÉES.
  const shapedAll = shapeSessions(p, user, objectives, days);
  // Jamais plus de séances que de jours disponibles : sinon `days[i % days.length]`
  // en reposait deux le MÊME jour. On garde les premières (les plus structurantes
  // du programme) et on assume une séance de moins.
  const shaped = shapedAll.slice(0, days.length);
  const sessions = [];
  for (let w = 1; w <= initialWeeks; w++) {
    shaped.forEach((s, i) => {
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
    specialized: specialized || undefined,
  };
}
