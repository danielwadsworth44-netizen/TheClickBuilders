/**
 * Classifies whether a URL looks like a business-owned custom domain.
 * Platform-only presence (Facebook, Yelp, Wix subdomains, etc.) => not a custom domain.
 */
const PLATFORM_HOSTS = new Set([
  'facebook.com',
  'fb.com',
  'm.facebook.com',
  'instagram.com',
  'yelp.com',
  'm.yelp.com',
  'youtube.com',
  'youtu.be',
  'linkedin.com',
  'twitter.com',
  'x.com',
  'tiktok.com',
  'pinterest.com',
  'nextdoor.com',
  'maps.google.com',
  'google.com',
  'g.page',
  'linktr.ee',
  'hoo.link',
  'solo.to',
])

function normalizeHostname(raw: string): string {
  try {
    const withProto = raw.includes('://') ? raw : `https://${raw}`
    const host = new URL(withProto).hostname.toLowerCase()
    return host.startsWith('www.') ? host.slice(4) : host
  } catch {
    return ''
  }
}

function isFreeBuilderSubdomain(hostname: string): boolean {
  const freeSuffixes = [
    '.wixsite.com',
    '.square.site',
    '.wordpress.com',
    '.blogspot.com',
    '.github.io',
    '.netlify.app',
    '.vercel.app',
    '.herokuapp.com',
    '.weebly.com',
    '.sites.google.com',
  ]
  return freeSuffixes.some((s) => hostname.endsWith(s) || hostname.includes(s))
}

function isPlatformHost(hostname: string): boolean {
  if (!hostname) return true
  if (PLATFORM_HOSTS.has(hostname)) return true
  for (const p of PLATFORM_HOSTS) {
    if (hostname === p || hostname.endsWith(`.${p}`)) return true
  }
  return false
}

/** True when the business appears to use its own domain (exclude from "no custom domain" list). */
export function hasCustomDomain(websiteUri: string | null | undefined): boolean {
  if (!websiteUri || !websiteUri.trim()) return false
  const hostname = normalizeHostname(websiteUri.trim())
  if (!hostname) return false
  if (isPlatformHost(hostname)) return false
  if (isFreeBuilderSubdomain(hostname)) return false
  return true
}
