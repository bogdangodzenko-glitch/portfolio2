import type { Metadata } from 'next'
import './globals.css'
import { Header } from './components/Header'
import { ChatWidget } from './components/ChatWidget'

export const metadata: Metadata = {
  title: 'Bohdan Hodzenko — Full-Stack Developer',
  description:
    'Full-stack developer crafting fast, accessible, and beautiful web experiences.',
  openGraph: {
    title: 'Bohdan Hodzenko — Full-Stack Developer',
    description:
      'Full-stack developer crafting fast, accessible, and beautiful web experiences.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <Header />
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
