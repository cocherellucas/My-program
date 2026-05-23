import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function NumInput({ value, onChange, placeholder = '—', step = 1, min = 0, max = Infinity, defaultValue = 0, className = '' }) {
  const holdRef = useRef(null);
  const valRef  = useRef(value);
  valRef.current = value;

  const doStep = (dir) => {
    const cur  = parseFloat(valRef.current) || defaultValue;
    const next = Math.min(max, Math.max(min, parseFloat((cur + dir * step).toFixed(2))));
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

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, '');
          onChange(raw === '' ? '' : raw);
        }}
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
