import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Panneau de debug temporaire — activé via ?debug dans l'URL.
// Affiche en direct les mesures liées au viewport / scroll / clavier
// pour diagnostiquer les bugs iOS qu'on ne peut pas inspecter depuis Windows.
export default function DebugViewport() {
  // ?debug active le panneau ET le mémorise (sinon perdu en navigant dans la SPA).
  // ?debug=off le désactive.
  const enabled = (() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.has('debug')) {
      if (params.get('debug') === 'off') { try { localStorage.removeItem('debug_viewport'); } catch {} return false; }
      try { localStorage.setItem('debug_viewport', '1'); } catch {}
      return true;
    }
    try { return localStorage.getItem('debug_viewport') === '1'; } catch { return false; }
  })();
  const [m, setM] = useState({});

  useEffect(() => {
    if (!enabled) return;
    const read = () => {
      const vv = window.visualViewport;
      const nav = document.querySelector('.mobile-nav');
      const navRect = nav?.getBoundingClientRect();
      const scroller = document.scrollingElement || document.documentElement;
      const active = document.activeElement;
      setM({
        offTop: vv ? Math.round(vv.offsetTop) : 0,
        innerH: window.innerHeight,
        innerW: window.innerWidth,
        vvH: vv ? Math.round(vv.height) : '—',
        vvW: vv ? Math.round(vv.width) : '—',
        vvTop: vv ? Math.round(vv.offsetTop) : '—',
        vvPageTop: vv ? Math.round(vv.pageTop) : '—',
        docScrollY: Math.round(scroller?.scrollTop || 0),
        winScrollY: Math.round(window.scrollY || 0),
        navTop: navRect ? Math.round(navRect.top) : '—',
        navBottom: navRect ? Math.round(navRect.bottom) : '—',
        navH: navRect ? Math.round(navRect.height) : '—',
        active: active ? `${active.tagName}${active.type ? '['+active.type+']' : ''}` : '—',
        safeBottom: getComputedStyle(document.documentElement).getPropertyValue('--sab') || 'n/a',
      });
    };
    read();
    const vv = window.visualViewport;
    const evts = ['resize', 'scroll'];
    window.addEventListener('resize', read);
    window.addEventListener('scroll', read, true);
    vv?.addEventListener('resize', read);
    vv?.addEventListener('scroll', read);
    const id = setInterval(read, 250);
    return () => {
      window.removeEventListener('resize', read);
      window.removeEventListener('scroll', read, true);
      vv?.removeEventListener('resize', read);
      vv?.removeEventListener('scroll', read);
      clearInterval(id);
    };
  }, [enabled]);

  if (!enabled) return null;

  return createPortal(
    <div style={{
      // Suit le viewport visible : top = offsetTop du visualViewport → toujours
      // visible en haut de la zone affichée même quand le document scrolle.
      position: 'fixed', top: (m.offTop || 0) + 4, left: 4, zIndex: 99999,
      background: 'rgba(0,0,0,0.9)', color: '#0f0', font: '11px/1.4 monospace',
      padding: '6px 8px', pointerEvents: 'none', maxWidth: '70vw', borderRadius: 8,
    }}>
      <div>innerH: {m.innerH} · innerW: {m.innerW}</div>
      <div>vvH: {m.vvH} · vvW: {m.vvW}</div>
      <div>vvTop: {m.vvTop} · vvPageTop: {m.vvPageTop}</div>
      <div>docScroll: {m.docScrollY} · winScroll: {m.winScrollY}</div>
      <div style={{ color: '#ff0' }}>navTop: {m.navTop} · navBot: {m.navBottom} · navH: {m.navH}</div>
      <div>active: {m.active}</div>
      <div style={{ color: '#0ff' }}>innerH−navBot = {typeof m.innerH === 'number' && typeof m.navBottom === 'number' ? m.innerH - m.navBottom : '—'}</div>
    </div>,
    document.body
  );
}
