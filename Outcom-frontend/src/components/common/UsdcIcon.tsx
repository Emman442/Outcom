import React from 'react';

interface UsdcIconProps {
  className?: string;
  size?: number;
}

export const UsdcIcon: React.FC<UsdcIconProps> = ({ className = 'w-4 h-4', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="USDC"
    >
      <circle cx="12" cy="12" r="12" fill="#2775CA" />
      {/* Outer stylized ring */}
      <path
        d="M12 4.5C7.86 4.5 4.5 7.86 4.5 12C4.5 16.14 7.86 19.5 12 19.5C16.14 19.5 19.5 16.14 19.5 12C19.5 7.86 16.14 4.5 12 4.5ZM12 18.2C8.58 18.2 5.8 15.42 5.8 12C5.8 8.58 8.58 5.8 12 5.8C15.42 5.8 18.2 8.58 18.2 12C18.2 15.42 15.42 18.2 12 18.2Z"
        fill="white"
        fillOpacity="0.3"
      />
      {/* Inner $ stylized mark */}
      <path
        d="M13.2 9.5C13.2 8.8 12.6 8.3 11.8 8.3C10.9 8.3 10.3 8.7 10.2 9.4H9C9.2 8.1 10.2 7.1 11.5 6.9V6H12.5V6.9C13.8 7.1 14.8 8 14.8 9.5C14.8 11.6 12.8 11.7 12 12.1C11.3 12.4 10.8 12.8 10.8 13.5C10.8 14.3 11.5 14.8 12.3 14.8C13.3 14.8 14 14.3 14.1 13.4H15.3C15.1 14.8 14 15.9 12.6 16.1V17H11.6V16.1C10.2 15.9 9.2 14.9 9.2 13.5C9.2 11.4 11.2 11.2 12 10.8C12.8 10.5 13.2 10.1 13.2 9.5Z"
        fill="white"
      />
    </svg>
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
