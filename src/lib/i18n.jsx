// ─────────────────────────────────────────────────────────────────────────────
// i18n maison, sans dépendance : contexte de langue + dictionnaires plats.
// Usage : const { t, lang, setLang } = useI18n();  puis  t('nav_home')
// Clé absente → repli sur le français, puis sur la clé elle-même (jamais vide).
// La langue est persistée localement (app_lang) et suit l'appareil.
// Migration progressive : les écrans non traduits restent en français.
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LANG_KEY = 'app_lang';

const DICT = {
  fr: {
    // Navigation
    nav_home: 'Accueil', nav_program: 'Programme', nav_session: 'Séance',
    nav_coach: 'Coach', nav_library: 'Biblio', nav_profile: 'Profil',
    // Accueil
    dash_hello: 'Salut', dash_sub: "Voici ton tableau de bord d'entraînement",
    stat_completed: 'Séances complétées', stat_adherence: 'Adhérence',
    stat_fatigue: 'Fatigue moy.', stat_week: 'Cette semaine',
    today_session: 'Séance du jour', next_session: 'Prochaine séance',
    rest_today: "Repos aujourd'hui", rest_sub: 'Aucune séance prévue — profites-en pour récupérer.',
    start_session: 'Commencer la séance', resume_session: 'Reprendre la séance',
    alerts: 'Alertes', alerts_ok: 'Tout va bien ! Aucune alerte pour le moment.',
    active_program: 'Programme actif',
    type_hypertrophy: 'Hypertrophie', type_strength: 'Force', type_endurance: 'Endurance', type_mixed: 'Mixte',
    struct_full_body: 'Full Body', struct_upper_lower: 'Upper / Lower', struct_ppl: 'PPL', struct_arnold_split: 'Arnold Split', struct_custom: 'Personnalisé',
    no_program_title: 'Pas encore de programme', no_program_sub: 'Crée ton premier programme pour planifier tes séances.',
    create_program: 'Créer un programme',
    prog_infinite: 'Cycle ∞', prog_weeks: 'sem.', per_week: '/semaine', session_word: 'séance', sessions_word: 'séances',
    checkin_title: 'Check-in 24h', checkin_sub: "Comment tu te sens aujourd'hui ?",
    checkin_recovery: 'Récupération musculaire', checkin_sleep: 'Sommeil',
    opt_better: 'Mieux', opt_same: 'Pareil', opt_stiffer: 'Plus raide',
    opt_good: 'Bonne', opt_average: 'Moyenne', opt_bad: 'Mauvaise',
    checkin_sleep_night: 'Nuit de sommeil', checkin_save: 'Enregistrer',
    apply: 'Appliquer', do_myself: 'Le faire moi-même', ignore: 'Ignorer', got_it: 'Compris',
    pain_sub: 'Ta réponse ajuste la suite : charge, séries, fréquence.',
    pain_better: '😌 Mieux', pain_same: '😐 Pareil', pain_worse: '😣 Pire', pain_sharp: '⚡ Douleur vive',
    zone_wrists: 'ton poignet', zone_shoulders: 'ton épaule', zone_elbows: 'ton coude',
    zone_knees: 'ton genou', zone_lower_back: 'ton bas du dos', zone_neck: 'ta nuque',
    // Paramètres
    set_title: 'Paramètres',
    set_lang: 'Langue', set_lang_hint: "Langue de l'interface.",
    lang_confirm_title: 'Changer de langue ?',
    lang_confirm_sub: "L'application va être relancée pour appliquer la nouvelle langue.",
    lang_confirm_yes: 'Relancer',
    set_session: 'Séance', set_coach_tips: 'Conseils du coach en séance',
    set_coach_tips_hint: "Bulle qui te suggère d'ajuster repos/poids selon tes performances.",
    set_coach: 'Coach', set_memory: 'Mémoire du coach',
    set_memory_hint: 'Préférences, douleurs suivies, historique fatigue, bilans.',
    set_tutorials: 'Tutoriels',
    tuto_import: 'Importation de séances', tuto_import_hint: "Rejoue à la prochaine ouverture de l'importation (Programme → Modifier / Importer).",
    tuto_coach: 'Conseils du coach en séance', tuto_coach_hint: 'Rejoue quand un conseil apparaîtra pendant une séance.',
    tuto_profile: 'Création du profil', tuto_profile_hint: "Rejoue à la prochaine visite de l'étape profil.",
    tuto_objectives: 'Choix des objectifs', tuto_objectives_hint: "Rejoue à la prochaine visite de l'étape objectifs.",
    tuto_reset_done: 'Réinitialisé — il rejouera à sa prochaine occasion.',
    tuto_all: 'Revoir tous les tutoriels', tuto_all_hint: "Réinitialise tout (l'app se recharge).",
    tuto_all_confirm: "Relancer tous les tutoriels ? L'app va se recharger et les explications réapparaîtront aux endroits concernés.",
    tuto_all_yes: 'Oui, tout revoir', cancel: 'Annuler',
    set_legal: 'Juridique',
    legal_cgu: "Conditions d'utilisation", legal_privacy: 'Politique de confidentialité', legal_mentions: 'Mentions légales',
    set_account: 'Compte', account_email: 'Email', account_since: 'Membre depuis', account_plan: 'Plan',
    logout: 'Déconnexion', logout_confirm: 'Se déconnecter ?',
    logout_sub: 'Tu devras te reconnecter pour accéder à ton compte.', logout_yes: 'Se déconnecter',
    // Login
    login_title: 'Connexion', signup_title: 'Créer un compte',
    email: 'Email', password: 'Mot de passe',
    login_btn: 'Se connecter', signup_btn: 'Créer le compte',
    no_account: 'Pas encore de compte ?', have_account: 'Déjà un compte ?',
    accept_1: "J'accepte les", accept_and: 'et la',
    accept_3: "et j'ai lu l'avertissement santé (consulter un médecin avant de commencer un programme).",
  },
  en: {
    // Navigation
    nav_home: 'Home', nav_program: 'Program', nav_session: 'Workout',
    nav_coach: 'Coach', nav_library: 'Library', nav_profile: 'Profile',
    // Accueil
    dash_hello: 'Hi', dash_sub: 'Here is your training dashboard',
    stat_completed: 'Completed workouts', stat_adherence: 'Adherence',
    stat_fatigue: 'Avg. fatigue', stat_week: 'This week',
    today_session: "Today's workout", next_session: 'Next workout',
    rest_today: 'Rest day', rest_sub: 'No workout planned — enjoy the recovery.',
    start_session: 'Start workout', resume_session: 'Resume workout',
    alerts: 'Alerts', alerts_ok: 'All good! No alerts for now.',
    active_program: 'Active program',
    type_hypertrophy: 'Hypertrophy', type_strength: 'Strength', type_endurance: 'Endurance', type_mixed: 'Mixed',
    struct_full_body: 'Full Body', struct_upper_lower: 'Upper / Lower', struct_ppl: 'PPL', struct_arnold_split: 'Arnold Split', struct_custom: 'Custom',
    no_program_title: 'No program yet', no_program_sub: 'Create your first program to plan your workouts.',
    create_program: 'Create a program',
    prog_infinite: 'Cycle ∞', prog_weeks: 'wk', per_week: '/week', session_word: 'workout', sessions_word: 'workouts',
    checkin_title: '24h check-in', checkin_sub: 'How do you feel today?',
    checkin_recovery: 'Muscle recovery', checkin_sleep: 'Sleep',
    opt_better: 'Better', opt_same: 'Same', opt_stiffer: 'Stiffer',
    opt_good: 'Good', opt_average: 'Average', opt_bad: 'Poor',
    checkin_sleep_night: "Night's sleep", checkin_save: 'Save',
    apply: 'Apply', do_myself: "I'll do it myself", ignore: 'Ignore', got_it: 'Got it',
    pain_sub: 'Your answer adjusts what comes next: load, sets, frequency.',
    pain_better: '😌 Better', pain_same: '😐 Same', pain_worse: '😣 Worse', pain_sharp: '⚡ Sharp pain',
    zone_wrists: 'your wrist', zone_shoulders: 'your shoulder', zone_elbows: 'your elbow',
    zone_knees: 'your knee', zone_lower_back: 'your lower back', zone_neck: 'your neck',
    // Paramètres
    set_title: 'Settings',
    set_lang: 'Language', set_lang_hint: 'Interface language.',
    lang_confirm_title: 'Change language?',
    lang_confirm_sub: 'The app will restart to apply the new language.',
    lang_confirm_yes: 'Restart',
    set_session: 'Workout', set_coach_tips: 'Coach tips during workouts',
    set_coach_tips_hint: 'Bubble suggesting rest/weight adjustments based on your performance.',
    set_coach: 'Coach', set_memory: "Coach's memory",
    set_memory_hint: 'Preferences, tracked pains, fatigue history, reviews.',
    set_tutorials: 'Tutorials',
    tuto_import: 'Importing workouts', tuto_import_hint: 'Replays next time you open the import (Program → Edit / Import).',
    tuto_coach: 'Coach tips during workouts', tuto_coach_hint: 'Replays when a tip appears during a workout.',
    tuto_profile: 'Profile creation', tuto_profile_hint: 'Replays on your next visit to the profile step.',
    tuto_objectives: 'Choosing goals', tuto_objectives_hint: 'Replays on your next visit to the goals step.',
    tuto_reset_done: 'Reset — it will replay at its next occasion.',
    tuto_all: 'Replay all tutorials', tuto_all_hint: 'Resets everything (the app reloads).',
    tuto_all_confirm: 'Replay all tutorials? The app will reload and explanations will reappear where relevant.',
    tuto_all_yes: 'Yes, replay all', cancel: 'Cancel',
    set_legal: 'Legal',
    legal_cgu: 'Terms of use', legal_privacy: 'Privacy policy', legal_mentions: 'Legal notice',
    set_account: 'Account', account_email: 'Email', account_since: 'Member since', account_plan: 'Plan',
    logout: 'Log out', logout_confirm: 'Log out?',
    logout_sub: 'You will need to sign in again to access your account.', logout_yes: 'Log out',
    // Login
    login_title: 'Sign in', signup_title: 'Create an account',
    email: 'Email', password: 'Password',
    login_btn: 'Sign in', signup_btn: 'Create account',
    no_account: 'No account yet?', have_account: 'Already have an account?',
    accept_1: 'I accept the', accept_and: 'and the',
    accept_3: 'and I have read the health warning (consult a doctor before starting a program).',
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'fr'; } catch { return 'fr'; }
  });
  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch {}
  }, []);
  const t = useCallback((key) => DICT[lang]?.[key] ?? DICT.fr[key] ?? key, [lang]);
  // La langue du document suit la langue active (clavier/autocorrect/lecteurs d'écran)
  useEffect(() => { try { document.documentElement.lang = lang; } catch {} }, [lang]);
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

// Repli sûr si un composant est rendu hors provider (jamais d'écran cassé)
export const useI18n = () => useContext(I18nContext) || { lang: 'fr', setLang: () => {}, t: (k) => DICT.fr[k] ?? k };
