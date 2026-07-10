import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const STRUCTURE_LABELS = {
  full_body: 'Corps complet',
  upper_lower: 'Haut / Bas',
  ppl: 'Pousser / Tirer / Jambes',
  arnold_split: 'Split Arnold',
  custom: 'Personnalisé',
};

export default function ProgramSummaryCard({ program, objectives, sessions = [] }) {
  const { t } = useI18n();
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
        <h3 className="font-heading font-bold text-lg text-white">{t('active_program')}</h3>
        <Badge className="bg-white/20 text-white border-white/30">
          {isInfinite ? t('prog_infinite') : `${program.planned_weeks || 1} ${t('prog_weeks')}`}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-white/80" />
          <span className="font-medium text-white">{STRUCTURE_LABELS[program.weekly_structure] ? t(`struct_${program.weekly_structure}`) : program.weekly_structure}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-white/60" />
          <span className="text-white">{sessionsPerWeek} {sessionsPerWeek > 1 ? t('sessions_word') : t('session_word')}{t('per_week')}</span>
        </div>

        {objectives && objectives.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-white/80" />
            <div className="flex gap-1.5 flex-wrap">
              {[...new Set(objectives.map(o => o.type))].map((type) => (
                <Badge key={type} variant="outline" className="text-xs capitalize text-white border-white/30">
                  {t(`type_${type}`) !== `type_${type}` ? t(`type_${type}`) : type}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
