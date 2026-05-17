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

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
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
