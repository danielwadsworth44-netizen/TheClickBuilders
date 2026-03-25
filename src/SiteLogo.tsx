type SiteLogoProps = {
  /** Extra classes (e.g. footer modifier). */
  className?: string
  /** Header uses eager load; footer can defer. */
  loading?: 'eager' | 'lazy'
}

/** Primary mark — transparent PNG so it sits flush on any background. */
const SRC = '/theclickbuilders-logo.png'
const WIDTH = 638
const HEIGHT = 398

export function SiteLogo({ className = '', loading = 'lazy' }: SiteLogoProps) {
  return (
    <img
      src={SRC}
      alt="TheClickBuilders"
      className={`brand-logo-img ${className}`.trim()}
      width={WIDTH}
      height={HEIGHT}
      loading={loading}
      decoding="async"
    />
  )
}
