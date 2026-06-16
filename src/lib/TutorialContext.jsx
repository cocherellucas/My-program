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
  // (fait synchrone ici car TutorialProvider mount avant les routes/pages)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.has('resetOnboarding')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('onboarding_draft');
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
    // Skip uniquement cette étape de tuto (marque complété)
    setActiveTutorial(prev => {
      if (!prev) return null;
      setState(s => ({ ...s, completed: { ...(s.completed || {}), [prev.id]: true } }));
      return null;
    });
  }, []);

  const skipAll = useCallback(() => {
    setActiveTutorial(null);
    setState(s => ({ ...s, skipAll: true }));
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
    // Scroll : place l'élément assez bas pour qu'une bulle d'environ 220px tienne au-dessus avec marge
    const scrollIntoView = () => {
      const el = document.querySelector(`[data-tutorial="${step.target}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const desiredTopFromViewport = 260; // px depuis le haut du viewport → laisse ~244px de marge au-dessus
      const targetY = rect.top + window.scrollY - desiredTopFromViewport;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    };
    setTimeout(scrollIntoView, 50);
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
    <TutorialContext.Provider value={{ activeTutorial, targetRect, startTutorial, nextStep, skipStep, skipAll, state }}>
      {children}
    </TutorialContext.Provider>
  );
}

export const useTutorial = () => useContext(TutorialContext);
