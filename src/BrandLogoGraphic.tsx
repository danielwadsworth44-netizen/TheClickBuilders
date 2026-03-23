import { useId } from 'react'

type BrandLogoGraphicProps = {
  variant?: 'mark' | 'full'
  className?: string
  title?: string
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
      <linearGradient id={ids.orbit} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="45%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <linearGradient id={ids.screen} x1="26" y1="40" x2="74" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="55%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <linearGradient id={ids.stair} x1="27" y1="67" x2="69" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#fbbf24" />
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

/**
 * Screen inner: x 26.5–73.5, y 40–68. Stairs climb BL→TR. Orbit is a single ring,
 * split into back/front arcs by the laptop so it reads like one sash.
 */
function LogoMarkContent({ ids }: { ids: GradIds }) {
  const steps = staircasePath()
  const orbitBack = 'M 4 61.5 A 46 16.5 0 0 1 96 61.5'
  const orbitFront = 'M 96 61.5 A 46 16.5 0 0 1 4 61.5'

  const dollarX = 67
  const dollarY = 44.2
  const rayCx = 67
  const rayCy = 42.8

  return (
    <g>
      {/* Single orbit, hidden behind the laptop on the back arc */}
      <path
        d={orbitBack}
        fill="none"
        stroke={`url(#${ids.orbit})`}
        strokeWidth="5.2"
        strokeLinecap="round"
        opacity={0.42}
      />

      {/* Laptop base */}
      <path d="M 18 71 L 82 71 L 86 76 L 14 76 Z" fill="#0c4a6e" />
      <path d="M 16 76 L 84 76 L 82 79 L 18 79 Z" fill="#082f47" opacity={0.85} />

      {/* Front half of the same orbit, visible across the middle like a sash */}
      <path
        d={orbitFront}
        fill="none"
        stroke={`url(#${ids.orbit})`}
        strokeWidth="5.2"
        strokeLinecap="round"
        opacity={0.98}
      />

      {/* Screen bezel + glass */}
      <path d="M 24 70 L 24 38 L 76 38 L 76 70 Z" fill="#0e3a5c" />
      <rect x="26.5" y="40" width="47" height="28" rx="1.2" fill={`url(#${ids.screen})`} />
      <ellipse cx="62" cy="46" rx="14" ry="8" fill="#fff" opacity={0.22} />

      {/* Readable staircase climbing bottom-left → top-right */}
      <path
        d={steps}
        fill="none"
        stroke="#7c2d12"
        strokeWidth="6.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
        opacity={0.32}
      />
      <path
        d={steps}
        fill="none"
        stroke={`url(#${ids.stair})`}
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* Rays + $ — top of stair path, still inside screen */}
      <g opacity={0.55}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1={rayCx}
            y1={rayCy}
            x2={rayCx}
            y2={rayCy - 8}
            stroke={`url(#${ids.ray})`}
            strokeWidth="1.2"
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
        fontSize="13"
        fontWeight={900}
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontStyle="italic"
        style={{ filter: 'drop-shadow(0 1px 1px rgba(180, 83, 9, 0.45))' }}
      >
        $
      </text>
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

export function BrandLogoGraphic({ variant = 'mark', className = '', title }: BrandLogoGraphicProps) {
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
          <LogoMarkContent ids={ids} />
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
      <LogoMarkContent ids={ids} />
    </svg>
  )
}
