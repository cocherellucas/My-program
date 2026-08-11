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
import { equipementPossede, exerciceFaisable } from './equipment';
import { SUBSTITUTIONS } from './exercise-substitutions';

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

// Structure RÉELLEMENT obtenue, et non celle déclarée par le programme d'origine.
// Le badge affiché à l'utilisateur annonçait « Upper / Lower » sur des séances
// intitulées « Corps entier » : le libellé venait du `split` du catalogue, alors
// que la spécialisation, la bascule haut/bas et le rognage remodèlent les
// séances après coup. On ne corrige que les deux CONTRADICTIONS franches, sans
// toucher au reste — un PPL a des séances d'une seule moitié lui aussi, on ne
// saurait pas le distinguer d'un haut/bas à partir des seuls muscles.
function structureReelle(sessions, declaree) {
  if (!sessions?.length) return declaree;
  const moities = sessions.map((s) => {
    const m = [...new Set(s.exercises.map((x) => x.muscle_group))];
    return {
      haut: m.some((x) => MUSCLE_ZONE[x] !== 'lower'),
      bas: m.some((x) => MUSCLE_ZONE[x] === 'lower'),
    };
  });
  // Toutes les séances couvrent les DEUX moitiés → c'est un corps entier.
  if (moities.every((z) => z.haut && z.bas)) return 'full_body';
  // Le programme se disait corps entier mais chaque séance ne fait qu'une moitié
  // (cas de la bascule haut/bas sur jours collés) → c'est un haut/bas.
  if (declaree === 'full_body' && moities.every((z) => z.haut !== z.bas)) return 'upper_lower';
  return declaree;
}

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

// Muscles ciblés par UN objectif, quelle que soit sa forme : zone large, groupe
// précis, ou mouvements. Sert à dériver un programme pour toutes les combinaisons
// que l'interface autorise mais que le catalogue ne contient pas (il n'a que 10
// signatures ; l'interface en laisse construire des dizaines).
function musclesOfObjective(o) {
  const movs = toList(o?.focus_movement);
  if (movs.length) {
    const set = new Set();
    for (const mv of movs) {
      const e = EXERCISES.find((x) => x.name === (MOVEMENT_TO_EXERCISE[mv] || mv));
      if (!e) continue;
      [...(e.muscles?.primary || []), ...(e.muscles?.secondary || [])].forEach((m) => set.add(appMuscle(m)));
    }
    return set;
  }
  if (o?.zone === 'specific_group') return new Set(toList(o.focus_group));
  return new Set(ZONE_MUSCLES[o?.zone] || []);
}

// Muscles ciblés extraits de TOUS les objectifs (le primaire l'emporte).
function focusMusclesFromObjectives(objectives) {
  const primary = new Set();
  const secondary = new Set();
  for (const o of objectives || []) {
    const bucket = o.priority === 'secondary' ? secondary : primary;
    musclesOfObjective(o).forEach((m) => bucket.add(m));
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
const objetsZoneMuscles = (objs) => {
  const set = new Set();
  for (const o of objs || []) musclesOfObjective(o).forEach((m) => set.add(m));
  return set;
};

// Complète un programme dérivé des MOUVEMENTS avec les objectifs de ZONE ou de
// GROUPE qui l'accompagnent. Sans ça, « force sur le squat + hypertrophie haut du
// corps » ne produisait QUE du squat : le second objectif était purement ignoré.
// On ne touche pas à la partie force (jours lourd/volume des lifts) ; on ajoute le
// volume manquant, avec les répétitions du type demandé, en répartissant sur les
// séances les moins chargées et en respectant les fenêtres de récupération.
function completerAvecObjectifs(program, objectifs, user, days) {
  const level = user?.level || 'intermediate';
  const bands = VOLUME_BANDS[level] || VOLUME_BANDS.intermediate;
  const possede = equipementPossede(user?.equipment);
  const canDo = (e) => exerciceFaisable(e, possede);

  const sessions = program.sessions.map((s) => ({ ...s, exercises: [...s.exercises] }));
  const jourDe = {};
  sessions.forEach((_, i) => { jourDe[i] = DAY_ORDER.indexOf(days[i % days.length]); });
  const heuresEntre = (i, j) => {
    const a = jourDe[i]; const b = jourDe[j];
    if (a == null || b == null) return 999;
    const d = Math.abs(a - b);
    return Math.min(d, 7 - d) * 24;
  };
  const musclesDe = (idx) => {
    const set = new Set();
    for (const x of sessions[idx].exercises) {
      set.add(x.muscle_group);
      for (const sm of x.muscles_secondary || []) set.add(sm);
    }
    return set;
  };

  // Les exercices DÉJÀ présents qui servent un objectif de zone doivent en suivre
  // la programmation : un développé militaire hérité du programme de force restait
  // en 6-8 alors que les épaules étaient demandées en endurance. Même règle que
  // partout : l'endurance s'applique à tout, la force aux polyarticulaires seuls.
  // Un muscle peut apparaître dans PLUSIEURS objectifs : c'est le premier (donc le
  // prioritaire) qui décide de sa programmation. Appliquer les objectifs l'un après
  // l'autre laissait le dernier écraser le premier — des quadriceps demandés en
  // endurance prioritaire finissaient en 2-4 répétitions à cause d'un objectif de
  // force secondaire.
  const typePourMuscle = {};
  for (const o of objectifs) {
    for (const m of musclesOfObjective(o)) if (!typePourMuscle[m]) typePourMuscle[m] = o.type;
  }
  for (const s of sessions) {
    s.exercises = s.exercises.map((x) => {
      const ty = typePourMuscle[x.muscle_group];
      if (!ty) return x;
      const applique = ty === 'endurance' || (ty === 'strength' && isCompoundEx(x));
      const p = applique ? TRAINING_PARAMS[ty]?.MAV : null;
      return p ? { ...x, target_reps: `${p.reps[0]}-${p.reps[1]}`, rest_seconds: p.rest } : x;
    });
  }

  for (const o of objectifs) {
    const cible = o.priority === 'secondary' ? Math.round(bands.mav * 0.5) : bands.mav;
    const maxParExo = TRAINING_PARAMS[o.type]?.MAV?.sets?.[1] || TRAINING_PARAMS.hypertrophy.MAV.sets[1];
    for (const M of musclesOfObjective(o)) {
      const volume = () => sessions.reduce((n, s) =>
        n + s.exercises.filter((x) => x.muscle_group === M).reduce((a, x) => a + (x.sets || 0), 0), 0);
      let manque = cible - volume();
      if (manque <= 2) continue;

      const dejaLa = new Set(sessions.flatMap((s) => s.exercises.map((x) => String(x.name).toLowerCase())));
      const pool = EXERCISES
        .filter((e) => cibleMuscle(e, M) && e.level?.includes(level) && canDo(e) && !dejaLa.has(e.name.toLowerCase()))
        // Les exercices de REPLI (fallback) passent en dernier : ils n'exigent
        // aucun matériel, ils seraient donc toujours éligibles, y compris pour
        // quelqu'un qui a une salle complète et n'a rien à faire d'un « curl
        // avec sac ». Ils ne sortent que si plus rien d'autre n'est faisable.
        .sort((a, b) => (a.fallback ? 1 : 0) - (b.fallback ? 1 : 0)
          || (a.type === 'compound' ? 0 : 1) - (b.type === 'compound' ? 0 : 1));

      let ajoutes = 0;
      for (const e of pool) {
        if (manque <= 2 || ajoutes >= 2) break;
        const charge = (i) => sessions[i].exercises.reduce((n, x) => n + (x.sets || 0), 0);
        const ordre = sessions.map((_, i) => i).sort((a, b) => charge(a) - charge(b));
        const touche = new Set([
          ...(e.muscles?.primary || []).map(appMuscle),
          ...(e.type === 'compound' ? (e.muscles?.secondary || []).map(appMuscle) : []),
        ]);
        for (const i of ordre) {
          if (manque <= 2) break;
          if (sessions[i].exercises.some((x) => x.name === e.name)) continue;
          const fenetre = SRA_WINDOWS[sessions[i].type] || SRA_WINDOWS.mixed;
          const conflit = sessions.some((_, j) => j !== i && heuresEntre(i, j) < fenetre
            && [...touche].some((m) => m !== M && musclesDe(j).has(m)));
          if (conflit) continue;
          const sets = Math.max(2, Math.min(3, maxParExo, manque));
          sessions[i].exercises.push(makeExercise(e, M, sets, o.type));
          manque -= sets;
          ajoutes++;
          break;
        }
      }
    }
  }

  const rang = { A: 0, B: 1, C: 2 };
  return {
    ...program,
    sessions: sessions.map((s) => {
      const exercises = s.exercises.slice().sort((a, b) => (rang[a.block] ?? 3) - (rang[b.block] ?? 3));
      const vus = new Set();
      const active_zones = [];
      for (const x of exercises) {
        if (!vus.has(x.muscle_group)) { vus.add(x.muscle_group); active_zones.push({ muscle_group: x.muscle_group }); }
      }
      return { ...s, exercises, active_zones };
    }),
  };
}

function specializeMovements(program, selected, user, objectifsZone = []) {
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
  // Les muscles des objectifs de ZONE qui accompagnent le mouvement comptent aussi :
  // sinon on jetterait des accessoires qui les servent, avant même de compléter.
  for (const o of objetsZoneMuscles(objectifsZone)) musclesCibles.add(o);
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
  // SAUF s'il existe d'autres objectifs (zone/groupe) : ces journées vont
  // justement les accueillir, et les supprimer priverait le complément de place.
  if (!objectifsZone.length) {
    sessions = sessions.filter((s) => s.exercises.some((x) => isFamily(x.name)));
  } else {
    sessions = sessions.filter((s) => s.exercises.length > 0 || true);
  }

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
    if (!lead) return s; // séance sans lift choisi : elle accueillera les autres objectifs
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
  // Une cible LARGE n'est pas une spécialisation. Le raisonnement ci-dessous
  // compte les séances qui touchent la cible et vise 2 à 3 par semaine — c'est
  // une fréquence PAR MUSCLE, valable quand on vise deux ou trois muscles. Dès
  // que la cible couvre une moitié du corps ou plus, chaque séance la touche :
  // le compteur devient le nombre total de séances, et viser « 2 » revenait à
  // choisir systématiquement le programme 3 jours — même avec 5 jours déclarés.
  // Résultat : ajouter un jour n'allégeait jamais les séances.
  // Au-delà de 4 muscles (un bas du corps entier), on choisit donc comme pour un
  // objectif large : selon le nombre de jours réellement disponibles.
  if (focusMuscles.size > 4) return chooseByFrequency(candidates, user);

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

// Le muscle_group du catalogue/objectifs ('Pectoraux', 'Abdominaux') ne porte pas
// toujours le même nom dans la base d'exos. Tables de conversion.
// ATTENTION : la base n'est pas homogène — elle contient 18 exercices 'Poitrine'
// ET 2 'Pectoraux', 19 'Abdominaux' et AUCUN 'Abdos'. Traduire vers un seul nom
// ne trouvait donc rien pour les abdos (0 exercice sur 19) et ratait 2 pectoraux.
// On cherche désormais sur TOUS les noms possibles.
const DB_MUSCLE_NAMES = {
  Pectoraux: ['Pectoraux', 'Poitrine'],
  Abdominaux: ['Abdominaux', 'Abdos'],
};
const dbMuscleNames = (m) => DB_MUSCLE_NAMES[m] || [m];
const cibleMuscle = (e, m) => dbMuscleNames(m).some((n) => e.muscles?.primary?.includes(n));
const APP_MUSCLE = { Poitrine: 'Pectoraux', Abdos: 'Abdominaux' };
const appMuscle = (m) => APP_MUSCLE[m] || m;
const REPS_BY_BLOCK = { A: '6-8', B: '8-12', C: '10-15' };
const REST_BY_BLOCK = { A: 150, B: 105, C: 75 };

// Fabrique un exercice de programme à partir d'une entrée de la base d'exos,
// étiqueté sur le muscle FOCUS (les autres muscles → secondaires). Sert à
// compléter un muscle focus plafonné (ex. chin-up pour biceps, DC serré triceps).
function makeExercise(e, focusMuscle, sets, objectiveType = 'hypertrophy') {
  const block = e.block || 'C';
  // Reps et repos DOIVENT suivre le type d'objectif : ajouter des séries de 6-8
  // dans un programme d'endurance (15-25) le rendait incohérent. En hypertrophie
  // on garde le découpage par bloc du catalogue, plus fin que la moyenne du type.
  // La force ne s'applique qu'aux POLYARTICULAIRES : des mollets ou un curl en
  // 2-4 reps avec 4 min de repos n'a aucun sens. Les isolations gardent les
  // plages d'hypertrophie, comme dans le programme SBD du catalogue.
  const suitLeType = objectiveType === 'endurance'
    || (objectiveType === 'strength' && e.type === 'compound');
  if (suitLeType) {
    const p = TRAINING_PARAMS[objectiveType]?.MAV;
    if (p) {
      const others = [
        ...(e.muscles?.primary || []).map(appMuscle).filter((m) => m !== focusMuscle),
        ...(e.muscles?.secondary || []).map(appMuscle),
      ];
      return {
        name: e.name,
        muscle_group: focusMuscle,
        muscles_secondary: [...new Set(others)],
        block,
        sets,
        target_reps: `${p.reps[0]}-${p.reps[1]}`,
        rest_seconds: p.rest,
      };
    }
  }
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
function specializeProgram(program, focus, user, objectiveType = 'hypertrophy', typeByMuscle = {}) {
  // Chaque muscle suit le type de SON objectif : sur « hypertrophie haut + force
  // bas », les jambes doivent être programmées en force (lourd, 3-5) et non en
  // plages d'hypertrophie. Sans ça, seul le type du primaire était honoré.
  const typeOf = (m) => typeByMuscle[m] || objectiveType;
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
  const possede = equipementPossede(user?.equipment);
  const canDo = (e) => exerciceFaisable(e, possede);

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
  // Le MRV ne se justifie que sur une cible ÉTROITE (spécialisation) : le budget
  // de récup y est loin d'être épuisé. Sur une zone entière, le catalogue lui-même
  // vise le MAV pour le primaire et ~la moitié pour le secondaire — on fait pareil.
  const cibleEtroite = primary.size <= 3;
  const targetFor = (m) => {
    if (typeOf(m) === 'strength') {
      // Volume de force déjà calibré → on n'y touche pas. S'il est nul (muscle
      // absent de la base, ex. « force bas » greffé sur un programme haut), on
      // l'introduit à dose de secondaire plutôt que de l'ignorer.
      return current[m] > 0 ? current[m] : Math.round(bands.mav * 0.5);
    }
    if (primary.has(m)) return cibleEtroite ? bands.mrv : bands.mav;
    return cibleEtroite ? bands.mav : Math.round(bands.mav * 0.5);
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
      // Les répétitions doivent suivre le type d'objectif DU MUSCLE, y compris sur
      // les exercices hérités du programme de base : un objectif « endurance »
      // dérivé d'un programme d'hypertrophie gardait sinon des séries de 6-8.
      //   • endurance → toutes les séries passent en 12-20 ;
      //   • force → seulement les POLYARTICULAIRES en 3-5 (on ne fait pas des leg
      //     curls à 3 reps ; les accessoires restent en 8-12, comme dans le
      //     programme SBD du catalogue) ;
      //   • hypertrophie → on garde le découpage par bloc du catalogue, plus fin.
      const ty = typeOf(x.muscle_group);
      const applique = ty === 'endurance' || (ty === 'strength' && isCompoundEx(x));
      const p = applique ? TRAINING_PARAMS[ty]?.MAV : null;
      exercises.push(p
        ? { ...x, sets, target_reps: `${p.reps[0]}-${p.reps[1]}`, rest_seconds: p.rest }
        : { ...x, sets });
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
  // Muscles qu'un exercice met à contribution — sert à refuser un ajout qui
  // tomberait dans la fenêtre de récupération d'un muscle déjà travaillé.
  // Les secondaires comptent SANS condition de type. Auparavant ils n'étaient
  // retenus que pour les polyarticulaires, alors que `sessionLoads` juste en
  // dessous — l'AUTRE côté de la même comparaison — les comptait toujours : on
  // ignorait donc le travail secondaire du candidat tout en tenant compte de
  // celui de la séance. Le projet considère par ailleurs qu'un muscle secondaire
  // compte 0,5× (coaching-engine.js), donc qu'il travaille réellement.
  const loadedBy = (e) => {
    const list = (e.muscles?.primary || []).map(appMuscle);
    list.push(...(e.muscles?.secondary || []).map(appMuscle));
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

  for (const M of [...primary, ...secondary]) {
    const weeklyOf = (mg) =>
      built.reduce((n, s) => n + s.exercises.filter((x) => x.muscle_group === mg).reduce((a, x) => a + (x.sets || 0), 0), 0);
    let gap = targetFor(M) - weeklyOf(M);
    if (gap <= 2) continue;
    let focusIdx = built.map((_, i) => i).filter((i) => built[i].exercises.some((x) => x.muscle_group === M));
    // Muscle totalement absent du programme de base — cas d'un objectif secondaire
    // greffé sur une autre zone (« hypertrophie haut + force bas » part d'un
    // programme haut du corps, qui n'a aucune séance de jambes). Sans ça,
    // l'objectif secondaire disparaissait sans laisser de trace.
    if (!focusIdx.length) focusIdx = built.map((_, i) => i);
    if (!focusIdx.length) continue;
    // Des séances les moins chargées vers les plus chargées : sinon tous les
    // ajouts s'empilaient sur la première, qui devenait interminable.
    focusIdx.sort((a, b) =>
      built[a].exercises.reduce((n, x) => n + (x.sets || 0), 0)
      - built[b].exercises.reduce((n, x) => n + (x.sets || 0), 0));

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
    const pool = EXERCISES
      .filter((e) => cibleMuscle(e, M) && e.level?.includes(level) && canDo(e) && !used.has(e.name.toLowerCase()))
      // Replis en dernier (voir specializeProgram), puis composés d'abord.
      .sort((a, b) => (a.fallback ? 1 : 0) - (b.fallback ? 1 : 0)
        || (a.type === 'compound' ? 0 : 1) - (b.type === 'compound' ? 0 : 1));
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
        built[i] = { ...built[i], exercises: [...built[i].exercises, makeExercise(e, M, sets, typeOf(M))] };
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

    // Le badge affiché sur la séance vient de son `type`. Après réallocation, une
    // journée peut suivre un autre type que le programme de base : un « bas du
    // corps » programmé en ENDURANCE gardait le badge « Hypertrophie » du
    // programme dont il est dérivé. On recalcule donc le type depuis les muscles
    // réellement travaillés (celui qui pèse le plus de séries l'emporte).
    const poids = {};
    for (const x of ordered) {
      const ty = typeOf(x.muscle_group);
      poids[ty] = (poids[ty] || 0) + (x.sets || 0);
    }
    const dominant = Object.entries(poids).sort((a, b) => b[1] - a[1])[0]?.[0];

    return { ...s, type: dominant || s.type, exercises: ordered, active_zones, estimated_duration };
  });

  // Les séances qui ne contenaient que des muscles non ciblés sont désormais
  // vides → on les retire (pas de journée fantôme) et la fréquence suit.
  const kept = sessions.filter((s) => s.exercises.length > 0);

  // Les libellés du programme de base ne décrivent plus la séance une fois les
  // muscles non ciblés retirés (« Haut du corps » pour une séance pecs/triceps).
  // On les regénère depuis les muscles réellement présents, avec un suffixe A/B/…
  // si plusieurs séances portent le même nom.
  // Au-delà de trois muscles, énumérer devient illisible : une séance corps
  // entier s'affichait « Pectoraux · Dos · Épaules · Ischio-jambiers · Biceps ·
  // Triceps · Quadriceps · Fessiers · Abdominaux · Mollets ». On retombe alors
  // sur le nom de la zone couverte.
  const labelOf = (s) => {
    const muscles = [...new Set(s.exercises.map((x) => x.muscle_group))];
    if (muscles.length <= 3) return muscles.join(' · ');
    const haut = muscles.some((m) => MUSCLE_ZONE[m] !== 'lower');
    const bas = muscles.some((m) => MUSCLE_ZONE[m] === 'lower');
    if (haut && bas) return 'Corps entier';
    return bas ? 'Bas du corps' : 'Haut du corps';
  };
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

// Fait rentrer une séance dans le temps disponible, dans cet ordre : (1) couper
// l'ISOLATION (bloc C avant B), en commençant par l'objectif le MOINS
// prioritaire ; (2) en dernier recours seulement, raccourcir le repos jusqu'au
// minimum prévu par le projet ; (3) sinon alléger les polyarticulaires. Ils
// gardent leurs séries pleines le plus longtemps possible (meilleur rapport
// résultat/temps, et ils couvrent déjà tous les muscles). Jamais de blocage ni
// d'objectif abandonné : on rend toujours une séance cohérente.
function fitSessionToDuration(exercises, availableMin, objRank, typeParMuscle, typeDefaut) {
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

  // 2) DERNIER RECOURS uniquement (toute l'isolation y est déjà passée) :
  //    raccourcir le repos, sans jamais descendre sous le minimum prévu par le
  //    projet pour ce type d'effort (plus petit `rest` des phases dans
  //    TRAINING_PARAMS : 120 s hypertrophie, 240 s force, 30 s endurance). On ne
  //    fait que RÉDUIRE : un exercice déjà plus court garde son repos.
  //    En hypertrophie ça sauve la séance (150 → 120 s : 34 min repassent à 30).
  //    En force le gain est volontairement faible (270 → 240 s) : sur un lift
  //    lourd le repos complet EST ce qui permet la charge, donc on préfère
  //    perdre une série (étape 3) plutôt que bâcler la récupération.
  if (sessionMinutes(ex) > availableMin) {
    ex = ex.map((x) => {
      const params = TRAINING_PARAMS[typeParMuscle?.[x.muscle_group] || typeDefaut];
      if (!params) return x;
      const mini = Math.min(...Object.values(params).map((ph) => ph.rest).filter(Boolean));
      return (x.rest_seconds || 90) > mini ? { ...x, rest_seconds: mini } : x;
    });
  }

  // 3) Vraiment trop court : alléger les polyarticulaires, en gardant un
  //    plancher de 2 séries et au moins un exercice dans la séance.
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

// Deux séances à moins de 48 h qui travaillent les MÊMES muscles violent la règle
// SRA du brief. Cas typique : jours collés (samedi + dimanche) sur un programme
// corps entier — les 10 muscles étaient répétés d'un jour sur l'autre. On bascule
// alors en HAUT/BAS en alternance : chaque journée prend une moitié du corps, ce
// qui rend 48 h de récupération à chaque muscle SANS toucher au volume
// hebdomadaire (on redistribue, on n'enlève rien).
// `parite` inverse l'attribution haut/bas d'une semaine sur l'autre. Sur un
// nombre IMPAIR de séances (haut/bas/haut), sans ça le haut serait travaillé 2×
// par semaine et le bas 1× — indéfiniment. En alternant, chaque moitié tourne à
// 1,5 séance par semaine en moyenne.
// Quelle moitié du corps est PRIORITAIRE ? Retourne 'upper', 'lower', ou null
// si les deux sont à égalité (deux primaires, deux secondaires, ou un objectif
// corps entier). Sert à décider si l'attribution haut/bas doit alterner d'une
// semaine à l'autre — voir splitConsecutiveSessions.
function zonePrioritaire(objectives) {
  const rang = { upper: 9, lower: 9 }; // 0 = primaire, 1 = secondaire, 9 = absent
  for (const o of objectives || []) {
    const poids = o?.priority === 'secondary' ? 1 : 0;
    for (const m of musclesOfObjective(o)) {
      const z = MUSCLE_ZONE[m];
      if (z) rang[z] = Math.min(rang[z], poids);
    }
  }
  if (rang.upper === rang.lower) return null;
  return rang.upper < rang.lower ? 'upper' : 'lower';
}

function splitConsecutiveSessions(sessions, days, parite = 0, prioritaire = null, user = null) {
  if (sessions.length < 2 || !days?.length) return sessions;
  const dayIdx = sessions.map((_, i) => DAY_ORDER.indexOf(days[i % days.length]));
  const gapEntre = (i, j) => {
    const d = Math.abs(dayIdx[i] - dayIdx[j]);
    return Math.min(d, 7 - d);
  };
  // Les ABDOMINAUX sont exclus de la détection de conflit. Les programmes du
  // catalogue en mettent volontairement dans CHAQUE séance (ils récupèrent vite,
  // c'est la pratique courante). Les compter comme un chevauchement faisait
  // conclure au conflit entre toutes les séances consécutives, y compris quand
  // rien d'autre ne se répétait : un PPL (Poussée · Tirage · Jambes · Haut · Bas)
  // était alors démonté en haut/bas, ce qui ramenait les pectoraux le lundi, le
  // mercredi ET le vendredi — exactement ce que la bascule cherche à éviter.
  // Le découpage sert à protéger la récupération des GROS groupes musculaires.
  const musclesUtiles = (s) => new Set(
    s.exercises.map((x) => x.muscle_group).filter((m) => m !== 'Abdominaux')
  );

  let conflit = false;
  for (let i = 0; i < sessions.length && !conflit; i++) {
    for (let j = i + 1; j < sessions.length && !conflit; j++) {
      if (gapEntre(i, j) >= 2) continue;
      const mi = musclesUtiles(sessions[i]);
      if ([...musclesUtiles(sessions[j])].some((m) => mi.has(m))) conflit = true;
    }
  }
  if (!conflit) return sessions;

  // 1) D'ABORD essayer de simplement RÉORDONNER les séances : si le programme est
  //    déjà en haut/bas, il suffit d'alterner pour que deux jours collés ne
  //    retombent pas sur les mêmes muscles. On ne touche alors à rien d'autre.
  const creneaux = sessions.map((_, i) => i).sort((a, b) => dayIdx[a] - dayIdx[b]);
  const musclesDe = musclesUtiles; // même règle : les abdos ne comptent pas
  const restants = sessions.map((_, i) => i);
  const place = [];
  while (restants.length) {
    const precedent = place.length ? sessions[place[place.length - 1]] : null;
    const colle = place.length
      && gapEntre(creneaux[place.length - 1], creneaux[place.length]) < 2;
    let choix = 0;
    if (precedent && colle) {
      const mp = musclesDe(precedent);
      let min = Infinity;
      restants.forEach((idx, k) => {
        const n = [...musclesDe(sessions[idx])].filter((m) => mp.has(m)).length;
        if (n < min) { min = n; choix = k; }
      });
    }
    place.push(restants.splice(choix, 1)[0]);
  }
  const reordonne = creneaux.map((_, k) => sessions[place[k]]);
  let resteConflit = false;
  for (let k = 0; k < reordonne.length - 1 && !resteConflit; k++) {
    if (gapEntre(creneaux[k], creneaux[k + 1]) >= 2) continue;
    const ma = musclesDe(reordonne[k]);
    if ([...musclesDe(reordonne[k + 1])].some((m) => ma.has(m))) resteConflit = true;
  }
  if (!resteConflit) return reordonne;

  // 2) Sinon seulement (vrai corps entier : toutes les séances partagent les mêmes
  //    muscles), on redistribue en haut/bas.
  const ordre = sessions.map((_, i) => i).sort((a, b) => dayIdx[a] - dayIdx[b]);

  // Regroupe le volume de la semaine par exercice (les séances corps entier
  // répètent les mêmes mouvements : on les fusionne au lieu de les dupliquer).
  const pool = { upper: new Map(), lower: new Map() };
  for (const s of sessions) {
    for (const x of s.exercises) {
      const z = MUSCLE_ZONE[x.muscle_group] === 'lower' ? 'lower' : 'upper';
      const prev = pool[z].get(x.name);
      // Somme SANS plafond ici : le volume sera réparti sur les séances de la zone
      // à la distribution. Plafonner dès la fusion faisait perdre des séries alors
      // qu'il restait de la place ailleurs dans la semaine.
      if (prev) prev.sets = (prev.sets || 0) + (x.sets || 0);
      else pool[z].set(x.name, { ...x });
    }
  }

  // Le découpage haut/bas suppose que le programme couvre les DEUX moitiés. Sur un
  // objectif « haut du corps » il n'y a aucun exercice de jambes : découper y
  // créait des séances vides. Dans ce cas on garde l'ordre réordonné — le conflit
  // vient alors des disponibilités (jours collés sur une seule zone), pas du
  // programme, et le message d'honnêteté sur le budget le couvre déjà.
  if (!pool.upper.size || !pool.lower.size) return reordonne;

  // Attribution des créneaux aux deux moitiés du corps.
  //
  // Sur un nombre IMPAIR de séances, une moitié en reçoit une de plus — et sur
  // 3 jours, celle qui n'en a qu'une doit absorber tout son volume hebdo dans la
  // journée. La décision dépend donc de ce que l'utilisateur a demandé :
  //
  //  • OBJECTIFS À ÉGALITÉ (deux primaires, deux secondaires, ou un objectif
  //    corps entier) : rien ne justifie de servir toujours la même moitié deux
  //    fois. On ALTERNE d'une semaine à l'autre (`parite`) — haut/bas/haut puis
  //    bas/haut/bas. La semaine 1 donne le créneau en plus à la moitié la plus
  //    chargée, pour que la semaine la plus lourde soit aussi la mieux étalée.
  //
  //  • UNE MOITIÉ PRIORITAIRE : surtout pas d'alternance. Le volume, lui, ne
  //    bascule pas — il suit l'objectif. Alterner revenait à entasser tout le
  //    volume du primaire dans une seule séance une semaine sur deux (mesuré :
  //    16 exercices et 60 séries le même jour, pendant que le secondaire
  //    s'étalait sur deux séances de 20 séries). La moitié prioritaire garde donc
  //    sa séance supplémentaire toutes les semaines.
  const seriesDe = (z) => [...pool[z].values()].reduce((n, x) => n + (x.sets || 0), 0);
  const premiere = prioritaire || (seriesDe('lower') > seriesDe('upper') ? 'lower' : 'upper');
  const autre = premiere === 'upper' ? 'lower' : 'upper';
  const decalage = prioritaire ? 0 : parite;
  const zoneDe = {};
  ordre.forEach((i, rang) => { zoneDe[i] = (rang + decalage) % 2 === 0 ? premiere : autre; });

  // Une moitié ne peut pas remplir plus de séances qu'elle n'a de matière. Sur
  // « force Épaules (primaire) + endurance bas du corps », le haut ne contient
  // qu'un seul mouvement : la priorité lui donnait deux créneaux et la deuxième
  // séance sortait VIDE. On mesure la matière en TRANCHES (un exercice de 12
  // séries peut en remplir deux, un de 4 une seule) et on rend les créneaux en
  // trop à l'autre moitié.
  const capaciteDe = (z) => [...pool[z].values()]
    .reduce((n, x) => n + Math.max(1, Math.ceil((x.sets || 0) / 6)), 0);
  for (const z of ['upper', 'lower']) {
    const autreZ = z === 'upper' ? 'lower' : 'upper';
    const creneaux = ordre.filter((i) => zoneDe[i] === z);
    const capacite = capaciteDe(z);
    while (creneaux.length > capacite) zoneDe[creneaux.pop()] = autreZ;
  }

  const cibles = {
    upper: ordre.filter((i) => zoneDe[i] === 'upper'),
    lower: ordre.filter((i) => zoneDe[i] === 'lower'),
  };
  const out = sessions.map((s) => ({ ...s, exercises: [] }));
  const reste = {}; // séance → muscle → séries en attente de report (voir plus bas)
  for (const z of ['upper', 'lower']) {
    const dest = cibles[z].length ? cibles[z] : ordre;
    let tour = 0;
    for (const x of pool[z].values()) {
      // Un exercice dont le volume hebdo dépasse ce qu'on met en une séance est
      // ÉTALÉ sur plusieurs séances de la zone. On le découpe en AU PLUS autant de
      // tranches qu'il y a de séances disponibles : sinon la rotation revenait sur
      // une séance déjà servie et le même exercice y apparaissait deux fois.
      const total = x.sets || 0;
      const tranches = Math.min(dest.length, Math.max(1, Math.ceil(total / 6)));
      const base = Math.floor(total / tranches);
      let bonus = total - base * tranches;
      // Le plafond de 6 séries par exercice et par séance est volontaire (au-delà,
      // les séries suivantes n'apportent plus grand-chose sur le MÊME mouvement).
      // Mais quand une moitié du corps a moins de créneaux qu'il n'en faudrait,
      // tout son volume hebdo doit tenir dans ce qui reste : le surplus était
      // alors purement SUPPRIMÉ (mesuré : soulevé de terre 8 séries/sem → 6,
      // développé militaire 9 → 6). On le met en attente pour le reporter sur un
      // AUTRE exercice du même muscle, ou sur une isolation ajoutée (voir plus
      // bas) — ce que ferait n'importe quel coach : 6 séries de soulevé + 2 de
      // leg curl, plutôt que 8 de soulevé ou 6 tout court.
      // Le report est comptabilisé TRANCHE PAR TRANCHE : quand plusieurs séances
      // sont plafonnées, chacune récupère sa part, au lieu de tout empiler sur la
      // première.
      for (let k = 0; k < tranches; k++) {
        const voulu = base + (bonus > 0 ? 1 : 0);
        if (bonus > 0) bonus--;
        const part = Math.min(6, voulu) || 1;
        const cible = dest[(tour + k) % dest.length];
        out[cible].exercises.push({ ...x, sets: part });
        if (voulu > part) {
          reste[cible] = reste[cible] || {};
          reste[cible][x.muscle_group] = (reste[cible][x.muscle_group] || 0) + (voulu - part);
        }
      }
      tour++;
    }
  }

  // Report du surplus, en trois temps — jamais en empilant sur un seul geste :
  //  1. Compléter les AUTRES exercices du même muscle déjà dans la séance, sans
  //     dépasser le plafond de 6.
  //  2. Sinon AJOUTER une isolation pour ce muscle (certains n'ont qu'un seul
  //     mouvement dans le programme : épaules, biceps…). 6 séries de développé
  //     militaire + 3 d'élévations latérales valent mieux que 9 séries de
  //     développé militaire — et bien mieux que 3 séries jetées.
  //  3. En dernier recours seulement (aucune isolation faisable avec le matériel
  //     déclaré), dépasser le plafond : garder le volume prime.
  const possede = equipementPossede(user?.equipment);
  const faisable = (e) => exerciceFaisable(e, possede);

  for (const [idx, parMuscle] of Object.entries(reste)) {
    for (const [muscle, surplus] of Object.entries(parMuscle)) {
      let restant = surplus;
      const seance = out[idx];
      const memeMuscle = () => seance.exercises.filter((e) => e.muscle_group === muscle);
      if (!memeMuscle().length) continue;

      // 1) Répartir sur l'existant, les moins chargés d'abord.
      while (restant > 0) {
        const e = memeMuscle().filter((c) => (c.sets || 0) < 6)
          .sort((a, b) => (a.sets || 0) - (b.sets || 0))[0];
        if (!e) break;
        e.sets = (e.sets || 0) + 1;
        restant--;
      }
      if (restant <= 0) continue;

      // 2) Ajouter un exercice pour ce muscle : l'ISOLATION d'abord (c'est ce
      //    qu'on veut sur un surplus), puis à défaut un polyarticulaire. Certains
      //    muscles n'ont aucune isolation faisable sans matériel — les pectoraux
      //    par exemple, on ne peut pas écarter contre résistance à mains nues.
      //    Un mouvement composé différent reste bien meilleur que 15 séries
      //    empilées sur le même geste.
      const dejaLa = new Set(seance.exercises.map((e) => String(e.name).toLowerCase()));
      const dispo = EXERCISES.filter((e) => cibleMuscle(e, muscle)
        && (!user?.level || e.level?.includes(user.level))
        && faisable(e)
        && !dejaLa.has(e.name.toLowerCase()))
        // Replis en dernier, puis isolations avant composés (c'est un surplus).
        .sort((a, b) => (a.fallback ? 1 : 0) - (b.fallback ? 1 : 0)
          || (a.type === 'compound' ? 1 : 0) - (b.type === 'compound' ? 1 : 0));
      const typeSeance = seance.type || 'hypertrophy';
      for (const e of dispo) {
        if (restant <= 0) break;
        const sets = Math.min(6, restant);
        seance.exercises.push(makeExercise(e, muscle, sets, typeSeance));
        restant -= sets;
      }
      if (restant <= 0) continue;

      // 3) Rien de faisable : on empile plutôt que de perdre le volume.
      while (restant > 0) {
        const e = memeMuscle().sort((a, b) => (a.sets || 0) - (b.sets || 0))[0];
        if (!e) break;
        e.sets = (e.sets || 0) + 1;
        restant--;
      }
    }
  }

  // Filet de sécurité : une séance sans aucun exercice ne doit JAMAIS sortir
  // d'ici, quelle qu'en soit la cause. Mieux vaut rendre une semaine plus courte
  // qu'une journée vide dans le programme. Les libellés (A, B…) sont numérotés
  // APRÈS ce filtrage, sinon il pouvait rester un « Haut du corps B » sans
  // « Haut du corps A » visible.
  const gardees = out.map((s, i) => ({ s, zone: zoneDe[i] })).filter(({ s }) => s.exercises.length);
  if (!gardees.length) return reordonne;

  const rang = { A: 0, B: 1, C: 2 };
  const compte = {};
  const totalParZone = gardees.reduce((acc, { zone }) => {
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {});
  return gardees.map(({ s, zone }) => {
    s.exercises.sort((a, b) => (rang[a.block] ?? 3) - (rang[b.block] ?? 3));
    const titre = zone === 'lower' ? 'Bas du corps' : 'Haut du corps';
    compte[titre] = (compte[titre] || 0) + 1;
    return {
      ...s,
      day_label: totalParZone[zone] > 1 ? `${titre} ${String.fromCharCode(64 + compte[titre])}` : titre,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// REPLI SANS MATÉRIEL
// Le catalogue est écrit pour deux contextes seulement (salle complète et poids
// du corps) ; tout le reste — home gym, haltères seuls, matériel personnalisé —
// retombe sur la version salle et se retrouvait donc avec des exercices de
// machines impossibles à faire. On remplace ici chaque mouvement infaisable par
// un équivalent qui n'exige AUCUN matériel (table SUBSTITUTIONS).
//
// Ce qui est CONSERVÉ du créneau d'origine : le muscle, les séries, les
// répétitions, le repos et le bloc. Seul le mouvement change — le programme
// garde donc exactement le même dosage.
//
// Les candidats sont essayés dans l'ordre : le premier qui convient au niveau de
// l'utilisateur gagne (un débutant reçoit les pompes piquées là où un avancé
// reçoit le handstand push-up).
function remplacerInfaisables(program, user) {
  const possede = equipementPossede(user?.equipment);
  const niveau = user?.level || 'intermediate';
  const parNom = new Map(EXERCISES.map((e) => [e.name, e]));

  let touche = false;
  const sessions = program.sessions.map((s) => {
    // Deux exercices infaisables peuvent viser le MÊME remplaçant (écarté poulie
    // et pec deck mènent tous deux à la pompe large). On tient donc à jour ce qui
    // est déjà dans la séance pour éviter d'y mettre deux fois le même mouvement.
    const pris = new Set(s.exercises.map((x) => x.name));
    const libre = (c) => c && exerciceFaisable(c, possede) && !pris.has(c.name);
    const bonNiveau = (c) => (c?.level || []).includes(niveau);

    const exercises = [];
    const fusions = [];
    for (const x of s.exercises) {
      const e = parNom.get(x.name);
      if (!e || exerciceFaisable(e, possede)) { exercises.push(x); continue; }

      const candidats = (SUBSTITUTIONS[x.name] || []).map((n) => parNom.get(n));
      // 1) un candidat désigné, du bon niveau et pas déjà là ;
      // 2) sinon un candidat désigné, pas déjà là ;
      // 3) sinon n'importe quel exercice sans matériel du même muscle — mieux
      //    vaut varier le mouvement que répéter deux fois le même dans la séance ;
      // 4) sinon on fusionne avec l'occurrence déjà présente (le volume est
      //    conservé, seul le nombre d'exercices baisse).
      const choisi = candidats.find((c) => libre(c) && bonNiveau(c))
        || candidats.find(libre)
        || EXERCISES.find((c) => cibleMuscle(c, x.muscle_group) && bonNiveau(c) && libre(c))
        || candidats.find((c) => c && exerciceFaisable(c, possede));
      if (!choisi) { exercises.push(x); continue; } // rien de mieux : on ne dégrade pas

      touche = true;
      const remplacant = {
        ...x,
        name: choisi.name,
        muscles_secondary: [...new Set((choisi.muscles?.secondary || []).map(appMuscle))]
          .filter((m) => m !== x.muscle_group),
      };
      if (pris.has(choisi.name)) fusions.push(remplacant);
      else { pris.add(choisi.name); exercises.push(remplacant); }
    }

    for (const f of fusions) {
      const cible = exercises.find((x) => x.name === f.name);
      if (cible) cible.sets = (cible.sets || 0) + (f.sets || 0);
      else exercises.push(f);
    }

    return touche ? { ...s, exercises } : s;
  });

  return touche ? { ...program, sessions } : program;
}

// Applique rotation + rognage aux séances d'un programme, une fois les jours
// attribués (le temps dispo dépend du jour). Retourne de NOUVELLES séances.
function shapeSessions(program, user, objectives, days, parite = 0) {
  const objRank = muscleObjectiveRank(objectives);
  // Type d'objectif par muscle → sert à étiqueter chaque séance. Le badge affiché
  // vient de `session.type` ; après réallocation ET bascule haut/bas, une journée
  // peut suivre un autre type que le programme d'origine (un « bas du corps »
  // programmé en endurance affichait encore « Hypertrophie »). On l'étiquette donc
  // ICI, en toute fin de chaîne, une fois les séances définitivement composées.
  const typeParMuscle = {};
  for (const o of objectives || []) {
    for (const m of musclesOfObjective(o)) if (!typeParMuscle[m]) typeParMuscle[m] = o.type;
  }
  const typeDeSeance = (exs, defaut) => {
    const poids = {};
    for (const x of exs) {
      const ty = typeParMuscle[x.muscle_group];
      if (ty) poids[ty] = (poids[ty] || 0) + (x.sets || 0);
    }
    return Object.entries(poids).sort((a, b) => b[1] - a[1])[0]?.[0] || defaut;
  };
  const durations = user?.duration_per_day || {};
  const noTimeLimit = user?.availability_optimal === true;
  // Compte les variantes d'une même séance (mêmes muscles) pour alterner le lead.
  const variantSeen = {};

  // Jours qui se suivent + mêmes muscles → bascule en haut/bas (voir plus haut).
  const base = splitConsecutiveSessions(program.sessions, days, parite, zonePrioritaire(objectives), user);

  return base.map((s, i) => {
    let exercises = s.exercises;

    const sig = [...new Set(exercises.map((x) => x.muscle_group))].sort().join('|');
    variantSeen[sig] = (variantSeen[sig] || 0) + 1;
    if (variantSeen[sig] % 2 === 0) exercises = rotateLeadIfSafe(exercises);

    if (!noTimeLimit) {
      const day = days[i % days.length];
      const available = Number(durations[day]) || 0;
      exercises = fitSessionToDuration(exercises, available, objRank, typeParMuscle, s.type);
    }

    const type = typeDeSeance(exercises, s.type);
    if (exercises === s.exercises && base === program.sessions && type === s.type) return s; // rien changé

    const seen = new Set();
    const active_zones = [];
    for (const x of exercises) {
      if (!seen.has(x.muscle_group)) { seen.add(x.muscle_group); active_zones.push({ muscle_group: x.muscle_group }); }
    }
    return { ...s, type, exercises, active_zones, estimated_duration: Math.round(sessionMinutes(exercises)) };
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
        // Objectifs qui NE sont pas des mouvements : ils doivent être servis eux
        // aussi, sinon « force squat + hypertrophie haut du corps » ne donnait que
        // du squat.
        const objectifsZone = (objectives || []).filter((o) => !toList(o.focus_movement).length);
        let prog = specializeMovements(base.program, movements, user, objectifsZone);
        if (objectifsZone.length) {
          const jours = pickDays(user, prog.sessions.length);
          prog = completerAvecObjectifs(prog, objectifsZone, user, jours);
        }
        match = { ...base, program: prog };
        specialized = true;
      }
    }
  }

  // Toute AUTRE combinaison absente du catalogue (force ou endurance sur une zone,
  // paires d'objectifs, muscles précis…) : on part du programme le plus proche et
  // on réalloue le volume vers les muscles ciblés. Le catalogue ne contient que 10
  // signatures alors que l'interface en laisse construire des dizaines — sans ce
  // repli, l'utilisateur recevait « aucun programme ne correspond ».
  if (!match && user) {
    const focus = focusMusclesFromObjectives(objectives);
    if (focus.primary.size) {
      const objPrimaire = (objectives || []).find((o) => o.priority !== 'secondary') || objectives?.[0];
      const type = objPrimaire?.type || 'hypertrophy';
      const catalog = await loadCatalog();
      const allFocus = new Set([...focus.primary, ...focus.secondary]);
      // La force n'existe au catalogue que sous forme de programme SBD : c'est lui
      // la meilleure base, on n'en gardera que les muscles visés.
      const base = type === 'strength'
        ? (pickStrengthBase(catalog, user, new Set()) || pickBaseProgram(catalog, user, type, coverZoneForMuscles(focus.primary), allFocus))
        : pickBaseProgram(catalog, user, type, coverZoneForMuscles(focus.primary), allFocus);
      if (base) {
        // Type d'objectif PAR MUSCLE : « hypertrophie haut + force bas » doit
        // programmer les jambes en force, pas en hypertrophie.
        // Pour un objectif de MOUVEMENT, seuls les muscles PRINCIPAUX du lift
        // héritent de sa programmation. Ses synergistes (triceps sur un développé,
        // quadriceps sur un soulevé) ne doivent pas passer en force : c'est le lift
        // qui est l'exercice de force, pas eux — sinon un objectif « endurance haut
        // du corps » posé à côté se retrouvait avec des dips en 2-4 répétitions.
        const musclesPourType = (o) => {
          const movs = toList(o.focus_movement);
          if (!movs.length) return musclesOfObjective(o);
          const set = new Set();
          for (const mv of movs) {
            const e = EXERCISES.find((x) => x.name === (MOVEMENT_TO_EXERCISE[mv] || mv));
            (e?.muscles?.primary || []).forEach((m) => set.add(appMuscle(m)));
          }
          return set;
        };
        const typeByMuscle = {};
        for (const o of objectives || []) {
          for (const m of musclesPourType(o)) if (!typeByMuscle[m]) typeByMuscle[m] = o.type || type;
        }
        match = { ...base, program: specializeProgram(base.program, focus, user, type, typeByMuscle) };
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
  // Jamais plus de séances que de jours disponibles : sinon `days[i % days.length]`
  // en reposait deux le MÊME jour. La troncature se fait AVANT la mise en forme —
  // sinon la bascule haut/bas décidait sur des séances qui allaient disparaître,
  // et la journée « bas du corps » pouvait être coupée (jambes perdues).
  const programLimite = p.sessions.length > days.length
    ? { ...p, sessions: p.sessions.slice(0, days.length) }
    : p;
  // Dernier filet AVANT la mise en forme : tout exercice que le matériel déclaré
  // ne permet pas est remplacé par un mouvement qui n'exige rien.
  const programFaisable = remplacerInfaisables(programLimite, user);
  // Deux variantes : une semaine sur deux, l'attribution haut/bas s'inverse. Sur
  // un nombre impair de séances, cela évite qu'une moitié du corps soit toujours
  // travaillée deux fois et l'autre une seule. Quand aucune bascule n'a eu lieu,
  // les deux variantes sont identiques et rien ne change.
  const shapedParite = [
    shapeSessions(programFaisable, user, objectives, days, 0),
    shapeSessions(programFaisable, user, objectives, days, 1),
  ];
  const sessions = [];
  for (let w = 1; w <= initialWeeks; w++) {
    const shaped = shapedParite[(w - 1) % 2];
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
    weekly_structure: structureReelle(shapedParite[0], mapStructure(p.split)),
    planned_weeks: INFINITE_WEEKS, // → programme en boucle (durée non définie)
    // Métadonnée uniquement (la gestion multi-objectifs est déjà bakée dans le
    // programme). 'simple' passe toujours la contrainte SQL programs_*_check.
    multi_objective_mode: 'simple',
    sessions,
    matched_program_name: p.name,
    specialized: specialized || undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GARDE-FOU TEMPS
// Certains couples (objectif × temps annoncé) sont matériellement impossibles :
// un objectif de FORCE demande 240 s de repos par série (TRAINING_PARAMS), donc
// même réduite au strict minimum une séance ne rentre pas en 30 min. Le rognage
// (fitSessionToDuration) a déjà tout donné à ce stade : ce qui dépasse encore ne
// peut être supprimé qu'en descendant sous le volume minimum efficace — la
// séance rentrerait dans le créneau mais ne ferait plus progresser.
// On prévient donc l'utilisateur AVANT, là où il peut encore changer sa durée ou
// ajouter un jour, plutôt que de lui livrer un programme qui ne tient pas ses
// promesses.
// On rejoue la vraie activation : aucune estimation, aucun chiffre en double.
export async function verifierBudgetTemps(user, objectives) {
  if (!user || user.availability_optimal === true) return { ok: true, problemes: [] };
  const durations = user.duration_per_day || {};
  if (!Object.keys(durations).length) return { ok: true, problemes: [] };

  let result = null;
  try {
    result = await buildActivationResult(user, objectives);
  } catch {
    return { ok: true, problemes: [] }; // jamais bloquer sur une erreur technique
  }
  if (!result) return { ok: true, problemes: [] }; // pas de programme → autre sujet

  const problemes = [];
  for (const s of result.sessions) {
    if (s.week !== 1) continue;
    const annonce = Number(durations[s.day]) || 0;
    if (!annonce || !s.exercises?.length) continue;
    const requis = sessionMinutes(s.exercises);
    // TOLÉRANCE = la durée d'UNE série de cette séance. En dessous, l'écart est
    // dans le bruit du modèle (échauffement forfaitaire, 40 s d'exécution par
    // série en moyenne) : il n'y a rien à corriger, et bloquer 45 min pour 46 min
    // demandées obligerait à passer au palier suivant (60 min) pour une minute.
    // Au-delà d'une série, l'écart est réel : il faudrait retirer du volume que
    // le rognage a déjà refusé d'enlever (on serait sous le minimum efficace).
    const uneSerie = Math.min(
      ...s.exercises.map((x) => ((x.rest_seconds || 90) + EXEC_SECONDS_PER_SET) / 60)
    );
    if (requis > annonce + uneSerie) {
      problemes.push({ jour: s.day, requis: Math.round(requis), annonce });
    }
  }
  return { ok: problemes.length === 0, problemes };
}
