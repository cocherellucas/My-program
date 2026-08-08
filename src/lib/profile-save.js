import { base44 } from '@/api/base44Client';

// Enregistrement du profil TOLÉRANT aux colonnes manquantes.
//
// Le formulaire de profil transporte des champs qui ne sont pas des colonnes de
// `profiles` : `equipment_validated`, `gym_chain`, `same_duration_all`… Ils
// servent à l'interface, pas au stockage. Or PostgREST rejette la requête
// ENTIÈRE dès qu'un champ inconnu apparaît (erreur PGRST204), ce qui faisait
// échouer toute la sauvegarde à cause d'un champ d'affichage.
//
// On retire donc la colonne fautive et on réessaie, jusqu'à ce que ça passe.
// Même effet qu'une migration en retard : l'app ne doit jamais rester bloquée.
// PostgREST ne formule pas toujours l'erreur de la même façon selon la version
// et selon que la colonne manque au cache de schéma ou à la table.
const MOTIFS_COLONNE = [
  /Could not find the '([^']+)' column/i,
  /column "([^"]+)" of relation/i,
  /Could not find the '([^']+)' column of/i,
];
const colonneFautive = (message) => {
  for (const m of MOTIFS_COLONNE) {
    const trouve = String(message || '').match(m);
    if (trouve) return trouve[1];
  }
  return null;
};

export async function updateMeTolerant(fields) {
  const payload = { ...fields };
  const retirees = [];
  for (let i = 0; i < 40 && Object.keys(payload).length; i++) {
    try {
      await base44.auth.updateMe(payload);
      if (retirees.length) {
        // Utile au diagnostic : ces champs ne sont pas des colonnes de `profiles`.
        console.info('[profil] champs ignorés (pas des colonnes) :', retirees.join(', '));
      }
      return;
    } catch (e) {
      const col = colonneFautive(e?.message) || colonneFautive(e?.details) || colonneFautive(e?.hint);
      if (col && col in payload) { delete payload[col]; retirees.push(col); continue; }
      // On remonte l'erreur telle quelle : la masquer derrière un message
      // générique rendait ce genre de panne indiagnostiquable.
      console.error('[profil] échec de sauvegarde :', e?.message, e);
      throw e;
    }
  }
}
