/**
 * API client for Task5 Backend (music store).
 * Base URL: NEXT_PUBLIC_API_URL or http://localhost:3000
 */

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000")
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type Locale = "en-US" | "de-DE";

export interface Song {
  index: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
}

export interface ListSongsParams {
  locale?: Locale;
  seed?: string;
  page?: number;
  limit?: number;
  likes?: number;
}

export interface ListSongsResponse {
  page: number;
  locale: string;
  seed: string;
  songs: Song[];
}

export interface SongDetails {
  index: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  duration: string;
  label: string;
  year: number;
  cover: {
    style: "gradient" | "noise" | "pattern";
    title: string;
    artist: string;
  };
  review: string;
  lyrics: string[];
}

export interface RandomSeedResponse {
  seed: string;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") search.set(k, String(v));
  }
  const q = search.toString();
  return q ? `?${q}` : "";
}

export async function listSongs(
  params: ListSongsParams = {}
): Promise<ListSongsResponse> {
  const query = buildQuery({
    locale: params.locale ?? "en-US",
    seed: params.seed ?? "1",
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    likes: params.likes ?? 0,
  });
  const res = await fetch(`${API_BASE}/song${query}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json();
}

export async function getRandomSeed(): Promise<RandomSeedResponse> {
  const res = await fetch(`${API_BASE}/song/random`);
  if (!res.ok) throw new Error("Failed to get random seed");
  return res.json();
}

export async function getSongDetails(
  index: number,
  params: { locale?: Locale; seed?: string; likes?: number } = {}
): Promise<SongDetails> {
  const query = buildQuery({
    locale: params.locale ?? "en-US",
    seed: params.seed ?? "1",
    likes: params.likes ?? 0,
  });
  const res = await fetch(`${API_BASE}/song/${index}/details${query}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json();
}

/** URL for audio preview; use as <audio src={...} /> */
export function getPreviewUrl(index: number, seed: string): string {
  const s = encodeURIComponent(seed);
  return `${API_BASE}/song/${index}/preview?seed=${s}`;
}
