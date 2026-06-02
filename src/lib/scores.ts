import type { Difficulty, Score, ScoreInput } from "../types";
import { supabase } from "../utils/supabase";

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

export async function saveScore(score: Score): Promise<void> {
  await supabase.from("scores").insert({
    id: score.id,
    player_name: score.playerName,
    difficulty: score.difficulty,
    puzzle_id: score.puzzleId,
    puzzle_name: score.puzzleName,
    elapsed_ms: score.elapsedMs,
    completed_at: score.completedAt,
  });
}

export async function getLeaderboard(difficulty: Difficulty, limit = 25): Promise<Score[]> {
  const { data } = await supabase
    .from("scores")
    .select()
    .eq("difficulty", difficulty)
    .neq("player_name", "")
    .order("elapsed_ms", { ascending: true })
    .limit(limit);

  if (!data) return [];
  return data.map((row) => ({
    id: row.id,
    playerName: row.player_name,
    difficulty: row.difficulty,
    puzzleId: row.puzzle_id,
    puzzleName: row.puzzle_name,
    elapsedMs: row.elapsed_ms,
    completedAt: row.completed_at,
  }));
}

export function getStoredPlayerName(): string {
  return localStorage.getItem(PLAYER_NAME_KEY) ?? "";
}

export function setStoredPlayerName(name: string): void {
  localStorage.setItem(PLAYER_NAME_KEY, name.trim());
}