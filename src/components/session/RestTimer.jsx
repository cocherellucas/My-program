import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, X, Play, Pause, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestTimer({ seconds = 90, onComplete, onRestTimeChange }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(seconds));
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const barRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    setRunning(true);
  }, [seconds]);

  useEffect(() => {
    if (!running) {clearInterval(intervalRef.current);return;}
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          playBeep();
          setTimeout(() => onComplete?.(), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const playBeep = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const playSingleBeep = (delayMs) => {
      const now = audioContext.currentTime + delayMs / 1000;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
    };
    playSingleBeep(0);
    playSingleBeep(400);
    playSingleBeep(800);
  };

  const handleEditSave = () => {
    const newValue = Math.max(parseInt(editValue) || remaining, 1);
    setRemaining(newValue);
    setEditValue(String(newValue));
    setEditing(false);
    setRunning(true);
    onRestTimeChange?.(newValue);
  };

  const total = seconds;
  const progress = remaining / total;
  const radius = 42;

  const scrubTo = (clientX) => {
    if (!barRef.current) return;
    const { left, width } = barRef.current.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - left) / width));
    setRemaining(Math.round(pct * total));
  };

  const stopDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setRunning(true);
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ top: '-60px', paddingTop: 'calc(60px + max(16px, env(safe-area-inset-top)))', background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #4c1d95 100%)' }}
        className="fixed left-0 right-0 z-50 shadow-xl">

        <div className="px-5 pb-4 flex items-center justify-between gap-4">

        {/* Label + timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-violet-300/70 text-xs font-semibold uppercase tracking-widest">
            <Timer className="w-3.5 h-3.5" /> Repos
          </div>
          {editing ? (
            <div className="flex items-center gap-2">
              <Input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="h-8 w-20 text-center text-sm bg-white/10 border-white/20 text-white" autoFocus />
              <Button size="icon" variant="ghost" className="h-7 w-7 text-violet-300 hover:text-white" onClick={handleEditSave}><Check className="w-4 h-4" /></Button>
            </div>
          ) : (
            <span
              className="text-3xl font-black font-heading cursor-pointer tracking-tight"
              style={{ color: urgentColor }}
              onClick={() => { setEditing(true); setEditValue(String(remaining)); }}>
              {timeStr}
            </span>
          )}
          {remaining === 0
            ? <span className="text-sm font-bold text-white animate-pulse">C'est parti !</span>
            : remaining <= 15
            ? <span className="text-xs font-semibold text-orange-300 animate-pulse">Prépare-toi !</span>
            : null}
        </div>

        {/* Boutons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setRunning((r) => !r)}
            className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onComplete?.()}
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
    </AnimatePresence>);

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