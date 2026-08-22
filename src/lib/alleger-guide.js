// ─────────────────────────────────────────────────────────────────────────────
// GUIDE « COMMENT ALLÉGER UNE SEMAINE »
//
// Contrepartie de la décision du 2026-08-16 : l'app dit « allège cette semaine »
// à partir de ce qu'elle a mesuré, mais ne prescrit plus quoi retirer, sur quel
// exercice. Un débutant qui lit « allège » sans savoir comment se retrouve
// bloqué — d'où ce guide générique, au même endroit que celui des techniques
// avancées (Paramètres). L'app rapporte, le guide explique.
//
// Le contenu ne dépend d'aucune donnée utilisateur : c'est volontaire. Dès qu'il
// dépendrait du programme, on retomberait dans la prescription par exercice.
//
// ORDRE DES LEVIERS : il reprend celui de l'échelle douleur (charge → séries →
// fréquence), déjà en place dans pain-engine. Une seule logique à retenir pour
// l'utilisateur, et pas deux hiérarchies contradictoires dans la même app.
// ─────────────────────────────────────────────────────────────────────────────

export const LEVIERS = [
  {
    id: 'charge',
    ordre: 1,
    titre: { fr: 'Baisse la charge', en: 'Cut the load' },
    quoi: {
      fr: 'Retire 10 à 20 % sur tes exercices lourds. Garde le même nombre de séries et de répétitions.',
      en: 'Take 10–20% off your heavy lifts. Keep the same number of sets and reps.',
    },
    pourquoi: {
      fr: "C'est le levier le moins coûteux : tu gardes le geste, le rythme et l'habitude. Le muscle garde son signal, les articulations et le système nerveux soufflent.",
      en: "It's the cheapest lever: you keep the movement, the rhythm and the habit. The muscle keeps its signal while your joints and nervous system get a break.",
    },
    quand: {
      fr: 'À essayer en premier, presque toujours.',
      en: 'Try this first, almost always.',
    },
  },
  {
    id: 'series',
    ordre: 2,
    titre: { fr: 'Retire des séries', en: 'Drop some sets' },
    quoi: {
      fr: "Enlève 1 à 2 séries par exercice, en commençant par tes exercices d'isolation (ceux de fin de séance).",
      en: 'Remove 1–2 sets per exercise, starting with your isolation work (the end-of-session exercises).',
    },
    pourquoi: {
      fr: "Le volume total est ce qui fatigue le plus. Retirer des séries d'isolation coûte peu en résultats : ce sont tes exercices principaux qui font le travail.",
      en: 'Total volume is what tires you most. Cutting isolation sets costs little: your main lifts do the work.',
    },
    quand: {
      fr: 'Si baisser la charge ne suffit pas, ou si tes séances sont devenues trop longues.',
      en: "If cutting the load isn't enough, or if your sessions have got too long.",
    },
  },
  {
    id: 'frequence',
    ordre: 3,
    titre: { fr: 'Espace les séances', en: 'Space your sessions out' },
    quoi: {
      fr: "Saute une séance, ou repousse-la d'un jour. Sur une semaine, passe de 4 séances à 3.",
      en: 'Skip a session, or push it back a day. Over a week, go from 4 sessions to 3.',
    },
    pourquoi: {
      fr: "C'est le levier le plus fort, donc le dernier : il enlève à la fois le volume et le stimulus. Efficace quand la fatigue est générale et pas liée à un exercice.",
      en: "It's the strongest lever, so the last one: it removes both volume and stimulus. Useful when fatigue is general rather than tied to one exercise.",
    },
    quand: {
      fr: 'Quand la fatigue déborde de la salle : sommeil, humeur, motivation.',
      en: 'When the fatigue spills outside the gym: sleep, mood, motivation.',
    },
  },
  {
    id: 'repos',
    ordre: 4,
    titre: { fr: 'Arrête complètement', en: 'Stop entirely' },
    quoi: {
      fr: '3 à 5 jours sans entraînement de résistance. Marche, étire-toi, dors.',
      en: '3 to 5 days with no resistance training. Walk, stretch, sleep.',
    },
    pourquoi: {
      fr: "Tu ne perds pas de muscle en une semaine — c'est un mythe tenace. Tu perds un peu de sensation les 2 premières séances au retour, et tu la récupères aussitôt.",
      en: "You don't lose muscle in a week — that myth won't die. You lose a bit of feel for the first 2 sessions back, and it returns immediately.",
    },
    quand: {
      fr: "Quand l'app te dit « repos conseillé », ou quand l'envie d'y aller a disparu.",
      en: 'When the app says "rest recommended", or when the urge to train has gone.',
    },
  },
];

// Idées reçues à désamorcer — c'est ce qui empêche les gens d'alléger.
export const IDEES_RECUES = [
  {
    id: 'perdre',
    mythe: { fr: 'Je vais perdre mes gains', en: "I'll lose my gains" },
    reponse: {
      fr: "Non. La masse musculaire ne bouge pas sur une semaine allégée, et la force revient en 1 à 2 séances. C'est s'entraîner fatigué pendant des mois qui coûte des résultats, pas une semaine plus calme.",
      en: 'No. Muscle mass does not move over one lighter week, and strength comes back within 1–2 sessions. Training tired for months is what costs you results, not one calmer week.',
    },
  },
  {
    id: 'meriter',
    mythe: { fr: "Je n'ai pas assez travaillé pour mériter une décharge", en: "I haven't earned a deload" },
    reponse: {
      fr: "Une décharge n'est pas une récompense, c'est un outil. Elle se déclenche sur des signaux — fatigue, perfs qui baissent, sommeil — pas sur un quota de souffrance.",
      en: "A deload isn't a reward, it's a tool. It's triggered by signals — fatigue, dropping numbers, sleep — not by a suffering quota.",
    },
  },
  {
    id: 'rythme',
    mythe: { fr: 'Si je m\'arrête, je ne reprendrai jamais', en: "If I stop, I'll never start again" },
    reponse: {
      fr: "C'est justement pour ça que l'ordre compte : baisse d'abord la charge, garde tes séances et ton créneau. L'arrêt complet est le dernier recours, pas le premier réflexe.",
      en: "That's exactly why the order matters: cut the load first, keep your sessions and your slot. Stopping entirely is the last resort, not the first move.",
    },
  },
];
