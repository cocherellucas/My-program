const VAPID_PUBLIC_KEY = 'BDb9fTWerJpit946sN3TkHEaCx6aiYxN7xUEkIdCueUPzFsWGZGHTb3sSu8Atpdz-Rv0IOoEimFQSMUmRguyOWA';

let timerTimeout = null;

// Gérer les messages depuis l'app
self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_REST_END') {
    const { endTime } = event.data;
    if (timerTimeout) clearTimeout(timerTimeout);
    const delay = Math.max(0, endTime - Date.now());
    timerTimeout = setTimeout(() => {
      self.registration.showNotification('Coach IA', {
        body: 'Temps de repos terminé — reprends la séance ! 💪',
        icon: '/apple-touch-icon.png',
        badge: '/apple-touch-icon.png',
        tag: 'rest-timer',
        renotify: true,
      });
    }, delay);
  } else if (event.data.type === 'CANCEL_REST_TIMER') {
    if (timerTimeout) { clearTimeout(timerTimeout); timerTimeout = null; }
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

// Clic sur la notification → ouvrir la séance
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    const s = list.find(c => c.url.includes('/session'));
    if (s) return s.focus();
    return clients.openWindow('/session');
  }));
});
