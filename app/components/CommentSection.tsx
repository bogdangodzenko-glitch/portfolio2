'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Image from 'next/image'

interface Comment {
  id: string
  user_id: string
  user_name: string | null
  user_avatar: string | null
  body: string
  created_at: string
}

interface Props {
  slug: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CommentSection({ slug }: Props) {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/comments?slug=${slug}`)
      .then(r => r.json())
      .then(data => setComments(data.comments ?? []))
      .finally(() => setLoading(false))
  }, [open, slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() || !user) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, body: body.trim() }),
      })
      if (res.ok) {
        const { comment } = await res.json()
        setComments(prev => [comment, ...prev])
        setBody('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' })
    if (res.ok) setComments(prev => prev.filter(c => c.id !== id))
  }

  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <>
      <button className="comments-toggle" onClick={() => setOpen(v => !v)}>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {open ? 'Hide' : 'Comments'}{comments.length > 0 ? ` (${comments.length})` : ''}
      </button>

      {open && (
        <div className="comment-section">
          {loading ? (
            <p className="comment-empty">Loading…</p>
          ) : comments.length === 0 ? (
            <p className="comment-empty">No comments yet. Be the first!</p>
          ) : (
            <ul className="comment-list" aria-label="Comments">
              {comments.map(c => (
                <li key={c.id} className="comment-item">
                  {c.user_avatar ? (
                    <Image src={c.user_avatar} alt={c.user_name ?? 'User'} width={28} height={28} className="user-avatar" style={{ flexShrink: 0 }} />
                  ) : (
                    <span className="user-avatar-placeholder">
                      {(c.user_name ?? '?')[0].toUpperCase()}
                    </span>
                  )}
                  <div className="comment-body-wrap">
                    <div className="comment-meta">
                      <span className="comment-author">{c.user_name ?? 'Anonymous'}</span>
                      <span className="comment-date">{formatDate(c.created_at)}</span>
                      {user?.id === c.user_id && (
                        <button className="comment-delete" onClick={() => handleDelete(c.id)} aria-label="Delete comment">✕</button>
                      )}
                    </div>
                    <p className="comment-text">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {user ? (
            <form className="comment-form" onSubmit={handleSubmit}>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Leave a comment…"
                maxLength={500}
                required
              />
              <button className="comment-submit" type="submit" disabled={submitting || !body.trim()}>
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </form>
          ) : (
            <p className="comment-signin-prompt">
              <a onClick={handleSignIn} role="button">Sign in with Google</a> to leave a comment.
            </p>
          )}
        </div>
      )}
    </>
  )
}
