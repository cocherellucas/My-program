-- ─────────────────────────────────────────────────────────────────────────────
-- objectives.zone → NULLABLE
--
-- Les objectifs Force en mode « Sur un exercice » ciblent des MOUVEMENTS
-- (focus_movement) et n'ont donc PAS de zone. La colonne `zone` était NOT NULL,
-- ce qui empêchait d'enregistrer ces objectifs (erreur 23502).
--
-- La contrainte CHECK `objectives_zone_check` accepte déjà NULL (en SQL,
-- `NULL IN (...)` vaut NULL, ce qui satisfait un CHECK) → rien d'autre à changer.
--
-- À exécuter dans Supabase → SQL Editor. Idempotent (rejouable sans risque).
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.objectives
  alter column zone drop not null;
