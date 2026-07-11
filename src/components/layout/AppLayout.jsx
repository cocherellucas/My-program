import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
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
const SESSION_IDX = NAV_PATHS.indexOf('/session');
const PAGE_LABELS = {
  '/': 'Accueil', '/program': 'Programme', '/session': 'Séance',
  '/coach': 'Coach', '/library': 'Biblio', '/profile': 'Profil',
};

// Pages rendues HORS du carrousel (position:fixed propre, hors du transform) :
// Coach et Séance — pour pouvoir se pinner au viewport visible (clavier).
const OUTSIDE_CAROUSEL = new Set(['/coach', '/session']);

// Toujours montées (données fraîches au swipe)
const PRERENDER = {
  '/program': Program,
  '/library': Library,
  '/profile': Profile,
};

// Montées uniquement quand la page est active, ghost pendant le swipe
const ON_DEMAND = {
  '/':        Dashboard,
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

  const mainRef = useRef(null);

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
      const adx = Math.abs(dx), ady = Math.abs(dy);
      // Priorité STRICTE au scroll vertical : dès qu'une composante verticale notable
      // apparaît et domine, on relâche → scroll natif immédiat.
      if (ady > 10 && ady >= adx) { touchStart.current = null; return; }
      // Swipe page : seulement si le geste est franchement horizontal.
      if (adx > 16 && adx > ady * 2) {
        isHorizontal.current = true;
        swipeDir.current = dx > 0 ? 1 : -1;
        // Reset scroll de la page adjacente avant même que l'animation commence
        const adjI = currentIdxRef.current + (swipeDir.current > 0 ? -1 : 1);
        if (pageRefs.current[adjI]) pageRefs.current[adjI].scrollTop = 0;
      } else {
        return; // pas encore tranché
      }
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
  // Routes DANS le layout mais HORS du carrousel (/analytics, /memory,
  // /admin/pricing, /gif-check) : rendues via Outlet — sans ça, AppLayout
  // affichait le Dashboard à leur place (aucun Outlet → enfant jamais rendu).
  const isCarouselPath = NAV_PATHS.includes(location.pathname);

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
        style={{
          marginLeft: collapsed ? 72 : 260,
          height: '100dvh',
          overflow: 'hidden',
          position: 'relative',
        }}
        onTouchStart={isCarouselPath ? handleTouchStart : undefined}
        onTouchMove={isCarouselPath ? handleTouchMove : undefined}
        onTouchEnd={isCarouselPath ? handleTouchEnd : undefined}
        onTouchCancel={isCarouselPath ? handleTouchCancel : undefined}
      >
        {!isCarouselPath ? (
          <div
            style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
            className={keyboardOpen ? 'pb-2' : 'pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0'}
          >
            <div className="max-w-7xl mx-auto p-4 md:p-8">
              <Outlet />
            </div>
          </div>
        ) : (
        <>
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
            // Coach & Séance ont un position:fixed à la racine (pin viewport clavier)
            // → rendus HORS du carrousel (le transform du carrousel casse position:fixed)
            // Fantôme VIDE (pas de label) : leurs conteneurs fixes sont transparents,
            // un label transparaîtrait au milieu de la page.
            if (OUTSIDE_CAROUSEL.has(path)) {
              return (
                <div key={path} style={{ width: `${100 / numPages}%`, height: '100%', flexShrink: 0 }} />
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
                  // Scroll vertical natif/instantané (le carrousel gère l'horizontal en JS)
                  // → corrige le ressenti de "scroll dur" sur les longues listes
                  touchAction: 'pan-y',
                  WebkitOverflowScrolling: 'touch',
                }}
                // Réserve la place de la mobile nav + safe-area-inset-bottom (notch iPhone)
                // — mais retire ce padding quand le clavier est ouvert (nav cachée)
                className={keyboardOpen ? 'pb-2' : 'pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0'}
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

        {/* CoachIA et SessionLog montés HORS du carrousel (position:fixed propre) */}
        {currentIdx === COACH_IDX && <CoachIA />}
        {currentIdx === SESSION_IDX && <SessionLog />}
        </>
        )}
      </main>

      <style>{`
        @media (max-width: 767px) { main { margin-left: 0 !important; } }
      `}</style>

      {timerState && createPortal(
        <RestTimer
          key={timerState.id || timerState.endTime}
          seconds={timerState.seconds}
          initialEndTime={timerState.endTime}
          label={timerState.label}
          mode={timerState.mode}
          onComplete={() => stopTimer(true)}
          onRestTimeChange={updateSeconds}
        />,
        document.body
      )}
    </div>
  );
}
