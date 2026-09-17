import React, { useState } from 'react';
import { Outcom, CandidateApplicant, UserWallet } from '../../types';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { Badge, DifficultyBadge, StatusBadge } from '../common/Badge';
import { SolanaIcon } from '../common/NetworkIcons';
import {
  Plus,
  Users,
  CheckCircle,
  FileCheck,
  DollarSign,
  TrendingUp,
  Shield,
  Eye,
  ExternalLink,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface EmployerDashboardProps {
  trials: Outcom[];
  applicants: CandidateApplicant[];
  wallet: UserWallet;
  onOpenCreateTrial: () => void;
  onSelectTrial: (trial: Outcom) => void;
  onViewApplicant: (applicant: CandidateApplicant) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  trials = [],
  applicants = [],
  wallet,
  onOpenCreateTrial,
  onSelectTrial,
  onViewApplicant,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'trials' | 'applicants' | 'verifications' | 'rewards' | 'reputation'
  >('overview');

  const safeTrials = trials || [];
  const safeApplicants = applicants || [];
  const employerTrials = safeTrials.filter((t) => t.company === 'Example Labs' || true);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#24282D] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0052FF]">
              Employer Protocol Hub
            </span>
            <span className="text-[#6B7280]">•</span>
            <span className="text-xs text-[#9CA3AF] font-mono">Example Labs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Company Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
            Hire through verified technical deliverables, fund rewards in escrow, and discover top protocol builders.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenCreateTrial}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Work Trial
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#24282D] overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'trials', label: 'Work Trials' },
          { id: 'applicants', label: 'Applicants' },
          { id: 'verifications', label: 'Verifications' },
          { id: 'rewards', label: 'Rewards' },
          { id: 'reputation', label: 'Reputation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'text-white border-[#0052FF]'
                : 'text-[#9CA3AF] border-transparent hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Areas */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Quad */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block">
                USDC Funded in Escrow
              </span>
              <UsdcDisplay amount={12400} size="xl" />
              <span className="text-[11px] text-[#10B981] font-mono block mt-1">
                Active on Solana Mainnet
              </span>
            </div>

            <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block">
                Total Applications
              </span>
              <div className="text-3xl font-bold font-mono text-white">38</div>
              <span className="text-[11px] text-[#6B7280] block mt-1">Across 6 work trials</span>
            </div>

            <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block">
                Verified Outcomes
              </span>
              <div className="text-3xl font-bold font-mono text-[#10B981]">14</div>
              <span className="text-[11px] text-[#6B7280] block mt-1">
                Full acceptance rate: 91%
              </span>
            </div>

            <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block">
                Successful Hires
              </span>
              <div className="text-3xl font-bold font-mono text-white">9</div>
              <span className="text-[11px] text-[#3B82F6] block mt-1">Extended full contracts</span>
            </div>
          </div>

          {/* Active Trials Management Table */}
          <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#24282D] pb-3">
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Active Work Trials
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  Trials currently open for candidate submissions
                </p>
              </div>
              <Button variant="outline" size="xs" onClick={onOpenCreateTrial}>
                + New Trial
              </Button>
            </div>

            <div className="space-y-3">
              {employerTrials.slice(0, 4).map((trial) => (
                <div
                  key={trial.id}
                  className="p-4 bg-[#121417] border border-[#24282D] hover:border-[#38404B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#6B7280]">ID: {trial.id}</span>
                      <span className="text-xs text-[#6B7280]">•</span>
                      <span className="text-xs text-[#9CA3AF] font-mono">{trial.category}</span>
                    </div>
                    <h4
                      onClick={() => onSelectTrial(trial)}
                      className="text-sm font-semibold text-white hover:text-[#3B82F6] cursor-pointer transition-colors line-clamp-1 mt-0.5"
                    >
                      {trial.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mt-1 font-mono">
                      <span>Deadline: {trial.deadline}</span>
                      <span>•</span>
                      <span>Applicants: {trial.applicantsCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-[#9CA3AF] font-mono block">Escrow Reward</span>
                      <UsdcDisplay amount={trial.totalReward} size="sm" />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTrial(trial)}
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Candidates Who Submitted Proof */}
          <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#24282D] pb-3">
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Recent Trial Submissions & Applicants
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  Candidates who have submitted verifiable proof of work for your open trials
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {applicants.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-[#121417] border border-[#24282D] rounded-xl space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={app.avatar}
                      alt={app.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#24282D]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{app.name}</h4>
                      <span className="text-xs font-mono text-[#9CA3AF]">{app.username}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#24282D]/70 font-mono">
                    <div>
                      <span className="text-[#6B7280] text-[10px] block">Reputation</span>
                      <span className="text-white font-bold">{app.reputationScore}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] text-[10px] block">Success Rate</span>
                      <span className="text-[#10B981] font-bold">{app.successRate}%</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Button
                      variant="secondary"
                      size="xs"
                      className="w-full text-xs"
                      onClick={() => onViewApplicant(app)}
                    >
                      View Verified Outcomes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9CA3AF] font-mono">
              Managing {trials.length} total work trials created by your team
            </span>
            <Button variant="primary" size="sm" onClick={onOpenCreateTrial}>
              + Create Trial
            </Button>
          </div>

          <div className="space-y-3">
            {trials.map((trial) => (
              <div
                key={trial.id}
                className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6B7280] font-mono">ID: {trial.id}</span>
                    <DifficultyBadge difficulty={trial.difficulty} />
                    <StatusBadge status={trial.status} />
                  </div>
                  <h3 className="text-base font-semibold text-white mt-1">{trial.title}</h3>
                  <div className="text-xs text-[#9CA3AF] font-mono mt-1 flex items-center gap-3">
                    {/* <span>Deadline: {trial.deadline}</span>
                    <span>•</span>
                    <span>Applicants: {trial.applicantsCount}</span>
                    <span>•</span> */}
                    <span className="text-[#10B981]">Escrow Locked</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-[#9CA3AF] font-mono block">Reward</span>
                    <UsdcDisplay amount={trial.totalReward} size="md" />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onSelectTrial(trial)}>
                    Inspect Spec
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'applicants' && (
        <div className="space-y-4">
          <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl">
            <h3 className="text-base font-semibold text-white mb-1">
              Verified Candidate Talent Pool
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Candidates are evaluated purely by verified on-chain deliverables and cryptographic reputation scores.
            </p>

            <div className="divide-y divide-[#24282D]">
              {applicants.map((app) => (
                <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={app.avatar}
                      alt={app.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#24282D]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{app.name}</span>
                        <span className="text-xs font-mono text-[#9CA3AF]">{app.username}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-mono mt-0.5">
                        <span>Wallet: {app.walletAddress}</span>
                        <span>•</span>
                        <span>Earned: {app.earnedUsdc} USDC</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {app.skills.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181B20] text-[#9CA3AF] border border-[#24282D]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-white">{app.reputationScore} Rep</div>
                      <div className="text-xs text-[#10B981]">{app.successRate}% Success</div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => onViewApplicant(app)}>
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verifications' && (
        <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <h3 className="text-base font-semibold text-white">Autonomous Oracle Verifications</h3>
          <p className="text-xs text-[#9CA3AF]">
            All submitted deliverables are checked by deterministic AST parsers, smart contract oracles, and test suites.
          </p>
          <div className="p-4 bg-[#121417] border border-[#24282D] rounded-lg text-xs font-mono text-[#9CA3AF] space-y-2">
            <div className="text-white font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#10B981]" />
              Latest Verdict: WT-8F29-4A91 (Score 94/100)
            </div>
            <div>Trial: Build a Solana Payment Integration</div>
            <div>Settlement: 450 USDC Candidate • 50 USDC Referrer</div>
            <div>Transaction: 5KpM9vW2Z7xQ4tR6uY8nC1bZ0eA3dE5gH7jK9mP8sQ</div>
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <h3 className="text-base font-semibold text-white">Escrow & Rewards Ledger</h3>
          <p className="text-xs text-[#9CA3AF]">
            Overview of USDC funds locked in non-custodial PDA escrow vaults across Solana and LayerZero endpoints.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#121417] border border-[#24282D] rounded-lg">
              <span className="text-xs text-[#9CA3AF] block font-mono">Total Funded To Date</span>
              <UsdcDisplay amount={12400} size="lg" />
            </div>
            <div className="p-4 bg-[#121417] border border-[#24282D] rounded-lg">
              <span className="text-xs text-[#9CA3AF] block font-mono">Released to Talent</span>
              <UsdcDisplay amount={9850} size="lg" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reputation' && (
        <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <h3 className="text-base font-semibold text-white">Employer Protocol Standing</h3>
          <p className="text-xs text-[#9CA3AF]">
            Example Labs holds a 98% prompt settlement rating and is verified as a high-integrity talent sponsor.
          </p>
          <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg text-xs text-[#10B981] flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Employer Verified: Zero payment disputes in 14 verified trial cycles.</span>
          </div>
        </div>
      )}
    </div>
  );
};
