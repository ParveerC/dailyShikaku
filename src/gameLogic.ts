import type { CellBounds, Clue, Puzzle, Rectangle, ValidationResult } from "./types";

export function normalizeBounds(a: CellBounds, b: CellBounds): CellBounds {
  return {
    startRow: Math.min(a.startRow, b.startRow),
    startCol: Math.min(a.startCol, b.startCol),
    endRow: Math.max(a.endRow, b.endRow),
    endCol: Math.max(a.endCol, b.endCol),
  };
}

export function rectArea(bounds: CellBounds): number {
  return (
    (bounds.endRow - bounds.startRow + 1) * (bounds.endCol - bounds.startCol + 1)
  );
}

export function cluesInside(bounds: CellBounds, clues: Clue[]): Clue[] {
  return clues.filter(
    (c) =>
      c.row >= bounds.startRow &&
      c.row <= bounds.endRow &&
      c.col >= bounds.startCol &&
      c.col <= bounds.endCol
  );
}

export function rectsOverlap(a: CellBounds, b: CellBounds): boolean {
  return !(
    a.endRow < b.startRow ||
    a.startRow > b.endRow ||
    a.endCol < b.startCol ||
    a.startCol > b.endCol
  );
}

export function isWithinGrid(bounds: CellBounds, rows: number, cols: number): boolean {
  return (
    bounds.startRow >= 0 &&
    bounds.startCol >= 0 &&
    bounds.endRow < rows &&
    bounds.endCol < cols
  );
}

export function validatePlacement(
  bounds: CellBounds,
  puzzle: Puzzle,
  placed: Rectangle[],
  excludeIds: string[] = []
): ValidationResult {
  if (!isWithinGrid(bounds, puzzle.rows, puzzle.cols)) return "invalid";

  const inside = cluesInside(bounds, puzzle.clues);
  if (inside.length !== 1) return "invalid";

  if (rectArea(bounds) !== inside[0].value) return "invalid";

  for (const r of placed) {
    if (excludeIds.includes(r.id)) continue;
    if (rectsOverlap(bounds, r)) return "invalid";
  }

  return "valid";
}

export function getCellOwner(
  row: number,
  col: number,
  placed: Rectangle[]
): Rectangle | null {
  return (
    placed.find(
      (r) =>
        row >= r.startRow &&
        row <= r.endRow &&
        col >= r.startCol &&
        col <= r.endCol
    ) ?? null
  );
}

export function isPuzzleSolved(puzzle: Puzzle, placed: Rectangle[]): boolean {
  if (placed.length !== puzzle.clues.length) return false;

  const covered = new Set<string>();
  for (const r of placed) {
    for (let row = r.startRow; row <= r.endRow; row++) {
      for (let col = r.startCol; col <= r.endCol; col++) {
        covered.add(`${row},${col}`);
      }
    }
    if (validatePlacement(r, puzzle, placed, [r.id]) !== "valid") return false;
  }

  return covered.size === puzzle.rows * puzzle.cols;
}

export function boundsFromDrag(
  start: { row: number; col: number },
  end: { row: number; col: number }
): CellBounds {
  return normalizeBounds(
    { startRow: start.row, startCol: start.col, endRow: start.row, endCol: start.col },
    { startRow: end.row, startCol: end.col, endRow: end.row, endCol: end.col }
  );
}
