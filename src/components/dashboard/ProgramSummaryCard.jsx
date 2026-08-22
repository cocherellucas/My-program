import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { devNow } from '@/lib/dev-time';
import { libelleStructure } from '@/lib/structures';

export default function ProgramSummaryCard({ program, objectives, sessions = [] }) {
  const { t } = useI18n();
  if (!program) {
    return (
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <p className="text-white/70 text-center">{t('ps_none')}</p>
      </Card>
    );
  }

  const isInfinite = (program.planned_weeks || 1) >= 52;

  // Sur un programme en boucle, « Cycle ∞ » n'apprend rien : il n'y a ni semaine
  // 2/8 ni date de fin pour se situer. On affiche depuis quand il tourne.
  // Même règle que l'onglet de la page Programme : au jour près en dessous de
  // deux semaines, en semaines au-delà — « 20 jours » se compte mal, « 2 semaines »
  // se situe tout de suite.
  const anciennete = (() => {
    const debut = program.created_date ? new Date(program.created_date) : null;
    if (!debut || Number.isNaN(debut.getTime())) return t('prog_infinite');
    const jours = Math.max(0, Math.floor((devNow() - debut) / 86400000));
    if (jours === 0) return t('pg_started_today');
    if (jours < 14) return `${t('pg_active_since')} ${jours} ${jours > 1 ? t('pg_days') : t('pg_day')}`;
    return `${t('pg_active_since')} ${Math.floor(jours / 7)} ${t('pg_weeks')}`;
  })();

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
          {isInfinite ? anciennete : `${program.planned_weeks || 1} ${t('prog_weeks')}`}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-white/80" />
          <span className="font-medium text-white">{libelleStructure(program.weekly_structure, t) || program.weekly_structure}</span>
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
