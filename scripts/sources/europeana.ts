import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface EuropeanaResponse {
  items: Array<{
    id: string;
    title?: string[];
    dcCreator?: string[];
    year?: string[];
    edmIsShownAt?: string[];
    edmIsShownBy?: string[];
    edmPreview?: string[];
    dataProvider?: string[];
  }>;
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  const apiKey = process.env.EUROPEANA_API_KEY;
  if (!apiKey) return [];
  try {
    const url =
      `https://api.europeana.eu/record/v2/search.json?wskey=${apiKey}` +
      `&query=${encodeURIComponent(theme.query)}&media=true&qf=TYPE:IMAGE` +
      `&rows=${Math.min(limit * 2, 40)}`;
    const res = await fetchJson<EuropeanaResponse>(url);
    const out: RawCandidate[] = [];
    for (const item of res.items) {
      if (out.length >= limit) break;
      const image = item.edmIsShownBy?.[0] || item.edmPreview?.[0];
      if (!image) continue;
      out.push({
        id: `europeana:${item.id.replace(/^\//, "").replace(/\//g, "-")}`,
        title: item.title?.[0] || "Untitled",
        artist: item.dcCreator?.[0] || "Unknown",
        date: item.year?.[0] || "",
        medium: "",
        source: item.dataProvider?.[0] || "Europeana",
        image,
        link: item.edmIsShownAt?.[0] || `https://www.europeana.eu/item${item.id}`,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[europeana] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const europeana: SourceAdapter = {
  slug: "europeana",
  name: "Europeana",
  available: () => Boolean(process.env.EUROPEANA_API_KEY),
  search,
};
