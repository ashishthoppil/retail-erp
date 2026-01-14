create extension if not exists "pgcrypto";

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete set null,
  image_url text,
  name text not null,
  buying_price numeric(12, 2) not null,
  selling_price numeric(12, 2) not null,
  initial_quantity integer not null default 0,
  current_quantity integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  selling_price numeric(12, 2) not null,
  shipping_charge numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.capital (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_type text not null,
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

alter table public.batches disable row level security;
alter table public.products disable row level security;
alter table public.orders disable row level security;
alter table public.capital disable row level security;
alter table public.expenses disable row level security;
