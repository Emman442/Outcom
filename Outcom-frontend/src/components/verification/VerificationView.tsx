import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { Outcom } from "../../types";
import { UsdcDisplay } from "../common/UsdcIcon";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { SolanaIcon } from "../common/NetworkIcons";
import { useProgram } from "@/src/hooks/solana/use-program";
import { mapTrial } from "../trials/TrialDetailView";
import {
  CheckCircle,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Cpu,
  FileCode,
  ExternalLink,
} from "lucide-react";

const RELAYER = import.meta.env.VITE_RELAYER_URL;

type GlStatus = {
  found?: boolean;
  trial_id?: string;
  verdict?: string;
  score?: number;
  reasoning?: string;
  github_repo_url?: string;
  deployed_app_url?: string;
  extra_url?: string;
  candidate_solana?: string;
  referrer_solana?: string;
  payload_hex?: string;
  definition_of_done?: string;
  requirements?: string;
};

interface VerificationViewProps {
  trial?: Outcom | null;
  onBack: () => void;
  onGoToReputation: () => void;
  onOpenTransactionDetails: (txHash: string) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  trial: trialProp,
  onBack,
  onGoToReputation,
  onOpenTransactionDetails,
}) => {
  const { trialId } = useParams<{ trialId: string }>();
  const { program } = useProgram();

  const [trial, setTrial] = useState<Outcom | null>(trialProp ?? null);
  const [status, setStatus] = useState<GlStatus | null>(null);
  const [settleTx, setSettleTx] = useState<string>("");
  const [settleError, setSettleError] = useState<string>("");
  const [copied, setCopied] = useState<"id" | "tx" | "">("");
  const settling = useRef(false);

  const verdict = String(status?.verdict || "").toUpperCase();
  const phase: "checking" | "verified" | "failed" =
    verdict === "PASS" ? "verified" : verdict === "FAIL" ? "failed" : "checking";

  useEffect(() => {
    if (!program || !trialId) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await program.account.trialAccount.all();
        const row = rows.find((r: any) => r.account.trialId === trialId);
        if (!cancelled && row) setTrial(mapTrial(row.account, row.publicKey));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [program, trialId]);

  useEffect(() => {
    if (!trialId || !RELAYER) return;
    let stop = false;

    async function tick() {
      try {
        const res = await fetch(`${RELAYER}/status?trialId=${trialId}`);
        const json = await res.json();
        const s: GlStatus = json.status || json;
        if (stop) return;
        setStatus(s);

        const v = String(s.verdict || "").toUpperCase();
        if (v === "PASS" && !settleTx && !settling.current && trial?.company) {
          settling.current = true;
          const st = await fetch(`${RELAYER}/settle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              trialId,
              employer: trial.company,
            }),
          });
          const body = await st.json();
          if (body.ok) {
            setSettleTx(body.result?.tx || "");
            toast.success("USDC released on Solana");
          } else {
            setSettleError(body.error || "settle failed");
            toast.error(body.error || "settle failed");
          }
        }
      } catch (e: any) {
        console.error(e);
      }
    }

    void tick();
    const id = setInterval(tick, 8000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [trialId, trial?.company, settleTx]);

  const copy = (text: string, kind: "id" | "tx") => {
    navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(""), 2000);
  };

  const artifacts = [
    { label: "Public repository", url: status?.github_repo_url },
    { label: "Live deployment", url: status?.deployed_app_url },
    { label: "Extra evidence", url: status?.extra_url },
  ].filter((a) => a.url);

  if (!trialId) {
    return <div className="text-sm text-[#9CA3AF]">Missing trial id.</div>;
  }

  const passed = String(status?.verdict || "").toUpperCase() === "PASS";
  const hasReferrer = Boolean(status?.referrer_solana);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white py-1 px-2 rounded hover:bg-[#121417]"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Trial Details
        </button>
        <span className="text-xs font-mono text-[#6B7280]">
          ID: <span className="text-white">{trialId}</span>
        </span>
      </div>

      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-mono text-[#9CA3AF] uppercase">
            Trial outcome · {trial?.title || trialId}
          </div>
          <div className="flex items-center gap-3 pt-2">
            {phase === "checking" && (
              <h2 className="text-2xl font-bold text-white">
                Verification in progress
              </h2>
            )}
            {phase === "verified" && (
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-6 h-6 text-[#10B981]" />
                <div>
                  <h2 className="text-2xl font-bold text-[#10B981]">Outcom Verified</h2>
                  <p className="text-xs text-[#9CA3AF] font-mono">GenLayer consensus PASS</p>
                </div>
              </div>
            )}
            {phase === "failed" && (
              <div>
                <h2 className="text-2xl font-bold text-[#EF4444]">Outcome rejected</h2>
                <p className="text-xs text-[#9CA3AF] font-mono">GenLayer consensus FAIL</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#121417] p-4 rounded-xl border border-[#24282D] text-right">
          <span className="text-[10px] font-mono uppercase text-[#9CA3AF] block">Score</span>
          <div className="text-3xl font-bold font-mono text-white">
            {phase === "checking" ? "--" : Number(status?.score || 0)}
            <span className="text-sm text-[#9CA3AF]"> / 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3">
          <h3 className="text-xs font-semibold text-[#D1D5DB] uppercase font-mono flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-[#0052FF]" /> Evidence
          </h3>
          {artifacts.length === 0 && (
            <p className="text-xs text-[#9CA3AF]">Waiting for GenLayer to store URLs…</p>
          )}
          {artifacts.map((a) => (
            <a
              key={a.label}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-between text-xs"
            >
              <span className="text-white">{a.label}</span>
              <span className="font-mono text-[#3B82F6] truncate max-w-[160px]">{a.url}</span>
            </a>
          ))}
        </div>

        <div className="md:col-span-7 p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <h3 className="text-xs font-semibold text-[#D1D5DB] uppercase font-mono flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#0052FF]" />
            Definition of done
          </h3>

          {(() => {
            const items = String(status?.definition_of_done || "")
              .split(/\n|\. /)
              .map((s) => s.replace(/\.$/, "").trim())
              .filter((s) => s.length > 8);

            const list = items.length
              ? items
              : ["Waiting for definition of done from GenLayer"];

            return (
              <ul className="space-y-2">
                {list.map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-2.5 text-sm text-[#D1D5DB]"
                  >
                    {phase === "checking" ? (
                      <span className="mt-0.5 w-3.5 h-3.5 rounded-full border border-[#F59E0B] shrink-0" />
                    ) : phase === "verified" ? (
                      <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    ) : (
                      <span className="mt-0.5 inline-flex w-4 h-4 items-center justify-center rounded-full bg-[#EF4444]/15 text-[#EF4444] text-[10px] font-bold shrink-0">
                        ×
                      </span>
                    )}
                    <span
                      className={
                        phase === "failed" ? "text-[#F3F4F6]" : "text-[#D1D5DB]"
                      }
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            );
          })()}

          {/* {settleError && (
            <p className="text-[#EF4444] text-xs">{settleError}</p>
          )} */}
        </div>
      </div>

      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0052FF]" />
          <h3 className="text-sm font-semibold text-white">Why this outcome</h3>
        </div>
        <blockquote className="text-sm text-[#D1D5DB] p-4 bg-[#121417] border border-[#24282D] rounded-lg">
          {status?.reasoning || "Waiting for GenLayer reasoning…"}
        </blockquote>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg">
            <span className="text-[#6B7280] font-mono text-[10px] uppercase block">Trial</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-white">{trialId}</span>
              <button onClick={() => copy(trialId, "id")}>
                {copied === "id" ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg">
            <span className="text-[#6B7280] font-mono text-[10px] uppercase block">Solana settle tx</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[#3B82F6] truncate pr-2">
                {settleTx || (phase === "verified" ? "settling…" : "—")}
              </span>
              {settleTx && (
                <button onClick={() => copy(settleTx, "tx")}>
                  {copied === "tx" ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#10B981]">On-chain escrow</span>
            <h3 className="text-xl font-bold text-white">
              {settleTx ? "Reward released" : phase === "failed" ? "No payout" : "Awaiting settlement"}
            </h3>
          </div>
          <Badge variant="green" size="sm">
            <SolanaIcon className="w-3 h-3" /> Solana Devnet
          </Badge>
        </div>
        {settleTx && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => onOpenTransactionDetails(settleTx)}
            icon={<ExternalLink className="w-3 h-3" />}
          >
            View transaction
          </Button>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#121417] border border-[#0052FF]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Candidate reward</span>
              {settleTx ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0052FF]/20 text-[#3B82F6]">
                  Disbursed
                </span>
              ) : null}
            </div>
            <UsdcDisplay
              amount={passed ? trial?.candidateReward || 0 : 0}
              size="sm"
            />
            <p className="text-[11px] text-[#6B7280] font-mono break-all leading-relaxed">
              {status?.candidate_solana || "—"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121417] border border-[#F59E0B]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Referral reward</span>
              {status?.referrer_solana ? (
                settleTx ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B]">
                    Disbursed
                  </span>
                ) : null
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181B20] text-[#6B7280]">
                  No referrer
                </span>
              )}
            </div>
            <UsdcDisplay
              amount={passed && hasReferrer ? trial?.referralReward || 0 : 0}
              size="sm"
            />
            <p className="text-[11px] text-[#6B7280] font-mono break-all leading-relaxed">
              {status?.referrer_solana || "none"}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="flex items-end justify-between pt-4 border-t border-[#24282D]">
        <Button variant="primary" size="md" onClick={onGoToReputation} iconRight={<ArrowRight className="w-4 h-4" />}>
          Reputation
        </Button>
      </div> */}
    </div>
  );
};