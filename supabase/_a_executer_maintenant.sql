-- ============================================================================
--  Coach IA — LES TROIS MIGRATIONS EN ATTENTE, en un seul bloc
-- ============================================================================
--  Où : Supabase → SQL Editor → coller tout → Run.
--  Sûr : idempotent (rejouable), aucune donnée supprimée, aucune colonne
--  existante modifiée. Les trois sont indépendantes, l'ordre n'importe pas.
--
--  Reprend à l'identique :
--    supabase/objectives_zone_nullable.sql
--    supabase/terms_acceptance.sql
--    supabase/cycle_tracking.sql
--  (fichiers d'origine conservés, avec leur contexte détaillé)
-- ============================================================================


-- ── 1. objectives.zone → NULLABLE ───────────────────────────────────────────
-- Un objectif de FORCE « sur un exercice » cible des MOUVEMENTS, pas une zone :
-- sa colonne `zone` vaut NULL. Tant qu'elle est NOT NULL, ces objectifs sont
-- REJETÉS à l'enregistrement (erreur 23502) — c'est la migration qui débloque
-- le plus de choses tout de suite.
alter table public.objectives
  alter column zone drop not null;


-- ── 2. Preuve d'acceptation des CGU ─────────────────────────────────────────
-- Horodatage + version acceptée, côté serveur. localStorage n'est pas une
-- preuve opposable. Quand les documents changent de façon importante, on
-- incrémente TERMS_VERSION dans src/lib/terms.js et l'app redemande l'accord.
alter table public.profiles
  add column if not exists accepted_terms_at      timestamptz,
  add column if not exists accepted_terms_version integer not null default 0;


-- ── 3. Suivi de cycle menstruel (opt-in) ────────────────────────────────────
-- Donnée de santé : effaçable en un bouton dans l'app. À déclarer dans la
-- politique de confidentialité AVANT commercialisation (voir lot juridique).
alter table public.profiles
  add column if not exists cycle_tracking_enabled        boolean,
  add column if not exists cycle_last_period_date        date,
  add column if not exists cycle_avg_length              integer,
  add column if not exists cycle_hormonal_contraception  boolean;


-- ============================================================================
--  VÉRIFICATION — doit renvoyer 7 lignes, et zone.is_nullable = YES
-- ============================================================================
select 'objectives.zone' as champ,
       is_nullable       as etat
  from information_schema.columns
 where table_schema = 'public' and table_name = 'objectives' and column_name = 'zone'

union all

select 'profiles.' || column_name, data_type
  from information_schema.columns
 where table_schema = 'public'
   and table_name = 'profiles'
   and column_name in ('accepted_terms_at', 'accepted_terms_version',
                       'cycle_tracking_enabled', 'cycle_last_period_date',
                       'cycle_avg_length', 'cycle_hormonal_contraception')
 order by 1;
