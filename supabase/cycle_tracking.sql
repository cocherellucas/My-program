-- ============================================================================
--  Coach IA — Suivi de cycle menstruel (opt-in, données minimales)
-- ============================================================================
--  À coller dans Supabase → SQL Editor → Run.
--  Idempotent : relançable sans risque. Ne supprime AUCUNE donnée.
--
--  CONTEXTE : fonctionnalité optionnelle pour les profils féminins. Le coach
--  adapte ses CONSEILS (jamais le programme automatiquement) à la phase du
--  cycle, calculée par des règles codées (src/lib/cycle-engine.js).
--    • cycle_tracking_enabled        = suivi activé (consentement donné dans l'app)
--    • cycle_last_period_date       = 1er jour des dernières règles (recalé par l'utilisatrice)
--    • cycle_avg_length             = durée moyenne du cycle en jours (21–35)
--    • cycle_hormonal_contraception = si vrai → PAS de conseils de phase
--      (pas de cycle hormonal naturel sous contraception hormonale)
--
--  Donnée de santé sensible (RGPD) : effaçable en un bouton dans l'app
--  (« Désactiver et effacer » remet ces 4 colonnes à null).
--  ⚠️ Penser à mentionner cette donnée dans la politique de confidentialité
--  (+ bump TERMS_VERSION) avant commercialisation — voir lot juridique.
-- ============================================================================

alter table public.profiles
  add column if not exists cycle_tracking_enabled        boolean,
  add column if not exists cycle_last_period_date        date,
  add column if not exists cycle_avg_length              integer,
  add column if not exists cycle_hormonal_contraception  boolean;

-- Rappel : ces colonnes ne sont PAS privilégiées (contrairement à role /
-- subscription_plan, verrouillées par le trigger de rls_policies.sql) —
-- la RLS existante (chaque user ne modifie que sa ligne) suffit.
