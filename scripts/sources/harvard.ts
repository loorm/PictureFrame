import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface HarvardResponse {
  records: Array<{
    id: number;
    title: string;
    people?: Array<{ name?: string; role?: string }>;
    dated?: string;
    medium?: string;
    primaryimageurl?: string;
    url?: string;
  }>;
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  const apiKey = process.env.HARVARD_API_KEY;
  if (!apiKey) return [];
  try {
    const url =
      `https://api.harvardartmuseums.org/object?apikey=${apiKey}` +
      `&q=${encodeURIComponent(theme.query)}&hasimage=1&size=${Math.min(limit * 2, 40)}`;
    const res = await fetchJson<HarvardResponse>(url);
    const out: RawCandidate[] = [];
    for (const item of res.records) {
      if (out.length >= limit) break;
      if (!item.primaryimageurl) continue;
      const artist = item.people?.find((p) => p.role === "Artist")?.name ?? item.people?.[0]?.name;
      out.push({
        id: `harvard:${item.id}`,
        title: item.title || "Untitled",
        artist: artist || "Unknown",
        date: item.dated || "",
        medium: item.medium || "",
        source: "Harvard Art Museums",
        image: item.primaryimageurl,
        link: item.url || `https://harvardartmuseums.org/collections/object/${item.id}`,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[harvard] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const harvard: SourceAdapter = {
  slug: "harvard",
  name: "Harvard Art Museums",
  available: () => Boolean(process.env.HARVARD_API_KEY),
  search,
};
