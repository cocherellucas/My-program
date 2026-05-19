import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Bloquer pinch-to-zoom uniquement
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });

// Forcer le mode portrait
if (screen?.orientation?.lock) {
  screen.orientation.lock('portrait').catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
