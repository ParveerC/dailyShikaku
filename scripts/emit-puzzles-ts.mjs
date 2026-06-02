import { readFileSync, writeFileSync } from "fs";

const data = JSON.parse(
  readFileSync(new URL("./generated.json", import.meta.url), "utf8").replace(/^\uFEFF/, "")
);

function fmtClues(clues) {
  return clues
    .map((c) => `        { row: ${c.row}, col: ${c.col}, value: ${c.value} },`)
    .join("\n");
}

function fmtPuzzle(p) {
  return `    {
      id: "${p.id}",
      name: "${p.name}",
      rows: ${p.rows},
      cols: ${p.cols},
      clues: [
${fmtClues(p.clues)}
      ],
    }`;
}

let out = `import type { Difficulty, Puzzle } from "./types";

export const PUZZLES: Record<Difficulty, Puzzle[]> = {
`;

for (const diff of ["5x5", "7x7", "9x9", "10x10"]) {
  out += `  "${diff}": [\n`;
  out += data[diff].map(fmtPuzzle).join(",\n");
  out += `\n  ],\n`;
}

out += `};

export function getRandomPuzzle(difficulty: Difficulty, excludeId?: string): Puzzle {
  const pool = PUZZLES[difficulty].filter((p) => p.id !== excludeId);
  const list = pool.length > 0 ? pool : PUZZLES[difficulty];
  return list[Math.floor(Math.random() * list.length)];
}
`;

writeFileSync(new URL("../src/puzzles.ts", import.meta.url), out);
console.log("Wrote src/puzzles.ts");
