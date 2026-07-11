import { toast } from 'sonner';

// Petit garde-fou réseau, réutilisable partout (indépendant de l'i18n : il lit
// la langue choisie pour le message, donc aucun composant n'a besoin du hook).
const MSG = {
  fr: 'Connexion internet requise pour cette action.',
  en: 'An internet connection is required for this action.',
};

export function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

// À appeler au début d'une action qui ÉCRIT sur le serveur.
// En ligne → true (on continue). Hors-ligne → message clair + false (on s'arrête).
export function ensureOnline() {
  if (!isOffline()) return true;
  let lang = 'fr';
  try { lang = localStorage.getItem('app_lang') === 'en' ? 'en' : 'fr'; } catch {}
  toast.error(MSG[lang] || MSG.fr);
  return false;
}
