import React, { useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, animate } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const NAV_PATHS = ['/', '/program', '/session', '/coach', '/library', '/profile'];
const SNAP_THRESHOLD = 80; // px pour valider le changement de page

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const x = useMotionValue(0);

  const touchStart = useRef(null);
  const isHorizontal = useRef(false); // verrou de direction

  const handleTouchStart = (e) => {
    if (location.pathname === '/coach') return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isHorizontal.current = false;
  };

  const handleTouchMove = (e) => {
    if (!touchStart.current || location.pathname === '/coach') return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;

    // Verrouiller la direction sur les premiers pixels
    if (!isHorizontal.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; // pas encore décidé
      if (Math.abs(dy) > Math.abs(dx)) {
        // C'est un scroll vertical → ignorer complètement
        touchStart.current = null;
        return;
      }
      isHorizontal.current = true;
    }

    // Limiter le drag si on est au bord (première ou dernière page)
    const idx = NAV_PATHS.indexOf(location.pathname);
    const atStart = idx === 0;
    const atEnd = idx === NAV_PATHS.length - 1;
    const limited = (atStart && dx > 0) || (atEnd && dx < 0)
      ? dx * 0.15 // résistance au bord
      : dx;

    x.set(limited);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current || !isHorizontal.current) {
      x.set(0);
      touchStart.current = null;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    touchStart.current = null;

    const idx = NAV_PATHS.indexOf(location.pathname);
    const W = window.innerWidth;

    if (dx < -SNAP_THRESHOLD && idx < NAV_PATHS.length - 1) {
      // Slide out vers la gauche puis navigate
      animate(x, -W, { duration: 0.2, ease: [0.32, 0, 0.67, 0] }).then(() => {
        x.set(0);
        navigate(NAV_PATHS[idx + 1]);
      });
    } else if (dx > SNAP_THRESHOLD && idx > 0) {
      // Slide out vers la droite puis navigate
      animate(x, W, { duration: 0.2, ease: [0.32, 0, 0.67, 0] }).then(() => {
        x.set(0);
        navigate(NAV_PATHS[idx - 1]);
      });
    } else {
      // Snap retour — ressort naturel
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 35 });
    }
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
        className="transition-all duration-250 ease-in-out pb-20 md:pb-0"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        <motion.div
          style={{ x }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="max-w-7xl mx-auto p-4 md:p-8"
        >
          <Outlet />
        </motion.div>
      </main>

      <style>{`
        @media (max-width: 767px) { main { margin-left: 0 !important; } }
      `}</style>
    </div>
  );
}