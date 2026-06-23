export interface ArtPiece {
  /** Stable dedup key: `${source-slug}:${source-native-object-id}`. Never reused across sources. */
  id: string;
  title: string;
  artist: string;
  date: string;
  medium: string;
  /** Display name of the institution, e.g. "The Metropolitan Museum of Art". */
  source: string;
  image: string;
  /** Where the QR code points — a museum collection page or Wikipedia article. */
  link: string;
  /**
   * "anchor" = deliberately pulled because it's a recognizable/highlighted work.
   * "general" = broad/random sample within the theme, i.e. the long tail.
   * A collection should be roughly 20% anchor / 80% general.
   */
  fame: "anchor" | "general";
}

export interface Collection {
  /** Unique per generated collection instance, e.g. "dutch-golden-age-1". */
  id: string;
  /** References Theme.id in theme-taxonomy.ts. */
  themeId: string;
  title: string;
  era: string;
  blurb: string;
  accent: string;
  accent2: string;
  pieces: ArtPiece[];
}

export interface Theme {
  id: string;
  title: string;
  era: string;
  blurb: string;
  accent: string;
  accent2: string;
}

export interface ThemeCoverageEntry {
  count: number;
  lastFetched: string | null;
}

export type ThemeCoverage = Record<string, ThemeCoverageEntry>;

export interface FlatPiece extends ArtPiece {
  collIndex: number;
  pieceIndex: number;
  isCollectionStart: boolean;
  collTitle: string;
  era: string;
  blurb: string;
  accent: string;
  accent2: string;
  pieceCount: number;
}
