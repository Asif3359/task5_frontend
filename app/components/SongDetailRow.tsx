"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlbumCover } from "./AlbumCover";
import { Button } from "@/components/ui/button";
import {
  getSongDetails,
  getPreviewUrl,
  type Locale,
  type SongDetails as SongDetailsType,
} from "@/lib/api";
import { ThumbsUp, Play, Pause, Volume2 } from "lucide-react";

interface SongDetailRowProps {
  index: number;
  locale: Locale;
  seed: string;
  likesParam: number;
  onClose?: () => void;
}

export function SongDetailRow({
  index,
  locale,
  seed,
  likesParam,
  onClose,
}: SongDetailRowProps) {
  const [details, setDetails] = useState<SongDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    getSongDetails(index, { locale, seed, likes: likesParam })
      .then((d) => {
        if (!cancelled) setDetails(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [index, locale, seed, likesParam]);

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing, details?.index]);

  if (loading) {
    return (
      <tr>
        <td
          colSpan={5}
          className="bg-muted/30 p-6 text-center text-muted-foreground"
        >
          Loading…
        </td>
      </tr>
    );
  }
  if (error || !details) {
    return (
      <tr>
        <td
          colSpan={5}
          className="bg-destructive/10 p-6 text-center text-destructive"
        >
          {error || "Failed to load details"}
        </td>
      </tr>
    );
  }

  const previewUrl = getPreviewUrl(details.index, seed);

  return (
    <tr className="bg-primary/5">
      <td colSpan={5} className="p-0 align-top">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
          <div className="w-40 shrink-0">
            <AlbumCover cover={details.cover} />
            <Button
              variant="secondary"
              size="sm"
              className="mt-2 w-full gap-1"
              onClick={() => {}}
            >
              <ThumbsUp className="size-4 text-primary" />
              {details.likes}
            </Button>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold">{details.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
              <button
                type="button"
                onClick={togglePlay}
                className="rounded-full p-1 hover:bg-blue-600 hover:text-white bg-blue-500 text-white"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </button>
              <Volume2 className="size-4" />
              <audio
                src={previewUrl}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                ref={audioRef}
              />
              <span className="text-sm">{details.duration}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              from {details.album} by {details.artist}
            </p>
            <p className="text-sm text-muted-foreground">
              {details.label}, {details.year}
            </p>
            <div className="mt-8 relative z-10">
              <Button
                variant="outline"
                size="sm"
                className="absolute -top-7.5 left-2 rounded-none"
              >
                Lyrics
              </Button>
              <div className="max-h-32 bg-white overflow-y-auto rounded border bg-muted/30 p-3 text-sm">
                {details.lyrics.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
