import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import { ensureOnline } from '@/lib/net';

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
    if (!ensureOnline()) return;
    const updated = [...(memory.exercise_preferences || [])];
    updated.splice(index, 1);
    try {
      await base44.entities.UserMemory.update(memory.id, { exercise_preferences: updated });
      queryClient.invalidateQueries({ queryKey: ['memory'] });
    } catch (e) { console.error('[memory] removePreference', e); }
  };

  const removeInjury = async (index) => {
    if (!memory) return;
    if (!ensureOnline()) return;
    const updated = [...(memory.injuries || [])];
    updated.splice(index, 1);
    try {
      await base44.entities.UserMemory.update(memory.id, { injuries: updated });
      queryClient.invalidateQueries({ queryKey: ['memory'] });
    } catch (e) { console.error('[memory] removeInjury', e); }
  };

  // Tout supprimer : vide l'intégralité de la mémoire du coach (avec confirmation).
  // Supprime aussi les épisodes de suivi douleur (injuries) → le suivi s'arrête.
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [wiping, setWiping] = useState(false);
  const wipeMemory = async () => {
    if (!memory) { setConfirmWipe(false); return; }
    if (!ensureOnline()) return;
    setWiping(true);
    try {
      await base44.entities.UserMemory.update(memory.id, {
        exercise_preferences: [], structure_preferences: [], objective_history: [],
        fatigue_alerts: [], past_adaptations: [], injuries: [], ai_reviews: [],
        coach_notes: '',
      });
      queryClient.invalidateQueries({ queryKey: ['memory'] });
    } catch (e) { console.error('[memory] wipe', e); }
    setWiping(false);
    setConfirmWipe(false);
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
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20" onClick={() => removePreference(i)}>
                  <Trash2 className="w-3.5 h-3.5 text-red-300" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">Aucune préférence mémorisée. Gère tes exercices préférés ou à éviter dans Profil → Préférences.</p>
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
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20" onClick={() => removeInjury(i)}>
                  <Trash2 className="w-3.5 h-3.5 text-red-300" />
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

      {/* Tout supprimer */}
      {memory && (
        <button onClick={() => setConfirmWipe(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-red-500/15 text-red-300 border border-red-400/30 hover:bg-red-500/25 transition-colors">
          <Trash2 className="w-4 h-4" /> Tout supprimer
        </button>
      )}

      {/* Confirmation — modal centrée avec fond flouté (même pattern que le reste de l'app) */}
      {confirmWipe && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => !wiping && setConfirmWipe(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-violet-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base">Effacer toute la mémoire ?</p>
              <p className="text-sm text-white/60 mt-1">Préférences, blessures/douleurs (le suivi en cours s'arrête), historique fatigue, bilans et notes. Cette action est irréversible.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmWipe(false)} disabled={wiping}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-60">
                Annuler
              </button>
              <button onClick={wipeMemory} disabled={wiping}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60">
                {wiping ? 'Suppression…' : 'Tout supprimer'}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}