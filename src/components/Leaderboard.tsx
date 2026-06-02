import type { Difficulty, Score } from "../types";
import { formatTime } from "../utils/formatTime";

interface LeaderboardProps {
  difficulty: Difficulty;
  entries: Score[];
}

export function Leaderboard({ difficulty, entries }: LeaderboardProps) {
  return (
    <section
      className="w-full max-w-lg mx-auto rounded-lg border border-border bg-card p-4 shadow-sm"
      aria-labelledby="leaderboard-title"
    >
      <h2 id="leaderboard-title" className="text-lg font-semibold text-card-foreground mb-1">
        Leaderboard
      </h2>
      <p className="text-xs text-muted-foreground mb-4">{difficulty} · fastest times</p>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No scores yet. Solve a puzzle and save your time.
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
