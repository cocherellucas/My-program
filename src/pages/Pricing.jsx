import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const iconColors = { starter: 'text-muted-foreground', coach: 'text-primary', elite: 'text-yellow-400' };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-3">Choisis ton plan</h1>
          <p className="text-muted-foreground text-lg">Commence gratuitement. Monte en puissance quand tu es prêt.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 bg-muted rounded-full p-1 mt-8">
            <button
              onClick={() => setBilling('monthly')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                billing === 'monthly' ? 'bg-card text-foreground shadow' : 'text-muted-foreground'
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                billing === 'annual' ? 'bg-card text-foreground shadow' : 'text-muted-foreground'
              )}
            >
              Annuel
              <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">-30%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.filter(p => p.visible).map((plan) => {
            const Icon = icons[plan.id] || Star;
            const price = billing === 'monthly' ? plan.price_monthly : plan.price_annual;
            const isFeatured = plan.featured;
            const isActive = user?.subscription_plan === plan.id;

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border p-6 flex flex-col gap-5 transition-all',
                  isFeatured
                    ? 'bg-primary border-primary shadow-2xl shadow-primary/20 scale-105'
                    : 'bg-card border-border'
                )}
              >
                {isFeatured && !isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full">
                      LE PLUS POPULAIRE
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse" />
                      Plan actif
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div>
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                    isFeatured ? 'bg-primary-foreground/10' : 'bg-muted'
                  )}>
                    <Icon className={cn('w-5 h-5', isFeatured ? 'text-primary-foreground' : iconColors[plan.id])} />
                  </div>
                  <h3 className={cn('font-heading font-bold text-xl', isFeatured ? 'text-primary-foreground' : '')}>{plan.name}</h3>
                  <p className={cn('text-sm mt-1', isFeatured ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{plan.description}</p>
                </div>

                {/* Price */}
                <div>
                  {price === 0 ? (
                    <div className={cn('text-4xl font-heading font-bold', isFeatured ? 'text-primary-foreground' : '')}>
                      Gratuit
                    </div>
                  ) : (
                    <div>
                      <span className={cn('text-4xl font-heading font-bold', isFeatured ? 'text-primary-foreground' : '')}>
                        {price.toFixed(2).replace('.', ',')}€
                      </span>
                      <span className={cn('text-sm ml-1', isFeatured ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                        /{billing === 'monthly' ? 'mois' : 'mois · facturé annuellement'}
                      </span>
                      {billing === 'annual' && plan.discount_annual_pct > 0 && (
                        <div className={cn('text-xs mt-1', isFeatured ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                          Économise {plan.discount_annual_pct}% vs mensuel
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className={cn(
                    'w-full font-semibold',
                    isFeatured
                      ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                      : ''
                  )}
                  variant={isFeatured ? 'default' : 'outline'}
                >
                  {plan.cta_label}
                </Button>

                {/* Features */}
                <ul className="space-y-2.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className={cn('w-4 h-4 mt-0.5 flex-shrink-0', isFeatured ? 'text-primary-foreground' : 'text-accent')} />
                      <span className={isFeatured ? 'text-primary-foreground/90' : ''}>{f}</span>
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