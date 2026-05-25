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

        {/* Plans — scroll horizontal sur mobile, grille sur desktop */}
        <div className="md:hidden -mx-4 px-4">
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {visiblePlans.map((plan) => {
              const Icon = icons[plan.id] || Star;
              const price = billing === 'monthly' ? plan.price_monthly : plan.price_annual;
              const isFeatured = plan.featured;
              const isActive = user?.subscription_plan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'relative rounded-2xl p-5 flex flex-col gap-4 flex-shrink-0 snap-center',
                    'w-[78vw] max-w-[300px]',
                    isFeatured
                      ? 'bg-white/20 border-2 border-white/50 shadow-xl'
                      : 'bg-white/10 border border-white/20'
                  )}
                >
                  {isFeatured && !isActive && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-white text-violet-700 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        LE PLUS POPULAIRE
                      </span>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse" />
                        Plan actif
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2.5">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white">{plan.name}</h3>
                    <p className="text-xs mt-0.5 text-white/60">{plan.description}</p>
                  </div>

                  <div>
                    {price === 0 ? (
                      <div className="text-3xl font-heading font-bold text-white">Gratuit</div>
                    ) : (
                      <div>
                        <span className="text-3xl font-heading font-bold text-white">
                          {price.toFixed(2).replace('.', ',')}€
                        </span>
                        <span className="text-xs ml-1 text-white/60">
                          /{billing === 'monthly' ? 'mois' : 'an'}
                        </span>
                      </div>
                    )}
                  </div>

                  <button className={cn(
                    'w-full py-2.5 rounded-xl font-semibold text-sm transition-all',
                    isFeatured
                      ? 'bg-white text-violet-700 hover:bg-white/90'
                      : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                  )}>
                    {plan.cta_label}
                  </button>

                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-violet-300" />
                        <span className="text-white/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Indicateurs de pagination */}
          <div className="flex justify-center gap-1.5 mt-2">
            {visiblePlans.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />
            ))}
          </div>
        </div>

        {/* Desktop — grille 3 colonnes */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-start">
          {visiblePlans.map((plan) => {
            const Icon = icons[plan.id] || Star;
            const price = billing === 'monthly' ? plan.price_monthly : plan.price_annual;
            const isFeatured = plan.featured;
            const isActive = user?.subscription_plan === plan.id;

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl p-6 flex flex-col gap-5',
                  isFeatured
                    ? 'bg-white/20 border-2 border-white/50 shadow-2xl scale-105'
                    : 'bg-white/10 border border-white/20'
                )}
              >
                {isFeatured && !isActive && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-violet-700 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                      LE PLUS POPULAIRE
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse" />
                      Plan actif
                    </span>
                  </div>
                )}
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white">{plan.name}</h3>
                  <p className="text-sm mt-1 text-white/60">{plan.description}</p>
                </div>
                <div>
                  {price === 0 ? (
                    <div className="text-4xl font-heading font-bold text-white">Gratuit</div>
                  ) : (
                    <div>
                      <span className="text-4xl font-heading font-bold text-white">
                        {price.toFixed(2).replace('.', ',')}€
                      </span>
                      <span className="text-sm ml-1 text-white/60">
                        /{billing === 'monthly' ? 'mois' : 'mois · facturé annuellement'}
                      </span>
                      {billing === 'annual' && plan.discount_annual_pct > 0 && (
                        <div className="text-xs mt-1 text-white/50">Économise {plan.discount_annual_pct}% vs mensuel</div>
                      )}
                    </div>
                  )}
                </div>
                <button className={cn(
                  'w-full py-3 rounded-xl font-semibold text-sm transition-all',
                  isFeatured
                    ? 'bg-white text-violet-700 hover:bg-white/90 shadow'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                )}>
                  {plan.cta_label}
                </button>
                <ul className="space-y-2.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-violet-300" />
                      <span className="text-white/80">{f}</span>
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
