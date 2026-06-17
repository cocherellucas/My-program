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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
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
import GifCheck from '@/pages/GifCheck';
import Login from '@/pages/Login';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
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
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>

      {splashVisible && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #2e1065 0%, #1e0050 100%)', gap: 24, opacity: splashOpacity, transition: 'opacity 0.6s ease', zIndex: 9999, pointerEvents: 'none' }}>
          <style>{`
            @keyframes splash-glow { 0%, 100% { box-shadow: 0 0 30px rgba(124,58,237,0.5); } 50% { box-shadow: 0 0 60px rgba(124,58,237,0.9), 0 0 100px rgba(168,85,247,0.4); } }
            @keyframes splash-fade { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          `}</style>
          <img src="/apple-touch-icon.png" alt="Coach IA" style={{ width: 100, height: 100, borderRadius: 24, animation: 'splash-glow 2s ease-in-out infinite' }} />
          <div style={{ textAlign: 'center', animation: 'splash-fade 0.5s ease 0.2s both' }}>
            <p style={{ color: 'white', fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>Coach IA</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '4px 0 0' }}>Ton assistant entraînement</p>
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <RestTimerProvider>
              <TutorialProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/*" element={<AuthenticatedApp />} />
                </Routes>
                <Toaster />
                <SonnerToaster position="top-center" />
                <TutorialOverlay />
              </TutorialProvider>
            </RestTimerProvider>
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
