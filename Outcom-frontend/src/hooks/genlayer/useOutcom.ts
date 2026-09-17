"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import OutcomVerifier from "../contracts/OutcomVerifier";
import { getContractAddress, getStudioUrl } from "../genlayer/client";
import { useWallet } from "../genlayer/wallet";
import { error, success } from "../utils/toast";

export function useOutcomContract() {
  const { address } = useWallet();
  const contractAddress = getContractAddress();
  const studioUrl = getStudioUrl();

  return useMemo(() => {
    if (!contractAddress) return null;
    return new OutcomVerifier(contractAddress, address, studioUrl);
  }, [contractAddress, address, studioUrl]);
}

export function useTrialStatus() {
  const contract = useOutcomContract();
  return useQuery({
    queryKey: ["outcom", "status"],
    queryFn: () => contract!.getTrialStatus(),
    enabled: !!contract,
    refetchInterval: 8000,
  });
}

export function useSetTrial() {
  const contract = useOutcomContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      trialId,
      definitionOfDone,
      requirements
    }: {
      trialId: string;
      definitionOfDone: string;
      requirements: string;
    }) => {
      if (!contract) throw new Error("Outcom contract not configured");
      if (!address) throw new Error("Connect the GenLayer admin wallet");
      const feePreset = await contract.estimateSetTrialFees(trialId, definitionOfDone, requirements);
      return contract.setTrial(trialId, definitionOfDone, requirements, feePreset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outcom"] });
      success("Trial registered on GenLayer");
    },
    onError: (err: any) => {
      error("set_trial failed", { description: err?.message });
    },
  });
}