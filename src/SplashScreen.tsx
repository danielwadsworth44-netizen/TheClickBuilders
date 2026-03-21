import { useCallback, useEffect, useRef } from 'react'
import { BRAND_LOGO_SRC } from './brand'
import './SplashScreen.css'

const STORAGE_KEY = 'theclickbuilders_splash_seen'

function writeSplashSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

function CursorIcon() {
  return (
    <svg className="splash-cursor-svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <path
        fill="currentColor"
        d="M4 2l1.2 6.2L2 9.8l6.4.8L4 22l6-8.4 4.2 1.6L22 2H4z"
      />
      <path fill="#fff" fillOpacity={0.35} d="M6.5 4.5h10.2L10.5 14l-1.2-5.5L6.5 4.5z" />
    </svg>
  )
}

type SplashScreenProps = {
  onEnter: () => void
}

/** Delay after animation ends before transitioning (lets “click” read) */
const EXIT_DELAY_MS = 550

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const finish = useCallback(() => {
    writeSplashSeen()
    onEnter()
  }, [onEnter])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [])

  /** Reduced motion: brief pause then enter */
  useEffect(() => {
    if (!reducedMotion) return
    exitTimerRef.current = setTimeout(finish, 900)
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [reducedMotion, finish])

  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return
      exitTimerRef.current = setTimeout(finish, EXIT_DELAY_MS)
    },
    [finish],
  )

  const handleSkip = useCallback(() => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    finish()
  }, [finish])

  return (
    <div
      className="splash-screen"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="polite"
      aria-labelledby="splash-title"
      aria-describedby="splash-desc"
    >
      <button type="button" className="splash-skip" onClick={handleSkip}>
        Skip intro
      </button>

      <div className="splash-inner">
        <h1 id="splash-title" className="splash-title">
          TheClickBuilders
        </h1>
        <p id="splash-desc" className="splash-hint">
          {reducedMotion ? 'Loading…' : 'Loading your experience…'}
        </p>

        <div className="splash-logo-stage">
          {/* Laptop + ring art — cursor z-index crosses above / below this layer */}
          <img
            className="splash-logo-img"
            src={BRAND_LOGO_SRC}
            alt=""
            width={480}
            height={480}
            decoding="async"
          />

          {!reducedMotion && (
            <div className="splash-cursor" onAnimationEnd={handleAnimationEnd} aria-hidden>
              <CursorIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
