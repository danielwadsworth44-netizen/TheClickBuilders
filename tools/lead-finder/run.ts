#!/usr/bin/env npx tsx
/**
 * Lead finder CLI — uses official Google Places + Yelp Fusion APIs only.
 * Do not use this tool to scrape third-party sites or exceed provider terms.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { parseArgs } from './src/cli.js'
import { toCsvRow } from './src/csv.js'
import { collectFromGoogle, collectFromYelpEnriched, mergeLeads } from './src/collect.js'

function stamp(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2))
  if (!opts.location.trim()) {
    console.error('Error: --location is required (e.g. --location "Austin, TX")')
    process.exit(1)
  }

  const googleKey = process.env.GOOGLE_PLACES_API_KEY?.trim()
  const yelpKey = process.env.YELP_API_KEY?.trim()

  if (!googleKey) {
    console.error(
      'Error: GOOGLE_PLACES_API_KEY is required. Yelp modes use Google Places only to read public website URLs (no HTML scraping).',
    )
    process.exit(1)
  }
  if (opts.source === 'yelp' || opts.source === 'both') {
    if (!yelpKey) {
      console.error('Error: YELP_API_KEY is required for --source yelp or both.')
      process.exit(1)
    }
  }

  const outDir = resolve(opts.outDir)
  await mkdir(outDir, { recursive: true })

  let leads: Awaited<ReturnType<typeof collectFromGoogle>> = []

  if (opts.source === 'google') {
    leads = await collectFromGoogle({
      apiKey: googleKey!,
      location: opts.location,
      limit: opts.limit,
      delayMs: opts.delayMs,
    })
  } else if (opts.source === 'yelp') {
    leads = await collectFromYelpEnriched({
      googleKey: googleKey!,
      yelpKey: yelpKey!,
      location: opts.location,
      limit: opts.limit,
      delayMs: opts.delayMs,
    })
  } else {
    const g = await collectFromGoogle({
      apiKey: googleKey!,
      location: opts.location,
      limit: opts.limit,
      delayMs: opts.delayMs,
    })
    const y = await collectFromYelpEnriched({
      googleKey: googleKey!,
      yelpKey: yelpKey!,
      location: opts.location,
      limit: opts.limit,
      delayMs: opts.delayMs,
    })
    leads = mergeLeads(g, y, opts.limit)
  }

  const base = `leads_${stamp()}`
  const jsonPath = resolve(outDir, `${base}.json`)
  const csvPath = resolve(outDir, `${base}.csv`)

  await writeFile(jsonPath, JSON.stringify(leads, null, 2), 'utf8')

  const header = toCsvRow([
    'name',
    'phone',
    'address',
    'website',
    'place_id',
    'source',
    'source_query',
    'yelp_url',
  ])
  const lines = leads.map((l) =>
    toCsvRow([
      l.name,
      l.phone,
      l.address,
      l.website,
      l.placeId,
      l.source,
      l.sourceQuery,
      l.yelpUrl ?? '',
    ]),
  )
  await writeFile(csvPath, [header, ...lines].join('\n') + '\n', 'utf8')

  console.log(`Wrote ${leads.length} rows (max requested ${opts.limit}).`)
  console.log(`  ${jsonPath}`)
  console.log(`  ${csvPath}`)
  if (leads.some((l) => l.source === 'yelp_enriched' && !l.website)) {
    console.log(
      '\nNote: Some rows have no website match from Google — review manually before outreach.',
    )
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
