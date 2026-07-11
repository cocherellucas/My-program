import { useEffect, useState } from 'react';

// État de connexion réseau (navigator.onLine + événements online/offline).
// navigator.onLine n'est pas infaillible (il dit surtout « interface réseau
// active »), mais il suffit pour prévenir l'utilisateur et déclencher la synchro.
export function useOnlineStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine !== false
  );
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  return online;
}
