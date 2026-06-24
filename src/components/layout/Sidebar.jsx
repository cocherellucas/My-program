import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, CalendarDays,
  BarChart3, MessageSquare, User, Brain, BookOpen,
  ChevronLeft, ChevronRight, Settings, Star, Crown, Zap, Image
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { base44 } from '@/api/base44Client';

const PLAN_CONFIG = {
  starter: { icon: Zap, label: 'Starter', gradient: 'from-slate-400 to-slate-500' },
  coach:   { icon: Star,  label: 'Coach',   gradient: 'from-violet-400 to-indigo-500' },
  elite:   { icon: Crown, label: 'Elite',   gradient: 'from-amber-400 to-orange-500' },
};

const navItems = [
  { icon: LayoutDashboard, label: 'Accueil', path: '/' },
  { icon: Dumbbell, label: 'Programme', path: '/program' },
  { icon: CalendarDays, label: 'Séance', path: '/session' },
  { icon: MessageSquare, label: 'Coach IA', path: '/coach' },
  { icon: User, label: 'Profil', path: '/profile' },
  { icon: Image, label: 'Vérif. GIFs', path: '/gif-check' },
];

const bottomItems = [
  { icon: BarChart3, label: 'Statistiques', path: '/analytics' },
  { icon: BookOpen, label: 'Bibliothèque', path: '/library' },
  { icon: Brain, label: 'Mémoire IA', path: '/memory' },
];

const themes = [
  { name: 'violet', bg: 'bg-purple-600', label: 'Violet' },
  { name: 'black', bg: 'bg-slate-900', label: 'Noir' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [showTheme, setShowTheme] = useState(false);
  const [planId, setPlanId] = useState('starter');

  useEffect(() => {
    base44.auth.me().then(u => setPlanId(u?.subscription_plan || 'starter'));
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-violet-800 border-r border-violet-900 z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-violet-900">
        <div className="flex items-center gap-3 overflow-hidden">
          <img src="/robotapp.png" alt="Coach IA" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-heading font-bold text-lg text-white whitespace-nowrap"
            >
              Coach IA
            </motion.span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const isProfile = item.path === '/profile';
          const plan = isProfile ? (PLAN_CONFIG[planId] || PLAN_CONFIG.starter) : null;
          const PlanIcon = plan?.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                isActive 
                  ? 'bg-white/20 text-white shadow-lg shadow-violet-900/30' 
                  : 'text-violet-200 hover:text-white hover:bg-white/10'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium whitespace-nowrap flex-1"
                  >
                    {item.label}
                  </motion.span>
                  {isProfile && PlanIcon && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r ${plan.gradient} flex-shrink-0`}
                    >
                      <PlanIcon className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white">{plan.label}</span>
                    </motion.div>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Paramètres */}
      <div className="border-t border-violet-900 py-2 px-2">
        <button
          onClick={() => setShowTheme(!showTheme)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
            showTheme
              ? 'bg-white/20 text-white'
              : 'text-violet-200 hover:text-white hover:bg-white/10'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium whitespace-nowrap"
            >
              Paramètres
            </motion.span>
          )}
        </button>

        {showTheme && !collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 ml-2 space-y-0.5"
          >
            {/* Links */}
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-violet-200 hover:text-white hover:bg-white/10'
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}

            {/* Theme */}
            <div className="pt-2 pb-1 px-3">
              <p className="text-xs text-violet-300 font-medium mb-2">Thème</p>
              <div className="flex gap-2">
                {themes.map((themeItem) => (
                  <button
                    key={themeItem.name}
                    onClick={() => setTheme(themeItem.name)}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all bg-white/10 text-violet-100',
                      theme === themeItem.name
                        ? 'ring-2 ring-violet-500'
                        : 'hover:opacity-80'
                    )}
                  >
                    <div className={cn('w-3 h-3 rounded-full', themeItem.bg)} />
                    {themeItem.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Collapse button */}
      <div className="p-2 border-t border-violet-900">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-xl text-violet-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}