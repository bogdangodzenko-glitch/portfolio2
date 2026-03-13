'use client'

import { useEffect, useRef } from 'react'
import { CommentSection } from './CommentSection'

const PROJECTS = [
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'A real-time SaaS analytics dashboard with customisable widgets, role-based access, and dark mode. Handles 10k+ concurrent users.',
    imageClass: 'project-image--1',
    imageLabel: 'Dashboard',
    stack: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    liveUrl: '#',
    repoUrl: '#',
    liveLabel: 'Live site',
  },
  {
    slug: 'storefront',
    title: 'Storefront',
    description: 'A headless e-commerce storefront with a custom checkout flow, Stripe integration, and sub-second page loads via static generation.',
    imageClass: 'project-image--2',
    imageLabel: 'E-Commerce',
    stack: ['Next.js', 'TypeScript', 'Stripe', 'Sanity'],
    liveUrl: '#',
    repoUrl: '#',
    liveLabel: 'Live site',
  },
  {
    slug: 'rest-api-service',
    title: 'REST API Service',
    description: 'A high-throughput REST API powering a mobile app with 50k+ monthly active users. Features JWT auth, rate limiting, and full test coverage.',
    imageClass: 'project-image--3',
    imageLabel: 'API Service',
    stack: ['Go', 'PostgreSQL', 'Redis', 'Docker'],
    liveUrl: '#',
    repoUrl: '#',
    liveLabel: 'Docs',
  },
  {
    slug: 'component-library',
    title: 'Component Library',
    description: 'An open-source library of 30+ accessible, themeable UI components with full keyboard support, ARIA patterns, and zero runtime dependencies.',
    imageClass: 'project-image--4',
    imageLabel: 'UI Library',
    stack: ['TypeScript', 'CSS', 'Storybook', 'Vitest'],
    liveUrl: '#',
    repoUrl: '#',
    liveLabel: 'Live site',
  },
]

const GitHubIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.529 2.341 1.087 2.912.832.091-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.026A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.295 2.747-1.026 2.747-1.026.547 1.376.202 2.393.1 2.646.64.698 1.027 1.591 1.027 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)
const ExternalIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H6M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!els) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section projects-section" id="projects" aria-label="Projects" ref={sectionRef}>
      <div className="container">
        <div className="section-header" data-reveal>
          <p className="section-label">Selected work</p>
          <h2 className="section-title">Recent Projects</h2>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <article
              key={p.slug}
              className="project-card"
              data-reveal
              style={{ '--delay': `${i * 100}ms` } as React.CSSProperties}
            >
              <div className={`project-image ${p.imageClass}`} aria-hidden="true">
                <span className="project-image-label">{p.imageLabel}</span>
              </div>
              <div className="project-body">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-description">{p.description}</p>
                <ul className="tech-list" aria-label="Technologies used" role="list">
                  {p.stack.map(t => <li key={t} className="tech-badge">{t}</li>)}
                </ul>
                <div className="project-links">
                  <a className="project-link" href={p.liveUrl} aria-label={`View ${p.title} ${p.liveLabel}`}>
                    <ExternalIcon />{p.liveLabel}
                  </a>
                  <a className="project-link" href={p.repoUrl} aria-label={`View ${p.title} source on GitHub`}>
                    <GitHubIcon />GitHub
                  </a>
                </div>
                <CommentSection slug={p.slug} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
