import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
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
import { OutcomLogo } from './components/common/NetworkIcons';

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

  const {
    publicKey,
    connected,
    connecting,
    disconnect,
    wallet: adapterWallet,
    connect,
  } = useWallet();
  const { setVisible: setAdapterWalletModalVisible } = useWalletModal();

  const wallet = useMemo(
    () => ({
      isConnected: connected,
      address: publicKey?.toBase58() ?? '',
      publicKey: publicKey?.toBase58() ?? '',
      walletName: adapterWallet?.adapter.name ?? '',
      connecting,
      network: 'Solana',
    }),
    [connected, publicKey, adapterWallet, connecting]
  );

  const [trials, setTrials] = useState<Outcom[]>(MOCK_TRIALS);
  const [selectedTrial, setSelectedTrial] = useState<Outcom>(MOCK_TRIALS[0]);
  const [verdict, setVerdict] = useState<VerificationVerdict>(MOCK_VERIFICATION_SAMPLE);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const [referralTrial, setReferralTrial] = useState<Outcom | null>(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const [isCreateTrialModalOpen, setIsCreateTrialModalOpen] = useState(false);

  const [inspectedTx, setInspectedTx] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleSelectTrial = (trial: Outcom) => {
    setSelectedTrial(trial);
    navigate(`/trials/${trial.id}`);
  };

  const handleOpenReferral = (trial: Outcom) => {
    setReferralTrial(trial);
    setIsReferralModalOpen(true);
  };

  const handleSendReferral = (candidateAddress: string, message: string) => {
    console.log('Referral dispatched on-chain for', candidateAddress, message);
  };

  const handleCommitToTrial = (trial: Outcom) => {
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
    setTrials((prev) =>
      prev.map((t) =>
        t.id === submission.trialId ? { ...t, currentCandidateStatus: 'submitted' } : t
      )
    );
    setSelectedTrial((prev) => ({ ...prev, currentCandidateStatus: 'submitted' }));

    const currentTrial = trials.find((t) => t.id === submission.trialId) || selectedTrial;

    setVerdict({
      ...MOCK_VERIFICATION_SAMPLE,
      trialId: currentTrial.id,
      candidateReward: currentTrial.candidateReward,
      referralReward: currentTrial.referralReward,
      candidateAddress: wallet.address,
      status: 'VERIFIED',
    });

    navigate(`/trials/${currentTrial.id}/verification`);
  };


  const handleSelectCandidate = (_candidate: CandidateApplicant) => {
    navigate('/reputation');
  };

  const handleConnectWallet = async () => {
    if (adapterWallet) {
      try {
        await connect();
      } catch (err) {
        console.error('Wallet connect failed', err);
        setAdapterWalletModalVisible(true);
      }
    } else {
      setAdapterWalletModalVisible(true);
    }
    setIsWalletModalOpen(false);
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Wallet disconnect failed', err);
    }
    setIsWalletModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090A0C] text-[#D1D5DB] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white">
      <Navbar
        onNavigate={(tab) => {
          if (tab === 'landing') navigate('/');
          else if (tab === 'discover') navigate('/discover');
          else if (tab === 'workspace') navigate('/work-trials');
          else if (tab === 'employer') navigate('/employer');
          else if (tab === 'leaderboard') navigate('/leaderboard');
          else if (tab === 'reputation') navigate('/reputation');
        }}
        
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenSearch={() => navigate('/discover')}
        onOpenCreateTrial={() => setIsCreateTrialModalOpen(true)}
        notifications={MOCK_NOTIFICATIONS}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
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
          <Route path="/workspace" element={<Navigate to="/work-trials" replace />} />

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

          <Route
            path="/leaderboard"
            element={
              <LeaderboardView
                candidates={MOCK_LEADERBOARD}
                onSelectCandidate={handleSelectCandidate}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      {referralTrial && (
        <ReferralModal
          isOpen={isReferralModalOpen}
          onClose={() => {
            setIsReferralModalOpen(false);
            setReferralTrial(null);
          }}
          trial={referralTrial}
          onSendReferral={handleSendReferral}
        />
      )}

      <CreateTrialModal
        isOpen={isCreateTrialModalOpen}
        onClose={() => setIsCreateTrialModalOpen(false)}
      />

      {inspectedTx && (
        <TransactionModal
          isOpen={Boolean(inspectedTx)}
          onClose={() => setInspectedTx(null)}
          txHash={inspectedTx}
        />
      )}

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
            <span className="text-white text-sm">Powered by: </span>

            <div className="flex items-center gap-1.5 text-white">
              <img src="https://genlayer.com/brand/genlayer-logo-white.svg" className="w-25 h-10" />
            </div>

            <div className="flex items-center gap-1.5 text-white">
              <img src="https://solana.com/src/img/branding/solanaLogo.svg/" alt="Solana Logo" className="w-25 h-10" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}