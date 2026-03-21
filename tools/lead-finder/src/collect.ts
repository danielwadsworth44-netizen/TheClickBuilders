import { hasCustomDomain } from './domain.js'
import { filterNoCustomDomain, searchTextPlaces, type GooglePlaceHit } from './google-places.js'
import { searchYelpBusinesses, YELP_CATEGORY_SEARCHES } from './yelp.js'

const GOOGLE_INDUSTRY_TERMS = [
  'painting contractor',
  'house painter',
  'roofing contractor',
  'residential construction',
  'general contractor',
  'pressure washing',
  'deck staining',
  'hardscaping contractor',
]

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export type CollectedLead = {
  name: string
  phone: string
  address: string
  website: string
  placeId: string
  sourceQuery: string
  yelpUrl?: string
  source: 'google' | 'yelp_enriched'
}

function hitToLead(hit: GooglePlaceHit, source: CollectedLead['source'], yelpUrl?: string): CollectedLead {
  return {
    name: hit.name,
    phone: hit.phone,
    address: hit.address,
    website: hit.websiteUri,
    placeId: hit.placeId,
    sourceQuery: hit.sourceQuery,
    yelpUrl,
    source,
  }
}

/** Collect up to `limit` leads from Google Places text search (no custom domain, phone required). */
export async function collectFromGoogle(options: {
  apiKey: string
  location: string
  limit: number
  delayMs: number
}): Promise<CollectedLead[]> {
  const { apiKey, location, limit, delayMs } = options
  const seen = new Set<string>()
  const qualified: CollectedLead[] = []

  outer: for (const term of GOOGLE_INDUSTRY_TERMS) {
    if (qualified.length >= limit) break outer
    const textQuery = `${term} in ${location}`
    let pageToken: string | undefined
    do {
      if (delayMs > 0) await sleep(delayMs)
      const { results, nextPageToken } = await searchTextPlaces(apiKey, textQuery, pageToken)
      pageToken = nextPageToken
      const filtered = filterNoCustomDomain(results)
      for (const hit of filtered) {
        if (!hit.phone.trim()) continue
        if (seen.has(hit.placeId)) continue
        seen.add(hit.placeId)
        qualified.push(hitToLead(hit, 'google'))
        if (qualified.length >= limit) break outer
      }
      if (!pageToken) break
    } while (qualified.length < limit)
  }

  return qualified
}

/**
 * Yelp Fusion + Google enrichment: one Places search per Yelp row to read websiteUri.
 * Filters out businesses with a custom domain when enrichment matches.
 * Rows without a Google match may still appear (for manual review) if Yelp lists a phone.
 */
export async function collectFromYelpEnriched(options: {
  googleKey: string
  yelpKey: string
  location: string
  limit: number
  delayMs: number
}): Promise<CollectedLead[]> {
  const { googleKey, yelpKey, location, limit, delayMs } = options
  const seenYelpIds = new Set<string>()
  const seenPlaceIds = new Set<string>()
  const out: CollectedLead[] = []

  for (const spec of YELP_CATEGORY_SEARCHES) {
    if (out.length >= limit) break
    if (delayMs > 0) await sleep(delayMs)
    const batch = await searchYelpBusinesses(yelpKey, {
      location,
      limit: Math.min(50, limit + 15),
      term: spec.term,
      categories: spec.categories,
    })

    for (const y of batch) {
      if (out.length >= limit) break
      if (seenYelpIds.has(y.id)) continue
      seenYelpIds.add(y.id)

      const phoneFromYelp = (y.phone || y.displayPhone).trim()
      if (!phoneFromYelp) continue

      const textQuery = `${y.name} ${y.address}`.trim()
      if (delayMs > 0) await sleep(delayMs)
      const { results } = await searchTextPlaces(googleKey, textQuery)
      const first = results[0]

      if (!first) {
        out.push({
          name: y.name,
          phone: phoneFromYelp,
          address: y.address,
          website: '',
          placeId: `yelp:${y.id}`,
          sourceQuery: `yelp:${spec.label} (no Google match)`,
          yelpUrl: y.url,
          source: 'yelp_enriched',
        })
        continue
      }

      if (hasCustomDomain(first.websiteUri)) continue
      if (seenPlaceIds.has(first.placeId)) continue
      seenPlaceIds.add(first.placeId)

      const phone = (first.phone || phoneFromYelp).trim()
      if (!phone) continue

      out.push({
        name: first.name || y.name,
        phone,
        address: first.address || y.address,
        website: first.websiteUri,
        placeId: first.placeId,
        sourceQuery: `yelp:${spec.label} → ${textQuery}`,
        yelpUrl: y.url,
        source: 'yelp_enriched',
      })
    }
  }

  return out.slice(0, limit)
}

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '')
}

/** Merge by normalized phone or place id; keep Google-sourced rows when duplicate. */
export function mergeLeads(a: CollectedLead[], b: CollectedLead[], limit: number): CollectedLead[] {
  const key = (l: CollectedLead) => {
    const p = normalizePhone(l.phone)
    return p || l.placeId
  }
  const map = new Map<string, CollectedLead>()
  for (const l of a) {
    map.set(key(l), l)
  }
  for (const l of b) {
    const k = key(l)
    const existing = map.get(k)
    if (!existing || existing.source === 'yelp_enriched') {
      map.set(k, l)
    }
  }
  return [...map.values()].slice(0, limit)
}
