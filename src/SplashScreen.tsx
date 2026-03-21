import { useCallback, useEffect, useState } from 'react'
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
      <path
        fill="#fff"
        fillOpacity={0.35}
        d="M6.5 4.5h10.2L10.5 14l-1.2-5.5L6.5 4.5z"
      />
    </svg>
  )
}

type SplashScreenProps = {
  onEnter: () => void
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [phase, setPhase] = useState<'animating' | 'ready'>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'ready'
      : 'animating',
  )
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => {
      setReducedMotion(mq.matches)
      if (mq.matches) setPhase('ready')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleAnimationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    setPhase('ready')
  }, [])

  const handleEnter = useCallback(() => {
    writeSplashSeen()
    onEnter()
  }, [onEnter])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleEnter()
      }
    },
    [handleEnter],
  )

  return (
    <div
      className="splash-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-title"
      aria-describedby="splash-desc"
    >
      <button type="button" className="splash-skip" onClick={handleEnter}>
        Skip intro
      </button>

      <div className="splash-inner">
        <h1 id="splash-title" className="splash-title">
          TheClickBuilders
        </h1>
        <p id="splash-desc" className="splash-hint">
          {phase === 'ready' || reducedMotion
            ? 'Click the dollar to enter'
            : 'Watch the path — then click the dollar to enter'}
        </p>

        <div className="splash-logo-stage">
          <img
            className="splash-logo-img"
            src="/logo-theclickbuilders.png"
            alt="TheClickBuilders logo: laptop with stairs and dollar sign"
            width={480}
            height={480}
            decoding="async"
          />

          {!reducedMotion && (
            <div
              className={`splash-cursor ${phase === 'ready' ? 'splash-cursor--settled' : ''}`}
              onAnimationEnd={handleAnimationEnd}
              aria-hidden
            >
              <CursorIcon />
            </div>
          )}

          <button
            type="button"
            className={`splash-dollar-hit ${phase === 'ready' || reducedMotion ? 'splash-dollar-hit--active' : ''}`}
            aria-label="Enter site"
            onClick={handleEnter}
            onKeyDown={handleKeyDown}
            disabled={!reducedMotion && phase === 'animating'}
          />
        </div>
      </div>
    </div>
  )
}

