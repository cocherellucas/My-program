// ─────────────────────────────────────────────────────────────────────────────
// Acceptation des CGU / confidentialité / mentions — version + preuve.
//
// TERMS_VERSION : À INCRÉMENTER à chaque modification IMPORTANTE des documents
// légaux (src/pages/Legal.jsx). Un utilisateur dont la version acceptée est
// inférieure se verra redemander l'acceptation (portail « Avant de commencer »).
//
// Preuve : la vraie preuve est côté serveur (profiles.accepted_terms_at +
// accepted_terms_version — voir supabase/terms_acceptance.sql). Le localStorage
// n'est qu'un relais : au signup l'utilisateur n'a pas encore de session, on ne
// peut donc pas écrire côté serveur tout de suite → on mémorise localement, puis
// l'app persiste en silence à la première connexion authentifiée.
// ─────────────────────────────────────────────────────────────────────────────

// On NE bump PAS pour l'ajout du suivi de cycle (12 juillet 2026) : cette
// fonctionnalité est opt-in et dispose de son PROPRE consentement dédié (toggle +
// texte au moment de l'activer). Forcer en plus une ré-acceptation globale des
// CGU ferait doublon. La politique de confidentialité est simplement mise à jour
// (transparence). On ne bumpera cette version que pour un changement qui impacte
// TOUS les utilisateurs sans action de leur part.
export const TERMS_VERSION = 1;

const LS_KEY = 'accepted_terms_version';
const LS_LEGACY_KEY = 'accepted_terms_v1'; // ancienne clé (timestamp) = version 1

// Mémorise localement l'acceptation (relais avant l'écriture serveur).
export function markTermsAcceptedLocal(version = TERMS_VERSION) {
  try { localStorage.setItem(LS_KEY, String(version)); } catch {}
}

// Version des CGU acceptée localement (0 si aucune).
export function getLocalAcceptedVersion() {
  try {
    const v = parseInt(localStorage.getItem(LS_KEY) || '', 10);
    if (!Number.isNaN(v)) return v;
    if (localStorage.getItem(LS_LEGACY_KEY)) return 1; // rétro-compat
  } catch {}
  return 0;
}

export function clearLocalAccepted() {
  try {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_LEGACY_KEY);
  } catch {}
}

// L'utilisateur est-il couvert pour la version courante (serveur OU local) ?
export function hasAcceptedCurrentTerms(user) {
  const serverVersion = Number(user?.accepted_terms_version ?? 0);
  return serverVersion >= TERMS_VERSION || getLocalAcceptedVersion() >= TERMS_VERSION;
}
