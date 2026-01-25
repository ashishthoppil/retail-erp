create extension if not exists "pgcrypto";

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  image_url text,
  name text not null,
  description text,
  buying_price numeric(12, 2) not null,
  selling_price numeric(12, 2) not null,
  initial_quantity integer not null default 0,
  current_quantity integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  address text not null,
  shipping_charge numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  selling_price numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.capital (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expense_type text not null,
  amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  business_name text,
  instagram_url text,
  facebook_url text,
  website_url text,
  phone_number text,
  show_catalog_price boolean not null default true,
  show_catalog_description boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_name text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'INR',
  status text not null default 'pending',
  razorpay_order_id text,
  razorpay_subscription_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.batches enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.capital enable row level security;
alter table public.expenses enable row level security;
alter table public.order_items enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

create policy "Batches are user-scoped"
  on public.batches
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Products are user-scoped"
  on public.products
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Orders are user-scoped"
  on public.orders
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Order items are user-scoped"
  on public.order_items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Capital is user-scoped"
  on public.capital
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Expenses are user-scoped"
  on public.expenses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Profiles are user-scoped"
  on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Subscriptions are user-scoped"
  on public.subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
