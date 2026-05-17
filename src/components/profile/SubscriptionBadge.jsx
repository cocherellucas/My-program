import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { DEFAULT_PLANS } from '@/lib/pricing-config';
import { Sparkles, Zap, Star, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLAN_CONFIG = {
  starter: {
    icon: Zap,
    gradient: 'from-slate-400 to-slate-500',
    glow: 'shadow-slate-500/30',
    ring: 'ring-slate-400/40',
    label: 'Starter',
    emoji: '⚡',
  },
  coach: {
    icon: Star,
    gradient: 'from-violet-400 to-indigo-500',
    glow: 'shadow-violet-500/40',
    ring: 'ring-violet-400/50',
    label: 'Coach',
    emoji: '⭐',
  },
  elite: {
    icon: Crown,
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/40',
    ring: 'ring-amber-400/50',
    label: 'Elite',
    emoji: '👑',
  },
};

export default function SubscriptionBadge() {
  const [planId, setPlanId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setPlanId(u?.subscription_plan || 'starter');
    });
  }, []);

  if (!planId) return null;

  const plan = DEFAULT_PLANS.find(p => p.id === planId) || DEFAULT_PLANS[0];
  const config = PLAN_CONFIG[planId] || PLAN_CONFIG.starter;
  const Icon = config.icon;
  const isUpgradable = planId !== 'elite';

  return (
    <Link to="/pricing" className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 hover:ring-white/40 transition-all duration-300 hover:bg-white/15">
      {/* Icon circle */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ${config.glow} ring-2 ${config.ring} flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Text */}
      <div className="text-left">
        <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest leading-none mb-1">Abonnement</p>
        <p className="text-sm font-bold text-white leading-none">{config.label}</p>
        {plan.price_monthly > 0 ? (
          <p className="text-[10px] text-white/50 mt-0.5">{plan.price_monthly}€/mois</p>
        ) : (
          <p className="text-[10px] text-white/50 mt-0.5">Gratuit</p>
        )}
      </div>

      {/* Upgrade hint */}
      {isUpgradable && (
        <div className="ml-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
          <Sparkles className="w-3 h-3 text-violet-300" />
          <span className="text-[10px] font-semibold text-violet-200 whitespace-nowrap">Upgrade</span>
        </div>
      )}
    </Link>
  );
}