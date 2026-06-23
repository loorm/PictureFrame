import type { ArtPiece } from "../../src/data/types";

export type { ArtPiece } from "../../src/data/types";

/** A piece candidate before fame ("anchor"/"general") has been assigned by the orchestrator. */
export type RawCandidate = Omit<ArtPiece, "fame">;

export interface FetchTheme {
  id: string;
  title: string;
  era: string;
  blurb: string;
  accent: string;
  accent2: string;
  /** Free-text query derived from the theme, used by adapters as a search string. */
  query: string;
}

export interface SourceAdapter {
  slug: string;
  name: string;
  /** Cheap sync check — env key present, not stubbed, etc. Doesn't guarantee the API call succeeds. */
  available(): boolean;
  /** Returns up to `limit` candidates matching the theme. Must never throw — catch internally and return []. */
  search(theme: FetchTheme, limit: number): Promise<RawCandidate[]>;
}
