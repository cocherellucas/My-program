import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function NumInput({ value, onChange, placeholder = '—', step = 1, min = 0, max = Infinity, defaultValue = 0, className = '' }) {
  const inputRef = useRef(null);
  const holdRef  = useRef(null);
  // Valeur la plus récente — lue pendant le maintien (sinon la closure du setInterval
  // garderait la valeur initiale et l'incrément ne s'accumulerait pas).
  const valueRef = useRef(value);
  valueRef.current = value;
  const [display, setDisplay] = useState(value != null && value !== '' ? String(value) : '');

  // Sync display only when the input is not focused (user not actively typing)
  useEffect(() => {
    if (inputRef.current !== document.activeElement) {
      setDisplay(value != null && value !== '' ? String(value) : '');
    }
  }, [value]);

  const doStep = (dir, mult = 1) => {
    const cur  = parseFloat(valueRef.current) || defaultValue;
    const next = Math.min(max, Math.max(min, parseFloat((cur + dir * step * mult).toFixed(2))));
    valueRef.current = next; // maj immédiate pour le tick suivant du maintien
    setDisplay(String(next));
    onChange(next);
  };

  const holdCount = useRef(0);
  const startHold = (dir) => {
    holdCount.current = 0;
    doStep(dir);
    holdRef.current = setTimeout(() => {
      holdRef.current = setInterval(() => {
        holdCount.current += 1;
        // Accélération : le pas grossit plus on maintient longtemps
        const c = holdCount.current;
        const mult = c > 45 ? 10 : c > 25 ? 5 : c > 10 ? 2 : 1;
        doStep(dir, mult);
      }, 60);
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
