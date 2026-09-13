import React, { useState } from 'react';
import { UserWallet } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UsdcDisplay } from '../common/UsdcIcon';
import { SolanaIcon } from '../common/NetworkIcons';
import { Copy, ExternalLink, Check, LogOut, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  onDisconnect: () => void;
  onConnect: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onDisconnect,
  onConnect,
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!wallet.address) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = wallet.address
    ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`
    : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={wallet.isConnected ? 'Solana Wallet' : 'Connect Wallet'}
      subtitle={wallet.isConnected ? 'Connected via Phantom (Solana)' : 'Choose your preferred Solana wallet'}
      maxWidth="md"
    >
      {!wallet.isConnected ? (
        <div className="space-y-3">
          <p className="text-sm text-[#9CA3AF]">
            Connect your Solana wallet to accept work trials, submit proof of work, and receive automated USDC payouts.
          </p>

          <div className="grid grid-cols-1 gap-2 pt-2">
            {[
              { name: 'Phantom', desc: 'Solana native browser wallet', badge: 'Detected' },
              { name: 'Solflare', desc: 'Non-custodial Solana wallet', badge: 'Popular' },
              { name: 'Backpack', desc: 'xNFT & Solana protocol wallet', badge: 'Fast' },
            ].map((w) => (
              <button
                key={w.name}
                onClick={() => {
                  onConnect();
                  onClose();
                }}
                className="flex items-center justify-between p-3.5 rounded-lg bg-[#121417] hover:bg-[#181B20] border border-[#24282D] hover:border-[#3A414A] transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1B1F24] border border-[#2E333B] flex items-center justify-center text-xs font-mono font-bold text-[#0052FF]">
                    {w.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-[#3B82F6] transition-colors">
                      {w.name}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">{w.desc}</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1C2026] text-[#9CA3AF] border border-[#282D35]">
                  {w.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2 text-xs text-[#6B7280] text-center">
            By connecting, you authorize WorkTrial smart contracts to interact with your public key for escrow verification.
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Address & Network Bar */}
          <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs text-[#9CA3AF]">{wallet.network}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-white px-2 py-1 rounded bg-[#181B20] border border-[#24282D] transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                  <span className="font-mono text-[11px]">{copied ? 'Copied' : shortAddress}</span>
                </button>
                <a
                  href={`https://solscan.io/account/${wallet.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-[#9CA3AF] hover:text-white rounded hover:bg-[#181B20] transition-colors"
                  title="View on Solscan"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-lg">
              <div className="text-xs text-[#9CA3AF] mb-1 font-medium">USDC Balance</div>
              <UsdcDisplay amount={wallet.usdcBalance} size="md" />
              <div className="text-[11px] text-[#6B7280] mt-1 font-mono">SPL Token • 6 Decimals</div>
            </div>

            <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-lg">
              <div className="text-xs text-[#9CA3AF] mb-1 font-medium flex items-center justify-between">
                <span>SOL Balance</span>
                <SolanaIcon className="w-3 h-3 opacity-80" />
              </div>
              <div className="text-base font-semibold font-mono text-white">
                {wallet.solBalance.toFixed(2)} <span className="text-xs font-sans text-[#9CA3AF]">SOL</span>
              </div>
              <div className="text-[11px] text-[#6B7280] mt-1">For network gas & rent</div>
            </div>
          </div>

          {/* Reputation Snippet */}
          <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0052FF]/10 border border-[#0052FF]/30 flex items-center justify-center text-[#3B82F6]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-white">Protocol Reputation Score</div>
                <div className="text-[11px] text-[#9CA3AF]">14 verified trial outcomes on-chain</div>
              </div>
            </div>
            <div className="font-mono text-base font-bold text-white bg-[#181B20] px-2.5 py-1 rounded border border-[#24282D]">
              {wallet.reputationScore}
            </div>
          </div>

          {/* Recent WorkTrial Transactions */}
          <div>
            <div className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              Recent Protocol Activity
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-[#121417] border border-[#24282D]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span className="text-white font-medium">Trial Escrow Released</span>
                  <span className="text-[#6B7280] font-mono text-[11px]">wt-sol-01</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UsdcDisplay amount={450} size="xs" />
                  <ArrowUpRight className="w-3 h-3 text-[#9CA3AF]" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#121417] border border-[#24282D]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-white font-medium">Referral Bounty Paid</span>
                  <span className="text-[#6B7280] font-mono text-[11px]">ref-8f29</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UsdcDisplay amount={50} size="xs" />
                  <ArrowUpRight className="w-3 h-3 text-[#9CA3AF]" />
                </div>
              </div>
            </div>
          </div>

          {/* Disconnect Action */}
          <div className="pt-2 flex justify-between items-center border-t border-[#24282D]">
            <a
              href={`https://solscan.io/account/${wallet.address}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1"
            >
              <span>View full ledger</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              variant="outline"
              size="sm"
              icon={<LogOut className="w-3.5 h-3.5 text-[#EF4444]" />}
              onClick={() => {
                onDisconnect();
                onClose();
              }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
