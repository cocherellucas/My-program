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

const showCountdownNotif = (left) => {
  self.registration.showNotification('Coach IA — Repos', {
    body: left > 0 ? `${fmt(left)} restantes` : 'Temps de repos terminé — reprends la séance ! 💪',
    icon: '/apple-touch-icon.png',
    badge: '/apple-touch-icon.png',
    tag: 'rest-timer',
    renotify: false,
    silent: left > 0,
    actions: left > 0 ? [{ action: 'skip', title: 'Passer' }] : [],
  });
};

// Gérer les messages depuis l'app
self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_REST_END') {
    const { endTime } = event.data;
    timerEndTime = endTime;
    if (timerTimeout) clearTimeout(timerTimeout);
    if (timerInterval) clearInterval(timerInterval);

    // Afficher immédiatement le countdown
    const leftNow = Math.ceil((endTime - Date.now()) / 1000);
    if (leftNow > 0) showCountdownNotif(leftNow);

    // Mettre à jour chaque seconde (Android garde le SW actif)
    timerInterval = setInterval(() => {
      const left = Math.ceil((timerEndTime - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        showCountdownNotif(0);
      } else {
        showCountdownNotif(left);
      }
    }, 1000);

    // Timeout de sécurité à la fin
    const delay = Math.max(0, endTime - Date.now());
    timerTimeout = setTimeout(() => {
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      showCountdownNotif(0);
    }, delay + 500);

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
