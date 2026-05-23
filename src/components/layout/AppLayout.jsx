import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

// Pages qu'on peut pré-rendre en adjacent (sans side effects dangereux)
import Program from '@/pages/Program';
import Library from '@/pages/Library';
import Profile from '@/pages/Profile';

const NAV_PATHS = ['/', '/program', '/session', '/coach', '/library', '/profile'];
const PAGE_LABELS = {
  '/': 'Accueil', '/program': 'Programme', '/session': 'Séance',
  '/coach': 'Coach', '/library': 'Biblio', '/profile': 'Profil',
};
// Pages sûres à pré-rendre — Dashboard (redirect onboarding) et CoachIA (fixed layout) exclus
const PAGE_COMPONENTS = {
  '/program': Program,
  '/library': Library,
  '/profile': Profile,
};

const SNAP_THRESHOLD = 65;
const NO_SWIPE_PATHS = [];

// Placeholder pour les pages qu'on ne peut pas pré-rendre
const PageGhost = ({ label }) => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
    <span style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{label}</span>
  </div>
);

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const swipeDir = useRef(0);        // 1 = drag vers droite (prev), -1 = drag vers gauche (next)
  const touchStart = useRef(null);
  const isHorizontal = useRef(false);
  const animating = useRef(false);
  const screenW = useRef(window.innerWidth);

  const mainRef = useRef(null);
  const [adjacent, setAdjacent] = useState(null); // { path, label, Component }

  // La page voisine commence à ±screenWidth et suit x simultanément
  const adjX = useTransform(x, v => v - swipeDir.current * screenW.current);

  // Listener non-passif pour pouvoir appeler preventDefault() et bloquer le scroll vertical
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onMove = (e) => { if (isHorizontal.current) e.preventDefault(); };
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, []);

  const currentIdx = NAV_PATHS.indexOf(location.pathname);
  const canSwipe = !NO_SWIPE_PATHS.includes(location.pathname);

  const cleanup = useCallback(() => {
    touchStart.current = null;
    isHorizontal.current = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (!canSwipe || animating.current) return;
    screenW.current = window.innerWidth;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isHorizontal.current = false;
  }, [canSwipe]);

  const handleTouchMove = useCallback((e) => {
    if (!touchStart.current || animating.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;

    if (!isHorizontal.current) {
      // Attendre 10px avant de décider la direction
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      // Si plus vertical qu'horizontal → scroll normal, on abandonne
      if (Math.abs(dy) >= Math.abs(dx)) {
        touchStart.current = null;
        return;
      }
      // Confirmé horizontal
      isHorizontal.current = true;
      const dir = dx > 0 ? 1 : -1;
      swipeDir.current = dir;

      // Monter la page voisine
      const adjIdx = currentIdx + (dir > 0 ? -1 : 1);
      if (adjIdx >= 0 && adjIdx < NAV_PATHS.length) {
        const adjPath = NAV_PATHS[adjIdx];
        setAdjacent({
          path: adjPath,
          label: PAGE_LABELS[adjPath],
          Component: PAGE_COMPONENTS[adjPath] || null,
        });
      }
    }

    // Résistance au bord (première/dernière page ou pas de voisin)
    const adjIdx = currentIdx + (swipeDir.current > 0 ? -1 : 1);
    const hasNeighbor = adjIdx >= 0 && adjIdx < NAV_PATHS.length;
    const atEdge = !hasNeighbor;
    x.set(atEdge ? dx * 0.1 : dx);
  }, [canSwipe, currentIdx, x]);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart.current || !isHorizontal.current) {
      cleanup();
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    cleanup();

    const shouldNavigate = adjacent && Math.abs(dx) >= SNAP_THRESHOLD;
    animating.current = true;

    if (shouldNavigate) {
      const W = screenW.current;
      const target = swipeDir.current * W;
      animate(x, target, { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }).then(() => {
        x.set(0);
        animating.current = false;
        const path = adjacent.path;
        setAdjacent(null);
        navigate(path);
      });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 42 }).then(() => {
        animating.current = false;
        setAdjacent(null);
      });
    }
  }, [adjacent, navigate, x, cleanup]);

  return (
    <div className="min-h-screen bg-violet-600" style={{ overflow: 'hidden' }}>
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>

      <main
        ref={mainRef}
        className="transition-all duration-250 ease-in-out pb-20 md:pb-0"
        style={{ marginLeft: collapsed ? 72 : 260, position: 'relative', overflow: 'hidden', minHeight: '100vh' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Page voisine — montée pendant le drag, positionnée hors écran */}
        {adjacent && (
          <motion.div
            style={{
              x: adjX,
              position: 'absolute', top: 0, left: 0, right: 0,
              minHeight: '100%', zIndex: 1,
            }}
          >
            <div className="max-w-7xl mx-auto p-4 md:p-8">
              {adjacent.Component
                ? <adjacent.Component />
                : <PageGhost label={adjacent.label} />}
            </div>
          </motion.div>
        )}

        {/* Page courante */}
        <motion.div style={{ x, position: 'relative', zIndex: 2, minHeight: '100%' }}>
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </motion.div>
      </main>

      <style>{`
        @media (max-width: 767px) { main { margin-left: 0 !important; } }
      `}</style>
    </div>
  );
}
