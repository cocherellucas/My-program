import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, X, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRestTimer } from '@/lib/RestTimerContext';
import { useI18n } from '@/lib/i18n';

const postToSW = (msg) => {
  if (!('serviceWorker' in navigator)) return;
  const sw = navigator.serviceWorker.controller;
  if (sw) { sw.postMessage(msg); return; }
  navigator.serviceWorker.ready.then(reg => {
    const target = reg.active || reg.installing || reg.waiting;
    target?.postMessage(msg);
  }).catch(() => {});
};

const requestNotifPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

export default function RestTimer({ seconds = 90, onComplete, onRestTimeChange, initialEndTime, label, mode = 'rest' }) {
  const { notifyEndTimeChange } = useRestTimer() || {};
  const { t } = useI18n();
  const endTimeRef = useRef(initialEndTime || Date.now() + seconds * 1000);
  const [remaining, setRemaining] = useState(() => {
    const left = Math.ceil((endTimeRef.current - Date.now()) / 1000);
    return left > 0 ? left : seconds;
  });
  const [running, setRunning] = useState(true);
  const [fullscreen, setFullscreen] = useState(false); // chrono en grand (visible de loin)
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const barRef = useRef(null);
  const dragging = useRef(false);
  const tapRef = useRef(null); // position du doigt au down → marge d'erreur pour le tap plein écran

  // Reset le timer uniquement au démarrage d'un NOUVEAU timer (initialEndTime change)
  // Pas quand seconds change (ce qui arrive si on restore après scrub)
  useEffect(() => {
    endTimeRef.current = initialEndTime || Date.now() + seconds * 1000;
    const left = Math.ceil((endTimeRef.current - Date.now()) / 1000);
    setRemaining(Math.max(0, left));
    setRunning(true);
    requestNotifPermission();
    postToSW({ type: 'SCHEDULE_REST_END', endTime: endTimeRef.current });
    return () => postToSW({ type: 'CANCEL_REST_TIMER' });
  }, [initialEndTime]); // eslint-disable-line

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      const left = Math.ceil((endTimeRef.current - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setRemaining(0);
        playBeep();
        setTimeout(() => onComplete?.(), 1500);
      } else {
        setRemaining(left);
      }
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  // Recalculer au retour du background
  useEffect(() => {
    const onVisible = () => {
      if (document.hidden) return;
      if (!running) return;
      const left = Math.ceil((endTimeRef.current - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setRemaining(0);
        setTimeout(() => onComplete?.(), 500);
      } else {
        setRemaining(left);
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    const onPageHide = (e) => {
      if (!e.persisted) {
        // App fermée complètement — annuler le timer et la notification
        postToSW({ type: 'CANCEL_REST_TIMER' });
        try {
          const keys = Object.keys(localStorage).filter(k => k.startsWith('rest_timer_'));
          keys.forEach(k => localStorage.removeItem(k));
        } catch {}
        onComplete?.();
      }
    };
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [running]);

  const audioCtxRef = useRef(null);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  // Déverrouiller l'AudioContext iOS au premier touch
  useEffect(() => {
    const unlock = () => {
      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('touchend', unlock);
    };
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('touchend', unlock, { passive: true });
    return () => {
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('touchend', unlock);
    };
  }, []);

  const playBeep = () => {
    try {
      const audioContext = getAudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
    } catch {}
  };


  const total = seconds;
  const progress = remaining / total;
  const radius = 42;

  const scrubTo = (clientX) => {
    if (!barRef.current) return;
    const { left, width } = barRef.current.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - left) / width));
    const newRemaining = Math.round(pct * total);
    endTimeRef.current = Date.now() + newRemaining * 1000;
    setRemaining(newRemaining);
  };

  const stopDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setRunning(true);
    notifyEndTimeChange?.(endTimeRef.current);
    postToSW({ type: 'SCHEDULE_REST_END', endTime: endTimeRef.current });
    window.removeEventListener('mousemove', onWindowMouseMove);
    window.removeEventListener('mouseup', onWindowMouseUp);
    window.removeEventListener('touchmove', onWindowTouchMove);
    window.removeEventListener('touchend', onWindowTouchEnd);
  };

  const onWindowMouseMove = (e) => scrubTo(e.clientX);
  const onWindowMouseUp   = ()  => stopDrag();
  const onWindowTouchMove = (e) => scrubTo(e.touches[0].clientX);
  const onWindowTouchEnd  = ()  => stopDrag();

  const handleBarMouseDown = (e) => {
    dragging.current = true;
    scrubTo(e.clientX);
    setRunning(false);
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
  };

  const handleBarTouchStart = (e) => {
    dragging.current = true;
    scrubTo(e.touches[0].clientX);
    setRunning(false);
    window.addEventListener('touchmove', onWindowTouchMove);
    window.addEventListener('touchend', onWindowTouchEnd);
  };
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * progress;

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const timeStr = `${m}:${s.toString().padStart(2, '0')}`;

  const urgentColor = remaining <= 5 ? '#ef4444' : remaining <= 15 ? '#f97316' : 'hsl(var(--primary))';
  // En plein écran, blanc quand tout va bien (contraste max, lisible de loin)
  const bigColor = remaining <= 5 ? '#ef4444' : remaining <= 15 ? '#f97316' : '#ffffff';

  return (
    <>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ top: '-60px', paddingTop: 'calc(60px + max(16px, env(safe-area-inset-top)))', background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #4c1d95 100%)' }}
        className="fixed left-0 right-0 z-50 shadow-xl">

        {/* Tap sur la rangée → plein écran. MARGE D'ERREUR : si le doigt a bougé
            (tentative de scrub / imprécision), on n'agrandit pas — seul un tap quasi
            immobile agrandit. (Boutons et barre de scrub sont hors de ce onClick.) */}
        <div className="px-5 pb-4 flex items-center justify-between gap-4 cursor-pointer"
          onPointerDown={(e) => { tapRef.current = { x: e.clientX, y: e.clientY }; }}
          onClick={(e) => {
            const s = tapRef.current; tapRef.current = null;
            if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 10) return; // bougé → pas d'agrandissement
            setFullscreen(true);
          }}>

        {/* Label + timer */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-violet-300/70 text-xs font-semibold uppercase tracking-widest">
              <Timer className="w-3.5 h-3.5" /> {label || t('se_rest_label')}
            </div>
            <span className="text-[9px] text-violet-300/45 font-medium tracking-wide">{t('se_timer_tap_expand')}</span>
          </div>
          <span
            className="text-3xl font-black font-heading tracking-tight"
            style={{ color: urgentColor }}>
            {timeStr}
          </span>
          {remaining === 0
            ? <span className="text-base font-bold text-white animate-pulse whitespace-nowrap">{mode === 'manual' ? t('se_timer_done') : t('se_go')}</span>
            : remaining <= 15
            ? <span className="text-sm font-semibold text-orange-300 animate-pulse whitespace-nowrap">{mode === 'manual' ? t('se_timer_almost') : t('se_ready')}</span>
            : null}
        </div>

        {/* Boutons — stopPropagation pour NE PAS déclencher le plein écran */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setRunning((r) => !r)}
            className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => { postToSW({ type: 'CANCEL_REST_TIMER' }); onComplete?.(); }}
            className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        </div>

        {/* Barre de progression / scrub */}
        <div
          ref={barRef}
          className="h-2 bg-white/10 cursor-pointer select-none"
          onMouseDown={handleBarMouseDown}
          onTouchStart={handleBarTouchStart}>
          <div className="h-full transition-none relative" style={{ width: `${progress * 100}%`, backgroundColor: urgentColor }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>

    {/* Chrono plein écran — visible de loin. Touche l'écran pour réduire. */}
    {fullscreen && (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 px-6"
        style={{ background: 'linear-gradient(160deg, #1e0050 0%, #6d28d9 55%, #4c1d95 100%)' }}
        onClick={() => setFullscreen(false)}>
        <div className="flex items-center gap-2 text-violet-200/70 text-base font-semibold uppercase tracking-widest">
          <Timer className="w-5 h-5" /> {label || t('se_rest_label')}
        </div>
        <span className="font-black font-heading tracking-tight leading-none tabular-nums"
          style={{ color: bigColor, fontSize: 'min(38vw, 44vh)' }}>
          {timeStr}
        </span>
        {remaining === 0
          ? <span className="text-2xl font-bold text-white animate-pulse">{mode === 'manual' ? t('se_timer_done') : t('se_go')}</span>
          : remaining <= 15
          ? <span className="text-xl font-semibold text-orange-300 animate-pulse">{mode === 'manual' ? t('se_timer_almost') : t('se_ready')}</span>
          : null}
        <div className="flex items-center gap-4 mt-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setRunning((r) => !r)}
            className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            {running ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
          </button>
          <button
            onClick={() => { postToSW({ type: 'CANCEL_REST_TIMER' }); onComplete?.(); }}
            className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-7 h-7" />
          </button>
        </div>
        <p className="absolute bottom-10 text-white/40 text-sm">{t('se_timer_tap_reduce')}</p>
      </div>
    )}
    </>);

}

export function RestTimerControl({ seconds, onSave }) {
  const [value, setValue] = useState(String(seconds));

  const handleSave = () => {
    const newValue = Math.max(parseInt(value) || seconds, 1);
    onSave?.(newValue);
  };

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-white/10 border border-white/20 hidden">
      <span className="text-xs text-white/60">Repos pour cette série :</span>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-20 h-8 text-center bg-white/10 border-white/20 text-white" />
      
      <span className="text-xs text-white/60">s</span>
      <Button
        size="sm"
        onClick={handleSave}
        className="ml-auto text-xs">
        
        Enregistrer
      </Button>
    </div>);

}