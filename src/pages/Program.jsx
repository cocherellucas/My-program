import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Loader2, Calendar, Dumbbell, Clock, ChevronRight, ChevronLeft, Bookmark, BookmarkCheck, Trash2, RefreshCw, Pencil, Download } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format, addDays, startOfWeek } from 'date-fns';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import GenerateProgramDialog from '@/components/program/GenerateProgramDialog';
import { buildProgramContext, formatProgramBrief } from '@/lib/program-builder';
import { getContextualKnowledge } from '@/lib/scientific-knowledge-base';
import { normalizeUser } from '@/lib/utils';
import ImportSessionDialog from '@/components/coach/ImportSessionDialog';
import { calcDuration } from '@/lib/duration';
import { exportProgramPDF } from '@/lib/program-pdf';

function LoadingOrb() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <style>{`
        @keyframes ping1 { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.35); opacity: 0; } }
        @keyframes ping2 { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.6); opacity: 0; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .ring1 { animation: ping1 1.6s ease-in-out infinite; }
        .ring2 { animation: ping2 2.2s ease-in-out infinite 0.4s; }
        .arc1 { animation: spin-slow 3s linear infinite; }
        .arc2 { animation: spin-reverse 2s linear infinite; }
      `}</style>
      {/* Pulsing rings */}
      <div className="ring1 absolute inset-0 rounded-full border-2 border-white/40" />
      <div className="ring2 absolute inset-0 rounded-full border border-white/20" />
      {/* Spinning arcs */}
      <div className="arc1 absolute inset-2">
        <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
          <circle cx="30" cy="30" r="28" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="44 132" strokeLinecap="round" />
        </svg>
      </div>
      <div className="arc2 absolute inset-4">
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <circle cx="20" cy="20" r="18" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="28 84" strokeLinecap="round" />
        </svg>
      </div>
      {/* Center icon */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

const TYPE_LABELS = { strength: 'Force', hypertrophy: 'Hypertrophie', endurance: 'Endurance', mixed: 'Mixte', full_body: 'Corps entier', upper_lower: 'Haut/Bas', ppl: 'Pousser/Tirer/Jambes', arnold_split: 'Split Arnold', custom: 'Personnalisé' };
const TYPE_COLORS = { strength: 'bg-chart-5/10 text-chart-5', hypertrophy: 'bg-primary/10 text-primary', endurance: 'bg-accent/10 text-accent', mixed: 'bg-chart-4/10 text-chart-4' };

export default function Program() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const onProgramPage = location.pathname === '/program';
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const importedProgramIds = (() => { try { return JSON.parse(localStorage.getItem('imported_program_ids') || '[]'); } catch { return []; } })();
  const [generating, setGenerating] = useState(false);
  const [genPhase, setGenPhase] = useState('');
  const [genSeconds, setGenSeconds] = useState(0);
  const [genError, setGenError] = useState(null);
  const genParamsRef = React.useRef(null);
  const genTimerRef = React.useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showRegenGate, setShowRegenGate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [staleBanner, setStaleBanner] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('pending_program_regen') || 'null');
      return p && Date.now() - p.timestamp < 30 * 24 * 60 * 60 * 1000; // 30 jours max
    } catch { return false; }
  });
  const [relaunching, setRelaunching] = useState(false);
  const autoGenerated = useRef(false);
  const autoImported = useRef(false);
  const [pendingImportSessions, setPendingImportSessions] = useState(null);
  const weekTabsRef = useRef(null); // barre d'onglets semaines (pour la flèche de défilement)
  const [tabsAtEnd, setTabsAtEnd] = useState(false); // true quand on a atteint la dernière semaine
  const [tabsAtStart, setTabsAtStart] = useState(true); // true quand on est sur la première semaine

  // Sérialise TOUTE opération qui modifie les séances en base (sauvegarde ou recharge
  // infinie) : empêche qu'un delete+recreate et une création de cycles se chevauchent.
  const persistingRef = useRef(false);
  const pendingTaskRef = useRef(null);

  const runExclusive = async (task) => {
    if (persistingRef.current) { pendingTaskRef.current = task; return; }
    persistingRef.current = true;
    try {
      await task();
      while (pendingTaskRef.current) {
        const next = pendingTaskRef.current;
        pendingTaskRef.current = null;
        await next();
      }
    } finally {
      persistingRef.current = false;
    }
  };

  const persistImport = (editedSessions, weeks) =>
    runExclusive(() => saveEditedSessions(editedSessions, weeks, { keepOpen: editedSessions.length > 0 }));

  const openEditDialog = async () => {
    try { localStorage.removeItem('_import_form'); localStorage.removeItem('_import_scroll'); } catch {}
    if (!activeProgram) {
      setPendingImportSessions({ sessions: [], isEditing: false, initialWeeks: 'infinite' });
      return;
    }
    try {
      const all = await base44.entities.Session.filter({ program_id: activeProgram.id });
      const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const todayStr = new Date().toISOString().split('T')[0];
      // La structure ACTUELLE du programme = ses séances PLANIFIÉES (recréées en
      // bloc à chaque sauvegarde). Les complétées sont de l'historique : les
      // inclure ferait réapparaître d'anciens créneaux (jour déplacé, ancien
      // libellé) en doublon dans le dialog.
      const source = all.some(s => s.status === 'planned') ? all.filter(s => s.status === 'planned') : all;
      // On veut UNE séance par créneau (même intitulé + même jour de semaine) :
      // la prochaine séance planifiée à venir en priorité, sinon la plus récente.
      const bySlot = new Map();
      for (const s of source) {
        if (!s.planned_date) continue;
        const dow = new Date(s.planned_date + 'T12:00:00').getDay();
        const key = (s.day_label || '').trim().toLowerCase() + '::' + dow;
        const isUpcoming = s.status === 'planned' && s.planned_date >= todayStr;
        const cur = bySlot.get(key);
        if (!cur) { bySlot.set(key, s); continue; }
        const curUpcoming = cur.status === 'planned' && cur.planned_date >= todayStr;
        if (isUpcoming && !curUpcoming) bySlot.set(key, s);
        else if (isUpcoming && curUpcoming) {
          // Instance la plus COMPLÈTE d'abord (le suivi douleur peut retirer des
          // exos d'une séance sur deux → ne pas propager ce retrait au cycle),
          // puis la plus proche dans le temps.
          const exN = (s.exercises || []).length, curN = (cur.exercises || []).length;
          if (exN > curN || (exN === curN && s.planned_date < cur.planned_date)) bySlot.set(key, s);
        }
        else if (!isUpcoming && !curUpcoming) { if (s.planned_date > cur.planned_date) bySlot.set(key, s); }
      }
      // Référence de poids affichée = poids de la DERNIÈRE SÉRIE COMPLÉTÉE de chaque
      // exercice (lu dans les logs de séance), et non le poids planifié d'origine.
      const refWeight = {}; // nom d'exo -> dernier poids soulevé (> 0)
      try {
        const sessionDate = {};
        all.forEach(s => { sessionDate[s.id] = s.actual_date || s.planned_date || ''; });
        const progSessionIds = new Set(all.map(s => s.id));
        const userLogs = await base44.entities.SeriesLog.filter({ user_id: activeProgram.user_id });
        const best = {}; // nom -> { date, setNumber }
        for (const l of userLogs) {
          if (!progSessionIds.has(l.session_id)) continue;
          if (!l.weight || Number(l.weight) <= 0) continue;
          const date = sessionDate[l.session_id] || '';
          const setN = l.set_number || 0;
          const cur = best[l.exercise_name];
          if (!cur || date > cur.date || (date === cur.date && setN >= cur.setNumber)) {
            best[l.exercise_name] = { date, setNumber: setN };
            refWeight[l.exercise_name] = Number(l.weight);
          }
        }
      } catch (e) { console.error('ref weight lookup', e); }

      const monFirst = d => (new Date(d + 'T12:00:00').getDay() + 6) % 7;
      const formatted = Array.from(bySlot.values())
        .sort((a, b) => monFirst(a.planned_date) - monFirst(b.planned_date) || (a.planned_date < b.planned_date ? -1 : 1))
        .map(s => {
          const raw = s.day_label || '';
          const om = raw.match(/§(\d)/); // ordre dans la journée encodé dans le label
          return {
            label: raw.replace(/§\d/, '').trim(),
            day: s.planned_date ? dayNames[new Date(s.planned_date + 'T12:00:00').getDay()] : 'monday',
            order: om ? parseInt(om[1], 10) : null,
            exercises: (s.exercises || []).map(e => refWeight[e.name] != null ? { ...e, target_weight: refWeight[e.name] } : e),
            content: (s.exercises || []).map(e => {
              const w = refWeight[e.name] != null ? refWeight[e.name] : e.target_weight;
              return `${e.sets || 3}×${e.target_reps || 10} ${e.name}${w ? ` (${w}${e.weight_unit || 'kg'})` : ''} ${e.rest_seconds || 90}s`;
            }).join('\n'),
            type: s.type || 'mixed',
            estimated_duration: s.estimated_duration || calcDuration(s.exercises || []),
          };
        });
      // Ordre dans la journée : normaliser (1ère, 2ème…) pour chaque jour
      const byDay = {};
      formatted.forEach(s => { (byDay[s.day] ||= []).push(s); });
      Object.values(byDay).forEach(list => {
        list.sort((a, b) => (a.order || 9) - (b.order || 9));
        list.forEach((s, idx) => { s.order = idx + 1; });
      });
      const pw = activeProgram.planned_weeks;
      const initialWeeks = pw && pw >= 52 ? 'infinite' : (pw || 4);
      setPendingImportSessions({ sessions: formatted, isEditing: true, initialWeeks });
    } catch (e) {
      console.error(e);
    }
  };

  const saveEditedSessions = async (editedSessions, targetWeeks, opts = {}) => {
    try {
      // Plus aucune séance → on supprime le programme entièrement
      if (!editedSessions || editedSessions.length === 0) {
        if (activeProgram) {
          await base44.entities.Program.update(activeProgram.id, { status: 'completed' });
          let toDelete;
          do {
            const batch = await base44.entities.Session.filter({ program_id: activeProgram.id });
            toDelete = batch.filter(s => s.status !== 'completed');
            await Promise.all(toDelete.map(s => base44.entities.Session.delete(s.id)));
          } while (toDelete.length > 0);
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['programs'] }),
            queryClient.invalidateQueries({ queryKey: ['program-sessions'] }),
          ]);
        }
        setPendingImportSessions(null);
        return;
      }
      const CYCLE_WEEKS = targetWeeks === 'infinite' ? 52 : (targetWeeks || 4);
      const dayMap = { monday:0, tuesday:1, wednesday:2, thursday:3, friday:4, saturday:5, sunday:6 };
      const today = new Date(); today.setHours(0,0,0,0);
      const thisMon = new Date(today);
      thisMon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      const toLocalDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

      // Aucun programme actif (ex: import direct depuis l'onboarding) → on en crée un
      let program = activeProgram;
      if (!program) {
        const me = user || normalizeUser(await base44.auth.me());
        program = await base44.entities.Program.create({
          user_id: me.id,
          version: 1,
          objective_ids: objectives.map(o => o.id),
          weekly_structure: 'custom',
          planned_weeks: CYCLE_WEEKS,
          active_phase: 'MEV',
          status: 'active',
        });
      }

      // Supprimer toutes les séances planned (en boucle car limit 1000 par fetch)
      let deleted = true;
      while (deleted) {
        const batch = await base44.entities.Session.filter({ program_id: program.id, status: 'planned' });
        if (!batch.length) { deleted = false; break; }
        await Promise.all(batch.map(s => base44.entities.Session.delete(s.id)));
      }
      await base44.entities.Program.update(program.id, { planned_weeks: CYCLE_WEEKS });

      // Les séances déjà COMPLÉTÉES à partir de ce lundi ne doivent pas être
      // recréées en "planifiée" : elles existent déjà (faites) → doublon sinon.
      const doneSlots = new Set();
      try {
        const remaining = await base44.entities.Session.filter({ program_id: program.id });
        remaining
          .filter(s => s.status !== 'planned' && s.planned_date && s.planned_date >= toLocalDate(thisMon))
          .forEach(s => doneSlots.add(`${s.planned_date}::${(s.day_label || '').replace(/§\d/, '').trim().toLowerCase()}`));
      } catch {}

      // Recréer en expandant sur CYCLE_WEEKS
      const expanded = Array.from({ length: Math.ceil(CYCLE_WEEKS / 1) }, (_, i) =>
        editedSessions.map(s => ({ ...s, week_number: i + 1 }))
      ).flat().filter(s => s.week_number <= CYCLE_WEEKS);

      // On ancre le programme sur le lundi de la semaine COURANTE et on crée TOUTE
      // la semaine (semaine 0 = semaine en cours). Les jours déjà écoulés de cette
      // semaine restent créés → visibles en "passées". Aucune semaine antérieure
      // n'est créée (la 1ʳᵉ séance est au plus tôt ce lundi).
      const startMon = new Date(thisMon);

      for (const s of expanded) {
        const dayOffset = dayMap[s.day?.toLowerCase()] ?? 0;
        const weekNum = (s.week_number || 1) - 1;
        const d = new Date(startMon);
        d.setDate(startMon.getDate() + dayOffset + weekNum * 7);
        const slotKey = `${toLocalDate(d)}::${(s.label || s.day || '').replace(/§\d/, '').trim().toLowerCase()}`;
        if (doneSlots.has(slotKey)) continue; // déjà faite ce jour-là
        await base44.entities.Session.create({
          user_id: program.user_id,
          program_id: program.id,
          week_number: s.week_number,
          day_label: `${s.label || s.day}${s.order && s.order > 1 ? ` §${s.order}` : ''}`,
          type: ['strength','hypertrophy','endurance','mixed','cardio','mobility'].includes(s.type) ? s.type : 'mixed',
          status: 'planned',
          planned_date: toLocalDate(d),
          estimated_duration: s.estimated_duration || calcDuration(s.exercises || []),
          exercises: s.exercises || [],
          active_zones: [...new Set((s.exercises || []).map(e => e.muscle_group).filter(Boolean))].map(m => ({ muscle_group: m })),
        });
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['programs'] }),
        queryClient.invalidateQueries({ queryKey: ['program-sessions'] }),
      ]);
      if (!opts.keepOpen) setPendingImportSessions(null);
    } catch (e) {
      console.error(e);
      alert(`Erreur lors de l'enregistrement : ${e?.message || e}`);
    }
  };

  // Programmes "infinis" (planned_weeks >= 52) : on maintient toujours ~1 an de séances
  // d'avance. Dès qu'il reste moins de 12 semaines futures, on recrée des cycles
  // jusqu'à 52 semaines devant → en pratique le programme ne s'arrête jamais.
  const INFINITE_THRESHOLD = 52;
  const INFINITE_BUFFER_WEEKS = 8;
  const INFINITE_TARGET_WEEKS = 20;
  const infiniteToppedRef = useRef(null);

  const ensureInfiniteSessions = (program) => runExclusive(async () => {
    try {
      if (!program || (program.planned_weeks || 0) < INFINITE_THRESHOLD) return;
      const all = await base44.entities.Session.filter({ program_id: program.id });
      if (!all.length) return;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const toLocalDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

      // Réparation de la semaine calendaire EN COURS : d'anciennes versions ne
      // créaient pas les jours déjà passés de la semaine → des trous (lundi→hier)
      // peuvent subsister. On recrée les séances manquantes de cette semaine à
      // partir du cycle planifié → la semaine s'affiche en entier (passés grisés).
      const thisMon = new Date(today);
      thisMon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      const planned = all.filter(s => s.status === 'planned' && s.planned_date);
      let backfilled = 0;
      if (planned.length) {
        const byWeek = {};
        planned.forEach(s => { const w = s.week_number || 1; (byWeek[w] ||= []).push(s); });
        // Cycle de référence = la semaine planifiée la plus fournie (la semaine en
        // cours peut être partielle : séances déjà faites ou jours manquants).
        const tpl = Object.entries(byWeek).sort((a, b) => b[1].length - a[1].length || a[0] - b[0])[0][1];
        const monStr = toLocalDate(thisMon);
        const sunEnd = new Date(thisMon); sunEnd.setDate(thisMon.getDate() + 6);
        const sunStr = toLocalDate(sunEnd);
        const norm = l => (l || '').replace(/§\d/, '').trim().toLowerCase();
        const weekRows = all.filter(s => s.planned_date && s.planned_date >= monStr && s.planned_date <= sunStr);
        const have = new Set(weekRows.map(s => `${s.planned_date}::${norm(s.day_label)}`));
        const curWeekNum = weekRows.length
          ? Math.min(...weekRows.map(s => s.week_number || 1))
          : Math.min(...planned.map(s => s.week_number || 1));
        for (const t of tpl) {
          const dow = (new Date(t.planned_date + 'T12:00:00').getDay() + 6) % 7; // 0 = lundi
          const d = new Date(thisMon); d.setDate(thisMon.getDate() + dow);
          const dateStr = toLocalDate(d);
          const key = `${dateStr}::${norm(t.day_label)}`;
          if (have.has(key)) continue;
          have.add(key);
          await base44.entities.Session.create({
            user_id: t.user_id,
            program_id: program.id,
            week_number: curWeekNum,
            day_label: t.day_label,
            type: t.type || 'mixed',
            status: 'planned',
            planned_date: dateStr,
            estimated_duration: t.estimated_duration || calcDuration(t.exercises || []),
            exercises: t.exercises || [],
            active_zones: t.active_zones || [],
          });
          backfilled++;
        }
        if (backfilled) queryClient.invalidateQueries({ queryKey: ['program-sessions'] });
      }

      // Semaine la plus avancée déjà planifiée + sa date la plus lointaine
      const maxWeek = Math.max(...all.map(s => s.week_number || 1));
      const lastDateStr = all.map(s => s.planned_date).filter(Boolean).sort().pop();
      if (!lastDateStr) return;
      const lastDate = new Date(lastDateStr + 'T12:00:00');
      const weeksAhead = Math.floor((lastDate - today) / (7 * 86400000));
      if (weeksAhead >= INFINITE_BUFFER_WEEKS) return; // encore assez de marge

      // Template = les séances de la dernière semaine (reprend les éventuelles éditions)
      const template = all.filter(s => (s.week_number || 1) === maxWeek);
      // On vise TARGET semaines APRÈS aujourd'hui (et non après la dernière séance,
      // qui peut être dans le passé si l'utilisateur a été absent longtemps).
      const weeksToAdd = INFINITE_TARGET_WEEKS - weeksAhead;
      const creates = [];
      for (let w = 1; w <= weeksToAdd; w++) {
        for (const t of template) {
          const nd = new Date(t.planned_date + 'T12:00:00');
          nd.setDate(nd.getDate() + w * 7);
          if (nd < today) continue; // jamais de séance créée dans le passé
          creates.push(base44.entities.Session.create({
            user_id: t.user_id,
            program_id: program.id,
            week_number: maxWeek + w,
            day_label: t.day_label,
            type: t.type || 'mixed',
            status: 'planned',
            planned_date: toLocalDate(nd),
            estimated_duration: t.estimated_duration || calcDuration(t.exercises || []),
            exercises: t.exercises || [],
            active_zones: t.active_zones || [],
          }));
        }
      }
      if (!creates.length) return;
      await Promise.all(creates);
      queryClient.invalidateQueries({ queryKey: ['program-sessions'] });
    } catch (e) {
      console.error('[infinite top-up] erreur :', e);
    }
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    base44.auth.me().then(u => setUser(normalizeUser(u)));
  }, []);

  const { data: objectives = [] } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => base44.entities.Objective.filter({ status: 'active' }),
    enabled: !!user,
  });

  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.filter({ status: 'active' }, '-created_date', 1),
    enabled: !!user,
  });

  const activeProgram = programs[0] || null;
  const isImported = (session) =>
    importedProgramIds.includes(session.program_id) || activeProgram?.weekly_structure === 'custom';

  // Recharge des séances pour les programmes infinis (une fois par programme à l'ouverture)
  useEffect(() => {
    if (!activeProgram) return;
    if (infiniteToppedRef.current === activeProgram.id) return;
    infiniteToppedRef.current = activeProgram.id;
    ensureInfiniteSessions(activeProgram);
  }, [activeProgram?.id]); // eslint-disable-line

  // Nettoyer le staleBanner pour les programmes importés (faux positif)
  useEffect(() => {
    if (activeProgram?.weekly_structure === 'custom' || importedProgramIds.includes(activeProgram?.id)) {
      localStorage.removeItem('pending_program_regen');
      setStaleBanner(false);
    }
  }, [activeProgram?.id]); // eslint-disable-line
  const alreadySaved = activeProgram ? localStorage.getItem(`saved_program_${activeProgram.id}`) === 'true' : false;

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['program-sessions', activeProgram?.id],
    queryFn: () => base44.entities.Session.filter({ program_id: activeProgram.id }, 'planned_date'),
    enabled: !!activeProgram,
  });

  // Programmes déjà en Bibliothèque (pour ne pas reproposer d'enregistrer un programme identique)
  const { data: savedPrograms = [] } = useQuery({
    queryKey: ['saved-programs'],
    queryFn: () => base44.entities.SavedProgram.filter({ user_id: user.id }),
    enabled: !!user,
  });

  // Auto-ouverture du dialog d'import après onboarding
  useEffect(() => {
    if (!autoImported.current && searchParams.get('openImport') === 'true') {
      autoImported.current = true;
      setPendingImportSessions({ sessions: [], isEditing: false, initialWeeks: 'infinite' });
    }
  }, []); // eslint-disable-line

  // ?edit=true (ex: "Le faire moi-même" depuis une proposition de volume) → ouvre Modifier
  const editOpenedRef = useRef(false);
  useEffect(() => {
    if (!editOpenedRef.current && activeProgram && searchParams.get('edit') === 'true') {
      editOpenedRef.current = true;
      openEditDialog();
    }
  }, [activeProgram]); // eslint-disable-line

  // Fin d'onboarding → ouvre le dialog de configuration (l'utilisateur choisit ou laisse "Auto")
  const configOpenedRef = useRef(false);
  useEffect(() => {
    if (!configOpenedRef.current && !activeProgram && searchParams.get('configureProgram') === 'true') {
      configOpenedRef.current = true;
      setShowDialog(true);
    }
  }, [activeProgram]); // eslint-disable-line

  // Fin d'onboarding avec programme déjà présent → modale "sauvegarder / supprimer puis générer"
  const regenGateOpenedRef = useRef(false);
  useEffect(() => {
    if (!regenGateOpenedRef.current && activeProgram && searchParams.get('regenGate') === 'true') {
      regenGateOpenedRef.current = true;
      setShowRegenGate(true);
    }
  }, [activeProgram]); // eslint-disable-line

  // Auto-génération après onboarding
  useEffect(() => {
    if (user && objectives.length > 0 && !activeProgram && !generating && !autoGenerated.current && searchParams.get('autoGenerate') === 'true') {
      autoGenerated.current = true;
      try {
        const ctx = buildProgramContext(user, objectives);
        generateProgram({ structure: ctx.structure, weeks: ctx.plannedWeeks, phase: 'MEV' });
      } catch (err) {
        console.error('[auto-generate] erreur :', err);
        alert(`Erreur génération automatique : ${err?.message || err}`);
      }
    }
  }, [user, objectives, activeProgram, generating]);

  const generateProgram = async ({ structure, weeks, phase }) => {
    genParamsRef.current = { structure, weeks, phase };
    setGenerating(true);
    setGenError(null);
    setGenSeconds(0);
    setGenPhase('Analyse du profil…');
    genTimerRef.current = setInterval(() => setGenSeconds(s => s + 1), 1000);
    try {

    const weeksIsAuto = !weeks || weeks === 'auto';

    // Pré-calcul déterministe — zéro API
    setGenPhase('Calcul du volume et des splits…');
    const programCtx     = buildProgramContext(user, objectives);
    const programBrief   = formatProgramBrief({ ...programCtx, structure: structure || programCtx.structure, plannedWeeks: weeksIsAuto ? null : weeks, phase });
    const scienceContext = getContextualKnowledge(user, objectives);
    setGenPhase('L\'IA construit ton programme…');

    const structureInstruction = structure
      ? `Utilise OBLIGATOIREMENT la structure "${structure}" pour organiser les séances.`
      : `Choisis la structure la plus adaptée (full_body, upper_lower, ppl, arnold_split, custom) selon le profil et le nombre de jours disponibles.`;

    const phaseInstruction = phase
      ? `Phase de départ imposée : ${phase}.`
      : `Phase de départ : MEV pour tous les niveaux en début de nouveau mésocycle (principe RP — on commence toujours au volume minimum efficace et on progresse vers le MRV sur 6-10 semaines). Exception : MAV si l'utilisateur est intermédiaire/avancé et reprend un programme déjà établi sans coupure.`;

    const prompt = `Tu es un coach sportif expert en périodisation scientifique. Ta mission : lire d'abord le profil complet, puis appliquer les références scientifiques sélectionnées POUR CE PROFIL, puis respecter le brief chiffré, puis générer.

═══════════════════════════════════════════════════
ÉTAPE 1 — PROFIL COMPLET (lire en premier, tout prendre en compte)
═══════════════════════════════════════════════════
- Niveau : ${user.level || '?'} | Âge : ${user.age || '?'} | Poids : ${user.weight || '?'}kg | Taille : ${user.height || '?'}cm | Genre : ${user.gender || '?'}
${(user.level === 'intermediate' || user.level === 'advanced') ? `- Morphologie : bras ${user.morphology_arm_length || 'moyen'}, jambes ${user.morphology_leg_length || 'moyen'}, silhouette ${user.morphology_silhouette || 'non renseignée'}, posture ${user.morphology_posture || 'non renseignée'}` : '- Morphologie : non applicable (débutant — la morphologie n\'influence pas la sélection d\'exercices à ce stade)'}
- Objectifs : ${JSON.stringify(objectives.map(o => ({ type: o.type, zone: o.zone, focus: o.focus_group, muscles: o.focus_muscles, priority: o.priority })))}
- Peaking activé (pic de performance à court terme) : ${user.peaking_enabled ? 'OUI — réduire volume, augmenter intensité pour réalisation' : 'non'}
- Disponibilités : ${user.availability_optimal ? 'FLEXIBLE — choisis les jours optimaux selon la science' : `Jours : ${(user.available_days || []).join(', ')} | Durées : ${JSON.stringify(user.duration_per_day || {})} min | Fréquence souhaitée : ${user.frequency_min || '?'}–${user.frequency_max || '?'} séances/sem`}
- Équipement STRICT (aucun autre matériel autorisé) : ${(user.equipment || []).join(', ') || 'poids du corps uniquement'}
- Exercices aimés (à prioriser) : ${(user.preferred_exercises||[]).join(', ') || 'aucun'}
- Exercices à éviter (ne jamais inclure) : ${(user.disliked_exercises||[]).join(', ') || 'aucun'}
- Muscles à NE PAS développer : ${(() => { try { const m = JSON.parse(user.no_volume_muscles || '[]'); return m.length ? m.join(', ') : 'aucun'; } catch { return user.no_volume_muscles || 'aucun'; } })()}
- Zones fragiles (adapter les exercices selon les règles scientifiques ci-dessous) : ${(() => { try { const fz = Array.isArray(user.fragile_zones) ? user.fragile_zones : JSON.parse(user.fragile_zones || '[]'); return fz.map(z => typeof z === 'string' ? z : z.key).join(', ') || 'aucune'; } catch { return 'aucune'; } })()}
- Techniques avancées autorisées : ${user.accepts_advanced_techniques ? 'oui' : 'non'}
- Préférence volume : ${['Faible (MEV)', 'Modéré (MAV)', 'Élevé (MRV)'][((user.pref_volume || 2) - 1)]}
- Préférence intensité : ${['Confort (RIR 3+)', 'Challenge (RIR 1-2)', 'Maximal (RIR 0-1)'][((user.pref_intensity || 2) - 1)]}
- Préférence fréquence : ${['1×/sem par muscle', '2×/sem par muscle', '3×+/sem par muscle'][((user.pref_frequency || 2) - 1)]}

═══════════════════════════════════════════════════
ÉTAPE 2 — RÉFÉRENCES SCIENTIFIQUES POUR CE PROFIL (applique chacune)
Ces données ont été sélectionnées spécifiquement pour le niveau, les objectifs, les zones fragiles et les contraintes du profil ci-dessus (équipement, disponibilités, préférences). Applique-les en tenant compte de ces contraintes :
═══════════════════════════════════════════════════
${scienceContext || 'Principes RP/Israetel : MEV→MAV→MRV, fréquence 2×/sem par muscle, double progression, RIR 1-3.'}

═══════════════════════════════════════════════════
ÉTAPE 3 — BRIEF PRÉ-CALCULÉ
═══════════════════════════════════════════════════
${programBrief}

⚠️ Le brief est une référence calculée. Les RÈGLES ABSOLUES en bas sont non-négociables. Tout le reste est un guide — si le profil (morphologie, historique, combinaison de contraintes) justifie un écart raisonnable, priorise le jugement de coach sur la valeur exacte.

═══════════════════════════════════════════════════
ÉTAPE 4 — GÉNÉRATION
═══════════════════════════════════════════════════
${structureInstruction}
${phaseInstruction}
${weeksIsAuto
  ? `DURÉE DU PROGRAMME : tu choisis le nombre de semaines optimal (planned_weeks) en fonction du profil complet ci-dessus. Critères RP/science :
- Niveau débutant + objectif hypertrophie/endurance → 4 sem. | force → 4-5 sem.
- Niveau intermédiaire + hypertrophie → 6-8 sem. | force → 8-10 sem.
- Niveau avancé + hypertrophie → 8-10 sem. | force → 10-12 sem.
- Modificateurs : fréquence élevée (5-6j) → -1 sem. | fréquence basse (2-3j) → +1-2 sem. | zone fragile active → -1 sem. | âge 50+ → -1 sem. | préférence intensité élevée → -1 sem.
Retourne ce choix dans le champ "planned_weeks" de ta réponse JSON.`
  : `DURÉE IMPOSÉE : ${weeks} semaines.`}
Génère un programme COMPLET avec le champ "week" de 1 à planned_weeks pour chaque séance.
⚠️ VOLUME OBLIGATOIRE : le champ "week" DOIT couvrir TOUTES les semaines de 1 à planned_weeks — chaque semaine a ses propres séances distinctes. Ne génère JAMAIS uniquement la semaine 1.
Chaque séance = tous les exercices avec sets, reps, RIR, repos.
Règles absolues : jamais à l'échec sur squat/deadlift/bench barre/OHP barre. Échec autorisé dernière série isolation uniquement. SRA : 48h min entre séances hypertrophie même muscle, 72h pour force composé lourd.

IMPORTANT FORMAT: Le champ "day" doit OBLIGATOIREMENT être en anglais minuscule parmi: monday, tuesday, wednesday, thursday, friday, saturday, sunday. Ne jamais utiliser de majuscules ou de noms français.
IMPORTANT LANGUE: Les noms des exercices ET les labels de séance (day_label) doivent être en FRANÇAIS. Exemple de day_label : "Lundi - Poitrine & Dos", "Mercredi - Jambes", "Vendredi - Full Body". Ne jamais mettre de jours en anglais dans day_label.
Les noms des exercices doivent aussi être en FRANÇAIS.
Les groupes musculaires (muscle_group) doivent aussi être en FRANÇAIS. Exemples : "Pectoraux", "Dos", "Biceps", "Triceps", "Épaules", "Jambes", "Quadriceps", "Ischio-jambiers", "Fessiers", "Abdominaux", "Mollets". Ne jamais utiliser de termes anglais comme "Chest", "Back", "Legs", etc.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          weekly_structure: { type: "string" },
          planned_weeks: { type: "number", description: "Optimal number of weeks chosen by the AI based on the user profile" },
          multi_objective_mode: { type: "string" },
          sessions: {
          type: "array",
          items: {
          type: "object",
          properties: {
          week: { type: "number" },
          day: { type: "string", description: "Day in English lowercase: monday, tuesday, wednesday, thursday, friday, saturday, sunday" },
                day_label: { type: "string" },
                type: { type: "string" },
                estimated_duration: { type: "number" },
                active_zones: { type: "array", items: { type: "object", properties: { muscle_group: { type: "string" }, objective: { type: "string" } } } },
                exercises: { type: "array", items: { type: "object", properties: { name: { type: "string" }, muscle_group: { type: "string" }, sets: { type: "number" }, target_reps: { type: "string" }, rest_seconds: { type: "number" }, block: { type: "string" }, notes: { type: "string" } } } }
              }
            }
          }
        }
      }
    });

    // Create program
    setGenPhase('Enregistrement du programme…');
    const program = await base44.entities.Program.create({
      user_id: user.id,
      version: 1,
      objective_ids: objectives.map(o => o.id),
      weekly_structure: (() => {
        const allowed = ['full_body', 'upper_lower', 'ppl', 'arnold_split', 'phul', 'ul_ppl', 'custom'];
        const raw = structure || result.weekly_structure || 'full_body';
        return allowed.includes(raw) ? raw : 'full_body';
      })(),
      active_days: (user.available_days || []).map(d => ({ day: d, duration_minutes: (user.duration_per_day || {})[d] || 60 })),
      planned_weeks: weeksIsAuto ? (result.planned_weeks || 4) : weeks,
      active_phase: phase || 'MEV',
      status: 'active',
      multi_objective_mode: ['simple', 'parallel', 'sequential', 'vif'].includes(result.multi_objective_mode) ? result.multi_objective_mode : 'simple',
      program_data: result,
    });

    // Create sessions — start from this Monday if today IS Monday, else next Monday
    const todayD = new Date(); todayD.setHours(0, 0, 0, 0);
    const thisMon = startOfWeek(new Date(), { weekStartsOn: 1 });
    const monday = thisMon >= todayD ? thisMon : addDays(thisMon, 7);
    const dayMap = {
      monday: 0, lundi: 0,
      tuesday: 1, mardi: 1,
      wednesday: 2, mercredi: 2,
      thursday: 3, jeudi: 3,
      friday: 4, vendredi: 4,
      saturday: 5, samedi: 5,
      sunday: 6, dimanche: 6,
    };

    const totalSessions = (result.sessions || []).length;
    let sessionIdx = 0;
    for (const s of (result.sessions || [])) {
      sessionIdx++;
      setGenPhase(`Création des séances… (${sessionIdx}/${totalSessions})`);
      const weekOffset = ((s.week || 1) - 1) * 7;
      const normalizedDay = (s.day || '').toLowerCase().trim();
      const dayOffset = dayMap[normalizedDay] ?? 0;
      const date = addDays(monday, weekOffset + dayOffset);

      await base44.entities.Session.create({
        program_id: program.id,
        user_id: user.id,
        planned_date: format(date, 'yyyy-MM-dd'),
        estimated_duration: s.estimated_duration || 60,
        type: ['strength','hypertrophy','endurance','mixed','cardio','mobility'].includes(s.type) ? s.type : 'mixed',
        active_zones: s.active_zones || [],
        exercises: s.exercises || [],
        status: 'planned',
        week_number: s.week || 1,
        day_label: s.day_label || s.day,
      });
    }

    queryClient.invalidateQueries({ queryKey: ['programs'] });
    queryClient.invalidateQueries({ queryKey: ['program-sessions'] });

    // Snapshot des conditions de génération — permet de détecter l'obsolescence et les reverts
    const SNAPSHOT_FIELDS = ['available_days','duration_per_day','frequency_min','frequency_max','equipment','level','fragile_zones','preferred_exercises','disliked_exercises','no_volume_muscles','peaking_enabled'];
    const snapshot = {};
    SNAPSHOT_FIELDS.forEach(f => { snapshot[f] = user[f]; });
    localStorage.setItem('program_generated_snapshot', JSON.stringify(snapshot));
    localStorage.removeItem('pending_program_regen');
    setStaleBanner(false);

    } catch (err) {
      console.error('[generateProgram] erreur :', err);
      const isNetwork = /network|fetch|failed to fetch/i.test(err?.message || '');
      if (isNetwork) {
        setGenError('network');
      } else {
        setGenError(err?.message || 'Erreur inconnue');
      }
    } finally {
      clearInterval(genTimerRef.current);
      setGenerating(false);
      setGenPhase('');
      setGenSeconds(0);
    }
  };

  const [deleting, setDeleting] = useState(false);

  const deleteProgram = async () => {
    if (!activeProgram) return;
    setDeleting(true);
    try {
      await base44.entities.Program.update(activeProgram.id, { status: 'completed' });
      // Supprime toutes les séances NON complétées en relisant la base à chaque tour
      // (le cache local peut être périmé après un import → la suppression échouait).
      // Les séances complétées sont conservées dans l'historique.
      let toDelete;
      do {
        const batch = await base44.entities.Session.filter({ program_id: activeProgram.id });
        toDelete = batch.filter(s => s.status !== 'completed');
        await Promise.all(toDelete.map(s => base44.entities.Session.delete(s.id)));
      } while (toDelete.length > 0);
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program-sessions'] });
    } catch (e) {
      console.error(e);
      alert(`Erreur lors de la suppression : ${e?.message || e}`);
    } finally {
      setDeleting(false);
    }
  };

  const detectStructureType = (prog) => {
    const ws = (prog?.weekly_structure || '').toLowerCase();
    if (['full_body', 'upper_lower', 'ppl', 'arnold_split', 'custom'].includes(ws)) return ws;
    return 'unknown';
  };

  const saveProgram = async () => {
    if (!activeProgram) return;
    setSaving(true);
    try {
      const structureType = detectStructureType(activeProgram);
      // Dédoublonner : une séance complétée + sa jumelle replanifiée (même semaine,
      // même libellé, même jour) ne doivent produire qu'UN template (planifiée prioritaire).
      const tplSlots = new Map();
      for (const s of sessions) {
        const dow = s.planned_date ? new Date(s.planned_date + 'T12:00:00').getDay() : '';
        const key = `${s.week_number || 1}::${(s.day_label || '').trim().toLowerCase()}::${dow}`;
        const cur = tplSlots.get(key);
        if (!cur || (s.status === 'planned' && cur.status !== 'planned')) tplSlots.set(key, s);
      }
      const sessionTemplates = Array.from(tplSlots.values()).map(s => ({
        day: s.planned_date ? new Date(s.planned_date).toLocaleDateString('en', { weekday: 'long' }).toLowerCase() : '',
        day_label: s.day_label,
        week_number: s.week_number,
        type: s.type,
        estimated_duration: s.estimated_duration,
        active_zones: s.active_zones,
        exercises: s.exercises,
      }));

      const structureLabel = { full_body: 'Full Body', upper_lower: 'Upper/Lower', ppl: 'PPL', arnold_split: 'Arnold Split', custom: 'Personnalisé', unknown: '' };
      const label = structureLabel[structureType] || '';
      const distinctWeeks = new Set(sessions.map(s => s.week_number).filter(Boolean)).size;
      const actualWeeks = distinctWeeks || activeProgram.planned_weeks || 1; // toujours un nombre (colonne numérique)
      const name = `${label ? label + ' — ' : ''}${actualWeeks} sem.`.trim();

      await base44.entities.SavedProgram.create({
        user_id: user.id,
        name,
        structure_type: structureType,
        weekly_structure: activeProgram.weekly_structure,
        planned_weeks: actualWeeks,
        active_phase: activeProgram.active_phase,
        multi_objective_mode: activeProgram.multi_objective_mode,
        objective_ids: activeProgram.objective_ids,
        program_data: activeProgram.program_data,
        sessions_templates: sessionTemplates,
      });

      localStorage.setItem(`saved_program_${activeProgram.id}`, 'true');
      queryClient.invalidateQueries({ queryKey: ['saved-programs'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('[saveProgram] erreur :', e);
      alert(`Erreur lors de la sauvegarde : ${e?.message || e}`);
      throw e; // propage pour que le flux appelant ne continue pas comme si tout allait bien
    } finally {
      setSaving(false);
    }
  };

  // Relance le programme actuel à l'identique, en repartant de cette semaine
  const relaunchSameProgram = async () => {
    if (!activeProgram || relaunching) return;
    setRelaunching(true);
    try {
      const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      // Cycle = une semaine PLANIFIÉE complète (les complétées sont de l'historique :
      // les mélanger dupliquerait les créneaux). La semaine 1 pouvant être partielle
      // (séances déjà faites non recréées), on prend la semaine la plus fournie.
      const plannedOnly = sessions.filter(s => s.status === 'planned');
      const src = plannedOnly.length ? plannedOnly : sessions;
      const byWeek = {};
      src.forEach(s => { const w = s.week_number || 1; (byWeek[w] ||= []).push(s); });
      const bestWeek = Object.entries(byWeek).sort((a, b) => b[1].length - a[1].length || a[0] - b[0])[0];
      const cycle = (bestWeek ? bestWeek[1] : [])
        .sort((a, b) => (a.planned_date || '').localeCompare(b.planned_date || ''))
        .map(s => ({
          label: s.day_label || '',
          day: s.planned_date ? dayNames[new Date(s.planned_date + 'T12:00:00').getDay()] : 'monday',
          exercises: s.exercises || [],
          type: s.type || 'mixed',
          estimated_duration: s.estimated_duration || calcDuration(s.exercises || []),
        }));
      const wk = (activeProgram.planned_weeks || 1) >= 52 ? 'infinite' : (activeProgram.planned_weeks || 4);
      await saveEditedSessions(cycle, wk);
    } catch (e) {
      console.error('[relaunch même programme]', e);
      alert(`Erreur lors de la relance : ${e?.message || e}`);
    } finally {
      setRelaunching(false);
    }
  };

  // Group sessions by week
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPast = (session) => {
    if (!session.planned_date) return false;
    const d = new Date(session.planned_date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const dayOrder = { monday: 0, lundi: 0, tuesday: 1, mardi: 1, wednesday: 2, mercredi: 2, thursday: 3, jeudi: 3, friday: 4, vendredi: 4, saturday: 5, samedi: 5, sunday: 6, dimanche: 6 };

  // Semaine calendaire courante (lundi)
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  thisMonday.setHours(0, 0, 0, 0);

  const programIsInfinite = (activeProgram?.planned_weeks || 1) >= 52;

  // Programme terminé : toutes les séances sont passées (programmes finis uniquement)
  const subscriptionPlan = user?.subscription_plan
    || (() => { try { return localStorage.getItem('cached_subscription_plan'); } catch { return null; } })()
    || 'starter';
  const canGenerate = subscriptionPlan !== 'starter'; // "Générer" réservé aux plans > Starter
  const programFinished = !!activeProgram && !programIsInfinite && sessions.length > 0 && sessions.every(isPast);

  // Signature du contenu d'un programme (séances distinctes : jour + exercices) → pour
  // détecter qu'un programme identique est déjà enregistré en Bibliothèque.
  const programSignature = (sessList) => {
    const set = new Set((sessList || []).map(s => {
      const exs = (s.exercises || [])
        .map(e => `${(e.name || '').trim().toLowerCase()}|${e.sets}|${e.target_reps}|${e.rest_seconds}`)
        .sort().join(';');
      return `${(s.day_label || s.day || '').trim().toLowerCase()}::${exs}`;
    }));
    return [...set].sort().join('||');
  };
  const currentSignature = programSignature(sessions);
  const alreadySavedIdentical = !!currentSignature
    && savedPrograms.some(sp => programSignature(sp.sessions_templates) === currentSignature);

  const weeks = {};
  sessions.forEach(s => {
    const sessionDate = s.planned_date ? new Date(s.planned_date + 'T00:00:00') : null;
    // Infini : on groupe par semaine calendaire (depuis le lundi courant).
    // Fini : on groupe par numéro de semaine du programme (S1, S2…), sinon une séance
    // placée la semaine calendaire suivante tomberait dans le mauvais onglet.
    if (programIsInfinite && sessionDate) {
      const calWeek = Math.floor((sessionDate - thisMonday) / (7 * 86400000)) + 1; // 1 = semaine courante
      const w = calWeek > 0 ? calWeek : 'prev';
      if (!weeks[w]) weeks[w] = [];
      weeks[w].push(s);
    } else {
      const w = s.week_number || 1;
      if (!weeks[w]) weeks[w] = [];
      weeks[w].push(s);
    }
  });

  // Sort each week's sessions by day order
  Object.values(weeks).forEach(wSessions => {
    wSessions.sort((a, b) => {
      const dayA = (a.day_label || '').toLowerCase();
      const dayB = (b.day_label || '').toLowerCase();
      const dateA = a.planned_date ? new Date(a.planned_date).getTime() : Infinity;
      const dateB = b.planned_date ? new Date(b.planned_date).getTime() : Infinity;
      // If dates differ, sort by date; otherwise sort by day_label
      if (dateA !== dateB) return dateA - dateB;
      return (dayOrder[dayA] ?? 99) - (dayOrder[dayB] ?? 99);
    });
  });

  // Onglet courant :
  //  • infini → TOUJOURS la semaine calendaire en cours (celle qui contient aujourd'hui,
  //    calWeek === 1), même si ses premières séances sont déjà passées.
  //  • fini → la semaine qui contient la prochaine séance à venir.
  const nextUpcoming = sessions.find(s => s.status !== 'completed' && !isPast(s));
  const weekKeys = Object.keys(weeks);
  const upcomingKey = nextUpcoming && weekKeys.find(w => weeks[w].includes(nextUpcoming));
  const currentWeekTab = (programIsInfinite && weeks['1'])
    ? '1'
    : (upcomingKey || weekKeys[0] || '1');

  const handleRegen = () => {
    localStorage.removeItem('pending_program_regen');
    setStaleBanner(false);
    autoGenerated.current = false;
    window.location.href = '/program?autoGenerate=true';
  };

  return (
    <>
    <div className="space-y-6">
      {staleBanner && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-400/10 border border-orange-400/25 text-xs text-orange-300">
          <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1">Programme obsolète — des paramètres de profil ont changé depuis la dernière génération.</span>
          <button onClick={handleRegen} className="font-semibold underline underline-offset-2 hover:text-orange-200 transition-colors whitespace-nowrap">Régénérer</button>
          <span className="text-orange-400/40">·</span>
          <button onClick={() => { setStaleBanner(false); localStorage.removeItem('pending_program_regen'); }} className="text-orange-300/50 hover:text-orange-300 transition-colors whitespace-nowrap">Ignorer</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white leading-none">Programme</h1>
            {activeProgram && (
              isImported({ program_id: activeProgram.id }) ? (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>Importé</span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', letterSpacing: '0.06em' }}>Coach</span>
              )
            )}
          </div>
          {activeProgram && (() => {
            const nextSession = sessions.find(s => s.status !== 'completed' && s.planned_date && new Date(s.planned_date) >= today);
            const isInfinite = (activeProgram.planned_weeks || 1) >= 52;
            const daysUntil = nextSession?.planned_date
              ? Math.round((new Date(nextSession.planned_date) - today) / 86400000)
              : null;
            let progressLabel, sessionLabel;
            if (isInfinite) {
              const dayOfMonth = today.getDate();
              const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
              const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
              const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
              const completedThisMonth = sessions.filter(s => s.status === 'completed' && s.planned_date && new Date(s.planned_date) >= monthStart && new Date(s.planned_date) < monthEnd).length;
              const plannedThisMonth = sessions.filter(s => s.planned_date && new Date(s.planned_date) >= monthStart && new Date(s.planned_date) < monthEnd).length;
              progressLabel = `${dayOfMonth}/${daysInMonth}`;
              sessionLabel = plannedThisMonth > 0 ? `${completedThisMonth}/${plannedThisMonth} séances` : null;
            } else {
              const completedCount = sessions.filter(s => s.status === 'completed').length;
              const totalCount = sessions.length;
              const currentWeekNum = nextSession?.week_number || 1;
              const totalWeeks = activeProgram.planned_weeks || 1;
              progressLabel = `Semaine ${currentWeekNum}/${totalWeeks}`;
              sessionLabel = totalCount > 0 ? `${completedCount}/${totalCount} séances` : null;
            }
            return (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-white/60 text-sm">{progressLabel}</span>
                {daysUntil !== null && (
                  <span className="text-white/60 text-sm">·</span>
                )}
                {daysUntil === 0 && <span className="text-violet-300 text-sm font-medium">Séance aujourd'hui</span>}
                {daysUntil === 1 && <span className="text-white/60 text-sm">Prochaine séance demain</span>}
                {daysUntil > 1 && <span className="text-white/60 text-sm">Prochaine séance dans {daysUntil}j</span>}
                {sessionLabel && (
                  <><span className="text-white/60 text-sm">·</span>
                  <span className="text-white/60 text-sm">{sessionLabel}</span></>
                )}
              </div>
            );
          })()}
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-2">
          {activeProgram && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-red-300 hover:text-red-200 hover:bg-red-500/20 border-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-violet-950 border border-white/20 rounded-2xl w-[calc(100%-2rem)] max-w-sm left-1/2 -translate-x-1/2 mx-0">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white text-lg font-bold">Supprimer le programme ?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/60 text-sm">
                      Toutes les séances planifiées seront supprimées. Les séances déjà complétées restent dans l'historique.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 mt-2">
                    <AlertDialogCancel className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl">
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={deleteProgram} className="flex-1 bg-red-500/80 hover:bg-red-500 text-white border-0 rounded-xl">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <button
                onClick={alreadySaved ? undefined : saveProgram}
                disabled={saving || saved || alreadySaved}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold text-xs bg-white text-violet-700 hover:bg-white/90 shadow transition-all disabled:opacity-50"
              >
                {alreadySaved
                  ? <BookmarkCheck className="w-3.5 h-3.5" />
                  : saved
                  ? <BookmarkCheck className="w-3.5 h-3.5" />
                  : saving
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Bookmark className="w-3.5 h-3.5" />
                }
              </button>
            </>
          )}
          {activeProgram && (
            <button
              onClick={() => setShowRegenGate(true)}
              disabled={generating}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold text-xs bg-white text-violet-700 hover:bg-white/90 shadow transition-all disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Générer
            </button>
          )}
          {(!activeProgram || isImported({ program_id: activeProgram.id })) && (
            <button
              onClick={openEditDialog}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold text-xs bg-white text-violet-700 hover:bg-white/90 shadow transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Modifier
            </button>
          )}
          {activeProgram && sessions.length > 0 && (
            <button
              onClick={() => {
                // Un cycle = les séances de la première semaine du programme
                const minWeek = Math.min(...sessions.map(s => s.week_number || 1));
                const cycle = sessions
                  .filter(s => (s.week_number || 1) === minWeek)
                  .sort((a, b) => (a.planned_date || '').localeCompare(b.planned_date || ''));
                exportProgramPDF({
                  programName: isImported({ program_id: activeProgram.id }) ? 'Mon programme (importé)' : 'Mon programme',
                  subtitle: programIsInfinite ? 'Cycle hebdomadaire (programme en boucle)' : `Programme sur ${activeProgram.planned_weeks} semaines`,
                  sessions: cycle,
                });
              }}
              className="flex items-center justify-center px-2.5 py-1.5 rounded-xl font-semibold text-xs bg-white text-violet-700 hover:bg-white/90 shadow transition-all"
              title="Exporter le programme en PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {(!user || programsLoading || (activeProgram && sessionsLoading)) && !generating && (
        <div className="space-y-3">
          <div className="h-6 w-48 rounded-lg bg-white/10 animate-pulse" />
          {[1,2,3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-white/10 animate-pulse" />
          ))}
        </div>
      )}

      {activeProgram && !sessionsLoading && Object.keys(weeks).length > 0 && (() => {
        const isInfinite = programIsInfinite;
        // Beaucoup de semaines → onglets compacts et défilables (sinon ils s'écrasent)
        const manyWeeks = !isInfinite && Object.keys(weeks).length > 6;
        return (<Tabs defaultValue={currentWeekTab}>
          <div className="relative">
          <TabsList ref={weekTabsRef}
            onScroll={(e) => { const el = e.currentTarget; setTabsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4); setTabsAtStart(el.scrollLeft <= 4); }}
            className={`bg-white/10 text-white w-full overflow-x-auto flex justify-start gap-1 [&::-webkit-scrollbar]:hidden ${manyWeeks ? 'pr-3' : ''}`} style={{ scrollbarWidth: 'none' }}>
            {isInfinite ? (
              <TabsTrigger value={currentWeekTab} className="flex-1 text-sm">∞</TabsTrigger>
            ) : (
              Object.keys(weeks).map(w => (
                <TabsTrigger key={w} value={w}
                  className={manyWeeks ? 'flex-shrink-0 min-w-[2.75rem] text-xs' : 'flex-1 text-xs sm:text-sm'}>
                  {manyWeeks
                    ? <span>S{w}</span>
                    : <><span className="sm:hidden">S{w}</span><span className="hidden sm:inline">Semaine {w}</span></>}
                </TabsTrigger>
              ))
            )}
          </TabsList>
          {/* Dégradé bord gauche cliquable → recule d'un onglet (masqué au tout début) */}
          {manyWeeks && !tabsAtStart && (
            <button type="button"
              onClick={() => {
                const el = weekTabsRef.current;
                if (!el) return;
                const step = ((el.firstChild?.offsetWidth) || 48) + 4;
                el.scrollBy({ left: -step, behavior: 'smooth' });
              }}
              className="absolute left-0 top-0 bottom-0 w-12 rounded-l-md flex items-center justify-start pl-1"
              style={{ background: 'linear-gradient(to left, transparent, #7c3aed 70%)' }}>
              <ChevronLeft className="w-4 h-4 text-white/80" />
            </button>
          )}
          {/* Dégradé bord droit cliquable → décale d'un onglet (masqué une fois la fin atteinte) */}
          {manyWeeks && !tabsAtEnd && (
            <button type="button"
              onClick={() => {
                const el = weekTabsRef.current;
                if (!el) return;
                const step = ((el.firstChild?.offsetWidth) || 48) + 4;
                el.scrollBy({ left: step, behavior: 'smooth' });
              }}
              className="absolute right-0 top-0 bottom-0 w-12 rounded-r-md flex items-center justify-end pr-1"
              style={{ background: 'linear-gradient(to right, transparent, #7c3aed 70%)' }}>
              <ChevronRight className="w-4 h-4 text-white/80" />
            </button>
          )}
          </div>

          {Object.entries(weeks).map(([w, weekSessions]) => (
            <TabsContent key={w} value={w}>
              <div className="grid gap-3">
                 {weekSessions.map((session, i) => {
                   const isPastDay = isPast(session);
                   const past = isPastDay && session.status !== 'completed';
                   const sessionDate = session.planned_date ? new Date(session.planned_date) : null;
                   if (sessionDate) sessionDate.setHours(0, 0, 0, 0);
                   const isToday = sessionDate && sessionDate.getTime() === today.getTime();

                   const card = (
                     <Card className={`p-4 transition-colors backdrop-blur-sm ${
                       isToday
                         ? 'bg-white/30 border-2 border-white shadow-lg shadow-white/20 cursor-pointer hover:bg-white/35'
                         : past
                         ? 'bg-white/15 border-white/20 opacity-50 cursor-pointer hover:opacity-70'
                         : isPastDay
                         ? 'bg-white/15 border-white/20 opacity-50 cursor-pointer hover:opacity-70'
                         : 'bg-white/15 border-white/20 hover:bg-white/20 cursor-pointer'
                     }`}>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="flex flex-col items-center gap-1">
                             <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${isToday ? 'bg-violet-600 border-2 border-white' : 'bg-white/20'}`}>
                               <span className={`text-[10px] capitalize ${isToday ? 'text-white/80' : 'text-white/70'}`}>
                                 {session.planned_date && format(new Date(session.planned_date), 'EEE', { locale: fr })}
                               </span>
                               <span className="text-sm font-bold text-white">
                                 {session.planned_date && format(new Date(session.planned_date), 'd')}
                               </span>
                               <span className={`text-[9px] capitalize ${isToday ? 'text-white/70' : 'text-white/50'}`}>
                                 {session.planned_date && format(new Date(session.planned_date), 'MMM', { locale: fr })}
                               </span>
                             </div>
                           </div>
                           <div>
                             <div className="flex items-center gap-2 flex-wrap">
                               {(() => {
                                 const raw = session.day_label || '';
                                 const orderMatch = raw.match(/§(\d)/);
                                 const label = raw.replace(/§\d/, '').replace(/^(week|semaine)\s*\d+\s*[-–:·]?\s*/i, '').replace(/\bmonday\b/gi, 'Lundi').replace(/\btuesday\b/gi, 'Mardi').replace(/\bwednesday\b/gi, 'Mercredi').replace(/\bthursday\b/gi, 'Jeudi').replace(/\bfriday\b/gi, 'Vendredi').replace(/\bsaturday\b/gi, 'Samedi').replace(/\bsunday\b/gi, 'Dimanche').trim();
                                 return <>
                                   <span className="font-semibold text-white">{label}</span>
                                   {orderMatch && <span className="text-base">{orderMatch[1] === '1' ? '①' : '②'}</span>}
                                 </>;
                               })()}
                               {/* Pas de badge de type (Mixte…) sur les séances importées */}
                               {!isImported(session) && (
                                 <Badge className={`bg-white/20 text-white border-white/20`}>
                                   {TYPE_LABELS[session.type] || session.type}
                                 </Badge>
                               )}
                               {past && <Badge variant="outline" className="text-xs text-white/50 border-white/20">Passée</Badge>}
                               {session.status === 'completed' && <Badge variant="default" className="text-xs">✓ Fait</Badge>}
                             </div>
                             <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                               <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.estimated_duration} min</span>
                               <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{session.exercises?.length || 0} exercices</span>
                             </div>
                           </div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-white/60" />
                       </div>
                     </Card>
                   );

                   return (
                     <motion.div
                       key={session.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                     >
                       <Link to={`/session?id=${session.id}`}>{card}</Link>
                     </motion.div>
                   );
                 })}
              </div>
            </TabsContent>
          ))}
        </Tabs>);
      })()}

      {!activeProgram && !generating && (
        <Card className="p-12 text-center bg-white/15 backdrop-blur-sm border-white/20">
          <Dumbbell className="w-12 h-12 mx-auto text-white/60 mb-4" />
          <h3 className="font-heading font-bold text-xl mb-2 text-white">Pas encore de programme</h3>
          <p className="text-white/70 mb-6">L'IA va créer un programme personnalisé basé sur ton profil</p>
          <Button onClick={() => setShowDialog(true)} disabled={generating} size="lg">
            <Sparkles className="w-5 h-5 mr-2" />
            Générer mon programme
          </Button>
        </Card>
      )}
      {/* Gate régénération — si programme existant */}
      <AlertDialog open={showRegenGate} onOpenChange={setShowRegenGate}>
        <AlertDialogContent className="bg-violet-800 border-violet-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Tu as déjà un programme actif</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Pour générer, tu dois d'abord choisir ce que tu fais avec le programme actuel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <button
              onClick={async () => { try { await saveProgram(); setShowRegenGate(false); setShowDialog(true); } catch {} }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-left"
            >
              <Bookmark className="w-5 h-5 text-violet-300 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-white">Sauvegarder puis générer</p>
                <p className="text-xs text-white/60 mt-0.5">Le programme sera conservé dans Bibliothèque avant de générer</p>
              </div>
            </button>
            <button
              onClick={async () => { setShowRegenGate(false); await deleteProgram(); setShowDialog(true); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-white">Supprimer et générer</p>
                <p className="text-xs text-red-300 mt-0.5">Le programme actuel sera définitivement supprimé</p>
              </div>
            </button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl">Annuler</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <GenerateProgramDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onGenerate={generateProgram}
      />

      {/* Programme terminé : modale par-dessus (uniquement sur la page Programme) */}
      {onProgramPage && programFinished && !sessionsLoading && !showRegenGate && !showDialog && !generating && !deleting && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl p-5 space-y-4" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div>
              <p className="text-white font-bold text-lg">🎉 Programme terminé !</p>
              <p className="text-white/60 text-sm mt-1">Toutes tes séances sont passées. Que veux-tu faire ?</p>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* "Enregistrer" masqué si un programme identique est déjà en Bibliothèque */}
                {!alreadySavedIdentical && (
                  <button onClick={alreadySaved ? undefined : saveProgram} disabled={saving || saved || alreadySaved}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold bg-white text-violet-700 hover:bg-white/90 disabled:opacity-60">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (alreadySaved || saved) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    {(alreadySaved || saved) ? 'Enregistré' : 'Enregistrer'}
                  </button>
                )}
                <button onClick={relaunchSameProgram} disabled={relaunching}
                  className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold bg-white/15 border border-white/25 text-white hover:bg-white/25 disabled:opacity-60 ${alreadySavedIdentical ? 'col-span-2' : ''}`}>
                  {relaunching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Relancer le même
                </button>
              </div>
              {canGenerate ? (
                <button onClick={async () => { await deleteProgram(); setShowDialog(true); }} disabled={generating}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                  <Sparkles className="w-4 h-4" /> Générer un nouveau
                </button>
              ) : (
                <Link to="/pricing"
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 text-white/70 hover:bg-white/15">
                  <Sparkles className="w-4 h-4" /> Générer un nouveau (Coach+)
                </Link>
              )}
            </div>
            <button onClick={() => navigate('/')}
              className="w-full pt-1 text-xs text-white/50 hover:text-white/80 transition-colors">
              Retour à l'accueil
            </button>
          </div>
        </div>,
        document.body
      )}

      {deleting && createPortal(
        <div className="fixed inset-0 bg-violet-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-[200] gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}>
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-white font-semibold text-sm">Suppression en cours…</p>
            <p className="text-white/50 text-xs">Les séances planifiées sont effacées</p>
          </div>
        </div>,
        document.body
      )}

      {generating && createPortal(
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[200] gap-4" style={{ background: 'linear-gradient(160deg, #2e1065 0%, #1e0050 100%)' }}>
          <LoadingOrb />
          <div className="text-center space-y-1">
            <p className="text-white font-semibold text-sm">{genPhase}</p>
            <p className="text-white/50 text-xs tabular-nums">
              {(() => {
                if (genSeconds < 15)  return 'environ 1 min 30';
                if (genSeconds < 30)  return 'environ 1 min';
                if (genSeconds < 50)  return 'environ 45s';
                if (genSeconds < 65)  return 'environ 30s';
                if (genSeconds < 80)  return 'environ 15s';
                return 'finalisation…';
              })()}
            </p>
          </div>
        </div>,
        document.body
      )}

      {genError && !generating && createPortal(
        <div className="fixed inset-0 bg-violet-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-[200] gap-4 px-6">
          <div className="text-center space-y-3">
            <p className="text-white font-bold text-lg">
              {genError === 'network' ? 'Connexion perdue' : 'Erreur de génération'}
            </p>
            <p className="text-white/60 text-sm">
              {genError === 'network'
                ? 'La génération a été interrompue par un problème réseau. Réessaie — la connexion est souvent rétablie.'
                : genError}
            </p>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setGenError(null)} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/10">
                Annuler
              </button>
              <button onClick={() => { setGenError(null); generateProgram(genParamsRef.current); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                Réessayer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>

    {pendingImportSessions && createPortal(
      <ImportSessionDialog
        sessions={pendingImportSessions.sessions}
        isEditing={true}
        initialWeeks={pendingImportSessions.initialWeeks}
        onClose={() => setPendingImportSessions(null)}
        onPersist={(editedSessions, weeks) => persistImport(editedSessions, weeks)}
      />,
      document.body
    )}
    </>
  );
}