import React, { useState, useEffect } from 'react';
import { Outcom, UserWallet, SubmissionData } from '../../types';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { SolanaIcon } from '../common/NetworkIcons';
import {
  ChevronLeft,
  Github,
  Globe,
  Link2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Cpu,
} from 'lucide-react';
import { toast } from 'sonner';
import { PublicKey } from '@solana/web3.js';
import { useProgram } from '@/src/hooks/solana/use-program';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import { mapTrial } from '../trials/TrialDetailView';
import { truncateAddress } from '@/src/utils/truncateAddress';

interface SubmissionViewProps {
  onBack: () => void;
  onSubmit: (submission: SubmissionData) => void;
}

export const SubmissionView: React.FC<SubmissionViewProps> = ({
  onBack,
  onSubmit,
}) => {

  const [trial, setTrial] = useState<Outcom | null>(null);
  const [repositoryUrl, setRepositoryUrl] = useState('https://github.com/alex-developer/solana-usdc-pay');
  const [deploymentUrl, setDeploymentUrl] = useState('https://solana-usdc-pay.vercel.app');
  const [documentationUrl, setDocumentationUrl] = useState('https://github.com/alex-developer/solana-usdc-pay#readme');
  const [commitHash, setCommitHash] = useState('8f29a7c419be');
  const [notes, setNotes] = useState(
    'Implemented clean Anchor CPI calls, verified token decimals with SPL mint address, included devnet settlement tests and receipt download UI.'
  );
  const [isLoading, setIsLoading] = useState(false)
  const { program } = useProgram()
  const { publicKey } = useWallet()
  const RELAYER = import.meta.env.VITE_RELAYER_URL;
  const { trialId } = useParams<{ trialId: string }>();


  useEffect(() => {
    if (!program || !trialId) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const rows = await program?.account.trialAccount.all();
        const row = rows?.find((r: any) => r.account.trialId === trialId);
        console.log(row)

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


  const [evidenceLinks, setEvidenceLinks] = useState<
    { title: string; url: string; type: 'github' | 'deployment' | 'tx' | 'video' | 'docs' }[]
  >([
    {
      title: 'Devnet Settlement Transaction',
      url: 'https://explorer.solana.com/tx/5KpM9vW2Z7xQ4tR6uY8nC1bZ0eA3dE5gH7jK9mP8sQ?cluster=devnet',
      type: 'tx',
    },
  ]);

  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceUrl, setNewEvidenceUrl] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState<'tx' | 'video' | 'docs' | 'github'>('tx');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToVerification, setAgreedToVerification] = useState(true);

  const handleAddEvidence = () => {
    if (!newEvidenceTitle.trim() || !newEvidenceUrl.trim()) return;
    setEvidenceLinks([
      ...evidenceLinks,
      { title: newEvidenceTitle, url: newEvidenceUrl, type: newEvidenceType },
    ]);
    setNewEvidenceTitle('');
    setNewEvidenceUrl('');
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceLinks(evidenceLinks.filter((_, i) => i !== index));
  };


  console.log(trial)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repositoryUrl.trim() || !deploymentUrl.trim()) return;
    if (!publicKey || !program) {
      toast.error("Connect a Solana wallet");
      return;
    }
    if (!agreedToVerification) return;


    console.log(repositoryUrl, deploymentUrl)

    setIsSubmitting(true);
    try {
      const employer = new PublicKey(trial.company);
      const [trialPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("Trial"), employer.toBuffer(), Buffer.from(trial.id)],
        program.programId
      );

      let referrer = "";
      try {
        const [referralPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("Referral"),
            trialPda.toBuffer(),
            publicKey.toBuffer(),
          ],
          program?.programId
        );
        const rec = await program?.account.referral.fetch(referralPda);
        referrer = rec.referrer.toBase58();
      } catch {
        referrer = "";
      }

      const extraUrl =
        documentationUrl.trim() ||
        evidenceLinks.find((l) => l.url.startsWith("http"))?.url ||
        "";

        console.log("Extra url", extraUrl)
      const res = await fetch(`${RELAYER}/submit-and-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trialId: trial?.id,
          candidate: publicKey.toBase58(),
          referrer,
          githubRepoUrl: repositoryUrl.trim(),
          deployedAppUrl: deploymentUrl.trim(),
          extraUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || `submit failed (${res.status})`);
      }

      toast.success("Evidence sent to GenLayer");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "submit_and_verify failed");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-[#121417]"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Trial Details</span>
      </button>

      {/* Flow Step Progress Bar */}
      <div className="p-3.5 bg-[#0D0F12] border border-[#24282D] rounded-xl flex items-center justify-between text-xs font-mono text-[#9CA3AF] overflow-x-auto gap-2">
        <div className="flex items-center gap-2 text-[#10B981] whitespace-nowrap">
          <span className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[11px] font-bold">✓</span>
          <span>1. Work Trial Spec & DoD</span>
        </div>
        <span className="text-[#38404B]">→</span>
        <div className="flex items-center gap-2 text-white font-semibold whitespace-nowrap bg-[#181B20] px-2.5 py-1 rounded border border-[#0052FF]">
          <span className="w-5 h-5 rounded-full bg-[#0052FF] text-white flex items-center justify-center text-[11px] font-bold">2</span>
          <span>2. Evidence Submission</span>
        </div>
        <span className="text-[#38404B]">→</span>
        <div className="flex items-center gap-2 whitespace-nowrap text-[#6B7280]">
          <span className="w-5 h-5 rounded-full bg-[#121417] border border-[#24282D] flex items-center justify-center text-[11px]">3</span>
          <span>3. Protocol/AI Verification</span>
        </div>
        <span className="text-[#38404B]">→</span>
        <div className="flex items-center gap-2 whitespace-nowrap text-[#6B7280]">
          <span className="w-5 h-5 rounded-full bg-[#121417] border border-[#24282D] flex items-center justify-center text-[11px]">4</span>
          <span>4. Settlement & Reputation</span>
        </div>
      </div>

      {/* Trial Summary Banner */}
      <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-mono">
            <span>Outcom Submission</span>
            <span>•</span>
            <span>ID: {trial.id}</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">{trial.title}</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">Assigned to: {trial.selectedCandidate}</p>
        </div>

        <div className="text-right flex-shrink-0 bg-[#121417] p-3 rounded-lg border border-[#24282D]">
          <span className="text-[10px] font-mono uppercase text-[#9CA3AF] block mb-0.5">
            Claimable Reward
          </span>
          <UsdcDisplay amount={trial.candidateReward} size="md" />
        </div>
      </div>

      {/* Evaluation Protocol Notice */}
      <div className="p-4 bg-[#121417] border border-[#0052FF]/30 rounded-xl flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#0052FF]/10 text-[#3B82F6] flex-shrink-0 mt-0.5">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Deterministic Protocol Evaluation
          </h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            The Outcom protocol evaluates evidence against predefined requirements. Submitted repositories, deployments, and on-chain receipts are deterministically parsed by oracles and AI scoring agents to verify outcome completion before releasing escrow funds.
          </p>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Section 1: Repository & Code */}
        <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#24282D] pb-3">
            <Github className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">Repository & Source Code</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
                GitHub Repository URL <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/user/repo"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-[#6B7280]"
              />
              <p className="text-[11px] text-[#6B7280] mt-1">
                Repository must be public and include full commit history.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
                Target Commit Hash
              </label>
              <input
                type="text"
                placeholder="e.g. 8f29a7c"
                value={commitHash}
                onChange={(e) => setCommitHash(e.target.value)}
                className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-[#6B7280]"
              />
              <p className="text-[11px] text-[#6B7280] mt-1">Locks inspection to commit.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Live Deployment */}
        <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#24282D] pb-3">
            <Globe className="w-4 h-4 text-[#0052FF]" />
            <h3 className="text-sm font-semibold text-white">Live Application Deployment</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
              Deployed Application URL <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://your-trial-project.vercel.app"
              value={deploymentUrl}
              onChange={(e) => setDeploymentUrl(e.target.value)}
              className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-[#6B7280]"
            />
            <p className="text-[11px] text-[#6B7280] mt-1">
              Live web endpoint reachable by the automated browser & RPC verifiers.
            </p>
          </div>

          {/* <div>
            <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
              Documentation / README URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://docs.example.com or GitHub README link"
              value={documentationUrl}
              onChange={(e) => setDocumentationUrl(e.target.value)}
              className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-[#6B7280]"
            />
          </div> */}
        </div>

        {/* Section 3: Evidence & Supporting Proof */}
        <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#24282D] pb-3">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-semibold text-white">Supporting Evidence & Proof</h3>
            </div>
            <span className="text-xs text-[#9CA3AF] font-mono">Transaction, Benchmarks, e.t.c</span>
          </div>

          {/* Existing Links List */}
          <div className="space-y-2">
            {evidenceLinks.map((link, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#121417] border border-[#24282D] rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#181B20] text-[#9CA3AF] border border-[#24282D]">
                    {link.type}
                  </span>
                  <div className="min-w-0">
                    <span className="text-white font-medium block truncate">{link.title}</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3B82F6] font-mono truncate hover:underline block text-[11px]"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveEvidence(idx)}
                  className="p-1 text-[#9CA3AF] hover:text-[#EF4444] rounded hover:bg-[#181B20] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Link Row */}
          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg space-y-2.5">
            <span className="text-xs font-medium text-[#D1D5DB] block">Attach Additional Proof</span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Evidence Label (e.g. Solana Tx Signature)"
                value={newEvidenceTitle}
                onChange={(e) => setNewEvidenceTitle(e.target.value)}
                className="sm:col-span-4 bg-[#0D0F12] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-md px-3 py-1.5 text-xs text-white placeholder:text-[#6B7280]"
              />
              <input
                type="url"
                placeholder="URL or Solscan Transaction link"
                value={newEvidenceUrl}
                onChange={(e) => setNewEvidenceUrl(e.target.value)}
                className="sm:col-span-6 bg-[#0D0F12] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-md px-3 py-1.5 text-xs text-white font-mono placeholder:text-[#6B7280]"
              />
              <Button
                type="button"
                variant="secondary"
                size="xs"
                onClick={handleAddEvidence}
                icon={<Plus className="w-3 h-3" />}
                className="sm:col-span-2"
              >
                Add Link
              </Button>
            </div>
          </div>
        </div>

        {/* Section 4: Implementation Notes */}
        <div className="p-5 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3">
          <label className="block text-xs font-semibold text-[#D1D5DB]">
            Candidate Implementation Notes & Summary
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg p-3 text-xs text-white placeholder:text-[#6B7280] resize-none"
            placeholder="Summarize key architectural decisions, test results, or instructions for verifiers..."
          />
        </div>

        {/* Pre-submission Verification Checklist */}
        <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl space-y-3">
          <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono block">
            Pre-flight Protocol Checklist
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#9CA3AF]">
            {trial.definitionOfDone.slice(0, 4).map((dod) => (
              <div key={dod.id} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                <span className="truncate">{dod.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#24282D] flex items-center gap-2">
            <input
              type="checkbox"
              id="confirmAgreement"
              checked={agreedToVerification}
              onChange={(e) => setAgreedToVerification(e.target.checked)}
              className="rounded bg-[#181B20] border-[#24282D] text-[#0052FF] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="confirmAgreement" className="text-xs text-[#D1D5DB] cursor-pointer">
              I verify this work is my original implementation and fulfills all trial specifications.
            </label>
          </div>
        </div>

        {/* Submission CTAs */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <SolanaIcon className="w-3.5 h-3.5" />
            <span>Signing with: <span className="font-mono text-white">{truncateAddress(publicKey!?.toString())}</span></span>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="md" onClick={onBack}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              disabled={!agreedToVerification}
            >
              Submit for Verification
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
