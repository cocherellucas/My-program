-- ============================================================================
--  Coach IA — Preuve d'acceptation des CGU (versionnée)
-- ============================================================================
--  À coller dans Supabase → SQL Editor → Run.
--  Idempotent : relançable sans risque. Ne supprime AUCUNE donnée.
--
--  CONTEXTE : l'utilisateur accepte les CGU/confidentialité/mentions à la
--  création du compte (case obligatoire). On veut une PREUVE opposable côté
--  serveur (pas seulement localStorage, qui n'est pas une preuve) :
--    • accepted_terms_at      = QUAND il a accepté (horodatage)
--    • accepted_terms_version = QUELLE version des documents il a acceptée
--
--  L'app écrit ces colonnes en silence à la première connexion authentifiée
--  (au signup il n'y a pas encore de session, donc pas d'écriture possible).
--  Quand tu modifies les documents de façon importante, incrémente
--  TERMS_VERSION dans src/lib/terms.js → l'app redemandera l'acceptation.
-- ============================================================================

alter table public.profiles
  add column if not exists accepted_terms_at      timestamptz,
  add column if not exists accepted_terms_version integer not null default 0;

-- Rappel : la policy UPDATE de `profiles` (RLS) laisse déjà l'utilisateur
-- modifier ses propres colonnes non privilégiées. Ces deux colonnes ne sont
-- PAS sensibles (contrairement à role / subscription_plan, verrouillées par le
-- trigger de rls_policies.sql), donc aucune policy supplémentaire n'est requise.
