// ─────────────────────────────────────────────────────────────────────────────
// Moteur de cycle menstruel — 100 % règles codées, aucune IA.
//
// Principe physiologique clé : la phase lutéale est quasi fixe (~14 jours),
// c'est la folliculaire qui varie → ovulation estimée = durée du cycle − 14
// (jamais « J14 » en dur).
//
// Le moteur ne fait QUE des conseils : rien n'est jamais appliqué au programme.
// Sous contraception hormonale, pas de cycle hormonal naturel → pas de phases.
// Fonctions pures (testables sans UI) ; textes bilingues {fr,en} portés par le
// moteur (même approche que pain-engine.js).
// ─────────────────────────────────────────────────────────────────────────────

export const CYCLE_MIN = 21;
export const CYCLE_MAX = 35;
export const CYCLE_DEFAULT = 28;
const DAY_MS = 86400000;
const GRACE_DAYS = 5; // au-delà de durée+5 j sans recalage → on coupe les conseils

export const PHASES = {
  period: { emoji: '🩸', name: { fr: 'Règles', en: 'Period' } },
  follicular: { emoji: '📈', name: { fr: 'Phase folliculaire', en: 'Follicular phase' } },
  ovulation: { emoji: '🎯', name: { fr: "Fenêtre d'ovulation", en: 'Ovulation window' } },
  luteal: { emoji: '🌗', name: { fr: 'Phase lutéale', en: 'Luteal phase' } },
  pms: { emoji: '🌧️', name: { fr: 'Pré-règles', en: 'Premenstrual' } },
};

const ADVICE = {
  period: {
    fr: "Énergie parfois basse pendant les règles : réduire un peu est OK, et bouger fait souvent du bien. Écoute ton corps, zéro pression.",
    en: 'Energy can be lower during your period: easing off is fine, and moving often helps. Listen to your body — no pressure.',
  },
  follicular: {
    fr: 'C\'est ta meilleure fenêtre du cycle : récupération et force au top. Bon moment pour charger et tenter des records.',
    en: 'This is your best window of the cycle: recovery and strength peak. Great time to go heavy and chase PRs.',
  },
  ovulation: {
    fr: 'Perfs souvent au sommet, mais ligaments plus laxes : échauffement soigné et technique stricte sur squats profonds, fentes et sauts (protège tes genoux).',
    en: 'Performance often peaks, but ligaments are laxer: warm up thoroughly and keep strict form on deep squats, lunges and jumps (protect your knees).',
  },
  luteal: {
    fr: "Température un peu plus haute, cardio parfois plus dur : maintiens tes charges sans t'inquiéter si ça stagne — c'est normal.",
    en: "Body temperature is slightly higher and cardio can feel harder: maintain your loads and don't worry if progress stalls — it's normal.",
  },
  pms: {
    fr: 'Énergie et sommeil variables ces jours-ci : une séance légère vaut mieux qu\'une séance sautée, et réduire est OK. Zéro culpabilité.',
    en: 'Energy and sleep can vary these days: a light session beats a skipped one, and scaling down is fine. Zero guilt.',
  },
};

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

// Date locale YYYY-MM-DD — PAS toISOString() : la conversion UTC ferait reculer
// d'un jour tout recalage effectué avant ~2 h du matin en France (UTC+1/+2).
const toLocalISO = (d) => {
  const x = startOfDay(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};

// Calcule l'état du cycle pour un profil. Renvoie null si le suivi ne
// s'applique pas (désactivé, contraception hormonale, données manquantes).
export function computeCycle(profile, today = new Date()) {
  if (!profile?.cycle_tracking_enabled) return null;
  if (profile.cycle_hormonal_contraception) return null; // pas de cycle naturel → pas de phases
  if (!profile.cycle_last_period_date) return null;

  const last = startOfDay(new Date(profile.cycle_last_period_date));
  if (Number.isNaN(last.getTime())) return null;

  const L = Math.min(CYCLE_MAX, Math.max(CYCLE_MIN, Number(profile.cycle_avg_length) || CYCLE_DEFAULT));
  const daysSince = Math.floor((startOfDay(today) - last) / DAY_MS) + 1;
  if (daysSince < 1) return null; // date dans le futur (l'UI l'empêche)

  // Retard au-delà de la période de grâce → les phases seraient fausses :
  // aucun conseil, juste l'invitation à recaler (jamais « tes règles sont en retard »).
  if (daysSince > L + GRACE_DAYS) {
    return { day: daysSince, length: L, phase: null, needsReanchor: true, inGrace: false };
  }

  const ovu = L - 14;
  let phase;
  let inGrace = false;
  if (daysSince > L) { phase = 'pms'; inGrace = true; } // grâce : on prolonge le conseil SPM
  else if (daysSince <= 5) phase = 'period';
  else if (Math.abs(daysSince - ovu) <= 1) phase = 'ovulation';
  else if (daysSince > L - 5) phase = 'pms';
  else if (daysSince < ovu) phase = 'follicular';
  else phase = 'luteal';

  return {
    day: daysSince,
    length: L,
    phase,
    emoji: PHASES[phase].emoji,
    name: PHASES[phase].name,
    advice: ADVICE[phase],
    needsReanchor: false,
    inGrace,
  };
}

// « Mes règles ont commencé » → champs profil à sauvegarder : recale J1 à
// aujourd'hui et apprend doucement la durée réelle (lissage 2/3 ancien + 1/3
// observé, uniquement si la longueur observée est plausible).
export function reanchor(profile, today = new Date()) {
  const fields = { cycle_last_period_date: toLocalISO(today) };
  const L = Math.min(CYCLE_MAX, Math.max(CYCLE_MIN, Number(profile?.cycle_avg_length) || CYCLE_DEFAULT));
  const last = profile?.cycle_last_period_date ? startOfDay(new Date(profile.cycle_last_period_date)) : null;
  if (last && !Number.isNaN(last.getTime())) {
    const observed = Math.floor((startOfDay(today) - last) / DAY_MS);
    if (observed >= CYCLE_MIN && observed <= CYCLE_MAX) {
      fields.cycle_avg_length = Math.round((2 * L + observed) / 3);
    }
  }
  return fields;
}
