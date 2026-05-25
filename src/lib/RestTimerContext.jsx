import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const RestTimerContext = createContext(null);

export function RestTimerProvider({ children }) {
  const [timerState, setTimerState] = useState(null); // { seconds, endTime } | null
  const onCompleteRef = useRef(null);

  const startTimer = useCallback((seconds, endTime, onComplete) => {
    onCompleteRef.current = onComplete || null;
    setTimerState({ seconds, endTime });
  }, []);

  const stopTimer = useCallback((fireCallback = false) => {
    if (fireCallback) onCompleteRef.current?.();
    onCompleteRef.current = null;
    setTimerState(null);
  }, []);

  const updateSeconds = useCallback((seconds) => {
    setTimerState(s => s ? { ...s, seconds } : null);
  }, []);

  return (
    <RestTimerContext.Provider value={{ timerState, startTimer, stopTimer, updateSeconds }}>
      {children}
    </RestTimerContext.Provider>
  );
}

export const useRestTimer = () => useContext(RestTimerContext);
