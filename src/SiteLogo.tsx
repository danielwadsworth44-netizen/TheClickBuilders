type SiteLogoProps = {
  /** Extra classes (e.g. footer modifier). */
  className?: string
  /** Header uses eager load; footer can defer. */
  loading?: 'eager' | 'lazy'
}

const SRC = '/theclickbuilders-logo.jpg'
const WIDTH = 350
const HEIGHT = 223

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
