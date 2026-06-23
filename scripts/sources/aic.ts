import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface AicResponse {
  data: Array<{
    id: number;
    title: string;
    artist_display: string;
    date_display: string;
    medium_display: string;
    image_id: string | null;
  }>;
  config: { iiif_url: string };
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  try {
    const url =
      `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(theme.query)}` +
      `&fields=id,title,artist_display,date_display,medium_display,image_id` +
      `&limit=${Math.min(limit * 2, 40)}`;
    const res = await fetchJson<AicResponse>(url);
    const out: RawCandidate[] = [];
    for (const item of res.data) {
      if (out.length >= limit) break;
      if (!item.image_id) continue;
      out.push({
        id: `aic:${item.id}`,
        title: item.title || "Untitled",
        artist: (item.artist_display || "Unknown").split("\n")[0],
        date: item.date_display || "",
        medium: item.medium_display || "",
        source: "Art Institute of Chicago",
        image: `${res.config.iiif_url}/${item.image_id}/full/843,/0/default.jpg`,
        link: `https://www.artic.edu/artworks/${item.id}`,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[aic] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const aic: SourceAdapter = {
  slug: "aic",
  name: "Art Institute of Chicago",
  available: () => true,
  search,
};
