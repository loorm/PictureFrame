const DB_NAME = "artframe";
const DB_VERSION = 1;
const STORE_NAME = "views";

export interface ViewLogEntry {
  title: string;
  artist: string;
  source: string;
  link: string;
  seenAt: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Best-effort: logging failures must never disrupt the slideshow. */
export async function logView(entry: ViewLogEntry): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).add(entry);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // ignore
  }
}

export async function getAllViews(): Promise<ViewLogEntry[]> {
  try {
    const db = await openDb();
    const result = await new Promise<ViewLogEntry[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result as ViewLogEntry[]);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result;
  } catch {
    return [];
  }
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? '"' + value.replace(/"/g, '""') + '"' : value;
}

export async function exportViewsAsCsv(): Promise<string> {
  const views = await getAllViews();
  const header = ["title", "artist", "source", "link", "seenAt"].join(",");
  const rows = views.map((v) => [v.title, v.artist, v.source, v.link, v.seenAt].map(csvEscape).join(","));
  return [header, ...rows].join("\n");
}

export function downloadViewsCsv(): void {
  exportViewsAsCsv()
    .then((csv) => {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `art-frame-log-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      // export is a convenience, not critical
    });
}
