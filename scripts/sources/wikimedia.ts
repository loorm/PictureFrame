import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface CommonsSearchResponse {
  query?: { search: Array<{ title: string }> };
}

interface CommonsImageInfoResponse {
  query?: {
    pages: Record<
      string,
      {
        title: string;
        imageinfo?: Array<{ url: string }>;
      }
    >;
  };
}

const API = "https://commons.wikimedia.org/w/api.php";

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  try {
    const searchUrl =
      `${API}?action=query&list=search&srnamespace=6&format=json&origin=*` +
      `&srlimit=${Math.min(limit * 2, 30)}&srsearch=${encodeURIComponent(theme.query)}`;
    const searchRes = await fetchJson<CommonsSearchResponse>(searchUrl);
    const titles = searchRes.query?.search.map((r) => r.title) ?? [];
    if (titles.length === 0) return [];

    const infoUrl =
      `${API}?action=query&prop=imageinfo&iiprop=url&format=json&origin=*` +
      `&titles=${encodeURIComponent(titles.join("|"))}`;
    const infoRes = await fetchJson<CommonsImageInfoResponse>(infoUrl);
    const pages = infoRes.query?.pages ?? {};

    const out: RawCandidate[] = [];
    for (const page of Object.values(pages)) {
      if (out.length >= limit) break;
      const url = page.imageinfo?.[0]?.url;
      if (!url || !/\.(jpe?g|png)$/i.test(url)) continue;
      out.push({
        id: `wikimedia:${page.title.replace(/^File:/, "")}`,
        title: page.title.replace(/^File:/, "").replace(/\.[a-zA-Z]+$/, "").replace(/_/g, " "),
        artist: "Unknown",
        date: "",
        medium: "",
        source: "Wikimedia Commons",
        image: url,
        link: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[wikimedia] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const wikimedia: SourceAdapter = {
  slug: "wikimedia",
  name: "Wikimedia Commons",
  available: () => true,
  search,
};
