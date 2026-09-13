import React from 'react';

export const SolanaIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 397 311"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-label="Solana"
  >
    <path
      d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zM332.4 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H5.8c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
      fill="#14F195"
    />
  </svg>
);

export const LayerZeroIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-label="LayerZero"
  >
    <circle cx="12" cy="12" r="10" stroke="#F3F4F6" strokeWidth="1.5" />
    <path d="M7 16L17 8" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="7" cy="16" r="2" fill="#0052FF" />
    <circle cx="17" cy="8" r="2" fill="#F3F4F6" />
  </svg>
);

export const WorkTrialLogo: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-7 h-7',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-label="WorkTrial"
  >
    <rect width="32" height="32" rx="8" fill="#121417" stroke="#24282D" strokeWidth="1.5" />
    <path
      d="M9 11L14 16L9 21"
      stroke="#0052FF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 21H23"
      stroke="#F3F4F6"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
