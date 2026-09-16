import { createAccount, createClient } from "genlayer-js";
import {
  estimateWriteFeePreset,
  feePresetToTransactionFees,
  type FeePresetEstimate,
  type FeePresetLevel,
} from "../genlayer/fees";

export type TrialStatus = {
  admin: string;
  trial_id: string;
  definition_of_done: string;
  candidate_solana: string;
  referrer_solana: string;
  verdict: string;
  score: number;
  reasoning: string;
  payload_hex: string;
};

class OutcomVerifier {
  private contractAddress: `0x${string}`;
  private client: any;
  private studioUrl?: string;

  constructor(contractAddress: string,
    accountOrAddress?: string | null,
    studioUrl?: string,
    privateKey?: string | null) {
    this.contractAddress = contractAddress as `0x${string}`;
    this.studioUrl = studioUrl;

    const config: any = {
      endpoint: studioUrl,
    };
    if (privateKey) {
      config.account = createAccount(
        privateKey.startsWith("0x")
          ? (privateKey as `0x${string}`)
          : (`0x${privateKey}` as `0x${string}`)
      );
    } else if (accountOrAddress) {
      config.account = accountOrAddress as `0x${string}`;
    }

    this.client = createClient(config);
  }

  updateAccount(address: string): void {
    const config: any = {
      account: address as `0x${string}`,
      endpoint: this.studioUrl,
    };
    this.client = createClient(config);
  }

  async getTrialStatus(): Promise<TrialStatus | null> {
    try {
      const raw = await this.client.readContract({
        address: this.contractAddress,
        functionName: "get_trial_status",
        args: [],
      });
      return raw as TrialStatus;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async estimateSetTrialFees(
    trialId: string,
    definitionOfDone: string,
    level: FeePresetLevel = "standard"
  ): Promise<FeePresetEstimate | undefined> {
    return estimateWriteFeePreset(
      this.client,
      {
        address: this.contractAddress,
        functionName: "set_trial",
        args: [trialId, definitionOfDone],
      },
      level
    );
  }

  async setTrial(
    trialId: string,
    definitionOfDone: string,
    feePreset?: FeePresetEstimate
  ) {
    const fees = feePresetToTransactionFees(feePreset);
    const txHash = await this.client.writeContract({
      address: this.contractAddress,
      functionName: "set_trial",
      args: [trialId, definitionOfDone],
      value: BigInt(0),
      ...(fees ? { fees } : {}),
    });
    return this.client.waitForTransactionReceipt({
      hash: txHash,
      status: "ACCEPTED" as any,
      retries: 24,
      interval: 5000,
    });
  }

  async estimateSubmitFees(
    candidate: string,
    referrer: string,
    repo: string,
    deploy: string,
    extra: string,
    level: FeePresetLevel = "standard"
  ) {
    return estimateWriteFeePreset(
      this.client,
      {
        address: this.contractAddress,
        functionName: "submit_and_verify",
        args: [candidate, referrer, repo, deploy, extra],
      },
      level
    );
  }

  async submitAndVerify(
    candidate: string,
    referrer: string,
    repo: string,
    deploy: string,
    extra: string,
    feePreset?: FeePresetEstimate
  ) {
    const fees = feePresetToTransactionFees(feePreset);
    const txHash = await this.client.writeContract({
      address: this.contractAddress,
      functionName: "submit_and_verify",
      args: [candidate, referrer, repo, deploy, extra],
      value: BigInt(0),
      ...(fees ? { fees } : {}),
    });
    return this.client.waitForTransactionReceipt({
      hash: txHash,
      status: "ACCEPTED" as any,
      retries: 48,
      interval: 5000,
    });
  }
}

export default OutcomVerifier;