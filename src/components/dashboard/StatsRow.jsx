import React from 'react';
import { Card } from '@/components/ui/card';
import { Flame, Target, TrendingUp, CalendarCheck } from 'lucide-react';

export default function StatsRow({ sessions, program }) {
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalPlanned = sessions.filter(s => s.status !== 'skipped').length;
  const adherence = totalPlanned > 0 ? Math.round((completedSessions.length / totalPlanned) * 100) : 0;
  const avgFatigue = completedSessions.length > 0 
    ? (completedSessions.reduce((sum, s) => sum + (s.global_fatigue || 0), 0) / completedSessions.length).toFixed(1)
    : '—';

  const stats = [
    { label: 'Séances complétées', value: completedSessions.length, icon: CalendarCheck, color: 'text-primary' },
    { label: 'Adhérence', value: `${adherence}%`, icon: Target, color: 'text-accent' },
    { label: 'Fatigue moy.', value: avgFatigue, icon: Flame, color: 'text-chart-4' },
    { label: 'Phase', value: program?.active_phase || '—', icon: TrendingUp, color: 'text-chart-3' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} className="p-4 bg-white/15 backdrop-blur-sm border-white/20 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-white">{value}</p>
              <p className="text-xs text-white/70">{label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}