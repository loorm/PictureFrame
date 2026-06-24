import { fetchJson, sleep } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

// ── Wikidata SPARQL (when wikidataMovementQid is set) ──────────────────────
//
// Instead of searching Wikimedia Commons filenames (which match anything
// containing the keyword in a file description), this queries Wikidata
// directly for artworks tagged with a specific movement (P135), then resolves
// their P18 image URLs. Results are genuinely thematic.

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

interface SparqlResult {
  results: {
    bindings: Array<{
      item: { value: string };
      itemLabel: { value: string };
      image: { value: string };
      creatorLabel?: { value: string };
      inceptionLabel?: { value: string };
      collectionLabel?: { value: string };
    }>;
  };
}

async function fetchByMovement(qid: string, limit: number): Promise<RawCandidate[]> {
  const sparql = `
SELECT ?item ?itemLabel ?image ?creatorLabel ?inceptionLabel ?collectionLabel WHERE {
  ?item wdt:P135 wd:${qid} ;
        wdt:P18 ?image .
  OPTIONAL { ?item wdt:P571 ?inception }
  OPTIONAL { ?item wdt:P195 ?collection }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en" .
    ?item rdfs:label ?itemLabel .
    ?item wdt:P170 ?creatorLabel .
    ?collection rdfs:label ?collectionLabel .
    ?inception rdfs:label ?inceptionLabel .
  }
}
LIMIT ${Math.min(limit * 4, 80)}`.trim();

  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(sparql)}&format=json`;
  const res = await fetchJson<SparqlResult>(url, {
    headers: { "User-Agent": "art-frame-fetch/1.0 (https://github.com/loorm/PictureFrame)" },
  });

  const out: RawCandidate[] = [];
  for (const b of res.results.bindings) {
    if (out.length >= limit) break;
    const imageUrl = b.image.value.replace(/^http:/, "https:");
    if (!/\.(jpe?g|png)/i.test(imageUrl)) continue;

    const qItemId = b.item.value.split("/").pop() ?? "";
    const title = b.itemLabel?.value ?? "Untitled";
    const artist = b.creatorLabel?.value ?? "Unknown";
    // Filter out artist values where the label service returned a full URI.
    const artistClean = /^http/.test(artist) ? "Unknown" : artist;
    const date = b.inceptionLabel?.value ?? "";
    const collection = b.collectionLabel?.value ?? "Wikimedia Commons";

    out.push({
      id: `wikimedia:wikidata-${qItemId}`,
      title,
      artist: artistClean,
      date,
      medium: "",
      source: collection,
      image: imageUrl,
      link: `https://www.wikidata.org/wiki/${qItemId}`,
    });
  }
  return out;
}

// ── Wikimedia Commons keyword search (fallback) ────────────────────────────

interface CommonsSearchResponse {
  query?: { search: Array<{ title: string }> };
}

interface CommonsImageInfoResponse {
  query?: {
    pages: Record<string, { title: string; imageinfo?: Array<{ url: string }> }>;
  };
}

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

async function fetchByKeyword(query: string, limit: number): Promise<RawCandidate[]> {
  const searchUrl =
    `${COMMONS_API}?action=query&list=search&srnamespace=6&format=json&origin=*` +
    `&srlimit=${Math.min(limit * 2, 30)}&srsearch=${encodeURIComponent(query)}`;
  const searchRes = await fetchJson<CommonsSearchResponse>(searchUrl);
  const titles = searchRes.query?.search.map((r) => r.title) ?? [];
  if (titles.length === 0) return [];

  const infoUrl =
    `${COMMONS_API}?action=query&prop=imageinfo&iiprop=url&format=json&origin=*` +
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
}

// ── Adapter ────────────────────────────────────────────────────────────────

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  try {
    if (theme.wikidataMovementQid) {
      const results = await fetchByMovement(theme.wikidataMovementQid, limit);
      if (results.length > 0) return results;
      // Fall through to keyword search if SPARQL returned nothing.
      await sleep(300);
    }
    return await fetchByKeyword(theme.query, limit);
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
