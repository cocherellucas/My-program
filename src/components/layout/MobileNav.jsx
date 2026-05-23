import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Dumbbell, CalendarDays,
  MessageSquare, User, BookOpen
} from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();

  const activeSessionId = (() => { try { return localStorage.getItem('active_session_id'); } catch { return null; } })();
  const items = [
    { icon: LayoutDashboard, label: 'Accueil', path: '/' },
    { icon: Dumbbell, label: 'Programme', path: '/program' },
    { icon: CalendarDays, label: 'Séance', path: activeSessionId ? `/session?id=${activeSessionId}` : '/session' },
    { icon: MessageSquare, label: 'Coach', path: '/coach' },
    { icon: BookOpen, label: 'Biblio', path: '/library' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);

  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const handler = () => setKeyboardOpen(vv.height < window.innerHeight * 0.75);
    vv.addEventListener('resize', handler);
    return () => vv.removeEventListener('resize', handler);
  }, []);

  if (keyboardOpen) return null;

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 pb-safe" style={{ background: 'linear-gradient(to bottom, rgba(109,40,217,0.13) 0%, white 100%)', borderTop: '1px solid rgba(109,40,217,0.12)' }}>
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.map((item) => {
          const isActive = location.pathname === item.path.split('?')[0];
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative"
            >
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 10px rgba(124,58,237,0.25)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <item.icon
                className="w-5 h-5 relative z-10 transition-all"
                style={{
                  color: isActive ? '#6b5ea8' : '#374151',
                  strokeWidth: isActive ? 2.5 : 2.0
                }}
              />
              <span
                className="text-[10px] font-semibold relative z-10"
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
