import React from 'react';
import { Outcom } from '../../types';
import { UsdcDisplay } from '../common/UsdcIcon';
import { DifficultyBadge } from '../common/Badge';
import { SolanaIcon, LayerZeroIcon } from '../common/NetworkIcons';
import { CheckCircle, Clock, Users, ArrowUpRight } from 'lucide-react';
import { truncateAddress } from '@/src/utils/truncateAddress';

interface TrialCardProps {
  trial: Outcom;
  onSelect: (trial: Outcom) => void;
  onRefer?: (trial: Outcom) => void;
}

export const TrialCard: React.FC<TrialCardProps> = ({ trial, onSelect, onRefer }) => {
  console.log(trial)
  return (
    <div
      onClick={() => onSelect(trial)}
      className="group relative bg-[#0D0F12] hover:bg-[#121417] border border-[#24282D] hover:border-[#38404B] rounded-xl p-5 transition-all duration-150 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Header: Company & Network */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={trial.companyLogo}
              alt={trial.company}
              className="w-8 h-8 rounded-lg object-cover border border-[#24282D] flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#D1D5DB] truncate">
                  {truncateAddress(trial.company)}
                </span>
                {trial.isCompanyVerified && (
                  <CheckCircle className="w-3.5 h-3.5 text-[#0052FF] flex-shrink-0" />
                )}
              </div>
              <span className="text-[11px] text-[#9CA3AF] font-mono block">
                {trial.category}
              </span>
            </div>
          </div>

        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-white tracking-tight group-hover:text-[#3B82F6] transition-colors line-clamp-1 mb-1.5">
          {trial.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed mb-4">
          {trial.description}
        </p>

        {/* Skills Tag Row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {trial.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181B20] text-[#9CA3AF] border border-[#24282D]"
            >
              {skill}
            </span>
          ))}
          {trial.skills.length > 4 && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 text-[#6B7280]">
              +{trial.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metadata & Reward Row */}
      <div className="pt-3 border-t border-[#24282D]/80 flex items-center justify-between mt-auto">
        {/* USDC Reward with Authentic USDC logo beside the amount */}
        <div>
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF] mb-0.5">
            Total Reward
          </div>
          <UsdcDisplay amount={trial.totalReward} size="md" />
        </div>

        {/* Status / Applicants / Action */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            {/* <div className="flex items-center justify-end gap-1 text-[11px] text-[#9CA3AF] font-mono">
              <Clock className="w-3 h-3" />
              <span>{trial.deadline}</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-[11px] text-[#6B7280]">
              <Users className="w-3 h-3" />
              <span>{trial.applicantsCount || 0} applicants</span>
            </div> */}
          </div>

          <DifficultyBadge difficulty={trial.difficulty} />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(trial);
            }}
            className="p-2 rounded-lg bg-[#181B20] hover:bg-[#0052FF] text-[#9CA3AF] hover:text-white border border-[#24282D] hover:border-[#0052FF] transition-all cursor-pointer"
            aria-label="View Trial"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
