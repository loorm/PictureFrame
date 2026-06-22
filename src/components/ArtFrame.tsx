"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./ArtFrame.module.css";
import { COLLECTIONS, flattenCollections, type FlatPiece } from "@/data/collections";

const FLAT = flattenCollections(COLLECTIONS);

const BACKGROUND = "#0a0a0a";
const MINUTES_PER_PIECE = 5;
const SHOW_CAPTION = true;
const SHOW_COLLECTION_INTRO = true;
const TICK_MS = 250;
const INTRO_DURATION_MS = 30_000;
const MENU_IDLE_MS = 3_200;
const FADE_RESET_MS = 2_000;

function qrSrc(link: string) {
  return (
    "https://api.qrserver.com/v1/create-qr-code/?size=170x170&margin=0&format=svg&data=" +
    encodeURIComponent(link)
  );
}

export default function ArtFrame() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [fade, setFade] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [intro, setIntro] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const elapsedRef = useRef(0);
  const lastActivityRef = useRef(0);
  const introTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerIntro = useCallback(() => {
    setIntro(true);
    if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
    introTimeoutRef.current = setTimeout(() => setIntro(false), INTRO_DURATION_MS);
  }, []);

  const transitionTo = useCallback(
    (resolve: (current: number) => number) => {
      elapsedRef.current = 0;
      setIndex((current) => {
        const next = resolve(current);
        setPrevIndex(current);
        if (FLAT[next].isCollectionStart) triggerIntro();
        return next;
      });
      setFade(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setFade(true)));
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = setTimeout(() => setPrevIndex(null), FADE_RESET_MS);
    },
    [triggerIntro]
  );

  const go = useCallback(
    (dir: number) => transitionTo((current) => (current + dir + FLAT.length) % FLAT.length),
    [transitionTo]
  );

  const goCollection = useCallback(
    (dir: number) => {
      transitionTo((current) => {
        const collIndex = FLAT[current].collIndex;
        const nextColl = (collIndex + dir + COLLECTIONS.length) % COLLECTIONS.length;
        return FLAT.findIndex((p) => p.collIndex === nextColl && p.pieceIndex === 0);
      });
    },
    [transitionTo]
  );

  const togglePlay = useCallback(() => {
    elapsedRef.current = 0;
    setPlaying((p) => !p);
  }, []);

  const fullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const registerActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setMenuOpen(true);
  }, []);

  const markFailed = useCallback((url: string) => {
    setFailed((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  }, []);

  // Mount-once listeners: keyboard shortcuts, activity tracking, intro timeout.
  useEffect(() => {
    lastActivityRef.current = Date.now();
    introTimeoutRef.current = setTimeout(() => setIntro(false), INTRO_DURATION_MS);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") {
        go(1);
      } else if (e.key === "ArrowLeft") {
        go(-1);
      } else if (e.key.toLowerCase() === "f") {
        fullscreen();
      }
      registerActivity();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousemove", registerActivity);
    window.addEventListener("touchstart", registerActivity);

    return () => {
      if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousemove", registerActivity);
      window.removeEventListener("touchstart", registerActivity);
    };
  }, [go, togglePlay, fullscreen, registerActivity]);

  // Playback / idle-menu ticker.
  useEffect(() => {
    const id = setInterval(() => {
      if (playing) {
        elapsedRef.current += TICK_MS;
        const durationMs = MINUTES_PER_PIECE * 60_000;
        if (elapsedRef.current >= durationMs) {
          elapsedRef.current = 0;
          go(1);
        }
      }
      if (menuOpen && Date.now() - lastActivityRef.current > MENU_IDLE_MS) {
        setMenuOpen(false);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, menuOpen, go]);

  const current = FLAT[index];
  const prevPiece = prevIndex != null ? FLAT[prevIndex] : null;
  const artBottom = SHOW_CAPTION ? "112px" : "0px";
  const introVisible = SHOW_COLLECTION_INTRO && intro;

  const renderArt = (piece: FlatPiece) => {
    if (!piece.image || failed[piece.image]) {
      return (
        <div
          className={styles.placeholder}
          style={{
            background: `repeating-linear-gradient(135deg, ${piece.accent2} 0 16px, ${piece.accent} 16px 32px)`,
          }}
        >
          <div className={styles.placeholderText}>
            {piece.title}
            <br />
            {"— " + piece.source + " image —"}
          </div>
        </div>
      );
    }
    return (
      // next/image needs every source domain allowlisted up front; art images come
      // from many open-collection hosts, so a plain <img> is simpler here.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={piece.image}
        alt={piece.title}
        className={styles.artImg}
        onError={() => markFailed(piece.image)}
      />
    );
  };

  return (
    <div className={styles.root} style={{ background: BACKGROUND }}>
      <div className={styles.artRegion} style={{ bottom: artBottom }}>
        {prevPiece && (
          <div className={styles.layer} style={{ opacity: 1 }}>
            {renderArt(prevPiece)}
          </div>
        )}
        <div className={styles.layer} style={{ opacity: fade ? 1 : 0 }}>
          {renderArt(current)}
        </div>
      </div>

      {SHOW_CAPTION && (
        <div className={styles.captionBand}>
          <div className={styles.captionText}>
            <div className={styles.title}>{current.title}</div>
            <div className={styles.metaLine}>
              {current.artist} &middot; {current.date} &middot; {current.medium}
            </div>
          </div>
          <div className={styles.qrWrap}>
            <div className={styles.qrBox}>
              {/* eslint-disable-next-line @next/next/no-img-element -- generated SVG from a QR API, not optimizable */}
              <img
                src={qrSrc(current.link)}
                alt="QR code linking to museum or reference page"
                className={styles.qrImg}
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.introOverlay} style={{ opacity: introVisible ? 1 : 0 }}>
        <div className={styles.introEra}>{current.era}</div>
        <div className={styles.introTitle}>{current.collTitle}</div>
        <div className={styles.introBlurb}>{current.blurb}</div>
        <div className={styles.introCount}>{current.pieceCount} works in this collection</div>
      </div>

      <div className={styles.handleHint} />

      <div
        className={styles.controlBar}
        style={{ "--menu-y": menuOpen ? "0%" : "135%" } as CSSProperties}
      >
        <button className={styles.navBtn} onClick={() => go(-1)} aria-label="Previous piece">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11 2.5 L4 8 L11 13.5 Z" />
          </svg>
        </button>

        <button
          className={styles.playBtn}
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2.5 L13 8 L4 13.5 Z" />
            </svg>
          )}
        </button>

        <button className={styles.navBtn} onClick={() => go(1)} aria-label="Next piece">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 2.5 L12 8 L5 13.5 Z" />
          </svg>
        </button>

        <div className={styles.divider} />

        <button
          className={styles.collArrow}
          onClick={() => goCollection(-1)}
          aria-label="Previous collection"
        >
          <svg width="9" height="13" viewBox="0 0 9 13" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M7 1 L2 6.5 L7 12" />
          </svg>
        </button>

        <div className={styles.collTitle}>{current.collTitle}</div>

        <button
          className={styles.collArrow}
          onClick={() => goCollection(1)}
          aria-label="Next collection"
        >
          <svg width="9" height="13" viewBox="0 0 9 13" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 1 L7 6.5 L2 12" />
          </svg>
        </button>

        <div className={styles.divider} />

        <div className={styles.counterLabel}>
          {String(index + 1).padStart(2, "0")} / {String(FLAT.length).padStart(2, "0")}
        </div>

        <button className={styles.fullscreenBtn} onClick={fullscreen} aria-label="Toggle fullscreen">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 6 V2 H6 M10 2 H14 V6 M14 10 V14 H10 M6 14 H2 V10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
