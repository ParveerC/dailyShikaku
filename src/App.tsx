import { useEffect, useState } from "react";
import { Controls } from "./components/Controls";
import { Grid } from "./components/Grid";
import { PuzzleBoard } from "./components/PuzzleBoard";
import { Leaderboard } from "./components/Leaderboard";
import { WinModal } from "./components/WinModal";
import { useLeaderboard } from "./hooks/useLeaderboard";
import { useShikakuGame } from "./hooks/useShikakuGame";

type Theme = "light" | "dark" | "cream";

const THEME_CYCLE: Theme[] = ["light", "dark", "cream"];

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("cream")) return "cream";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const game = useShikakuGame("5x5");
  const leaderboard = useLeaderboard(game.difficulty);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "cream");
    if (theme === "dark") html.classList.add("dark");
    if (theme === "cream") html.classList.add("cream");
  }, [theme]);

  const cycleTheme = () => {
    setTheme((t) => THEME_CYCLE[(THEME_CYCLE.indexOf(t) + 1) % THEME_CYCLE.length]);
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-8">
        <Controls
          difficulty={game.difficulty}
          placedCount={game.placed.length}
          totalClues={game.puzzle.clues.length}
          puzzleName={game.puzzle.name}
          elapsedMs={game.elapsedMs}
          started={game.started}
          solved={game.solved}
          onDifficultyChange={game.changeDifficulty}
          onReset={game.resetPlacements}
          onNewPuzzle={game.newPuzzle}
          theme={theme}
          onCycleTheme={cycleTheme}
        />

        <PuzzleBoard
          started={game.started}
          puzzleName={game.puzzle.name}
          onStart={game.startPuzzle}
        >
          <Grid
            puzzle={game.puzzle}
            placed={game.placed}
            clueMap={game.clueMap}
            selection={game.selection}
            previewValidation={game.previewValidation}
            rectColors={game.rectColors}
            getRectColorIndex={game.getRectColorIndex}
            onStartDrag={game.startDrag}
            onUpdateDrag={game.updateDrag}
            onEndDrag={game.endDrag}
            onRemoveRect={game.removeRectangle}
          />
        </PuzzleBoard>

        <Leaderboard currentDifficulty={game.difficulty} />
      </main>

      {game.solved && (
        <WinModal
          elapsedMs={game.elapsedMs}
          difficulty={game.difficulty}
          puzzleId={game.puzzle.id}
          puzzleName={game.puzzle.name}
          startedAt={game.startedAt}
          onSubmitScore={leaderboard.submitScore}
          onNewPuzzle={game.newPuzzle}
          onPlayAgain={game.resetPlacements}
        />
      )}
    </div>
  );
}