export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type TrialStatus = 'open' | 'in_progress' | 'submitted' | 'verifying' | 'verified' | 'failed' | 'completed';

export interface Requirement {
  id: string;
  text: string;
  mandatory: boolean;
}

export interface DefinitionOfDoneItem {
  id: string;
  text: string;
}

export interface WorkTrial {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  isCompanyVerified: boolean;
  category: 'Smart Contracts' | 'Full-Stack' | 'Frontend' | 'Protocol Engineering' | 'Security & Audit' | 'Data & Indexing';
  description: string;
  objective: string;
  requirements: Requirement[];
  definitionOfDone: DefinitionOfDoneItem[];
  totalReward: number; // in USDC
  candidateReward: number; // in USDC
  referralReward: number; // in USDC
  applicantsCount: number;
  deadline: string; // e.g. "5d 14h 32m"
  deadlineTimestamp: number;
  difficulty: Difficulty;
  isRemote: boolean;
  network: 'Solana' | 'Solana + LayerZero';
  skills: string[];
  status: TrialStatus;
  escrowAddress: string;
  createdAt: string;
  currentCandidateStatus?:
    | 'not_started'
    | 'open'
    | 'active'
    | 'in_progress'
    | 'ready_to_submit'
    | 'submitted'
    | 'under_review'
    | 'verified'
    | 'paid'
    | 'failed';
}

export interface VerificationCriterion {
  id: string;
  name: string;
  status: 'pending' | 'checking' | 'passed' | 'failed';
  score?: number;
  details?: string;
}

export interface VerificationBreakdown {
  technicalCompletion: number;
  requirementsSatisfaction: number;
  codeQuality: number;
  outcomeConfidence: number;
}

export interface VerificationVerdict {
  id: string;
  trialId: string;
  status: 'VERIFIED' | 'FAILED' | 'CHECKING';
  overallScore: number;
  breakdown: VerificationBreakdown;
  aiReasoning: string;
  verificationId: string; // e.g. "WT-8F29-4A91"
  verifiedAt: string;
  transactionHash: string;
  candidateAddress: string;
  referrerAddress?: string;
  candidateReward: number;
  referralReward: number;
  layerZeroSettlement?: {
    sourceChain: string;
    destinationChain: string;
    status: 'Delivered' | 'In Flight' | 'Confirmed';
    messageId: string;
    crossChainUsdc: number;
  };
}

export interface SubmissionData {
  trialId: string;
  repositoryUrl: string;
  deploymentUrl: string;
  documentationUrl?: string;
  evidenceLinks: { title: string; url: string; type: 'github' | 'deployment' | 'tx' | 'video' | 'docs' }[];
  notes: string;
  commitHash: string;
  submittedAt: string;
}

export interface CandidateApplicant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  walletAddress: string;
  reputationScore: number;
  verifiedTrialsCount: number;
  successRate: number;
  earnedUsdc: number;
  skills: string[];
  recentOutcomes: string[];
  status: 'Applied' | 'In Progress' | 'Submitted' | 'Verified';
}

export interface ReputationEvent {
  id: string;
  trialTitle: string;
  companyName: string;
  reputationDelta: number;
  usdcEarned: number;
  date: string;
  verificationId: string;
  txHash: string;
  category: string;
}

export interface UserWallet {
  isConnected: boolean;
  address: string;
  usdcBalance: number;
  solBalance: number;
  reputationScore: number;
  network: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'payout' | 'verification' | 'referral' | 'deadline';
  read: boolean;
  linkId?: string;
}

export type NavigationTab =
  | 'landing'
  | 'discover'
  | 'trial_detail'
  | 'workspace'
  | 'submit_trial'
  | 'verification'
  | 'reputation'
  | 'employer'
  | 'leaderboard';
