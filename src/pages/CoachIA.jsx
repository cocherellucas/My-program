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
import { buildPainAdvice, detectZoneFromText, loadEpisodes, saveEpisodes, upsertEpisode } from '@/lib/pain-engine';
import { useI18n } from '@/lib/i18n';

export default function CoachIA() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowHint, setSlowHint] = useState(false); // réseau lent : réponse plus longue
  const [attachedFile, setAttachedFile] = useState(null);
  const [hasActiveProgram, setHasActiveProgram] = useState(false);
  const [showImportBlocked, setShowImportBlocked] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      const normalized = normalizeUser(u);
      setUser(normalized);
      base44.entities.Program.filter({ status: 'active' }, '-created_date', 1).then(progs => {
        setHasActiveProgram(progs.length > 0);
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
      // Import direct depuis l'onboarding (texte collé)
      if (location.state?.importText) {
        setInput(location.state.importText);
        navigate('/coach', { replace: true, state: {} });
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

  // Empêche le scroll du body pendant que CoachIA est affiché
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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
    // Quitter l'app clavier ouvert : aucun événement viewport en arrière-plan →
    // containerH/Top restent figés "clavier ouvert" (écran décalé au retour).
    // On ferme le clavier en quittant et on resynchronise au retour.
    const resyncSoon = () => {
      update();
      requestAnimationFrame(update);
      [150, 400, 800].forEach(d => setTimeout(update, d));
    };
    const onVisibility = () => {
      if (document.hidden) {
        const ae = document.activeElement;
        if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable === true)) ae.blur();
      } else {
        resyncSoon();
      }
    };
    update();
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', resyncSoon);
    return () => {
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', resyncSoon);
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

    // Hors-ligne : le coach a besoin du réseau — message clair, on ne tente rien.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setMessages(prev => [...prev, { role: 'assistant', content: t('co_offline'), ts: Date.now() }]);
      return;
    }

    setLoading(true);
    // Indice « réseau lent » : uniquement si le navigateur signale vraiment une
    // mauvaise connexion (2g / mode économie de données). Pas de repli au temps
    // écoulé — une réponse longue ne veut pas forcément dire réseau lent.
    try {
      const conn = typeof navigator !== 'undefined' ? navigator.connection : null;
      if (conn && (conn.saveData || /2g$/.test(conn.effectiveType || ''))) setSlowHint(true);

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
    const importInstruction = `\n\nINSTRUCTION IMPORT : Cette instruction concerne UNIQUEMENT le cas où l'utilisateur veut importer un programme externe (d'un autre coach, d'une feuille Excel, d'un PDF, etc.) dans l'app. Dans CE CAS UNIQUEMENT, dis-lui d'aller dans l'onglet **Programme** puis d'appuyer sur **Modifier** (disponible tant qu'il n'a pas de programme généré actif) pour coller sa séance. NE PAS confondre avec "génère-moi un programme" ou "crée un programme" ou "carte blanche" : dans ce cas, génère directement le programme (PROMPT 3). Ne génère jamais de bloc IMPORT_READY dans le chat.`;

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
      // IA coupée / hors-ligne : si le message décrit une douleur → arbre de
      // décision codé (même moteur que le formulaire douleur en séance)
      if (/douleur|mal\b|gêne|gene\b|pincement|blessure|douloureux|tendinite|inflammation|brûl|brul|craqu|fourmi|engourd/i.test(userMsg)) {
        return buildPainAdvice(userMsg, lang);
      }
      return t('co_error');
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
      // Vrai mot de douleur + zone identifiable → ouvre un épisode de suivi
      // (le check « comment a réagi ta zone ? » arrivera à J+1, comme en séance).
      try {
        const painWord = /douleur|mal\b|gêne|gene\b|pincement|blessure|douloureux|tendinite|inflammation|brûl|brul|craqu|fourmi|engourd/i.test(userMsg);
        const zone = painWord ? detectZoneFromText(userMsg) : null;
        if (zone) {
          const eps = await loadEpisodes(user.id);
          await saveEpisodes(user.id, upsertEpisode(eps, zone));
        }
      } catch {}
    }
    } catch (e) {
      // Réseau tombé pendant le chargement des données → message clair.
      setMessages(prev => [...prev, { role: 'assistant', content: t('co_offline'), ts: Date.now() }]);
    } finally {
      setSlowHint(false);
      setLoading(false);
    }
  };


  const suggestions = [t('co_sug_1'), t('co_sug_2'), t('co_sug_3'), t('co_sug_4')];

  // navOffset = 0 quand clavier ouvert ou textarea focus (MobileNav cachée)
  //           = 80 quand clavier fermé (espace pour MobileNav)
  const navOffset = (kbOpen || focused) ? 0 : navHeight;

  return (
    <div ref={containerRef} style={{ position: 'fixed', top: containerTop, left: 0, right: 0, height: containerH, zIndex: 10 }}>

      {/* Messages */}
      <div ref={messagesRef} className="overflow-y-auto space-y-4 overscroll-contain" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: navOffset + 96, touchAction: 'pan-y', padding: '0 16px 16px' }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2 text-white">{t('co_greeting')}</h3>
            <p className="text-white/70 text-sm mb-6 max-w-md">
              {t('co_intro')}
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
              ) : (
                <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  {msg.content}
                </ReactMarkdown>
              )}
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
            <div className="bg-white/15 border border-white/20 rounded-2xl px-4 py-3.5 backdrop-blur-sm flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/70 block"
                    animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  />
                ))}
              </div>
              {slowHint && <span className="text-[11px] text-white/60 leading-snug">{t('co_slow')}</span>}
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
          placeholder={t('co_placeholder')}
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
        <div className="flex items-center px-1 pt-1 pb-2">
          <p className="text-xs text-white/50"><span className="font-bold text-white">Coach IA</span> · {t('co_footer')}</p>
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