import { fetchJson, sleep } from "../lib/http";
import type { FetchTheme, RawCandidate, SourceAdapter } from "../lib/types";

/**
 * Rijksmuseum's current API (data.rijksmuseum.nl) is Linked Art JSON-LD, not a
 * flat REST shape like the other sources. Confirmed keyless and reachable via
 * real requests: search/collection?description=...&imageAvailable=true
 * resolves, and per-object title/creator/date are extractable from
 * identified_by[type=Name].content, carried_out_by[].notation, and the
 * timespan's identified_by.
 *
 * The image isn't on the object record itself — it takes a 3-hop chain
 * confirmed against real objects:
 *   HumanMadeObject.shows[].id        -> VisualItem
 *   VisualItem.digitally_shown_by[].id -> DigitalObject
 *   DigitalObject.access_point[].id    -> the actual image URL (IIIF, e.g.
 *                                          iiif.micr.io/.../full/max/0/default.jpg)
 * That final URL serves a real `Content-Type: image/jpeg` (verified via curl),
 * unlike e.g. Smithsonian's IDS service which sends none and gets blocked by
 * Chrome's ORB — so this one is safe to hotlink directly.
 */

interface SearchResponse {
  orderedItems?: Array<{ id?: string }>;
}

interface LinkedArtRef {
  id?: string;
}

interface HumanMadeObjectRecord {
  shows?: LinkedArtRef[];
}

interface VisualItemRecord {
  digitally_shown_by?: LinkedArtRef[];
}

interface DigitalObjectRecord {
  access_point?: LinkedArtRef[];
}

interface NamedRecord {
  identified_by?: Array<{ type?: string; content?: string }>;
}

function walk(node: unknown, visit: (key: string, value: unknown) => void): void {
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    visit(key, value);
    if (Array.isArray(value)) {
      value.forEach((v) => walk(v, visit));
    } else if (typeof value === "object") {
      walk(value, visit);
    }
  }
}

/**
 * The record's own top-level identified_by[] (type "Name") holds the display
 * title. Deliberately NOT a recursive walk — timespan and produced_by also
 * carry their own identified_by[Name] entries (dates, technique labels) that
 * a generic walk would find first and mistake for the title.
 */
function findTitle(record: NamedRecord): string | undefined {
  return record.identified_by?.find((e) => e.type === "Name")?.content;
}

/** People/orgs (e.g. carried_out_by[]) hold names in notation[], not a plain label. */
function findName(record: unknown, underKey: string): string | undefined {
  let found: string | undefined;
  walk(record, (key, value) => {
    if (found || key !== underKey) return;
    const items = Array.isArray(value) ? value : [value];
    for (const item of items) {
      const notation = (item as { notation?: Array<{ "@language"?: string; "@value"?: string }> } | undefined)
        ?.notation;
      const en = notation?.find((n) => n["@language"] === "en") ?? notation?.[0];
      if (en?.["@value"]) {
        found = en["@value"];
        break;
      }
    }
  });
  return found;
}

/** timespan.identified_by[] holds a Name-typed entry with the human-readable date range. */
function findTimespanLabel(record: unknown): string | undefined {
  let found: string | undefined;
  walk(record, (key, value) => {
    if (found || key !== "timespan") return;
    const ts = value as { identified_by?: Array<{ type?: string; content?: string }> } | undefined;
    const nameEntry = ts?.identified_by?.find((e) => e.type === "Name");
    if (nameEntry?.content) found = nameEntry.content;
  });
  return found;
}

function findMuseumLink(record: unknown): string | undefined {
  let found: string | undefined;
  walk(record, (key, value) => {
    if (found || key !== "equivalent") return;
    const items = Array.isArray(value) ? value : [value];
    for (const item of items) {
      const id = (item as { id?: string } | undefined)?.id;
      if (id && id.includes("rijksmuseum.nl")) {
        found = id;
        break;
      }
    }
  });
  return found;
}

async function resolveImageUrl(objectId: string): Promise<string | undefined> {
  const object = await fetchJson<HumanMadeObjectRecord>(`https://data.rijksmuseum.nl/${objectId}`);
  const visualItemId = object.shows?.[0]?.id?.split("/").pop();
  if (!visualItemId) return undefined;

  await sleep(150);
  const visualItem = await fetchJson<VisualItemRecord>(`https://data.rijksmuseum.nl/${visualItemId}`);
  const digitalObjectId = visualItem.digitally_shown_by?.[0]?.id?.split("/").pop();
  if (!digitalObjectId) return undefined;

  await sleep(150);
  const digitalObject = await fetchJson<DigitalObjectRecord>(`https://data.rijksmuseum.nl/${digitalObjectId}`);
  return digitalObject.access_point?.[0]?.id;
}

async function search(theme: FetchTheme, limit: number): Promise<RawCandidate[]> {
  try {
    const searchUrl = `https://data.rijksmuseum.nl/search/collection?description=${encodeURIComponent(theme.query)}&imageAvailable=true`;
    const res = await fetchJson<SearchResponse>(searchUrl);
    const items = (res.orderedItems ?? []).slice(0, Math.min((res.orderedItems ?? []).length, limit * 5));
    const out: RawCandidate[] = [];
    for (const item of items) {
      if (out.length >= limit) break;
      // orderedItems entries are { id: "https://id.rijksmuseum.nl/<n>", type }, not plain strings.
      const objectId = item?.id?.split("/").pop();
      if (!objectId) continue;
      try {
        const [record, image] = await Promise.all([
          fetchJson<NamedRecord>(`https://data.rijksmuseum.nl/${objectId}`),
          resolveImageUrl(objectId),
        ]);
        const label = findTitle(record);
        if (!image || !label) continue;
        out.push({
          id: `rijksmuseum:${objectId}`,
          title: label,
          artist: findName(record, "carried_out_by") || "Unknown",
          date: findTimespanLabel(record) || "",
          medium: "",
          source: "Rijksmuseum",
          image,
          link: findMuseumLink(record) || `https://www.rijksmuseum.nl/en/collection/${objectId}`,
        });
      } catch {
        // skip this object, try the next
      }
      await sleep(250);
    }
    return out;
  } catch (err) {
    console.warn(`[rijksmuseum] search failed for "${theme.title}":`, (err as Error).message);
    return [];
  }
}

export const rijksmuseum: SourceAdapter = {
  slug: "rijksmuseum",
  name: "Rijksmuseum",
  available: () => true,
  search,
};
