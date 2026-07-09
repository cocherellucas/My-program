import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Target, Palmtree, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function SessionInfo({ session }) {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-white/80" />
        <span className="font-medium text-white">
          {session.planned_date && format(new Date(session.planned_date), 'EEEE d MMMM', { locale: fr })}
        </span>
        <span className="text-white/60">· {session.estimated_duration || 60} min</span>
      </div>
      {session.active_zones && session.active_zones.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4 text-white/80" />
          <div className="flex gap-1.5 flex-wrap">
            {session.active_zones.length >= 6 ? (
              <Badge variant="outline" className="text-xs text-white border-white/30">Corps complet</Badge>
            ) : (
              session.active_zones.map((z, i) => (
                <Badge key={i} variant="outline" className="text-xs text-white border-white/30">{z.muscle_group}</Badge>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const STRUCTURE_LABELS = { full_body: 'Full Body', upper_lower: 'Upper / Lower', ppl: 'PPL', arnold_split: 'Arnold Split', custom: 'Personnalisé' };

export default function NextSessionCard({ todaySession, nextSession, hasSessions, activeProgram }) {
  // Cas 1 : séance aujourd'hui
  if (todaySession) {
    const isInProgress = (() => { try { return localStorage.getItem('active_session_id') === String(todaySession.id); } catch { return false; } })();
    return (
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-2 border-white/40 overflow-hidden relative shadow-lg shadow-white/10">
        {/* Rond décoratif + cible par-dessus (même position, même taille) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <Target strokeWidth={1} className="absolute top-0 right-0 w-32 h-32 text-white/20 -translate-y-8 translate-x-8" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-white">Séance du jour</h3>
            <div className="flex items-center gap-1.5">
              {activeProgram?.weekly_structure && STRUCTURE_LABELS[activeProgram.weekly_structure] && (
                <Badge className="bg-white/25 text-white border-white/30">{STRUCTURE_LABELS[activeProgram.weekly_structure]}</Badge>
              )}
              <Badge className="bg-white/25 text-white border-white/30">
                {{ hypertrophy: 'Hypertrophie', strength: 'Force', endurance: 'Endurance', mixed: 'Mixte' }[todaySession.type] || todaySession.type}
              </Badge>
            </div>
          </div>
          <SessionInfo session={todaySession} />
          <Link to={`/session?id=${todaySession.id}`}>
            <Button className="w-full bg-white text-violet-700 hover:bg-white/90 font-semibold">
              <Play className="w-4 h-4 mr-2" />
              {isInProgress ? 'Reprendre la séance' : 'Commencer la séance'}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Cas 2 : pas de séance aujourd'hui, mais programme existant
  if (hasSessions) {
    return (
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Palmtree className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">Repos aujourd'hui</h3>
            <p className="text-xs text-white/60">Aucune séance prévue — profites-en pour récupérer.</p>
          </div>
        </div>
        {nextSession && (
          <div className="pt-4 border-t border-white/20">
            <p className="text-xs text-white/50 mb-2 uppercase tracking-wide font-semibold">Prochaine séance</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{(nextSession.day_label || nextSession.type || '').replace(/\s*§\d+/g, '')}</p>
                <p className="text-xs text-white/60">
                  {nextSession.planned_date && format(new Date(nextSession.planned_date), 'EEEE d MMMM', { locale: fr })}
                  {' · '}{nextSession.estimated_duration || 60} min
                </p>
              </div>
              <Badge variant="outline" className="text-xs text-white border-white/30">
                {nextSession.estimated_duration || 60} min
              </Badge>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Cas 3 : pas de programme / aucune séance
  return (
    <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
      <div className="flex flex-col items-center text-center gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-white mb-1">Pas encore de programme</h3>
          <p className="text-xs text-white/60">Crée ton premier programme pour planifier tes séances.</p>
        </div>
        <Link to="/program" className="w-full">
          <Button className="w-full bg-white text-violet-700 hover:bg-white/90 font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Créer un programme
          </Button>
        </Link>
      </div>
    </Card>
  );
}
