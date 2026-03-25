type SiteLogoProps = {
  /** Extra classes (e.g. footer modifier). */
  className?: string
  /** Header uses eager load; footer can defer. */
  loading?: 'eager' | 'lazy'
}

/** Primary mark (dark canvas); use a light-background asset elsewhere if needed. */
const SRC = '/theclickbuilders-logo.png'
const WIDTH = 653
const HEIGHT = 408

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
