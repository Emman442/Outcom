import React, { useState, useEffect } from 'react';
import { WorkTrial, VerificationVerdict, UserWallet } from '../../types';
import { UsdcDisplay, UsdcIcon } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SolanaIcon, LayerZeroIcon } from '../common/NetworkIcons';
import {
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Cpu,
  FileCode,
  Globe,
  Terminal,
} from 'lucide-react';

interface VerificationViewProps {
  trial: WorkTrial;
  verdict: VerificationVerdict;
  wallet: UserWallet;
  onBack: () => void;
  onGoToReputation: () => void;
  onOpenTransactionDetails: (txHash: string) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  trial,
  verdict,
  wallet,
  onBack,
  onGoToReputation,
  onOpenTransactionDetails,
}) => {
  // Verification states: 'checking' | 'verified' | 'failed'
  const [verificationPhase, setVerificationPhase] = useState<'checking' | 'verified'>(
    verdict.status === 'VERIFIED' ? 'verified' : 'checking'
  );

  // Criteria animated statuses
  const [criteriaStatus, setCriteriaStatus] = useState<
    Record<string, 'checking' | 'passed' | 'failed'>
  >({
    requirements: verdict.status === 'VERIFIED' ? 'passed' : 'checking',
    deployment: verdict.status === 'VERIFIED' ? 'passed' : 'checking',
    quality: verdict.status === 'VERIFIED' ? 'passed' : 'checking',
    outcome: verdict.status === 'VERIFIED' ? 'passed' : 'checking',
  });

  const [copiedId, setCopiedId] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  // Simulated live checking sequence if opened in 'checking' mode
  const runLiveSimulation = () => {
    setVerificationPhase('checking');
    setCriteriaStatus({
      requirements: 'checking',
      deployment: 'checking',
      quality: 'checking',
      outcome: 'checking',
    });

    setTimeout(() => {
      setCriteriaStatus((prev) => ({ ...prev, requirements: 'passed' }));
    }, 1000);

    setTimeout(() => {
      setCriteriaStatus((prev) => ({ ...prev, deployment: 'passed' }));
    }, 2000);

    setTimeout(() => {
      setCriteriaStatus((prev) => ({ ...prev, quality: 'passed' }));
    }, 3000);

    setTimeout(() => {
      setCriteriaStatus((prev) => ({ ...prev, outcome: 'passed' }));
      setVerificationPhase('verified');
    }, 4200);
  };

  const copyText = (text: string, type: 'id' | 'tx') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-[#121417]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Trial Details</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={runLiveSimulation}
            icon={<RefreshCw className="w-3 h-3" />}
          >
            Re-run Verifier Test
          </Button>
          <span className="text-xs font-mono text-[#6B7280]">
            ID: <span className="text-white">{verdict.verificationId}</span>
          </span>
        </div>
      </div>

      {/* Flow Step Progress Bar */}
      <div className="p-3.5 bg-[#0D0F12] border border-[#24282D] rounded-xl flex items-center justify-between text-xs font-mono text-[#9CA3AF] overflow-x-auto gap-2">
        <div className="flex items-center gap-2 text-[#10B981] whitespace-nowrap">
          <span className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[11px] font-bold">✓</span>
          <span>1. Work Trial Spec</span>
        </div>
        <span className="text-[#38404B]">→</span>
        <div className="flex items-center gap-2 text-[#10B981] whitespace-nowrap">
          <span className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[11px] font-bold">✓</span>
          <span>2. Evidence Submitted</span>
        </div>
        <span className="text-[#38404B]">→</span>
        <div className={`flex items-center gap-2 whitespace-nowrap px-2.5 py-1 rounded border ${
          verificationPhase === 'checking'
            ? 'text-white font-semibold bg-[#181B20] border-[#0052FF]'
            : 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
            verificationPhase === 'checking' ? 'bg-[#0052FF] text-white' : 'bg-[#10B981] text-black'
          }`}>
            {verificationPhase === 'checking' ? '3' : '✓'}
          </span>
          <span>3. Protocol/AI Verification</span>
        </div>
        <span className="text-[#38404B]">→</span>
        <div className={`flex items-center gap-2 whitespace-nowrap px-2.5 py-1 rounded border ${
          verificationPhase === 'verified'
            ? 'text-white font-semibold bg-[#181B20] border-[#10B981]'
            : 'text-[#6B7280] border-transparent'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
            verificationPhase === 'verified' ? 'bg-[#10B981] text-black' : 'bg-[#121417] border border-[#24282D]'
          }`}>
            4
          </span>
          <span>4. Settlement & Reputation</span>
        </div>
      </div>

      {/* Verification Status Header */}
      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider">
              Trial Outcome Evaluation
            </span>
            <span className="text-xs text-[#6B7280]">•</span>
            <span className="text-xs text-[#9CA3AF] font-mono">{trial.title}</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            {verificationPhase === 'checking' ? (
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 border-2 border-[#0052FF] border-t-transparent rounded-full animate-spin" />
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Verification in progress
                </h2>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#10B981] tracking-tight">
                    WorkTrial Verified
                  </h2>
                  <span className="text-xs text-[#9CA3AF] font-mono">
                    All outcome acceptance criteria passed
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-4 bg-[#121417] p-4 rounded-xl border border-[#24282D]">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF] block">
              Composite Score
            </span>
            <div className="text-3xl font-bold font-mono text-white">
              {verificationPhase === 'checking' ? (
                <span className="text-[#9CA3AF] animate-pulse">--</span>
              ) : (
                <span>
                  {verdict.overallScore} <span className="text-sm text-[#9CA3AF]">/ 100</span>
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/30 flex items-center justify-center text-[#3B82F6]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Evidence Collected & Verification Criteria Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Evidence Collected Panel - Span 5 */}
        <div className="md:col-span-5 p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#24282D] pb-3">
            <h3 className="text-xs font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-[#0052FF]" />
              Evidence Collected
            </h3>
            <span className="text-[11px] text-[#10B981] font-mono">4 Artifacts</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-white font-medium">Public Repository</span>
              </div>
              <span className="font-mono text-[#9CA3AF] text-[11px]">github.com/...</span>
            </div>

            <div className="p-3 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-white font-medium">Live Web Deployment</span>
              </div>
              <span className="font-mono text-[#9CA3AF] text-[11px]">vercel.app</span>
            </div>

            <div className="p-3 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-white font-medium">Solana Devnet Settlement</span>
              </div>
              <span className="font-mono text-[#9CA3AF] text-[11px]">5KpM...8sQ</span>
            </div>

            <div className="p-3 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-white font-medium">Technical Documentation</span>
              </div>
              <span className="font-mono text-[#9CA3AF] text-[11px]">README.md</span>
            </div>
          </div>
        </div>

        {/* Verification Criteria Table - Span 7 */}
        <div className="md:col-span-7 p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#24282D] pb-3">
            <h3 className="text-xs font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#0052FF]" />
              Verification Criteria
            </h3>
            <span className="text-[11px] text-[#9CA3AF] font-mono">Automated Oracles</span>
          </div>

          <div className="overflow-hidden border border-[#24282D] rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121417] text-[#9CA3AF] font-mono border-b border-[#24282D]">
                <tr>
                  <th className="py-2.5 px-3.5 font-medium">Criterion</th>
                  <th className="py-2.5 px-3.5 font-medium">Sub-system</th>
                  <th className="py-2.5 px-3.5 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24282D] bg-[#090A0C]">
                <tr>
                  <td className="py-3 px-3.5 text-white font-medium">Requirements satisfied</td>
                  <td className="py-3 px-3.5 text-[#9CA3AF] font-mono text-[11px]">AST Parser</td>
                  <td className="py-3 px-3.5 text-right">
                    {criteriaStatus.requirements === 'passed' ? (
                      <span className="text-[#10B981] font-mono font-semibold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="text-[#F59E0B] font-mono flex items-center justify-end gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" /> Checking
                      </span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3.5 text-white font-medium">Deployment functional</td>
                  <td className="py-3 px-3.5 text-[#9CA3AF] font-mono text-[11px]">Browser Synthetic</td>
                  <td className="py-3 px-3.5 text-right">
                    {criteriaStatus.deployment === 'passed' ? (
                      <span className="text-[#10B981] font-mono font-semibold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="text-[#F59E0B] font-mono flex items-center justify-end gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" /> Checking
                      </span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3.5 text-white font-medium">Code quality & safety</td>
                  <td className="py-3 px-3.5 text-[#9CA3AF] font-mono text-[11px]">Static Analyzer</td>
                  <td className="py-3 px-3.5 text-right">
                    {criteriaStatus.quality === 'passed' ? (
                      <span className="text-[#10B981] font-mono font-semibold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="text-[#F59E0B] font-mono flex items-center justify-end gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" /> Checking
                      </span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3.5 text-white font-medium">Outcome achieved</td>
                  <td className="py-3 px-3.5 text-[#9CA3AF] font-mono text-[11px]">RPC Settlement Oracle</td>
                  <td className="py-3 px-3.5 text-right">
                    {criteriaStatus.outcome === 'passed' ? (
                      <span className="text-[#10B981] font-mono font-semibold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="text-[#F59E0B] font-mono flex items-center justify-end gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" /> Checking
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown Score Bars */}
          {verificationPhase === 'verified' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded bg-[#121417] border border-[#24282D]">
                <span className="text-[10px] text-[#9CA3AF] block font-mono">Tech Completion</span>
                <span className="text-base font-bold font-mono text-white">
                  {verdict.breakdown.technicalCompletion}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#121417] border border-[#24282D]">
                <span className="text-[10px] text-[#9CA3AF] block font-mono">Requirements</span>
                <span className="text-base font-bold font-mono text-white">
                  {verdict.breakdown.requirementsSatisfaction}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#121417] border border-[#24282D]">
                <span className="text-[10px] text-[#9CA3AF] block font-mono">Quality</span>
                <span className="text-base font-bold font-mono text-white">
                  {verdict.breakdown.codeQuality}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#121417] border border-[#24282D]">
                <span className="text-[10px] text-[#9CA3AF] block font-mono">Confidence</span>
                <span className="text-base font-bold font-mono text-white">
                  {verdict.breakdown.outcomeConfidence}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Reasoning Section */}
      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#24282D] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0052FF]" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Why this outcome was verified
            </h3>
          </div>
          <span className="text-xs text-[#9CA3AF] font-mono">Autonomous Oracle Analysis</span>
        </div>

        <blockquote className="text-sm text-[#D1D5DB] leading-relaxed p-4 bg-[#121417] border border-[#24282D] rounded-lg">
          "{verdict.aiReasoning}"
        </blockquote>

        {/* Monospace Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg">
            <span className="text-[#6B7280] font-mono text-[10px] uppercase block">Verification ID</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-white font-medium">{verdict.verificationId}</span>
              <button
                onClick={() => copyText(verdict.verificationId, 'id')}
                className="text-[#9CA3AF] hover:text-white"
              >
                {copiedId ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg">
            <span className="text-[#6B7280] font-mono text-[10px] uppercase block">Verified At</span>
            <span className="font-mono text-white font-medium mt-1 block">{verdict.verifiedAt}</span>
          </div>

          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg sm:col-span-2">
            <span className="text-[#6B7280] font-mono text-[10px] uppercase block">
              Solana Settlement Hash
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[#3B82F6] truncate pr-2">{verdict.transactionHash}</span>
              <button
                onClick={() => copyText(verdict.transactionHash, 'tx')}
                className="text-[#9CA3AF] hover:text-white flex-shrink-0"
              >
                {copiedTx ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settlement Section */}
      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24282D] pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] block">
              On-Chain Escrow Distribution
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Reward released
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="green" size="sm">
              <SolanaIcon className="w-3 h-3" /> Solana Mainnet-beta
            </Badge>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onOpenTransactionDetails(verdict.transactionHash)}
              icon={<ExternalLink className="w-3 h-3" />}
            >
              View Transaction
            </Button>
          </div>
        </div>

        {/* Dual USDC Reward Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#121417] border border-[#0052FF]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-medium">Candidate Reward</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0052FF]/20 text-[#3B82F6] border border-[#0052FF]/40">
                Disbursed
              </span>
            </div>
            <UsdcDisplay amount={verdict.candidateReward} size="xl" />
            <div className="text-[11px] text-[#6B7280] font-mono truncate">
              To: {verdict.candidateAddress}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121417] border border-[#F59E0B]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-medium">Referral Reward</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">
                Disbursed
              </span>
            </div>
            <UsdcDisplay amount={verdict.referralReward} size="xl" />
            <div className="text-[11px] text-[#6B7280] font-mono truncate">
              To: {verdict.referrerAddress || '0x4mR...5vW1'}
            </div>
          </div>
        </div>

        {/* Visual Payment Flow with Thin Blue Connecting Lines */}
        <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl">
          <span className="text-xs font-semibold text-[#D1D5DB] block mb-3 font-mono">
            Escrow Settlement Pipeline
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Escrow Vault */}
            <div className="p-3 rounded-lg bg-[#181B20] border border-[#24282D] text-center w-full sm:w-auto flex-1">
              <span className="text-[10px] text-[#6B7280] font-mono uppercase block">Source</span>
              <span className="text-white font-medium font-mono">WorkTrial Escrow Vault</span>
              <span className="text-[10px] text-[#9CA3AF] font-mono block mt-0.5">
                500 USDC locked
              </span>
            </div>

            {/* Connecting Vector Lines */}
            <div className="text-[#0052FF] font-bold font-mono text-sm sm:px-2 flex items-center justify-center">
              <span className="hidden sm:inline">────────►</span>
              <span className="sm:hidden">▼</span>
            </div>

            {/* Split Recipients */}
            <div className="flex-1 w-full sm:w-auto space-y-2">
              <div className="p-2.5 rounded-lg bg-[#181B20] border border-[#0052FF]/30 flex items-center justify-between">
                <span className="text-white font-medium">Candidate Wallet</span>
                <UsdcDisplay amount={450} size="xs" />
              </div>
              <div className="p-2.5 rounded-lg bg-[#181B20] border border-[#F59E0B]/30 flex items-center justify-between">
                <span className="text-white font-medium">Referrer Wallet</span>
                <UsdcDisplay amount={50} size="xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LayerZero Cross-Chain Section (Subtle, Technical Diagram) */}
      {verdict.layerZeroSettlement && (
        <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#24282D] pb-3">
            <div className="flex items-center gap-2">
              <LayerZeroIcon className="w-4 h-4 text-white" />
              <h4 className="text-xs font-semibold text-white tracking-tight uppercase font-mono">
                Cross-chain settlement
              </h4>
            </div>
            <span className="text-xs text-[#10B981] font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Status: {verdict.layerZeroSettlement.status}
            </span>
          </div>

          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            WorkTrial's core hiring logic and escrow execute on Solana, with LayerZero endpoint relays transmitting verified hiring state and cross-chain USDC delivery to recipient contracts.
          </p>

          {/* Cross-chain Flow Diagram */}
          <div className="p-4 bg-[#121417] border border-[#24282D] rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            {/* Origin: Solana */}
            <div className="flex items-center gap-2.5 p-2.5 rounded bg-[#181B20] border border-[#24282D] w-full md:w-auto">
              <SolanaIcon className="w-4 h-4" />
              <div>
                <span className="text-white font-medium block">Solana Program</span>
                <span className="text-[10px] text-[#9CA3AF] font-mono">Origin Chain</span>
              </div>
            </div>

            {/* Down/Right Arrow with LayerZero */}
            <div className="flex items-center gap-1 text-[#3B82F6] font-mono text-xs">
              <span>──────</span>
              <span className="px-2 py-0.5 rounded bg-[#0052FF]/10 border border-[#0052FF]/30 text-white font-medium flex items-center gap-1">
                <LayerZeroIcon className="w-3 h-3" /> LayerZero v2
              </span>
              <span>──────►</span>
            </div>

            {/* Destination: Base */}
            <div className="flex items-center gap-2.5 p-2.5 rounded bg-[#181B20] border border-[#24282D] w-full md:w-auto">
              <div className="w-4 h-4 rounded-full bg-[#0052FF] flex items-center justify-center text-[10px] font-bold text-white">
                B
              </div>
              <div>
                <span className="text-white font-medium block">{verdict.layerZeroSettlement.destinationChain}</span>
                <span className="text-[10px] text-[#9CA3AF] font-mono">Recipient Contract</span>
              </div>
            </div>
          </div>

          {/* Cross-chain message ID */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#9CA3AF] pt-1">
            <span>
              Message ID: <span className="font-mono text-white">{verdict.layerZeroSettlement.messageId}</span>
            </span>
            <span className="font-mono text-[#10B981] mt-1 sm:mt-0">
              Payload confirmed at block #19,482,912
            </span>
          </div>
        </div>
      )}

      {/* Bottom CTA to Reputation Page */}
      <div className="flex items-center justify-between pt-4 border-t border-[#24282D]">
        <div className="text-xs text-[#9CA3AF]">
          Outcome recorded permanently on your on-chain reputation profile.
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={onGoToReputation}
          iconRight={<ArrowRight className="w-4 h-4" />}
        >
          View Updated Reputation (+12 Score)
        </Button>
      </div>
    </div>
  );
};
