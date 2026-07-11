const VAPID_PUBLIC_KEY = 'BDb9fTWerJpit946sN3TkHEaCx6aiYxN7xUEkIdCueUPzFsWGZGHTb3sSu8Atpdz-Rv0IOoEimFQSMUmRguyOWA';

// ── Page de secours hors-ligne ────────────────────────────────────────────────
// L'app (version web/navigateur) ne peut pas se charger sans réseau. Plutôt que
// la page d'erreur du navigateur, on sert une page « Connexion requise » claire.
// Réseau d'abord pour les navigations → jamais de contenu périmé quand on est en
// ligne. (Cette page de secours n'a de sens que tant que ce n'est pas une app
// native/installée : une fois empaquetée pour les stores, le code est embarqué.)
const OFFLINE_CACHE = 'coach-ia-offline-v2';
const OFFLINE_ASSETS = ['/offline.html', '/robotapp.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(OFFLINE_CACHE)
      .then((c) => c.addAll(OFFLINE_ASSETS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== OFFLINE_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Navigations (chargement de l'app) : réseau d'abord, repli page hors-ligne.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/offline.html')));
    return;
  }
  // Image du robot utilisée par la page hors-ligne : cache d'abord (sinon absente hors-ligne).
  if (req.url.includes('/robotapp.png')) {
    event.respondWith(caches.match(req).then((c) => c || fetch(req)));
    return;
  }
  // Tout le reste : comportement normal du navigateur (pas d'interception).
});

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
    icon: '/iconapp.png',
    badge: '/iconapp.png',
    tag: 'rest-timer',
    renotify: false,
    silent: true,
    actions: [{ action: 'skip', title: 'Passer' }],
  });
};

const showDoneNotif = () => {
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    const appVisible = clientList.some(c => c.visibilityState === 'visible');
    if (appVisible) return; // app ouverte au premier plan — pas de notif
    self.registration.showNotification('💪 C\'est parti !', {
      body: 'Temps de repos terminé — reprends la séance !',
      icon: '/iconapp.png',
      badge: '/iconapp.png',
      tag: 'rest-timer',
      renotify: true,
      silent: false,
      vibrate: [200, 100, 200, 100, 400],
      requireInteraction: true,
    });
  });
};

// Gérer les messages depuis l'app
self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_REST_END') {
    const { endTime } = event.data;
    timerEndTime = endTime;
    if (timerTimeout) clearTimeout(timerTimeout);
    if (timerInterval) clearInterval(timerInterval);

    // Notification à la fin via setTimeout SW
    const delay = Math.max(0, endTime - Date.now());
    timerTimeout = setTimeout(() => { showDoneNotif(); }, delay);

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
      icon: '/iconapp.png',
      badge: '/iconapp.png',
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
