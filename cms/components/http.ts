// Client-side safe fetch helpers. Never throw and never return a non-array where
// an array is expected, so a failed API call (e.g. the DB being unreachable)
// degrades to an empty list instead of crashing the page.

export async function getArray<T = unknown>(url: string, init?: RequestInit): Promise<T[]> {
  try {
    const r = await fetch(url, init);
    const d = await r.json();
    return Array.isArray(d) ? (d as T[]) : [];
  } catch {
    return [];
  }
}

export async function getObject<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const r = await fetch(url, init);
    if (!r.ok) return null;
    const d = await r.json();
    return d && typeof d === 'object' && !Array.isArray(d) ? (d as T) : null;
  } catch {
    return null;
  }
}
