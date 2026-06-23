import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface UnsplashResponse {
  results: Array<{
    id: string;
    description?: string;
    alt_description?: string;
    user?: { name?: string };
    urls?: { regular?: string };
    links?: { html?: string };
  }>;
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.log("[unsplash] no UNSPLASH_ACCESS_KEY set, skipping");
    return [];
  }
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(theme.query)}&per_page=${Math.min(limit * 2, 30)}`;
    const res = await fetchJson<UnsplashResponse>(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
    const out: RawCandidate[] = [];
    for (const item of res.results) {
      if (out.length >= limit) break;
      if (!item.urls?.regular) continue;
      out.push({
        id: `unsplash:${item.id}`,
        title: item.description || item.alt_description || "Untitled",
        artist: item.user?.name || "Unknown",
        date: "",
        medium: "Photograph",
        source: "Unsplash",
        image: item.urls.regular,
        link: item.links?.html || `https://unsplash.com/photos/${item.id}`,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[unsplash] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const unsplash: SourceAdapter = {
  slug: "unsplash",
  name: "Unsplash",
  // Stubbed until UNSPLASH_ACCESS_KEY is registered and added to .env.local.
  available: () => Boolean(process.env.UNSPLASH_ACCESS_KEY),
  search,
};
