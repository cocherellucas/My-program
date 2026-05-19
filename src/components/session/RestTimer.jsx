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
          onComplete?.();
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
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * progress;

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const timeStr = `${m}:${s.toString().padStart(2, '0')}`;

  const urgentColor = remaining <= 5 ? '#ef4444' : remaining <= 15 ? '#f97316' : 'hsl(var(--primary))';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-24 right-6 z-50 bg-card border border-border rounded-2xl shadow-2xl p-4 flex flex-col items-center gap-3 w-40">
        
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          <Timer className="w-3 h-3" /> Repos
        </div>

        {editing ?
        <div className="flex items-center gap-2 w-full">
            <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-center text-sm"
            autoFocus />
          
            <span className="text-xs text-muted-foreground">s</span>
            <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={handleEditSave}>
            
              <Check className="w-3.5 h-3.5" />
            </Button>
          </div> :

        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
              cx="50" cy="50" r={radius} fill="none"
              stroke={urgentColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }} />
            
            </svg>
            <span className="text-xl font-bold font-heading z-10 cursor-pointer hover:opacity-75" style={{ color: urgentColor }} onClick={() => {setEditing(true);setEditValue(String(remaining));}}>{timeStr}</span>
          </div>
        }

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:text-violet-400 hover:bg-violet-400/10"
            onClick={() => setRunning((r) => !r)}>

            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-muted-foreground hover:text-violet-400 hover:bg-violet-400/10"
            onClick={() => onComplete?.()}>

            <X className="w-5 h-5" />
          </Button>
        </div>

        {remaining === 0 &&
        <span className="text-xs font-semibold text-accent">C'est parti !</span>
        }
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