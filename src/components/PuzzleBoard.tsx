import type { ReactNode } from "react";

interface PuzzleBoardProps {
  started: boolean;
  puzzleName: string;
  onStart: () => void;
  children: ReactNode;
}

export function PuzzleBoard({ started, puzzleName, onStart, children }: PuzzleBoardProps) {
  return (
    <div className="relative w-full">
      <div
        className={[
          "transition-[filter] duration-300",
          started ? "blur-0" : "blur-md brightness-95",
        ].join(" ")}
        aria-hidden={!started}
      >
        {children}
      </div>

      {!started && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 rounded-lg bg-background/40 backdrop-blur-[2px] p-6"
          role="presentation"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Ready when you are</p>
            <p className="text-lg font-semibold text-foreground">{puzzleName}</p>
          </div>
          <button
            type="button"
            onClick={onStart}
            className="rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start puzzle
          </button>
        </div>
      )}
    </div>
  );
}
