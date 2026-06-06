import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const RestTimerContext = createContext(null);

export function RestTimerProvider({ children }) {
  const [timerState, setTimerState] = useState(null); // { seconds, endTime, id } | null
  const onCompleteRef = useRef(null);
  const onEndTimeChangeRef = useRef(null);

  const startTimer = useCallback((seconds, endTime, onComplete, onEndTimeChange) => {
    onCompleteRef.current = onComplete || null;
    onEndTimeChangeRef.current = onEndTimeChange || null;
    setTimerState({ seconds, endTime, id: Date.now() + Math.random() });
  }, []);

  const stopTimer = useCallback((fireCallback = false) => {
    if (fireCallback) onCompleteRef.current?.();
    onCompleteRef.current = null;
    onEndTimeChangeRef.current = null;
    setTimerState(null);
  }, []);

  const updateSeconds = useCallback((seconds) => {
    setTimerState(s => s ? { ...s, seconds } : null);
  }, []);

  // Notifie le parent (SessionLog) du nouvel endTime sans remount du RestTimer
  const notifyEndTimeChange = useCallback((endTime) => {
    onEndTimeChangeRef.current?.(endTime);
  }, []);

  return (
    <RestTimerContext.Provider value={{ timerState, startTimer, stopTimer, updateSeconds, notifyEndTimeChange }}>
      {children}
    </RestTimerContext.Provider>
  );
}

export const useRestTimer = () => useContext(RestTimerContext);
