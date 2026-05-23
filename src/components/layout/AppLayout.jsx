import React, { useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const NAV_PATHS = ['/', '/program', '/session', '/coach', '/library', '/profile'];
const SWIPE_MIN_X = 70;     // distance horizontale minimale
const SWIPE_MAX_Y = 30;     // si on dépasse ça verticalement → c'est un scroll, on annule

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const touchStart = useRef(null);
  const cancelled = useRef(false); // annulé dès qu'on détecte un scroll vertical

  const handleTouchStart = (e) => {
    if (location.pathname === '/coach') return;
    cancelled.current = false;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e) => {
    if (!touchStart.current || cancelled.current) return;
    const dy = Math.abs(e.touches[0].clientY - touchStart.current.y);
    const dx = Math.abs(e.touches[0].clientX - touchStart.current.x);
    // Dès qu'on monte/descend trop → ce n'est pas un swipe de navigation
    if (dy > SWIPE_MAX_Y && dy > dx) {
      cancelled.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current || cancelled.current || location.pathname === '/coach') {
      touchStart.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    touchStart.current = null;

    if (Math.abs(dx) < SWIPE_MIN_X) return;

    const idx = NAV_PATHS.indexOf(location.pathname);
    if (idx === -1) return;

    if (dx < 0 && idx < NAV_PATHS.length - 1) navigate(NAV_PATHS[idx + 1]);
    if (dx > 0 && idx > 0) navigate(NAV_PATHS[idx - 1]);
  };

  return (
    <div className="min-h-screen bg-violet-600">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Main content */}
      <main
        className="transition-all duration-250 ease-in-out pb-20 md:pb-0 overflow-x-hidden"
        style={{ marginLeft: collapsed ? 72 : 260 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 767px) {
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}