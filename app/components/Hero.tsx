'use client'

import { useEffect, useRef } from 'react'

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = contentRef.current?.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!els) return

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="hero" id="hero" aria-label="Introduction">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-content" ref={contentRef}>
        <p className="hero-eyebrow" data-reveal>Full-Stack Developer</p>
        <h1 className="hero-title" data-reveal>
          Hi, I&apos;m <span className="accent">Bohdan</span><br />Hodzenko.
        </h1>
        <p className="hero-tagline" data-reveal>
          I craft fast, accessible, and beautiful web experiences — from pixel-perfect interfaces to resilient back-end services.
        </p>
        <a className="btn btn-primary" href="#projects" data-reveal>
          View my work
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  )
}
