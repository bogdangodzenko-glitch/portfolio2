-- ═══════════════════════════════════════════════════════════
-- Portfolio v2 — Supabase setup
-- Run this entire file in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Enable pgvector extension
create extension if not exists vector;


-- 2. Comments table
create table if not exists comments (
  id          uuid        default gen_random_uuid() primary key,
  project_slug text       not null,
  user_id     text        not null,
  user_name   text,
  user_avatar text,
  body        text        not null check (char_length(body) <= 500),
  created_at  timestamptz default now()
);

-- Index for fast lookup by project
create index if not exists comments_project_slug_idx on comments (project_slug, created_at desc);


-- 3. Embeddings table (for AI RAG)
create table if not exists embeddings (
  id        bigserial primary key,
  content   text    not null,
  embedding vector(1536),
  metadata  jsonb   default '{}'::jsonb
);

-- Vector index for fast similarity search
create index if not exists embeddings_vector_idx
  on embeddings using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);


-- 4. Row Level Security on comments
alter table comments enable row level security;

-- Anyone can read comments
create policy "Public read"
  on comments for select
  using (true);

-- Signed-in users can insert their own comments
create policy "Authenticated insert"
  on comments for insert
  to authenticated
  with check (auth.uid()::text = user_id);

-- Users can only delete their own comments
create policy "Owner delete"
  on comments for delete
  to authenticated
  using (auth.uid()::text = user_id);


-- 5. match_embeddings function (used by the AI Edge Function)
create or replace function match_embeddings(
  query_embedding vector(1536),
  match_threshold float default 0.4,
  match_count     int   default 5
)
returns table (
  id         bigint,
  content    text,
  metadata   jsonb,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  from embeddings
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
