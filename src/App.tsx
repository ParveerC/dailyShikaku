import { useEffect, useState } from "react";
import { Controls } from "./components/Controls";
import { Grid } from "./components/Grid";
import { PuzzleBoard } from "./components/PuzzleBoard";
import { WinModal } from "./components/WinModal";
import { useShikakuGame } from "./hooks/useShikakuGame";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(prefers-color-scheme: dark)").matches ||
      document.documentElement.classList.contains("dark")
    );
  });

  const game = useShikakuGame("5x5");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
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
      </main>

      {game.solved && (
        <WinModal
          elapsedMs={game.elapsedMs}
          onNewPuzzle={game.newPuzzle}
          onPlayAgain={game.resetPlacements}
        />
      )}
    </div>
  );
}
