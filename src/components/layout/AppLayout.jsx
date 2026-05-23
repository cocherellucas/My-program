import React, { useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const NAV_PATHS = ['/', '/program', '/session', '/coach', '/library', '/profile'];
const SWIPE_THRESHOLD = 60;
const SWIPE_MAX_VERTICAL_RATIO = 0.6; // annule si trop vertical

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const touchStart = useRef(null);

  const handleTouchStart = (e) => {
    // Ne pas interférer avec CoachIA (gère ses propres touches)
    if (location.pathname === '/coach') return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current || location.pathname === '/coach') return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    // Ignorer si trop vertical ou trop court
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (Math.abs(dy) / Math.abs(dx) > SWIPE_MAX_VERTICAL_RATIO) return;

    const currentPath = location.pathname;
    const idx = NAV_PATHS.indexOf(currentPath);
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