import React from 'react';
import { TrendingUp, TrendingDown, Pencil, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// ─────────────────────────────────────────────────────────────────────────────
// Carte de CONSTAT (ex-carte actionnable d'autorégulation).
//
// Avant : « On retire 2 séries sur tes derniers exercices cette semaine » + un
// bouton Appliquer qui le faisait vraiment, en base. Depuis le 2026-08-16, la
// carte rapporte les FAITS mesurés et laisse la décision à l'utilisateur.
//
// Un fait = { tk, n?, liste? } — `tk` est une clé du dictionnaire dont le texte
// peut contenir « {n} » (la valeur observée) ou « {liste} » (des noms d'exos).
// On garde la donnée à part du libellé pour qu'elle survive à la traduction.
//
// Props : proposal { direction, gravite, label, faits[], conseil },
//         onDone (« je l'ai fait »), onManual, onDismiss, busy
// ─────────────────────────────────────────────────────────────────────────────
export default function VolumeProposalCard({ proposal, onDone, onManual, onDismiss, busy }) {
  const { t } = useI18n();
  if (!proposal) return null;
  const isUp = proposal.direction === 'increase';
  const Icon = isUp ? TrendingUp : TrendingDown;

  const rendreFait = (f) => {
    let texte = t(f.tk);
    if (f.n !== undefined && f.n !== null) texte = texte.replace('{n}', String(f.n).replace('.', ','));
    if (f.liste?.length) texte = texte.replace('{liste}', f.liste.join(', '));
    return texte;
  };

  return (
    <div className="rounded-2xl p-4 border bg-white/15 backdrop-blur-sm border-white/20">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${isUp ? 'bg-green-500/15' : 'bg-chart-4/15'}`}>
          <Icon className={`w-5 h-5 ${isUp ? 'text-green-400' : 'text-chart-4'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">{proposal.label}</p>

          {/* Ce que l'app a MESURÉ — la partie sur laquelle elle ne peut pas se tromper */}
          {proposal.faits?.length > 0 && (
            <ul className="mt-2 space-y-1">
              {proposal.faits.map((f, i) => (
                <li key={f.tk + i} className="text-xs text-white/70 flex items-start gap-1.5 leading-snug">
                  <span className="text-white/35 mt-px">·</span>
                  <span>{rendreFait(f)}</span>
                </li>
              ))}
            </ul>
          )}

          {proposal.conseil && (
            <p className="text-xs font-semibold text-violet-200 mt-2 leading-snug">→ {proposal.conseil}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {/* « Je l'ai fait » n'applique RIEN : il date la décharge, ce qui remet à
            zéro le compteur « semaines sans allègement ». Sans ce signal, le
            compteur resterait bloqué et la carte réapparaîtrait indéfiniment. */}
        {proposal.gravite !== 'hausse' && (
          <button onClick={onDone} disabled={busy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white text-violet-700 hover:bg-white/90 transition-colors disabled:opacity-60">
            <Check className="w-3.5 h-3.5" /> {t('vp_done')}
          </button>
        )}
        <button onClick={onManual} disabled={busy}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-60">
          <Pencil className="w-3.5 h-3.5" /> {t('vp_open_program')}
        </button>
        <button onClick={onDismiss} disabled={busy}
          className="text-xs text-white/45 hover:text-white/70 px-2 py-2 transition-colors disabled:opacity-60">
          {t('ignore')}
        </button>
      </div>

      {/* Le « comment » ne se prescrit pas par exercice : il vit dans un guide. */}
      {proposal.gravite !== 'hausse' && (
        <a href="/alleger" className="inline-block text-[11px] text-violet-300 hover:text-violet-200 underline underline-offset-2 mt-2">
          {t('vp_how')}
        </a>
      )}
    </div>
  );
}
