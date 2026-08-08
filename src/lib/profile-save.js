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
export async function updateMeTolerant(fields) {
  const payload = { ...fields };
  for (let i = 0; i < 30 && Object.keys(payload).length; i++) {
    try {
      await base44.auth.updateMe(payload);
      return;
    } catch (e) {
      const col = (e?.message || '').match(/Could not find the '([^']+)' column/)?.[1];
      if (col && col in payload) { delete payload[col]; continue; }
      throw e; // autre erreur → on remonte
    }
  }
}
