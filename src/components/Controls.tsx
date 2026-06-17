import { useState } from "react";
import type { Difficulty } from "../types";
import { formatTime } from "../utils/formatTime";
import { HelpModal } from "./HelpModal";

type Theme = "light" | "dark" | "cream";

const THEME_LABEL: Record<Theme, string> = {
  light: "☾ Dark",
  dark: "☕ Cream",
  cream: "☀ Light",
};

interface ControlsProps {
  difficulty: Difficulty;
  placedCount: number;
  totalClues: number;
  puzzleName: string;
  elapsedMs: number;
  started: boolean;
  solved: boolean;
  onDifficultyChange: (d: Difficulty) => void;
  onReset: () => void;
  onNewPuzzle: () => void;
  theme: Theme;
  onCycleTheme: () => void;
}

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "5x5", label: "5×5" },
  { id: "7x7", label: "7×7" },
  { id: "9x9", label: "9×9" },
  { id: "10x10", label: "10×10" },
];

export function Controls({
  difficulty,
  placedCount,
  totalClues,
  puzzleName,
  elapsedMs,
  started,
  solved,
  onDifficultyChange,
  onReset,
  onNewPuzzle,
  theme,
  onCycleTheme,
}: ControlsProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Shikaku</h1>
            <p className="text-sm text-muted-foreground">
              四角に切れ — divide the grid into rectangles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
              aria-label="How to play"
            >
              ? Help
            </button>
            <button
              type="button"
              onClick={onCycleTheme}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
              aria-label="Switch theme"
            >
              {THEME_LABEL[theme]}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Grid size">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onDifficultyChange(d.id)}
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors border",
                difficulty === d.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-border hover:bg-accent",
              ].join(" ")}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 grid grid-cols-3 gap-2 text-center sm:text-left sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <span className="text-sm text-muted-foreground">Puzzle</span>
            <p className="font-medium text-foreground">{puzzleName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Time</span>
            <p
              className={[
                "font-semibold tabular-nums",
                solved ? "text-valid" : !started ? "text-muted-foreground" : "text-foreground",
              ].join(" ")}
              aria-live="polite"
            >
              {!started ? "—" : formatTime(elapsedMs)}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-sm text-muted-foreground">Progress</span>
            <p className="font-semibold text-primary tabular-nums">
              {placedCount} / {totalClues}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 min-w-[120px] rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-accent transition-colors"
          >
            Reset puzzle
          </button>
          <button
            type="button"
            onClick={onNewPuzzle}
            className="flex-1 min-w-[120px] rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            New puzzle
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Click and drag to draw a rectangle. Each must contain exactly one clue and match its area.
          Click a placed rectangle to remove it.
        </p>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
