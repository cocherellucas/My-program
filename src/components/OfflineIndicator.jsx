import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WifiOff, Wifi, X } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { flushQueue } from '@/lib/sync-queue';

// Indicateur réseau GLOBAL (monté à la racine → visible sur toutes les pages).
// Hors-ligne : bandeau ambre (fermable) qui prévient que le réseau est requis.
// Retour du réseau : bref bandeau vert « de retour en ligne » (auto-disparition).
// Déclenche aussi la synchronisation de la file d'attente au retour du réseau.
export default function OfflineIndicator() {
  const { t } = useI18n();
  const online = useOnlineStatus();
  // Fermé manuellement : masqué jusqu'à la prochaine coupure.
  const [dismissed, setDismissed] = useState(false);
  // Bref bandeau vert au retour du réseau (uniquement si on était hors-ligne).
  const [reconnected, setReconnected] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) { wasOffline.current = true; setDismissed(false); return; }
    if (wasOffline.current) {
      wasOffline.current = false;
      setReconnected(true);
      const tmr = setTimeout(() => setReconnected(false), 2500);
      return () => clearTimeout(tmr);
    }
  }, [online]);

  useEffect(() => {
    let cancelled = false;
    flushQueue().then((n) => { if (!cancelled && n > 0) toast.success(t('sync_done')); });
    return () => { cancelled = true; };
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  const wrap = 'fixed left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2 py-2.5 rounded-2xl text-xs shadow-xl max-w-[calc(100vw-1.5rem)]';
  const pos = { bottom: 'calc(5.5rem + env(safe-area-inset-bottom))' };

  if (!online && !dismissed) {
    return createPortal(
      <div className={`${wrap} pl-4 pr-2 bg-amber-500 text-amber-950`} style={pos} role="status">
        <WifiOff className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-center leading-snug">
          <span className="block text-sm font-extrabold">{t('offline_banner_title')}</span>
          <span className="block text-[11px] font-medium">{t('offline_banner')}</span>
        </span>
        <button type="button" onClick={() => setDismissed(true)} aria-label="Fermer"
          className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-amber-950/60 hover:text-amber-950 hover:bg-amber-950/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>,
      document.body
    );
  }

  if (reconnected) {
    return createPortal(
      <div className={`${wrap} px-4 justify-center bg-emerald-500 text-emerald-950`} style={pos} role="status">
        <Wifi className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-extrabold">{t('online_banner_title')}</span>
      </div>,
      document.body
    );
  }

  return null;
}
