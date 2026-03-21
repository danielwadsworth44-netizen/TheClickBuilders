/**
 * Yelp Fusion API — use per https://www.yelp.com/developers/documentation/v3/business_search
 * Requires YELP_API_KEY; do not scrape yelp.com.
 */

export type YelpBusiness = {
  id: string
  name: string
  phone: string
  displayPhone: string
  address: string
  url: string
  categories: string[]
}

type YelpBizRow = {
  id: string
  name: string
  phone?: string
  display_phone?: string
  url?: string
  categories?: Array<{ title?: string; alias?: string }>
  location?: {
    display_address?: string[]
  }
}

type YelpSearchResponse = {
  businesses?: YelpBizRow[]
}

function buildAddress(b: YelpBizRow): string {
  const parts = b?.location?.display_address ?? []
  return parts.join(', ')
}

export async function searchYelpBusinesses(
  apiKey: string,
  params: {
    location: string
    term?: string
    categories?: string
    limit: number
    offset?: number
  },
): Promise<YelpBusiness[]> {
  const search = new URLSearchParams({
    location: params.location,
    limit: String(Math.min(50, Math.max(1, params.limit))),
  })
  if (params.term) search.set('term', params.term)
  if (params.categories) search.set('categories', params.categories)
  if (params.offset != null) search.set('offset', String(params.offset))

  const res = await fetch(`https://api.yelp.com/v3/businesses/search?${search.toString()}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Yelp Fusion search failed (${res.status}): ${errText}`)
  }

  const data = (await res.json()) as YelpSearchResponse
  const out: YelpBusiness[] = []
  for (const b of data.businesses ?? []) {
    out.push({
      id: b.id,
      name: b.name,
      phone: (b.phone ?? '').trim(),
      displayPhone: (b.display_phone ?? '').trim(),
      address: buildAddress(b),
      url: (b.url ?? '').trim(),
      categories: (b.categories ?? []).map((c) => c.title ?? c.alias ?? '').filter(Boolean),
    })
  }
  return out
}

/** Multiple small searches for trades / home services (Yelp category aliases). */
export const YELP_CATEGORY_SEARCHES: Array<{ categories?: string; term?: string; label: string }> =
  [
    { categories: 'painters', label: 'painters' },
    { categories: 'roofing', label: 'roofing' },
    { categories: 'contractors', label: 'contractors' },
    { term: 'pressure washing', label: 'pressure_washing' },
    { term: 'gutter cleaning', label: 'gutter_cleaning' },
    { term: 'fence contractor', label: 'fence' },
    { term: 'concrete contractor', label: 'concrete' },
  ]
