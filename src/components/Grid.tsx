import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { getCellOwner, rectArea } from "../gameLogic";
import type { CellBounds, Puzzle, Rectangle, ValidationResult } from "../types";

interface GridProps {
  puzzle: Puzzle;
  placed: Rectangle[];
  clueMap: Map<string, number>;
  selection: CellBounds | null;
  previewValidation: ValidationResult;
  rectColors: string[];
  getRectColorIndex: (id: string) => number;
  onStartDrag: (row: number, col: number) => void;
  onUpdateDrag: (row: number, col: number) => void;
  onEndDrag: () => void;
  onRemoveRect: (id: string) => void;
}

function cellInBounds(row: number, col: number, b: CellBounds): boolean {
  return row >= b.startRow && row <= b.endRow && col >= b.startCol && col <= b.endCol;
}

export function Grid({
  puzzle,
  placed,
  clueMap,
  selection,
  previewValidation,
  rectColors,
  getRectColorIndex,
  onStartDrag,
  onUpdateDrag,
  onEndDrag,
  onRemoveRect,
}: GridProps) {
  const dragging = useRef(false);

  useEffect(() => {
    const handleUp = () => {
      if (dragging.current) {
        dragging.current = false;
        onEndDrag();
      }
    };
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [onEndDrag]);

  const handleCellDown = useCallback(
    (row: number, col: number) => {
      const owner = getCellOwner(row, col, placed);
      if (owner) {
        onRemoveRect(owner.id);
        return;
      }
      dragging.current = true;
      onStartDrag(row, col);
    },
    [placed, onRemoveRect, onStartDrag]
  );

  const handleCellEnter = useCallback(
    (row: number, col: number) => {
      if (dragging.current) onUpdateDrag(row, col);
    },
    [onUpdateDrag]
  );

  const selectionArea = selection ? rectArea(selection) : 0;

  const cells: ReactNode[] = [];
  for (let row = 0; row < puzzle.rows; row++) {
    for (let col = 0; col < puzzle.cols; col++) {
      const key = `${row},${col}`;
      const clue = clueMap.get(key);
      const owner = getCellOwner(row, col, placed);
      const inSelection = selection && cellInBounds(row, col, selection);
      const showAreaOnCell =
        inSelection &&
        selection &&
        row === selection.startRow &&
        col === selection.startCol;

      let bg = "bg-card";
      let border = "border-border";

      if (owner) {
        bg = rectColors[getRectColorIndex(owner.id)];
        border = "border-primary/20";
      } else if (inSelection) {
        if (previewValidation === "valid") {
          bg = "bg-valid-muted";
          border = "border-valid";
        } else if (previewValidation === "invalid") {
          bg = "bg-invalid-muted";
          border = "border-invalid";
        } else {
          bg = "bg-accent";
          border = "border-ring";
        }
      }

      cells.push(
        <button
          key={key}
          type="button"
          className={[
            "relative flex items-center justify-center select-none touch-none",
            "border transition-colors duration-75",
            "text-card-foreground font-semibold tabular-nums",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10",
            bg,
            border,
            owner ? "cursor-pointer hover:opacity-80" : "cursor-crosshair",
          ].join(" ")}
          style={{ aspectRatio: "1" }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleCellDown(row, col);
          }}
          onMouseEnter={() => handleCellEnter(row, col)}
          onTouchStart={(e) => {
            e.preventDefault();
            handleCellDown(row, col);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            const btn = el?.closest("[data-row][data-col]") as HTMLElement | null;
            if (btn) {
              const r = Number(btn.dataset.row);
              const c = Number(btn.dataset.col);
              handleCellEnter(r, c);
            }
          }}
          data-row={row}
          data-col={col}
          aria-label={
            clue != null
              ? `Clue ${clue} at row ${row + 1} column ${col + 1}`
              : `Cell row ${row + 1} column ${col + 1}`
          }
        >
          {clue != null && (
            <span
              className={[
                "text-primary z-10",
                puzzle.rows >= 10 ? "text-sm sm:text-base" : "text-lg sm:text-xl",
              ].join(" ")}
            >
              {clue}
            </span>
          )}
          {showAreaOnCell && (
            <span
              className={[
                "pointer-events-none font-bold tabular-nums leading-none",
                clue != null
                  ? "absolute bottom-0.5 right-0.5 text-[10px] sm:text-xs opacity-80"
                  : puzzle.rows >= 10
                    ? "text-base sm:text-lg opacity-70"
                    : "text-lg sm:text-xl opacity-70",
                previewValidation === "valid"
                  ? "text-valid"
                  : previewValidation === "invalid"
                    ? "text-invalid"
                    : "text-primary",
              ].join(" ")}
            >
              {selectionArea}
            </span>
          )}
        </button>
      );
    }
  }

  const gridCap = puzzle.rows >= 10 ? 600 : 520;
  const maxSize = Math.min(
    gridCap,
    typeof window !== "undefined" ? window.innerWidth - 48 : gridCap
  );

  return (
    <div
      className="mx-auto rounded-lg border border-border bg-card p-2 shadow-sm"
      style={{ maxWidth: maxSize + 16 }}
    >
      <div
        className="grid gap-0 w-full"
        style={{
          gridTemplateColumns: `repeat(${puzzle.cols}, 1fr)`,
          gridTemplateRows: `repeat(${puzzle.rows}, 1fr)`,
          maxWidth: maxSize,
        }}
      >
        {cells}
      </div>
      {selection && (
        <p
          className={[
            "mt-3 text-center text-sm font-medium",
            previewValidation === "valid"
              ? "text-valid"
              : previewValidation === "invalid"
                ? "text-invalid"
                : "text-muted-foreground",
          ].join(" ")}
          role="status"
        >
          <span className="font-semibold tabular-nums">{selectionArea}</span>
          {selectionArea === 1 ? " cell selected" : " cells selected"}
          {previewValidation === "valid" && " · ✓ Valid"}
          {previewValidation === "invalid" && " · ✗ Invalid"}
        </p>
      )}
    </div>
  );
}
