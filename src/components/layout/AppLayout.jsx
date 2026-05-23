import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

// Pages toujours pré-rendues
import Program from '@/pages/Program';
import CoachIA from '@/pages/CoachIA';
import Library from '@/pages/Library';
import Profile from '@/pages/Profile';

const NAV_PATHS = ['/', '/program', '/session', '/coach', '/library', '/profile'];
const PAGE_LABELS = {
  '/': 'Accueil', '/program': 'Programme', '/session': 'Séance',
  '/coach': 'Coach', '/library': 'Biblio', '/profile': 'Profil',
};
// Dashboard et Session gardent un ghost (side-effects au montage)
const PAGE_COMPONENTS = {
  '/program': Program,
  '/coach':   CoachIA,
  '/library': Library,
  '/profile': Profile,
};

const SNAP_THRESHOLD = 65;

const PageGhost = ({ label }) => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
    <span style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{label}</span>
  </div>
);

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const currentIdx    = Math.max(0, NAV_PATHS.indexOf(location.pathname));
  const currentIdxRef = useRef(currentIdx);
  currentIdxRef.current = currentIdx;

  const pageW = () => mainRef.current?.offsetWidth ?? window.innerWidth;

  // Synchronise baseX + reset x de façon atomique avant chaque paint
  useLayoutEffect(() => {
    baseX.set(-currentIdx * pageW());
    x.set(0);
  }, [currentIdx]); // eslint-disable-line

  // Recalcule baseX si fenêtre redimensionnée
  useEffect(() => {
    const onResize = () => baseX.set(-currentIdxRef.current * pageW());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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

  const handleTouchStart = useCallback((e) => {
    if (animating.current) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isHorizontal.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchStart.current || animating.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;

    if (!isHorizontal.current) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dy) >= Math.abs(dx)) { touchStart.current = null; return; }
      isHorizontal.current = true;
      swipeDir.current = dx > 0 ? 1 : -1;
    }

    const adjIdx = currentIdxRef.current + (swipeDir.current > 0 ? -1 : 1);
    const hasNeighbor = adjIdx >= 0 && adjIdx < NAV_PATHS.length;
    x.set(hasNeighbor ? dx : dx * 0.1);
  }, [x]);

  const handleTouchEnd = useCallback((e) => {
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
        // useLayoutEffect s'occupe du reset x + baseX avant le prochain paint
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
        style={{
          marginLeft: collapsed ? 72 : 260,
          height: '100dvh',
          overflow: 'hidden',
          position: 'relative',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
          {NAV_PATHS.map((path) => {
            const Component = PAGE_COMPONENTS[path];
            return (
              <div
                key={path}
                style={{ width: `${100 / numPages}%`, height: '100%', overflowY: 'auto', flexShrink: 0 }}
                className="pb-20 md:pb-0"
              >
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                  {Component
                    ? <Component />
                    : <PageGhost label={PAGE_LABELS[path]} />}
                </div>
              </div>
            );
          })}
        </motion.div>
      </main>

      <style>{`
        @media (max-width: 767px) { main { margin-left: 0 !important; } }
      `}</style>
    </div>
  );
}
