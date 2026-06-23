"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Collection } from "@/data/types";
import {
  createInitialTourState,
  loadTourState,
  resolveCurrentPiece,
  saveTourState,
  skipToNextCollection,
  skipToPrevCollection,
  stepBackward,
  stepForward,
  type TourState,
} from "@/lib/tour";

function placeholderState(collections: Collection[]): TourState {
  return {
    history: [{ collectionId: collections[0]?.id ?? "", pieceIndex: 0 }],
    cursor: 0,
    queue: [],
    lap: [],
  };
}

/**
 * Renders deterministically on the server (always collections[0]) to avoid a
 * hydration mismatch, then swaps to the real persisted/shuffled position in a
 * client-only effect right after mount — a one-frame placeholder, covered by
 * the collection-intro overlay anyway.
 */
export function useTour(collections: Collection[]) {
  const [state, setState] = useState<TourState>(() => placeholderState(collections));
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const loaded = loadTourState(collections) ?? createInitialTourState(collections);
    // Persist immediately — otherwise a reload before the first navigation (e.g.
    // within the first MINUTES_PER_PIECE) finds nothing saved and reshuffles instead
    // of resuming.
    saveTourState(loaded);
    setState(loaded);
    setReady(true);
  }, [collections]);

  const apply = useCallback((updater: (s: TourState) => TourState) => {
    setState((s) => {
      const next = updater(s);
      saveTourState(next);
      return next;
    });
  }, []);

  const goNext = useCallback(() => apply((s) => stepForward(s, collections)), [apply, collections]);
  const goPrev = useCallback(() => apply((s) => stepBackward(s)), [apply]);
  const goNextCollection = useCallback(
    () => apply((s) => skipToNextCollection(s, collections)),
    [apply, collections]
  );
  const goPrevCollection = useCallback(() => apply((s) => skipToPrevCollection(s)), [apply]);

  const current = resolveCurrentPiece(state, collections);

  return { current, ready, goNext, goPrev, goNextCollection, goPrevCollection };
}
