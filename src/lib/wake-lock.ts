/**
 * Keeps the screen awake for as long as the tab is visible — important for a
 * wall display meant to run unattended for weeks. Silently no-ops if the
 * Wake Lock API isn't supported or the browser denies the request.
 */
export function requestWakeLock(): { release: () => void } {
  let sentinel: WakeLockSentinel | null = null;
  let released = false;

  const acquire = async () => {
    if (released || !("wakeLock" in navigator)) return;
    try {
      sentinel = await navigator.wakeLock.request("screen");
    } catch {
      // Not supported, or the browser declined (e.g. tab not visible yet) — fine.
    }
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") void acquire();
  };

  void acquire();
  document.addEventListener("visibilitychange", onVisibilityChange);

  return {
    release: () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      sentinel?.release().catch(() => {});
      sentinel = null;
    },
  };
}
