"use client";

import { cn } from "@/lib/utils";
import type { SongDetails } from "@/lib/api";

interface AlbumCoverProps {
  cover: SongDetails["cover"];
  className?: string;
}

export function AlbumCover({ cover, className }: AlbumCoverProps) {
  const { style, title, artist } = cover;
  const isGradient = style === "gradient";
  const isNoise = style === "noise";
  const isPattern = style === "pattern";

  return (
    <div
      className={cn(
        "flex aspect-square w-full flex-col items-center justify-center rounded-md p-3 text-center text-white shadow-md",
        isGradient &&
          "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600",
        isNoise && "bg-gradient-to-br from-slate-600 to-slate-800",
        isPattern && "bg-gradient-to-br from-indigo-600 to-purple-700",
        className
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
        {artist}
      </span>
      <span className="mt-1 line-clamp-2 text-sm font-bold leading-tight">
        {title}
      </span>
    </div>
  );
}
