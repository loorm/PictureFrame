import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface LocResponse {
  results: Array<{
    id: string;
    title: string;
    date?: string;
    image_url?: string[];
    contributor?: string[];
  }>;
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  try {
    const url =
      `https://www.loc.gov/photos/?q=${encodeURIComponent(theme.query)}` +
      `&fo=json&c=${Math.min(limit * 2, 40)}`;
    const res = await fetchJson<LocResponse>(url);
    const out: RawCandidate[] = [];
    for (const item of res.results) {
      if (out.length >= limit) break;
      const image = item.image_url?.at(-1);
      if (!image || !item.id?.startsWith("http")) continue;
      out.push({
        id: `loc:${item.id.replace(/\/$/, "").split("/").pop()}`,
        title: item.title || "Untitled",
        artist: item.contributor?.[0] || "Unknown",
        date: item.date || "",
        medium: "",
        source: "Library of Congress",
        image,
        link: item.id,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[loc] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const loc: SourceAdapter = {
  slug: "loc",
  name: "Library of Congress",
  // www.loc.gov/photos/?...&fo=json (the documented JSON-search pattern) is
  // currently behind a Cloudflare JS challenge ("Just a moment...") for plain
  // HTTP requests — confirmed via curl with a real browser User-Agent, still
  // 403s. Not a code bug; this needs either a different/dedicated LOC API
  // endpoint or revisiting once their bot-protection setup changes.
  available: () => false,
  search,
};
