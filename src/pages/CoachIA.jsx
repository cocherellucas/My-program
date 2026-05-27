import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Bot, User, Sparkles, Paperclip, FileText, Copy, Pencil, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { buildSystemPrompt } from '@/lib/coach-prompts';
import { getContextualKnowledge, getMessageKnowledge } from '@/lib/scientific-knowledge-base';
import { getAvailableExercises, getTensionProfile } from '@/lib/exercise-database';
import { normalizeUser } from '@/lib/utils';
import { calcDuration } from '@/lib/duration';
import ImportSessionDialog from '@/components/coach/ImportSessionDialog';

export default function CoachIA() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [importing, setImporting] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [pendingImportJson, setPendingImportJson] = useState(null);
  const [pendingImportSessions, setPendingImportSessions] = useState(null);
  const [pendingConflict, setPendingConflict] = useState(null);
  const [hasActiveProgram, setHasActiveProgram] = useState(false);
  const [activeImportedProgram, setActiveImportedProgram] = useState(null);
  const [showImportBlocked, setShowImportBlocked] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      const normalized = normalizeUser(u);
      setUser(normalized);
      base44.entities.Program.filter({ status: 'active' }, '-created_date', 1).then(progs => {
        setHasActiveProgram(progs.length > 0);
        const p = progs[0] || null;
        const importedIds = JSON.parse(localStorage.getItem('imported_program_ids') || '[]');
        if (p && (importedIds.includes(p.id) || p.weekly_structure === 'custom')) setActiveImportedProgram(p);
      }).catch(() => {});
      if (u?.id) {
        try {
          const saved = localStorage.getItem(`coach_history_${u.id}`);
          const history = saved ? JSON.parse(saved) : [];
          const pending = location.state?.initialMessage;
          if (pending) {
            const last = history[history.length - 1];
            if (!last || last.content !== pending) {
              history.push({ role: 'assistant', content: pending, ts: Date.now() });
            }
            // Clear state so a back-navigation doesn't re-inject
            navigate('/coach', { replace: true, state: {} });
          }
          if (history.length > 0) setMessages(history);
        } catch {}
      }
      // Restaure le dialog d'import si l'utilisateur avait changé d'onglet
      const savedPending = localStorage.getItem('_import_pending');
      if (savedPending) {
        try { setPendingImportSessions(JSON.parse(savedPending)); } catch {}
      }
    });
  }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Persiste le dialog d'import ouvert (survit au changement d'onglet / mise en veille)
  useEffect(() => {
    if (pendingImportSessions) {
      try { localStorage.setItem('_import_pending', JSON.stringify(pendingImportSessions)); } catch {}
    } else {
      try { localStorage.removeItem('_import_pending'); localStorage.removeItem('_import_form'); localStorage.removeItem('_import_scroll'); } catch {}
    }
  }, [pendingImportSessions]);

  // Sauvegarder l'historique à chaque changement
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      try {
        // Garder les 100 derniers messages max
        const toSave = messages.slice(-100);
        localStorage.setItem(`coach_history_${user.id}`, JSON.stringify(toSave));
      } catch {}
    }
  }, [messages, user?.id]);

  // Empêche le scroll du body pendant que CoachIA est affiché
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Cache la nav et bloque tout scroll pendant l'import
  useEffect(() => {
    const nav = document.querySelector('.mobile-nav');
    if (importing) {
      if (nav) nav.style.display = 'none';
      document.body.style.overflow = 'hidden';
    } else {
      if (nav) nav.style.display = '';
    }
  }, [importing]);

  const inputRef = useRef(null);
  const inputAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Aligne le container sur le visual viewport (gère le scroll iOS quand textarea focus)
  // Hauteur réelle de la MobileNav (inclut safe-area-inset-bottom automatiquement)
  const [navHeight, setNavHeight] = useState(80);
  useEffect(() => {
    const nav = document.querySelector('.mobile-nav');
    if (nav) setNavHeight(nav.offsetHeight);
  }, []);

  // iOS scrolle vv.offsetTop > 0 quand il focus un input, ce qui décale le container fixe
  const [kbOpen, setKbOpen] = useState(false);
  const [containerH, setContainerH] = useState(() => window.innerHeight);
  const [containerTop, setContainerTop] = useState(0);
  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const isOpen = vv.height < window.innerHeight * 0.75;
      setKbOpen(isOpen);
      setContainerH(vv.height);
      setContainerTop(vv.offsetTop || 0);
      if (isOpen) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'instant' }), 50);
    };
    update();
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    return () => {
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);

  // Bloque tout scroll tactile sauf dans la zone messages
  const messagesRef = useRef(null);
  useEffect(() => {
    const block = (e) => {
      if (messagesRef.current?.contains(e.target)) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', block, { passive: false });
    return () => document.removeEventListener('touchmove', block);
  }, []);

  const containerRef = useRef(null);
  const [shownTs, setShownTs] = useState(null);
  const fmtTime = (ts) => {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const d = new Date(ts);
    const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (diff > 48 * 60 * 60 * 1000) {
      const date = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      return `${date} · ${time}`;
    }
    return time;
  };

  // Masque la MobileNav dès le focus (fiable sur tous les modes iOS)
  const [focused, setFocused] = useState(false);
  const handleInputFocus = () => {
    setFocused(true);
    const nav = document.querySelector('.mobile-nav');
    if (nav) nav.style.display = 'none';
  };
  const handleInputBlur = () => {
    setFocused(false);
    // Petit délai pour éviter le flash avant que le clavier se ferme
    setTimeout(() => {
      const nav = document.querySelector('.mobile-nav');
      if (nav) nav.style.display = '';
    }, 150);
  };

  // Redimensionne et compresse une image avant envoi
  const compressImage = (dataUrl) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1024;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = dataUrl;
  });

  // Lit le contenu d'un fichier — retourne { text, imageBase64 }
  const readFileContent = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    if (file.type.startsWith('image/')) {
      reader.onload = async (e) => {
        const compressed = await compressImage(e.target.result);
        resolve({ text: `[Image jointe : ${file.name}]`, imageBase64: compressed });
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => resolve({ text: `[Fichier : ${file.name}]\n${e.target.result}`, imageBase64: null });
      reader.readAsText(file);
    }
  });

  const openEditDialog = async () => {
    try { localStorage.removeItem('_import_form'); localStorage.removeItem('_import_scroll'); } catch {}
    if (!activeImportedProgram) { setPendingImportSessions({ json: '{}', sessions: [], isEditing: true }); return; }
    try {
      const existing = await base44.entities.Session.filter({ program_id: activeImportedProgram.id, status: 'planned', week_number: 1 });
      const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const formatted = existing
        .sort((a, b) => new Date(a.planned_date) - new Date(b.planned_date))
        .map(s => ({
          label: s.day_label || '',
          day: s.planned_date ? dayNames[new Date(s.planned_date + 'T12:00:00').getDay()] : 'monday',
          exercises: s.exercises || [],
          content: (s.exercises || []).map(e => `${e.sets || 3}×${e.target_reps || 10} ${e.name}${e.target_weight ? ` (${e.target_weight}kg)` : ''} ${e.rest_seconds || 90}s`).join('\n'),
          type: s.type || 'mixed',
          estimated_duration: s.estimated_duration || calcDuration(s.exercises || []),
        }));
      const sessionsJson = JSON.stringify({ sessions: formatted.map(s => ({ ...s, week_number: 1 })) });
      const pw = activeImportedProgram.planned_weeks;
      const initialWeeks = pw && pw >= 52 ? 'infinite' : (pw || 4);
      setPendingImportSessions({ json: sessionsJson, sessions: formatted, isEditing: true, initialWeeks });
    } catch {
      setPendingImportSessions({ json: '{}', sessions: [], isEditing: true });
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !attachedFile) || loading) return;
    let userMsg = input.trim();

    // Lire le contenu du fichier si joint
    let imageBase64 = null;
    if (attachedFile) {
      const { text, imageBase64: b64 } = await readFileContent(attachedFile);
      userMsg = userMsg ? `${userMsg}\n\n${text}` : text;
      imageBase64 = b64;
      setAttachedFile(null);
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, ts: Date.now() }]);
    setLoading(true);

    const [objectives, programs, memory, recentSessions, seriesLogs] = await Promise.all([
      base44.entities.Objective.filter({ status: 'active' }),
      base44.entities.Program.filter({ status: 'active' }, '-created_date', 1),
      base44.entities.UserMemory.filter({ user_id: user.id }),
      base44.entities.Session.filter({ user_id: user.id, status: 'completed' }, '-actual_date', 10),
      base44.entities.SeriesLog.filter({ user_id: user.id }, '-created_date', 20),
    ]);

    const baseScience    = getContextualKnowledge(user, objectives);
    const messageScience = getMessageKnowledge(userMsg, { user, objectives });
    const scienceContext = [baseScience, messageScience].filter(Boolean).join('\n');

    // Exercices disponibles pour cet utilisateur (filtrés par équipement + niveau)
    const availableExercises = getAvailableExercises(
      user.equipment || [],
      objectives.map(o => o.type),
      user.level || 'beginner'
    );
    const exerciseListStr = availableExercises
      .map(e => `${e.name} [${getTensionProfile(e.id)}]`)
      .join(', ');

    const systemContext  = buildSystemPrompt(user, objectives, programs, memory, recentSessions, seriesLogs, scienceContext, '', exerciseListStr);
    const history = messages.map(m => `${m.role === 'user' ? 'Utilisateur' : 'Coach'}: ${m.content}`).join('\n');

    // Instruction spéciale pour l'import de programme
    const importInstruction = `\n\nINSTRUCTION IMPORT : Cette instruction concerne UNIQUEMENT le cas où l'utilisateur veut importer un programme externe (d'un autre coach, d'une feuille Excel, d'un PDF, etc.) dans l'app. Dans CE CAS UNIQUEMENT, dis-lui de cliquer sur **"+ Importer"** en haut à droite. NE PAS confondre avec "génère-moi un programme" ou "crée un programme" ou "carte blanche" : dans ce cas, génère directement le programme (PROMPT 3). Ne génère jamais de bloc IMPORT_READY dans le chat.`;

    const llmParams = {
      prompt: `${systemContext}${importInstruction}\n\n${history}\n\nUtilisateur: ${userMsg}`,
      model: 'claude_sonnet_4_6',
    };
    if (imageBase64) llmParams.add_context_from_images = [imageBase64];

    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 30000));
    const result = await Promise.race([
      base44.integrations.Core.InvokeLLM(llmParams),
      timeout
    ]).catch(() => {
      if (imageBase64) return "Je n'arrive pas à analyser l'image directement. Peux-tu me décrire ou copier-coller le contenu de ton programme en texte ? Je pourrai alors l'importer correctement.";
      return "Une erreur est survenue. Réessaie.";
    });

    setMessages(prev => [...prev, { role: 'assistant', content: result, ts: Date.now() }]);
    setLoading(false);

    // Détection silencieuse de douleur — sauvegarde en mémoire coach
    const hasPain = /douleur|mal\b|gêne|pincement|blessure|douloureux|tendinite|inflammation|coude|épaule|genou|dos|poignet|cervical|hanche|cheville/i.test(userMsg);
    if (hasPain && user?.id) {
      const today = new Date().toISOString().split('T')[0];
      const note = `[${today} — CoachIA] "${userMsg}"`;
      try {
        const existing = await base44.entities.UserMemory.filter({ user_id: user.id });
        if (existing.length > 0) {
          const prev = existing[0].coach_notes || '';
          const alreadySaved = prev.includes(userMsg.slice(0, 40));
          if (!alreadySaved) {
            await base44.entities.UserMemory.update(existing[0].id, {
              coach_notes: prev ? `${prev}\n${note}` : note
            });
          }
        } else {
          await base44.entities.UserMemory.create({ user_id: user.id, coach_notes: note });
        }
      } catch {}
    }
  };

  // Importe le programme détecté dans la DB
  const importProgramFromCoach = async (jsonStr, targetWeeks, skipConflict = false, orderSuffix = null, replaceExisting = false) => {
    setPendingImportJson(null);
    setPendingConflict(null);
    setImporting(true);
    try {
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('JSON introuvable');
      const data = JSON.parse(jsonMatch[0]);
      const sessions = data.sessions || [];
      if (!sessions.length) throw new Error('Aucune séance dans le programme');

      const activePrograms = await base44.entities.Program.filter({ user_id: user.id, status: 'active' });
      const existingProgram = activePrograms[0] || null;

      const importedProgramIds = JSON.parse(localStorage.getItem('imported_program_ids') || '[]');
      const isImportedProgram = (p) => p && (importedProgramIds.includes(p.id) || p.weekly_structure === 'custom');

      // Bloquer uniquement si programme généré (pas custom)
      if (existingProgram && !isImportedProgram(existingProgram)) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ Tu as déjà un programme généré actif. Pour importer depuis le Coach, supprime-le d'abord depuis l'onglet **Programme** (tu peux le sauvegarder en bibliothèque avant).`
        }]);
        return;
      }

      const maxWeek = Math.max(...sessions.map(s => s.week_number || 1), 1);
      const CYCLE_WEEKS = targetWeeks === 'infinite' ? 52 : (targetWeeks || 4);
      const expandedSessions = maxWeek >= CYCLE_WEEKS ? sessions :
        Array.from({ length: Math.ceil(CYCLE_WEEKS / maxWeek) }, (_, i) =>
          sessions.map(s => ({ ...s, week_number: (s.week_number || 1) + i * maxWeek }))
        ).flat().filter(s => s.week_number <= CYCLE_WEEKS);

      let program;
      if (existingProgram) {
        program = existingProgram;
        if (replaceExisting) {
          const oldSessions = await base44.entities.Session.filter({ program_id: existingProgram.id, status: 'planned' });
          for (const s of oldSessions) { await base44.entities.Session.delete(s.id); }
          await base44.entities.Program.update(existingProgram.id, { planned_weeks: CYCLE_WEEKS });
        }
      } else {
        // Pas de programme actif — créer un nouveau
        program = await base44.entities.Program.create({
          user_id: user.id,
          version: 1,
          objective_ids: [],
          weekly_structure: 'custom',
          planned_weeks: Math.max(...expandedSessions.map(s => s.week_number || 1), 1),
          active_phase: 'MEV',
          status: 'active',
          program_data: data,
        });
        // Mémoriser que ce programme est un import
        const ids = JSON.parse(localStorage.getItem('imported_program_ids') || '[]');
        localStorage.setItem('imported_program_ids', JSON.stringify([...ids, program.id]));
      }

      const today = new Date(); today.setHours(0,0,0,0);
      const dayMap = { monday:0, tuesday:1, wednesday:2, thursday:3, friday:4, saturday:5, sunday:6 };
      const thisMon = new Date(today);
      thisMon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      // Toujours utiliser la date locale pour éviter le décalage UTC (ex: lundi 00h local = dimanche 22h UTC)
      const toLocalDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

      const isInfinite = targetWeeks === 'infinite';

      // Infini → lundi courant, tout visible même si passé (répétition hebdo)
      // Fini → chaque jour trouve sa prochaine occurrence (passé décalé à semaine suivante)
      const sessionsWithDates = expandedSessions.map(s => {
        const dayOffset = dayMap[s.day?.toLowerCase()] ?? 0;
        const weekNum = (s.week_number || 1) - 1;
        if (isInfinite) {
          const d = new Date(thisMon);
          d.setDate(thisMon.getDate() + dayOffset + weekNum * 7);
          return { ...s, plannedDate: toLocalDate(d) };
        }
        const firstOccurrence = new Date(thisMon);
        firstOccurrence.setDate(thisMon.getDate() + dayOffset);
        if (firstOccurrence < today) firstOccurrence.setDate(firstOccurrence.getDate() + 7);
        const d = new Date(firstOccurrence);
        d.setDate(firstOccurrence.getDate() + weekNum * 7);
        return { ...s, plannedDate: toLocalDate(d) };
      });

      // Détection de conflits same-day (seulement pour les 2 premières semaines pour éviter les faux positifs sur les répétitions)
      if (existingProgram && !skipConflict) {
        const existingSessions = await base44.entities.Session.filter({ program_id: existingProgram.id, status: 'planned' });
        const existingByDate = {};
        existingSessions.forEach(s => { existingByDate[s.planned_date] = s; });
        const conflicts = sessionsWithDates.filter(s => s.week_number <= 2 && existingByDate[s.plannedDate]);
        if (conflicts.length > 0) {
          setPendingConflict({ jsonStr, targetWeeks, conflicts: conflicts.map(s => ({ newLabel: s.day_label || s.day, date: s.plannedDate, existingLabel: existingByDate[s.plannedDate].day_label })) });
          return;
        }
      }

      for (const s of sessionsWithDates) {
        await base44.entities.Session.create({
          user_id: user.id,
          program_id: program.id,
          week_number: s.week_number || 1,
          day_label: orderSuffix ? `${s.day_label || s.day} §${orderSuffix}` : (s.day_label || s.day),
          type: ['strength','hypertrophy','endurance','mixed','cardio','mobility'].includes(s.type) ? s.type : 'mixed',
          status: 'planned',
          planned_date: s.plannedDate,
          estimated_duration: s.estimated_duration || 60,
          exercises: s.exercises || [],
          active_zones: [...new Set((s.exercises || []).map(e => e.muscle_group).filter(Boolean))].map(m => ({ muscle_group: m })),
        });
      }

      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program-sessions'] });
      // Restaure la nav avant de naviguer (CoachIA va démonter, l'effet importing ne tournera pas)
      const navEl = document.querySelector('.mobile-nav');
      if (navEl) navEl.style.display = '';
      document.body.style.overflow = '';
      setImporting(false);
      navigate('/program');
    } catch (e) {
      setImporting(false);
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Erreur lors de l'import : ${e.message}. Réessaie.` }]);
    }
  };

  const suggestions = [
    "Je veux changer d'exercice pour les pecs",
    "Comment améliorer mon squat ?",
    "Je suis très fatigué cette semaine",
    "Est-ce que je peux passer en PPL ?",
  ];

  // navOffset = 0 quand clavier ouvert ou textarea focus (MobileNav cachée)
  //           = 80 quand clavier fermé (espace pour MobileNav)
  const navOffset = (kbOpen || focused) ? 0 : navHeight;

  return (
    <div ref={containerRef} style={{ position: 'fixed', top: containerTop, left: 0, right: 0, height: containerH, zIndex: 10 }}>

      {importing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(160deg, #2e1065 0%, #1e0050 100%)' }}>
          <img src="/apple-touch-icon.png" alt="Coach IA" style={{ width: 72, height: 72, borderRadius: 18, animation: 'splash-glow 2s ease-in-out infinite' }} />
          <div className="text-center space-y-1">
            <p className="text-white font-bold text-base">Import en cours…</p>
            <p className="text-white/40 text-sm">Création des séances</p>
          </div>
        </div>
      )}

      {/* Modal conflit même jour */}
      {pendingConflict && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 mb-6 rounded-2xl p-5 space-y-4" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div>
              <p className="font-bold text-white text-base">Séance le même jour</p>
              <p className="text-white/50 text-xs mt-1">
                {pendingConflict.conflicts.map(c => `"${c.newLabel}" et "${c.existingLabel}" sont le même jour.`).join(' ')}
              </p>
              <p className="text-white/70 text-sm mt-2">C'est voulu ? Si oui, choisis l'ordre dans la journée.</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">La nouvelle séance passe :</p>
              <button onClick={async () => {
                  await importProgramFromCoach(pendingConflict.jsonStr, pendingConflict.targetWeeks, true, '2');
                }}
                className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                <span className="text-lg">②</span> En 2ème (après l'existante)
              </button>
              <button onClick={async () => {
                  await importProgramFromCoach(pendingConflict.jsonStr, pendingConflict.targetWeeks, true, '1');
                }}
                className="w-full py-3 rounded-xl font-bold text-sm text-white/80 border border-white/20 flex items-center justify-center gap-2">
                <span className="text-lg">①</span> En 1ère (avant l'existante)
              </button>
              <button onClick={() => setPendingConflict(null)} className="w-full py-2 text-white/40 text-sm">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog import stylé */}
      {pendingImportSessions && (
        <ImportSessionDialog
          sessions={pendingImportSessions.sessions}
          isEditing={pendingImportSessions.isEditing || false}
          initialWeeks={pendingImportSessions.initialWeeks}
          onClose={() => setPendingImportSessions(null)}
          onImport={(editedSessions, weeks) => {
            const wasEditing = pendingImportSessions.isEditing || false;
            try { localStorage.removeItem('_import_pending'); localStorage.removeItem('_import_form'); localStorage.removeItem('_import_scroll'); } catch {}
            setPendingImportSessions(null);
            // Construire directement depuis editedSessions — pas de fusion JSON qui pourrait écraser le jour
            const directJson = JSON.stringify({
              sessions: editedSessions.map(s => ({
                day: s.day,
                day_label: s.label || s.day,
                exercises: s.exercises || [],
                type: s.type || 'mixed',
                estimated_duration: s.estimated_duration || calcDuration(s.exercises || []),
                week_number: 1,
              }))
            });
            importProgramFromCoach(directJson, weeks, wasEditing, null, wasEditing);
          }}
        />
      )}

      {/* Sélecteur de semaines pour l'import */}
      {pendingImportJson && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPendingImportJson(null)}>
          <div className="w-full max-w-sm mx-4 mb-6 rounded-2xl p-5 space-y-4" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)' }} onClick={e => e.stopPropagation()}>
            <div>
              <p className="font-bold text-white text-base">Durée du programme</p>
              <p className="text-white/50 text-xs mt-0.5">Le cycle se répète automatiquement sur la durée choisie.</p>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map(w => (
                <button key={w} onClick={() => importProgramFromCoach(pendingImportJson, w)}
                  className="py-2.5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-sm hover:bg-white/15 transition-colors">
                  {w}
                </button>
              ))}
            </div>
            <button onClick={() => importProgramFromCoach(pendingImportJson, 'infinite')}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              ∞ Infini — se répète indéfiniment
            </button>
            <button onClick={() => setPendingImportJson(null)} className="w-full py-2 text-white/40 text-sm">Annuler</button>
          </div>
        </div>
      )}
      {/* Messages */}
      <div ref={messagesRef} className="overflow-y-auto space-y-4 overscroll-contain" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: navOffset + 96, touchAction: 'pan-y', padding: '0 16px 16px' }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2 text-white">Salut ! Je suis ton coach IA</h3>
            <p className="text-white/70 text-sm mb-6 max-w-md">
              Je connais ton profil, tes objectifs et ton historique. Pose-moi une question ou demande un ajustement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  className="p-3 text-left text-sm bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 text-white transition-colors"
                >
                  <Sparkles className="w-3 h-3 inline mr-2 text-white/70" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="mb-1 ml-1">
                <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            <div
              onClick={() => setShownTs(shownTs === i ? null : i)}
              className={`max-w-[80%] rounded-2xl px-4 py-3 cursor-pointer ${
                msg.role === 'user'
                  ? 'bg-white text-violet-800 font-medium'
                  : 'bg-white/15 border border-white/20 text-white backdrop-blur-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-sm">{msg.content}</p>
              ) : (() => {
                const importMatch = msg.content.match(/IMPORT_READY:(\{[\s\S]*\})/);
                const cleanContent = msg.content.replace(/IMPORT_READY:\{[\s\S]*\}/, '').trim();
                return (
                  <>
                    <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      {cleanContent}
                    </ReactMarkdown>
                    {importMatch && (
                      <button
                        onClick={() => {
                          try {
                            const d = JSON.parse(importMatch[1].match(/\{[\s\S]*\}/)?.[0] || '{}');
                            setPendingImportSessions({ json: importMatch[1], sessions: d.sessions || [] });
                          } catch { setPendingImportSessions({ json: importMatch[1], sessions: [] }); }
                        }}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-white/90 transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        Importer ce programme dans l'app
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
            {shownTs === i && (
              <div className="flex items-center gap-2 mt-1.5 px-1">
                {msg.ts && <span className="text-[11px] text-white/35 font-medium">{fmtTime(msg.ts)}</span>}
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 border border-white/15">
                  <button
                    onClick={() => { navigator.clipboard?.writeText(msg.content); setShownTs(null); }}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/15 transition-all">
                    <Copy className="w-3 h-3" />
                  </button>
                  {msg.role === 'user' && (
                    <>
                      <div className="w-px h-3 bg-white/20" />
                      <button
                        onClick={() => { setInput(msg.content); setShownTs(null); }}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/15 transition-all">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <div className="w-px h-3 bg-white/20" />
                      <button
                        onClick={() => { setInput(msg.content); sendMessage(); setShownTs(null); }}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/15 transition-all">
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-end"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/15 border border-white/20 rounded-2xl px-4 py-3.5 backdrop-blur-sm flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/70 block"
                  animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input + Label — input en haut, label entre input et nav */}
      <div style={{ position: 'absolute', bottom: navOffset, left: 0, right: 0, padding: '0 16px 0' }}>
        <div ref={inputAreaRef} className="bg-white/10 rounded-2xl border border-white/20 flex items-center gap-2 px-3 py-2">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Écrire un message..."
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          className="flex-1 min-h-[36px] max-h-[120px] resize-none bg-transparent border-0 border-none text-white placeholder:text-white/40 focus:ring-0 shadow-none p-0 leading-tight"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-white text-violet-700 hover:bg-white/90 disabled:opacity-30 transition-all"
          style={{ opacity: loading ? 0 : undefined }}
        >
          <Send className="w-4 h-4" />
        </button>
        </div>
        <div className="flex items-center justify-between px-1 pt-1 pb-2">
          <p className="text-xs text-white/50"><span className="font-bold text-white">Coach IA</span> · Ton assistant entraînement</p>
          <button
            onClick={() => {
              if (activeImportedProgram) openEditDialog();
              else if (hasActiveProgram) setShowImportBlocked(true);
              else setPendingImportSessions({ json: '{}', sessions: [] });
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
            Importer / Modifier
          </button>
        </div>
      </div>

      {showImportBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setShowImportBlocked(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-violet-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div>
              <p className="font-bold text-white text-base">Programme déjà existant</p>
              <p className="text-sm text-white/60 mt-1">Tu dois d'abord supprimer ton programme actuel avant d'en importer un nouveau.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowImportBlocked(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
                Fermer
              </button>
              <button onClick={() => { setShowImportBlocked(false); navigate('/program'); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white text-violet-700 hover:bg-white/90 transition-colors">
                Voir le programme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}