import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import '@/lib/dev-time' // outil de test : window.__time (voyage dans le temps, non destructif)

// Désactiver la restauration de scroll native du navigateur (géré manuellement pour Séance et Coach)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Enregistrer le service worker pour les notifications de fin de repos
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Bloquer pinch-to-zoom uniquement
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });

// Forcer le mode portrait - overlay JS
const portraitOverlay = document.getElementById('portrait-only');
const checkOrientation = () => {
  if (!portraitOverlay) return;
  const isLandscape = window.innerWidth > window.innerHeight;
  portraitOverlay.style.display = isLandscape ? 'flex' : 'none';
};
checkOrientation();
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
if (screen?.orientation?.lock) {
  screen.orientation.lock('portrait').catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
