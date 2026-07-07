import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Calendar } from 'lucide-react';

const STRUCTURE_LABELS = {
  full_body: 'Corps complet',
  upper_lower: 'Haut / Bas',
  ppl: 'Pousser / Tirer / Jambes',
  arnold_split: 'Split Arnold',
  custom: 'Personnalisé',
};

export default function ProgramSummaryCard({ program, objectives, sessions = [] }) {
  if (!program) {
    return (
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <p className="text-white/70 text-center">Aucun programme actif</p>
      </Card>
    );
  }

  const isInfinite = (program.planned_weeks || 1) >= 52;

  // Séances/semaine réelles, comptées depuis les séances planifiées (les champs
  // du programme comme active_days ne sont pas remplis par les imports).
  const perWeek = {};
  sessions.forEach(s => {
    if (s.status !== 'planned') return;
    const w = s.week_number || 1;
    perWeek[w] = (perWeek[w] || 0) + 1;
  });
  const counts = Object.values(perWeek);
  const sessionsPerWeek = counts.length ? Math.max(...counts) : (program.active_days?.length || 0);

  return (
    <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-white">Programme actif</h3>
        <Badge className="bg-white/20 text-white border-white/30">
          {isInfinite ? 'Cycle ∞' : `${program.planned_weeks || 1} sem.`}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-white/80" />
          <span className="font-medium text-white">{STRUCTURE_LABELS[program.weekly_structure] || program.weekly_structure}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-white/60" />
          <span className="text-white">{sessionsPerWeek} séance{sessionsPerWeek > 1 ? 's' : ''}/semaine</span>
        </div>

        {objectives && objectives.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-white/80" />
            <div className="flex gap-1.5 flex-wrap">
              {[...new Set(objectives.map(o => o.type))].map((type) => (
                <Badge key={type} variant="outline" className="text-xs capitalize text-white border-white/30">
                  {type === 'hypertrophy' ? 'Hypertrophie' : type === 'strength' ? 'Force' : 'Endurance'}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
