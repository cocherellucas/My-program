import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  LayoutDashboard, Dumbbell, CalendarDays,
  MessageSquare, User, BookOpen
} from 'lucide-react';

export default function MobileNav({ swipeX, swipeCurrentIdx = 0 }) {
  const location = useLocation();

  const activeSessionId = (() => { try { return localStorage.getItem('active_session_id'); } catch { return null; } })();
  const items = [
    { icon: LayoutDashboard, label: 'Accueil',    path: '/' },
    { icon: Dumbbell,        label: 'Programme',  path: '/program' },
    { icon: CalendarDays,    label: 'Séance',     path: activeSessionId ? `/session?id=${activeSessionId}` : '/session' },
    { icon: MessageSquare,   label: 'Coach',      path: '/coach' },
    { icon: BookOpen,        label: 'Biblio',     path: '/library' },
    { icon: User,            label: 'Profil',     path: '/profile' },
  ];

  const [keyboardOpen, setKeyboardOpen] = React.useState(false);
  // Détection 1 : focus sur input éditable (couvre les claviers courts comme numérique)
  useEffect(() => {
    const isEditable = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === 'INPUT') {
        const type = (el.getAttribute('type') || '').toLowerCase();
        // Exclut les inputs non-clavier
        return !['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'range', 'color'].includes(type);
      }
      if (tag === 'TEXTAREA') return true;
      if (el.isContentEditable) return true;
      return false;
    };
    const onFocusIn = (e) => { if (isEditable(e.target)) setKeyboardOpen(true); };
    const onFocusOut = () => {
      // Laisse le temps au focus de passer à un autre input avant de cacher
      setTimeout(() => { if (!isEditable(document.activeElement)) setKeyboardOpen(false); }, 50);
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);
  // Détection 2 (fallback) : variation de la hauteur du visualViewport (claviers tiers)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const handler = () => { if (vv.height < window.innerHeight * 0.85) setKeyboardOpen(true); };
    vv.addEventListener('resize', handler);
    return () => vv.removeEventListener('resize', handler);
  }, []);
  // Reset au changement de route pour éviter que keyboardOpen reste bloqué
  useEffect(() => { setKeyboardOpen(false); }, [location.pathname]);

  const numTabs = items.length;
  const currentNavIdx = items.findIndex(item => location.pathname === item.path.split('?')[0]);

  const containerRef = useRef(null);

  // Position en unités-tab (0 à numTabs-1), piloté par swipeX et tap
  const smoothPos = useMotionValue(currentNavIdx >= 0 ? currentNavIdx : 0);

  // Refs always-current pour éviter les stale closures dans le listener swipeX
  const swipeCurrentIdxRef = useRef(swipeCurrentIdx);
  const currentNavIdxRef = useRef(currentNavIdx);
  swipeCurrentIdxRef.current = swipeCurrentIdx;
  currentNavIdxRef.current = currentNavIdx;

  // Tap / navigation programmatique → spring vers le nouvel onglet
  useEffect(() => {
    if (currentNavIdx >= 0) {
      animate(smoothPos, currentNavIdx, { type: 'spring', stiffness: 500, damping: 38 });
    }
  }, [currentNavIdx]); // eslint-disable-line

  // Swipe temps réel → suit swipeX directement
  useEffect(() => {
    if (!swipeX) return;
    return swipeX.on('change', v => {
      if (Math.abs(v) < 2) return; // ignore spring settling & layout-effect resets
      const base = swipeCurrentIdxRef.current >= 0 ? swipeCurrentIdxRef.current : (currentNavIdxRef.current >= 0 ? currentNavIdxRef.current : 0);
      const next = base - v / window.innerWidth;
      smoothPos.set(Math.max(0, Math.min(numTabs - 1, next)));
    });
  }, [swipeX]); // eslint-disable-line — refs keep values current

  // Position pixel de l'indicateur (1/numTabs de la largeur du container)
  const getTabW = () => containerRef.current ? containerRef.current.offsetWidth / numTabs : window.innerWidth / numTabs;
  const indicatorX = useTransform(smoothPos, p => p * getTabW());

  if (keyboardOpen) return null;

  const tabW = `${100 / numTabs}%`;

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ background: 'linear-gradient(to bottom, rgba(109,40,217,0.13) 0%, white 100%)', borderTop: '1px solid rgba(109,40,217,0.12)' }}>
      <div
        ref={containerRef}
        className="flex px-1 py-1.5"
        style={{ position: 'relative' }}
      >
        {/* Indicateur glissant unique */}
        <motion.div
          style={{
            x: indicatorX,
            position: 'absolute',
            top: 4, bottom: 4,
            width: tabW,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 2px 10px rgba(124,58,237,0.25)',
            pointerEvents: 'none',
            left: 0,
          }}
        />

        {items.map((item) => {
          const isActive = location.pathname === item.path.split('?')[0];
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative z-10"
              style={{ width: tabW, flexShrink: 0 }}
            >
              <item.icon
                className="w-5 h-5 transition-all"
                style={{ color: isActive ? '#6b5ea8' : '#374151', strokeWidth: isActive ? 2.5 : 2.0 }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? '#6b5ea8' : '#374151' }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
