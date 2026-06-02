import { useCallback, useEffect, useState } from "react";
import { buildScore, getLeaderboard, saveScore, setStoredPlayerName } from "../lib/scores";
import type { Difficulty, Score, ScoreInput } from "../types";

export function useLeaderboard(difficulty: Difficulty) {
  const [entries, setEntries] = useState<Score[]>([]);

  const refresh = useCallback(async () => {
    const scores = await getLeaderboard(difficulty);
    setEntries(scores);
  }, [difficulty]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitScore = useCallback(
    async (input: ScoreInput): Promise<Score | null> => {
      const score = buildScore(input);
      if (!score.playerName) return null;
      setStoredPlayerName(score.playerName);
      await saveScore(score);
      await refresh();
      return score;
    },
    [refresh]
  );

  return { entries, refresh, submitScore };
}