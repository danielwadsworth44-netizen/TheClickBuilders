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

/** Stair quads from bottom-left → top-right across the screen */
function stairFaces(bl: [number, number], tr: [number, number], steps: number, thickness: number) {
  const dx = tr[0] - bl[0]
  const dy = tr[1] - bl[1]
  const len = Math.hypot(dx, dy)
  const px = (-dy / len) * thickness
  const py = (dx / len) * thickness
  const faces: string[] = []
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps
    const t1 = (i + 1) / steps
    const ax = bl[0] + t0 * dx
    const ay = bl[1] + t0 * dy
    const bx = bl[0] + t1 * dx
    const by = bl[1] + t1 * dy
    const cx = bx + px
    const cy = by + py
    const ddx = ax + px
    const ddy = ay + py
    faces.push(`M ${ax} ${ay} L ${bx} ${by} L ${cx} ${cy} L ${ddx} ${ddy} Z`)
  }
  return faces
}

/**
 * Screen inner: x 26.5–73.5, y 40–68. Stairs BL→TR. Orbit: subtle back ring + bold front ring below laptop.
 * SplashScreen cursor math: full viewBox 200×118, g translate(50,4).
 */
function LogoMarkContent({ ids }: { ids: GradIds }) {
  const bl: [number, number] = [27.5, 66.2]
  const tr: [number, number] = [69.5, 42.5]
  const steps = stairFaces(bl, tr, 6, 2.8)

  const dollarX = 66
  const dollarY = 44
  const rayCx = 66
  const rayCy = 42.5

  return (
    <g>
      {/* Back ring — full ellipse, sits behind the machine */}
      <ellipse
        cx="50"
        cy="56"
        rx="42"
        ry="16"
        fill="none"
        stroke={`url(#${ids.orbit})`}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.38}
      />

      {/* Laptop base */}
      <path d="M 18 71 L 82 71 L 86 76 L 14 76 Z" fill="#0c4a6e" />
      <path d="M 16 76 L 84 76 L 82 79 L 18 79 Z" fill="#082f47" opacity={0.85} />

      {/* Front ring — wide, low; reads in front of the keyboard / below the screen */}
      <ellipse
        cx="50"
        cy="80.5"
        rx="52"
        ry="9"
        fill="none"
        stroke={`url(#${ids.orbit})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        opacity={0.98}
      />

      {/* Screen bezel + glass */}
      <path d="M 24 70 L 24 38 L 76 38 L 76 70 Z" fill="#0e3a5c" />
      <rect x="26.5" y="40" width="47" height="28" rx="1.2" fill={`url(#${ids.screen})`} />
      <ellipse cx="62" cy="46" rx="14" ry="8" fill="#fff" opacity={0.22} />

      {/* Stairs climbing bottom-left → top-right */}
      {steps.map((d, i) => (
        <path key={i} d={d} fill={`url(#${ids.stair})`} opacity={0.88 + i * 0.02} />
      ))}

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
