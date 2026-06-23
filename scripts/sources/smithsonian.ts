import { fetchJson } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

interface SiResponse {
  response?: {
    rows: Array<{
      id: string;
      content?: {
        descriptiveNonRepeating?: {
          title?: { content?: string };
          record_link?: string;
          data_source?: string;
          online_media?: { media?: Array<{ content?: string; type?: string }> };
        };
        freetext?: {
          name?: Array<{ content?: string }>;
          date?: Array<{ content?: string }>;
          physicalDescription?: Array<{ content?: string }>;
        };
      };
    }>;
  };
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  const apiKey = process.env.SMITHSONIAN_API_KEY;
  if (!apiKey) return [];
  try {
    // online_media_type:Images is a soft hint, not a hard filter — most hits still
    // lack media, so over-fetch generously and rely on the post-filter below.
    const query = `${theme.query} AND online_media_type:Images`;
    const url =
      `https://api.si.edu/openaccess/api/v1.0/search?api_key=${apiKey}` +
      `&q=${encodeURIComponent(query)}&rows=${Math.min(limit * 8, 100)}`;
    const res = await fetchJson<SiResponse>(url);
    const rows = res.response?.rows ?? [];
    const out: RawCandidate[] = [];
    for (const row of rows) {
      if (out.length >= limit) break;
      const dnr = row.content?.descriptiveNonRepeating;
      const media = dnr?.online_media?.media?.find((m) => m.type === "Images" && m.content);
      if (!media?.content) continue;
      out.push({
        id: `si:${row.id}`,
        title: dnr?.title?.content || "Untitled",
        artist: row.content?.freetext?.name?.[0]?.content || "Unknown",
        date: row.content?.freetext?.date?.[0]?.content || "",
        medium: row.content?.freetext?.physicalDescription?.[0]?.content || "",
        source: dnr?.data_source || "Smithsonian Institution",
        image: media.content,
        link: dnr?.record_link || `https://www.si.edu/object/${row.id}`,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[smithsonian] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const smithsonian: SourceAdapter = {
  slug: "si",
  name: "Smithsonian Open Access",
  // The API itself works fine, but the image URLs it returns (online_media.media[].content,
  // served from ids.si.edu/ids/deliveryService) come back with no Content-Type header at
  // all — confirmed via curl, and unaffected by query params like &max= or a .jpg suffix.
  // Chrome's Opaque Response Blocking deterministically rejects that for cross-origin
  // <img> loads (net::ERR_BLOCKED_BY_ORB), so every Smithsonian image silently fails in
  // the browser even though the bytes are a perfectly valid JPEG over curl. Paused until
  // either their CDN starts sending Content-Type, or we find a different image field/
  // endpoint in their API response that does.
  available: () => false,
  search,
};
