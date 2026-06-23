import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

/**
 * Whitney Museum publishes an open dataset (github.com/whitneymuseum/open-access,
 * artists.csv + artworks.csv) but it explicitly excludes images and object-page
 * links — both required fields for us. Using it would mean either fabricating a
 * link/image (not acceptable) or scraping whitney.org separately (out of scope
 * for this pipeline). Stubbed until that's resolved; flagged in the fetch report.
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
