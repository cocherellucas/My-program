import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        setAuthError({ type: 'auth_required', message: 'Authentication required' });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        setAuthError({ type: 'auth_required', message: 'Authentication required' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser) => {
    setIsLoadingAuth(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Profil fusionné AVANT email/nom : profiles.email peut être vide et
      // écraserait sinon l'email d'authentification.
      setUser({
        ...(profile || {}),
        id: authUser.id,
        email: profile?.email || authUser.email,
        full_name: authUser.user_metadata?.full_name || profile?.full_name || '',
      });
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      setUser({ id: authUser.id, email: authUser.email });
      setIsAuthenticated(true);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      setIsAuthenticated(false);
      if (shouldRedirect) window.location.href = '/login';
    });
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const checkAppState = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await loadUserProfile(session.user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
