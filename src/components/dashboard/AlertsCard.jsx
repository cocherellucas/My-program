import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, Zap, SkipForward, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const DISMISS_DURATION_MS = 4 * 7 * 24 * 60 * 60 * 1000; // 4 semaines

const ALERT_CONFIG = {
  fatigue:            { icon: Zap,           color: 'text-destructive',      bg: 'bg-destructive/10' },
  plateau:            { icon: TrendingDown,   color: 'text-chart-4',          bg: 'bg-chart-4/10' },
  missed:             { icon: SkipForward,    color: 'text-muted-foreground', bg: 'bg-muted' },
  imbalance:          { icon: AlertTriangle,  color: 'text-chart-5',          bg: 'bg-chart-5/10' },
  structural_plateau: { icon: Calendar,       color: 'text-orange-400',       bg: 'bg-orange-400/10' },
};

export default function AlertsCard({ alerts }) {
  const navigate = useNavigate();

  const [dismissed, setDismissed] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('dismissed_alerts') || '{}');
      const now = Date.now();
      return Object.fromEntries(Object.entries(raw).filter(([, ts]) => now - ts < DISMISS_DURATION_MS));
    } catch { return {}; }
  });

  const dismissAlert = (type) => {
    const updated = { ...dismissed, [type]: Date.now() };
    setDismissed(updated);
    localStorage.setItem('dismissed_alerts', JSON.stringify(updated));
  };

  const visibleAlerts = (alerts || []).filter(a => !dismissed[a.type]);

  if (visibleAlerts.length === 0) {
    return (
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-3 text-white">Alertes</h3>
        <p className="text-sm text-white/70">Tout va bien ! Aucune alerte pour le moment.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
      <h3 className="font-heading font-bold text-lg mb-4 text-white">Alertes</h3>
      <div className="space-y-3">
        {visibleAlerts.map((alert, i) => {
          const config = ALERT_CONFIG[alert.type] || ALERT_CONFIG.fatigue;
          const Icon = config.icon;
          const isStructural = alert.type === 'structural_plateau';
          return (
            <div key={i} className={cn('p-3 rounded-xl border', isStructural ? 'bg-orange-400/10 border-orange-400/20' : 'bg-white/10 border-white/15')}>
              <div className="flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="text-sm text-white/90">{alert.message}</p>
                  {alert.detail && (
                    <p className="text-xs text-white/50 whitespace-pre-line">{alert.detail}</p>
                  )}
                  {isStructural && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate('/profile?tab=availability')}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-orange-400/20 text-orange-300 border border-orange-400/30 hover:bg-orange-400/30 transition-colors">
                        <Calendar className="w-3.5 h-3.5" />
                        Modifier mes disponibilités
                      </button>
                      <button
                        onClick={() => dismissAlert('structural_plateau')}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 text-white/50 border border-white/20 hover:bg-white/10 hover:text-white/70 transition-colors">
                        <Check className="w-3.5 h-3.5" />
                        Ça me convient
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}