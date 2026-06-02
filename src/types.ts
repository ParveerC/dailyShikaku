export type Difficulty = "5x5" | "7x7" | "9x9" | "10x10";

export interface Clue {
  row: number;
  col: number;
  value: number;
}

export interface Puzzle {
  id: string;
  name: string;
  rows: number;
  cols: number;
  clues: Clue[];
}

export interface Rectangle {
  id: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  clueValue: number;
}

export interface CellBounds {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export type ValidationResult = "valid" | "invalid" | "neutral";
