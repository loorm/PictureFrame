import { fetchJson, sleep } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

/**
 * Flickr Commons — the programme where 100+ institutions (British Library,
 * Wellcome Collection, NYPL, Rijksarchief, Nationaal Archief, etc.) donate
 * their public-domain collections to Flickr. is_commons=1 restricts every
 * request to institutional contributions, keeping results curated.
 *
 * Requires FLICKR_API_KEY (free registration at flickr.com/services/api/).
 */

interface FlickrPhoto {
  id: string;
  owner: string;
  title: string;
  ownername?: string;
  datetaken?: string;
  url_l?: string;
  url_c?: string;
}

interface FlickrResponse {
  photos?: {
    photo: FlickrPhoto[];
  };
  stat: string;
}

const API = "https://api.flickr.com/services/rest/";

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  const apiKey = process.env.FLICKR_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      method: "flickr.photos.search",
      api_key: apiKey,
      text: theme.query,
      is_commons: "1",
      per_page: String(Math.min(limit * 3, 60)),
      extras: "url_l,url_c,owner_name,date_taken",
      format: "json",
      nojsoncallback: "1",
    });

    await sleep(200);
    const res = await fetchJson<FlickrResponse>(`${API}?${params}`);

    if (res.stat !== "ok" || !res.photos?.photo.length) return [];

    const out: RawCandidate[] = [];
    for (const photo of res.photos.photo) {
      if (out.length >= limit) break;

      const image = photo.url_l ?? photo.url_c;
      if (!image) continue;

      const institution = photo.ownername || "Flickr Commons";
      const year = photo.datetaken ? photo.datetaken.slice(0, 4) : "";
      const link = `https://www.flickr.com/photos/${photo.owner}/${photo.id}/`;

      out.push({
        id: `flickr:${photo.id}`,
        title: photo.title || "Untitled",
        artist: "Unknown",
        date: year,
        medium: "",
        source: institution,
        image,
        link,
      });
    }
    return out;
  } catch (err) {
    console.warn(`[flickr] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const flickr: SourceAdapter = {
  slug: "flickr",
  name: "Flickr Commons",
  available: () => Boolean(process.env.FLICKR_API_KEY),
  search,
};
