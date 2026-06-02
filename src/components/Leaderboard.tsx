import { useState, useEffect } from "react";
import type { Difficulty, Score } from "../types";
import { getLeaderboard } from "../lib/scores";
import { formatTime } from "../utils/formatTime";

const DIFFICULTIES: Difficulty[] = ["5x5", "7x7", "9x9", "10x10"];

interface LeaderboardProps {
  currentDifficulty: Difficulty;
}

export function Leaderboard({ currentDifficulty }: LeaderboardProps) {
  const [tab, setTab] = useState<Difficulty>(currentDifficulty);
  const [entries, setEntries] = useState<Score[]>([]);

  useEffect(() => {
    setTab(currentDifficulty);
  }, [currentDifficulty]);

  useEffect(() => {
    getLeaderboard(tab).then(setEntries);
  }, [tab]);

  return (
    <section
      className="w-full max-w-lg mx-auto rounded-lg border border-border bg-card p-4 shadow-sm"
      aria-labelledby="leaderboard-title"
    >
      <h2 id="leaderboard-title" className="text-lg font-semibold text-card-foreground mb-3">
        Leaderboard
      </h2>

      <div className="flex gap-1 mb-4 rounded-md bg-muted p-1">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setTab(d)}
            className={`flex-1 rounded py-1 text-xs font-semibold transition-colors ${
              tab === d
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No scores yet for {tab}. Solve a puzzle and save your time.
        </p>
      ) : (
        <ol className="space-y-1">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 text-sm"
            >
              <span className="w-6 text-center font-semibold text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <span className="flex-1 font-medium text-foreground truncate">
                {entry.playerName}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[5rem] sm:max-w-none">
                {entry.puzzleName}
              </span>
              <span className="font-semibold text-primary tabular-nums shrink-0">
                {formatTime(entry.elapsedMs)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}