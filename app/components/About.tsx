'use client'

import { useEffect, useRef } from 'react'

const SKILLS = [
  'HTML & CSS', 'JavaScript', 'TypeScript', 'React',
  'Node.js', 'Go', 'PostgreSQL', 'Docker', 'Figma',
]

export function About() {
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
    <section className="section about-section" id="about" aria-label="About me" ref={sectionRef}>
      <div className="container about-inner">
        <div className="about-image-wrap" data-reveal>
          <div className="about-image" aria-hidden="true">
            <span className="about-image-initials">BH</span>
          </div>
        </div>
        <div className="about-content" data-reveal>
          <p className="section-label">About me</p>
          <h2 className="section-title">A bit about myself</h2>
          <p className="about-bio">
            I&apos;m a full-stack developer with a passion for building products that are as delightful to use as they are solid under the hood. I care deeply about performance, accessibility, and clean code that teammates actually enjoy reading.
          </p>
          <p className="about-bio">
            When I&apos;m not coding, you&apos;ll find me contributing to open source, exploring type-system rabbit holes, or hunting for great coffee.
          </p>
          <div className="skills" aria-label="Skills">
            {SKILLS.map(s => <span key={s} className="tech-badge">{s}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
