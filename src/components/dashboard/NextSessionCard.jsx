import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NextSessionCard({ session }) {
  if (!session) {
    return (
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <p className="text-white/70 text-center">Pas de séance planifiée</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-white">Prochaine séance</h3>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {session.day_label || session.type}
          </Badge>
        </div>

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
                    <Badge key={i} variant="outline" className="text-xs text-white border-white/30">
                      {z.muscle_group}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link to={`/session?id=${session.id}`}>
          <Button className="w-full bg-white text-violet-700 hover:bg-white/90 font-semibold">
            <Play className="w-4 h-4 mr-2" />
            Commencer la séance
          </Button>
        </Link>
      </div>
    </Card>
  );
}