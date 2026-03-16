import { useEffect, useMemo, useState } from 'react'
import './App.css'

const bookingUrl =
  import.meta.env.VITE_GOOGLE_CALENDAR_BOOKING_URL || 'https://calendar.google.com/'

const caseStudies = [
  {
    name: 'Summit Dental Studio',
    category: 'Healthcare',
    headline: 'Clean dental landing page focused on trust, services, and appointment intent.',
    accent: 'accent-sky',
    palette: 'sky',
    details: ['Hero with booking CTA', 'Insurance and reviews section', 'Service cards and doctor intro'],
  },
  {
    name: 'Northline Exteriors',
    category: 'Home Services',
    headline: 'Bold contractor landing page built to feel premium, capable, and conversion-ready.',
    accent: 'accent-sun',
    palette: 'sun',
    details: ['Storm damage callout banner', 'Before-and-after image layout', 'Quote form near the fold'],
  },
  {
    name: 'Luma Coaching Co.',
    category: 'Professional Services',
    headline: 'High-end coaching landing page with elevated branding and a clear program offer.',
    accent: 'accent-lilac',
    palette: 'lilac',
    details: ['Luxury editorial typography', 'Offer breakdown modules', 'Embedded call booking area'],
  },
]

const proofStats = [
  {
    value: '+21.6%',
    title: 'More form submissions from faster lead-gen sites',
    detail:
      'Google-commissioned research found that improving mobile speed by 0.1s increased progression to the form submission page by 21.6% for lead generation sites.',
    sourceLabel: 'Google / Deloitte',
    sourceUrl: 'https://web.dev/case-studies/milliseconds-make-millions',
  },
  {
    value: '17-50ms',
    title: 'To shape a first impression',
    detail:
      'Google Research cites studies showing users form an initial gut-feeling about a website in as little as 17 to 50 milliseconds.',
    sourceLabel: 'Google Research',
    sourceUrl:
      'https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/',
  },
  {
    value: '4,500+',
    title: 'People studied in Stanford credibility research',
    detail:
      'Stanford’s web credibility guidance emphasizes professional design, clear contact information, and ease of use as signals that build trust.',
    sourceLabel: 'Stanford',
    sourceUrl: 'https://credibility.stanford.edu/guidelines/index.html',
  },
]

const quickReplies = [
  'I need more booked calls',
  'I want a better-looking site',
  'I need help with messaging',
  'I was referred here',
]

type Page = 'home' | 'case-studies'

const getPageFromHash = (): Page =>
  window.location.hash === '#case-studies' ? 'case-studies' : 'home'

function LogoMark() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <linearGradient id="stairsGradient" x1="12" y1="60" x2="56" y2="16">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="52%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        d="M12 56h16V44h12V32h12V20h16"
        fill="none"
        stroke="url(#stairsGradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M42 12h18v18"
        fill="none"
        stroke="#f8fafc"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <path
        d="M60 12 40 32"
        fill="none"
        stroke="#f8fafc"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3c-4.97 0-9 3.58-9 8 0 2.24 1.04 4.27 2.72 5.72L5 21l4.45-2.22c.81.15 1.66.22 2.55.22 4.97 0 9-3.58 9-8s-4.03-8-9-8Z"
        fill="currentColor"
      />
      <circle cx="8.5" cy="11" r="1.1" fill="#fff" />
      <circle cx="12" cy="11" r="1.1" fill="#fff" />
      <circle cx="15.5" cy="11" r="1.1" fill="#fff" />
    </svg>
  )
}

function BrowserPreview({ palette }: { palette: string }) {
  return (
    <div className={`browser-preview ${palette}`}>
      <div className="browser-topbar">
        <span />
        <span />
        <span />
      </div>
      <div className="preview-hero">
        <div className="preview-badge" />
        <div className="preview-title" />
        <div className="preview-subtitle" />
        <div className="preview-button-row">
          <div className="preview-button" />
          <div className="preview-button secondary" />
        </div>
      </div>
      <div className="preview-grid">
        <div className="preview-card" />
        <div className="preview-card" />
        <div className="preview-card tall" />
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<Page>(getPageFromHash)
  const [chatOpen, setChatOpen] = useState(false)
  const [userGoal, setUserGoal] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([
    'Hey, I am the TheClickBuilders demo assistant.',
    'What are you hoping your next website does better: more leads, better trust, better messaging, or cleaner design?',
    'Also, what brought you here today?',
  ])

  const chatSummary = useMemo(() => {
    if (!userGoal.trim()) {
      return 'Tell us your goal and we will tailor the demo around it.'
    }

    return `Your focus: ${userGoal}`
  }, [userGoal])

  useEffect(() => {
    const syncPage = () => {
      setPage(getPageFromHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  const handleQuickReply = (reply: string) => {
    setUserGoal(reply)
    setMessages((current) => [
      ...current,
      `You: ${reply}`,
      'Perfect. We build custom websites around that exact growth goal.',
      'When you are ready, use the booking button below and we will map out the funnel with you.',
    ])
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!message.trim()) {
      return
    }

    setUserGoal(message)
    setMessages((current) => [
      ...current,
      `You: ${message.trim()}`,
      'Thanks for sharing. We will use that context to make your demo more relevant.',
    ])
    setMessage('')
  }

  const navigateTo = (nextPage: Page) => {
    window.location.hash = nextPage === 'case-studies' ? 'case-studies' : ''
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <button className="brand" type="button" onClick={() => navigateTo('home')} aria-label="TheClickBuilders home">
          <span className="brand-mark">
            <LogoMark />
          </span>
          <span className="brand-text">
            <strong>TheClickBuilders</strong>
            <span>We turn clicks into clients</span>
          </span>
        </button>

        <nav className="site-nav" aria-label="Primary">
          <button
            className={page === 'home' ? 'active' : ''}
            type="button"
            onClick={() => navigateTo('home')}
          >
            Home
          </button>
          <button
            className={page === 'case-studies' ? 'active' : ''}
            type="button"
            onClick={() => navigateTo('case-studies')}
          >
            Case Studies
          </button>
          <a href={bookingUrl} target="_blank" rel="noreferrer">
            Book a Demo
          </a>
        </nav>
      </header>

      <main>
        {page === 'home' ? (
          <>
            <section className="hero-section">
              <div className="hero-copy">
                <p className="eyebrow">Custom web design for service businesses that need real growth</p>
                <h1>Bright, premium websites built to make the right people trust you fast.</h1>
                <p className="hero-text">
                  TheClickBuilders designs personalized websites for companies that want
                  better positioning, stronger first impressions, and more booked demos.
                </p>

                <div className="hero-actions">
                  <a className="button button-primary" href={bookingUrl} target="_blank" rel="noreferrer">
                    Book a Demo
                  </a>
                  <button className="button button-secondary" type="button" onClick={() => navigateTo('case-studies')}>
                    View Case Studies
                  </button>
                </div>

                <div className="trust-row">
                  <span>Custom-built around your offer</span>
                  <span>Google Calendar booking ready</span>
                  <span>Messaging that sells the next step</span>
                </div>
              </div>

              <div className="hero-panel">
                <div className="hero-card hero-card-primary">
                  <p className="card-label">What we build</p>
                  <h2>Sites that feel tailor-made because they are.</h2>
                  <p>
                    We build around your market, your service, and your sales process so the
                    site feels premium and the next action feels obvious.
                  </p>
                </div>

                <div className="hero-card hero-card-glow">
                  <p className="card-label">Inside the experience</p>
                  <div className="mini-stack">
                    <span>Sharper messaging</span>
                    <span>Stronger visual hierarchy</span>
                    <span>Clear booking and inquiry paths</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <p className="eyebrow">Why it works</p>
                <h2>A modern website should create trust quickly and move visitors toward action.</h2>
              </div>

              <div className="value-grid">
                <article className="value-card">
                  <h3>Made for your exact business</h3>
                  <p>
                    No generic layouts. Every section is tailored around your offer,
                    objections, and ideal customer journey.
                  </p>
                </article>
                <article className="value-card">
                  <h3>Built for conversion</h3>
                  <p>
                    We focus on clarity, trust signals, and a cleaner path to booking,
                    inquiry, or purchase.
                  </p>
                </article>
                <article className="value-card">
                  <h3>Connected to scheduling</h3>
                  <p>
                    Your site can send qualified traffic straight into your Google Calendar
                    demo flow without extra friction.
                  </p>
                </article>
              </div>
            </section>

            <section className="section section-tight">
              <div className="section-heading">
                <p className="eyebrow">Real web performance signals</p>
                <h2>Good websites can influence first impressions, trust, and lead flow.</h2>
              </div>

              <div className="stats-grid">
                {proofStats.map((stat) => (
                  <article key={stat.title} className="stat-card">
                    <p className="stat-value">{stat.value}</p>
                    <h3>{stat.title}</h3>
                    <p>{stat.detail}</p>
                    <a href={stat.sourceUrl} target="_blank" rel="noreferrer">
                      Source: {stat.sourceLabel}
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section className="section booking-section">
              <div className="booking-copy">
                <p className="eyebrow">Book your strategy demo</p>
                <h2>Tell us what brought you here, and we will map the site around that goal.</h2>
                <p>
                  Whether you need more booked calls, stronger positioning, or a site that
                  actually feels premium, we will show you the clearest path forward.
                </p>
                <div className="booking-actions">
                  <a className="button button-primary" href={bookingUrl} target="_blank" rel="noreferrer">
                    Open Google Calendar
                  </a>
                  <p className="booking-note">
                    Connect your live scheduling link with
                    <code> VITE_GOOGLE_CALENDAR_BOOKING_URL </code>
                    .
                  </p>
                </div>
              </div>

              <div className="booking-panel">
                <p className="card-label">On the demo</p>
                <ul className="checklist">
                  <li>We identify what your current site says well and where it loses trust.</li>
                  <li>We plan the pages, sections, and calls-to-action your business really needs.</li>
                  <li>We show how design, copy, and booking flow should work together.</li>
                </ul>
              </div>
            </section>
          </>
        ) : (
          <section className="case-studies-page">
            <div className="page-intro">
              <p className="eyebrow">Case studies</p>
              <h1>Landing page designs made to feel custom, clear, and conversion-ready.</h1>
              <p className="hero-text">
                These case study previews are presented as visual landing page mockups rather
                than long writeups, so visitors can see the level of polish immediately.
              </p>
            </div>

            <div className="case-study-list">
              {caseStudies.map((study) => (
                <article key={study.name} className={`case-study-card ${study.accent}`}>
                  <BrowserPreview palette={study.palette} />
                  <div className="case-study-copy">
                    <p className="work-category">{study.category}</p>
                    <h2>{study.name}</h2>
                    <p>{study.headline}</p>
                    <ul className="case-study-points">
                      {study.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <p>TheClickBuilders</p>
        <p>We turn clicks into clients.</p>
      </footer>

      <aside className="chat-widget" aria-label="Chat assistant">
        <button
          type="button"
          className="chat-toggle"
          onClick={() => setChatOpen((open) => !open)}
          aria-label={chatOpen ? 'Close chat' : 'Open chat'}
        >
          <ChatIcon />
        </button>

        {chatOpen ? (
          <div className="chat-panel">
            <div className="chat-header">
              <div>
                <strong>Website Strategy Agent</strong>
                <p>{chatSummary}</p>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((entry, index) => (
                <p key={`${entry}-${index}`}>{entry}</p>
              ))}
            </div>

            <div className="quick-replies" aria-label="Suggested replies">
              {quickReplies.map((reply) => (
                <button key={reply} type="button" onClick={() => handleQuickReply(reply)}>
                  {reply}
                </button>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="chat-message">
                Tell us your goal
              </label>
              <input
                id="chat-message"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell us what brought you here..."
              />
              <button type="submit">Send</button>
            </form>

            <a className="chat-booking-link" href={bookingUrl} target="_blank" rel="noreferrer">
              Book your demo now
            </a>
          </div>
        ) : null}
      </aside>
    </div>
  )
}

export default App
