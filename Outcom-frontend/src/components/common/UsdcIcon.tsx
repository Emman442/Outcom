import React from 'react';

interface UsdcIconProps {
  className?: string;
  size?: number;
}

export const UsdcIcon: React.FC<UsdcIconProps> = ({ className = 'w-4 h-4', size }) => {
  return (
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Circle_USDC_Logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="USDC Icon" className={className} style={{ width: size, height: size }} />
  );
};

interface UsdcDisplayProps {
  amount: number | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSymbol?: boolean;
  className?: string;
  subtext?: string;
}

export const UsdcDisplay: React.FC<UsdcDisplayProps> = ({
  amount,
  size = 'md',
  showSymbol = true,
  className = '',
  subtext,
}) => {
  const formattedAmount =
    typeof amount === 'number'
      ? amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
      : amount;

  const sizeClasses = {
    xs: { icon: 'w-3 h-3', text: 'text-xs', gap: 'gap-1' },
    sm: { icon: 'w-3.5 h-3.5', text: 'text-sm font-medium', gap: 'gap-1.5' },
    md: { icon: 'w-4 h-4', text: 'text-base font-semibold', gap: 'gap-1.5' },
    lg: { icon: 'w-5 h-5', text: 'text-lg font-bold', gap: 'gap-2' },
    xl: { icon: 'w-6 h-6', text: 'text-2xl font-bold', gap: 'gap-2.5' },
  }[size];

  return (
    <div className={`inline-flex items-center ${sizeClasses.gap} ${className}`}>
      <UsdcIcon className={sizeClasses.icon} />
      <span className={`${sizeClasses.text} tracking-tight text-white font-mono`}>
        {formattedAmount}
        {showSymbol && <span className="ml-1 text-[#9CA3AF] font-sans font-medium text-[0.85em]">USDC</span>}
      </span>
      {subtext && <span className="text-xs text-[#9CA3AF] font-normal">{subtext}</span>}
    </div>
  );
};
