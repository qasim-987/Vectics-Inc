-- Vectis Inc. — bulk email suppression store
-- Run this once in the Supabase SQL editor (or `supabase db push`).
--
-- The public site never reads this table. Only:
--   * POST /api/unsubscribe  (service-role key, server-side)
--   * scripts/email-campaign.mjs (service-role key, local machine)
-- touch it, so RLS stays fully closed to anon/authenticated roles.

create table if not exists public.email_suppressions (
  email       text primary key,
  reason      text not null default 'unsubscribe',
  source      text not null default 'campaign',
  created_at  timestamptz not null default now()
);

comment on table public.email_suppressions is
  'Addresses that must never receive a marketing email again (unsubscribes, complaints, hard bounces).';

create index if not exists email_suppressions_created_at_idx
  on public.email_suppressions (created_at desc);

alter table public.email_suppressions enable row level security;

-- No policies on purpose: anon and authenticated roles get zero access.
-- The service-role key bypasses RLS, which is what the API route and script use.

-- Optional: the list you mail. Nothing in the app writes here yet — it is the
-- recommended home for contact-form submissions and imported customers, and it
-- exports straight to the CSV the sender script expects:
--
--   select email, first_name, last_name, company, tags::text, last_contact
--   from public.email_contacts
--   where not exists (select 1 from public.email_suppressions s where s.email = email_contacts.email);
create table if not exists public.email_contacts (
  email         text primary key,
  first_name    text,
  last_name     text,
  company       text,
  industry      text,
  tags          text[] not null default '{}',
  consent_at    timestamptz,
  consent_source text,
  last_contact  date,
  created_at    timestamptz not null default now()
);

alter table public.email_contacts enable row level security;

-- Optional audit trail of what was sent, for "why did this person get this email?"
create table if not exists public.email_campaigns (
  id           text primary key,
  subject      text not null,
  segment      text[] not null default '{}',
  recipients   integer not null default 0,
  sent         integer not null default 0,
  failed       integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table public.email_campaigns enable row level security;
