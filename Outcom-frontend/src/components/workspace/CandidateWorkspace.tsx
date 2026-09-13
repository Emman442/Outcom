import React, { useState } from 'react';
import { WorkTrial } from '../../types';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { StatusBadge, DifficultyBadge } from '../common/Badge';
import { SolanaIcon } from '../common/NetworkIcons';
import { Clock, CheckCircle, ArrowRight, Compass, AlertCircle, FileCheck } from 'lucide-react';

interface CandidateWorkspaceProps {
  trials: WorkTrial[];
  onSelectTrial: (trial: WorkTrial) => void;
  onSubmitEvidence: (trial: WorkTrial) => void;
  onViewVerification: (trial: WorkTrial) => void;
  onExploreTrials: () => void;
}

export const CandidateWorkspace: React.FC<CandidateWorkspaceProps> = ({
  trials = [],
  onSelectTrial,
  onSubmitEvidence,
  onViewVerification,
  onExploreTrials,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'submitted' | 'completed' | 'failed'>('active');

  const safeTrials = trials || [];

  // Filter based on candidate's current progress state on each trial
  const filteredTrials = safeTrials.filter((t) => {
    if (activeTab === 'active') {
      return (
        t.currentCandidateStatus === 'active' ||
        t.currentCandidateStatus === 'in_progress' ||
        t.currentCandidateStatus === 'ready_to_submit' ||
        (t.id === 'wt-sol-01' && !t.currentCandidateStatus)
      );
    }
    if (activeTab === 'submitted') {
      return t.currentCandidateStatus === 'submitted' || t.currentCandidateStatus === 'under_review';
    }
    if (activeTab === 'completed') {
      return t.currentCandidateStatus === 'verified' || t.currentCandidateStatus === 'paid' || t.status === 'verified';
    }
    if (activeTab === 'failed') {
      return t.currentCandidateStatus === 'failed';
    }
    return true;
  });

  const tabCounts = {
    active: safeTrials.filter(
      (t) =>
        t.currentCandidateStatus === 'active' ||
        t.currentCandidateStatus === 'in_progress' ||
        t.currentCandidateStatus === 'ready_to_submit' ||
        (t.id === 'wt-sol-01' && !t.currentCandidateStatus)
    ).length,
    submitted: safeTrials.filter(
      (t) => t.currentCandidateStatus === 'submitted' || t.currentCandidateStatus === 'under_review'
    ).length,
    completed: safeTrials.filter(
      (t) => t.currentCandidateStatus === 'verified' || t.currentCandidateStatus === 'paid' || t.status === 'verified'
    ).length,
    failed: safeTrials.filter((t) => t.currentCandidateStatus === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24282D] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Work Trials</h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
            Manage your committed trials, track verification status, and claim USDC escrow rewards.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onExploreTrials}
          icon={<Compass className="w-4 h-4 text-[#0052FF]" />}
        >
          Discover New Trials
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#24282D]">
        {(['active', 'submitted', 'completed', 'failed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 capitalize cursor-pointer ${
              activeTab === tab
                ? 'text-white border-[#0052FF]'
                : 'text-[#9CA3AF] border-transparent hover:text-white'
            }`}
          >
            <span>{tab}</span>
            <span
              className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${
                activeTab === tab
                  ? 'bg-[#0052FF]/20 text-[#3B82F6] border border-[#0052FF]/40'
                  : 'bg-[#181B20] text-[#9CA3AF] border border-[#24282D]'
              }`}
            >
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Trials List or Thoughtful Empty State */}
      {filteredTrials.length === 0 ? (
        <div className="p-12 text-center bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4 my-8">
          <div className="w-12 h-12 rounded-xl bg-[#121417] border border-[#24282D] flex items-center justify-center mx-auto text-[#9CA3AF]">
            {activeTab === 'failed' ? (
              <AlertCircle className="w-6 h-6 text-[#EF4444]" />
            ) : (
              <FileCheck className="w-6 h-6 text-[#3B82F6]" />
            )}
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-semibold text-white">
              {activeTab === 'active' && 'No active Work Trials'}
              {activeTab === 'submitted' && 'No submissions currently in review'}
              {activeTab === 'completed' && 'No completed trials yet'}
              {activeTab === 'failed' && 'No unverified or failed trials'}
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
              {activeTab === 'active' &&
                'Complete your first verified trial to start building portable on-chain reputation and earning USDC.'}
              {activeTab === 'submitted' &&
                'When you submit repository and deployment evidence for an active trial, protocol verification progress will appear here.'}
              {activeTab === 'completed' &&
                'Trials that successfully pass automated protocol verification and release payments will be recorded here.'}
              {activeTab === 'failed' &&
                'You have no failed trials. All verified outcomes retain their score on-chain.'}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={onExploreTrials}>
            Discover Work Trials
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrials.map((trial) => {
            // Simulated progress percentage for active trial
            const progress =
              trial.currentCandidateStatus === 'submitted'
                ? 75
                : trial.currentCandidateStatus === 'verified'
                ? 100
                : 40;

            return (
              <div
                key={trial.id}
                className="p-5 bg-[#0D0F12] hover:bg-[#121417] border border-[#24282D] hover:border-[#38404B] rounded-xl transition-all duration-150 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={trial.companyLogo}
                      alt={trial.company}
                      className="w-10 h-10 rounded-lg object-cover border border-[#24282D] flex-shrink-0 mt-1"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#9CA3AF] font-medium">{trial.company}</span>
                        <span className="text-xs text-[#6B7280]">•</span>
                        <span className="text-xs text-[#6B7280] font-mono">{trial.category}</span>
                      </div>
                      <h3
                        onClick={() => onSelectTrial(trial)}
                        className="text-base font-semibold text-white hover:text-[#3B82F6] cursor-pointer transition-colors line-clamp-1 mt-0.5"
                      >
                        {trial.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mt-1.5 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Deadline: {trial.deadline}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#10B981]">
                          <SolanaIcon className="w-3 h-3" /> Escrow Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center sm:items-end flex-col gap-2">
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-[#9CA3AF] block mb-0.5">
                        Candidate Reward
                      </span>
                      <UsdcDisplay amount={trial.candidateReward} size="md" />
                    </div>
                  </div>
                </div>

                {/* Progress bar and milestone status */}
                <div className="pt-2 border-t border-[#24282D]/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#9CA3AF]">Progress:</span>
                      <span className="font-mono text-white font-medium">{progress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#9CA3AF]">Current State:</span>
                      <span className="text-[#3B82F6] font-mono text-[11px] uppercase">
                        {trial.currentCandidateStatus || 'In Progress'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-[#181B20] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        progress === 100 ? 'bg-[#10B981]' : 'bg-[#0052FF]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <DifficultyBadge difficulty={trial.difficulty} />
                    <span className="text-xs text-[#6B7280] font-mono">ID: {trial.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTrial(trial)}
                    >
                      View Spec
                    </Button>

                    {trial.currentCandidateStatus === 'verified' || trial.status === 'verified' ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onViewVerification(trial)}
                        icon={<CheckCircle className="w-3.5 h-3.5" />}
                      >
                        Verification Verdict
                      </Button>
                    ) : trial.currentCandidateStatus === 'submitted' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onViewVerification(trial)}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Check Protocol Verdict
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onSubmitEvidence(trial)}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Submit Evidence for Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
