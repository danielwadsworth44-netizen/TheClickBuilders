import { hasCustomDomain } from './domain.js'

export type GooglePlaceHit = {
  placeId: string
  name: string
  address: string
  phone: string
  websiteUri: string
  sourceQuery: string
}

type SearchTextResponse = {
  places?: Array<{
    id?: string
    name?: string
    displayName?: { text?: string }
    formattedAddress?: string
    nationalPhoneNumber?: string
    websiteUri?: string
  }>
  nextPageToken?: string
}

const FIELD_MASK =
  'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri'

export async function searchTextPlaces(
  apiKey: string,
  textQuery: string,
  pageToken?: string,
): Promise<{ results: GooglePlaceHit[]; nextPageToken?: string }> {
  const body: Record<string, string> = { textQuery }
  if (pageToken) body.pageToken = pageToken

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Google Places searchText failed (${res.status}): ${errText}`)
  }

  const data = (await res.json()) as SearchTextResponse
  const results: GooglePlaceHit[] = []
  for (const p of data.places ?? []) {
    const placeId = (
      p.id ??
      p.name?.replace(/^places\//, '') ??
      ''
    ).trim()
    if (!placeId) continue
    const name = p.displayName?.text?.trim() ?? ''
    results.push({
      placeId,
      name,
      address: (p.formattedAddress ?? '').trim(),
      phone: (p.nationalPhoneNumber ?? '').trim(),
      websiteUri: (p.websiteUri ?? '').trim(),
      sourceQuery: textQuery,
    })
  }
  return { results, nextPageToken: data.nextPageToken }
}

/** Keep leads that have no custom domain (platform / no site / builder subdomain is OK). */
export function filterNoCustomDomain(hits: GooglePlaceHit[]): GooglePlaceHit[] {
  return hits.filter((h) => !hasCustomDomain(h.websiteUri))
}
