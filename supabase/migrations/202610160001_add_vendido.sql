alter table public.imoveis
  add column if not exists vendido boolean not null default false;
