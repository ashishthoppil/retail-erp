# CasaStock

A responsive stock management tool built for a home decor studio. Track batches, products, orders, and revenue trends in one place.

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql` to create the tables.
3. Add environment variables in a `.env.local` file:

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

If you prefer to use a service role key, add `SUPABASE_SERVICE_ROLE_KEY` instead of the anon key.
This setup assumes Row Level Security is disabled for the three tables, or that equivalent policies allow anonymous access.

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
