# Ujjal Manna — Personal Portfolio

A personal website for **Ujjal Manna** — B.Tech (BBIT, Kolkata) → GATE CS qualified 2025 & 2026 → M.Tech, Control & Instrumentation, IIT Bhilai.

Built with plain HTML/CSS/JS (no build step, no `package.json` required), a colorful gradient design with glassmorphism cards, a 3D particle scene via **Three.js**, a live tech-news feed via **Hacker News** and **Dev.to** public APIs, and a query/contact form backed by **Supabase**.

> ⚠️ This is a static site. It does NOT need a `package.json`, Node.js, or any build step. If you ever see a build error mentioning `package.json`, it means a stray file got added — just delete it from the repo.

---

## ✨ Features

- **About** — academic background, CGPA, GATE results
- **Path** — a timeline of the academic journey
- **GATE Desk** — guidance notes for juniors preparing for GATE (editable via JSON, no code needed)
- **Signal Feed** — live engineering news from Hacker News + Dev.to, plus your own curated notes
- **Query / Contact form** — visitors can send you a message, stored securely in Supabase
- **3D hero animation** — a subtle Three.js particle scene behind a hand-drawn SVG "signal flow diagram" of your academic path
- Fully responsive, dark theme, no frameworks — easy to host for free

---

## 🗂 Project structure

```
.
├── index.html              # Main page — all sections
├── css/
│   └── style.css           # Full design system (dark theme)
├── js/
│   ├── config.js           # ⚠️ Add your Supabase keys here
│   ├── main.js              # Nav + small global behavior
│   ├── contact.js          # Query form → Supabase
│   ├── news.js              # Live news feed (HN + Dev.to)
│   ├── gate.js              # Renders GATE Desk cards from JSON
│   ├── scene3d.js          # Three.js hero animation
│   └── reveal.js            # Scroll-reveal animations
├── data/
│   ├── notes.json          # Your own tech notes (edit freely)
│   └── gate-notes.json     # GATE guidance cards (edit freely)
└── supabase/
    └── schema.sql           # SQL to set up the messages table
```

---

## 🚀 Setup — Supabase (for the query form)

The contact form needs a free Supabase project to store messages.

1. Go to [supabase.com](https://supabase.com) and create a free account + new project.
2. Once the project is ready, open **SQL Editor** → **New query**, paste in the contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**. This creates a `messages` table with the right security rules (anyone can submit a message, only you can read them).
3. Go to **Project Settings → API**. Copy:
   - **Project URL**
   - **anon public** key
4. Open `js/config.js` and paste them in:

```js
const SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co",
  anonKey: "your-anon-public-key"
};
```

5. To **read messages people send you**, go to your Supabase project → **Table Editor → messages**. You'll see every submission there.

> The anon key is safe to expose in frontend code — it only allows inserting new rows, not reading existing ones (enforced by the Row Level Security policy in `schema.sql`).

---

## ✏️ Editing your content

You don't need to touch HTML/CSS for routine updates:

- **GATE guidance cards** → edit `data/gate-notes.json`
- **Your own tech notes/posts** → edit `data/notes.json`
- **Contact links (email, GitHub, LinkedIn)** → edit the `<ul id="contactLinks">` block in `index.html`
- **About text / academic details** → edit the `#about` and `#path` sections in `index.html`

---

## 🌐 Deploying — GitHub Pages (recommended, free)

> Use a **brand new, empty repository** for this project — don't mix it into a repo that already has other files (Python backends, other apps, etc.), since unrelated files like a broken `package.json` can break the build.

1. Create a new GitHub repository (e.g. `ujjal-portfolio`).
2. Push this entire folder to it:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Source → Deploy from branch → main → / (root)** → Save.
4. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/` within a couple of minutes.

### Alternative: Vercel / Netlify
Both support drag-and-drop or GitHub-connected deploys with zero config — just point them at this repo. Either works fine since this site has no build step.

---

## 🔌 APIs used

| API | Purpose | Auth required? |
|---|---|---|
| [Supabase](https://supabase.com) | Stores query/contact form messages | Free project + anon key |
| [Hacker News (Algolia) API](https://hn.algolia.com/api) | Live engineering news | No |
| [Dev.to API](https://developers.forem.com/api) | Live programming articles | No |
| [Three.js](https://threejs.org) (via CDN) | 3D hero animation | No (client-side library) |

---

## 🛠 Local development

No build tools needed — but the news feed and ES module 3D scene require a local server (not `file://`) due to browser CORS/module rules. Easiest options:

```bash
# Python
python3 -m http.server 8000

# Or Node
npx serve
```

Then open `http://localhost:8000`.

---

## 📄 License

This is your personal site — use, modify, and deploy it however you like.
