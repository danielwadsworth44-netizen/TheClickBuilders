import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import './App.css'
import { SplashScreen } from './SplashScreen'

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
    value: '45% vs 12%',
    title: 'Revenue growth with stronger digital presence',
    detail:
      'Advanced SMBs saw 45% revenue growth vs. 12% for basic adopters.',
    sourceLabel: 'Google / Deloitte',
    sourceUrl:
      'https://blog.google/outreach-initiatives/small-business/four-ways-web-supports-small-business-growthnew-research-deloitte',
  },
  {
    value: '17-50ms',
    title: 'To make a first impression',
    detail:
      'Users form a gut reaction to a site in as little as 17 to 50 milliseconds.',
    sourceLabel: 'Google Research',
    sourceUrl:
      'https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/',
  },
  {
    value: '+20-50%',
    title: 'Average redesign conversion lift',
    detail:
      'A focused redesign can lift conversions by 20% to 50% over 6 to 12 months.',
    sourceLabel: 'KrishaWeb',
    sourceUrl: 'https://www.krishaweb.com/blog/ai-website-redesign-roi-smb/',
  },
]

const quickReplies = [
  'New website',
  'Fix my current site',
  'Better design & messaging',
  'Just exploring',
]

type Page = 'home' | 'case-studies'
type RevealDirection = 'up' | 'left' | 'right'
type ChatRole = 'assistant' | 'user'
type ChatStage = 'goal' | 'existing-site' | 'site-feedback' | 'wrap-up'

type ChatMessage = {
  role: ChatRole
  text: string
}

const getPageFromHash = (): Page =>
  window.location.hash === '#case-studies' ? 'case-studies' : 'home'

function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  direction?: RevealDirection
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
  }

  return (
    <div
      ref={ref}
      style={style}
      className={`reveal reveal-${direction} ${visible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  )
}

function LogoMark() {
  return (
    <span className="logo-stage" aria-hidden="true">
      <svg viewBox="0 0 96 96" className="stairs-icon">
        <defs>
          <linearGradient id="stairsGradient" x1="12" y1="76" x2="78" y2="10">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="48%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M14 74h18V58h16V42h16V26h18"
          fill="none"
          stroke="url(#stairsGradient)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="10"
        />
      </svg>
      <span className="cursor-climber">
        <svg viewBox="0 0 24 24" className="cursor-icon">
          <path
            d="M4 3.5 18.4 12l-6.4 1.3 3 6.7-3.1 1.5-3-6.6L4 19.3V3.5Z"
            fill="#0f172a"
          />
          <path
            d="M4 3.5 18.4 12l-6.4 1.3 3 6.7-3.1 1.5-3-6.6L4 19.3V3.5Z"
            fill="none"
            stroke="#ffffff"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
        </svg>
      </span>
    </span>
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

const buildAssistantReply = (input: string) => {
  const normalized = input.toLowerCase()

  if (normalized.includes('shop') || normalized.includes('ecommerce') || normalized.includes('product')) {
    return 'That makes sense. We can shape the experience around product discovery, trust, and cleaner paths to purchase.'
  }

  if (normalized.includes('book') || normalized.includes('lead') || normalized.includes('call')) {
    return 'Perfect. We would focus on sharper messaging, stronger calls-to-action, and a smoother booking or inquiry flow.'
  }

  if (normalized.includes('brand') || normalized.includes('look') || normalized.includes('design')) {
    return 'Got it. We can help elevate the brand visually while still keeping the site simple and conversion-minded.'
  }

  return 'Thanks for sharing. We would use that as the starting point for the structure, messaging, and calls-to-action in your demo.'
}

const hasExistingWebsite = (input: string) => {
  const normalized = input.toLowerCase()

  return (
    normalized.includes('yes') ||
    normalized.includes('have') ||
    normalized.includes('already') ||
    normalized.includes('live') ||
    normalized.includes('existing') ||
    normalized.includes('current')
  )
}

const getDiscoveryResponses = (stage: ChatStage, input: string): ChatMessage[] => {
  switch (stage) {
    case 'goal':
      return [
        {
          role: 'assistant',
          text: buildAssistantReply(input),
        },
        {
          role: 'assistant',
          text: 'Do you already have a website live, or are you starting from scratch?',
        },
      ]
    case 'existing-site':
      return hasExistingWebsite(input)
        ? [
            {
              role: 'assistant',
              text: 'Helpful to know. What is already working well on the current site, and what feels like it needs the most fixing?',
            },
          ]
        : [
            {
              role: 'assistant',
              text: 'Starting fresh can be great because we can build the structure around your offer from day one.',
            },
            {
              role: 'assistant',
              text: 'What matters most for version one: better branding, more leads, selling products, clearer messaging, or something else?',
            },
          ]
    case 'site-feedback':
      return [
        {
          role: 'assistant',
          text: 'That gives us useful direction. We would use that to shape the layout, messaging, and conversion flow around what matters most.',
        },
        {
          role: 'assistant',
          text: 'If you want to talk through it live, do you have time tonight at 5 pm or tomorrow at 2 pm?',
        },
      ]
    case 'wrap-up':
      return [
        {
          role: 'assistant',
          text: 'Makes sense. If you keep sharing context here, we can keep narrowing in on the right direction before you book anything.',
        },
      ]
  }
}

function App() {
  const [splashDismissed, setSplashDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('theclickbuilders_splash_seen') === '1'
    } catch {
      return false
    }
  })

  const [page, setPage] = useState<Page>(getPageFromHash)
  const [chatOpen, setChatOpen] = useState(false)
  const [userGoal, setUserGoal] = useState('')
  const [message, setMessage] = useState('')
  const [chatStage, setChatStage] = useState<ChatStage>('goal')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: "Hi — I'm the TheClickBuilders assistant. What brought you here, and what should your site do better?",
    },
  ])
  const chatMessagesRef = useRef<HTMLDivElement | null>(null)

  const hasStartedChat = messages.some((entry) => entry.role === 'user')

  const chatSummary = useMemo(() => {
    if (!userGoal.trim()) {
      return hasStartedChat
        ? 'Tell us your goal and we will tailor the demo around it.'
        : 'Tap an option or type a message below.'
    }

    return `Your focus: ${userGoal}`
  }, [userGoal, hasStartedChat])

  useEffect(() => {
    const syncPage = () => {
      setPage(getPageFromHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    if (!chatOpen) {
      return
    }

    const container = chatMessagesRef.current

    if (!container) {
      return
    }

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight
    })
  }, [messages, chatOpen])

  const handleQuickReply = (reply: string) => {
    const nextStage =
      chatStage === 'goal'
        ? 'existing-site'
        : chatStage === 'existing-site'
          ? 'site-feedback'
          : 'wrap-up'

    setUserGoal(reply)
    setMessages((current) => [
      ...current,
      { role: 'user', text: reply },
      ...getDiscoveryResponses(chatStage, reply),
    ])
    setChatStage(nextStage)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    const nextStage =
      chatStage === 'goal'
        ? 'existing-site'
        : chatStage === 'existing-site'
          ? 'site-feedback'
          : 'wrap-up'

    setUserGoal(trimmedMessage)
    setMessages((current) => [
      ...current,
      { role: 'user', text: trimmedMessage },
      ...getDiscoveryResponses(chatStage, trimmedMessage),
    ])
    setChatStage(nextStage)
    setMessage('')
  }

  const navigateTo = (nextPage: Page) => {
    window.location.hash = nextPage === 'case-studies' ? 'case-studies' : ''
  }

  return (
    <>
      {!splashDismissed ? <SplashScreen onEnter={() => setSplashDismissed(true)} /> : null}

      <div className="page-shell">
      <header className="site-header">
        <button
          className="brand"
          type="button"
          onClick={() => navigateTo('home')}
          aria-label="TheClickBuilders home"
        >
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
              <Reveal className="hero-copy" direction="left">
                <p className="eyebrow">Custom websites for brands, businesses, products, and service companies</p>
                <h1>Sleek websites built to turn attention into action.</h1>
                <p className="hero-text">
                  Custom websites with sharper positioning, cleaner design, and better conversion paths.
                </p>

                <div className="hero-actions">
                  <a className="button button-primary" href={bookingUrl} target="_blank" rel="noreferrer">
                    Book a Demo
                  </a>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => navigateTo('case-studies')}
                  >
                    View Case Studies
                  </button>
                </div>
              </Reveal>

              <Reveal className="hero-panel" direction="right" delay={120}>
                <div className="hero-card hero-card-primary">
                  <p className="card-label">What we build</p>
                  <h2>Tailored sites that convert.</h2>
                  <p>
                    Custom design and copy for your offer and customers—not a cookie-cutter template. Every page
                    points to one clear next step: book, buy, or contact.
                  </p>
                </div>

                <div className="hero-card hero-card-glow">
                  <p className="card-label">What we fix first</p>
                  <div className="mini-stack">
                    <span>Outdated design</span>
                    <span>Weak messaging</span>
                    <span>Confusing next steps</span>
                  </div>
                </div>
              </Reveal>
            </section>

            <section className="section section-tight">
              <Reveal className="section-heading">
                <p className="eyebrow">Real web performance signals</p>
                <h2>Good websites change trust, leads, and growth.</h2>
              </Reveal>

              <div className="stats-grid">
                {proofStats.map((stat, index) => {
                  const direction: RevealDirection =
                    index === 0 ? 'left' : index === 1 ? 'up' : 'right'
                  const delay = index === 1 ? 0 : index === 0 ? 170 : 300

                  return (
                    <Reveal key={stat.title} direction={direction} delay={delay}>
                      <article className="stat-card">
                        <p className="stat-value">{stat.value}</p>
                        <h3>{stat.title}</h3>
                        <p>{stat.detail}</p>
                        <a href={stat.sourceUrl} target="_blank" rel="noreferrer">
                          Source: {stat.sourceLabel}
                        </a>
                      </article>
                    </Reveal>
                  )
                })}
              </div>
            </section>

            <section className="section">
              <Reveal className="section-heading">
                <p className="eyebrow">Why it works</p>
                <h2>Modern sites should feel clear, trusted, and easy to act on.</h2>
              </Reveal>

              <div className="value-grid">
                <Reveal direction="left" delay={0}>
                  <article className="value-card">
                    <h3>Built for your audience</h3>
                    <p>
                      Built for brands, ecommerce, services, and growth-focused teams.
                    </p>
                  </article>
                </Reveal>
                <Reveal direction="up" delay={120}>
                  <article className="value-card">
                    <h3>Built for conversion</h3>
                    <p>
                      Clearer messaging, stronger trust, better calls-to-action.
                    </p>
                  </article>
                </Reveal>
                <Reveal direction="right" delay={240}>
                  <article className="value-card">
                    <h3>Responsive by default</h3>
                    <p>
                      Sharp on desktop. Clean on mobile.
                    </p>
                  </article>
                </Reveal>
              </div>
            </section>

            <section className="section booking-section">
              <Reveal className="booking-copy" direction="left">
                <p className="eyebrow">Book your strategy demo</p>
                <h2>Tell us the goal. We will map the site around it.</h2>
                <p>
                  Better positioning, sharper design, smoother buying, or more booked calls.
                </p>
                <div className="booking-actions">
                  <a className="button button-primary" href={bookingUrl} target="_blank" rel="noreferrer">
                    Book a Demo
                  </a>
                  <p className="booking-note">
                    Add your live link with
                    <code> VITE_GOOGLE_CALENDAR_BOOKING_URL </code>
                    .
                  </p>
                </div>
              </Reveal>

              <Reveal direction="right" delay={120}>
                <div className="booking-panel">
                  <p className="card-label">On the demo</p>
                  <ul className="checklist">
                    <li>See what is working.</li>
                    <li>Find what needs fixing.</li>
                    <li>Plan the right next steps.</li>
                  </ul>
                </div>
              </Reveal>
            </section>
          </>
        ) : (
          <section className="case-studies-page">
            <Reveal className="page-intro">
              <p className="eyebrow">Case studies</p>
              <h1>Custom landing pages built to convert.</h1>
              <p className="hero-text">
                Quick mockups that show the polish fast.
              </p>
            </Reveal>

            <div className="case-study-list">
              {caseStudies.map((study, index) => (
                <Reveal
                  key={study.name}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                  delay={index * 90}
                >
                  <article className={`case-study-card ${study.accent}`}>
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
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-brand" aria-label="TheClickBuilders footer">
          <span className="footer-logo">
            <LogoMark />
          </span>
        </div>
        <a className="footer-email" href="mailto:theclickbuilders@gmail.com">
          theclickbuilders@gmail.com
        </a>
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
          <div className={`chat-panel ${hasStartedChat ? 'chat-panel--thread' : 'chat-panel--intro'}`}>
            <div className="chat-header">
              <div>
                <strong>Website Strategy Agent</strong>
                <p>{chatSummary}</p>
              </div>
            </div>

            <div ref={chatMessagesRef} className="chat-messages">
              {messages.map((entry, index) => (
                <div
                  key={`${entry.text}-${index}`}
                  className={`chat-bubble chat-bubble-${entry.role}`}
                >
                  {entry.text}
                </div>
              ))}
            </div>

            {!hasStartedChat ? (
              <div className="quick-replies" aria-label="Suggested replies">
                {quickReplies.map((reply) => (
                  <button key={reply} type="button" onClick={() => handleQuickReply(reply)}>
                    {reply}
                  </button>
                ))}
              </div>
            ) : null}

            <form className="chat-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="chat-message">
                Tell us your goal
              </label>
              <input
                id="chat-message"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </form>

            {chatStage === 'wrap-up' ? (
              <a className="chat-booking-link" href={bookingUrl} target="_blank" rel="noreferrer">
                Book your demo when you are ready
              </a>
            ) : null}
          </div>
        ) : null}
      </aside>
    </div>
    </>
  )
}

export default App
