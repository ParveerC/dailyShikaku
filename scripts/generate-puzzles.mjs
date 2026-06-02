/** Generate verified-solvable Shikaku puzzles by building a random partition first. */

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

  return solve(0);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPartition(rows, cols, minRects, maxRects, minArea, maxArea) {
  const filled = Array.from({ length: rows }, () => Array(cols).fill(false));
  const rects = [];

  function firstEmpty() {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) if (!filled[r][c]) return [r, c];
    return null;
  }

  function backtrack() {
    const pos = firstEmpty();
    if (!pos) return rects.length >= minRects && rects.length <= maxRects;

    const [r0, c0] = pos;
    const options = [];
    for (let h = 1; r0 + h <= rows; h++) {
      for (let w = 1; c0 + w <= cols; w++) {
        const area = h * w;
        if (area < minArea || area > maxArea) continue;
        let ok = true;
        for (let r = r0; r < r0 + h && ok; r++) {
          for (let c = c0; c < c0 + w; c++) {
            if (filled[r][c]) ok = false;
          }
        }
        if (ok) options.push({ r0, c0, h, w, area });
      }
    }
    shuffle(options);

    for (const rect of options) {
      for (let r = rect.r0; r < rect.r0 + rect.h; r++) {
        for (let c = rect.c0; c < rect.c0 + rect.w; c++) filled[r][c] = true;
      }
      rects.push(rect);
      if (backtrack()) return true;
      rects.pop();
      for (let r = rect.r0; r < rect.r0 + rect.h; r++) {
        for (let c = rect.c0; c < rect.c0 + rect.w; c++) filled[r][c] = false;
      }
    }
    return false;
  }

  if (!backtrack()) return null;
  return rects;
}

function rectsToClues(rects) {
  return rects.map((rect) => {
    const cells = [];
    for (let r = rect.r0; r < rect.r0 + rect.h; r++) {
      for (let c = rect.c0; c < rect.c0 + rect.w; c++) cells.push([r, c]);
    }
    const [row, col] = cells[Math.floor(Math.random() * cells.length)];
    return { row, col, value: rect.area };
  });
}

function clueKey(clues) {
  return clues
    .map((c) => `${c.row},${c.col},${c.value}`)
    .sort()
    .join("|");
}

const CONFIG = {
  "5x5": { rows: 5, cols: 5, count: 4, minRects: 5, maxRects: 8, minArea: 2, maxArea: 12 },
  "7x7": { rows: 7, cols: 7, count: 4, minRects: 7, maxRects: 11, minArea: 2, maxArea: 16 },
  "9x9": { rows: 9, cols: 9, count: 4, minRects: 9, maxRects: 14, minArea: 2, maxArea: 20 },
  "10x10": { rows: 10, cols: 10, count: 5, minRects: 10, maxRects: 14, minArea: 2, maxArea: 25 },
};

const NAMES = {
  "5x5": ["Starter", "Paths", "Split", "Nest"],
  "7x7": ["Classic", "Ridge", "Pools", "Weave"],
  "9x9": ["Grand", "Fields", "Rings", "Delta"],
  "10x10": ["Deca", "Walls", "Lanes", "Blocks", "Merge"],
};

const result = {};

for (const [diff, cfg] of Object.entries(CONFIG)) {
  const seen = new Set();
  const puzzles = [];
  let attempts = 0;

  while (puzzles.length < cfg.count && attempts < 50000) {
    attempts++;
    const rects = buildPartition(
      cfg.rows,
      cfg.cols,
      cfg.minRects,
      cfg.maxRects,
      cfg.minArea,
      cfg.maxArea
    );
    if (!rects) continue;

    const clues = rectsToClues(rects);
    const key = clueKey(clues);
    if (seen.has(key)) continue;

    const triples = clues.map((c) => [c.row, c.col, c.value]);
    if (!solvePuzzle(cfg.rows, cfg.cols, triples)) continue;

    seen.add(key);
    const id = `${diff.split("x")[0]}-${puzzles.length + 1}`;
    puzzles.push({
      id,
      name: NAMES[diff][puzzles.length],
      rows: cfg.rows,
      cols: cfg.cols,
      clues: clues.sort((a, b) => a.row - b.row || a.col - b.col),
    });
  }

  if (puzzles.length < cfg.count) {
    console.error(`Failed to generate enough ${diff} puzzles (${puzzles.length}/${cfg.count})`);
    process.exit(1);
  }
  result[diff] = puzzles;
  console.error(`${diff}: ${puzzles.length} puzzles in ${attempts} attempts`);
}

console.log(JSON.stringify(result, null, 2));
