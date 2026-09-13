import React from 'react';
import { WorkTrial } from '../../types';
import { TrialCard } from '../trials/TrialCard';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { SolanaIcon, LayerZeroIcon } from '../common/NetworkIcons';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileCode,
  Users,
  Coins,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LandingViewProps {
  trials: WorkTrial[];
  onSelectTrial: (trial: WorkTrial) => void;
  onExploreTrials: () => void;
  onCreateTrial: () => void;
  onOpenReferral: (trial: WorkTrial) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  trials,
  onSelectTrial,
  onExploreTrials,
  onCreateTrial,
  onOpenReferral,
}) => {
  const featuredTrials = trials.slice(0, 4);

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative pt-6 pb-10 sm:pt-12 sm:pb-16 text-center max-w-4xl mx-auto space-y-6">
        {/* Subtle Protocol Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121417] border border-[#24282D] text-xs font-mono text-[#9CA3AF]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>WorkTrial Protocol v1.2</span>
          <span className="text-[#6B7280]">|</span>
          <span className="flex items-center gap-1 text-white">
            <SolanaIcon className="w-3 h-3" /> Solana Escrow
          </span>
          <span className="text-[#6B7280]">|</span>
          <span className="flex items-center gap-1 text-[#9CA3AF]">
            <LayerZeroIcon className="w-3 h-3 text-white" /> LayerZero
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          Prove your work. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D1D5DB] to-[#9CA3AF]">
            Get hired. Earn on-chain.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed font-normal">
          WorkTrial is an outcome-based hiring protocol on Solana. Companies fund escrowed USDC rewards for real work trials. Candidates build verifiable on-chain reputation.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onExploreTrials}
            iconRight={<ArrowRight className="w-4 h-4" />}
          >
            Explore Work Trials
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onCreateTrial}
          >
            Create a Work Trial
          </Button>
        </div>
      </section>

      {/* Statistics Row */}
      <section className="border-y border-[#24282D] py-8 bg-[#0D0F12]/60">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block">
              Paid to Talent
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <UsdcDisplay amount={184000} size="xl" />
              <span className="text-xl font-bold font-mono text-white">+</span>
            </div>
            <span className="text-[11px] text-[#6B7280] font-mono block">Automated escrow payout</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block">
              Completed Work Trials
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">1,420+</div>
            <span className="text-[11px] text-[#6B7280] font-mono block">Verified deliverables</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block">
              Verification Success Rate
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#10B981]">92%</div>
            <span className="text-[11px] text-[#6B7280] font-mono block">Objective acceptance criteria</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block">
              Hiring Companies
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">320+</div>
            <span className="text-[11px] text-[#6B7280] font-mono block">Protocols, DAOs, startups</span>
          </div>
        </div>
      </section>

      {/* How It Works - Clean Horizontal Workflow */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#24282D] pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#0052FF] block">
              Protocol Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              How WorkTrial Works
            </h2>
          </div>
          <span className="text-xs text-[#9CA3AF] font-mono">
            Deterministic evaluation • Non-custodial escrow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3 relative group hover:border-[#38404B] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-center font-mono text-xs text-white font-bold">
              01
            </div>
            <h3 className="text-sm font-semibold text-white">Create Work Trial</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Company defines objective, definition of done, and funds the USDC reward directly into a Solana escrow contract.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3 relative group hover:border-[#38404B] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-center font-mono text-xs text-white font-bold">
              02
            </div>
            <h3 className="text-sm font-semibold text-white">Refer or Discover</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Ecosystem referrers share links to earn automated on-chain bounties. Candidates discover and commit to trials.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3 relative group hover:border-[#38404B] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-center font-mono text-xs text-white font-bold">
              03
            </div>
            <h3 className="text-sm font-semibold text-white">Verify Outcome</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Candidate submits code repository and live deployment. Protocol oracles evaluate criteria and generate verdicts.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3 relative group hover:border-[#38404B] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#121417] border border-[#24282D] flex items-center justify-center font-mono text-xs text-white font-bold">
              04
            </div>
            <h3 className="text-sm font-semibold text-white">Release Reward & Rep</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Escrow automatically releases candidate and referral USDC. Verifiable credentials are minted to the candidate’s wallet.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Work Trials Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#24282D] pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#0052FF] block">
              Active Opportunities
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Featured Work Trials
            </h2>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onExploreTrials}
            iconRight={<ArrowRight className="w-4 h-4" />}
          >
            View All Trials
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredTrials.map((trial) => (
            <TrialCard
              key={trial.id}
              trial={trial}
              onSelect={onSelectTrial}
              onRefer={onOpenReferral}
            />
          ))}
        </div>
      </section>

      {/* Technical Infrastructure Callout: Solana + LayerZero */}
      <section className="p-6 sm:p-8 bg-[#0D0F12] border border-[#24282D] rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-xs font-mono uppercase tracking-wider text-white">
                Web3 Protocol Substrate
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              Built on Solana with LayerZero Interoperability
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121417] border border-[#24282D] text-xs font-mono text-white">
              <SolanaIcon className="w-4 h-4" /> Solana Speed & Escrow
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121417] border border-[#24282D] text-xs font-mono text-white">
              <LayerZeroIcon className="w-4 h-4" /> LayerZero Cross-Chain
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#9CA3AF] leading-relaxed pt-2">
          <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl space-y-1.5">
            <h4 className="text-white font-semibold">Instant Sub-Cent Escrow</h4>
            <p>
              WorkTrial programs execute on Solana for instant micro-settlements, low transaction overhead, and sub-second escrow locks in native USDC.
            </p>
          </div>

          <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl space-y-1.5">
            <h4 className="text-white font-semibold">Portable Cross-Chain Proof</h4>
            <p>
              Through LayerZero Omnichain messaging, verified hiring scores and credential attestations can be read and proven across Ethereum, Base, Arbitrum, and EVM chains.
            </p>
          </div>

          <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl space-y-1.5">
            <h4 className="text-white font-semibold">Non-Custodial PDA Architecture</h4>
            <p>
              Neither company nor platform controls escrowed funds after verification criteria are satisfied; payouts trigger autonomously via program logic.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
