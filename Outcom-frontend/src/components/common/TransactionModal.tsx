import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { UsdcDisplay } from './UsdcIcon';
import { SolanaIcon, LayerZeroIcon } from './NetworkIcons';
import { CheckCircle2, Copy, Check, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  txHash,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Solana Transaction Inspector"
      subtitle="Mainnet-Beta Program Execution Receipt"
      maxWidth="lg"
    >
      <div className="space-y-4 font-mono text-xs">
        {/* Status Header */}
        <div className="p-3.5 bg-[#121417] border border-[#10B981]/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#10B981]">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold uppercase text-[11px]">Finalized (32 Confirmations)</span>
          </div>
          <span className="text-[#9CA3AF] text-[11px]">Slot #271,849,201</span>
        </div>

        {/* Signature Box */}
        <div className="p-3 bg-[#090A0C] border border-[#24282D] rounded-lg space-y-1">
          <span className="text-[#6B7280] text-[10px] uppercase">Signature</span>
          <div className="flex items-center justify-between text-[#3B82F6] break-all">
            <span>{txHash}</span>
            <button
              onClick={handleCopy}
              className="text-[#9CA3AF] hover:text-white p-1 ml-2 flex-shrink-0"
              title="Copy signature"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />}
            </button>
          </div>
        </div>

        {/* Program & Instruction Breakdown */}
        <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-lg space-y-3">
          <span className="text-[#D1D5DB] text-[11px] font-semibold block">
            Instructions Dispatched
          </span>

          <div className="space-y-2 text-[11px]">
            {/* Instruction 1: WorkTrial Anchor Program */}
            <div className="p-2.5 rounded bg-[#0D0F12] border border-[#24282D] space-y-1">
              <div className="flex items-center justify-between text-white font-semibold">
                <span>#1 WorkTrial::evaluate_and_release</span>
                <span className="text-[#10B981] text-[10px]">Success</span>
              </div>
              <div className="text-[#9CA3AF] text-[10px]">
                Program ID: <span className="text-white">WTriaL1111111111111111111111111111111111111</span>
              </div>
              <div className="text-[#9CA3AF] text-[10px]">
                Oracle Verdict ID: <span className="text-white">WT-8F29-4A91 (94/100)</span>
              </div>
            </div>

            {/* Instruction 2: SPL Token Transfer Candidate */}
            <div className="p-2.5 rounded bg-[#0D0F12] border border-[#24282D] space-y-1">
              <div className="flex items-center justify-between text-white font-semibold">
                <span>#2 SplToken::transfer_checked (Candidate Escrow Payout)</span>
                <span className="text-[#10B981] text-[10px]">Success</span>
              </div>
              <div className="flex items-center justify-between text-[#9CA3AF] text-[10px]">
                <span>Transferred:</span>
                <span className="text-white font-bold">450.000000 USDC</span>
              </div>
              <div className="text-[#9CA3AF] text-[10px] truncate">
                To Account: <span className="text-white">7xK9...mP42 (Elena Rostova)</span>
              </div>
            </div>

            {/* Instruction 3: SPL Token Transfer Referrer */}
            <div className="p-2.5 rounded bg-[#0D0F12] border border-[#24282D] space-y-1">
              <div className="flex items-center justify-between text-white font-semibold">
                <span>#3 SplToken::transfer_checked (Referrer Bounty)</span>
                <span className="text-[#10B981] text-[10px]">Success</span>
              </div>
              <div className="flex items-center justify-between text-[#9CA3AF] text-[10px]">
                <span>Transferred:</span>
                <span className="text-white font-bold">50.000000 USDC</span>
              </div>
              <div className="text-[#9CA3AF] text-[10px] truncate">
                To Account: <span className="text-white">4mR5...5vW1 (Alex Chen)</span>
              </div>
            </div>

            {/* Instruction 4: LayerZero OApp Send */}
            <div className="p-2.5 rounded bg-[#0D0F12] border border-[#24282D] space-y-1">
              <div className="flex items-center justify-between text-white font-semibold">
                <span className="flex items-center gap-1">
                  <LayerZeroIcon className="w-3 h-3" /> #4 LayerZero::send_verifiable_outcome
                </span>
                <span className="text-[#10B981] text-[10px]">Delivered</span>
              </div>
              <div className="text-[#9CA3AF] text-[10px]">
                Destination EID: <span className="text-white">30184 (Base Sepolia / Mainnet)</span>
              </div>
              <div className="text-[#9CA3AF] text-[10px] truncate">
                LZ Guid: <span className="text-white">0x8f29a7c419be00c7e2f5b891ac34891b2c4e61f9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <a
            href={`https://explorer.solana.com/tx/${txHash}?cluster=mainnet`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 font-sans"
          >
            <span>Open in Solana Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
