/** Shikaku backtracking solver */

function solvePuzzle(rows, cols, clues) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(-1));
  const clueCells = new Set(clues.map(([r, c]) => `${r},${c}`));

  function* rectsForClue(row, col, area) {
    for (let h = 1; h <= rows; h++) {
      if (area % h !== 0) continue;
      const w = area / h;
      if (w < 1 || w > cols) continue;
      for (let r0 = Math.max(0, row - h + 1); r0 <= Math.min(row, rows - h); r0++) {
        for (let c0 = Math.max(0, col - w + 1); c0 <= Math.min(col, cols - w); c0++) {
          if (row >= r0 && row < r0 + h && col >= c0 && col < c0 + w) {
            yield { r0, c0, h, w };
          }
        }
      }
    }
  }

  function countOpts(row, col, area) {
    let n = 0;
    for (const _ of rectsForClue(row, col, area)) n++;
    return n;
  }

  const ordered = [...clues].sort(
    (a, b) => countOpts(a[0], a[1], a[2]) - countOpts(b[0], b[1], b[2])
  );

  function solve(idx) {
    if (idx === ordered.length) {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) if (grid[r][c] === -1) return false;
      return true;
    }

    const [row, col, area] = ordered[idx];
    for (const rect of rectsForClue(row, col, area)) {
      const cells = [];
      let ok = true;
      let cluesInRect = 0;
      for (let r = rect.r0; r < rect.r0 + rect.h && ok; r++) {
        for (let c = rect.c0; c < rect.c0 + rect.w; c++) {
          if (grid[r][c] !== -1) {
            ok = false;
            break;
          }
          if (clueCells.has(`${r},${c}`)) cluesInRect++;
          cells.push([r, c]);
        }
      }
      if (!ok || cluesInRect !== 1) continue;
      for (const [r, c] of cells) grid[r][c] = idx;
      if (solve(idx + 1)) return true;
      for (const [r, c] of cells) grid[r][c] = -1;
    }
    return false;
  }

  const ok = solve(0);
  return { solvable: ok, grid };
}

// Usage: node scripts/verify-all.mjs  (checks every puzzle in src/puzzles.ts)
console.log("Run: node scripts/verify-all.mjs");
