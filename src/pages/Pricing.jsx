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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Choisis ton plan</h1>
          <p className="text-white/60 text-sm">Commence gratuitement. Monte en puissance quand tu es prêt.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 bg-white/10 border border-white/20 rounded-full p-1 mt-6">
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

        {/* Plans — 3 colonnes sur mobile ET desktop */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          {visiblePlans.map((plan) => {
            const Icon = icons[plan.id] || Star;
            const price = billing === 'monthly' ? plan.price_monthly : plan.price_annual;
            const isFeatured = plan.featured;
            const isActive = user?.subscription_plan === plan.id;

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl p-3 flex flex-col gap-3',
                  isFeatured
                    ? 'bg-white/20 border-2 border-white/50 shadow-xl'
                    : 'bg-white/10 border border-white/20'
                )}
              >
                {isFeatured && !isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full flex justify-center">
                    <span className="bg-white text-violet-700 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      POPULAIRE
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full flex justify-center">
                    <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <span className="w-1 h-1 bg-white rounded-full inline-block animate-pulse" />
                      Actif
                    </span>
                  </div>
                )}

                <div className="pt-1">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="font-heading font-bold text-sm text-white leading-tight">{plan.name}</p>
                </div>

                <div>
                  {price === 0 ? (
                    <p className="text-xl font-heading font-bold text-white">Gratuit</p>
                  ) : (
                    <p className="text-xl font-heading font-bold text-white leading-tight">
                      {price.toFixed(2).replace('.', ',')}€
                      <span className="text-[10px] font-normal text-white/60 block">/mois</span>
                    </p>
                  )}
                </div>

                <button className={cn(
                  'w-full py-2 rounded-xl font-semibold text-[11px] transition-all',
                  isFeatured
                    ? 'bg-white text-violet-700'
                    : 'bg-white/15 text-white border border-white/20'
                )}>
                  {plan.cta_label}
                </button>

                <ul className="space-y-1.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[10px]">
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
  );
}
