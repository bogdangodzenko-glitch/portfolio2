'use client'

import { useEffect, useRef } from 'react'

export function Contact() {
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
    <section className="section contact-section" id="contact" aria-label="Contact" ref={sectionRef}>
      <div className="container contact-inner">
        <div className="contact-text" data-reveal>
          <p className="section-label">Get in touch</p>
          <h2 className="section-title">Let&apos;s work together</h2>
          <p className="contact-description">
            I&apos;m always open to interesting projects and conversations. Reach out on social media — I&apos;d love to hear from you.
          </p>
        </div>
        <div className="contact-links" data-reveal>
          <a
            className="social-btn social-btn--twitter"
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my Twitter profile (opens in new tab)"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
            Twitter / X
          </a>
          <a
            className="social-btn social-btn--linkedin"
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile (opens in new tab)"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
