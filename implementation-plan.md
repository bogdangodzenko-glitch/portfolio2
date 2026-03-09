# Portfolio Web App — Implementation Plan

## Overview

This plan expands the current static portfolio into a full web app with three new features:
- **Google sign-in** — visitors can authenticate with their Google account
- **AI chat widget** — answers questions about your work using RAG (Retrieval Augmented Generation)
- **Comment section** — signed-in users can leave messages per project

Adding these features requires a backend, so the project will be migrated from plain HTML to **Next.js** — the most natural fit for serverless API routes, auth, and Vercel deployment.

---

## 1. Services Needed

| Layer | Service | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | API routes, server components, SSG — all in one; zero extra infra |
| Authentication | **NextAuth.js v5 + Google OAuth** | Handles all OAuth wiring, sessions, and token management automatically |
| Database | **Supabase (PostgreSQL)** | Free tier, relational data for comments, built-in Row Level Security, real-time |
| AI — Embeddings | **OpenAI `text-embedding-3-small`** | Cheap, fast, high-quality vector embeddings |
| AI — Chat | **OpenAI `gpt-4o-mini`** | Cost-effective, streaming support, strong reasoning |
| Vector Storage | **Supabase pgvector** | Built into Supabase, no extra service needed |
| Hosting | **Vercel** (already set up) | Serverless functions, edge network, CI/CD from GitHub |
| Secrets | **Vercel Environment Variables** | Store API keys safely, never in code |

**Estimated monthly cost at zero traffic:** ~$0 (all free tiers). OpenAI charges per token — at light usage (a few hundred chat messages/month) expect under $1/month.

---

## 2. Architecture Overview

```
Browser
  │
  ├── Static pages (Next.js SSG)
  │     index.html → app/page.tsx  (hero, projects, about, contact)
  │
  ├── /api/auth/[...nextauth]       → NextAuth.js handles Google OAuth flow
  │
  ├── /api/chat                     → Serverless function
  │     1. Embed user question (OpenAI)
  │     2. Vector similarity search (Supabase pgvector)
  │     3. Build prompt with retrieved context
  │     4. Stream response (OpenAI gpt-4o-mini)
  │
  └── /api/comments                 → Serverless function
        GET  – fetch comments for a project
        POST – insert comment (requires valid session)
        DELETE – delete own comment (requires valid session)

Supabase (PostgreSQL)
  ├── Table: profiles        (id, email, name, avatar_url)
  ├── Table: comments        (id, project_slug, user_id, body, created_at)
  └── Table: embeddings      (id, content, embedding vector(1536), metadata)

Row Level Security (RLS)
  ├── comments: anyone can SELECT, only owner can DELETE, only auth users can INSERT
  └── embeddings: SELECT only (populated via a one-time seed script)
```

### How the AI chat works (RAG)

1. You write a knowledge base — a few markdown files describing your projects, skills, and experience
2. A seed script chunks those files, generates embeddings via OpenAI, and stores them in Supabase
3. When a visitor asks a question, the API embeds the question, finds the most relevant chunks from your knowledge base, and passes them as context to GPT-4o-mini
4. The model answers **only** based on your content — no hallucinations about work you haven't done

---

## 3. Security Considerations

### Authentication
- Use `NEXTAUTH_SECRET` (a random 32-byte string) — never commit it to git
- Set `trustHost: true` only in development; use exact `NEXTAUTH_URL` in production
- Google OAuth redirect URIs must exactly match your Vercel domain
- Sessions are JWT-based and signed — cannot be forged client-side

### Database
- Enable **Row Level Security (RLS)** on all Supabase tables — off by default, must be explicitly turned on
- `comments` INSERT policy: `auth.uid() = user_id` — users can only create comments as themselves
- `comments` DELETE policy: `auth.uid() = user_id` — users can only delete their own comments
- Never expose the Supabase `service_role` key to the browser — use only the `anon` key client-side

### AI endpoint
- Rate-limit `/api/chat` by IP (Vercel's built-in rate limiting or `@upstash/ratelimit`)
- Validate and truncate user input server-side before sending to OpenAI (max 500 chars)
- Never expose `OPENAI_API_KEY` to the browser — all OpenAI calls go through your API route

### General
- All secrets in Vercel Environment Variables — never in code or committed files
- Add `NEXTAUTH_URL` to `.env.local` locally, Vercel env vars in production
- Add `.env.local` to `.gitignore` immediately

---

## 4. Step-by-Step Implementation Phases

### Phase 1 — Migrate to Next.js

1. Scaffold Next.js project: `npx create-next-app@latest portfolio-v3 --typescript --app --tailwind`
2. Port `index.html` sections into React components under `app/components/`
3. Copy all CSS files into the new project (Tailwind replaces vanilla CSS, or keep both)
4. Verify the portfolio still looks identical at `localhost:3000`
5. Push to GitHub — Vercel auto-detects Next.js and redeploys

### Phase 2 — Google Sign-In

6. Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com)
7. Enable the **Google OAuth 2.0** API and create credentials (Web Application type)
8. Add authorised redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`
9. Install NextAuth: `npm install next-auth@beta`
10. Create `app/api/auth/[...nextauth]/route.ts` with Google provider config
11. Wrap the app in `<SessionProvider>` in `app/layout.tsx`
12. Add a **Sign in with Google** button to the header — shows user avatar when signed in, sign-in button when not
13. Test the full sign-in / sign-out flow locally and on Vercel

### Phase 3 — Database Setup (Supabase)

14. Create a free Supabase project at [supabase.com](https://supabase.com)
15. Enable the `pgvector` extension: `create extension vector`
16. Create the three tables (SQL in Supabase dashboard):
    ```sql
    create table profiles (
      id uuid references auth.users primary key,
      email text, name text, avatar_url text
    );

    create table comments (
      id uuid default gen_random_uuid() primary key,
      project_slug text not null,
      user_id text not null,
      user_name text,
      user_avatar text,
      body text not null,
      created_at timestamptz default now()
    );

    create table embeddings (
      id bigserial primary key,
      content text not null,
      embedding vector(1536),
      metadata jsonb
    );
    ```
17. Enable RLS on `comments` and add INSERT / DELETE policies
18. Add Supabase env vars to `.env.local` and Vercel

### Phase 4 — Comment Section

19. Create `app/api/comments/route.ts`:
    - `GET ?slug=project-1` → fetch all comments for that project
    - `POST` (auth required) → insert a new comment
    - `DELETE ?id=xyz` (auth required, owner only) → delete a comment
20. Build `<CommentSection />` React component:
    - Displays existing comments with avatar, name, date
    - Shows a textarea + submit button for signed-in users
    - Shows "Sign in to leave a comment" prompt for guests
21. Add `<CommentSection slug="project-1" />` below each project card

### Phase 5 — AI Knowledge Base

22. Create a `knowledge/` folder with markdown files:
    - `about.md` — your background, skills, experience
    - `projects.md` — detailed descriptions of each project
    - `stack.md` — technologies you work with and why
23. Write `scripts/seed-embeddings.ts` — reads markdown files, chunks them into ~500-token pieces, calls OpenAI embeddings API, inserts into Supabase
24. Run the seed script once: `npx ts-node scripts/seed-embeddings.ts`
25. Re-run any time you update your knowledge base

### Phase 6 — AI Chat Widget

26. Create `app/api/chat/route.ts`:
    - Receives user message
    - Validates and truncates input
    - Embeds the question (OpenAI)
    - Queries Supabase pgvector for top 5 similar chunks
    - Builds system prompt: *"You are an assistant for Bohdan's portfolio. Answer using only the context below..."*
    - Streams GPT-4o-mini response back
27. Build `<ChatWidget />` React component:
    - Floating button (bottom-right corner) that opens a chat drawer
    - Message thread with user and AI bubbles
    - Streaming response rendering
    - "Powered by AI · Answers about my work" disclaimer
28. Add rate limiting to `/api/chat` (max 10 requests/minute per IP)
29. Add `<ChatWidget />` to `app/layout.tsx` so it appears on all pages

### Phase 7 — Polish & Deploy

30. Test all three features end-to-end: sign in → leave comment → use chat
31. Add loading and error states to all async UI (comments loading, chat thinking indicator)
32. Verify RLS is blocking unauthorised writes in Supabase dashboard
33. Add all production env vars to Vercel dashboard
34. Push to GitHub — Vercel deploys automatically
35. Update Google OAuth redirect URIs to include the final production domain

---

## Migration path for existing CSS

The current vanilla CSS files can be carried over into Next.js as-is by importing them in `app/layout.tsx`:

```ts
import '../styles/reset.css'
import '../styles/variables.css'
// etc.
```

No rewrite needed unless you decide to adopt Tailwind for new components.

---

## File structure after migration

```
portfolio-v3/
├── app/
│   ├── layout.tsx              # Root layout, SessionProvider, ChatWidget
│   ├── page.tsx                # Home page (all sections)
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth route
│   │   ├── chat/               # AI chat endpoint
│   │   └── comments/           # Comments CRUD
│   └── components/
│       ├── Header.tsx
│       ├── Hero.tsx
│       ├── Projects.tsx
│       ├── About.tsx
│       ├── Contact.tsx
│       ├── CommentSection.tsx
│       └── ChatWidget.tsx
├── knowledge/
│   ├── about.md
│   ├── projects.md
│   └── stack.md
├── scripts/
│   └── seed-embeddings.ts
├── styles/                     # Existing CSS files (carried over)
├── .env.local                  # Never committed
├── .gitignore                  # Must include .env.local
└── next.config.ts
```
