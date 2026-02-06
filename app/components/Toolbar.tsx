"use client";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Shuffle } from "lucide-react";
import type { Locale } from "@/lib/api";

interface ToolbarProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  seed: string;
  onSeedChange: (seed: string) => void;
  onRandomSeed: () => void;
  likes: number;
  onLikesChange: (value: number) => void;
  viewMode: "table" | "list";
  onViewModeChange: (mode: "table" | "list") => void;
}

export function Toolbar({
  locale,
  onLocaleChange,
  seed,
  onSeedChange,
  onRandomSeed,
  likes,
  onLikesChange,
  viewMode,
  onViewModeChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 gap-8 border-b bg-background px-4 py-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Language
        </label>
        <NativeSelect
          value={locale}
          onChange={(e) => onLocaleChange(e.target.value as Locale)}
          className="min-w-[140px]"
        >
          <NativeSelectOption value="en-US">English (US)</NativeSelectOption>
          <NativeSelectOption value="de-DE">German (DE)</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Seed
        </label>
        <input
          type="text"
          value={seed}
          onChange={(e) => onSeedChange(e.target.value)}
          className="h-9 w-32 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Seed"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRandomSeed}
          aria-label="Random seed"
        >
          <Shuffle className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Likes
        </label>
        <div className="flex w-40 items-center gap-2 text-blue-500">
          <Slider
            className="[&_[data-slot=slider-range]]:bg-blue-500 [&_[data-slot=slider-thumb:border-blue-500"
            min={0}
            max={10}
            step={0.1}
            value={[likes]}
            onValueChange={(value) => onLikesChange(value[0])}
          />
          <span className="w-8 text-sm tabular-nums text-muted-foreground ">
            {likes.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          type="button"
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("table")}
          aria-label="Table view"
        >
          <LayoutGrid className="size-4" />
        </Button>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          type="button"
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("list")}
          aria-label="List view"
        >
          <List className="size-4" />
        </Button>
      </div>
    </div>
  );
}
