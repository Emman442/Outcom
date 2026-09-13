import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import {
  NavigationTab,
  Outcom,
  UserWallet,
  SubmissionData,
  CandidateApplicant,
  VerificationVerdict,
} from './types';
import {
  MOCK_TRIALS,
  MOCK_REPUTATION_TIMELINE,
  MOCK_LEADERBOARD,
  MOCK_VERIFICATION_SAMPLE,
  INITIAL_USER_WALLET,
  MOCK_NOTIFICATIONS,
} from './data/mockData';

// Layout & Common
import { Navbar } from './components/layout/Navbar';
import { WalletModal } from './components/wallet/WalletModal';
import { ReferralModal } from './components/trials/ReferralModal';
import { TransactionModal } from './components/common/TransactionModal';

// Views
import { LandingView } from './components/landing/LandingView';
import { DiscoverView } from './components/discover/DiscoverView';
import { TrialDetailView } from './components/trials/TrialDetailView';
import { CandidateWorkspace } from './components/workspace/CandidateWorkspace';
import { SubmissionView } from './components/submission/SubmissionView';
import { VerificationView } from './components/verification/VerificationView';
import { ReputationView } from './components/reputation/ReputationView';
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { CreateTrialModal } from './components/employer/CreateTrialModal';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { SolanaIcon, LayerZeroIcon, OutcomLogo } from './components/common/NetworkIcons';
import { UsdcIcon } from './components/common/UsdcIcon';

// Sub-route wrapper components for trial-specific routes
function TrialDetailRoute({
  trials,
  wallet,
  onCommitTrial,
  onOpenReferral,
  onSubmitEvidenceNav,
  onSelectTrial,
}: {
  trials: Outcom[];
  wallet: UserWallet;
  onCommitTrial: (trial: Outcom) => void;
  onOpenReferral: (trial: Outcom) => void;
  onSubmitEvidenceNav: (trial: Outcom) => void;
  onSelectTrial: (trial: Outcom) => void;
}) {
  const { trialId } = useParams<{ trialId: string }>();
  const navigate = useNavigate();
  const trial = trials.find((t) => t.id === trialId) || trials[0];

  useEffect(() => {
    if (trial) {
      onSelectTrial(trial);
    }
  }, [trialId, trial, onSelectTrial]);

  if (!trial) {
    return <Navigate to="/discover" replace />;
  }

  return (
    <TrialDetailView
      trial={trial}
      wallet={wallet}
      onBack={() => navigate('/discover')}
      onCommitTrial={onCommitTrial}
      onStartTrial={onCommitTrial}
      onContinueTrial={(t) => {
        onSelectTrial(t);
        navigate('/work-trials');
      }}
      onOpenReferral={onOpenReferral}
      onOpenReferModal={onOpenReferral}
      onSubmitEvidence={(t) => {
        onSubmitEvidenceNav(t);
        navigate(`/trials/${t.id}/submit`);
      }}
      onViewVerification={(t) => navigate(`/trials/${t.id}/verification`)}
    />
  );
}

function SubmissionRoute({
  trials,
  selectedTrial,
  wallet,
  onSubmit,
}: {
  trials: Outcom[];
  selectedTrial: Outcom;
  wallet: UserWallet;
  onSubmit: (submission: SubmissionData) => void;
}) {
  const { trialId } = useParams<{ trialId: string }>();
  const navigate = useNavigate();
  const trial = trials.find((t) => t.id === trialId) || selectedTrial || trials[0];

  return (
    <SubmissionView
      trial={trial}
      wallet={wallet}
      onBack={() => navigate(`/trials/${trial.id}`)}
      onSubmit={(submission) => {
        onSubmit(submission);
      }}
    />
  );
}

function VerificationRoute({
  trials,
  selectedTrial,
  verdict,
  wallet,
  onOpenTransactionDetails,
}: {
  trials: Outcom[];
  selectedTrial: Outcom;
  verdict: VerificationVerdict;
  wallet: UserWallet;
  onOpenTransactionDetails: (tx: string) => void;
}) {
  const { trialId } = useParams<{ trialId: string }>();
  const navigate = useNavigate();
  const trial = trials.find((t) => t.id === trialId) || selectedTrial || trials[0];

  return (
    <VerificationView
      trial={trial}
      verdict={verdict}
      wallet={wallet}
      onBack={() => navigate(`/trials/${trial.id}`)}
      onGoToReputation={() => navigate('/reputation')}
      onOpenTransactionDetails={onOpenTransactionDetails}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & View State
  const [trials, setTrials] = useState<Outcom[]>(MOCK_TRIALS);
  const [selectedTrial, setSelectedTrial] = useState<Outcom>(MOCK_TRIALS[0]);
  const [verdict, setVerdict] = useState<VerificationVerdict>(MOCK_VERIFICATION_SAMPLE);

  // Wallet State
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_USER_WALLET);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Referral Modal State
  const [referralTrial, setReferralTrial] = useState<Outcom | null>(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  // Employer Create Trial Modal
  const [isCreateTrialModalOpen, setIsCreateTrialModalOpen] = useState(false);

  // Transaction Inspector Modal
  const [inspectedTx, setInspectedTx] = useState<string | null>(null);

  // Scroll to top automatically on route transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Handlers
  const handleSelectTrial = (trial: Outcom) => {
    setSelectedTrial(trial);
    navigate(`/trials/${trial.id}`);
  };

  const handleOpenReferral = (trial: Outcom) => {
    setReferralTrial(trial);
    setIsReferralModalOpen(true);
  };

  const handleSendReferral = (candidateAddress: string, message: string) => {
    // Log dispatch on-chain referral
    console.log('Referral dispatched on-chain for', candidateAddress, message);
  };

  const handleCommitToTrial = (trial: Outcom) => {
    // Transition candidate status to IN PROGRESS
    setTrials((prev) =>
      prev.map((t) =>
        t.id === trial.id
          ? { ...t, currentCandidateStatus: 'in_progress', applicantsCount: t.applicantsCount + 1 }
          : t
      )
    );
    setSelectedTrial((prev) => ({
      ...prev,
      currentCandidateStatus: 'in_progress',
      applicantsCount: prev.applicantsCount + 1,
    }));
  };

  const handleSubmitEvidenceNav = (trial: Outcom) => {
    setSelectedTrial(trial);
    navigate(`/trials/${trial.id}/submit`);
  };

  const handleCompleteSubmission = (submission: SubmissionData) => {
    // Update trial status to submitted
    setTrials((prev) =>
      prev.map((t) =>
        t.id === submission.trialId ? { ...t, currentCandidateStatus: 'submitted' } : t
      )
    );
    setSelectedTrial((prev) => ({ ...prev, currentCandidateStatus: 'submitted' }));

    const currentTrial = trials.find((t) => t.id === submission.trialId) || selectedTrial;

    // Prepare verdict with trial reward details
    setVerdict({
      ...MOCK_VERIFICATION_SAMPLE,
      trialId: currentTrial.id,
      candidateReward: currentTrial.candidateReward,
      referralReward: currentTrial.referralReward,
      candidateAddress: wallet.address,
      status: 'VERIFIED',
    });

    // Navigate to verification climax view
    navigate(`/trials/${currentTrial.id}/verification`);
  };

  const handleCreateNewTrial = (newTrialData: Partial<Outcom>) => {
    const fullTrial: Outcom = {
      id: `wt-custom-${Date.now().toString().slice(-4)}`,
      title: newTrialData.title || 'Custom Work Trial',
      company: 'Example Labs',
      companyLogo:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      isCompanyVerified: true,
      category: newTrialData.category || 'Full-Stack',
      description: newTrialData.description || 'Full-stack outcome verification trial.',
      objective: newTrialData.objective || 'Complete all acceptance requirements.',
      requirements: newTrialData.requirements || [],
      definitionOfDone: newTrialData.definitionOfDone || [],
      totalReward: newTrialData.totalReward || 500,
      candidateReward: newTrialData.candidateReward || 450,
      referralReward: newTrialData.referralReward || 50,
      applicantsCount: 0,
      deadline: '7d 00h 00m',
      deadlineTimestamp: Date.now() + 7 * 86400000,
      difficulty: newTrialData.difficulty || 'Advanced',
      isRemote: true,
      network: 'Solana',
      skills: newTrialData.skills || ['Solana', 'Anchor', 'Rust'],
      status: 'open',
      escrowAddress: newTrialData.escrowAddress || 'EscrowMock123',
      createdAt: new Date().toISOString(),
    };

    setTrials([fullTrial, ...trials]);
    setIsCreateTrialModalOpen(false);
    setSelectedTrial(fullTrial);
    navigate(`/trials/${fullTrial.id}`);
  };

  const handleSelectCandidate = (candidate: CandidateApplicant) => {
    navigate('/reputation');
  };

  return (
    <div className="min-h-screen bg-[#090A0C] text-[#D1D5DB] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white">
      {/* Persistent Navigation */}
      <Navbar
        onNavigate={(tab) => {
          if (tab === 'landing') navigate('/');
          else if (tab === 'discover') navigate('/discover');
          else if (tab === 'workspace') navigate('/work-trials');
          else if (tab === 'employer') navigate('/employer');
          else if (tab === 'leaderboard') navigate('/leaderboard');
          else if (tab === 'reputation') navigate('/reputation');
        }}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenSearch={() => navigate('/discover')}
        onOpenCreateTrial={() => setIsCreateTrialModalOpen(true)}
        notifications={MOCK_NOTIFICATIONS}
      />

      {/* Main App Content Container with Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Landing / Protocol Gateway */}
          <Route
            path="/"
            element={
              <LandingView
                trials={trials}
                onSelectTrial={handleSelectTrial}
                onExploreTrials={() => navigate('/discover')}
                onCreateTrial={() => setIsCreateTrialModalOpen(true)}
                onOpenReferral={handleOpenReferral}
              />
            }
          />

          {/* Discover Work Trials */}
          <Route
            path="/discover"
            element={
              <DiscoverView
                trials={trials}
                onSelectTrial={handleSelectTrial}
                onOpenReferral={handleOpenReferral}
                onCreateTrial={() => setIsCreateTrialModalOpen(true)}
              />
            }
          />

          {/* Candidate Workspace / Work Trials */}
          <Route
            path="/work-trials"
            element={
              <CandidateWorkspace
                trials={trials}
                onSelectTrial={handleSelectTrial}
                onSubmitEvidence={handleSubmitEvidenceNav}
                onViewVerification={(t) => navigate(`/trials/${t.id}/verification`)}
                onExploreTrials={() => navigate('/discover')}
              />
            }
          />
          {/* Alias for workspace */}
          <Route path="/workspace" element={<Navigate to="/work-trials" replace />} />

          {/* Trial Detail Route with URL Param */}
          <Route
            path="/trials/:trialId"
            element={
              <TrialDetailRoute
                trials={trials}
                wallet={wallet}
                onCommitTrial={handleCommitToTrial}
                onOpenReferral={handleOpenReferral}
                onSubmitEvidenceNav={handleSubmitEvidenceNav}
                onSelectTrial={setSelectedTrial}
              />
            }
          />

          {/* Trial Submission Route */}
          <Route
            path="/trials/:trialId/submit"
            element={
              <SubmissionRoute
                trials={trials}
                selectedTrial={selectedTrial}
                wallet={wallet}
                onSubmit={handleCompleteSubmission}
              />
            }
          />
          <Route
            path="/submit-trial"
            element={
              <SubmissionRoute
                trials={trials}
                selectedTrial={selectedTrial}
                wallet={wallet}
                onSubmit={handleCompleteSubmission}
              />
            }
          />

          {/* Autonomous Verification Route */}
          <Route
            path="/trials/:trialId/verification"
            element={
              <VerificationRoute
                trials={trials}
                selectedTrial={selectedTrial}
                verdict={verdict}
                wallet={wallet}
                onOpenTransactionDetails={(tx) => setInspectedTx(tx)}
              />
            }
          />
          <Route
            path="/verification"
            element={
              <VerificationRoute
                trials={trials}
                selectedTrial={selectedTrial}
                verdict={verdict}
                wallet={wallet}
                onOpenTransactionDetails={(tx) => setInspectedTx(tx)}
              />
            }
          />

          {/* Candidate Reputation Protocol */}
          <Route
            path="/reputation"
            element={
              <ReputationView
                wallet={wallet}
                timeline={MOCK_REPUTATION_TIMELINE}
                onOpenTx={(tx) => setInspectedTx(tx)}
              />
            }
          />

          {/* Employer Dashboard */}
          <Route
            path="/employer"
            element={
              <EmployerDashboard
                trials={trials}
                applicants={MOCK_LEADERBOARD}
                wallet={wallet}
                onOpenCreateTrial={() => setIsCreateTrialModalOpen(true)}
                onSelectTrial={handleSelectTrial}
                onViewApplicant={handleSelectCandidate}
              />
            }
          />
          <Route path="/employer-hub" element={<Navigate to="/employer" replace />} />

          {/* Verified Talent Leaderboard */}
          <Route
            path="/leaderboard"
            element={
              <LeaderboardView
                candidates={MOCK_LEADERBOARD}
                onSelectCandidate={handleSelectCandidate}
              />
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onConnect={() => {
          setWallet((prev) => ({
            ...prev,
            isConnected: true,
          }));
          setIsWalletModalOpen(false);
        }}
        onDisconnect={() => {
          setWallet((prev) => ({
            ...prev,
            isConnected: false,
          }));
          setIsWalletModalOpen(false);
        }}
      />

      {referralTrial && (
        <ReferralModal
          isOpen={isReferralModalOpen}
          onClose={() => {
            setIsReferralModalOpen(false);
            setReferralTrial(null);
          }}
          trial={referralTrial}
          wallet={wallet}
          onSendReferral={handleSendReferral}
        />
      )}

      <CreateTrialModal
        isOpen={isCreateTrialModalOpen}
        onClose={() => setIsCreateTrialModalOpen(false)}
        wallet={wallet}
        onCreateTrial={handleCreateNewTrial}
      />

      {inspectedTx && (
        <TransactionModal
          isOpen={Boolean(inspectedTx)}
          onClose={() => setInspectedTx(null)}
          txHash={inspectedTx}
        />
      )}

      {/* Technical Protocol Footer */}
      <footer className="border-t border-[#24282D] bg-[#090A0C] py-8 text-xs text-[#9CA3AF] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white font-semibold tracking-tight">
              <OutcomLogo className="w-5 h-5 text-[#0052FF]" />
              <span>Outcom</span>
            </div>
            <span className="text-[#6B7280]">|</span>
            <span className="font-mono text-[11px]">Outcome-Based Hiring Protocol</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-white">
              <SolanaIcon className="w-3.5 h-3.5" />
              <span>Solana Program v1.2</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <UsdcIcon className="w-3.5 h-3.5" />
              <span>USDC Escrow PDA</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <LayerZeroIcon className="w-3.5 h-3.5" />
              <span>LayerZero Relayer</span>
            </div>
          </div>

          <div className="text-[11px] text-[#6B7280]">
            Autonomous Verification • Non-Custodial Rewards
          </div>
        </div>
      </footer>
    </div>
  );
}
