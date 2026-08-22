// ─────────────────────────────────────────────────────────────────────────────
// CONTEXTE DE LA SÉANCE EN COURS, pour le coach.
//
// Le prompt du coach porte déjà le profil, les objectifs, les 20 dernières
// séries, l'historique de fatigue, les épisodes de douleur et ses propres notes.
// Il lui manquait le présent : ce que l'utilisateur est en train de faire au
// moment où il pose sa question. Quelqu'un qui écrit « je suis mort » après six
// exercices et quelqu'un qui l'écrit à l'échauffement ne décrivent pas la même
// chose.
//
// On lit le BROUILLON local (`session_draft_<id>`, écrit à chaque saisie par
// SessionLog) plutôt que la base : il est à jour à la seconde, il existe même
// hors ligne, et la séance n'est pas encore enregistrée de toute façon.
//
// Lu depuis CoachIA, pas passé en paramètre : ainsi le contexte est là quelle
// que soit la façon d'arriver au coach — bouton du formulaire douleur, onglet
// Coach, ou reprise de conversation.
// ─────────────────────────────────────────────────────────────────────────────

const RIR_LISIBLE = { RIR_3: 'RIR 3+', RIR_2: 'RIR 2', RIR_1: 'RIR 1', failure: 'échec' };
const EXEC_LISIBLE = { good: 'propre', degraded: 'dégradée', bad: 'mauvaise' };

/**
 * Bloc texte décrivant la séance en cours, ou '' s'il n'y en a pas.
 * Compact par choix : c'est du contexte de prompt, pas un rapport.
 */
export function contexteSeanceEnCours() {
  let brouillon;
  try {
    const id = localStorage.getItem('active_session_id');
    if (!id) return '';
    const brut = localStorage.getItem(`session_draft_${id}`);
    if (!brut) return '';
    brouillon = JSON.parse(brut);
  } catch { return ''; }

  const exercices = brouillon?.sessionExercises;
  if (!Array.isArray(exercices) || exercices.length === 0) return '';
  const logs = brouillon.logs || {};
  const enCours = brouillon.currentExIdx ?? 0;

  const lignes = [];
  const douleurs = [];

  exercices.forEach((ex, i) => {
    const series = [];
    for (let s = 0; s < (ex.sets || 6); s++) {
      const l = logs[`${i}-${s}`];
      if (!l || (!l.weight && !l.reps)) continue;
      const bouts = [];
      if (l.weight !== undefined && l.weight !== '') bouts.push(`${l.weight} kg`);
      if (l.reps) bouts.push(`${l.reps} reps`);
      if (l.mode && RIR_LISIBLE[l.mode]) bouts.push(RIR_LISIBLE[l.mode]);
      if (l.quality && EXEC_LISIBLE[l.quality] && l.quality !== 'good') bouts.push(`exécution ${EXEC_LISIBLE[l.quality]}`);
      series.push(bouts.join(' '));
      if (l.pain_note) douleurs.push(`${ex.name} série ${s + 1} : ${l.pain_note}`);
    }
    // On ne liste que ce qui a été FAIT : les exercices à venir n'apprennent
    // rien au coach, et allongent le prompt pour rien.
    if (series.length) {
      lignes.push(`  • ${ex.name}${i === enCours ? ' (en cours)' : ''} : ${series.join(' | ')}`);
    }
  });

  const faits = lignes.length;
  if (!faits && !douleurs.length) return ''; // séance ouverte mais rien de saisi

  // L'exercice en cours est NOMMÉ dans l'en-tête, pas seulement compté : quand
  // il n'a pas encore de série saisie — le cas le plus fréquent, on vient de
  // l'ouvrir — il n'apparaissait dans aucune ligne, et le coach ignorait sur
  // quoi la question portait.
  const nomEnCours = exercices[enCours]?.name;
  const entete = `SÉANCE EN COURS — exercice ${enCours + 1} sur ${exercices.length}`
    + `${nomEnCours ? ` (${nomEnCours})` : ''}, ${faits} déjà entamé(s) :`;
  const bloc = [entete, ...lignes];

  if (brouillon.fatigue) bloc.push(`  Fatigue déclarée pour cette séance : ${brouillon.fatigue}/5`);
  if (brouillon.notes) bloc.push(`  Note libre de la séance : ${brouillon.notes}`);
  if (douleurs.length) bloc.push(`  Douleurs signalées pendant la séance :\n${douleurs.map((d) => `    - ${d}`).join('\n')}`);

  return `\n\n${bloc.join('\n')}`;
}
