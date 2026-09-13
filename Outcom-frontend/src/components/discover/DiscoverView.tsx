import React, { useState, useMemo } from 'react';
import { Outcom, Difficulty } from '../../types';
import { TrialCard } from '../trials/TrialCard';
import { UsdcDisplay, UsdcIcon } from '../common/UsdcIcon';
import { Button } from '../common/Button';
import { SolanaIcon } from '../common/NetworkIcons';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Filter,
  X,
  Plus,
} from 'lucide-react';

interface DiscoverViewProps {
  trials: Outcom[];
  onSelectTrial: (trial: Outcom) => void;
  onOpenReferral: (trial: Outcom) => void;
  onCreateTrial: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  trials = [],
  onSelectTrial,
  onOpenReferral,
  onCreateTrial,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [minReward, setMinReward] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Smart Contracts', 'Full-Stack', 'Frontend', 'Protocol Engineering', 'Security & Audit'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const statuses = ['All', 'open', 'in_progress', 'verified'];

  const filteredTrials = useMemo(() => {
    const safeTrials = trials || [];
    return safeTrials.filter((trial) => {
      // Search
      const matchesSearch =
        trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trial.skills || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCat = selectedCategory === 'All' || trial.category === selectedCategory;

      // Difficulty
      const matchesDiff = selectedDifficulty === 'All' || trial.difficulty === selectedDifficulty;

      // Status
      const matchesStatus = selectedStatus === 'All' || trial.status === selectedStatus;

      // Min reward
      const matchesReward = trial.candidateReward >= minReward;

      return matchesSearch && matchesCat && matchesDiff && matchesStatus && matchesReward;
    });
  }, [trials, searchQuery, selectedCategory, selectedDifficulty, selectedStatus, minReward]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedStatus !== 'All' ||
    minReward > 0;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setMinReward(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24282D] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Discover Work Trials
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
            Prove your capabilities on real engineering trials with escrowed USDC rewards and on-chain reputation.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onCreateTrial} icon={<Plus className="w-4 h-4" />}>
          Post a Trial
        </Button>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3 bg-[#0D0F12] border border-[#24282D] rounded-xl p-4">
        {/* Row 1: Search & View Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trial title, company, or skills (e.g. Anchor, Rust, React, USDC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-[#6B7280]"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                icon={<X className="w-3.5 h-3.5" />}
              >
                Clear
              </Button>
            )}

            <div className="flex items-center p-1 rounded-lg bg-[#121417] border border-[#24282D]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#181B20] text-white' : 'text-[#9CA3AF] hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#181B20] text-white' : 'text-[#9CA3AF] hover:text-white'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[#6B7280] font-mono mr-1 text-[11px] whitespace-nowrap">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0052FF] text-white font-medium'
                  : 'bg-[#121417] text-[#9CA3AF] hover:text-white border border-[#24282D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Row 3: Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#24282D]/70 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF] font-mono text-[11px]">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#121417] border border-[#24282D] rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:border-[#0052FF] flex-1"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF] font-mono text-[11px]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#121417] border border-[#24282D] rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:border-[#0052FF] flex-1 capitalize"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF] font-mono text-[11px] whitespace-nowrap">Min Reward:</span>
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="range"
                min={0}
                max={1000}
                step={50}
                value={minReward}
                onChange={(e) => setMinReward(Number(e.target.value))}
                className="w-full accent-[#0052FF] cursor-pointer"
              />
              <span className="font-mono text-white text-[11px] whitespace-nowrap min-w-[50px] text-right">
                {minReward > 0 ? `${minReward} USDC` : 'Any'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#9CA3AF] font-mono">
        <span>
          Showing <span className="text-white font-semibold">{filteredTrials.length}</span> Work Trials
        </span>
        <div className="flex items-center gap-2">
          <SolanaIcon className="w-3.5 h-3.5" />
          <span>Settled in USDC on Solana</span>
        </div>
      </div>

      {/* Trial Cards Grid / List */}
      {filteredTrials.length === 0 ? (
        <div className="p-12 text-center bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-3">
          <h3 className="text-base font-semibold text-white">No Work Trials match your criteria</h3>
          <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
            Try adjusting your category, difficulty, or keyword filters to discover open trials.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrials.map((trial) => (
            <TrialCard
              key={trial.id}
              trial={trial}
              onSelect={onSelectTrial}
              onRefer={onOpenReferral}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrials.map((trial) => (
            <div
              key={trial.id}
              className="p-4 bg-[#0D0F12] hover:bg-[#121417] border border-[#24282D] hover:border-[#38404B] rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={trial.companyLogo}
                  alt={trial.company}
                  className="w-10 h-10 rounded-lg object-cover border border-[#24282D] flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9CA3AF]">{trial.company}</span>
                    <span className="text-xs text-[#6B7280]">•</span>
                    <span className="text-xs font-mono text-[#6B7280]">{trial.category}</span>
                  </div>
                  <h3
                    onClick={() => onSelectTrial(trial)}
                    className="text-sm font-semibold text-white hover:text-[#3B82F6] cursor-pointer transition-colors line-clamp-1 mt-0.5"
                  >
                    {trial.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {trial.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#181B20] text-[#9CA3AF] border border-[#24282D]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#9CA3AF] block">Reward</span>
                  <UsdcDisplay amount={trial.candidateReward} size="sm" />
                </div>
                <Button variant="outline" size="sm" onClick={() => onSelectTrial(trial)}>
                  View Spec
                </Button>
                <Button variant="primary" size="sm" onClick={() => onOpenReferral(trial)}>
                  Refer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
