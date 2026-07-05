-- ============================================================================
--  Coach IA — Durcissement sécurité Supabase
-- ============================================================================
--  À coller dans Supabase → SQL Editor → Run.
--  Idempotent : relançable sans risque. Ne supprime AUCUNE donnée.
--
--  CONTEXTE : le schéma principal active déjà la RLS "chaque user ne voit que
--  ses lignes" sur toutes les tables, + app_configs en écriture admin.
--  Il reste UN trou : la policy UPDATE de `profiles` filtre les lignes mais
--  PAS les colonnes → un utilisateur peut modifier son propre `role` et son
--  `subscription_plan` (updateMe({ role:'admin' }) / ({ subscription_plan:'pro' })).
--  Ce script pose un trigger qui verrouille ces deux colonnes.
-- ============================================================================


-- ----------------------------------------------------------------------------
--  Verrou anti-escalade sur profiles.role et profiles.subscription_plan
--
--  • Le backend (Edge Functions / service_role) conserve tous les droits
--    → c'est par là que passera un vrai paiement / une promotion légitime.
--  • Un admin déjà en place peut encore promouvoir ou changer les plans.
--  • Un utilisateur normal : toute tentative de changer role/subscription_plan
--    est silencieusement annulée (on remet l'ancienne valeur).
-- ----------------------------------------------------------------------------
create or replace function public.guard_privileged_profile_columns()
returns trigger
language plpgsql
security definer            -- lit profiles sans être bloqué par la RLS
set search_path = public
as $$
declare
  caller_is_admin boolean;
begin
  -- 1) Backend de confiance (service_role) : aucun verrou
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    return new;
  end if;

  -- 2) Admin déjà en place : autorisé à modifier ces colonnes
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ) into caller_is_admin;

  if caller_is_admin then
    return new;
  end if;

  -- 3) Utilisateur normal
  if tg_op = 'INSERT' then
    -- Nouveau profil créé côté client : jamais admin, plan de base
    new.role := 'user';
    if new.subscription_plan is distinct from 'starter' then
      new.subscription_plan := 'starter';
    end if;
  else -- UPDATE : on ignore toute modif de ces deux colonnes
    if new.role is distinct from old.role then
      new.role := old.role;
    end if;
    if new.subscription_plan is distinct from old.subscription_plan then
      new.subscription_plan := old.subscription_plan;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_profile_privileges on public.profiles;
create trigger trg_guard_profile_privileges
  before insert or update on public.profiles
  for each row execute function public.guard_privileged_profile_columns();


-- ============================================================================
--  VÉRIFICATIONS (à lancer séparément, lecture seule)
-- ============================================================================

-- A. Confirmer que la RLS est bien ACTIVE sur toutes les tables.
--    La colonne rowsecurity doit valoir true partout.
-- select tablename, rowsecurity
-- from pg_tables
-- where schemaname = 'public'
--   and tablename in ('profiles','programs','sessions','series_logs','objectives',
--                     'user_memories','measurements','saved_programs','app_configs')
-- order by tablename;

-- B. Test manuel de l'escalade (connecté avec un compte NON-admin) :
--    depuis la console du navigateur ->
--      await base44.auth.updateMe({ role: 'admin' })
--      await base44.auth.me()      // role doit rester 'user'
