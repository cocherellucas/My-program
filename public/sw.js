let timerTimeout = null;

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
        silent: false,
      });
    }, delay);
  } else if (event.data.type === 'CANCEL_REST_TIMER') {
    if (timerTimeout) { clearTimeout(timerTimeout); timerTimeout = null; }
    self.registration.getNotifications({ tag: 'rest-timer' }).then(notifs => notifs.forEach(n => n.close()));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    const sessionClient = list.find(c => c.url.includes('/session'));
    if (sessionClient) return sessionClient.focus();
    return clients.openWindow('/session');
  }));
});
