import { useCallback, useEffect, useState } from "react";
import { buildScore, getLeaderboard, saveScoreLocal, setStoredPlayerName } from "../lib/scores";
import type { Difficulty, Score, ScoreInput } from "../types";

export function useLeaderboard(difficulty: Difficulty) {
  const [entries, setEntries] = useState<Score[]>([]);

  const refresh = useCallback(() => {
    setEntries(getLeaderboard(difficulty));
  }, [difficulty]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitScore = useCallback(
    (input: ScoreInput): Score | null => {
      const score = buildScore(input);
      if (!score.playerName) return null;
      setStoredPlayerName(score.playerName);
      saveScoreLocal(score);
      refresh();
      return score;
    },
    [refresh]
  );

  return { entries, refresh, submitScore };
}
