"use client";

import React, { useCallback, useEffect, useState } from "react";
import { listSongs, getRandomSeed, type Locale, type Song } from "@/lib/api";
import { Toolbar } from "./Toolbar";
import { SongDetailRow } from "./SongDetailRow";
import { Pagination } from "./Pagination";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const LIMIT = 20;

function getPageNumbers(current: number): number[] {
  const pages: number[] = [];
  for (let i = Math.max(1, current - 2); i <= current + 2; i++) {
    pages.push(i);
  }
  return pages;
}

export default function MusicPage() {
  const [locale, setLocale] = useState<Locale>("en-US");
  const [seed, setSeed] = useState("58933423");
  const [likes, setLikes] = useState(3.7);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "list">("table");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responsePage, setResponsePage] = useState(1);

  const fetchSongs = useCallback(() => {
    setLoading(true);
    setError(null);
    listSongs({ locale, seed, page, limit: LIMIT, likes })
      .then((res) => {
        setSongs(res.songs);
        setResponsePage(res.page);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, [locale, seed, page, likes]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSongs();
  }, [fetchSongs]);

  const handleLocaleChange = useCallback((l: Locale) => {
    setLocale(l);
    setPage(1);
    setExpandedIndex(null);
  }, []);

  const handleSeedChange = useCallback((s: string) => {
    setSeed(s);
    setPage(1);
    setExpandedIndex(null);
  }, []);

  const handleRandomSeed = useCallback(async () => {
    try {
      const res = await getRandomSeed();
      setSeed(res.seed);
      setPage(1);
      setExpandedIndex(null);
    } catch {
      setError("Failed to get random seed");
    }
  }, []);

  const handleLikesChange = useCallback((v: number) => {
    setLikes(v);
    setPage(1);
    setExpandedIndex(null);
  }, []);

  const handleViewModeChange = useCallback((mode: "table" | "list") => {
    setViewMode(mode);
  }, []);

  const toggleExpand = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const pageNumbers = getPageNumbers(responsePage);
  const hasMore = songs.length >= LIMIT;
  const lastPage = hasMore ? responsePage + 1 : responsePage;

  return (
    <div className="flex min-h-screen flex-col">
      <Toolbar
        locale={locale}
        onLocaleChange={handleLocaleChange}
        seed={seed}
        onSeedChange={handleSeedChange}
        onRandomSeed={handleRandomSeed}
        likes={likes}
        onLikesChange={handleLikesChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <main className="flex-1 overflow-auto px-4 py-4">
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-md border">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-20 border-b p-2 font-medium">#</th>
                <th className="border-b p-2 font-medium">Song</th>
                <th className="border-b p-2 font-medium">Artist</th>
                <th className="border-b p-2 font-medium">Album</th>
                <th className="border-b p-2 font-medium">Genre</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Loading…
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <React.Fragment key={song.index}>
                    <tr
                      onClick={() => toggleExpand(song.index)}
                      className={`border-b transition-colors hover:bg-muted/30 ${
                        expandedIndex === song.index ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="w-20 border-b p-0">
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-6 w-6 shrink-0"
                            onClick={() => toggleExpand(song.index)}
                            aria-label={
                              expandedIndex === song.index
                                ? "Collapse"
                                : "Expand"
                            }
                          >
                            {expandedIndex === song.index ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </Button>
                          <span>{song.index}</span>
                        </div>
                      </td>
                      <td className="border-b p-2 truncate">{song.title}</td>
                      <td className="border-b p-2 truncate">{song.artist}</td>
                      <td className="border-b p-2 truncate">{song.album}</td>
                      <td className="border-b p-2 truncate">{song.genre}</td>
                    </tr>
                    {expandedIndex === song.index && (
                      <SongDetailRow
                        index={song.index}
                        locale={locale}
                        seed={seed}
                        likesParam={likes}
                      />
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && songs.length > 0 && (
          <Pagination
            currentPage={responsePage}
            onPageChange={setPage}
            pageNumbers={pageNumbers}
            lastPage={Math.max(responsePage, lastPage)}
          />
        )}
      </main>
    </div>
  );
}
