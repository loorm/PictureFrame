import { aic } from "./aic";
import { cleveland } from "./cleveland";
import { europeana } from "./europeana";
import { harvard } from "./harvard";
import { loc } from "./loc";
import { met } from "./met";
import { rijksmuseum } from "./rijksmuseum";
import { smithsonian } from "./smithsonian";
import { unsplash } from "./unsplash";
import { vam } from "./vam";
import { whitney } from "./whitney";
import { wikimedia } from "./wikimedia";
import type { SourceAdapter } from "../lib/types";

/**
 * All 10 sources from free_art_apis.md, plus Unsplash from the same list.
 * Whitney is wired in but always unavailable — see scripts/sources/whitney.ts.
 * Don't remove entries here; an adapter going `available() => false` is how a
 * source is "paused" (no key yet, schema broken, etc), not deletion.
 */
export const ALL_SOURCES: SourceAdapter[] = [
  met,
  aic,
  cleveland,
  vam,
  loc,
  wikimedia,
  rijksmuseum,
  smithsonian,
  harvard,
  europeana,
  unsplash,
  whitney,
];
