import { useId } from 'react'

type BrandLogoGraphicProps = {
  variant?: 'mark' | 'full'
  className?: string
  title?: string
  showCursor?: boolean
}

type GradIds = {
  orbit: string
  screen: string
  stair: string
  gold: string
  ray: string
}

function LogoDefs({ ids }: { ids: GradIds }) {
  return (
    <defs>
      <linearGradient id={ids.screen} x1="26" y1="40" x2="74" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#d7f0ff" />
        <stop offset="52%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#22a7e8" />
      </linearGradient>
      <linearGradient id={ids.stair} x1="27" y1="67" x2="69" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="58%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
      <linearGradient id={ids.gold} x1="60" y1="38" x2="72" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id={ids.ray} x1="66" y1="36" x2="66" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
      </linearGradient>
    </defs>
  )
}

function staircasePath() {
  return 'M 29.5 65.5 H 35 V 62 H 40.5 V 58.5 H 46 V 55 H 51.5 V 51.5 H 57 V 48 H 62.5 V 44.5 H 68'
}

function CursorGraphic({ x = 68.3, y = 43.3, scale = 0.82 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M-7.2 -10.4 L 1.8 -0.8 L -2.8 -0.2 L -0.6 5.2 L -3.8 6.4 L -6 1 L -9.8 3.1 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="0.85"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 1px 0 rgba(15, 23, 42, 0.5)) drop-shadow(0 2px 4px rgba(15, 23, 42, 0.4))' }}
      />
    </g>
  )
}

/**
 * Screen inner: x 26.5–73.5, y 40–68. Stairs climb BL→TR. Orbit is a single ring,
 * split into back/front arcs by the laptop so it reads like one sash.
 */
function LogoMarkContent({ ids, showCursor = false }: { ids: GradIds; showCursor?: boolean }) {
  const steps = staircasePath()
  const orbitBackLeft = 'M 4 63 A 46 15.8 0 0 1 50 47.2'
  const orbitBackRight = 'M 50 47.2 A 46 15.8 0 0 1 96 63'
  const orbitFrontRight = 'M 96 63 A 46 15.8 0 0 1 50 78.8'
  const orbitFrontLeft = 'M 50 78.8 A 46 15.8 0 0 1 4 63'

  const dollarX = 67
  const dollarY = 44.2
  const rayCx = 67
  const rayCy = 42.8

  return (
    <g>
      {/* Orbit with clean left/right brand colors and only opacity shift behind the laptop */}
      <path
        d={orbitBackLeft}
        fill="none"
        stroke="#f97316"
        strokeWidth="4.9"
        strokeLinecap="round"
        opacity={0.42}
      />
      <path
        d={orbitBackRight}
        fill="none"
        stroke="#38bdf8"
        strokeWidth="4.9"
        strokeLinecap="round"
        opacity={0.42}
      />

      <ellipse cx="50" cy="79.4" rx="29.5" ry="3.4" fill="#020617" opacity={0.28} />

      {/* Slightly tilted laptop with softer surfaces and a visible keyboard deck */}
      <path
        d="M 24.3 69.5 L 26.9 37.5 L 73.1 37.5 L 75.7 69.5 Z"
        fill="#103f62"
        stroke="#2f6f98"
        strokeWidth="0.9"
      />
      <path d="M 28.4 40.6 L 71.6 40.6 L 69.9 66.2 L 30.1 66.2 Z" fill={`url(#${ids.screen})`} />
      <ellipse cx="60.5" cy="46.3" rx="12.6" ry="7.1" fill="#fff" opacity={0.16} />
      <path d="M 21.2 69.4 L 78.8 69.4 L 83.5 72.3 L 16.5 72.3 Z" fill="#144f77" />
      <path
        d="M 24.1 69.95 L 75.9 69.95 L 79.4 71.95 L 20.6 71.95 Z"
        fill="#2a6d99"
        opacity={0.42}
      />
      <path d="M 18 72.4 L 82 72.4 L 86 76.1 L 14 76.1 Z" fill="#0d4368" />
      <path d="M 16 76.1 L 84 76.1 L 82 78.9 L 18 78.9 Z" fill="#082f47" opacity={0.86} />

      {/* Front half of the same orbit, visible across the middle like a sash */}
      <path
        d={orbitFrontRight}
        fill="none"
        stroke="#38bdf8"
        strokeWidth="4.9"
        strokeLinecap="round"
        opacity={0.98}
      />
      <path
        d={orbitFrontLeft}
        fill="none"
        stroke="#f97316"
        strokeWidth="4.9"
        strokeLinecap="round"
        opacity={0.98}
      />

      {/* Stair path with softer detailing so the mark feels less clip-art */}
      <path
        d={steps}
        fill="none"
        stroke="#7c2d12"
        strokeWidth="5.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.2}
      />
      <path
        d={steps}
        fill="none"
        stroke={`url(#${ids.stair})`}
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Rays + $ — top of stair path, still inside screen */}
      <g opacity={0.45}>
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
          <line
            key={deg}
            x1={rayCx}
            y1={rayCy}
            x2={rayCx}
            y2={rayCy - 7}
            stroke={`url(#${ids.ray})`}
            strokeWidth="1"
            strokeLinecap="round"
            transform={`rotate(${deg} ${rayCx} ${rayCy})`}
          />
        ))}
      </g>

      <text
        x={dollarX}
        y={dollarY}
        textAnchor="middle"
        fill={`url(#${ids.gold})`}
        fontSize="12.3"
        fontWeight={900}
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontStyle="italic"
        style={{ filter: 'drop-shadow(0 1px 1px rgba(180, 83, 9, 0.45))' }}
      >
        $
      </text>

      {showCursor ? <CursorGraphic /> : null}
    </g>
  )
}

function Wordmark({
  x,
  y,
  fontSize = 11,
  tone = 'onDark',
}: {
  x: number
  y: number
  fontSize?: number
  tone?: 'onDark' | 'onLight'
}) {
  const a = tone === 'onDark' ? '#f1f5f9' : '#0c4a6e'
  const b = tone === 'onDark' ? '#fb923c' : '#ea580c'
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={fontSize}
      fontWeight={800}
      fontStyle="italic"
      fontFamily="Manrope, Plus Jakarta Sans, system-ui, sans-serif"
      letterSpacing="-0.03em"
    >
      <tspan fill={a}>TheClick</tspan>
      <tspan fill={b}>Builders</tspan>
    </text>
  )
}

export function BrandLogoGraphic({ variant = 'mark', className = '', title, showCursor = false }: BrandLogoGraphicProps) {
  const uid = useId().replace(/:/g, '')
  const ids: GradIds = {
    orbit: `tcb-orbit-${uid}`,
    screen: `tcb-screen-${uid}`,
    stair: `tcb-stair-${uid}`,
    gold: `tcb-gold-${uid}`,
    ray: `tcb-ray-${uid}`,
  }

  const label = title ?? 'TheClickBuilders'

  if (variant === 'full') {
    return (
      <svg
        className={className}
        viewBox="0 0 200 122"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={label}
      >
        <title>{label}</title>
        <LogoDefs ids={ids} />
        <g transform="translate(50, 4)">
          <LogoMarkContent ids={ids} showCursor={showCursor} />
        </g>
        <Wordmark x={100} y={116} fontSize={12.5} tone="onDark" />
      </svg>
    )
  }

  return (
    <svg
      className={className}
      viewBox="0 0 100 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <LogoDefs ids={ids} />
      <LogoMarkContent ids={ids} showCursor={showCursor} />
    </svg>
  )
}
