import React, { useState } from 'react';
import { WorkTrial, UserWallet, CandidateApplicant } from '../../types';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { Badge, DifficultyBadge } from '../common/Badge';
import { SolanaIcon, LayerZeroIcon } from '../common/NetworkIcons';
import {
  CheckCircle,
  Clock,
  Users,
  Shield,
  ExternalLink,
  ChevronLeft,
  Share2,
  FileCode,
  Globe,
  Terminal,
  Lock,
  Play,
  Check,
  ArrowRight,
} from 'lucide-react';

interface TrialDetailViewProps {
  trial: WorkTrial;
  wallet: UserWallet;
  onBack: () => void;
  onStartTrial?: (trial: WorkTrial) => void;
  onCommitTrial?: (trial: WorkTrial) => void;
  onContinueTrial?: (trial: WorkTrial) => void;
  onSubmitEvidence: (trial: WorkTrial) => void;
  onViewVerification: (trial: WorkTrial) => void;
  onOpenReferModal?: (trial: WorkTrial) => void;
  onOpenReferral?: (trial: WorkTrial) => void;
  trialApplicants?: CandidateApplicant[];
}

export const TrialDetailView: React.FC<TrialDetailViewProps> = ({
  trial,
  wallet,
  onBack,
  onStartTrial,
  onCommitTrial,
  onContinueTrial,
  onSubmitEvidence,
  onViewVerification,
  onOpenReferModal,
  onOpenReferral,
  trialApplicants = [],
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'applicants'>('overview');

  const handleRefer = (targetTrial: WorkTrial) => {
    if (onOpenReferral) {
      onOpenReferral(targetTrial);
    } else if (onOpenReferModal) {
      onOpenReferModal(targetTrial);
    }
  };

  const handleStart = (targetTrial: WorkTrial) => {
    if (onCommitTrial) {
      onCommitTrial(targetTrial);
    } else if (onStartTrial) {
      onStartTrial(targetTrial);
    }
  };

  // Clear State Machine logic requested:
  // OPEN -> Start Trial -> IN PROGRESS -> Continue Trial / Ready to Submit -> Submit Evidence for Review -> UNDER REVIEW -> Verified/Rejected -> PAID
  const rawStatus = trial.currentCandidateStatus || 'open';
  const isPaid = rawStatus === 'paid' || rawStatus === 'verified' || trial.status === 'verified';
  const isUnderReview = rawStatus === 'under_review' || rawStatus === 'submitted';
  const isReadyToSubmit = rawStatus === 'ready_to_submit';
  const isInProgress = rawStatus === 'in_progress' || rawStatus === 'active';
  const isOpen = !isInProgress && !isReadyToSubmit && !isUnderReview && !isPaid;

  const currentStage: 'OPEN' | 'IN PROGRESS' | 'READY TO SUBMIT' | 'UNDER REVIEW' | 'PAID' =
    isPaid
      ? 'PAID'
      : isUnderReview
      ? 'UNDER REVIEW'
      : isReadyToSubmit
      ? 'READY TO SUBMIT'
      : isInProgress
      ? 'IN PROGRESS'
      : 'OPEN';

  // Calculate percentages for the reward split visual bar
  const candidatePercent = Math.round((trial.candidateReward / trial.totalReward) * 100);
  const referralPercent = 100 - candidatePercent;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top back navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-[#121417]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280] font-mono">ID: {trial.id}</span>
          <button
            onClick={() => handleRefer(trial)}
            className="text-xs text-[#9CA3AF] hover:text-white px-2.5 py-1 rounded bg-[#121417] border border-[#24282D] hover:border-[#38404B] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Protocol State Machine Visual Pipeline */}
      <div className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider">
              Trial State Machine:
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                currentStage === 'OPEN'
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30'
                  : currentStage === 'IN PROGRESS'
                  ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                  : currentStage === 'READY TO SUBMIT'
                  ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                  : currentStage === 'UNDER REVIEW'
                  ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30'
                  : 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
              }`}
            >
              {currentStage}
            </span>
          </div>

          <span className="text-[11px] text-[#9CA3AF] font-mono">
            {currentStage === 'OPEN' && 'Candidate pool open • Click "Start Trial" to accept'}
            {currentStage === 'IN PROGRESS' && 'Candidate in progress • Working on implementation'}
            {currentStage === 'READY TO SUBMIT' && 'Work completed • Ready to submit evidence'}
            {currentStage === 'UNDER REVIEW' && 'Evidence submitted • Autonomous verifier running'}
            {currentStage === 'PAID' && 'Verdict passed • Escrow settled & reputation updated'}
          </span>
        </div>

        {/* 5-step visual state progress */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {[
            { id: 'OPEN', label: '1. OPEN', sub: 'Start Trial' },
            { id: 'IN PROGRESS', label: '2. IN PROGRESS', sub: 'Continue Trial' },
            { id: 'READY TO SUBMIT', label: '3. READY TO SUBMIT', sub: 'Submit Evidence' },
            { id: 'UNDER REVIEW', label: '4. UNDER REVIEW', sub: 'Autonomous AI' },
            { id: 'PAID', label: '5. PAID', sub: 'USDC & Rep' },
          ].map((step, idx) => {
            const isCurrent = currentStage === step.id;
            const stagesOrder = ['OPEN', 'IN PROGRESS', 'READY TO SUBMIT', 'UNDER REVIEW', 'PAID'];
            const currentIdx = stagesOrder.indexOf(currentStage);
            const isDone = currentIdx > idx;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-[#181B20] border-[#0052FF] text-white shadow-sm'
                    : isDone
                    ? 'bg-[#0D0F12] border-[#10B981]/30 text-[#10B981]'
                    : 'bg-[#0D0F12] border-[#24282D] text-[#6B7280]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px] truncate">{step.label}</span>
                  {isDone && <Check className="w-3 h-3 text-[#10B981]" />}
                </div>
                <span className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">{step.sub}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Content) - Span 8 */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Title & Company */}
          <div className="border-b border-[#24282D] pb-6">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={trial.companyLogo}
                alt={trial.company}
                className="w-10 h-10 rounded-xl object-cover border border-[#24282D]"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white">{trial.company}</span>
                  {trial.isCompanyVerified && (
                    <Badge variant="blue" size="xs">
                      <CheckCircle className="w-3 h-3 text-[#3B82F6]" /> Verified Employer
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mt-0.5">
                  <span>{trial.category}</span>
                  <span>•</span>
                  <span>Remote</span>
                  <span>•</span>
                  <span className="font-mono text-[#6B7280]">Created {new Date(trial.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {trial.title}
            </h1>
            <p className="text-sm sm:text-base text-[#9CA3AF] mt-3 leading-relaxed">
              {trial.description}
            </p>

            {/* Skills & Network chips */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <DifficultyBadge difficulty={trial.difficulty} />
              <Badge variant="outline" size="xs">
                <SolanaIcon className="w-3 h-3" /> {trial.network}
              </Badge>
              {trial.network.includes('LayerZero') && (
                <Badge variant="outline" size="xs">
                  <LayerZeroIcon className="w-3 h-3" /> LayerZero Cross-Chain
                </Badge>
              )}
              {trial.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#121417] text-[#D1D5DB] border border-[#24282D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tab Selection: Overview vs Applicants */}
          <div className="flex items-center gap-2 border-b border-[#24282D]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-white border-[#0052FF]'
                  : 'text-[#9CA3AF] border-transparent hover:text-white'
              }`}
            >
              Trial Specification
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'applicants'
                  ? 'text-white border-[#0052FF]'
                  : 'text-[#9CA3AF] border-transparent hover:text-white'
              }`}
            >
              <span>Applicants & Candidates</span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-[#181B20] text-[#9CA3AF] border border-[#24282D]">
                {trial.applicantsCount}
              </span>
            </button>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-8">
              {/* The Objective */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0052FF]" />
                  The Objective
                </h3>
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#24282D] text-sm text-[#E5E7EB] leading-relaxed">
                  {trial.objective}
                </div>
              </section>

              {/* Requirements Checklist */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#0052FF]" />
                  Requirements
                </h3>
                <div className="bg-[#0D0F12] border border-[#24282D] rounded-xl divide-y divide-[#24282D]">
                  {trial.requirements.map((req, idx) => (
                    <div key={req.id} className="p-3.5 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#0052FF]/10 border border-[#0052FF]/30 flex items-center justify-center text-[#3B82F6] flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-[#F3F4F6] font-medium leading-relaxed">
                          {req.text}
                        </span>
                        {req.mandatory && (
                          <span className="ml-2 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#181B20] text-[#9CA3AF] border border-[#24282D]">
                            Mandatory
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Definition of Done (Critical Section) */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#10B981]" />
                    Definition of Done
                  </h3>
                  <span className="text-xs text-[#9CA3AF] font-mono">Protocol Verifier Criteria</span>
                </div>
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#24282D] space-y-2.5">
                  <p className="text-xs text-[#9CA3AF]">
                    The smart contract verifier will evaluate candidate evidence strictly against these deterministic criteria:
                  </p>
                  <ul className="space-y-2">
                    {trial.definitionOfDone.map((dod, idx) => (
                      <li key={dod.id} className="flex items-start gap-2.5 text-sm text-[#D1D5DB]">
                        <span className="text-[#10B981] font-bold font-mono">✓</span>
                        <span>{dod.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Technical Specifications & Contract Details */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono">
                  On-Chain Escrow Architecture
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#0D0F12] border border-[#24282D] rounded-lg">
                    <span className="text-[#6B7280] font-mono block mb-1">Escrow Program PDA</span>
                    <span className="font-mono text-white break-all">{trial.escrowAddress}</span>
                  </div>
                  <div className="p-3 bg-[#0D0F12] border border-[#24282D] rounded-lg">
                    <span className="text-[#6B7280] font-mono block mb-1">Settlement Asset</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <UsdcDisplay amount="USDC SPL" size="xs" showSymbol={false} />
                      <span className="text-[#9CA3AF] font-mono">(EPjFW3...yGeL)</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            /* Applicants Tab */
            <div className="space-y-4">
              <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0052FF]" />
                    Candidate Pipeline ({trial.applicantsCount} Registered)
                  </span>
                  <Badge variant="blue" size="xs">
                    Applicant Pool
                  </Badge>
                </div>
                <p className="text-[#9CA3AF] text-[11px] leading-relaxed">
                  The {trial.applicantsCount} applicants are registered candidates in the discovery pool. Candidates only transition to <strong className="text-[#F59E0B]">IN PROGRESS</strong> once they click <strong className="text-white">Start Trial</strong> or are accepted by the employer.
                </p>
              </div>
              <div className="space-y-3">
                {trialApplicants.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={app.avatar}
                        alt={app.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#24282D]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{app.name}</span>
                          <span className="text-xs text-[#9CA3AF] font-mono">{app.username}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mt-1 font-mono">
                          <span>Wallet: {app.walletAddress}</span>
                          <span>•</span>
                          <span>Reputation: <strong className="text-white">{app.reputationScore}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-[#9CA3AF]">
                          {app.verifiedTrialsCount} Verified Trials
                        </div>
                        <div className="text-xs text-[#10B981] font-mono">
                          {app.successRate}% Success Rate
                        </div>
                      </div>
                      <Badge
                        variant={
                          app.status === 'Verified'
                            ? 'green'
                            : app.status === 'Submitted'
                            ? 'blue'
                            : 'amber'
                        }
                        size="xs"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Reward & Action Panel - Span 4 */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-[#0D0F12] border border-[#24282D] rounded-xl p-6 shadow-xl space-y-6">
            {/* Total Reward Heading */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5 flex items-center justify-between">
                <span>Reward</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  Funded On-Chain
                </span>
              </div>
              <UsdcDisplay amount={trial.totalReward} size="xl" />
            </div>

            {/* Reward Split Breakdown Card */}
            <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-lg space-y-3">
              <div className="text-xs font-semibold text-[#D1D5DB] flex items-center justify-between">
                <span>Reward Allocation</span>
                <span className="text-[11px] text-[#6B7280] font-mono">Automated Split</span>
              </div>

              {/* Progress bar visual split */}
              <div className="w-full h-2 rounded-full bg-[#181B20] overflow-hidden flex">
                <div
                  style={{ width: `${candidatePercent}%` }}
                  className="bg-[#0052FF] h-full"
                  title={`Candidate: ${candidatePercent}%`}
                />
                <div
                  style={{ width: `${referralPercent}%` }}
                  className="bg-[#F59E0B] h-full"
                  title={`Referrer: ${referralPercent}%`}
                />
              </div>

              {/* Candidate reward row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0052FF]" />
                  <span className="text-white font-medium">Candidate Reward</span>
                </div>
                <UsdcDisplay amount={trial.candidateReward} size="sm" />
              </div>

              {/* Referral reward row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="text-white font-medium">Referral Reward</span>
                </div>
                <UsdcDisplay amount={trial.referralReward} size="sm" />
              </div>
            </div>

            {/* Trial Metadata List */}
            <div className="space-y-3 text-xs border-y border-[#24282D] py-4">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  Deadline
                </span>
                <span className="font-mono text-white font-semibold">{trial.deadline}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  Candidates Applied
                </span>
                <span className="font-mono text-white font-semibold">{trial.applicantsCount} in pool</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Current State</span>
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                    currentStage === 'OPEN'
                      ? 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20'
                      : currentStage === 'IN PROGRESS'
                      ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20'
                      : currentStage === 'READY TO SUBMIT'
                      ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20'
                      : currentStage === 'UNDER REVIEW'
                      ? 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20'
                      : 'text-[#10B981] bg-[#10B981]/20 border-[#10B981]/30'
                  }`}
                >
                  {currentStage}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Difficulty</span>
                <DifficultyBadge difficulty={trial.difficulty} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {isPaid ? (
                <div className="space-y-2">
                  <Button
                    variant="success"
                    size="md"
                    className="w-full"
                    onClick={() => onViewVerification(trial)}
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    View Verification Verdict (Settled)
                  </Button>
                  <p className="text-[11px] text-[#10B981] text-center font-mono">
                    Verdict: VERIFIED • 450 USDC Released • +85 Rep
                  </p>
                </div>
              ) : isUnderReview ? (
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => onViewVerification(trial)}
                    icon={<Clock className="w-4 h-4" />}
                  >
                    Track Verification Status
                  </Button>
                  <p className="text-[11px] text-[#9CA3AF] text-center font-mono">
                    State: UNDER REVIEW • Autonomous checks running
                  </p>
                </div>
              ) : isInProgress ? (
                <div className="space-y-2">
                  {/* Once candidate has completed work: Submit Evidence for Review */}
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => onSubmitEvidence(trial)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Submit Evidence for Review
                  </Button>

                  {/* Continue Trial button for candidate actively in progress */}
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      if (onContinueTrial) {
                        onContinueTrial(trial);
                      } else {
                        handleStart(trial);
                      }
                    }}
                    icon={<Terminal className="w-4 h-4 text-[#0052FF]" />}
                  >
                    Continue Trial
                  </Button>

                  <div className="p-2.5 bg-[#121417] border border-[#24282D] rounded-lg text-[11px] text-[#9CA3AF] leading-relaxed">
                    <span className="text-[#F59E0B] font-semibold font-mono block mb-0.5">● STATE: IN PROGRESS</span>
                    Candidate is actively working on trial. Click <strong className="text-white">Continue Trial</strong> to access workspace, or click <strong className="text-white">Submit Evidence for Review</strong> once code is ready.
                  </div>
                </div>
              ) : isReadyToSubmit ? (
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => onSubmitEvidence(trial)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Submit Evidence for Review
                  </Button>
                  <p className="text-[11px] text-[#9CA3AF] text-center">
                    Work completed. Click to submit repository and deployment evidence.
                  </p>
                </div>
              ) : (
                /* OPEN: Candidate has not started yet */
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => handleStart(trial)}
                    icon={<Play className="w-4 h-4 fill-white" />}
                  >
                    Start Trial
                  </Button>
                  <div className="p-2.5 bg-[#121417] border border-[#24282D] rounded-lg text-[11px] text-[#9CA3AF] leading-relaxed">
                    <span className="text-[#3B82F6] font-semibold font-mono block mb-0.5">● STATE: OPEN</span>
                    Candidate has not started yet. Click <strong className="text-white">Start Trial</strong> to accept requirements and enter <strong className="text-white">IN PROGRESS</strong>.
                  </div>
                </div>
              )}

              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => handleRefer(trial)}
                icon={<Share2 className="w-3.5 h-3.5 text-[#F59E0B]" />}
              >
                Refer Someone ({trial.referralReward} USDC Reward)
              </Button>
            </div>

            {/* Small On-Chain Escrow Security Note */}
            <div className="pt-1 flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF]">
              <Lock className="w-3 h-3 text-[#10B981]" />
              <span>Reward funded on-chain</span>
              <SolanaIcon className="w-3 h-3" />
            </div>
          </div>

          {/* Quick Guidance Card */}
          <div className="bg-[#0D0F12] border border-[#24282D] rounded-xl p-4 text-xs text-[#9CA3AF] space-y-2">
            <span className="font-semibold text-white block font-mono text-[11px] uppercase tracking-wider">
              WorkTrial Protocol Pipeline:
            </span>
            <p>
              1. <strong className="text-white">Start Trial:</strong> Accept requirements to enter <strong className="text-[#F59E0B]">IN PROGRESS</strong>.
            </p>
            <p>
              2. <strong className="text-white">Submit Evidence for Review:</strong> Package GitHub repo, live deployment & tx link.
            </p>
            <p>
              3. <strong className="text-white">Submit for Verification:</strong> Autonomous oracles & AI evaluate outcomes against the Definition of Done.
            </p>
            <p>
              4. <strong className="text-white">Settlement & Reputation:</strong> Verdict passes → USDC escrow releases automatically & reputation updates on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
