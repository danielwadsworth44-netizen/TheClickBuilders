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
      <linearGradient id={ids.stair} x1="30" y1="64" x2="54" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
      <linearGradient id={ids.gold} x1="44" y1="22" x2="56" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id={ids.ray} x1="50" y1="22" x2="50" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
      </linearGradient>
    </defs>
  )
}

/** SplashScreen cursor path uses the same geometry: full SVG viewBox 200×118, g translate(50,4). */
function LogoMarkContent({ ids }: { ids: GradIds }) {
  return (
    <g>
      <ellipse
        cx="50"
        cy="56"
        rx="44"
        ry="19"
        fill="none"
        stroke={`url(#${ids.orbit})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity={0.95}
      />

      <path d="M 18 71 L 82 71 L 86 76 L 14 76 Z" fill="#0c4a6e" />
      <path d="M 16 76 L 84 76 L 82 79 L 18 79 Z" fill="#082f47" opacity={0.85} />

      <path d="M 24 70 L 24 38 L 76 38 L 76 70 Z" fill="#0e3a5c" />
      <rect x="26.5" y="40" width="47" height="28" rx="1.2" fill={`url(#${ids.screen})`} />
      <ellipse cx="62" cy="46" rx="14" ry="8" fill="#fff" opacity={0.22} />

      <path d="M 30 64 L 38 64 L 38 60 L 30 60 Z" fill={`url(#${ids.stair})`} />
      <path d="M 32 60 L 42 60 L 42 55 L 32 55 Z" fill={`url(#${ids.stair})`} opacity={0.95} />
      <path d="M 35 55 L 46 55 L 46 49 L 35 49 Z" fill={`url(#${ids.stair})`} opacity={0.92} />
      <path d="M 38 49 L 50 49 L 50 42 L 38 42 Z" fill={`url(#${ids.stair})`} opacity={0.9} />
      <path d="M 42 42 L 54 42 L 54 36 L 42 36 Z" fill={`url(#${ids.stair})`} opacity={0.88} />

      <g opacity={0.55}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="30"
            x2="50"
            y2="22"
            stroke={`url(#${ids.ray})`}
            strokeWidth="1.2"
            strokeLinecap="round"
            transform={`rotate(${deg} 50 30)`}
          />
        ))}
      </g>

      <text
        x="50"
        y="34"
        textAnchor="middle"
        fill={`url(#${ids.gold})`}
        fontSize="14"
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

/**
 * Vector brand mark: orange→blue orbit, laptop, stairs, dollar + rays.
 * “Full” adds the two-tone wordmark below (matches original PNG intent).
 */
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
        viewBox="0 0 200 118"
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
        <text
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="12.5"
          fontWeight={800}
          fontStyle="italic"
          fontFamily="Manrope, Plus Jakarta Sans, system-ui, sans-serif"
          letterSpacing="-0.03em"
        >
          <tspan fill="#0c4a6e">TheClick</tspan>
          <tspan fill="#ea580c">Builders</tspan>
        </text>
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
