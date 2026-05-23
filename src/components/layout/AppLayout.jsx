import React, { useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const NAV_PATHS = ['/', '/program', '/session', '/coach', '/library', '/profile'];
const SWIPE_MIN_X = 55;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const touchStart = useRef(null);
  const direction = useRef(0); // -1 = gauche (suivant), 1 = droite (précédent)

  const handleTouchStart = (e) => {
    if (location.pathname === '/coach') return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current || location.pathname === '/coach') return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    // Doit être clairement horizontal (dx doit dominer dy)
    if (Math.abs(dx) < SWIPE_MIN_X || Math.abs(dx) < Math.abs(dy) * 1.8) return;

    const idx = NAV_PATHS.indexOf(location.pathname);
    if (idx === -1) return;

    if (dx < 0 && idx < NAV_PATHS.length - 1) {
      direction.current = -1;
      navigate(NAV_PATHS[idx + 1]);
    } else if (dx > 0 && idx > 0) {
      direction.current = 1;
      navigate(NAV_PATHS[idx - 1]);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-violet-600">
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>

      <main
        className="transition-all duration-250 ease-in-out pb-20 md:pb-0 overflow-x-hidden"
        style={{ marginLeft: collapsed ? 72 : 260 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction.current}>
          <motion.div
            key={location.pathname}
            custom={direction.current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.32, 0, 0.67, 0] }}
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