import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Dumbbell, CalendarDays, 
  MessageSquare, User, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}