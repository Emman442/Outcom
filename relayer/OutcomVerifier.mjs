import { createAccount, createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

function as0x(value) {
  if (!value) return value;
  return value.startsWith("0x") ? value : `0x${value}`;
}

export class OutcomVerifier {
  constructor(contractAddress, studioUrl, privateKey) {
    if (!contractAddress) throw new Error("GL_CONTRACT missing");
    if (!studioUrl) throw new Error("GL_RPC missing");

    this.contractAddress = as0x(contractAddress);

    const chain = {
      ...studioDevnet,
      id: 61997,
      name: "GenLayer Studio Next",
      rpcUrls: { default: { http: [studioUrl] } },
    };

    const config = {
      chain,
      endpoint: studioUrl,
    };

    if (privateKey) {
      config.account = createAccount(as0x(privateKey));
    }

    this.client = createClient(config);
  }
  async getTrialStatus() {
    return this.client.readContract({
      address: this.contractAddress,
      functionName: "get_trial_status",
      args: [],
    });
  }

  async estimateFees(functionName, args) {
    const write = {
      address: this.contractAddress,
      functionName,
      args,
    };

    if (typeof this.client.estimateTransactionFeesForWrite === "function") {
      return this.client.estimateTransactionFeesForWrite(write);
    }
    return null;
  }

  async write(functionName, args) {
    const estimate = await this.estimateFees(functionName, args);
    const fees =
      estimate && (estimate.distribution || estimate.feeValue)
        ? {
          distribution: estimate.distribution,
          feeValue: estimate.feeValue,
        }
        : undefined;

    const txHash = await this.client.writeContract({
      address: this.contractAddress,
      functionName,
      args,
      value: 0n,
      ...(fees ? { fees } : {}),
    });

    if (typeof this.client.waitForTransactionReceipt === "function") {
      return this.client.waitForTransactionReceipt({
        hash: txHash,
        waitUntil: "decided",
        retries: 24,
        interval: 5000,
      });
    }
    return txHash;
  }

  setTrial(trialId, definitionOfDone) {
    const id = String(trialId ?? "").trim();
    const dod = String(definitionOfDone ?? "").trim();


    if (!id) throw new Error("trialId missing");
    if (id.length > 32) throw new Error("trialId longer than 32");
    if (dod.length < 20) throw new Error("definitionOfDone too short");

    return this.write("set_trial", [String(trialId), String(definitionOfDone)]);
  }

  submitAndVerify(candidate, referrer, repo, deploy, extra) {
    return this.write("submit_and_verify", [
      candidate || "",
      referrer || "",
      repo || "",
      deploy || "",
      extra || "",
    ]);
  }
}

export function createAdminOutcom() {
  const key = process.env.GL_ADMIN_PRIVATE_KEY;
  if (!key) throw new Error("GL_ADMIN_PRIVATE_KEY missing");

  return new OutcomVerifier(
    process.env.GL_CONTRACT,
    process.env.GL_RPC,
    key
  );
}