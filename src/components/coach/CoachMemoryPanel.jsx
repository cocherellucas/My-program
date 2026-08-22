import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useI18n } from '@/lib/i18n';
import { lireNotes, ecrireNotes, estNotePerso, SEUIL_ALERTE, LIMITE_ENTREES } from '@/lib/coach-memory';
import { ensureOnline } from '@/lib/net';

// Anneau de remplissage. Vert tant qu'il reste de la place, ambre au seuil
// d'alerte, rouge une fois plein. Le rouge n'est pas décoratif : plus rien ne
// s'enregistre à partir de là, rien n'étant supprimé automatiquement.
export function AnneauMemoire({ taux, taille = 22, epaisseur = 2.5 }) {
  const r = (taille - epaisseur) / 2;
  const circonference = 2 * Math.PI * r;
  const couleur = taux >= 1 ? '#f87171' : taux >= SEUIL_ALERTE ? '#fbbf24' : '#4ade80';
  return (
    <svg width={taille} height={taille} viewBox={`0 0 ${taille} ${taille}`} className="flex-shrink-0">
      <circle cx={taille / 2} cy={taille / 2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={epaisseur} />
      <circle
        cx={taille / 2} cy={taille / 2} r={r} fill="none"
        stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round"
        strokeDasharray={circonference}
        strokeDashoffset={circonference * (1 - Math.min(1, taux))}
        transform={`rotate(-90 ${taille / 2} ${taille / 2})`}
      />
    </svg>
  );
}

// Panneau « ce que le coach a retenu de toi ». L'utilisateur lit et supprime :
// c'est sa donnée, et une mémoire qu'on ne peut pas corriger finit par se
// tromper sur quelqu'un sans recours.
export default function CoachMemoryPanel({ notes, memoryId, onClose, onChange }) {
  const { t } = useI18n();
  const [entrees, setEntrees] = useState(() => lireNotes(notes));
  const [busy, setBusy] = useState(false);

  const enregistrer = async (suivantes) => {
    if (!memoryId) { setEntrees(suivantes); onChange?.(ecrireNotes(suivantes)); return; }
    if (!ensureOnline()) return;
    setBusy(true);
    const brut = ecrireNotes(suivantes);
    try {
      await base44.entities.UserMemory.update(memoryId, { coach_notes: brut });
      setEntrees(suivantes);
      onChange?.(brut);
    } catch (e) { console.error('[memoire] enregistrement', e); }
    setBusy(false);
  };

  const supprimer = (i) => enregistrer(entrees.filter((_, k) => k !== i));
  const taux = Math.min(1, entrees.length / LIMITE_ENTREES);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md max-h-[80vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)' }}>

        <div className="px-5 pt-5 pb-3 border-b border-white/10 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base">{t('cm_title')}</p>
            <p className="text-xs text-white/50 mt-0.5 leading-snug">{t('cm_sub')}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-2.5 flex items-center gap-2.5 border-b border-white/10">
          <AnneauMemoire taux={taux} />
          <p className="text-xs text-white/60">
            <span className="font-semibold text-white/85">{entrees.length} / {LIMITE_ENTREES}</span> {t('cm_count')}
          </p>
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin text-white/40 ml-auto" />}
        </div>

        {/* Plein = plus RIEN ne s'enregistre. Il faut le dire ici aussi : le
            coach continue de conseiller normalement, mais il n'apprend plus.
            L'avertissement ambre arrive avant, pour qu'on trie sans être coincé. */}
        {entrees.length >= LIMITE_ENTREES ? (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-red-500/15 border border-red-400/40">
            <p className="text-xs text-red-100 leading-relaxed">{t('cm_full')}</p>
          </div>
        ) : entrees.length >= LIMITE_ENTREES * SEUIL_ALERTE ? (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-amber-400/10 border border-amber-400/30">
            <p className="text-xs text-amber-200 leading-relaxed">{t('cm_almost_full')}</p>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {entrees.length === 0 ? (
            <p className="text-sm text-white/50 text-center py-8 leading-relaxed">{t('cm_empty')}</p>
          ) : (
            // Les plus récentes en haut : c'est ce qui pèse le plus sur les conseils.
            [...entrees].reverse().map((e, iInverse) => {
              const i = entrees.length - 1 - iInverse;
              return (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.07] border border-white/10">
                  <div className="flex-1 min-w-0">
                    {/* `perso` est un marqueur technique : on l'affiche traduit. */}
                    {e.date && <p className={`text-[10px] font-medium mb-0.5 ${estNotePerso(e) ? 'text-violet-300' : 'text-white/40'}`}>{e.date}{e.source ? ` · ${estNotePerso(e) ? t('cm_source_you') : e.source}` : ''}</p>}
                    <p className="text-xs text-white/80 leading-snug whitespace-pre-wrap break-words">{e.texte}</p>
                  </div>
                  <button
                    onClick={() => supprimer(i)}
                    disabled={busy}
                    aria-label={t('cm_delete')}
                    className="text-red-300/60 hover:text-red-300 transition-colors flex-shrink-0 disabled:opacity-40">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/10" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}>
          <p className="text-[11px] text-white/40 leading-snug">{t('cm_foot')}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
