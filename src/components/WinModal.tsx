import { formatTime } from "../utils/formatTime";

interface WinModalProps {
  elapsedMs: number;
  onNewPuzzle: () => void;
  onPlayAgain: () => void;
}

export function WinModal({ elapsedMs, onNewPuzzle, onPlayAgain }: WinModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="text-5xl mb-4" aria-hidden>
          🎉
        </div>
        <h2 id="win-title" className="text-2xl font-bold text-card-foreground mb-2">
          Puzzle Solved!
        </h2>
        <p className="text-muted-foreground mb-2">
          Every cell is covered and all rectangles match their clues.
        </p>
        <p className="text-3xl font-bold text-primary tabular-nums mb-6">
          {formatTime(elapsedMs)}
        </p>
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
