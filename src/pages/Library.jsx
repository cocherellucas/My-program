import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Dumbbell, Trash2, Play, Clock, ChevronDown, ChevronUp, CalendarDays, Loader2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { addDays, startOfWeek, endOfWeek, parseISO, format as fmtDate } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STRUCTURE_LABELS = {
  full_body: 'Full Body',
  upper_lower: 'Upper / Lower',
  ppl: 'PPL',
  arnold_split: 'Arnold Split',
  custom: 'Personnalisé',
  unknown: null,
};

const STRUCTURE_COLORS = {
  full_body:    'bg-white/20 text-white border-white/20',
  upper_lower:  'bg-white/20 text-white border-white/20',
  ppl:          'bg-white/20 text-white border-white/20',
  arnold_split: 'bg-white/20 text-white border-white/20',
  custom:       'bg-white/10 text-white/60 border-white/15',
};

const TYPE_LABELS = { strength: 'Force', hypertrophy: 'Hypertrophie', endurance: 'Endurance', mixed: 'Mixte' };
const TYPE_COLORS = {
  strength: 'bg-white/20 text-white border-white/20',
  hypertrophy: 'bg-white/20 text-white border-white/20',
  endurance: 'bg-white/20 text-white border-white/20',
  mixed: 'bg-white/20 text-white border-white/20',
};

function SavedProgramCard({ prog, onDelete, onReapply, isReapplying }) {
  const [expanded, setExpanded] = useState(false);
  const [openSessions, setOpenSessions] = useState({});
  const label = STRUCTURE_LABELS[prog.structure_type];
  const color = STRUCTURE_COLORS[prog.structure_type] || '';
  const sessions = prog.sessions_templates || [];
  // Programme importé → on ne connaît pas le vrai type des séances, pas de badge (Mixte…)
  const isImported = prog.weekly_structure === 'custom' || prog.structure_type === 'custom';

  return (
    <Card className="p-5 space-y-3 bg-white/15 backdrop-blur-sm border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold font-heading text-base text-white">{prog.name?.replace(/\s*·\s*\w+$/, '')}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-white/60 flex-wrap">
            <span>Sauvegardé le {format(new Date(prog.created_date), 'd MMM yyyy', { locale: fr })}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button size="sm" variant="outline" onClick={() => setExpanded(!expanded)} className="border-white/30 text-white hover:bg-white/10 hover:text-white">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button size="sm" onClick={() => onReapply(prog)} disabled={isReapplying} className="bg-white/20 text-white hover:bg-white/30 border-0 disabled:opacity-70">
            {isReapplying ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Lancement…</> : <><Play className="w-3.5 h-3.5 mr-1" /> Relancer</>}
          </Button>
          <Button size="sm" variant="ghost" className="text-red-300 hover:text-red-200 hover:bg-red-500/20" onClick={() => onDelete(prog.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {expanded && sessions.length > 0 && (
        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wide">Séances du programme</p>
          <div className="grid gap-1">
            {(() => {
              // Inférer le numéro de semaine si non présent
              const uniqueDays = [...new Set(sessions.map(s => s.day).filter(Boolean))];
              const sessionsPerWeek = uniqueDays.length || 3;
              return sessions.map((s, i) => {
                const curWeek = s.week_number ?? (Math.floor(i / sessionsPerWeek) + 1);
                const prevS = sessions[i - 1];
                const prevWeek = prevS ? (prevS.week_number ?? (Math.floor((i - 1) / sessionsPerWeek) + 1)) : null;
                const showWeekHeader = curWeek !== prevWeek;
              return (
                <React.Fragment key={i}>
                  {showWeekHeader && (
                    <div className="flex items-center gap-2 mt-2 mb-1">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Semaine {curWeek}</span>
                      <div className="flex-1 h-px bg-white/20" />
                    </div>
                  )}
                  <div className="bg-white/10 rounded-lg overflow-hidden">
                    <button type="button" onClick={() => setOpenSessions(o => ({ ...o, [i]: !o[i] }))}
                      className="w-full px-3 py-2 text-left hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-white text-sm truncate flex-1">{s.day_label || s.day}</span>
                        {!isImported && <Badge className={`text-xs flex-shrink-0 ${TYPE_COLORS[s.type] || 'bg-muted'}`}>{TYPE_LABELS[s.type] || s.type}</Badge>}
                        {(s.exercises?.length > 0) && <ChevronDown className={`w-4 h-4 text-white/50 flex-shrink-0 transition-transform ${openSessions[i] ? 'rotate-180' : ''}`} />}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.estimated_duration} min</span>
                        <span>{s.exercises?.length || 0} exercices</span>
                      </div>
                    </button>
                    {openSessions[i] && s.exercises?.length > 0 && (
                      <div className="px-3 pb-2.5 pt-1 space-y-2 border-t border-white/10">
                        {s.exercises.map((ex, ei) => (
                          <div key={ei} className="flex flex-col gap-0.5">
                            <span className="text-white text-sm font-medium">{ex.name}</span>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/50">
                              <span>{ex.sets} × {ex.target_reps}</span>
                              {ex.target_weight ? <span>· {ex.target_weight} {ex.weight_unit || 'kg'}</span> : null}
                              {ex.rest_seconds ? <span>· {ex.rest_seconds}s repos</span> : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            });
            })()}
          </div>
        </div>
      )}

      {prog.notes && (
        <p className="text-xs text-muted-foreground italic border-t pt-2">{prog.notes}</p>
      )}
    </Card>
  );
}

function SessionHistoryCard({ session }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4 bg-white/15 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 rounded-xl bg-white/20 flex flex-col items-center justify-center flex-shrink-0 py-1.5">
            <span className="text-[10px] text-white/70 capitalize leading-none">
              {session.actual_date && format(new Date(session.actual_date), 'EEE', { locale: fr })}
            </span>
            <span className="text-sm font-bold text-white leading-none mt-1">
              {session.actual_date && format(new Date(session.actual_date), 'd')}
            </span>
            {session.week_number && (
              <span className="text-[9px] text-white/50 leading-none mt-1.5 uppercase tracking-wider">
                S{session.week_number}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-white">{session.day_label || 'Séance'}</span>
              <Badge className={`text-xs ${TYPE_COLORS[session.type] || 'bg-muted'}`}>
                {TYPE_LABELS[session.type] || session.type}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-white/60">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.actual_duration || session.estimated_duration} min</span>
              <span>{session.exercises?.length || 0} exercices</span>
              {session.global_fatigue && <span>Fatigue : {session.global_fatigue}/5</span>}
            </div>
          </div>
        </div>
        {session.exercises?.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)}
            className="text-white/70 hover:text-white hover:bg-white/10">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-white/20 mt-3 pt-3 space-y-1">
          {session.exercises?.map((ex, i) => (
            <div key={i} className="flex items-center justify-between text-xs text-white/60">
              <span className="font-medium text-white">{ex.name}</span>
              <span>{ex.sets} × {ex.target_reps}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// Onglet Séances : filtres jour/mois/année (style calendrier) + regroupement par semaine
function SessionsTab({ sessions }) {
  const [dayFilter, setDayFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Années disponibles : à partir des dates de séances
  const availableYears = React.useMemo(() => {
    const set = new Set();
    sessions.forEach(s => { if (s.actual_date) set.add(s.actual_date.slice(0, 4)); });
    return [...set].sort().reverse();
  }, [sessions]);

  const MONTHS = [
    { value: '01', label: 'Janvier' },   { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },      { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },       { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },   { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' }, { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },  { value: '12', label: 'Décembre' },
  ];

  const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const filtered = sessions.filter(s => {
    if (!s.actual_date) return false;
    const [y, m, d] = s.actual_date.split('-');
    if (yearFilter !== 'all' && y !== yearFilter) return false;
    if (monthFilter !== 'all' && m !== monthFilter) return false;
    if (dayFilter !== 'all' && d !== dayFilter) return false;
    return true;
  });

  // Regrouper par semaine (clé = lundi de la semaine)
  const weeks = React.useMemo(() => {
    const map = new Map();
    filtered.forEach(s => {
      if (!s.actual_date) return;
      const d = parseISO(s.actual_date);
      const monday = startOfWeek(d, { weekStartsOn: 1 });
      const key = fmtDate(monday, 'yyyy-MM-dd');
      if (!map.has(key)) map.set(key, { monday, sessions: [] });
      map.get(key).sessions.push(s);
    });
    // Tri par date desc + sessions intra-semaine par date desc
    return [...map.values()]
      .sort((a, b) => b.monday - a.monday)
      .map(w => ({
        ...w,
        sessions: w.sessions.sort((a, b) => new Date(a.actual_date) - new Date(b.actual_date)),
      }));
  }, [filtered]);

  if (sessions.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/15 backdrop-blur-sm border-white/20">
        <Dumbbell className="w-10 h-10 mx-auto text-white/30 mb-3" />
        <p className="font-medium mb-1 text-white">Aucune séance complétée</p>
        <p className="text-sm text-white/60">Tes séances terminées apparaîtront ici.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtres : Jour · Mois · Année */}
      <div className="grid grid-cols-3 gap-2">
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
            <SelectValue placeholder="Jour" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Jour</SelectItem>
            {DAYS.map(d => (
              <SelectItem key={d} value={d}>{parseInt(d)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mois</SelectItem>
            {MONTHS.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Année</SelectItem>
            {availableYears.map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Compteur résultat */}
      <p className="text-xs text-white/50">
        {filtered.length} séance{filtered.length > 1 ? 's' : ''}
        {(monthFilter !== 'all' || dayFilter !== 'all' || yearFilter !== 'all') && ' filtrée' + (filtered.length > 1 ? 's' : '')}
      </p>

      {/* Liste regroupée par semaine */}
      {weeks.length === 0 ? (
        <Card className="p-8 text-center bg-white/10 border-white/15">
          <p className="text-sm text-white/60">Aucune séance avec ces filtres.</p>
        </Card>
      ) : (
        <div className="space-y-5">
          {weeks.map(week => {
            const sunday = endOfWeek(week.monday, { weekStartsOn: 1 });
            return (
              <div key={fmtDate(week.monday, 'yyyy-MM-dd')} className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/40"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(46,16,101,0.55) 0%, rgba(46,16,101,0.25) 70%, transparent 100%)',
                  }}>
                  <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider whitespace-nowrap">
                    Semaine du {fmtDate(week.monday, 'd MMM', { locale: fr })} au {fmtDate(sunday, 'd MMM', { locale: fr })}
                  </span>
                  <span className="text-[11px] text-white/60 ml-auto whitespace-nowrap">
                    {week.sessions.length} séance{week.sessions.length > 1 ? 's' : ''}
                  </span>
                </div>
                {week.sessions.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                    <SessionHistoryCard session={s} />
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Library() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const [relaunchGate, setRelaunchGate] = useState(null); // programme sauvegardé en attente de relance
  const [gateBusy, setGateBusy] = useState(false);

  const { data: savedPrograms = [] } = useQuery({
    queryKey: ['saved-programs'],
    queryFn: () => base44.entities.SavedProgram.filter({ user_id: user.id }, '-created_date'),
    enabled: !!user,
  });

  const { data: activePrograms = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.filter({ status: 'active' }, '-created_date', 1),
    enabled: !!user,
  });

  const { data: completedSessions = [] } = useQuery({
    queryKey: ['completed-sessions'],
    queryFn: () => base44.entities.Session.filter({ user_id: user.id, status: 'completed' }, '-actual_date', 50),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedProgram.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-programs'] }),
  });

  const reapplyMutation = useMutation({
    mutationFn: async (prog) => {
      // Désactiver les programmes actifs
      const active = await base44.entities.Program.filter({ user_id: user.id, status: 'active' });
      for (const p of active) {
        await base44.entities.Program.update(p.id, { status: 'suspended' });
      }

      // Recréer le programme
      const newProg = await base44.entities.Program.create({
        user_id: user.id,
        version: 1,
        objective_ids: prog.objective_ids || [],
        weekly_structure: prog.weekly_structure,
        planned_weeks: prog.planned_weeks,
        active_phase: prog.active_phase || 'MEV',
        status: 'active',
        multi_objective_mode: prog.multi_objective_mode || 'simple',
        program_data: prog.program_data,
      });

      // Recréer les séances depuis les templates
      const dayMap = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };
      // On ancre sur le lundi de la semaine COURANTE et on ne crée pas les jours
      // déjà passés → le programme redémarre dès CETTE semaine (jours restants),
      // l'ordre est préservé, et rien n'est planifié dans le passé.
      const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const templates = prog.sessions_templates || [];

      for (const s of templates) {
        const weekNumber = s.week_number || 1;
        const dayOffset = (weekNumber - 1) * 7 + (dayMap[s.day] ?? 0);
        const date = addDays(monday, dayOffset);
        if (format(date, 'yyyy-MM-dd') < todayStr) continue; // jour déjà passé → on ne crée pas
        await base44.entities.Session.create({
          program_id: newProg.id,
          user_id: user.id,
          planned_date: format(date, 'yyyy-MM-dd'),
          estimated_duration: s.estimated_duration || 60,
          type: s.type || 'mixed',
          active_zones: s.active_zones || [],
          exercises: s.exercises || [],
          status: 'planned',
          week_number: weekNumber,
          day_label: s.day_label || s.day,
        });
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['programs'] }),
        queryClient.invalidateQueries({ queryKey: ['program-sessions'] }),
      ]);
    },
    onSuccess: () => navigate('/program'),
    onError: (e) => { console.error('[reapply] erreur :', e); alert(`Erreur lors du lancement : ${e?.message || e}`); },
  });

  // Clic "Relancer" : si un programme est déjà actif, on demande quoi en faire
  const handleReapply = (prog) => {
    if (activePrograms.length > 0) setRelaunchGate(prog);
    else reapplyMutation.mutate(prog);
  };

  // Supprime le(s) programme(s) actif(s) + leurs séances non complétées
  const deleteActivePrograms = async () => {
    for (const p of activePrograms) {
      await base44.entities.Program.update(p.id, { status: 'completed' });
      let toDelete;
      do {
        const batch = await base44.entities.Session.filter({ program_id: p.id });
        toDelete = batch.filter(s => s.status !== 'completed');
        await Promise.all(toDelete.map(s => base44.entities.Session.delete(s.id)));
      } while (toDelete.length > 0);
    }
  };

  // Sauvegarde le programme actif en Bibliothèque avant de le remplacer
  const saveActivePrograms = async () => {
    for (const p of activePrograms) {
      const existing = await base44.entities.Session.filter({ program_id: p.id });
      const seen = new Set();
      const templates = existing
        .filter(s => { const k = (s.week_number || 1) + '|' + (s.day_label || ''); if (seen.has(k)) return false; seen.add(k); return true; })
        .map(s => ({
          day: s.planned_date ? new Date(s.planned_date).toLocaleDateString('en', { weekday: 'long' }).toLowerCase() : '',
          day_label: s.day_label, week_number: s.week_number, type: s.type,
          estimated_duration: s.estimated_duration, active_zones: s.active_zones, exercises: s.exercises,
        }));
      const weeksCount = new Set(existing.map(s => s.week_number).filter(Boolean)).size || p.planned_weeks || 1;
      await base44.entities.SavedProgram.create({
        user_id: user.id,
        name: `Programme — ${weeksCount} sem.`,
        structure_type: p.weekly_structure || 'custom',
        weekly_structure: p.weekly_structure,
        planned_weeks: weeksCount,
        active_phase: p.active_phase,
        multi_objective_mode: p.multi_objective_mode,
        objective_ids: p.objective_ids,
        program_data: p.program_data,
        sessions_templates: templates,
      });
    }
  };

  const runRelaunch = async (saveFirst) => {
    setGateBusy(true);
    try {
      if (saveFirst) await saveActivePrograms();
      await deleteActivePrograms();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['saved-programs'] }),
        queryClient.invalidateQueries({ queryKey: ['programs'] }),
      ]);
      const prog = relaunchGate;
      setRelaunchGate(null);
      await reapplyMutation.mutateAsync(prog);
    } catch (e) {
      console.error('[relaunch] erreur :', e);
      alert(`Erreur : ${e?.message || e}`);
    } finally {
      setGateBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Bibliothèque</h1>
        <p className="text-white/70 mt-1">Programmes sauvegardés et historique des séances</p>
      </div>

      <Tabs defaultValue="programs">
        <TabsList className="bg-white/10 text-white">
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Programmes ({savedPrograms.length})
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Séances ({completedSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="mt-4">
          {savedPrograms.length === 0 ? (
            <Card className="p-12 text-center bg-white/15 backdrop-blur-sm border-white/20">
              <BookOpen className="w-10 h-10 mx-auto text-white/30 mb-3" />
              <p className="font-medium mb-1 text-white">Aucun programme sauvegardé</p>
              <p className="text-sm text-white/60">
                Depuis la page Programme, clique sur "Sauvegarder" pour conserver un programme que tu aimes.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
              {savedPrograms.map((prog, i) => (
                <motion.div key={prog.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }} transition={{ duration: 0.25 }}>
                  <SavedProgramCard
                    prog={prog}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    onReapply={handleReapply}
                    isReapplying={(reapplyMutation.isPending || (gateBusy && relaunchGate?.id === prog.id)) && (reapplyMutation.variables?.id === prog.id || relaunchGate?.id === prog.id)}
                  />
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <SessionsTab sessions={completedSessions} />
        </TabsContent>
      </Tabs>

      {/* Gate de relance — porté dans body (sinon le transform du carrousel casse le position:fixed) */}
      {relaunchGate && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => { if (!gateBusy) setRelaunchGate(null); }}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-2xl p-5 space-y-3"
            style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div>
              <p className="font-bold text-white text-lg">Tu as déjà un programme actif</p>
              <p className="text-white/70 text-sm mt-1">Pour relancer ce programme, choisis quoi faire avec le programme actuel.</p>
            </div>
            <button type="button" disabled={gateBusy} onClick={() => runRelaunch(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-left disabled:opacity-50">
              <BookOpen className="w-5 h-5 text-violet-300 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-white">Sauvegarder puis relancer</p>
                <p className="text-xs text-white/60 mt-0.5">Le programme actuel sera conservé dans Bibliothèque</p>
              </div>
            </button>
            <button type="button" disabled={gateBusy} onClick={() => runRelaunch(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 transition-colors text-left disabled:opacity-50">
              <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-white">Supprimer et relancer</p>
                <p className="text-xs text-red-300 mt-0.5">Le programme actuel sera définitivement supprimé</p>
              </div>
            </button>
            <button type="button" disabled={gateBusy} onClick={() => setRelaunchGate(null)}
              className="w-full py-2.5 rounded-xl border border-white/15 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {gateBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Lancement…</> : 'Annuler'}
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}