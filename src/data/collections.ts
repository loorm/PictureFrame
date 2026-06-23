import collectionsData from "./collections.json";
import type { ArtPiece, Collection, FlatPiece } from "./types";

export type { ArtPiece, Collection, FlatPiece } from "./types";

/**
 * The art pool. Generated/extended by scripts/fetch-art — see theme-taxonomy.ts
 * for the candidate themes and theme-coverage.json for breadth-first fetch state.
 * Don't hand-edit beyond small corrections; re-running the fetch script only adds.
 */
export const COLLECTIONS: Collection[] = collectionsData as Collection[];

export function flattenCollections(collections: Collection[]): FlatPiece[] {
  const flat: FlatPiece[] = [];
  collections.forEach((c, ci) => {
    c.pieces.forEach((p: ArtPiece, pi: number) => {
      flat.push({
        ...p,
        collIndex: ci,
        pieceIndex: pi,
        isCollectionStart: pi === 0,
        collTitle: c.title,
        era: c.era,
        blurb: c.blurb,
        accent: c.accent,
        accent2: c.accent2,
        pieceCount: c.pieces.length,
      });
    });
  });
  return flat;
}
