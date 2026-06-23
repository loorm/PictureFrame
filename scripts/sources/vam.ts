import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface VamResponse {
  records: Array<{
    systemNumber: string;
    _primaryTitle: string;
    _primaryMaker?: { name?: string };
    _primaryDate?: string;
    _primaryImageId?: string;
  }>;
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  try {
    const url =
      `https://api.vam.ac.uk/v2/objects/search?q=${encodeURIComponent(theme.query)}` +
      `&images_exist=1&page_size=${Math.min(limit * 2, 40)}`;
    const res = await fetchJson<VamResponse>(url);
    const out: RawCandidate[] = [];
    for (const item of res.records) {
      if (out.length >= limit) break;
      if (!item._primaryImageId) continue;
      out.push({
        id: `vam:${item.systemNumber}`,
        title: item._primaryTitle || "Untitled",
        artist: item._primaryMaker?.name || "Unknown",
        date: item._primaryDate || "",
        medium: "",
        source: "Victoria and Albert Museum",
        image: `https://framemark.vam.ac.uk/collections/${item._primaryImageId}/full/full/0/default.jpg`,
        link: `https://collections.vam.ac.uk/item/${item.systemNumber}`,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[vam] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const vam: SourceAdapter = {
  slug: "vam",
  name: "Victoria and Albert Museum",
  available: () => true,
  search,
};
