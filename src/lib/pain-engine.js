// ─────────────────────────────────────────────────────────────────────────────
// SUIVI DE DOULEUR — épisodes par zone sensible.
// Une gêne signalée ouvre un "épisode" ; le coach demande la réaction (~24 h
// plus tard) et prescrit des réductions progressives (charge → séries →
// fréquence) tant que ça ne va pas mieux, puis la remontée quand ça va mieux.
// 100 % règles de code — aucune IA (compatible AI_BLOCKED).
// Épisodes stockés dans UserMemory.injuries (JSON, synchronisé entre appareils).
// ─────────────────────────────────────────────────────────────────────────────
import { base44 } from '@/api/base44Client';
import { FRAGILE_ZONE_MUSCLES } from '@/lib/coaching-engine';

export const ZONE_LABELS = {
  wrists: 'poignet', shoulders: 'épaule', elbows: 'coude',
  knees: 'genou', lower_back: 'bas du dos', neck: 'nuque',
};
// Avec possessif, pour les phrases (« Comment a réagi ton poignet ? »)
export const ZONE_ART = {
  wrists: 'ton poignet', shoulders: 'ton épaule', elbows: 'ton coude',
  knees: 'ton genou', lower_back: 'ton bas du dos', neck: 'ta nuque',
};

// Détecte une zone dans un texte libre (notes de séance, note de douleur)
export function detectZoneFromText(text) {
  const t = (text || '').toLowerCase();
  if (/poignet/.test(t)) return 'wrists';
  if (/épaule|epaule/.test(t)) return 'shoulders';
  if (/coude/.test(t)) return 'elbows';
  if (/genou/.test(t)) return 'knees';
  if (/lombaire|bas du dos|\bdos\b/.test(t)) return 'lower_back';
  if (/cervical|nuque|\bcou\b/.test(t)) return 'neck';
  return null;
}

const todayStr = () => new Date().toISOString().split('T')[0];

// ─── IO : épisodes dans UserMemory.injuries ───
async function getMemory(userId) {
  const rows = await base44.entities.UserMemory.filter({ user_id: userId });
  return rows[0] || null;
}

export async function loadEpisodes(userId) {
  if (!userId) return [];
  try {
    const mem = await getMemory(userId);
    const raw = mem?.injuries;
    const arr = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export async function saveEpisodes(userId, episodes) {
  if (!userId) return;
  try {
    // `resolved` maintenu pour la page Mémoire (badge Actif/Résolu) qui affiche
    // aussi les entrées historiques {zone, trigger_exercise, resolved} de l'IA.
    const rows = (episodes || []).map(e => (e.status ? { ...e, resolved: e.status === 'resolved' } : e));
    const mem = await getMemory(userId);
    if (mem) await base44.entities.UserMemory.update(mem.id, { injuries: rows });
    else await base44.entities.UserMemory.create({ user_id: userId, injuries: rows });
  } catch (e) { console.error('[pain] saveEpisodes', e); }
}

const freshEpisode = (zone) => ({
  zone, status: 'active', level: 0, started: todayStr(),
  lastCheckDate: '', betterStreak: 0, baseline: {}, removed: [], history: [],
});

// Ouvre (ou rouvre) un épisode pour une zone. Retourne le tableau mis à jour.
// Un épisode déjà actif ou en pause (stop_advised) n'est pas modifié.
export function upsertEpisode(episodes, zone) {
  const list = [...(episodes || [])];
  const idx = list.findIndex(e => e.zone === zone);
  if (idx >= 0) {
    if (list[idx].status === 'resolved') list[idx] = freshEpisode(zone);
    return list;
  }
  list.push(freshEpisode(zone));
  return list;
}

// Épisodes actifs à checker aujourd'hui : la réaction se juge à J+1 (pas le jour
// même de la gêne) et jamais plus d'une question par jour et par zone.
export function episodesToCheck(episodes) {
  const today = todayStr();
  return (episodes || []).filter(e =>
    e.status === 'active' && e.started < today && (e.lastCheckDate || '') < today
  );
}

// La séance contient-elle des exercices qui sollicitent la zone ?
export function sessionTouchesZone(session, zone) {
  const muscles = new Set(FRAGILE_ZONE_MUSCLES[zone] || []);
  return (session?.exercises || []).some(ex => muscles.has(ex.muscle_group));
}

// Échelle de réduction — descriptions affichées à l'utilisateur
const LEVEL_DETAILS = {
  1: 'Charge −20 % sur les exercices qui sollicitent la zone (7 prochains jours). Poids du corps : prends la variante plus simple.',
  2: 'Charge −20 % et −1 série sur les exercices qui sollicitent la zone (7 prochains jours).',
  3: 'Charge −20 %, −1 série, et ces exercices sont retirés d\'une séance sur deux (7 prochains jours).',
};

// Réaction du corps → épisode mis à jour (check/historique/statut) + proposition.
// Le NIVEAU ne change qu'au moment d'Appliquer (via applyPainLevel), jamais ici.
// reaction : 'better' | 'same' | 'worse' | 'sharp'
export function computePainPrescription(episode, reaction) {
  const art = ZONE_ART[episode.zone] || episode.zone;
  const today = todayStr();
  const level = episode.level || 0;
  const ep = {
    ...episode,
    lastCheckDate: today,
    history: [...(episode.history || []), { date: today, reaction }],
  };

  // ⚡ Douleur vive → garde-fou : stop + avis médical, proposition de retrait 7 jours
  if (reaction === 'sharp') {
    ep.status = 'stop_advised';
    ep.betterStreak = 0;
    return {
      episode: ep,
      proposal: {
        direction: 'stop',
        label: `Douleur vive : on met ${art} au repos`,
        detail: 'Repos de la zone et avis médical conseillé. Je peux retirer les exercices qui la sollicitent des 7 prochains jours.',
        apply: { zone: episode.zone, toLevel: 4 },
      },
    };
  }

  if (reaction === 'worse') {
    ep.betterStreak = 0;
    // 3 « pire » d'affilée malgré les réductions → même garde-fou que douleur vive
    const last3 = ep.history.slice(-3);
    if (last3.length === 3 && last3.every(h => h.reaction === 'worse')) {
      ep.status = 'stop_advised';
      return {
        episode: ep,
        proposal: {
          direction: 'stop',
          label: `${art.charAt(0).toUpperCase() + art.slice(1)} empire malgré les réductions`,
          detail: 'Repos de la zone et avis médical conseillé. Je peux retirer les exercices qui la sollicitent des 7 prochains jours.',
          apply: { zone: episode.zone, toLevel: 4 },
        },
      };
    }
    if (level >= 3) {
      return {
        episode: ep,
        proposal: {
          direction: 'none',
          label: 'On est déjà au maximum de réduction',
          detail: 'Si ça continue d\'empirer d\'ici la prochaine fois, on mettra la zone au repos complet — et pense à consulter.',
          apply: null,
        },
      };
    }
    const toLevel = Math.min(3, level + 2); // pire → on descend de 2 crans
    return {
      episode: ep,
      proposal: {
        direction: 'decrease',
        label: `Ça empire — on protège davantage ${art}`,
        detail: LEVEL_DETAILS[toLevel],
        apply: { zone: episode.zone, toLevel },
      },
    };
  }

  if (reaction === 'same') {
    ep.betterStreak = 0;
    if (level >= 3) {
      return {
        episode: ep,
        proposal: {
          direction: 'none',
          label: 'On maintient les réductions actuelles',
          detail: 'La zone est déjà bien déchargée. Si ça ne s\'améliore pas d\'ici quelques jours, pense à consulter.',
          apply: null,
        },
      };
    }
    const toLevel = level + 1;
    return {
      episode: ep,
      proposal: {
        direction: 'decrease',
        label: level === 0 ? `On décharge un peu ${art}` : 'Toujours pareil — on descend d\'un cran',
        detail: LEVEL_DETAILS[toLevel],
        apply: { zone: episode.zone, toLevel },
      },
    };
  }

  // 😌 Mieux
  ep.betterStreak = (episode.betterStreak || 0) + 1;
  if (level === 0) {
    // plus aucune réduction en place et ça va mieux → épisode terminé
    ep.status = 'resolved';
    ep.betterStreak = 0;
    return {
      episode: ep,
      proposal: {
        direction: 'resolved',
        label: `${art.charAt(0).toUpperCase() + art.slice(1)} va mieux — épisode terminé 💪`,
        detail: 'Je ne te poserai plus la question. Si la gêne revient, signale-la en séance et le suivi reprendra.',
        apply: null,
      },
    };
  }
  if (ep.betterStreak >= 2) {
    const toLevel = level - 1;
    return {
      episode: ep,
      proposal: {
        direction: 'increase',
        label: 'Ça va mieux depuis 2 checks — on remonte d\'un cran ?',
        detail: toLevel === 0
          ? 'Retour aux charges et séries d\'origine sur les exercices concernés.'
          : LEVEL_DETAILS[toLevel],
        apply: { zone: episode.zone, toLevel },
      },
    };
  }
  return {
    episode: ep,
    proposal: {
      direction: 'none',
      label: 'Bien noté 👍',
      detail: 'Encore un « mieux » à la prochaine question et je te proposerai de remonter la charge.',
      apply: null,
    },
  };
}
