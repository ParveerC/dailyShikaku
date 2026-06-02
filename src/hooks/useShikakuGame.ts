import { useCallback, useMemo, useState } from "react";
import { useTimer } from "./useTimer";
import {
  boundsFromDrag,
  getCellOwner,
  isPuzzleSolved,
  validatePlacement,
} from "../gameLogic";
import { getRandomPuzzle } from "../puzzles";
import type { CellBounds, Difficulty, Puzzle, Rectangle, ValidationResult } from "../types";

const RECT_COLORS = [
  "bg-chart-2/70 border-chart-1/40",
  "bg-chart-4/80 border-chart-5/50",
  "bg-secondary/60 border-primary/30",
  "bg-chart-3/90 border-chart-1/25",
  "bg-chart-2/50 border-chart-5/40",
  "bg-chart-4/60 border-primary/35",
  "bg-secondary/80 border-chart-5/45",
  "bg-chart-3/70 border-chart-1/30",
  "bg-chart-2/90 border-chart-5/35",
  "bg-chart-4/70 border-primary/40",
  "bg-secondary/50 border-chart-1/50",
  "bg-chart-3/80 border-chart-5/30",
];

function newId(): string {
  return crypto.randomUUID();
}

export function useShikakuGame(initialDifficulty: Difficulty = "5x5") {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [puzzle, setPuzzle] = useState<Puzzle>(() => getRandomPuzzle(initialDifficulty));
  const [placed, setPlaced] = useState<Rectangle[]>([]);
  const [dragStart, setDragStart] = useState<{ row: number; col: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ row: number; col: number } | null>(null);
  const [previewValidation, setPreviewValidation] = useState<ValidationResult>("neutral");
  const [solved, setSolved] = useState(false);
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const { elapsedMs, reset: resetTimer } = useTimer(
    started && !solved,
    puzzle.id,
    solved
  );

  const clueMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of puzzle.clues) {
      map.set(`${c.row},${c.col}`, c.value);
    }
    return map;
  }, [puzzle]);

  const selection = useMemo((): CellBounds | null => {
    if (!dragStart || !dragEnd) return null;
    return boundsFromDrag(dragStart, dragEnd);
  }, [dragStart, dragEnd]);

  const resetPlacements = useCallback(() => {
    setPlaced([]);
    setDragStart(null);
    setDragEnd(null);
    setPreviewValidation("neutral");
    setSolved(false);
    setStarted(false);
    setStartedAt(null);
    resetTimer();
  }, [resetTimer]);

  const startPuzzle = useCallback(() => {
    const now = Date.now();
    setStartedAt(now);
    resetTimer();
    setStarted(true);
  }, [resetTimer]);

  const loadPuzzle = useCallback(
    (next: Puzzle) => {
      setPuzzle(next);
      resetPlacements();
    },
    [resetPlacements]
  );

  const changeDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      loadPuzzle(getRandomPuzzle(d));
    },
    [loadPuzzle]
  );

  const newPuzzle = useCallback(() => {
    loadPuzzle(getRandomPuzzle(difficulty, puzzle.id));
  }, [difficulty, loadPuzzle, puzzle.id]);

  const checkWin = useCallback(
    (nextPlaced: Rectangle[]) => {
      if (isPuzzleSolved(puzzle, nextPlaced)) {
        setSolved(true);
      }
    },
    [puzzle]
  );

  const startDrag = useCallback((row: number, col: number) => {
    if (!started) return;
    const owner = getCellOwner(row, col, placed);
    if (owner) return;
    setDragStart({ row, col });
    setDragEnd({ row, col });
    setPreviewValidation("neutral");
    setSolved(false);
  }, [placed, started]);

  const updateDrag = useCallback(
    (row: number, col: number) => {
      if (!dragStart) return;
      setDragEnd({ row, col });
      const bounds = boundsFromDrag(dragStart, { row, col });
      setPreviewValidation(validatePlacement(bounds, puzzle, placed));
    },
    [dragStart, puzzle, placed]
  );

  const endDrag = useCallback(() => {
    if (!dragStart || !dragEnd) {
      setDragStart(null);
      setDragEnd(null);
      return;
    }

    const bounds = boundsFromDrag(dragStart, dragEnd);
    const validation = validatePlacement(bounds, puzzle, placed);

    if (validation === "valid") {
      const clues = puzzle.clues.filter(
        (c) =>
          c.row >= bounds.startRow &&
          c.row <= bounds.endRow &&
          c.col >= bounds.startCol &&
          c.col <= bounds.endCol
      );
      const rect: Rectangle = {
        id: newId(),
        ...bounds,
        clueValue: clues[0].value,
      };
      const next = [...placed, rect];
      setPlaced(next);
      checkWin(next);
    }

    setDragStart(null);
    setDragEnd(null);
    setPreviewValidation("neutral");
  }, [dragStart, dragEnd, puzzle, placed, checkWin]);

  const removeRectangle = useCallback((id: string) => {
    setPlaced((prev) => prev.filter((r) => r.id !== id));
    setSolved(false);
  }, []);

  const getRectColorIndex = useCallback(
    (rectId: string) => {
      const idx = placed.findIndex((r) => r.id === rectId);
      return idx >= 0 ? idx % RECT_COLORS.length : 0;
    },
    [placed]
  );

  return {
    difficulty,
    puzzle,
    placed,
    clueMap,
    selection,
    previewValidation,
    solved,
    started,
    startedAt,
    elapsedMs,
    rectColors: RECT_COLORS,
    changeDifficulty,
    newPuzzle,
    resetPlacements,
    startPuzzle,
    startDrag,
    updateDrag,
    endDrag,
    removeRectangle,
    getRectColorIndex,
  };
}
