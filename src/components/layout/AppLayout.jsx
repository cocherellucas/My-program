import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import RestTimer from '@/components/session/RestTimer';
import { useRestTimer } from '@/lib/RestTimerContext';

// Pages toujours pré-rendues (pas de position:fixed ni side-effects globaux)
import Program  from '@/pages/Program';
import Library  from '@/pages/Library';
import Profile  from '@/pages/Profile';

// Pages chargées uniquement quand elles sont actives
import Dashboard   from '@/pages/Dashboard';
import SessionLog  from '@/pages/SessionLog';
import CoachIA     from '@/pages/CoachIA';

const NAV_PATHS = ['/', '/program', '/session', '/coach', '/library', '/profile'];
const COACH_IDX = NAV_PATHS.indexOf('/coach');
const PAGE_LABELS = {
  '/': 'Accueil', '/program': 'Programme', '/session': 'Séance',
  '/coach': 'Coach', '/library': 'Biblio', '/profile': 'Profil',
};

// Toujours montées (données fraîches au swipe)
const PRERENDER = {
  '/program': Program,
  '/library': Library,
  '/profile': Profile,
};

// Montées uniquement quand la page est active, ghost pendant le swipe
const ON_DEMAND = {
  '/':        Dashboard,
  '/session': SessionLog,
};

const SNAP_THRESHOLD = 65;

const PageGhost = ({ label }) => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
    <span style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{label}</span>
  </div>
);

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { timerState, stopTimer, updateSeconds } = useRestTimer();
  const location = useLocation();
  const navigate = useNavigate();

  // Détection clavier mobile pour retirer le padding-bas (réservé à la nav cachée)
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const isEditable = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === 'INPUT') {
        const type = (el.getAttribute('type') || '').toLowerCase();
        return !['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'range', 'color'].includes(type);
      }
      if (tag === 'TEXTAREA') return true;
      return el.isContentEditable === true;
    };
    const onFocusIn = (e) => { if (isEditable(e.target)) setKeyboardOpen(true); };
    const onFocusOut = () => setTimeout(() => {
      if (!isEditable(document.activeElement)) setKeyboardOpen(false);
    }, 50);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);
  useEffect(() => { setKeyboardOpen(false); }, [location.pathname]);

  // iOS scrolle la layout viewport pour révéler l'input (vv.offsetTop > 0).
  // On suit visualViewport pour pinner main sur la zone visible (principe CoachIA).
  const [vv, setVv] = useState({ top: 0, height: 0 });
  useEffect(() => {
    const visualVp = window.visualViewport;
    if (!visualVp) return;
    const update = () => setVv({ top: visualVp.offsetTop || 0, height: visualVp.height });
    update();
    visualVp.addEventListener('resize', update);
    visualVp.addEventListener('scroll', update);
    return () => {
      visualVp.removeEventListener('resize', update);
      visualVp.removeEventListener('scroll', update);
    };
  }, []);

  // Quand le clavier est ouvert (main pinné sur la zone visible), on scrolle
  // l'input focus dans la vue (sinon il reste sous le clavier). 2e moitié du
  // fix CoachIA : pin + scroll de l'input.
  useEffect(() => {
    if (!keyboardOpen) return;
    const t = setTimeout(() => {
      const el = document.activeElement;
      if (el && el !== document.body && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }, 120);
    return () => clearTimeout(t);
  }, [keyboardOpen, vv.top, vv.height]);

  const mainRef = useRef(null);

  // Mesure l'OVERLAP réel entre le bas de <main> et le haut de la nav.
  // main est remonté de safe-area-bottom (padding body) mais la nav est
  // positionnée au bas du viewport → l'overlap exact = le padding-bas à
  // appliquer au contenu pour qu'il s'arrête pile sur la nav (zéro gap violet).
  const [navOverlap, setNavOverlap] = useState(0);
  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector('.mobile-nav');
      const main = mainRef.current;
      if (!nav || !main) { setNavOverlap(0); return; }
      const navTop = nav.getBoundingClientRect().top;
      const mainBottom = main.getBoundingClientRect().bottom;
      setNavOverlap(Math.max(0, Math.round(mainBottom - navTop)));
    };
    measure();
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 400);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [keyboardOpen, collapsed]);

  // x  = offset de swipe en cours (0 au repos)
  // baseX = position de repos du carousel (-currentIdx × W)
  const x     = useMotionValue(0);
  const baseX = useMotionValue(0);
  const carouselX = useTransform([baseX, x], ([b, v]) => b + v);

  const swipeDir   = useRef(0);
  const touchStart = useRef(null);
  const isHorizontal = useRef(false);
  const animating  = useRef(false);
  const swipeLocked = useRef(false);

  useEffect(() => {
    const handler = (e) => { swipeLocked.current = e.detail; };
    window.addEventListener('swipe-lock', handler);
    return () => window.removeEventListener('swipe-lock', handler);
  }, []);

  const currentIdx    = Math.max(0, NAV_PATHS.indexOf(location.pathname));
  const currentIdxRef = useRef(currentIdx);
  currentIdxRef.current = currentIdx;
  const pageRefs = useRef([]);

  const pageW = () => mainRef.current?.offsetWidth ?? window.innerWidth;

  // Synchronise baseX + reset x + reset scroll toutes les pages non-actives
  useLayoutEffect(() => {
    baseX.set(-currentIdx * pageW());
    x.set(0);
    pageRefs.current.forEach((ref, i) => {
      if (ref && i !== currentIdx) ref.scrollTop = 0;
    });
  }, [currentIdx]); // eslint-disable-line

  // Recalcule baseX si fenêtre redimensionnée (debounce pour laisser le layout se stabiliser)
  useEffect(() => {
    let timer;
    const recalc = () => {
      clearTimeout(timer);
      timer = setTimeout(() => baseX.set(-currentIdxRef.current * pageW()), 150);
    };
    window.addEventListener('resize', recalc);
    window.addEventListener('orientationchange', recalc);
    return () => {
      window.removeEventListener('resize', recalc);
      window.removeEventListener('orientationchange', recalc);
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line

  // Listener non-passif pour bloquer le scroll vertical pendant le swipe horizontal
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onMove = (e) => { if (isHorizontal.current) e.preventDefault(); };
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, []);

  const cleanup = useCallback(() => {
    touchStart.current = null;
    isHorizontal.current = false;
  }, []);

  const handleTouchCancel = useCallback(() => {
    if (isHorizontal.current) {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 42 });
    }
    animating.current = false;
    cleanup();
  }, [x, cleanup]);

  const isSwipeLocked = () => swipeLocked.current || !!document.querySelector('[data-no-swipe]');

  const handleTouchStart = useCallback((e) => {
    if (animating.current || isSwipeLocked()) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isHorizontal.current = false;
  }, []); // eslint-disable-line

  const handleTouchMove = useCallback((e) => {
    if (!touchStart.current || animating.current || isSwipeLocked()) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;

    if (!isHorizontal.current) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dx) < Math.abs(dy) * 2) { touchStart.current = null; return; }
      isHorizontal.current = true;
      swipeDir.current = dx > 0 ? 1 : -1;
      // Reset scroll de la page adjacente avant même que l'animation commence
      const adjI = currentIdxRef.current + (swipeDir.current > 0 ? -1 : 1);
      if (pageRefs.current[adjI]) pageRefs.current[adjI].scrollTop = 0;
    }

    const adjIdx = currentIdxRef.current + (swipeDir.current > 0 ? -1 : 1);
    const hasNeighbor = adjIdx >= 0 && adjIdx < NAV_PATHS.length;
    x.set(hasNeighbor ? dx : dx * 0.1);
  }, [x]);

  const handleTouchEnd = useCallback((e) => {
    if (isSwipeLocked()) { cleanup(); return; }
    if (!touchStart.current || !isHorizontal.current) { cleanup(); return; }

    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    cleanup();

    const idx    = currentIdxRef.current;
    const adjIdx = idx + (swipeDir.current > 0 ? -1 : 1);
    const hasNeighbor = adjIdx >= 0 && adjIdx < NAV_PATHS.length;
    const shouldNavigate = hasNeighbor && Math.abs(dx) >= SNAP_THRESHOLD;

    animating.current = true;

    if (shouldNavigate) {
      animate(x, swipeDir.current * pageW(), { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }).then(() => {
        animating.current = false;
        navigate(NAV_PATHS[adjIdx]);
      });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 42 }).then(() => {
        animating.current = false;
      });
    }
  }, [navigate, x, cleanup]);

  const numPages = NAV_PATHS.length;

  return (
    <div className="min-h-screen bg-violet-600">
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="md:hidden">
        <MobileNav swipeX={x} swipeCurrentIdx={currentIdx} />
      </div>

      <main
        ref={mainRef}
        className="transition-all duration-250 ease-in-out"
        style={
          keyboardOpen && vv.height
            ? {
                // Clavier ouvert : iOS a scrollé la layout viewport (vv.top > 0).
                // On pinne main sur la zone visible exacte → pas de fond violet.
                // L'input est ramené dans la vue par l'effet scrollIntoView ci-dessus.
                position: 'fixed',
                top: vv.top,
                left: 0,
                right: 0,
                height: vv.height,
                overflow: 'hidden',
              }
            : {
                marginLeft: collapsed ? 72 : 260,
                height: '100dvh',
                overflow: 'hidden',
                position: 'relative',
              }
        }
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {/* Carousel — toutes les pages toujours montées */}
        <motion.div
          style={{
            x: carouselX,
            display: 'flex',
            width: `${numPages * 100}%`,
            height: '100%',
            willChange: 'transform',
          }}
        >
          {NAV_PATHS.map((path, idx) => {
            const Pre      = PRERENDER[path];
            const OnDemand = ON_DEMAND[path];
            const isActive = idx === currentIdx;
            // CoachIA a un position:fixed à la racine — doit être rendu HORS du carousel
            if (path === '/coach') {
              return (
                <div key={path} style={{ width: `${100 / numPages}%`, height: '100%', flexShrink: 0 }}>
                  <PageGhost label="Coach" />
                </div>
              );
            }
            return (
              <div
                key={path}
                ref={el => { pageRefs.current[idx] = el; }}
                style={{
                  width: `${100 / numPages}%`,
                  height: '100%',
                  minHeight: 0,
                  flexShrink: 0,
                  // Seule la page active peut scroller — empêche l'inertie de contaminer les pages adjacentes
                  overflowY: idx === currentIdx ? 'auto' : 'hidden',
                  overscrollBehavior: 'contain',
                  // Padding-bas = overlap réel main/nav (mesuré) → pas de gap violet,
                  // pas de contenu caché. 0 quand le clavier est ouvert (nav cachée).
                  paddingBottom: keyboardOpen ? 0 : navOverlap,
                }}
              >
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                  {Pre
                    ? <Pre />
                    : isActive
                      ? <OnDemand />
                      : <PageGhost label={PAGE_LABELS[path]} />}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* CoachIA monté uniquement quand on est sur la page Coach */}
        {currentIdx === COACH_IDX && <CoachIA />}
      </main>

      <style>{`
        @media (max-width: 767px) { main { margin-left: 0 !important; } }
      `}</style>

      {timerState && createPortal(
        <RestTimer
          key={timerState.id || timerState.endTime}
          seconds={timerState.seconds}
          initialEndTime={timerState.endTime}
          onComplete={() => stopTimer(true)}
          onRestTimeChange={updateSeconds}
        />,
        document.body
      )}
    </div>
  );
}
