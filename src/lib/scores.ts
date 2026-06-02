import type { Difficulty, Score, ScoreInput } from "../types";

const STORAGE_KEY = "shikaku-leaderboard";
const PLAYER_NAME_KEY = "shikaku-player-name";

export function buildScore(input: ScoreInput): Score {
  return {
    id: crypto.randomUUID(),
    playerName: input.playerName.trim(),
    difficulty: input.difficulty,
    puzzleId: input.puzzleId,
    puzzleName: input.puzzleName,
    elapsedMs: input.elapsedMs,
    completedAt: new Date(input.completedAt).toISOString(),
  };
}

function readAll(): Score[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Score[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(scores: Score[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

/** Save locally; swap for `submitScoreToApi` when you add a backend. */
export function saveScoreLocal(score: Score): void {
  const all = readAll();
  all.push(score);
  writeAll(all);
}

export function getLeaderboard(difficulty: Difficulty, limit = 25): Score[] {
  return readAll()
    .filter((s) => s.difficulty === difficulty && s.playerName.length > 0)
    .sort((a, b) => a.elapsedMs - b.elapsedMs)
    .slice(0, limit);
}

export function getStoredPlayerName(): string {
  return localStorage.getItem(PLAYER_NAME_KEY) ?? "";
}

export function setStoredPlayerName(name: string): void {
  localStorage.setItem(PLAYER_NAME_KEY, name.trim());
}

/** Payload shape for a future POST /api/scores */
export function toApiPayload(score: Score) {
  return {
    playerName: score.playerName,
    difficulty: score.difficulty,
    puzzleId: score.puzzleId,
    elapsedMs: score.elapsedMs,
    completedAt: score.completedAt,
  };
}
