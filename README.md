# Art Frame

A single-page art display for a wall-mounted screen. It meanders slowly
through collections of artwork — grouped by era/style/region/medium, 3-10
pieces at a time — showing the title, artist, date, medium, and source
museum, plus a QR code linking to a museum or Wikipedia page for further
reading.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `Space` — play/pause
- `←` / `→` — previous/next piece
- `f` — toggle fullscreen
- `l` — download the view log as a CSV
- Mouse move / touch — reveal the control bar (auto-hides after a few seconds)

## How it picks what to show

There's no database and no live API calls from the deployed app — it's a
static site reading a JSON file that's grown offline.

- **The pool** (`src/data/collections.json`) is a flat list of collections,
  each tagged with a `themeId` from the ~40-entry taxonomy in
  `src/data/theme-taxonomy.ts` (eras, movements, regions, media — ancient to
  contemporary). Each piece is marked `fame: "anchor"` (a recognizable,
  deliberately-included work) or `"general"` (the long tail) — collections
  aim for roughly 20% anchor / 80% general.
- **The fetch pipeline** (`scripts/fetch-art.ts`, run via `npm run fetch-art`)
  pulls new collections from open museum/archive APIs (see
  `free_art_apis.md` for the source list) and appends to the pool. It always
  fills the **least-covered theme first** (tracked in
  `src/data/theme-coverage.json`) — so the pool grows breadth-first across
  the whole taxonomy rather than piling up on one era. It never removes
  existing collections.
- **The tour** (`src/lib/tour.ts`, `src/hooks/useTour.ts`) is what the app
  actually plays: a shuffled walk through the collection pool, with an
  occasional (~1 in 8) deliberate replay of something already seen this lap.
  Position is persisted in `localStorage`, so a reload continues the tour
  instead of restarting it.
- **The view log** (`src/lib/view-log.ts`) records every piece actually
  shown (title, artist, source, link, timestamp) to IndexedDB — sized for
  years of continuous logging, unlike `localStorage`. Press `l` or use the
  download icon in the control bar to export it as CSV.

## Structure

- `src/data/types.ts` — the shared shapes (`ArtPiece`, `Collection`, `Theme`, …).
- `src/data/theme-taxonomy.ts` — the fixed menu of themes the fetch pipeline draws from.
- `src/data/collections.json` / `theme-coverage.json` — the actual data, regenerated/extended by the fetch script.
- `scripts/fetch-art.ts` + `scripts/sources/*.ts` — one adapter module per API source.
- `src/components/ArtFrame.tsx` — the slideshow itself (timing, transitions, controls).
- `src/lib/tour.ts`, `src/hooks/useTour.ts` — the meandering playback order + persistence.
- `src/lib/view-log.ts` — the IndexedDB view log.
- `src/lib/wake-lock.ts` — keeps the screen from sleeping while this is running.
- Display settings (minutes per piece, whether to show captions/intros) are constants at the top of `ArtFrame.tsx`.

## Growing the collection pool

```bash
npm run fetch-art
```

Reads `SMITHSONIAN_API_KEY`, `HARVARD_API_KEY`, `EUROPEANA_API_KEY` from
`.env.local` (gitignored — see `API keys.md` for where to register; Unsplash
needs a key too but isn't registered yet, so it's stubbed and skipped).
Smithsonian is wired in but paused — their image CDN sends no `Content-Type`,
which Chrome's Opaque Response Blocking rejects for cross-origin images. The
11 already-fetched Smithsonian pieces were removed from the pool. Unsplash is
stubbed pending key registration. All other adapters are active.

Options: `npm run fetch-art -- --theme=<id>` restricts the run to one named
theme (a deliberate top-up); `--target=N` (or the `FETCH_ART_TARGET_PIECES`
env var) overrides how many new pieces to aim for, default 165.

This also runs automatically — `.github/workflows/fetch-art.yml` fires
monthly (1st of the month) adding a small batch (~30 pieces), or trigger it
manually from the Actions tab. It needs the three API keys above set as
**repository secrets** (Settings → Secrets and variables → Actions) — they're
never used at runtime by the deployed app, only by this job.

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com/new) — no
environment variables or backend services required for the deployed app
itself (the API keys above are only used when *running the fetch script*,
never at runtime).
