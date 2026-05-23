import React, { useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, animate } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const NAV_PATHS = ['/', '/program', '/session', '/coach', '/library', '/profile'];
const SNAP_THRESHOLD = 80;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const direction = useRef(0);
  const touchStart = useRef(null);
  const isHorizontal = useRef(false);
  const committed = useRef(false);

  const handleTouchStart = (e) => {
    if (location.pathname === '/coach') return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isHorizontal.current = false;
    committed.current = false;
  };

  const handleTouchMove = (e) => {
    if (!touchStart.current || committed.current || location.pathname === '/coach') return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;

    if (!isHorizontal.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) { touchStart.current = null; return; }
      isHorizontal.current = true;
    }

    const idx = NAV_PATHS.indexOf(location.pathname);
    const atEdge = (idx === 0 && dx > 0) || (idx === NAV_PATHS.length - 1 && dx < 0);
    x.set(atEdge ? dx * 0.12 : dx);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current || !isHorizontal.current) {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 35 });
      touchStart.current = null;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    touchStart.current = null;

    const idx = NAV_PATHS.indexOf(location.pathname);

    if (dx < -SNAP_THRESHOLD && idx < NAV_PATHS.length - 1) {
      committed.current = true;
      direction.current = -1;
      // Reset x avant navigate — AnimatePresence gère l'animation d'entrée/sortie
      x.set(0);
      navigate(NAV_PATHS[idx + 1]);
    } else if (dx > SNAP_THRESHOLD && idx > 0) {
      committed.current = true;
      direction.current = 1;
      x.set(0);
      navigate(NAV_PATHS[idx - 1]);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 35 });
    }
  };

  const variants = {
    enter:  (dir) => ({ x: dir < 0 ? '100%' : '-100%' }),
    center: { x: 0 },
    exit:   (dir) => ({ x: dir < 0 ? '-40%' : '40%', opacity: 0.4 }),
  };

  return (
    <div className="min-h-screen bg-violet-600 overflow-hidden">
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>

      <main
        className="transition-all duration-250 ease-in-out pb-20 md:pb-0 overflow-hidden"
        style={{ marginLeft: collapsed ? 72 : 260 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="sync" custom={direction.current}>
          <motion.div
            key={location.pathname}
            custom={direction.current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ x, position: 'relative', width: '100%' }}
            className="max-w-7xl mx-auto p-4 md:p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        @media (max-width: 767px) { main { margin-left: 0 !important; } }
      `}</style>
    </div>
  );
}