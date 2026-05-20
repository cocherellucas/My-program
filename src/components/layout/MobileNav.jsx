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
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white border-t border-gray-100">
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative"
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-violet-50" />
              )}
              <item.icon
                className="w-5 h-5 relative z-10 transition-all"
                style={{
                  color: isActive ? '#7c3aed' : '#9ca3af',
                  strokeWidth: isActive ? 2.5 : 1.8
                }}
              />
              <span
                className="text-[10px] font-semibold relative z-10"
                style={{ color: isActive ? '#7c3aed' : '#9ca3af' }}
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
