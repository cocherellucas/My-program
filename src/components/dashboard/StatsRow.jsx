import React from 'react';
import { Card } from '@/components/ui/card';
import { Flame, BadgeCheck, CalendarCheck, CalendarDays } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function StatsRow({ sessions, program }) {
  const { t } = useI18n();
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalPlanned = sessions.filter(s => s.status !== 'skipped').length;
  const adherence = totalPlanned > 0 ? Math.round((completedSessions.length / totalPlanned) * 100) : 0;
  const avgFatigue = completedSessions.length > 0
    ? (completedSessions.reduce((sum, s) => sum + (s.global_fatigue || 0), 0) / completedSessions.length).toFixed(1)
    : '—';

  // Séances de la semaine calendaire en cours (faites / prévues)
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const toStr = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const monS = toStr(mon), sunS = toStr(sun);
  const weekSessions = sessions.filter(s => s.planned_date && s.planned_date >= monS && s.planned_date <= sunS && s.status !== 'skipped');
  const weekDone = weekSessions.filter(s => s.status === 'completed').length;

  const stats = [
    { label: t('stat_completed'), value: completedSessions.length, icon: CalendarCheck, color: 'text-fuchsia-300' },
    { label: t('stat_adherence'), value: `${adherence}%`, icon: BadgeCheck, color: 'text-green-300' },
    { label: t('stat_fatigue'), value: avgFatigue, icon: Flame, color: 'text-orange-300' },
    { label: t('stat_week'), value: `${weekDone}/${weekSessions.length}`, icon: CalendarDays, color: 'text-violet-200' },
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
