import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function NumInput({ value, onChange, placeholder = '—', step = 1, min = 0, max = Infinity, defaultValue = 0, className = '' }) {
  const inputRef = useRef(null);
  const holdRef  = useRef(null);
  const [display, setDisplay] = useState(value != null && value !== '' ? String(value) : '');

  // Sync display only when the input is not focused (user not actively typing)
  useEffect(() => {
    if (inputRef.current !== document.activeElement) {
      setDisplay(value != null && value !== '' ? String(value) : '');
    }
  }, [value]);

  const doStep = (dir) => {
    const cur  = parseFloat(value) || defaultValue;
    const next = Math.min(max, Math.max(min, parseFloat((cur + dir * step).toFixed(2))));
    setDisplay(String(next));
    onChange(next);
  };

  const startHold = (dir) => {
    doStep(dir);
    holdRef.current = setTimeout(() => {
      holdRef.current = setInterval(() => doStep(dir), 80);
    }, 400);
  };

  const stopHold = () => {
    clearTimeout(holdRef.current);
    clearInterval(holdRef.current);
    holdRef.current = null;
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
    setDisplay(raw);
    if (raw === '') { onChange(''); return; }
    if (raw.endsWith('.')) return; // intermediate state — wait for blur
    const num = parseFloat(raw);
    if (!isNaN(num)) onChange(raw);
  };

  const handleBlur = () => {
    const num = parseFloat(display);
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(min, num));
      const final   = parseFloat(clamped.toFixed(2));
      setDisplay(String(final));
      onChange(final);
    } else {
      setDisplay(value != null && value !== '' ? String(value) : '');
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter')     { e.target.blur(); }
          if (e.key === 'ArrowUp')   { e.preventDefault(); doStep(1); }
          if (e.key === 'ArrowDown') { e.preventDefault(); doStep(-1); }
        }}
        className={`pr-6 ${className}`}
      />
      <div className="absolute right-1 top-0 h-full flex flex-col justify-center">
        <button type="button" tabIndex={-1}
          onMouseDown={(e) => { e.preventDefault(); startHold(1); }}
          onTouchStart={(e) => { e.preventDefault(); startHold(1); }}
          onMouseUp={stopHold} onMouseLeave={stopHold} onTouchEnd={stopHold}
          className="text-white/50 hover:text-white leading-none">
          <ChevronUp className="w-3 h-3" />
        </button>
        <button type="button" tabIndex={-1}
          onMouseDown={(e) => { e.preventDefault(); startHold(-1); }}
          onTouchStart={(e) => { e.preventDefault(); startHold(-1); }}
          onMouseUp={stopHold} onMouseLeave={stopHold} onTouchEnd={stopHold}
          className="text-white/50 hover:text-white leading-none">
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
