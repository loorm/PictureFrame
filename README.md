# Art Frame

A single-page art display for a wall-mounted screen. It cycles slowly through
collections of artwork — grouped by era/style, ~3-15 pieces at a time — showing
the title, artist, date, and a QR code linking to a museum or Wikipedia page
for further reading.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `Space` — play/pause
- `←` / `→` — previous/next piece
- `f` — toggle fullscreen
- Mouse move / touch — reveal the control bar (auto-hides after a few seconds)

## Structure

- `src/data/collections.ts` — the art data: collections, each with an era,
  blurb, and pieces (title/artist/date/medium/image/link). This is the only
  data source the app reads from; there's no database.
- `src/components/ArtFrame.tsx` — the slideshow itself (timing, transitions,
  controls).
- Display settings (minutes per piece, whether to show captions/intros) are
  constants at the top of `ArtFrame.tsx`.

`Art Frame.dc.html` / `support.js` / `.thumbnail` are the original Claude
design-tool prototype, kept only as a visual reference — they aren't part of
the deployed app.

## Adding/expanding collections

Edit `src/data/collections.ts` directly, or see the project discussion about
a script that pulls structured data (title/artist/date/image/link) from open
art APIs (Wikidata, museum open-access APIs) to help grow this file over time.

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com/new) — no
environment variables or backend services required.
