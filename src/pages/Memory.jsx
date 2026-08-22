import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, TrendingUp, Trash2, MessageSquare, Plus, ChevronLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ensureOnline } from '@/lib/net';
import { lireNotes, ecrireNotes, ajouterNote, memoirePleine, memoireBientotPleine, estNotePerso, SOURCE_PERSO, LIMITE_ENTREES } from '@/lib/coach-memory';
import { AnneauMemoire } from '@/components/coach/CoachMemoryPanel';
import { historiqueFatigue } from '@/lib/fatigue-history';

export default function Memory() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [notesBrutes, setNotesBrutes] = useState('');
  const notesEntrees = lireNotes(notesBrutes);
  const tauxNotes = Math.min(1, notesEntrees.length / LIMITE_ENTREES);
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: memories = [] } = useQuery({
    queryKey: ['memory'],
    queryFn: () => base44.entities.UserMemory.filter({ user_id: user.id }),
    enabled: !!user,
  });

  const memory = memories[0];

  // Les notes vivent dans un état local pour que la suppression soit immédiate,
  // resynchronisé dès que la requête rend un contenu différent.
  useEffect(() => { setNotesBrutes(memory?.coach_notes || ''); }, [memory?.coach_notes]);

  // Historique de fatigue : calculé depuis les séances terminées (le champ
  // `fatigue_alerts` n'a jamais été alimenté — voir fatigue-history.js).
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.Session.filter({ status: 'completed' }),
    enabled: !!user,
  });
  const fatigue = historiqueFatigue(sessions);

  const [nouvelleNote, setNouvelleNote] = useState('');

  // Note écrite par l'utilisateur. Datée et marquée comme venant de lui, pour
  // qu'on distingue « il l'a dit » de « l'app l'a observé ».
  const addNote = async () => {
    const texte = nouvelleNote.trim();
    if (!texte || !memory) return;
    if (!ensureOnline()) return;
    const jour = new Date().toISOString().split('T')[0];
    // Marqueur `perso` non traduit : il sert de test dans le code (affichage,
    // distinction avec les observations), donc il doit rester stable en FR/EN.
    const brut = ajouterNote(notesBrutes, `[${jour} — ${SOURCE_PERSO}] ${texte}`);
    setNotesBrutes(brut);
    setNouvelleNote('');
    try {
      await base44.entities.UserMemory.update(memory.id, { coach_notes: brut });
      queryClient.invalidateQueries({ queryKey: ['memory'] });
    } catch (e) { console.error('[memoire] ajout note', e); }
  };

  const removeNote = async (index) => {
    if (!memory) return;
    if (!ensureOnline()) return;
    const suivantes = lireNotes(notesBrutes).filter((_, i) => i !== index);
    const brut = ecrireNotes(suivantes);
    setNotesBrutes(brut);
    try {
      await base44.entities.UserMemory.update(memory.id, { coach_notes: brut });
      queryClient.invalidateQueries({ queryKey: ['memory'] });
    } catch (e) { console.error('[memoire] suppression note', e); }
  };

  // (`removePreference` retiré avec la carte « Préférences d'exercices » :
  //  le champ qu'elle éditait n'a jamais été rempli par personne.)

  const removeInjury = async (index) => {
    if (!memory) return;
    if (!ensureOnline()) return;
    const updated = [...(memory.injuries || [])];
    updated.splice(index, 1);
    try {
      await base44.entities.UserMemory.update(memory.id, { injuries: updated });
      queryClient.invalidateQueries({ queryKey: ['memory'] });
    } catch (e) { console.error('[memory] removeInjury', e); }
  };

  // Tout supprimer : vide l'intégralité de la mémoire du coach (avec confirmation).
  // Supprime aussi les épisodes de suivi douleur (injuries) → le suivi s'arrête.
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [wiping, setWiping] = useState(false);
  const wipeMemory = async () => {
    if (!memory) { setConfirmWipe(false); return; }
    if (!ensureOnline()) return;
    setWiping(true);
    try {
      // On ne remet à zéro QUE ce que l'app écrit réellement. Les six autres
      // colonnes (exercise_preferences, structure_preferences, objective_history,
      // fatigue_alerts, past_adaptations, ai_reviews) n'ont jamais été
      // alimentées : les mentionner ici, c'est risquer un 400 si l'une d'elles
      // n'existe pas en base — et faire échouer la suppression entière.
      await base44.entities.UserMemory.update(memory.id, {
        injuries: [],
        coach_notes: '',
      });
      queryClient.invalidateQueries({ queryKey: ['memory'] });
    } catch (e) { console.error('[memory] wipe', e); }
    setWiping(false);
    setConfirmWipe(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Bouton retour : cette page s'ouvre depuis les Paramètres et depuis la
          barre latérale, mais elle n'est pas dans la navigation du bas — sans
          lui, on y était piégé. Même motif que TechniquesGuide et AllegerGuide. */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label={t('se_back')}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold flex items-center gap-2 text-white">
            <Brain className="w-7 h-7 text-white flex-shrink-0" />
            {t('mem_title')}
          </h1>
          <p className="text-white/70 text-sm mt-0.5 leading-snug">{t('mem_sub')}</p>
        </div>
      </div>

      {/* Ce que TU veux qu'il retienne.
          Remplace l'ancienne carte « Préférences d'exercices », qui lisait un
          champ (`exercise_preferences`) que rien n'a jamais rempli — les vraies
          préférences d'exercices vivent sur l'utilisateur, et se gèrent dans le
          Profil. Ici, du texte libre : « je n'aime pas les tractions », « je
          m'entraîne mieux le matin » — des choses qu'aucun formulaire ne
          prévoit. Ça atterrit dans la même mémoire, avec le même plafond. */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-2 flex items-center gap-2 text-white">
          <Plus className="w-5 h-5 text-white/80" />
          {t('cm_add')}
        </h3>
        <p className="text-xs text-white/50 mb-3 leading-snug">{t('cm_add_hint')}</p>
        {/* Plafond atteint : RIEN n'est supprimé automatiquement, ni tes notes
            ni les observations de l'app — une gêne d'il y a trois mois peut être
            l'information qui explique la douleur d'aujourd'hui. C'est donc à
            l'utilisateur de trier. */}
        {memoirePleine(notesBrutes) ? (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-400/40">
            <p className="text-xs text-red-100 leading-relaxed">{t('cm_full')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Prévenir AVANT le mur : découvrir que c'est bloqué au moment où
                on veut écrire est le pire moment pour l'apprendre. */}
            {memoireBientotPleine(notesBrutes) && (
              <p className="text-xs text-amber-200 bg-amber-400/10 border border-amber-400/30 rounded-lg px-3 py-2 leading-snug">
                {t('cm_almost_full')}
              </p>
            )}
            <div className="flex gap-2">
            <input
              type="text"
              value={nouvelleNote}
              onChange={(e) => setNouvelleNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addNote(); }}
              placeholder={t('cm_add_ph')}
              maxLength={200}
              className="flex-1 min-w-0 text-sm bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50"
            />
              <Button
                onClick={addNote}
                disabled={!nouvelleNote.trim()}
                className="bg-white text-violet-700 hover:bg-white/90 font-semibold disabled:opacity-40">
                {t('cm_add_btn')}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Injuries */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <AlertTriangle className="w-5 h-5 text-white/80" />
          {t('mem_injuries')}
        </h3>
        {memory?.injuries?.length > 0 ? (
          <div className="space-y-2">
            {memory.injuries.map((inj, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div>
                  <span className="font-medium text-sm text-white capitalize">{inj.zone ? t(`zl_${inj.zone}`) : inj.zone}</span>
                  {inj.trigger_exercise && <span className="text-xs text-white/60 ml-2">({inj.trigger_exercise})</span>}
                  <Badge variant={inj.resolved ? 'secondary' : 'destructive'} className="ml-2 text-xs">
                    {inj.resolved ? t('mem_resolved') : inj.status === 'stop_advised' ? t('mem_paused') : t('mem_active')}
                  </Badge>
                  {inj.level > 0 && <span className="text-xs text-white/50 ml-2">{t('mem_step')} {inj.level}</span>}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20" onClick={() => removeInjury(i)}>
                  <Trash2 className="w-3.5 h-3.5 text-red-300" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">{t('mem_injuries_none')}</p>
        )}
      </Card>

      {/* Fatigue alerts */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5 text-white/80" />
          {t('mem_fatigue')}
        </h3>
        {/* Calculé depuis les séances, plus lu depuis `fatigue_alerts` : ce
            champ n'a jamais été rempli, donc cette carte affichait « Pas de
            données » à vie alors que la donnée existait. */}
        {fatigue.length > 0 ? (
          <div className="space-y-2">
            {fatigue.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-xl text-sm text-white">
                <span>{t('mem_week')} {alert.week}</span>
                {/* Le badge « outline » par défaut sort en noir : illisible sur
                    le violet, contrairement au reste de la carte. */}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-white whitespace-nowrap">
                  {t('stat_fatigue')} {alert.average_fatigue}
                  <span className="text-white/50 font-normal"> · {alert.count} {alert.count > 1 ? t('sessions_word') : t('session_word')}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">{t('mem_nodata')}</p>
        )}
      </Card>

      {/* Notes du coach — ce que TU as signalé, mot pour mot.
          `coach_notes` était le seul champ réellement rempli, et le seul que cet
          écran ne montrait pas. La section « Bilans IA » qui vivait ici a été
          retirée le 2026-08-22 : rien ne les générait (`ai_reviews` n'était
          jamais écrit) et il a été décidé de ne pas les construire — le coach en
          rédige un à la demande, dans le chat. */}
      <Card className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-white/80" />
          <h3 className="font-heading font-bold text-lg text-white flex-1">{t('cm_title')}</h3>
          <AnneauMemoire taux={tauxNotes} />
          <span className="text-xs text-white/60">{notesEntrees.length} / {LIMITE_ENTREES}</span>
        </div>
        {notesEntrees.length > 0 ? (
          <div className="space-y-2">
            {[...notesEntrees].reverse().map((e, iInv) => {
              const i = notesEntrees.length - 1 - iInv;
              return (
                <div key={i} className="flex items-start gap-2 p-3 bg-white/10 rounded-xl">
                  <div className="flex-1 min-w-0">
                    {/* `perso` est un marqueur technique : on l'affiche traduit. */}
                    {e.date && <p className={`text-[10px] font-medium mb-0.5 ${estNotePerso(e) ? 'text-violet-300' : 'text-white/40'}`}>{e.date}{e.source ? ` · ${estNotePerso(e) ? t('cm_source_you') : e.source}` : ''}</p>}
                    <p className="text-xs text-white/80 leading-snug whitespace-pre-wrap break-words">{e.texte}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20 flex-shrink-0" onClick={() => removeNote(i)}>
                    <Trash2 className="w-3.5 h-3.5 text-red-300" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-white/60">{t('cm_empty')}</p>
        )}
      </Card>

      {!memory && (
        <Card className="p-12 text-center bg-white/15 backdrop-blur-sm border-white/20">
          <Brain className="w-12 h-12 mx-auto text-white/30 mb-4" />
          <p className="text-white/70">{t('mem_building')}</p>
        </Card>
      )}

      {/* Tout supprimer */}
      {memory && (
        <button onClick={() => setConfirmWipe(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-red-500/15 text-red-300 border border-red-400/30 hover:bg-red-500/25 transition-colors">
          <Trash2 className="w-4 h-4" /> {t('mem_wipe')}
        </button>
      )}

      {/* Confirmation — modal centrée avec fond flouté (même pattern que le reste de l'app) */}
      {confirmWipe && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => !wiping && setConfirmWipe(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-violet-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base">{t('mem_wipe_title')}</p>
              <p className="text-sm text-white/60 mt-1">{t('mem_wipe_body')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmWipe(false)} disabled={wiping}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-60">
                {t('cancel')}
              </button>
              <button onClick={wipeMemory} disabled={wiping}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60">
                {wiping ? t('mem_wiping') : t('mem_wipe')}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}