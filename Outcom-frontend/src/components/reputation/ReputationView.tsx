import React, { useState } from 'react';
import { UserWallet, ReputationEvent } from '../../types';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SolanaIcon } from '../common/NetworkIcons';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Award,
  TrendingUp,
  Download,
  Share2,
  Calendar,
  Lock,
} from 'lucide-react';

interface ReputationViewProps {
  wallet: UserWallet;
  timeline: ReputationEvent[];
  onOpenTx: (txHash: string) => void;
}

export const ReputationView: React.FC<ReputationViewProps> = ({
  wallet,
  timeline,
  onOpenTx,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCredentialModal, setShowCredentialModal] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="border-b border-[#24282D] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Verified Reputation
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
            Immutable, outcome-based hiring credentials stored on Solana and portable across the Web3 ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCredentialModal(true)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Credential
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCredentialModal(true)}
            icon={<Share2 className="w-3.5 h-3.5" />}
          >
            Share Profile
          </Button>
        </div>
      </div>

      {/* Candidate Profile Card */}
      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Elena Rostova"
              className="w-16 h-16 rounded-xl object-cover border border-[#24282D]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] border-2 border-[#0D0F12] flex items-center justify-center text-[10px] text-white">
              ✓
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Elena Rostova</h2>
              <Badge variant="blue" size="xs">
                <CheckCircle className="w-3 h-3 text-[#3B82F6]" /> Verified Protocol Builder
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mt-1">
              <span className="font-mono text-[#D1D5DB]">@elena_sol</span>
              <span>•</span>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1 font-mono text-[#9CA3AF] hover:text-white transition-colors"
              >
                <span>{shortAddress}</span>
                {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Reputation Score Badge Box */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#121417] border border-[#24282D]">
          <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/30 flex items-center justify-center text-[#3B82F6]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF] block">
              Current Reputation
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              94 <span className="text-xs font-sans text-[#9CA3AF] font-normal">Reputation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quad Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block mb-1">
            Verified Work Trials
          </span>
          <div className="text-2xl font-bold font-mono text-white">18</div>
          <span className="text-[11px] text-[#6B7280] mt-1 block">Completed & verified</span>
        </div>

        <div className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block mb-1">
            Successful Outcomes
          </span>
          <div className="text-2xl font-bold font-mono text-[#10B981]">14</div>
          <span className="text-[11px] text-[#6B7280] mt-1 block">100% acceptance grade</span>
        </div>

        <div className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block mb-1">
            USDC Earned
          </span>
          <UsdcDisplay amount={8420} size="lg" />
          <span className="text-[11px] text-[#6B7280] mt-1 block">Distributed through Solana</span>
        </div>

        <div className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] block mb-1">
            Success Rate
          </span>
          <div className="text-2xl font-bold font-mono text-white">78%</div>
          <span className="text-[11px] text-[#6B7280] mt-1 block">Top 3% protocol tier</span>
        </div>
      </div>

      {/* Reputation Timeline */}
      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#24282D] pb-4">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Reputation Timeline
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Chronological history of verified work outcomes locked to this wallet
            </p>
          </div>
          <span className="text-xs text-[#6B7280] font-mono">{timeline.length} Total Records</span>
        </div>

        <div className="relative border-l border-[#24282D] ml-4 pl-6 space-y-6">
          {timeline.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#121417] border-2 border-[#0052FF] group-hover:bg-[#0052FF] transition-colors" />

              <div className="p-4 rounded-xl bg-[#121417] border border-[#24282D] hover:border-[#3A414A] transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#10B981] font-mono flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                      <span className="text-xs text-[#6B7280]">•</span>
                      <span className="text-xs text-[#9CA3AF]">{event.companyName}</span>
                      <span className="text-xs text-[#6B7280]">•</span>
                      <span className="text-xs text-[#6B7280] font-mono">{event.category}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white mt-1">
                      {event.trialTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <UsdcDisplay amount={event.usdcEarned} size="sm" />
                    <span className="text-xs font-mono font-bold text-[#10B981] px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30">
                      +{event.reputationDelta} reputation
                    </span>
                  </div>
                </div>

                {/* Metadata details */}
                <div className="flex items-center justify-between pt-2 border-t border-[#24282D]/70 text-xs text-[#9CA3AF] font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {event.date}
                  </span>
                  <span>ID: {event.verificationId}</span>
                  <button
                    onClick={() => onOpenTx(event.txHash)}
                    className="text-[#3B82F6] hover:underline flex items-center gap-1"
                  >
                    <span>Tx: {event.txHash}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portable Reputation Section */}
      <div className="p-6 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0052FF]/10 text-[#3B82F6] border border-[#0052FF]/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Your reputation belongs to you.
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5 max-w-2xl leading-relaxed">
              Verified work outcomes are tied to your on-chain identity so your track record can be used across future opportunities, DAO applications, and protocol grants without relying on centralized platform gatekeepers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg">
            <span className="text-[#6B7280] font-mono text-[10px] uppercase block">Wallet</span>
            <span className="font-mono text-white text-xs font-semibold mt-0.5 block truncate">
              {wallet.address}
            </span>
          </div>

          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg">
            <span className="text-[#6B7280] font-mono text-[10px] uppercase block">Verified Outcomes</span>
            <span className="font-mono text-white text-xs font-semibold mt-0.5 block">
              18 Proven Deliverables
            </span>
          </div>

          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg">
            <span className="text-[#6B7280] font-mono text-[10px] uppercase block">Protocol Score</span>
            <span className="font-mono text-white text-xs font-semibold mt-0.5 block">
              94 Composite Index
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCredentialModal(true)}
            icon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            View Reputation Record
          </Button>
        </div>
      </div>

      {/* Verifiable Credential Modal */}
      <Modal
        isOpen={showCredentialModal}
        onClose={() => setShowCredentialModal(false)}
        title="On-Chain Credential Record"
        subtitle="WorkTrial Cryptographic Proof v1"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 bg-[#090A0C] border border-[#24282D] rounded-lg text-[#9CA3AF] space-y-2 leading-relaxed">
            <div className="text-[#10B981] font-semibold">// SOLANA PROTOCOL VERIFIABLE ATTESTATION</div>
            <div>"issuer": "WorkTrial_Protocol_Oracles_v1.2",</div>
            <div>"holder": "{wallet.address}",</div>
            <div>"reputationScore": 94,</div>
            <div>"verifiedTrialsCount": 18,</div>
            <div>"usdcDistributed": 8420.00,</div>
            <div>"signature": "3kQ9rF...8sXz41aV0pL29wR",</div>
            <div>"merkleRoot": "0x8f29a7c419be00c7e2f5b891ac34891b2c4e61f9",</div>
            <div>"layerZeroCrossChainProof": "LZv2_ENDPOINT_BASE_SEPOLIA"</div>
          </div>

          <p className="text-[#9CA3AF] text-xs font-sans">
            This signed attestation is cryptographically verifiable by any third-party application, DAO, or smart contract.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowCredentialModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => {
                alert('Credential JSON exported to clipboard!');
                setShowCredentialModal(false);
              }}
            >
              Copy JSON Proof
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
