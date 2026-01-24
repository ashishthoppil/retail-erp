# Trackza

A responsive stock management tool built for a home decor studio. Track batches, products, orders, and revenue trends in one place.

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql` to create the tables.
3. Create a Storage bucket named `product-images` and mark it as public.
4. Add environment variables in a `.env.local` file:

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

If you prefer to use a service role key, add `SUPABASE_SERVICE_ROLE_KEY` instead of the anon key.
Row Level Security is enabled with per-user policies; ensure your authenticated users can access their own rows.

## Payments (Razorpay)

Set the following environment variables:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

After updating the schema, enable email/password auth in Supabase and configure Razorpay webhooks to point to `/api/razorpay/webhook`.

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
