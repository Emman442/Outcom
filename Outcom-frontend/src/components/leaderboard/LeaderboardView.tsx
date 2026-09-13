import React, { useState } from 'react';
import { CandidateApplicant } from '../../types';
import { UsdcDisplay } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ShieldCheck, Trophy, ArrowUpRight, Search } from 'lucide-react';

interface LeaderboardViewProps {
  candidates: CandidateApplicant[];
  onSelectCandidate: (candidate: CandidateApplicant) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  candidates = [],
  onSelectCandidate,
}) => {
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const safeCandidates = candidates || [];

  const filtered = safeCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.skills || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#24282D] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0052FF]">
              Global Protocol Rankings
            </span>
            <span className="text-[#6B7280]">•</span>
            <span className="text-xs text-[#9CA3AF] font-mono">Proof of Work</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Top Talent
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
            Builders ranked by verified deliverables completed, on-chain USDC earned, and composite reputation.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 bg-[#121417] p-1 rounded-lg border border-[#24282D]">
          {(['all', 'monthly', 'weekly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded text-xs font-mono capitalize transition-colors cursor-pointer ${
                timeframe === t
                  ? 'bg-[#181B20] text-white font-medium border border-[#24282D]'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {t === 'all' ? 'All-Time' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input for Talent */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by name, handle, or skill (e.g. Rust, Anchor, TypeScript)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0D0F12] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#6B7280]"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0D0F12] border border-[#24282D] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#121417] text-[#9CA3AF] font-mono text-xs border-b border-[#24282D]">
              <tr>
                <th className="py-3 px-4 font-medium w-16 text-center">Rank</th>
                <th className="py-3 px-4 font-medium">Creator</th>
                <th className="py-3 px-4 font-medium">Verified Outcomes</th>
                <th className="py-3 px-4 font-medium">USDC Earned</th>
                <th className="py-3 px-4 font-medium">Success Rate</th>
                <th className="py-3 px-4 font-medium text-right">Reputation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24282D] bg-[#090A0C]">
              {filtered.map((candidate, idx) => {
                const rank = idx + 1;
                const isTopThree = rank <= 3;

                return (
                  <tr
                    key={candidate.id}
                    onClick={() => onSelectCandidate(candidate)}
                    className="hover:bg-[#121417] transition-colors cursor-pointer group"
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`font-mono font-bold text-xs inline-flex items-center justify-center w-7 h-7 rounded-lg ${
                          rank === 1
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                            : rank === 2
                            ? 'bg-[#9CA3AF]/15 text-[#E5E7EB] border border-[#9CA3AF]/30'
                            : rank === 3
                            ? 'bg-[#B45309]/15 text-[#D97706] border border-[#B45309]/30'
                            : 'text-[#6B7280]'
                        }`}
                      >
                        #{rank}
                      </span>
                    </td>

                    {/* Creator Identity */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#24282D] flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white group-hover:text-[#3B82F6] transition-colors truncate">
                              {candidate.name}
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF] flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-mono mt-0.5">
                            <span>{candidate.username}</span>
                            <span>•</span>
                            <span className="text-[#6B7280]">{candidate.walletAddress}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Verified Outcomes */}
                    <td className="py-4 px-4 font-mono">
                      <span className="text-white font-semibold">
                        {candidate.verifiedTrialsCount}
                      </span>
                      <span className="text-[#9CA3AF] text-xs ml-1">trials</span>
                    </td>

                    {/* USDC Earned with USDC Logo */}
                    <td className="py-4 px-4">
                      <UsdcDisplay amount={candidate.earnedUsdc} size="sm" />
                    </td>

                    {/* Success Rate */}
                    <td className="py-4 px-4 font-mono">
                      <span className="text-[#10B981] font-semibold">{candidate.successRate}%</span>
                    </td>

                    {/* Reputation Score */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-white bg-[#121417] px-2.5 py-1 rounded-lg border border-[#24282D]">
                          {candidate.reputationScore}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-white transition-colors" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
