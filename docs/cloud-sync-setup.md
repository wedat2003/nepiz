# Cloud Sync Setup (Safe with Public Repo)

This project can stay in a **public GitHub repository** and still keep user data private, if you use Supabase with strict RLS.

## Important Security Rules

- Never commit `.env` files.
- Never expose Supabase `service_role` keys in frontend code.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is public by design and is safe only with strict RLS policies.
- Privacy is enforced by database/storage policies, not by repo visibility.

## 1) Add environment variables

Create `.env.local` from `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) Create DB schema

Run:

- `supabase/schema.sql`

This creates:

- `public.couple_data` table
- owner-based RLS policies (`auth.uid() = owner`)

## 3) Create Storage bucket + policies

In Supabase UI:

- Create private bucket `nepiz-media` (public OFF)

Then run:

- `supabase/storage-policies.sql`

This enforces owner-only read/write/delete and user-scoped paths.

## 4) Use Supabase Auth

To keep data private per user/device, users must authenticate with Supabase Auth.

Recommended:

- Email + password auth
- Optional magic link

Without Supabase Auth, private multi-device sync cannot be enforced safely.

## 5) Deployment note

If you keep GitHub Pages static export:

- You can still use Supabase directly from frontend.
- Do not use server-only secrets in static frontend code.

