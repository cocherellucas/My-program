import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, Zap, Star, Crown, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_PLANS } from '@/lib/pricing-config';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(setUser);
    base44.entities.AppConfig?.filter?.({ key: 'pricing_plans' }).then(res => {
      if (res?.[0]?.value?.plans) setPlans(res[0].value.plans);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#5b21b6';
    document.documentElement.style.background = '#5b21b6';
    return () => {
      document.body.style.background = prev;
      document.documentElement.style.background = '';
    };
  }, []);

  const icons = { starter: Zap, coach: Star, elite: Crown };
  const visiblePlans = plans.filter(p => p.visible);

  return (
    <div className="min-h-screen bg-violet-800 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-heading font-bold text-white mb-1">Choisis ton plan</h1>
          <p className="text-white/60 text-xs">Commence gratuitement. Monte en puissance quand tu es prêt.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 bg-white/10 border border-white/20 rounded-full p-1 mt-4">
            <button
              onClick={() => setBilling('monthly')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-semibold transition-all',
                billing === 'monthly' ? 'bg-white text-violet-700 shadow' : 'text-white/60 hover:text-white'
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2',
                billing === 'annual' ? 'bg-white text-violet-700 shadow' : 'text-white/60 hover:text-white'
              )}
            >
              Annuel
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-bold', billing === 'annual' ? 'bg-violet-600 text-white' : 'bg-white/20 text-white')}>-30%</span>
            </button>
          </div>
        </div>

        {/* Plan gratuit — pleine largeur horizontal */}
        <div className="mt-6 space-y-3">
          {visiblePlans.filter(p => p.price_monthly === 0).map((plan) => {
            const Icon = icons[plan.id] || Star;
            const isActive = user?.subscription_plan === plan.id;
            return (
              <div key={plan.id} className="relative rounded-2xl p-4 bg-white/10 border border-white/20">
                {isActive && (
                  <div className="absolute -top-2.5 left-4">
                    <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse" />
                      Plan actif
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="font-heading font-bold text-sm text-white">{plan.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-heading font-bold text-white">Gratuit</p>
                    <button className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-white/15 text-white border border-white/20 whitespace-nowrap">
                      {plan.cta_label}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs">
                      <Check className="w-3 h-3 mt-0.5 flex-shrink-0 text-violet-300" />
                      <span className="text-white/80 leading-tight">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Plans payants — 2 colonnes */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {visiblePlans.filter(p => p.price_monthly > 0).map((plan) => {
              const Icon = icons[plan.id] || Star;
              const price = billing === 'monthly' ? plan.price_monthly : plan.price_annual;
              const isFeatured = plan.featured;
              const isActive = user?.subscription_plan === plan.id;
              return (
                <div key={plan.id} className={cn(
                  'relative rounded-2xl p-4 flex flex-col gap-3',
                  isFeatured
                    ? 'bg-white/20 border-2 border-white/50 shadow-xl'
                    : 'bg-white/10 border border-white/20'
                )}>
                  {isFeatured && !isActive && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-white text-violet-700 text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                        POPULAIRE
                      </span>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                        <span className="w-1 h-1 bg-white rounded-full inline-block animate-pulse" />
                        Actif
                      </span>
                    </div>
                  )}
                  <div className="pt-1">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="font-heading font-bold text-base text-white">{plan.name}</p>
                    <p className="text-xs text-white/60 mt-0.5 leading-tight">{plan.description}</p>
                  </div>
                  <div>
                    <span className="text-2xl font-heading font-bold text-white">{price.toFixed(2).replace('.', ',')}€</span>
                    <span className="text-xs text-white/60 ml-1">/mois</span>
                    {billing === 'annual' && plan.discount_annual_pct > 0 && (
                      <p className="text-[10px] text-white/50 mt-0.5">Économise {plan.discount_annual_pct}%</p>
                    )}
                  </div>
                  <button className={cn(
                    'w-full py-2.5 rounded-xl font-semibold text-sm transition-all',
                    isFeatured ? 'bg-white text-violet-700' : 'bg-white/15 text-white border border-white/20'
                  )}>
                    {plan.cta_label}
                  </button>
                  <ul className="space-y-1.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs">
                        <Check className="w-3 h-3 mt-0.5 flex-shrink-0 text-violet-300" />
                        <span className="text-white/80 leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
