import React, { useState, useEffect, useMemo } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Outcom, UserWallet, SubmissionData, CandidateApplicant } from "./types";
import { Navbar } from "./components/layout/Navbar";
import { WalletModal } from "./components/wallet/WalletModal";
import { ReferralModal } from "./components/trials/ReferralModal";
import { TransactionModal } from "./components/common/TransactionModal";
import { LandingView } from "./components/landing/LandingView";
import { DiscoverView } from "./components/discover/DiscoverView";
import { TrialDetailView } from "./components/trials/TrialDetailView";
import { CandidateWorkspace } from "./components/workspace/CandidateWorkspace";
import { SubmissionView } from "./components/submission/SubmissionView";
import { VerificationView } from "./components/verification/VerificationView";
import { ReputationView } from "./components/reputation/ReputationView";
import { EmployerDashboard } from "./components/employer/EmployerDashboard";
import { CreateTrialModal } from "./components/employer/CreateTrialModal";
import { OutcomLogo, SolanaIcon } from "./components/common/NetworkIcons";
import { useProgram } from "@/src/hooks/solana/use-program";
import { mapTrial } from "./components/trials/TrialDetailView";
import { UsdcIcon } from "./components/common/UsdcIcon";

function TrialDetailRoute({
  onCommitTrial,
  onOpenReferral,
  onSubmitEvidenceNav,
}: {
  onCommitTrial: (trial: Outcom) => void;
  onOpenReferral: (trial: Outcom) => void;
  onSubmitEvidenceNav: (trial: Outcom) => void;
}) {
  const navigate = useNavigate();
  return (
    <TrialDetailView
      onBack={() => navigate("/discover")}
      onCommitTrial={onCommitTrial}
      onStartTrial={onCommitTrial}
      onContinueTrial={() => navigate("/work-trials")}
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
  onSubmit,
}: {
  onSubmit: (submission: SubmissionData) => void;
}) {
  const { trialId } = useParams<{ trialId: string }>();
  const navigate = useNavigate();
  return (
    <SubmissionView
      onBack={() => navigate(`/trials/${trialId}`)}
      onSubmit={onSubmit}
    />
  );
}

function VerificationRoute({
  onOpenTransactionDetails,
}: {
  onOpenTransactionDetails: (tx: string) => void;
}) {
  const navigate = useNavigate();
  const { trialId } = useParams<{ trialId: string }>();
  return (
    <VerificationView
      onBack={() => navigate(`/trials/${trialId}`)}
      onGoToReputation={() => navigate("/reputation")}
      onOpenTransactionDetails={onOpenTransactionDetails}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { program } = useProgram();
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
      address: publicKey?.toBase58() ?? "",
      publicKey: publicKey?.toBase58() ?? "",
      walletName: adapterWallet?.adapter.name ?? "",
      connecting,
      network: "Solana",
      usdcBalance: 0,
      solBalance: 0,
      reputationScore: 0,
    }),
    [connected, publicKey, adapterWallet, connecting]
  );

  const [trials, setTrials] = useState<Outcom[]>([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [referralTrial, setReferralTrial] = useState<Outcom | null>(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isCreateTrialModalOpen, setIsCreateTrialModalOpen] = useState(false);
  const [inspectedTx, setInspectedTx] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    if (!program) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await program.account.trialAccount.all();
        if (cancelled) return;
        setTrials(rows.map((row: any) => mapTrial(row.account, row.publicKey)));
      } catch (e) {
        console.error("fetch trials", e);
        if (!cancelled) setTrials([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [program, location.pathname]);

  const handleSelectTrial = (trial: Outcom) => {
    navigate(`/trials/${trial.id}`);
  };

  const handleOpenReferral = (trial: Outcom) => {
    setReferralTrial(trial);
    setIsReferralModalOpen(true);
  };

  const handleCommitToTrial = (_trial: Outcom) => {
    /* startTrial already runs inside TrialDetailView */
  };

  const handleSubmitEvidenceNav = (trial: Outcom) => {
    navigate(`/trials/${trial.id}/submit`);
  };

  const handleCompleteSubmission = (submission: SubmissionData) => {
    navigate(`/trials/${submission.trialId}/verification`);
  };

  return (
    <div className="min-h-screen bg-[#090A0C] text-[#D1D5DB] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white">
      <Navbar
        onNavigate={(tab) => {
          if (tab === "landing") navigate("/");
          else if (tab === "discover") navigate("/discover");
          else if (tab === "workspace") navigate("/work-trials");
          else if (tab === "employer") navigate("/employer");
          else if (tab === "reputation") navigate("/reputation");
        }}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenSearch={() => navigate("/discover")}
        onOpenCreateTrial={() => setIsCreateTrialModalOpen(true)}
        notifications={[]}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <LandingView
                trials={trials}
                onSelectTrial={handleSelectTrial}
                onExploreTrials={() => navigate("/discover")}
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
                onViewVerification={(t) =>
                  navigate(`/trials/${t.id}/verification`)
                }
                onExploreTrials={() => navigate("/discover")}
              />
            }
          />
          <Route path="/workspace" element={<Navigate to="/work-trials" replace />} />
          <Route
            path="/trials/:trialId"
            element={
              <TrialDetailRoute
                onCommitTrial={handleCommitToTrial}
                onOpenReferral={handleOpenReferral}
                onSubmitEvidenceNav={handleSubmitEvidenceNav}
              />
            }
          />
          <Route
            path="/trials/:trialId/submit"
            element={<SubmissionRoute onSubmit={handleCompleteSubmission} />}
          />
          <Route
            path="/trials/:trialId/verification"
            element={
              <VerificationRoute
                onOpenTransactionDetails={(tx) => setInspectedTx(tx)}
              />
            }
          />
          <Route
            path="/reputation"
            element={
              <ReputationView
                wallet={wallet}
                timeline={[]}
                onOpenTx={(tx) => setInspectedTx(tx)}
              />
            }
          />
          <Route
            path="/employer"
            element={
              <EmployerDashboard
                trials={trials}
                applicants={[]}
                wallet={wallet}
                onOpenCreateTrial={() => setIsCreateTrialModalOpen(true)}
                onSelectTrial={handleSelectTrial}
                onViewApplicant={() => navigate("/reputation")}
              />
            }
          />
          <Route path="/employer-hub" element={<Navigate to="/employer" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={async () => {
          try {
            if (adapterWallet) await connect();
            else setAdapterWalletModalVisible(true);
          } catch {
            setAdapterWalletModalVisible(true);
          }
          setIsWalletModalOpen(false);
        }}
        onDisconnect={async () => {
          await disconnect();
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
        />
      )}

      <CreateTrialModal
        isOpen={isCreateTrialModalOpen}
        onClose={() => setIsCreateTrialModalOpen(false)}
      />

      {inspectedTx && (
        <TransactionModal
          isOpen
          onClose={() => setInspectedTx(null)}
          txHash={inspectedTx}
        />
      )}


      <footer className="border-t border-[#24282D] bg-[#090A0C] py-2 text-xs text-[#9CA3AF] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-white font-semibold tracking-tight">
              <span>Outcom.</span>
            </div>
            <span className="text-[#6B7280]">|</span>
            <span className="font-mono text-[11px] mt-1">Outcome-Based Hiring Protocol</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Powered by </span>
            <div>
              <img src="/solana.png" alt="Solana" className="w-35 h-18"/>
            </div>
            <div className="">
              <img src="https://genlayer.com/brand/genlayer-logo-white.svg" alt="Genlayer Logo" className="w-22 h-8"/>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}