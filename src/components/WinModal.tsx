import { useEffect, useState } from "react";
import { getStoredPlayerName } from "../lib/scores";
import type { Difficulty, Score, ScoreInput } from "../types";
import { formatTime } from "../utils/formatTime";

interface WinModalProps {
  elapsedMs: number;
  difficulty: Difficulty;
  puzzleId: string;
  puzzleName: string;
  startedAt: number | null;
  onSubmitScore: (input: ScoreInput) => Promise<Score | null>;
  onNewPuzzle: () => void;
  onPlayAgain: () => void;
}

export function WinModal({
  elapsedMs,
  difficulty,
  puzzleId,
  puzzleName,
  startedAt,
  onSubmitScore,
  onNewPuzzle,
  onPlayAgain,
}: WinModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPlayerName(getStoredPlayerName());
    setSaved(false);
  }, [puzzleId, elapsedMs]);

  const handleSave = async () => {
    setSaving(true);
    const completedAt = Date.now();
    const score = await onSubmitScore({
      playerName,
      difficulty,
      puzzleId,
      puzzleName,
      elapsedMs,
      startedAt: startedAt ?? completedAt - elapsedMs,
      completedAt,
    });
    setSaving(false);
    if (score) setSaved(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-xl">
        <div className="text-5xl mb-4 text-center" aria-hidden>
          🎉
        </div>
        <h2 id="win-title" className="text-2xl font-bold text-card-foreground mb-2 text-center">
          Puzzle Solved!
        </h2>
        <p className="text-muted-foreground mb-2 text-center text-sm">
          {puzzleName} · {difficulty}
        </p>
        <p className="text-3xl font-bold text-primary tabular-nums mb-6 text-center">
          {formatTime(elapsedMs)}
        </p>

        <div className="mb-6 space-y-2">
          <label htmlFor="player-name" className="text-sm font-medium text-card-foreground">
            Your name
          </label>
          <input
            id="player-name"
            type="text"
            maxLength={24}
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setSaved(false);
            }}
            placeholder="Enter name for leaderboard"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!playerName.trim() || saved || saving}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? "Saved to leaderboard ✓" : saving ? "Saving..." : "Save score"}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onNewPuzzle}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            New puzzle
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}