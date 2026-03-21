# Lead finder (API-only)

Finds local businesses in **painting, construction, roofing, pressure washing**, and similar trades where they **do not appear to use a custom domain** (Facebook / Yelp / Instagram / Wix subdomains / no site are OK).

## Compliance

- **No scraping** of Yelp, Facebook, or other sites. This tool only calls **Google Places API (New)** and **Yelp Fusion API** over HTTPS, as documented by each provider.
- You are responsible for complying with [Google Maps Platform Terms](https://cloud.google.com/maps-platform/terms), [Yelp Fusion Terms](https://www.yelp.com/developers/terms), applicable privacy laws (TCPA, state rules, etc.), and your own outreach policies.
- **Volume**: A few hundred rows per week and ~25 per run is well within typical API limits; still monitor quotas and billing in Google Cloud / Yelp.

## What you need

1. **Google Cloud**
   - Create a project, enable **Places API (New)** (and billing if required).
   - Create an API key; restrict it to Places API and (ideally) your IP.
   - Yelp-related modes still use Google only to read **public** `websiteUri` fields (no HTML scraping).

2. **Yelp** (optional, for `--source yelp` or `both`)
   - Create a [Yelp Fusion](https://www.yelp.com/developers) app and copy the API key.

3. **Environment**

   ```bash
   export GOOGLE_PLACES_API_KEY="your-key"
   export YELP_API_KEY="your-yelp-key"   # only for yelp / both
   ```

   Or add the same variables to a `.env` file and load them before running (this repo does not auto-load `.env` for the CLI—use `export` or `source`).

## Usage

From the repo root:

```bash
npm run leads -- --location "Denver, CO" --limit 25 --source google
```

| Flag | Meaning |
|------|---------|
| `--location` | City/region, e.g. `"Austin, TX"` |
| `--limit` | Max rows (1–50) |
| `--source` | `google` (default), `yelp`, or `both` |
| `--delay-ms` | Pause between requests (default 120) |
| `--out` | Output folder (default `tools/lead-finder/out`) |

### How filtering works

- **Google mode**: Runs several industry text searches via Places, keeps listings whose **website** is missing or looks like a **platform / free builder** (see `src/domain.ts`), and **requires a phone** on the listing.
- **Yelp mode**: Loads businesses from Yelp Fusion, then for each row runs a **Google text search** by name + address to read `websiteUri` when possible. Rows without a Google match are still emitted **only if Yelp shows a phone**, with empty `website` and a note in `source_query` for **manual review** (domain not verified).

We **do not** try to detect “owner cell” vs business line; you only get whatever phone the APIs return.

## Output

CSV + JSON under `tools/lead-finder/out/` (gitignored). Columns include `name`, `phone`, `address`, `website`, `place_id`, `source`, `source_query`, `yelp_url`.

## Is 25 at a time / a few hundred per week a problem?

Usually **no** for API quotas at that volume. Set conservative `--delay-ms`, watch Google billing, and stay within Yelp’s documented limits.
