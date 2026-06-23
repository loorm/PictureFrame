import { fetchJson, sleep } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface MetSearchResponse {
  total: number;
  objectIDs: number[] | null;
}

interface MetObject {
  objectID: number;
  isHighlight: boolean;
  primaryImage: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  medium: string;
  objectURL: string;
}

const BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  try {
    const searchUrl = `${BASE}/search?hasImages=true&q=${encodeURIComponent(theme.query)}`;
    const { objectIDs } = await fetchJson<MetSearchResponse>(searchUrl);
    if (!objectIDs || objectIDs.length === 0) return [];

    const candidateIds = objectIDs.slice(0, Math.min(objectIDs.length, limit * 4));
    const out: RawCandidate[] = [];
    for (const id of candidateIds) {
      if (out.length >= limit) break;
      try {
        const obj = await fetchJson<MetObject>(`${BASE}/objects/${id}`);
        if (!obj.primaryImage) continue;
        out.push({
          id: `met:${obj.objectID}`,
          title: obj.title || "Untitled",
          artist: obj.artistDisplayName || "Unknown",
          date: obj.objectDate || "",
          medium: obj.medium || "",
          source: "The Metropolitan Museum of Art",
          image: obj.primaryImage,
          link: obj.objectURL || `https://www.metmuseum.org/art/collection/search/${obj.objectID}`,
        });
      } catch {
        // skip this object, try the next id
      }
      await sleep(220);
    }
    return out;
  } catch (err) {
    console.warn(`[met] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const met: SourceAdapter = {
  slug: "met",
  name: "The Metropolitan Museum of Art",
  available: () => true,
  search,
};
