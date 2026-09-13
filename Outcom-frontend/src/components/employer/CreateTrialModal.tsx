import React, { useState } from 'react';
import { Outcom, UserWallet, Difficulty } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UsdcDisplay, UsdcIcon } from '../common/UsdcIcon';
import { SolanaIcon } from '../common/NetworkIcons';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface CreateTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  onCreateTrial: (newTrial: Partial<Outcom>) => void;
}

export const CreateTrialModal: React.FC<CreateTrialModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onCreateTrial,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Work Definition
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Outcom['category']>('Full-Stack');
  const [skills, setSkills] = useState('Solana, Anchor, Rust, TypeScript');
  const [difficulty, setDifficulty] = useState<Difficulty>('Advanced');

  // Step 2: Outcome Definition
  const [objective, setObjective] = useState('');
  const [requirementsList, setRequirementsList] = useState<string[]>([
    'Anchor smart contract deployed on Solana Devnet',
    'USDC SPL token transfer verification',
    'Robust error handling and unit tests',
  ]);
  const [newReq, setNewReq] = useState('');

  const [definitionOfDoneList, setDefinitionOfDoneList] = useState<string[]>([
    'Public GitHub repository with verified commit history',
    'Application deployed to public URL',
    'Verifiable transaction signatures on Solana block explorer',
    'Comprehensive README and test suite',
  ]);
  const [newDod, setNewDod] = useState('');

  // Step 3: Set Reward
  const [totalReward, setTotalReward] = useState<number>(500);
  const [candidateReward, setCandidateReward] = useState<number>(450);
  const [referralReward, setReferralReward] = useState<number>(50);

  // Sync rewards helper
  const handleCandidateRewardChange = (val: number) => {
    setCandidateReward(val);
    setTotalReward(val + referralReward);
  };

  const handleReferralRewardChange = (val: number) => {
    setReferralReward(val);
    setTotalReward(candidateReward + val);
  };

  // Step 4: Funding & Publication Transaction State
  const [isFunding, setIsFunding] = useState(false);
  const [txStep, setTxStep] = useState<
    'idle' | 'approving' | 'confirming' | 'published'
  >('idle');

  const platformFee = Math.round(totalReward * 0.025); // 2.5% protocol fee
  const totalFundingRequired = totalReward + platformFee;
  const hasSufficientBalance = wallet.usdcBalance >= totalFundingRequired;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleAddRequirement = () => {
    if (!newReq.trim()) return;
    setRequirementsList([...requirementsList, newReq.trim()]);
    setNewReq('');
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirementsList(requirementsList.filter((_, i) => i !== idx));
  };

  const handleAddDod = () => {
    if (!newDod.trim()) return;
    setDefinitionOfDoneList([...definitionOfDoneList, newDod.trim()]);
    setNewDod('');
  };

  const handleRemoveDod = (idx: number) => {
    setDefinitionOfDoneList(definitionOfDoneList.filter((_, i) => i !== idx));
  };

  const handleFundAndPublish = () => {
    setIsFunding(true);
    setTxStep('approving');

    setTimeout(() => {
      setTxStep('confirming');
    }, 1200);

    setTimeout(() => {
      setTxStep('published');
      setIsFunding(false);

      // Create trial record
      const newTrialData: Partial<Outcom> = {
        title: title || 'Production Work Trial',
        company: 'Example Labs',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        isCompanyVerified: true,
        category,
        description: description || 'Complete outcome-based trial specification.',
        objective: objective || 'Fulfill trial acceptance criteria and submit verifiable evidence.',
        requirements: requirementsList.map((r, i) => ({ id: `req-${i}`, text: r, mandatory: true })),
        definitionOfDone: definitionOfDoneList.map((d, i) => ({ id: `dod-${i}`, text: d })),
        totalReward,
        candidateReward,
        referralReward,
        applicantsCount: 0,
        deadline: '7d 00h 00m',
        deadlineTimestamp: Date.now() + 7 * 86400000,
        difficulty,
        isRemote: true,
        network: 'Solana',
        skills: skills.split(',').map((s) => s.trim()),
        status: 'open',
        escrowAddress: `Escrow${Math.random().toString(36).substring(2, 12)}`,
        createdAt: new Date().toISOString(),
      };

      onCreateTrial(newTrialData);
    }, 2400);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setTxStep('idle');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetForm}
      title="Create Work Trial"
      subtitle={`Step ${currentStep} of 4 • Outcome Specification & Escrow`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between border-b border-[#24282D] pb-3 text-xs font-mono">
          {[
            { step: 1, label: '1. Define Work' },
            { step: 2, label: '2. Define Outcome' },
            { step: 3, label: '3. Set Reward' },
            { step: 4, label: '4. Fund Escrow' },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === item.step
                  ? 'text-[#3B82F6] font-semibold'
                  : currentStep > item.step
                  ? 'text-[#10B981]'
                  : 'text-[#6B7280]'
              }`}
            >
              <span>{item.label}</span>
              {currentStep > item.step && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          ))}
        </div>

        {/* Step 1: Define the work */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
                Trial Title <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Build a Solana Payment Integration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-[#6B7280]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Smart Contracts">Smart Contracts</option>
                  <option value="Full-Stack">Full-Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Protocol Engineering">Protocol Engineering</option>
                  <option value="Security & Audit">Security & Audit</option>
                  <option value="Data & Indexing">Data & Indexing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
                Overview Description
              </label>
              <textarea
                rows={2}
                placeholder="High-level description of what the work trial requires..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg p-3 text-xs text-white placeholder:text-[#6B7280] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
                Required Technical Skills (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Solana, Anchor, Rust, TypeScript, USDC"
                className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3.5 py-2 text-xs text-white font-mono placeholder:text-[#6B7280]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Define the outcome */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D1D5DB] mb-1.5">
                The Objective
              </label>
              <textarea
                rows={2}
                placeholder="Clearly state what the candidate must achieve..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg p-3 text-xs text-white placeholder:text-[#6B7280] resize-none"
              />
            </div>

            {/* Requirements Checklist */}
            <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Technical Requirements</span>
                <span className="text-[11px] text-[#9CA3AF] font-mono">
                  {requirementsList.length} items
                </span>
              </div>

              <div className="space-y-1.5">
                {requirementsList.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-[#0D0F12] border border-[#24282D] text-xs text-[#D1D5DB]"
                  >
                    <span>✓ {req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      className="text-[#9CA3AF] hover:text-[#EF4444]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add specific requirement..."
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                  className="flex-1 bg-[#0D0F12] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-md px-3 py-1.5 text-xs text-white placeholder:text-[#6B7280]"
                />
                <Button type="button" variant="secondary" size="xs" onClick={handleAddRequirement}>
                  Add
                </Button>
              </div>
            </div>

            {/* Definition of Done Checklist */}
            <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Definition of Done</span>
                <span className="text-[11px] text-[#10B981] font-mono">Evaluated by verifiers</span>
              </div>

              <div className="space-y-1.5">
                {definitionOfDoneList.map((dod, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-[#0D0F12] border border-[#24282D] text-xs text-[#D1D5DB]"
                  >
                    <span>• {dod}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDod(idx)}
                      className="text-[#9CA3AF] hover:text-[#EF4444]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add condition of done..."
                  value={newDod}
                  onChange={(e) => setNewDod(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDod())}
                  className="flex-1 bg-[#0D0F12] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-md px-3 py-1.5 text-xs text-white placeholder:text-[#6B7280]"
                />
                <Button type="button" variant="secondary" size="xs" onClick={handleAddDod}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Set Reward */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-[#9CA3AF] block font-mono">Total Trial Reward</span>
                <UsdcDisplay amount={totalReward} size="xl" />
              </div>
              <span className="text-xs text-[#10B981] font-mono px-2.5 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/30">
                USDC Escrow
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-white">
                  Candidate Reward
                </label>
                <div className="flex items-center gap-2">
                  <UsdcIcon className="w-5 h-5" />
                  <input
                    type="number"
                    min={50}
                    step={25}
                    value={candidateReward}
                    onChange={(e) => handleCandidateRewardChange(Number(e.target.value))}
                    className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono text-white"
                  />
                  <span className="text-xs text-[#9CA3AF] font-mono">USDC</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Released directly to candidate when verification passes.
                </p>
              </div>

              <div className="p-4 bg-[#0D0F12] border border-[#24282D] rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-white">
                  Referral Reward
                </label>
                <div className="flex items-center gap-2">
                  <UsdcIcon className="w-5 h-5" />
                  <input
                    type="number"
                    min={10}
                    step={10}
                    value={referralReward}
                    onChange={(e) => handleReferralRewardChange(Number(e.target.value))}
                    className="w-full bg-[#121417] border border-[#24282D] focus:border-[#0052FF] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono text-white"
                  />
                  <span className="text-xs text-[#9CA3AF] font-mono">USDC</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Incentivizes ecosystem referrers to source qualified talent.
                </p>
              </div>
            </div>

            {/* Visual allocation */}
            <div className="p-3.5 bg-[#121417] border border-[#24282D] rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF] font-mono">
                <span>Candidate Split: {Math.round((candidateReward / totalReward) * 100)}%</span>
                <span>Referrer Split: {Math.round((referralReward / totalReward) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#181B20] overflow-hidden flex">
                <div
                  style={{ width: `${(candidateReward / totalReward) * 100}%` }}
                  className="bg-[#0052FF] h-full"
                />
                <div
                  style={{ width: `${(referralReward / totalReward) * 100}%` }}
                  className="bg-[#F59E0B] h-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Fund trial */}
        {currentStep === 4 && (
          <div className="space-y-5">
            {txStep === 'published' ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Work Trial Published & Escrow Locked</h3>
                  <p className="text-xs text-[#9CA3AF] mt-1 max-w-sm mx-auto">
                    {totalFundingRequired} USDC is now locked in the Outcom Solana escrow contract. Candidates can discover and commit to this trial immediately.
                  </p>
                </div>
                <div className="p-3 bg-[#121417] border border-[#24282D] rounded-lg font-mono text-xs text-[#9CA3AF]">
                  Tx Hash: 5KpM...8sQ • Escrow: Escrow9q1...F3g
                </div>
                <Button variant="primary" size="md" onClick={resetForm} className="w-full">
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[#121417] border border-[#24282D] rounded-xl space-y-3">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Escrow Settlement Breakdown
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9CA3AF]">Total Candidate + Referral Reward</span>
                      <UsdcDisplay amount={totalReward} size="sm" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#9CA3AF]">Protocol Oracle & Verification Fee (2.5%)</span>
                      <UsdcDisplay amount={platformFee} size="sm" />
                    </div>

                    <div className="pt-2 border-t border-[#24282D] flex items-center justify-between font-semibold">
                      <span className="text-white">Total Amount to Lock in Escrow</span>
                      <UsdcDisplay amount={totalFundingRequired} size="md" />
                    </div>
                  </div>
                </div>

                {/* Wallet Balance Check */}
                <div className="p-3.5 bg-[#0D0F12] border border-[#24282D] rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <SolanaIcon className="w-4 h-4" />
                    <span className="text-[#9CA3AF]">Your Solana Wallet Balance:</span>
                  </div>
                  <UsdcDisplay amount={wallet.usdcBalance} size="sm" />
                </div>

                {!hasSufficientBalance && (
                  <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg flex items-center gap-2 text-xs text-[#EF4444]">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Insufficient USDC in connected wallet to fund this trial escrow.</span>
                  </div>
                )}

                {/* Transaction Status during submit */}
                {isFunding && (
                  <div className="p-3.5 bg-[#121417] border border-[#0052FF]/30 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#3B82F6]">
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className="font-mono">
                        {txStep === 'approving'
                          ? 'Awaiting wallet approval...'
                          : 'Confirming Solana transaction...'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        {txStep !== 'published' && (
          <div className="flex items-center justify-between pt-4 border-t border-[#24282D]">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={isFunding}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={resetForm} disabled={isFunding}>
                Cancel
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  iconRight={<ChevronRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  isLoading={isFunding}
                  disabled={!hasSufficientBalance}
                  onClick={handleFundAndPublish}
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Fund & Publish Trial
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
