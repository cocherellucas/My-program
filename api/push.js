import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:cocherellucas@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subscription, delay = 0 } = req.body;
  if (!subscription) return res.status(400).json({ error: 'Missing subscription' });

  // Attendre le délai (max 55s pour rester dans la limite Vercel)
  const waitMs = Math.min(Math.max(0, delay * 1000), 55000);
  if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: '💪 C\'est parti !',
        body: 'Temps de repos terminé — reprends la séance !',
        icon: '/apple-touch-icon.png',
        vibrate: [200, 100, 200, 100, 400],
        requireInteraction: true,
      }),
      { urgency: 'high' }
    );
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
