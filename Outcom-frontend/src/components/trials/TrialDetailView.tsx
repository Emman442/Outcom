import React, { useEffect, useState } from 'react';
import { Outcom, Difficulty, CandidateApplicant } from '../../types';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { Badge, DifficultyBadge } from '../common/Badge';
import { SolanaIcon } from '../common/NetworkIcons';
import {
  CheckCircle,
  Clock,
  Users,
  Shield,
  ChevronLeft,
  Share2,
  FileCode,
  Terminal,
  Lock,
  Play,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useProgram } from '@/src/hooks/solana/use-program';
import { useParams } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { truncateAddress } from '@/src/utils/truncateAddress';

interface TrialDetailViewProps {
  onBack: () => void;
  onStartTrial?: (trial: Outcom) => void;
  onCommitTrial?: (trial: Outcom) => void;
  onContinueTrial?: (trial: Outcom) => void;
  onSubmitEvidence: (trial: Outcom) => void;
  onViewVerification: (trial: Outcom) => void;
  onOpenReferModal?: (trial: Outcom) => void;
  onOpenReferral?: (trial: Outcom) => void;
  trialApplicants?: CandidateApplicant[];
}

const MOCK_REQUIREMENTS = [
  { id: 'req-1', text: 'Anchor smart contract deployed on Solana Devnet', mandatory: true },
  { id: 'req-2', text: 'USDC SPL token transfer verification', mandatory: true },
  { id: 'req-3', text: 'Robust error handling and unit tests', mandatory: false },
];

export function mapTrial(account: any, pubkey: PublicKey): Outcom {
  const statusKey =
    account.status && typeof account.status === 'object'
      ? Object.keys(account.status)[0]
      : 'open';

  const statusMap: Record<string, Outcom['status']> = {
    open: 'open',
    inProgress: 'in_progress',
    readyToSubmit: 'in_progress',
    underReview: 'in_progress',
    verified: 'verified',
    paid: 'verified',
    rejected: 'verified',
  };

  const candidateReward = Number(account.candidateReward?.toString?.() ?? 0) / 1_000_000;
  const referralReward = Number(account.referralReward?.toString?.() ?? 0) / 1_000_000;

  const dodLines = String(account.definitionOfDone || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const fallbackDod = [
    'Public GitHub repository with verified commit history',
    'Application deployed to public URL',
    'Verifiable transaction signatures on Solana block explorer',
  ];

  return {
    id: account.trialId,
    title: account.title || account.trialId,
    description: account.description || '',
    company: account.employer?.toBase58?.() ?? '',
    companyLogo:
      'https://i.pinimg.com/736x/2f/02/5a/2f025aa02bd16703950afaf16960911d.jpg',
    isCompanyVerified: true,
    category: account.category || 'Full-Stack',
    difficulty: (account.difficulty || 'Advanced') as Difficulty,
    skills: String(account.skills || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean),
    candidateReward,
    referralReward,
    totalReward: candidateReward + referralReward,
    status: statusMap[statusKey] ?? 'open',
    currentCandidateStatus: statusMap[statusKey] ?? 'open',
    objective: account.objective || '',
    definitionOfDone: (dodLines.length ? dodLines : fallbackDod).map((text, i) => ({
      id: `dod-${i}`,
      text,
    })),
    requirements: String(account.requirements || "")
      .split(",")
      .map((text: string, i: number) => ({
        id: `req-${i}`,
        text: text.trim(),
        mandatory: true,
      }))
      .filter((r) => r.text),
    escrowAddress: pubkey.toBase58(),
    createdAt: Date.now(),
    deadline: 'Open',
    applicantsCount: 0,
    selectedCandidate: String(account.selectedCandidate ?? "")
  } as unknown as Outcom;
}

export const TrialDetailView: React.FC<TrialDetailViewProps> = ({
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
  const { program } = useProgram();
  const { publicKey } = useWallet()
  const { trialId } = useParams<{ trialId: string }>();
  const [trial, setTrial] = useState<Outcom | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!program || !trialId) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const rows = await program?.account.trialAccount.all();
        const row = rows?.find((r: any) => r.account.trialId === trialId);

        if (cancelled) return;

        if (!row) {
          setTrial(null);
          return;
        }

        setTrial(mapTrial(row.account, row.publicKey));
      } catch (err) {
        console.error('fetch trial failed', err);
        if (!cancelled) setTrial(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [program, trialId]);


  const handleRefer = (targetTrial: Outcom) => {
    if (onOpenReferral) onOpenReferral(targetTrial);
    else if (onOpenReferModal) onOpenReferModal(targetTrial);
  };


  const handleStart = async (targetTrial: Outcom) => {
    if (!program || !publicKey || !trialId) return;

    const [trialPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("Trial"),
        new PublicKey(targetTrial.company).toBuffer(),
        Buffer.from(trialId),
      ],
      program.programId
    );

    try {
      const tx = await program.methods
        .startTrial()
        .accountsPartial({
          candidate: publicKey,
          trialAccount: trialPda,
        })
        .rpc();

      console.log("startTrial", tx);
      if (onCommitTrial) onCommitTrial(targetTrial);
      else if (onStartTrial) onStartTrial(targetTrial);
    } catch (err) {
      console.error("startTrial failed", err);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-[#9CA3AF]">Loading trial…</div>;
  }

  if (!trial) {
    return (
      <div className="text-sm text-[#9CA3AF]">
        Trial <span className="font-mono text-white">{trialId}</span> not found.
      </div>
    );
  }

  const rawStatus = trial.currentCandidateStatus || trial.status || 'open';
  const isPaid = rawStatus === 'paid' || rawStatus === 'verified';
  const isUnderReview = rawStatus === 'under_review' || rawStatus === 'submitted';
  const isReadyToSubmit = rawStatus === 'ready_to_submit';
  const isInProgress = rawStatus === 'in_progress' || rawStatus === 'active';

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

  const totalReward = trial.totalReward || 1;
  const candidatePercent = Math.round((trial.candidateReward / totalReward) * 100);
  const referralPercent = 100 - candidatePercent;
  const requirements = trial.requirements ?? MOCK_REQUIREMENTS;
  const definitionOfDone = trial.definitionOfDone ?? [];
  const skills = trial.skills ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-[#121417]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </button>
      </div>

      <div className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider">
              Trial State Machine:
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${currentStage === 'OPEN'
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {[
            { id: 'OPEN', label: '1. OPEN', sub: 'Start Trial' },
            { id: 'IN PROGRESS', label: '2. IN PROGRESS', sub: 'Continue Trial' },
            { id: 'READY TO SUBMIT', label: '3. READY TO SUBMIT', sub: 'Submit Evidence' },
            { id: 'UNDER REVIEW', label: '4. UNDER REVIEW', sub: 'Autonomous AI' },
            { id: 'PAID', label: '5. PAID', sub: 'USDC & Rep' },
          ].map((step, idx) => {
            const stagesOrder = ['OPEN', 'IN PROGRESS', 'READY TO SUBMIT', 'UNDER REVIEW', 'PAID'];
            const isCurrent = currentStage === step.id;
            const isDone = stagesOrder.indexOf(currentStage) > idx;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border flex flex-col justify-between transition-all ${isCurrent
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
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
                  <span className="text-sm font-semibold text-white">{truncateAddress(trial.company)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mt-0.5">
                  <span>{trial.category}</span>
                  <span>•</span>
                  <span>Remote</span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {trial.title}
            </h1>
            <p className="text-sm sm:text-base text-[#9CA3AF] mt-3 leading-relaxed">
              {trial.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <DifficultyBadge difficulty={trial.difficulty} />
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#121417] text-[#D1D5DB] border border-[#24282D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-[#24282D]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${activeTab === 'overview'
                ? 'text-white border-[#0052FF]'
                : 'text-[#9CA3AF] border-transparent hover:text-white'
                }`}
            >
              Trial Specification
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 cursor-pointer ${activeTab === 'applicants'
                ? 'text-white border-[#0052FF]'
                : 'text-[#9CA3AF] border-transparent hover:text-white'
                }`}
            >
              <span>Applicants & Candidates</span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-[#181B20] text-[#9CA3AF] border border-[#24282D]">
                {trial.applicantsCount ?? 0}
              </span>
            </button>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-8">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0052FF]" />
                  The Objective
                </h3>
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#24282D] text-sm text-[#E5E7EB] leading-relaxed">
                  {trial.objective}
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#0052FF]" />
                  Requirements
                </h3>
                <div className="bg-[#0D0F12] border border-[#24282D] rounded-xl divide-y divide-[#24282D]">
                  {requirements.map((req) => (
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

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#D1D5DB] uppercase tracking-wider font-mono flex items-center gap-2">
                    Definition of Done
                  </h3>
                </div>
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#24282D] space-y-2.5">
                  <ul className="space-y-2">
                    {definitionOfDone.map((dod) => (
                      <li key={dod.id} className="flex items-start gap-2.5 text-sm text-[#D1D5DB]">
                        <span className="text-[#10B981] font-bold font-mono">✓</span>
                        <span>{dod.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-xl text-xs">
                <span className="text-white font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0052FF]" />
                  Candidate Pipeline ({trialApplicants.length} Registered)
                </span>
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
                        </div>
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
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-[#0D0F12] border border-[#24282D] rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Reward
              </div>
              <UsdcDisplay amount={trial.totalReward} size="xl" />
            </div>

            <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-lg space-y-3">
              <div className="w-full h-2 rounded-full bg-[#181B20] overflow-hidden flex">
                <div style={{ width: `${candidatePercent}%` }} className="bg-[#0052FF] h-full" />
                <div style={{ width: `${referralPercent}%` }} className="bg-[#F59E0B] h-full" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-medium">Candidate Reward</span>
                <UsdcDisplay amount={trial.candidateReward} size="sm" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-medium">Referral Reward</span>
                <UsdcDisplay amount={trial.referralReward} size="sm" />
              </div>
            </div>

            <div className="space-y-3 text-xs border-y border-[#24282D] py-4">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Deadline
                </span>
                <span className="font-mono text-white font-semibold">{trial.deadline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Candidates Applied
                </span>
                <span className="font-mono text-white font-semibold">
                  {trialApplicants.length} in pool
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Difficulty</span>
                <DifficultyBadge difficulty={trial.difficulty} />
              </div>
            </div>

            <div className="space-y-2.5">
              {isPaid ? (
                <Button
                  variant="success"
                  size="md"
                  className="w-full"
                  onClick={() => onViewVerification(trial)}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  View Verification Verdict (Settled)
                </Button>
              ) : isUnderReview ? (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => onViewVerification(trial)}
                  icon={<Clock className="w-4 h-4" />}
                >
                  Track Verification Status
                </Button>
              ) : isInProgress ? (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => onSubmitEvidence(trial)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Submit Evidence for Review
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      if (onContinueTrial) onContinueTrial(trial);
                      else handleStart(trial);
                    }}
                    icon={<Terminal className="w-4 h-4 text-[#0052FF]" />}
                  >
                    Continue Trial
                  </Button>
                </>
              ) : isReadyToSubmit ? (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => onSubmitEvidence(trial)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Submit Evidence for Review
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => handleStart(trial)}
                  icon={<Play className="w-4 h-4 fill-white" />}
                >
                  Start Trial
                </Button>
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

            <div className="pt-1 flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF]">
              <Lock className="w-3 h-3 text-[#10B981]" />
              <span>Reward funded on-chain</span>
              <SolanaIcon className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};