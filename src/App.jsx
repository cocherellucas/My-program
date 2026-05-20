import React from 'react';
import { Toaster } from "@/components/ui/toaster"

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
  React.useEffect(() => { const t = setTimeout(() => setMinDelay(false), 2000); return () => clearTimeout(t); }, []);

  if (isLoadingPublicSettings || isLoadingAuth || minDelay) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #2e1065 0%, #1e0050 100%)', gap: 20 }}>
        <style>{`
          @keyframes splash-ping { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.5); opacity: 0; } }
          @keyframes splash-ping2 { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.9); opacity: 0; } }
          @keyframes splash-arc { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes splash-arc2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes splash-fade { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
        `}</style>
        <div style={{ position: 'relative', width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', animation: 'splash-ping 2s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', animation: 'splash-ping2 2.6s ease-in-out infinite 0.4s' }} />
          <div style={{ position: 'absolute', inset: 8, animation: 'splash-arc 3s linear infinite' }}>
            <svg viewBox="0 0 60 60" fill="none" style={{ width: '100%', height: '100%' }}>
              <circle cx="30" cy="30" r="28" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="44 132" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ position: 'absolute', inset: 16, animation: 'splash-arc2 2s linear infinite' }}>
            <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }}>
              <circle cx="20" cy="20" r="18" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="28 84" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ position: 'relative', zIndex: 10, width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(124,58,237,0.6)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 15l-4.9 3.2 1.9-5.8L4.1 8.8H10z"/>
            </svg>
          </div>
        </div>
        <div style={{ textAlign: 'center', animation: 'splash-fade 0.6s ease forwards' }}>
          <p style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>Coach IA</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '4px 0 0' }}>Ton assistant entraînement</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
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
  );
};

function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<AuthenticatedApp />} />
            </Routes>
            <Toaster />
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
