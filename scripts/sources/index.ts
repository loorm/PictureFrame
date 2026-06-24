import { aic } from "./aic";
import { cleveland } from "./cleveland";
import { europeana } from "./europeana";
import { flickr } from "./flickr";
import { harvard } from "./harvard";
import { met } from "./met";
import { rijksmuseum } from "./rijksmuseum";
import { smithsonian } from "./smithsonian";
import { unsplash } from "./unsplash";
import { vam } from "./vam";
import { wikimedia } from "./wikimedia";
import type { SourceAdapter } from "../lib/types";

export const ALL_SOURCES: SourceAdapter[] = [
  met,
  aic,
  cleveland,
  vam,
  wikimedia,
  rijksmuseum,
  flickr,
  smithsonian,
  harvard,
  europeana,
  unsplash,
];
