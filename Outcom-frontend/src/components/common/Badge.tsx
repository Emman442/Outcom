import React from 'react';
import { Difficulty, TrialStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'outline' | 'mono';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    xs: 'text-[11px] px-1.5 py-0.5 tracking-tight',
    sm: 'text-xs px-2 py-0.5 tracking-tight font-medium',
    md: 'text-xs px-2.5 py-1 tracking-tight font-medium',
  }[size];

  const variantStyles = {
    default: 'bg-[#181B20] text-[#D1D5DB] border border-[#24282D]',
    blue: 'bg-[#0052FF]/10 text-[#3B82F6] border border-[#0052FF]/30',
    green: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25',
    amber: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25',
    red: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/25',
    purple: 'bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/25',
    outline: 'bg-transparent text-[#9CA3AF] border border-[#24282D]',
    mono: 'bg-[#121417] text-[#9CA3AF] border border-[#24282D] font-mono text-[11px]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[6px] whitespace-nowrap ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty: Difficulty; className?: string }> = ({
  difficulty,
  className,
}) => {
  const variantMap: Record<Difficulty, 'default' | 'blue' | 'amber' | 'purple'> = {
    Beginner: 'default',
    Intermediate: 'blue',
    Advanced: 'amber',
    Expert: 'purple',
  };

  return (
    <Badge variant={variantMap[difficulty]} size="xs" className={className}>
      {difficulty}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: TrialStatus; className?: string }> = ({
  status,
  className,
}) => {
  switch (status) {
    case 'open':
      return <Badge variant="blue" size="xs" className={className}>Open for Applicants</Badge>;
    case 'in_progress':
      return <Badge variant="amber" size="xs" className={className}>In Progress</Badge>;
    case 'submitted':
      return <Badge variant="purple" size="xs" className={className}>Under Review</Badge>;
    case 'verifying':
      return <Badge variant="amber" size="xs" className={className}>Verifying Outcome</Badge>;
    case 'verified':
    case 'completed':
      return <Badge variant="green" size="xs" className={className}>Verified & Paid</Badge>;
    case 'failed':
      return <Badge variant="red" size="xs" className={className}>Outcome Unverified</Badge>;
    default:
      return <Badge variant="default" size="xs" className={className}>{status}</Badge>;
  }
};
