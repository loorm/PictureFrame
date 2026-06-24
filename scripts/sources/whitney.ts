import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

/**
 * Whitney Museum's open-access GitHub dataset (artists.csv + artworks.csv)
 * contains titles and artist names but explicitly no image URLs and no
 * object-page links — both required fields. The Whitney website would need
 * scraping to fill in those gaps, which is out of scope here.
 *
 * Wikidata also has essentially no items tagged as being in the Whitney
 * collection (P195 / P276 queries return empty), so the Wikidata SPARQL
 * approach used by the wikimedia adapter doesn't help here either.
 *
 * Whitney content is not actually missing from the pool: their collection
 * focuses on Abstract Expressionism, Minimalism, Pop Art, and contemporary
 * American art — all of which have Wikidata movement QIDs (Q208189, Q80113,
 * Q605825) in our taxonomy. The wikimedia adapter's Wikidata SPARQL queries
 * already surface Whitney-era artists (Pollock, de Kooning, Hopper, etc.) via
 * those movement queries. No content gap — only a labelling one.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature must match SourceAdapter
async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  return [];
}

export const whitney: SourceAdapter = {
  slug: "whitney",
  name: "Whitney Museum of American Art",
  available: () => false,
  search,
};
