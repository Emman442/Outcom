import React, { useState } from 'react';
import { WorkTrial, UserWallet } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UsdcDisplay } from '../common/UsdcIcon';
import { SolanaIcon } from '../common/NetworkIcons';
import { Copy, Check, Send, AlertCircle, Share2 } from 'lucide-react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  trial: WorkTrial | null;
  wallet: UserWallet;
  onSendReferral?: (candidateAddress: string, message: string) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  trial,
  wallet,
  onSendReferral,
}) => {
  const [candidateAddress, setCandidateAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!trial) return null;

  const referralUrl = `https://worktrial.protocol/trial/${trial.id}?ref=${wallet.address.slice(0, 8)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateAddress.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSendReferral) {
        onSendReferral(candidateAddress, message);
      }
    }, 900);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCandidateAddress('');
    setMessage('');
    onClose();
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
          <div>
            <h4 className="text-base font-semibold text-white">Referral Registered On-Chain</h4>
            <p className="text-xs text-[#9CA3AF] mt-1 max-w-sm mx-auto">
              Your referrer address was committed to the trial escrow contract. If this candidate successfully completes the outcome verification, you will automatically receive:
            </p>
          </div>

          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg inline-flex items-center gap-2">
            <span className="text-xs text-[#9CA3AF]">Your Pending Referral Reward:</span>
            <UsdcDisplay amount={trial.referralReward} size="md" />
          </div>

          <div className="pt-2">
            <Button variant="secondary" onClick={handleReset} className="w-full">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trial Context Banner */}
          <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg flex items-center justify-between">
            <div className="min-w-0 pr-3">
              <span className="text-[10px] font-mono uppercase text-[#6B7280]">Target Trial</span>
              <div className="text-xs font-semibold text-white truncate">{trial.title}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[10px] font-mono uppercase text-[#9CA3AF]">Referral Reward</span>
              <UsdcDisplay amount={trial.referralReward} size="sm" />
            </div>
          </div>

          {/* Wallet / Profile input */}
          <div>
            <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
              Candidate Solana Wallet or Profile
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 7xK9...mP42 or @username"
              value={candidateAddress}
              onChange={(e) => setCandidateAddress(e.target.value)}
              className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white font-mono placeholder:text-[#6B7280]"
            />
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
              Optional Note / Recommendation
            </label>
            <textarea
              rows={2}
              placeholder="Add context on why this candidate is qualified for this trial..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#6B7280] resize-none"
            />
          </div>

          {/* Critical Explanation */}
          <div className="p-3 bg-[#181B20]/70 border border-[#24282D] rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              <strong className="text-white font-medium">Outcome-Based Incentive: </strong>
              You receive the referral reward only if the candidate completes the trial successfully and passes protocol verification.
            </p>
          </div>

          {/* Shareable Link Box */}
          <div className="pt-1">
            <div className="text-[11px] text-[#6B7280] mb-1 flex items-center justify-between">
              <span>Or share your unique referral link directly:</span>
              <Share2 className="w-3 h-3 text-[#6B7280]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#121417] border border-[#24282D] rounded-lg px-3 py-1.5 text-xs text-[#9CA3AF] font-mono truncate">
                {referralUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-[#181B20] hover:bg-[#20252C] border border-[#24282D] text-xs text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
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
