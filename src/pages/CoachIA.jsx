import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Bot, User, Sparkles, Paperclip, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { buildSystemPrompt } from '@/lib/coach-prompts';
import { getContextualKnowledge, getMessageKnowledge } from '@/lib/scientific-knowledge-base';
import { getAvailableExercises, getTensionProfile } from '@/lib/exercise-database';
import { normalizeUser } from '@/lib/utils';

export default function CoachIA() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      const normalized = normalizeUser(u);
      setUser(normalized);
      if (u?.id) {
        try {
          const saved = localStorage.getItem(`coach_history_${u.id}`);
          if (saved) setMessages(JSON.parse(saved));
        } catch {}
      }
    });
  }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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

  // Verrouille le scroll du body sur iOS
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = '';
    };
  }, []);

  const inputRef = useRef(null);
  const inputAreaRef = useRef(null);

  // Bloque le scroll tactile sur la zone input (iOS)
  useEffect(() => {
    const el = inputAreaRef.current;
    if (!el) return;
    const block = (e) => e.preventDefault();
    el.addEventListener('touchmove', block, { passive: false });
    return () => el.removeEventListener('touchmove', block);
  }, []);
  const handleInputFocus = () => {
    document.body.classList.add('keyboard-open');
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 350);
  };
  const handleInputBlur = () => document.body.classList.remove('keyboard-open');

  const [attachedImageBase64, setAttachedImageBase64] = useState(null);

  // Lit le contenu d'un fichier (texte ou image base64)
  const readFileContent = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        setAttachedImageBase64(e.target.result); // stocker la base64 complète
        resolve(`[Image jointe : ${file.name}]`);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => resolve(`[Fichier : ${file.name}]\n${e.target.result}`);
      reader.readAsText(file);
    }
  });

  const sendMessage = async () => {
    if ((!input.trim() && !attachedFile) || loading) return;
    let userMsg = input.trim();

    // Lire le contenu du fichier si joint
    if (attachedFile) {
      const fileContent = await readFileContent(attachedFile);
      userMsg = userMsg ? `${userMsg}\n\n${fileContent}` : fileContent;
      setAttachedFile(null);
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
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
    const importInstruction = `\n\nINSTRUCTION IMPORT : Si l'utilisateur partage un programme d'entraînement (texte, liste d'exercices, photo, PDF) ou demande de l'importer dans l'app, analyse-le, propose des optimisations selon la science, puis termine ta réponse avec exactement ce bloc JSON (remplace les valeurs) :
IMPORT_READY:{"sessions":[{"day_label":"Lundi - Pectoraux","day":"monday","week_number":1,"type":"hypertrophy","estimated_duration":60,"exercises":[{"name":"Développé couché barre","sets":4,"target_reps":"8-10","rest_seconds":90,"muscle_group":"Pectoraux"}]}]}
Ne mets IMPORT_READY que si tu as assez d'infos pour créer un vrai programme structuré.`;

    const llmParams = {
      prompt: `${systemContext}${importInstruction}\n\n${history}\n\nUtilisateur: ${userMsg}`,
      model: 'claude_sonnet_4_6',
    };
    if (attachedImageBase64) {
      llmParams.add_context_from_images = [attachedImageBase64];
      setAttachedImageBase64(null);
    }
    const result = await base44.integrations.Core.InvokeLLM(llmParams);

    setMessages(prev => [...prev, { role: 'assistant', content: result }]);
    setLoading(false);
  };

  // Importe le programme détecté dans la DB
  const importProgramFromCoach = async (jsonStr) => {
    try {
      // Nettoyage du JSON — l'IA peut ajouter du texte après le bloc
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('JSON introuvable');
      const data = JSON.parse(jsonMatch[0]);
      const sessions = data.sessions || [];
      if (!sessions.length) throw new Error('Aucune séance dans le programme');

      // Désactiver les programmes actifs existants
      const active = await base44.entities.Program.filter({ user_id: user.id, status: 'active' });
      for (const p of active) {
        await base44.entities.Program.update(p.id, { status: 'suspended' });
      }

      // Toujours étendre sur 4 semaines en répétant le pattern
      const maxWeek = Math.max(...sessions.map(s => s.week_number || 1), 1);
      const CYCLE_WEEKS = 4;
      const expandedSessions = maxWeek >= CYCLE_WEEKS ? sessions :
        Array.from({ length: Math.ceil(CYCLE_WEEKS / maxWeek) }, (_, i) =>
          sessions.map(s => ({ ...s, week_number: (s.week_number || 1) + i * maxWeek }))
        ).flat().filter(s => s.week_number <= CYCLE_WEEKS);

      const program = await base44.entities.Program.create({
        user_id: user.id,
        version: 1,
        objective_ids: [],
        weekly_structure: 'custom',
        planned_weeks: Math.max(...expandedSessions.map(s => s.week_number || 1), 1),
        active_phase: 'MEV',
        status: 'active',
        program_data: data,
      });

      const monday = new Date();
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
      const dayMap = { monday:0, tuesday:1, wednesday:2, thursday:3, friday:4, saturday:5, sunday:6 };

      for (const s of expandedSessions) {
        const offset = ((s.week_number || 1) - 1) * 7 + (dayMap[s.day?.toLowerCase()] ?? 0);
        const d = new Date(monday);
        d.setDate(monday.getDate() + offset);
        await base44.entities.Session.create({
          user_id: user.id,
          program_id: program.id,
          week_number: s.week_number || 1,
          day_label: s.day_label || s.day,
          type: s.type || 'hypertrophy',
          status: 'planned',
          planned_date: d.toISOString().split('T')[0],
          estimated_duration: s.estimated_duration || 60,
          exercises: s.exercises || [],
          active_zones: [...new Set((s.exercises || []).map(e => e.muscle_group).filter(Boolean))].map(m => ({ muscle_group: m })),
        });
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Programme importé ! ${sessions.length} séances créées. Va dans l'onglet **Programme** pour le voir.`
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Erreur lors de l'import : ${e.message}. Réessaie.` }]);
    }
  };

  const suggestions = [
    "Je veux changer d'exercice pour les pecs",
    "Comment améliorer mon squat ?",
    "Je suis très fatigué cette semaine",
    "Est-ce que je peux passer en PPL ?",
  ];

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100dvh - var(--coach-offset, 120px))' }}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Coach IA</h1>
          <p className="text-white/70 mt-1 text-sm">Demande-moi n'importe quoi sur ton entraînement</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              // Effacer toutes les clés coach_history dans localStorage
              Object.keys(localStorage)
                .filter(k => k.startsWith('coach_history_'))
                .forEach(k => localStorage.removeItem(k));
            }}
            className="text-xs text-white/40 hover:text-white/70 mt-1 transition-colors"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 overscroll-contain" style={{ touchAction: 'pan-y' }}>
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
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-white text-violet-800 font-medium' 
                : 'bg-white/15 border border-white/20 text-white backdrop-blur-sm'
            }`}>
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
                        onClick={() => importProgramFromCoach(importMatch[1])}
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
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-white" />
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

      {/* Input */}
      <div ref={inputAreaRef} className="flex-shrink-0 bg-white/10 rounded-2xl border border-white/20 mx-0 mt-3">
        {/* Fichier joint */}
        {attachedFile && (
          <div className="flex items-center gap-2 px-4 pt-3">
            {attachedFile.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(attachedFile)} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-white/70 flex-shrink-0" />
            )}
            <span className="text-xs text-white/70 flex-1 truncate">{attachedFile.name}</span>
            <button onClick={() => setAttachedFile(null)} className="text-white/40 hover:text-white/70 text-xs">✕</button>
          </div>
        )}

        {/* Textarea */}
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
          className="w-full min-h-[48px] max-h-[120px] resize-none bg-transparent border-0 border-none text-white placeholder:text-white/40 focus:ring-0 shadow-none px-4 pt-3 pb-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
          }}
        />

        {/* Toolbar bas */}
        <div className="flex items-center justify-between px-3 pb-2 pt-1">
          <label className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <Paperclip className="w-5 h-5" />
            <input type="file" accept=".pdf,.txt,image/*" className="hidden" onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} />
          </label>
          <button
            onClick={sendMessage}
            disabled={loading || (!input.trim() && !attachedFile)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-violet-700 hover:bg-white/90 disabled:opacity-30 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}