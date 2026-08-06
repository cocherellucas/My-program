// Message du garde-fou TEMPS, partagé par l'onboarding et le profil (onglets
// Disponibilités et Objectifs) : les trois posent la même question — « le temps
// annoncé peut-il contenir ce que ces objectifs demandent ? » — et doivent donner
// la même réponse, en nommant le jour concerné.
//
// Le calcul lui-même vit dans `program-activation.js` (`verifierBudgetTemps`),
// qui rejoue la vraie activation. Ici on ne fait que mettre en phrase.
//
// L'import de l'activation est DYNAMIQUE à dessein : il entraîne le catalogue de
// programmes (~2,6 Mo). Le charger au démarrage de l'app pour un contrôle qui ne
// sert qu'au clic sur « Suivant » / « Enregistrer » serait du gâchis.

/**
 * @returns {Promise<string>} '' si tout va bien, sinon le message à afficher.
 */
export async function messageBudgetTemps(user, objectives, t) {
  if (!user || !objectives?.length) return '';
  if (user.availability_optimal === true) return '';
  if (!user.available_days?.length) return '';

  const { verifierBudgetTemps } = await import('./program-activation');
  const { problemes } = await verifierBudgetTemps(user, objectives);
  if (!problemes.length) return '';

  // On annonce le pire écart : c'est celui qui commande la durée à choisir.
  const pire = problemes.reduce((a, b) => (b.requis - b.annonce > a.requis - a.annonce ? b : a));
  const jours = [...new Set(problemes.map((p) => t(`dayfull_${p.jour}`)))];
  const liste = jours.length > 1
    ? `${jours.slice(0, -1).join(', ')} ${t('list_and')} ${jours[jours.length - 1]}`
    : jours[0];

  return t(jours.length > 1 ? 'err_time_many' : 'err_time_one')
    .replace('{jours}', liste)
    .replace('{requis}', pire.requis)
    .replace('{annonce}', pire.annonce);
}
