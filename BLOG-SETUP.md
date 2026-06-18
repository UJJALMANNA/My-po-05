# Blog & Admin Moderation — Setup Guide

This adds a public **Blog &amp; Theses** page where visitors can submit posts, plus a private **Admin** page where you approve or delete them.

## New files

```
blog.html            ← public page: read posts + submit new ones
admin.html            ← private page: approve / delete (password protected)
js/blog.js            ← logic for blog.html
js/admin.js           ← logic for admin.html
blog-schema.sql        ← run once in Supabase SQL editor
moderate-post.ts       ← deploy this as a Supabase Edge Function
```

---

## Step 1 — Create the `posts` table

1. Go to your Supabase project → **SQL Editor → New query**
2. Paste in the contents of `blog-schema.sql`
3. Click **Run**

This creates a `posts` table where new submissions are always `status = 'pending'`, and only `status = 'approved'` posts are publicly readable.

---

## Step 2 — Deploy the moderation Edge Function

This function is what lets your **admin.html** page approve/delete posts securely — your secret key and password live only here, never in the website's code.

You'll need the [Supabase CLI](https://supabase.com/docs/guides/cli) installed once on your computer:

```bash
npm install -g supabase
```

Then, from a terminal:

```bash
# log in (opens a browser)
supabase login

# link to your project (find your project ref in Supabase dashboard URL)
supabase link --project-ref YOUR_PROJECT_REF

# create the function folder and paste in moderate-post.ts
supabase functions new moderate-post
# now replace the generated file's contents with moderate-post.ts from this package

# set your secrets (never shared with the browser)
supabase secrets set ADMIN_PASSWORD=choose-a-strong-password
supabase secrets set SERVICE_ROLE_KEY=your-service-role-key   # from Project Settings → API
supabase secrets set SUPABASE_URL=https://your-project.supabase.co

# deploy it
supabase functions deploy moderate-post --no-verify-jwt
```

> Find your **service role key** in Supabase: Project Settings → API → "service_role" (this is secret — never put it in any HTML/JS file you upload to GitHub).

---

## Step 3 — Upload the website files

Add these files to your GitHub repo, in the same structure as your existing site:

```
your-repo/
├── index.html          (already there)
├── blog.html            ← NEW
├── admin.html            ← NEW
├── css/style.css        (already there)
├── js/
│   ├── config.js         (already there — same Supabase keys work)
│   ├── blog.js            ← NEW
│   ├── admin.js           ← NEW
│   └── ...(existing files)
```

No changes needed to `js/config.js` — it already has your Supabase URL and anon key, which is all `blog.html` and `admin.html` need (the secret key stays inside the Edge Function only).

---

## Step 4 — Use it

- **Visitors**: go to `yoursite.com/blog.html` → "Write a Post" tab → submit. It won't appear publicly yet.
- **You**: go to `yoursite.com/admin.html` → enter the password you set in Step 2 → see all posts (pending + approved) → click **Approve** or **Delete**.

> `admin.html` isn't linked from anywhere on your site — only people who know the exact URL can reach it, and even then they need your password to see or touch anything.

---

## Security notes

- Your service role key and admin password are stored as Supabase **secrets**, only accessible inside the Edge Function running on Supabase's servers — never downloaded to anyone's browser.
- The public `posts` table only allows inserting new pending posts and reading approved ones — visitors can never read others' pending submissions, edit, or delete anything directly.
- If you ever want to change your password, just run `supabase secrets set ADMIN_PASSWORD=new-password` again and redeploy.
