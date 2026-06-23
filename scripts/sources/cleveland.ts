import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface ClevelandResponse {
  data: Array<{
    id: number;
    title: string;
    creators: Array<{ description: string }>;
    creation_date: string;
    technique: string;
    images?: { web?: { url: string } };
    url: string;
  }>;
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  try {
    const url =
      `https://openaccess-api.clevelandart.org/api/artworks/?q=${encodeURIComponent(theme.query)}` +
      `&has_image=1&limit=${Math.min(limit * 2, 40)}`;
    const res = await fetchJson<ClevelandResponse>(url);
    const out: RawCandidate[] = [];
    for (const item of res.data) {
      if (out.length >= limit) break;
      if (!item.images?.web?.url) continue;
      out.push({
        id: `cma:${item.id}`,
        title: item.title || "Untitled",
        artist: item.creators?.[0]?.description || "Unknown",
        date: item.creation_date || "",
        medium: item.technique || "",
        source: "Cleveland Museum of Art",
        image: item.images.web.url,
        link: item.url || `https://www.clevelandart.org/art/${item.id}`,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[cleveland] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const cleveland: SourceAdapter = {
  slug: "cleveland",
  name: "Cleveland Museum of Art",
  available: () => true,
  search,
};
