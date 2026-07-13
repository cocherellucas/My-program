import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#1a0030', color: '#ff6b6b', minHeight: '100vh' }}>
          <h2 style={{ color: '#ff4444' }}>Erreur détectée :</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 13 }}>
            {this.state.error?.message}{'\n\n'}{this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { base44 } from '@/api/base44Client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { I18nProvider } from '@/lib/i18n';
import { TERMS_VERSION, markTermsAcceptedLocal, getLocalAcceptedVersion, hasAcceptedCurrentTerms } from '@/lib/terms';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import OfflineIndicator from '@/components/OfflineIndicator';
import AppLayout from '@/components/layout/AppLayout';
import { RestTimerProvider } from '@/lib/RestTimerContext';
import { TutorialProvider } from '@/lib/TutorialContext';
import TutorialOverlay from '@/components/TutorialOverlay';
import Dashboard from '@/pages/Dashboard';
import Onboarding from '@/pages/Onboarding';
import Program from '@/pages/Program';
import SessionLog from '@/pages/SessionLog';
import CoachIA from '@/pages/CoachIA';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';
import Memory from '@/pages/Memory';
import Pricing from '@/pages/Pricing';
import AdminPricing from '@/pages/AdminPricing';
import Library from '@/pages/Library';
import Settings from '@/pages/Settings';
import TechniquesGuide from '@/pages/TechniquesGuide';
import GifCheck from '@/pages/GifCheck';
import Login from '@/pages/Login';
import Legal from '@/pages/Legal';

// Champs de profil remis à zéro par ?resetProfile (on préserve identité, rôle, abonnement)
const PROFILE_RESET_FIELDS = {
  gender: null, age: null, height: null, weight: null, level: null,
  equipment: null, equipment_validated: null,
  available_days: null, duration_per_day: null, same_duration_all: null,
  frequency_min: null, frequency_max: null, availability_optimal: null,
  shoulders: null, waist: null, hips: null,
  right_arm: null, left_arm: null, right_thigh: null, left_thigh: null,
  preferred_exercises: null, disliked_exercises: null, no_volume_muscles: null, fragile_zones: null,
  morphology_arm_length: null, morphology_leg_length: null, morphology_silhouette: null, morphology_posture: null,
  accepts_advanced_techniques: null, peaking_enabled: null,
  pref_volume: null, pref_intensity: null, pref_frequency: null,
  volume_mode: null, volume_overrides: null,
  onboarding_completed: false, onboarding_step: 0,
  accepted_terms_at: null, accepted_terms_version: 0, // un « repart à neuf » redemande les CGU
  cycle_tracking_enabled: null, cycle_last_period_date: null, cycle_avg_length: null, cycle_hormonal_contraception: null,
};
const RESET_USER_ENTITIES = ['Objective', 'SeriesLog', 'Session', 'Program', 'Measurement', 'SavedProgram', 'UserMemory'];
const RESET_LOCALSTORAGE_KEYS = [
  'onboarding_draft', 'tutorial_state', 'program_generated_snapshot', 'pending_program_regen',
  'imported_program_ids', '_import_form', '_import_scroll', 'active_session_id',
  'accepted_terms_v1', 'accepted_terms_version', // rejoue le portail CGU
];

// updateMe tolérant : certains champs de PROFILE_RESET_FIELDS ne sont pas des
// colonnes de `profiles` (mensurations, objectifs, equipment_validated… stockés
// ailleurs). PostgREST renvoie alors PGRST204 « Could not find the 'X' column »
// et rejette TOUTE la requête. On retire la colonne fautive et on réessaie, pour
// que les vrais champs (onboarding_completed, accepted_terms_at…) soient bien remis à zéro.
async function updateMeTolerant(fields) {
  let payload = { ...fields };
  for (let i = 0; i < 30 && Object.keys(payload).length; i++) {
    try { await base44.auth.updateMe(payload); return; }
    catch (e) {
      const col = (e?.message || '').match(/Could not find the '([^']+)' column/)?.[1];
      if (col && col in payload) { delete payload[col]; continue; }
      throw e; // autre erreur → on remonte
    }
  }
}

// ?resetProfile → repart à neuf : efface profil + objectifs + programme + séances, puis onboarding
async function runProfileReset() {
  const me = await base44.auth.me();
  const uid = me.id;
  // Données générées par l'utilisateur (chaque entité isolée pour qu'un échec n'arrête pas tout)
  for (const name of RESET_USER_ENTITIES) {
    try {
      let batch;
      do {
        batch = await base44.entities[name].filter({ user_id: uid });
        if (!batch.length) break;
        await Promise.all(batch.map(r => base44.entities[name].delete(r.id)));
      } while (batch.length);
    } catch (err) { console.warn('[resetProfile] entité ignorée :', name, err); }
  }
  await updateMeTolerant(PROFILE_RESET_FIELDS);
  RESET_LOCALSTORAGE_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch {} });
}

// ─── Portail d'acceptation des CGU (rattrapage : anciens comptes, autre appareil,
// ou nouvelle version des documents) ─────────────────────────────────────────
// L'acceptation est enregistrée côté serveur (profiles.accepted_terms_at +
// accepted_terms_version) pour être opposable ; repli localStorage si la colonne
// n'existe pas encore (l'app ne doit jamais être bloquée par une migration).
function TermsGate({ onAccepted }) {
  const [busy, setBusy] = React.useState(false);
  const accept = async () => {
    setBusy(true);
    try { await base44.auth.updateMe({ accepted_terms_at: new Date().toISOString(), accepted_terms_version: TERMS_VERSION }); }
    catch (e) { console.warn('[terms] colonnes accepted_terms_* absentes ?', e); }
    markTermsAcceptedLocal();
    onAccepted();
  };
  const openDoc = (doc) => { window.location.href = `/legal?doc=${doc}`; };
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-5" style={{ background: 'linear-gradient(160deg, #2e1065 0%, #1e0050 100%)' }}>
      <div className="w-full max-w-sm rounded-2xl bg-white/10 border border-white/20 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <img src="/robotapp.png" alt="Coach IA" className="w-10 h-10 rounded-xl object-cover" />
          <h2 className="font-heading font-bold text-lg text-white leading-tight">Avant de commencer</h2>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          Pour utiliser Coach IA, tu dois accepter nos conditions. Important : l'app donne des conseils d'entraînement <span className="font-semibold text-white">informatifs</span>, pas d'avis médical — consulte un médecin avant de commencer un programme, et arrête en cas de douleur vive.
        </p>
        <div className="space-y-1.5">
          <button onClick={() => openDoc('cgu')} className="w-full text-left text-sm text-white underline underline-offset-2 hover:text-white/80">Conditions d'utilisation</button>
          <button onClick={() => openDoc('confidentialite')} className="w-full text-left text-sm text-white underline underline-offset-2 hover:text-white/80">Politique de confidentialité</button>
          <button onClick={() => openDoc('mentions')} className="w-full text-left text-sm text-white underline underline-offset-2 hover:text-white/80">Mentions légales</button>
        </div>
        <button onClick={accept} disabled={busy}
          className="w-full py-3 rounded-xl text-sm font-bold bg-white text-violet-700 hover:bg-white/90 transition-colors disabled:opacity-60">
          {busy ? 'Un instant…' : "J'ai lu et j'accepte"}
        </button>
        <p className="text-[11px] text-white/40 leading-snug">En acceptant, tu consens aussi au traitement de tes données de santé (mensurations, fatigue, douleurs — et suivi de cycle menstruel uniquement si tu l'actives, avec un consentement dédié) pour personnaliser ton entraînement, comme décrit dans la politique de confidentialité.</p>
      </div>
    </div>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, user, isAuthenticated } = useAuth();

  // CGU : bloquant tant que la version courante n'est pas acceptée (preuve
  // serveur OU relais local). Le portail ne s'affiche donc qu'aux comptes sans
  // preuve (anciens, autre appareil) ou quand TERMS_VERSION a été incrémentée.
  const [termsAccepted, setTermsAccepted] = React.useState(() => getLocalAcceptedVersion() >= TERMS_VERSION);
  const needsTerms = isAuthenticated && !!user && !hasAcceptedCurrentTerms(user) && !termsAccepted;

  // Preuve serveur : si l'utilisateur a accepté (au signup, relayé en local) mais
  // que le serveur ne le sait pas encore pour cette version, on l'écrit en silence
  // à la 1ʳᵉ connexion authentifiée (au signup il n'y avait pas de session).
  React.useEffect(() => {
    if (!isAuthenticated || !user) return;
    const serverVersion = Number(user.accepted_terms_version ?? 0);
    if (serverVersion >= TERMS_VERSION) return;
    if (getLocalAcceptedVersion() < TERMS_VERSION) return; // pas encore accepté → le portail s'en charge
    base44.auth.updateMe({ accepted_terms_at: new Date().toISOString(), accepted_terms_version: TERMS_VERSION })
      .catch((e) => console.warn('[terms] enregistrement serveur différé (colonnes absentes ?)', e));
  }, [isAuthenticated, user]);

  // Réinitialisation complète via ?resetProfile
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('resetProfile')) return;
    (async () => {
      try {
        await runProfileReset();
        // Repart vraiment de zéro : on déconnecte et on revient à l'écran de
        // connexion (choix de langue → CGU → onboarding, comme un nouvel arrivant).
        base44.auth.logout('/login');
      } catch (e) {
        console.error('[resetProfile] erreur :', e);
        alert(`Erreur lors de la réinitialisation : ${e?.message || e}`);
      }
    })();
  }, []);

  const [minDelay, setMinDelay] = React.useState(true);
  const [splashVisible, setSplashVisible] = React.useState(true);
  const [splashOpacity, setSplashOpacity] = React.useState(1);
  const splashDone = React.useRef(false);

  React.useEffect(() => { const t = setTimeout(() => setMinDelay(false), 2000); return () => clearTimeout(t); }, []);

  const isSplash = isLoadingPublicSettings || isLoadingAuth || minDelay;

  React.useEffect(() => {
    if (!isSplash && !splashDone.current) {
      splashDone.current = true;
      setSplashOpacity(0);
      const t = setTimeout(() => {
        setSplashVisible(false);
        document.body.style.background = '';
        document.documentElement.style.background = '';
      }, 600);
      return () => clearTimeout(t);
    }
  }, [isSplash]);

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      {/* CGU non acceptées → portail bloquant (après le splash) */}
      {needsTerms && !isSplash && <TermsGate onAccepted={() => setTermsAccepted(true)} />}
      <div style={{ opacity: splashVisible ? 0 : 1, transition: 'opacity 0.5s ease', pointerEvents: splashVisible ? 'none' : 'auto' }}>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/program" element={<Program />} />
            <Route path="/session" element={<SessionLog />} />
            <Route path="/coach" element={<CoachIA />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/admin/pricing" element={<AdminPricing />} />
            <Route path="/library" element={<Library />} />
            <Route path="/gif-check" element={<GifCheck />} />
          </Route>
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/techniques" element={<TechniquesGuide />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>

      {splashVisible && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #2e1065 0%, #1e0050 100%)', gap: 24, opacity: splashOpacity, transition: 'opacity 0.6s ease', zIndex: 9999, pointerEvents: 'none' }}>
          <style>{`
            @keyframes splash-glow { 0%, 100% { box-shadow: 0 0 30px rgba(124,58,237,0.5); } 50% { box-shadow: 0 0 60px rgba(124,58,237,0.9), 0 0 100px rgba(168,85,247,0.4); } }
            @keyframes splash-fade { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          `}</style>
          <img src="/logo-complet.png" alt="Coach IA — Ton assistant entraînement"
            style={{ width: 300, maxWidth: '78vw', animation: 'splash-fade 0.5s ease both' }} />
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
      <I18nProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <RestTimerProvider>
              <TutorialProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  {/* Pages légales : consultables SANS compte (exigence légale) */}
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/*" element={<AuthenticatedApp />} />
                </Routes>
                <Toaster />
                <SonnerToaster position="top-center" />
                <TutorialOverlay />
                <OfflineIndicator />
              </TutorialProvider>
            </RestTimerProvider>
          </Router>
        </QueryClientProvider>
      </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
