import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { flushQueue } from '@/lib/sync-queue';

// Indicateur hors-ligne GLOBAL (monté à la racine → visible sur toutes les pages :
// onboarding, séance, réglages…). Prévient que le réseau est nécessaire et
// déclenche la synchronisation de la file d'attente au démarrage / au retour du réseau.
export default function OfflineIndicator() {
  const { t } = useI18n();
  const online = useOnlineStatus();

  useEffect(() => {
    let cancelled = false;
    flushQueue().then((n) => { if (!cancelled && n > 0) toast.success(t('sync_done')); });
    return () => { cancelled = true; };
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  if (online) return null;
  return createPortal(
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 text-amber-950 text-xs font-bold shadow-xl max-w-[calc(100vw-1.5rem)]"
      style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
      role="status">
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <span className="leading-snug">{t('offline_banner')}</span>
    </div>,
    document.body
  );
}
