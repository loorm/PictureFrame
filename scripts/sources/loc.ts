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
  // All loc.gov endpoints (photos, search, free-to-use, pictures) return HTTP
  // 403 from Cloudflare for any server-side HTTP request, regardless of
  // User-Agent. The protection requires a real browser with JS execution and
  // cannot be bypassed from a fetch script.
  //
  // LOC content is not actually missing from the pool: the LOC has deposited
  // thousands of public-domain photographs (FSA/OWI, PPOC, etc.) directly into
  // Wikimedia Commons. Our Wikimedia adapter already surfaces that content when
  // searching for the same themes; it just cites "Wikimedia Commons" as source
  // rather than "Library of Congress". No content gap — only a labelling one.
  available: () => false,
  search,
};
