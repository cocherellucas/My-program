import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const TutorialContext = createContext(null);
const STORAGE_KEY = 'tutorial_state';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export function TutorialProvider({ children }) {
  // ?resetOnboarding → vide tuto + onboarding AVANT le premier render des Steps
  // ?resetTutorial  → vide uniquement l'état des tutos (sans toucher l'onboarding)
  // (fait synchrone ici car TutorialProvider mount avant les routes/pages)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.has('resetOnboarding')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('onboarding_draft');
    }
    if (params.has('resetTutorial')) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const [state, setState] = useState(loadState);
  const [activeTutorial, setActiveTutorial] = useState(null); // { id, steps, currentStep }
  const [targetRect, setTargetRect] = useState(null);

  // Sauve dans localStorage
  useEffect(() => { saveState(state); }, [state]);

  // Démarre un tuto (s'il n'a pas déjà été vu/skippé et que le skip global n'est pas actif)
  const startTutorial = useCallback((id, steps) => {
    if (state.skipAll) return;
    if (state.completed?.[id]) return;
    setActiveTutorial({ id, steps, currentStep: 0 });
  }, [state]);

  const nextStep = useCallback(() => {
    setActiveTutorial(prev => {
      if (!prev) return null;
      if (prev.currentStep + 1 >= prev.steps.length) {
        // Marque comme complété
        setState(s => ({ ...s, completed: { ...(s.completed || {}), [prev.id]: true } }));
        return null;
      }
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }, []);

  const skipStep = useCallback(() => {
    setActiveTutorial(prev => {
      if (!prev) return null;
      if (prev.currentStep + 1 >= prev.steps.length) {
        setState(s => ({ ...s, completed: { ...(s.completed || {}), [prev.id]: true } }));
        return null;
      }
      // Avance au step suivant mais en mode dormant (invisible jusqu'au réveil)
      return { ...prev, currentStep: prev.currentStep + 1, dormant: true };
    });
  }, []);

  const wakeTutorial = useCallback(() => {
    setActiveTutorial(prev => prev ? { ...prev, dormant: false } : null);
  }, []);

  // Termine un tuto (le marque comme vu) sans en montrer la fin — ex: fermeture d'un écran
  const endTutorial = useCallback((id) => {
    setActiveTutorial(prev => {
      if (!prev || prev.id !== id) return prev;
      setState(s => ({ ...s, completed: { ...(s.completed || {}), [id]: true } }));
      return null;
    });
  }, []);

  const skipAll = useCallback(() => {
    setActiveTutorial(null);
    setState(s => ({ ...s, skipAll: true }));
  }, []);

  // Réinitialise UN tutoriel (il rejouera à sa prochaine occasion) — et lève
  // le skip global, sinon le tuto resterait muet malgré le reset.
  const resetTutorial = useCallback((id) => {
    setState(s => {
      const completed = { ...(s.completed || {}) };
      delete completed[id];
      return { ...s, completed, skipAll: false };
    });
  }, []);

  // Suit la position du target via le selector (data-tutorial="...")
  useEffect(() => {
    if (!activeTutorial) { setTargetRect(null); return; }
    const step = activeTutorial.steps[activeTutorial.currentStep];
    if (!step?.target) { setTargetRect(null); return; }

    const update = () => {
      const el = document.querySelector(`[data-tutorial="${step.target}"]`);
      if (el) setTargetRect(el.getBoundingClientRect());
      else setTargetRect(null);
    };
    // Scroll : place l'élément à ~260px du haut pour qu'une bulle (~220px) tienne au-dessus.
    // On utilise el.scrollIntoView (gère les conteneurs scrollables imbriqués comme les dialogs)
    // + scroll-margin-top pour conserver l'offset. window.scrollTo ne marcherait pas dans un dialog
    // dont le contenu scrolle en interne (overflow-y:auto).
    const scrollIntoView = () => {
      const el = document.querySelector(`[data-tutorial="${step.target}"]`);
      if (!el) return;
      const prevMargin = el.style.scrollMarginTop;
      el.style.scrollMarginTop = '260px';
      el.scrollIntoView({ block: 'start', behavior: 'smooth' });
      // Restaure la valeur d'origine après le scroll
      setTimeout(() => { el.style.scrollMarginTop = prevMargin; }, 400);
    };
    if (!activeTutorial.dormant) setTimeout(scrollIntoView, 50);
    update();
    // ResizeObserver sur la cible ET sur document.body (capte tout changement de layout)
    const observer = new ResizeObserver(update);
    const el = document.querySelector(`[data-tutorial="${step.target}"]`);
    if (el) observer.observe(el);
    observer.observe(document.body);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    // MutationObserver pour réagir aux changements de DOM (apparition/disparition d'éléments)
    const mo = new MutationObserver(update);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => {
      observer.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [activeTutorial]);

  return (
    <TutorialContext.Provider value={{ activeTutorial, targetRect, startTutorial, nextStep, skipStep, skipAll, wakeTutorial, endTutorial, resetTutorial, state }}>
      {children}
    </TutorialContext.Provider>
  );
}

export const useTutorial = () => useContext(TutorialContext);
