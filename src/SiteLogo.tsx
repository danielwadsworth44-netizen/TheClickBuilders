type SiteLogoProps = {
  /** Extra classes (e.g. footer modifier). */
  className?: string
  /** Header uses eager load; footer can defer. */
  loading?: 'eager' | 'lazy'
}

/** Primary mark — full-color PNG (includes brand navy plate). */
const SRC = '/theclickbuilders-logo.png'
const WIDTH = 1024
const HEIGHT = 682

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
