import type { Collection, FlatPiece } from "@/data/types";

/**
 * The "meandering tour": a generative, persisted play order over collections.
 * Pieces within a collection always play in order; collection order is a
 * shuffled queue per lap, with an occasional (~1/8) deliberate rerun of a
 * collection already seen this lap. History is a growing log so "previous"
 * replays exactly what was shown rather than re-deriving it.
 */

export interface TourPieceRef {
  collectionId: string;
  pieceIndex: number;
}

export interface TourState {
  /** Pieces actually shown, in order. Capped at HISTORY_CAP. */
  history: TourPieceRef[];
  /** Index into history of the currently-displayed piece. */
  cursor: number;
  /** Shuffled collection ids not yet played this lap. */
  queue: string[];
  /** Collection ids already played this lap (reset when queue refills). */
  lap: string[];
}

const STORAGE_KEY = "artframe.tour.v1";
const HISTORY_CAP = 200;
const RERUN_CHANCE = 0.125;

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function dedupePush(arr: string[], id: string): string[] {
  return arr.includes(id) ? arr : [...arr, id];
}

function capHistory(history: TourPieceRef[]): TourPieceRef[] {
  if (history.length <= HISTORY_CAP) return history;
  return history.slice(history.length - HISTORY_CAP);
}

function advanceCollection(
  state: TourState,
  collections: Collection[]
): { id: string; queue: string[]; lap: string[] } {
  const allIds = collections.map((c) => c.id);
  const currentId = state.history[state.cursor]?.collectionId ?? null;
  let lap = currentId ? dedupePush(state.lap, currentId) : state.lap;
  let queue = state.queue;

  if (lap.length >= 2 && Math.random() < RERUN_CHANCE) {
    const candidates = lap.filter((id) => id !== currentId);
    if (candidates.length > 0) {
      return { id: candidates[Math.floor(Math.random() * candidates.length)], queue, lap };
    }
  }

  if (queue.length === 0) {
    const pool = allIds.filter((id) => id !== currentId);
    queue = shuffle(pool.length > 0 ? pool : allIds.slice());
    lap = [];
  }

  const [id, ...rest] = queue;
  return { id, queue: rest, lap };
}

export function createInitialTourState(collections: Collection[]): TourState {
  const queue = shuffle(collections.map((c) => c.id));
  const [firstId, ...rest] = queue;
  return {
    history: [{ collectionId: firstId, pieceIndex: 0 }],
    cursor: 0,
    queue: rest,
    lap: [],
  };
}

export function stepForward(state: TourState, collections: Collection[]): TourState {
  if (state.cursor < state.history.length - 1) {
    return { ...state, cursor: state.cursor + 1 };
  }
  const last = state.history[state.cursor];
  const collection = last ? collections.find((c) => c.id === last.collectionId) : undefined;

  let nextRef: TourPieceRef;
  let queue = state.queue;
  let lap = state.lap;
  if (collection && last.pieceIndex + 1 < collection.pieces.length) {
    nextRef = { collectionId: last.collectionId, pieceIndex: last.pieceIndex + 1 };
  } else {
    const picked = advanceCollection(state, collections);
    queue = picked.queue;
    lap = picked.lap;
    nextRef = { collectionId: picked.id, pieceIndex: 0 };
  }

  const history = capHistory([...state.history.slice(0, state.cursor + 1), nextRef]);
  return { history, cursor: history.length - 1, queue, lap };
}

export function stepBackward(state: TourState): TourState {
  if (state.cursor > 0) return { ...state, cursor: state.cursor - 1 };
  return state;
}

export function skipToNextCollection(state: TourState, collections: Collection[]): TourState {
  const picked = advanceCollection(state, collections);
  const nextRef: TourPieceRef = { collectionId: picked.id, pieceIndex: 0 };
  const history = capHistory([...state.history.slice(0, state.cursor + 1), nextRef]);
  return { history, cursor: history.length - 1, queue: picked.queue, lap: picked.lap };
}

export function skipToPrevCollection(state: TourState): TourState {
  let cursor = state.cursor;
  const currentId = state.history[cursor]?.collectionId;
  while (cursor > 0 && state.history[cursor].collectionId === currentId) cursor--;
  const prevId = state.history[cursor]?.collectionId;
  while (cursor > 0 && state.history[cursor - 1].collectionId === prevId) cursor--;
  return { ...state, cursor };
}

export function resolveCurrentPiece(state: TourState, collections: Collection[]): FlatPiece | null {
  const ref = state.history[state.cursor];
  if (!ref) return null;
  const collection = collections.find((c) => c.id === ref.collectionId);
  const piece = collection?.pieces[ref.pieceIndex];
  if (!collection || !piece) return null;
  return {
    ...piece,
    collIndex: collections.indexOf(collection),
    pieceIndex: ref.pieceIndex,
    isCollectionStart: ref.pieceIndex === 0,
    collTitle: collection.title,
    era: collection.era,
    blurb: collection.blurb,
    accent: collection.accent,
    accent2: collection.accent2,
    pieceCount: collection.pieces.length,
  };
}

function isValidTourState(value: unknown, collections: Collection[]): value is TourState {
  if (!value || typeof value !== "object") return false;
  const s = value as TourState;
  if (!Array.isArray(s.history) || s.history.length === 0) return false;
  if (typeof s.cursor !== "number" || s.cursor < 0 || s.cursor >= s.history.length) return false;
  if (!Array.isArray(s.queue) || !Array.isArray(s.lap)) return false;
  const ref = s.history[s.cursor];
  const collection = collections.find((c) => c.id === ref?.collectionId);
  return Boolean(collection?.pieces[ref?.pieceIndex]);
}

export function loadTourState(collections: Collection[]): TourState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidTourState(parsed, collections) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveTourState(state: TourState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable or full — the tour just continues in-memory for this session.
  }
}
