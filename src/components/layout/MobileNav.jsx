import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, CalendarDays,
  MessageSquare, User, BookOpen
} from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'Accueil', path: '/' },
  { icon: Dumbbell, label: 'Programme', path: '/program' },
  { icon: CalendarDays, label: 'Séance', path: '/session' },
  { icon: MessageSquare, label: 'Coach', path: '/coach' },
  { icon: BookOpen, label: 'Biblio', path: '/library' },
  { icon: User, label: 'Profil', path: '/profile' },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ background: 'rgba(20,0,50,0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all relative"
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl opacity-100"
                  style={{ background: 'rgba(139,92,246,0.2)' }} />
              )}
              <item.icon
                className="w-5 h-5 relative z-10 transition-all"
                style={{ color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.35)', strokeWidth: isActive ? 2.5 : 1.8 }}
              />
              <span className="text-[10px] font-medium relative z-10 transition-all"
                style={{ color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.35)' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
