import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { THEME_TAXONOMY } from "../src/data/theme-taxonomy";
import type { Collection, ThemeCoverage } from "../src/data/types";
import { ALL_SOURCES } from "./sources/index";
import type { FetchTheme, RawCandidate } from "./lib/types";

const DATA_DIR = join(__dirname, "..", "src", "data");
const COLLECTIONS_PATH = join(DATA_DIR, "collections.json");
const COVERAGE_PATH = join(DATA_DIR, "theme-coverage.json");

// Initial big seeding run target; the monthly CI job overrides this with a
// much smaller value via --target=N or the FETCH_ART_TARGET_PIECES env var.
const DEFAULT_TARGET_NEW_PIECES = 165;
const MIN_COLLECTION_SIZE = 3;
const MAX_COLLECTION_SIZE = 10;
const ANCHOR_RATIO = 0.2;

const cliArgs = process.argv.slice(2);
function cliArg(name: string): string | undefined {
  return cliArgs.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
}

// --theme=<id> restricts this run to a single named theme, ignoring the
// usual breadth-first ordering — useful for a deliberate top-up.
const ONLY_THEME = cliArg("theme");

const TARGET_NEW_PIECES = Number(
  cliArg("target") ?? process.env.FETCH_ART_TARGET_PIECES ?? DEFAULT_TARGET_NEW_PIECES
);

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function rotate<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0) return arr;
  const n = offset % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
}

async function fillCollection(
  theme: FetchTheme,
  targetSize: number,
  sources: typeof ALL_SOURCES,
  existingIds: Set<string>,
  existingImages: Set<string>
): Promise<RawCandidate[]> {
  const collected: RawCandidate[] = [];
  for (const source of sources) {
    if (collected.length >= targetSize) break;
    const remaining = targetSize - collected.length;
    let batch: RawCandidate[] = [];
    try {
      batch = await source.search(theme, Math.min(remaining + 2, 6));
    } catch (err) {
      console.warn(`  [${source.slug}] threw unexpectedly:`, (err as Error).message);
      continue;
    }
    for (const cand of batch) {
      if (collected.length >= targetSize) break;
      if (existingIds.has(cand.id) || existingImages.has(cand.image)) continue;
      if (collected.some((c) => c.id === cand.id || c.image === cand.image)) continue;
      collected.push(cand);
    }
  }
  return collected;
}

async function main() {
  const collections: Collection[] = JSON.parse(readFileSync(COLLECTIONS_PATH, "utf-8"));
  const coverage: ThemeCoverage = JSON.parse(readFileSync(COVERAGE_PATH, "utf-8"));

  const existingIds = new Set<string>();
  const existingImages = new Set<string>();
  for (const c of collections) {
    for (const p of c.pieces) {
      existingIds.add(p.id);
      existingImages.add(p.image);
    }
  }

  const availableSources = ALL_SOURCES.filter((s) => s.available());
  const skippedSources = ALL_SOURCES.filter((s) => !s.available());
  console.log(`Sources available: ${availableSources.map((s) => s.slug).join(", ")}`);
  console.log(`Sources skipped: ${skippedSources.map((s) => s.slug).join(", ") || "none"}`);

  if (ONLY_THEME && !coverage[ONLY_THEME]) {
    throw new Error(`Unknown theme id: ${ONLY_THEME}`);
  }

  const orderedThemeIds = ONLY_THEME
    ? [ONLY_THEME]
    : Object.keys(coverage).sort((a, b) => {
        const ca = coverage[a];
        const cb = coverage[b];
        if (ca.count !== cb.count) return ca.count - cb.count;
        const la = ca.lastFetched ?? "";
        const lb = cb.lastFetched ?? "";
        return la.localeCompare(lb);
      });

  const sourceReport = new Map<string, number>();
  let newPieceCount = 0;
  let newCollectionCount = 0;
  let themeIndex = 0;
  const skippedThemes: string[] = [];

  for (const themeId of orderedThemeIds) {
    if (newPieceCount >= TARGET_NEW_PIECES) break;
    const themeDef = THEME_TAXONOMY.find((t) => t.id === themeId);
    if (!themeDef) continue;

    const targetSize =
      MIN_COLLECTION_SIZE + Math.floor(Math.random() * (MAX_COLLECTION_SIZE - MIN_COLLECTION_SIZE + 1));
    const fetchTheme: FetchTheme = {
      ...themeDef,
      query: themeDef.searchQuery ?? themeDef.title,
    };
    const sourcesForTheme = rotate(availableSources, themeIndex);
    themeIndex++;

    console.log(`\n[${themeId}] target size ${targetSize}, sources: ${sourcesForTheme.map((s) => s.slug).join(", ")}`);
    const candidates = await fillCollection(fetchTheme, targetSize, sourcesForTheme, existingIds, existingImages);

    if (candidates.length < MIN_COLLECTION_SIZE) {
      console.log(`  -> only found ${candidates.length}, below minimum ${MIN_COLLECTION_SIZE}; skipping this theme for now`);
      skippedThemes.push(themeId);
      continue;
    }

    const shuffled = shuffle(candidates);
    const anchorCount = Math.max(1, Math.round(shuffled.length * ANCHOR_RATIO));
    const pieces = shuffled.map((p, i) => ({
      ...p,
      fame: (i < anchorCount ? "anchor" : "general") as "anchor" | "general",
    }));

    for (const p of pieces) {
      existingIds.add(p.id);
      existingImages.add(p.image);
      sourceReport.set(p.source, (sourceReport.get(p.source) ?? 0) + 1);
    }

    const instanceNumber = collections.filter((c) => c.themeId === themeId).length + 1;
    collections.push({
      id: `${themeId}-${instanceNumber}`,
      themeId,
      title: themeDef.title,
      era: themeDef.era,
      blurb: themeDef.blurb,
      accent: themeDef.accent,
      accent2: themeDef.accent2,
      pieces,
    });

    coverage[themeId] = { count: coverage[themeId].count + 1, lastFetched: todayIso() };
    newPieceCount += pieces.length;
    newCollectionCount++;
    console.log(`  -> added ${pieces.length} pieces (${anchorCount} anchor / ${pieces.length - anchorCount} general)`);
  }

  writeFileSync(COLLECTIONS_PATH, JSON.stringify(collections, null, 2) + "\n");
  writeFileSync(COVERAGE_PATH, JSON.stringify(coverage, null, 2) + "\n");

  console.log("\n=== Fetch run complete ===");
  console.log(`New collections: ${newCollectionCount}`);
  console.log(`New pieces: ${newPieceCount}`);
  console.log(`Total collections now: ${collections.length}`);
  console.log(`Total pieces now: ${collections.reduce((n, c) => n + c.pieces.length, 0)}`);
  console.log("Pieces per source (this run):");
  for (const [source, count] of [...sourceReport.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${source}: ${count}`);
  }
  if (skippedThemes.length) {
    console.log(`Themes skipped this run (insufficient yield, will be retried first next run): ${skippedThemes.join(", ")}`);
  }
}

main().catch((err) => {
  console.error("Fetch run failed:", err);
  process.exitCode = 1;
});
