import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ThumbsUp, ThumbsDown, AlertTriangle, TrendingUp, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { ZONE_LABELS } from '@/lib/pain-engine';

export default function Memory() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: memories = [] } = useQuery({
    queryKey: ['memory'],
    queryFn: () => base44.entities.UserMemory.filter({ user_id: user.id }),
    enabled: !!user,
  });

  const memory = memories[0];

  const removePreference = async (index) => {
    if (!memory) return;
    const updated = [...(memory.exercise_preferences || [])];
    updated.splice(index, 1);
    await base44.entities.UserMemory.update(memory.id, { exercise_preferences: updated });
    queryClient.invalidateQueries({ queryKey: ['memory'] });
  };

  const removeInjury = async (index) => {
    if (!memory) return;
    const updated = [...(memory.injuries || [])];
    updated.splice(index, 1);
    await base44.entities.UserMemory.update(memory.id, { injuries: updated });
    queryClient.invalidateQueries({ queryKey: ['memory'] });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-3 text-white">
          <Brain className="w-8 h-8 text-white" />
          Mémoire IA
        </h1>
        <p className="text-white/70 mt-1">Tout ce que ton coach IA a mémorisé sur toi</p>
      </div>

      {/* Exercise preferences */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <ThumbsUp className="w-5 h-5 text-white/80" />
          Préférences d'exercices
        </h3>
        {memory?.exercise_preferences?.length > 0 ? (
          <div className="space-y-2">
            {memory.exercise_preferences.map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  {pref.status === 'liked' && <ThumbsUp className="w-4 h-4 text-accent" />}
                  {pref.status === 'disliked' && <ThumbsDown className="w-4 h-4 text-destructive" />}
                  <span className="font-medium text-sm text-white">{pref.exercise}</span>
                  {pref.reason && <span className="text-xs text-white/60">— {pref.reason}</span>}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removePreference(i)}>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">Aucune préférence mémorisée. Utilise le feedback en séance !</p>
        )}
      </Card>

      {/* Injuries */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <AlertTriangle className="w-5 h-5 text-white/80" />
          Blessures / Douleurs
        </h3>
        {memory?.injuries?.length > 0 ? (
          <div className="space-y-2">
            {memory.injuries.map((inj, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div>
                  <span className="font-medium text-sm text-white capitalize">{ZONE_LABELS[inj.zone] || inj.zone}</span>
                  {inj.trigger_exercise && <span className="text-xs text-white/60 ml-2">({inj.trigger_exercise})</span>}
                  <Badge variant={inj.resolved ? 'secondary' : 'destructive'} className="ml-2 text-xs">
                    {inj.resolved ? 'Résolu' : inj.status === 'stop_advised' ? 'En pause' : 'Actif'}
                  </Badge>
                  {inj.level > 0 && <span className="text-xs text-white/50 ml-2">réduction cran {inj.level}</span>}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeInjury(i)}>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">Aucune blessure signalée</p>
        )}
      </Card>

      {/* Fatigue alerts */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5 text-white/80" />
          Historique fatigue
        </h3>
        {memory?.fatigue_alerts?.length > 0 ? (
          <div className="space-y-2">
            {memory.fatigue_alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-xl text-sm text-white">
                <span>Semaine {alert.week}</span>
                <Badge variant="outline">Fatigue moy. {alert.average_fatigue}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">Pas de données</p>
        )}
      </Card>

      {/* AI Reviews */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <FileText className="w-5 h-5 text-white/80" />
          Bilans IA
        </h3>
        {memory?.ai_reviews?.length > 0 ? (
          <div className="space-y-3">
            {memory.ai_reviews.map((review, i) => (
              <Card key={i} className="p-4 bg-white/10 border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{review.type}</Badge>
                  <span className="text-xs text-white/60">{review.date}</span>
                </div>
                <ReactMarkdown className="text-sm prose prose-sm max-w-none">
                  {review.content}
                </ReactMarkdown>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">Aucun bilan généré. Les bilans arrivent après 4 semaines de programme.</p>
        )}
      </Card>

      {!memory && (
        <Card className="p-12 text-center bg-white/15 backdrop-blur-sm border-white/20">
          <Brain className="w-12 h-12 mx-auto text-white/30 mb-4" />
          <p className="text-white/70">La mémoire IA se construit au fil de tes séances</p>
        </Card>
      )}
    </div>
  );
}