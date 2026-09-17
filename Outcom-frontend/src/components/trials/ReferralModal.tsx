import React, { useState } from 'react';
import { Outcom } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Send, AlertCircle, Check } from 'lucide-react';
import { useProgram } from '@/src/hooks/solana/use-program';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  trial: Outcom | null;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  trial,
}) => {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [candidateAddress, setCandidateAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!trial) return null;

  const handleReset = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setCandidateAddress('');
    setMessage('');
    setError(null);
    onClose();
  };

  const handleRefer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program || !publicKey || !trial) return;

    let candidatePk: PublicKey;
    try {
      candidatePk = new PublicKey(candidateAddress.trim());
    } catch {
      setError('Enter a valid Solana wallet address');
      return;
    }

    const trialKey = trial.id; // mapTrial stored trialId as id
    if (!trialKey) {
      setError('Missing trial id');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const [trialPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('Trial'),
          new PublicKey(trial.company).toBuffer(),
          Buffer.from(trialKey),
        ],
        program.programId
      );

      await program.methods
        .referCandidate(candidatePk, message || 'referred')
        .accountsPartial({
          referrer: publicKey,
          trialAccount: trialPda,
        })
        .rpc();
      setIsSuccess(true);
    } catch (err) {
      console.error('referCandidate failed', err);
      setError(err instanceof Error ? err.message : 'Referral failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Refer a candidate"
      subtitle="Know someone who can do this work?"
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-white">Referral Registered On-Chain</h4>
          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg inline-flex items-center gap-2">
            <span className="text-xs text-[#9CA3AF]">Pending reward:</span>
            <UsdcDisplay amount={trial.referralReward} size="md" />
          </div>
          <Button variant="secondary" onClick={handleReset} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleRefer} className="space-y-4">
          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg flex items-center justify-between">
            <div className="min-w-0 pr-3">
              <span className="text-[10px] font-mono uppercase text-[#6B7280]">Target Trial</span>
              <div className="text-xs font-semibold text-white truncate">{trial.title}</div>
            </div>
            <UsdcDisplay amount={trial.referralReward} size="sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
              Candidate Solana Wallet
            </label>
            <input
              type="text"
              required
              placeholder="Base58 public key"
              value={candidateAddress}
              onChange={(e) => setCandidateAddress(e.target.value)}
              className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-[#6B7280]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
              Optional Note
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3 py-2 text-xs text-white resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg flex items-start gap-2 text-xs text-[#EF4444]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-[#181B20]/70 border border-[#24282D] rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              You receive the referral reward only if the candidate passes verification.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Send Referral
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};