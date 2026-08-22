// ─────────────────────────────────────────────────────────────────────────────
// HISTORIQUE DE FATIGUE PAR SEMAINE
//
// `UserMemory.fatigue_alerts` était lu à deux endroits — l'écran « Mémoire IA »
// et le prompt du coach — mais n'était JAMAIS écrit : initialisé à [] à
// l'inscription, remis à [] par « Tout supprimer », et rien entre les deux.
// L'écran affichait donc « Pas de données » à vie, et le coach recevait
// « Historique fatigue : aucun » alors que la donnée existait depuis toujours,
// dans `global_fatigue` de chaque séance terminée.
//
// On la CALCULE au lieu de la stocker : c'est une agrégation de séances, pas
// une information à part. Rien à écrire, rien à synchroniser, rien qui puisse
// diverger de la réalité.
// ─────────────────────────────────────────────────────────────────────────────

// Numéro de semaine ISO 8601 (celui que tout le monde appelle « semaine 34 »).
export function numeroSemaine(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Jeudi de la semaine en cours : l'année ISO est celle qui contient ce jeudi.
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const debut = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - debut) / 86400000 + 1) / 7);
}

/**
 * Séances → [{ week, average_fatigue, count }], de la plus ANCIENNE à la plus
 * récente. Même forme que l'ancien champ `fatigue_alerts`, pour que ses deux
 * lecteurs marchent sans changement.
 * @param {number} maxSemaines  nombre de semaines gardées (les plus récentes)
 */
export function historiqueFatigue(sessions = [], maxSemaines = 8) {
  const parSemaine = new Map();

  for (const s of sessions) {
    if (s?.status !== 'completed') continue;
    const fatigue = Number(s.global_fatigue);
    // 0 n'est pas une valeur de l'échelle (1 à 5) : c'est « non renseigné ».
    if (!fatigue || fatigue < 1 || fatigue > 5) continue;
    const brut = s.actual_date || s.planned_date;
    if (!brut) continue;
    const d = new Date(brut);
    if (Number.isNaN(d.getTime())) continue;

    const cle = `${d.getFullYear()}-${String(numeroSemaine(d)).padStart(2, '0')}`;
    if (!parSemaine.has(cle)) parSemaine.set(cle, { week: numeroSemaine(d), total: 0, count: 0 });
    const e = parSemaine.get(cle);
    e.total += fatigue;
    e.count += 1;
  }

  return [...parSemaine.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-maxSemaines)
    .map(([, e]) => ({
      week: e.week,
      average_fatigue: Math.round((e.total / e.count) * 10) / 10,
      count: e.count,
    }));
}
