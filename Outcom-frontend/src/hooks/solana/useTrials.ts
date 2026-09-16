import { useCallback, useEffect, useState } from "react";
import { useProgram } from "@/src/hooks/solana/use-program";

export function nextTrialId(count: number) {
  return `trial_${count + 1}`;
}

export function useTrials() {
  const { program } = useProgram();
  const [trials, setTrials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrials = useCallback(async () => {
    if (!program) return [];
    setIsLoading(true);
    try {
      const rows = await program.account.trialAccount.all();
      const sorted = [...rows].sort((a, b) => {
        const na = Number(String(a.account.trialId).replace("trial_", "")) || 0;
        const nb = Number(String(b.account.trialId).replace("trial_", "")) || 0;
        return na - nb;
      });
      setTrials(sorted);
      return sorted;
    } finally {
      setIsLoading(false);
    }
  }, [program]);

  useEffect(() => {
    void fetchTrials();
  }, [fetchTrials]);

  return {
    trials,
    isLoading,
    fetchTrials,
    nextId: nextTrialId(trials.length),
  };
}