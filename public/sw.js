const VAPID_PUBLIC_KEY = 'BDb9fTWerJpit946sN3TkHEaCx6aiYxN7xUEkIdCueUPzFsWGZGHTb3sSu8Atpdz-Rv0IOoEimFQSMUmRguyOWA';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

let timerTimeout = null;
let timerInterval = null;
let timerEndTime = null;

const fmt = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const showCountdownNotif = (endTime) => {
  const end = new Date(endTime);
  const h = end.getHours().toString().padStart(2, '0');
  const m = end.getMinutes().toString().padStart(2, '0');
  const s = end.getSeconds().toString().padStart(2, '0');
  self.registration.showNotification('Coach IA — Repos en cours', {
    body: `⏱ Se termine à ${h}:${m}:${s}`,
    icon: '/apple-touch-icon.png',
    badge: '/apple-touch-icon.png',
    tag: 'rest-timer',
    renotify: false,
    silent: true,
    actions: [{ action: 'skip', title: 'Passer' }],
  });
};

const showDoneNotif = () => {
  self.registration.showNotification('💪 C\'est parti !', {
    body: 'Temps de repos terminé — reprends la séance !',
    icon: '/apple-touch-icon.png',
    badge: '/apple-touch-icon.png',
    tag: 'rest-timer',
    renotify: true,
    silent: false,
    vibrate: [200, 100, 200, 100, 400],
    requireInteraction: true,
  });
};

// Gérer les messages depuis l'app
self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_REST_END') {
    const { endTime } = event.data;
    timerEndTime = endTime;
    if (timerTimeout) clearTimeout(timerTimeout);
    if (timerInterval) clearInterval(timerInterval);

    // Notification à la fin via setTimeout SW (Android)
    const delay = Math.max(0, endTime - Date.now());
    timerTimeout = setTimeout(() => { showDoneNotif(); }, delay);

    // Pour iOS : chaîner des appels serveur toutes les 55s jusqu'à la fin
    const scheduleChain = (remainingMs) => {
      if (remainingMs <= 0) return;
      const chunk = Math.min(remainingMs, 55000);
      self.registration.pushManager.getSubscription().then(sub => {
        if (!sub) return;
        fetch('/api/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub.toJSON(), delay: Math.ceil(chunk / 1000) }),
        }).then(() => {
          // Pas de chaîne si c'était le dernier chunk
        }).catch(() => {});
        if (remainingMs > 55000) {
          setTimeout(() => scheduleChain(remainingMs - 55000), chunk);
        }
      }).catch(() => {});
    };
    if (delay > 0) scheduleChain(delay);

  } else if (event.data.type === 'CANCEL_REST_TIMER') {
    if (timerTimeout) { clearTimeout(timerTimeout); timerTimeout = null; }
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    self.registration.getNotifications({ tag: 'rest-timer' }).then(n => n.forEach(n => n.close()));
  } else if (event.data.type === 'GET_SUBSCRIPTION') {
    self.registration.pushManager.getSubscription().then(sub => {
      event.source?.postMessage({ type: 'SUBSCRIPTION', subscription: sub ? sub.toJSON() : null });
    });
  } else if (event.data.type === 'SUBSCRIBE') {
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY,
    }).then(sub => {
      event.source?.postMessage({ type: 'SUBSCRIPTION', subscription: sub.toJSON() });
    }).catch(err => {
      event.source?.postMessage({ type: 'SUBSCRIPTION', subscription: null, error: err.message });
    });
  }
});

// Recevoir une notification push depuis le serveur
self.addEventListener('push', (event) => {
  let data = { title: 'Coach IA', body: 'Temps de repos terminé ! 💪' };
  try { data = JSON.parse(event.data?.text()); } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/apple-touch-icon.png',
      badge: '/apple-touch-icon.png',
      tag: 'rest-timer',
      renotify: true,
    })
  );
});

// Clic sur la notification ou action "Passer"
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  if (timerTimeout) { clearTimeout(timerTimeout); timerTimeout = null; }
  event.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    const s = list.find(c => c.url.includes('/session'));
    if (s) return s.focus();
    return clients.openWindow('/session');
  }));
});
