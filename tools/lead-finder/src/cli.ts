export type SourceMode = 'google' | 'yelp' | 'both'

export type CliOptions = {
  location: string
  limit: number
  source: SourceMode
  delayMs: number
  outDir: string
}

function parseIntSafe(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n : fallback
}

export function parseArgs(argv: string[]): CliOptions {
  let location = ''
  let limit = 25
  let source: SourceMode = 'google'
  let delayMs = 120
  let outDir = 'tools/lead-finder/out'

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--location' || a === '-l') {
      location = argv[++i] ?? ''
    } else if (a === '--limit' || a === '-n') {
      limit = parseIntSafe(argv[++i], 25)
    } else if (a === '--source' || a === '-s') {
      const v = (argv[++i] ?? 'google').toLowerCase()
      if (v === 'google' || v === 'yelp' || v === 'both') source = v
    } else if (a === '--delay-ms') {
      delayMs = parseIntSafe(argv[++i], 120)
    } else if (a === '--out' || a === '-o') {
      outDir = argv[++i] ?? outDir
    } else if (a === '--help' || a === '-h') {
      printHelp()
      process.exit(0)
    }
  }

  limit = Math.min(50, Math.max(1, limit))
  delayMs = Math.min(2000, Math.max(0, delayMs))

  return { location, limit, source, delayMs, outDir }
}

export function printHelp(): void {
  console.log(`
TheClickBuilders — lead finder (API-only, no scraping)

Uses official Google Places API (New) and/or Yelp Fusion API.
Review each provider's terms: Google Cloud Maps Platform, Yelp Fusion.

Usage:
  npm run leads -- --location "City, ST" [options]

Options:
  -l, --location   Required. e.g. "Austin, TX"
  -n, --limit      Max leads per run (1–50). Default 25.
  -s, --source     google | yelp | both   Default google
      --delay-ms   Pause between API calls (ms). Default 120.
  -o, --out        Output directory. Default tools/lead-finder/out

Environment:
  GOOGLE_PLACES_API_KEY   Required for every mode (Places reads public website URLs; no scraping)
  YELP_API_KEY            Required for --source yelp or both

Examples:
  npm run leads -- --location "Denver, CO" --limit 25
  npm run leads -- --location "Phoenix, AZ" --source both --limit 15
`)
}
