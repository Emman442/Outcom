import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Respecting rule: Button horizontal padding must be exactly 2x vertical padding
  const sizeStyles = {
    xs: 'text-xs py-1.5 px-3 rounded-[6px] gap-1.5 font-medium',
    sm: 'text-xs py-2 px-4 rounded-[8px] gap-2 font-medium',
    md: 'text-sm py-2.5 px-5 rounded-[8px] gap-2 font-medium',
    lg: 'text-base py-3 px-6 rounded-[10px] gap-2.5 font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#0052FF] text-white hover:bg-[#1A64FF] active:bg-[#0047DB] border border-[#0052FF] shadow-[0_1px_2px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:pointer-events-none',
    secondary:
      'bg-[#181B20] text-[#F3F4F6] hover:bg-[#20242A] active:bg-[#14161A] border border-[#24282D] hover:border-[#323842] disabled:opacity-50 disabled:pointer-events-none',
    outline:
      'bg-transparent text-[#D1D5DB] hover:text-white hover:bg-[#181B20] border border-[#24282D] hover:border-[#3A414A] disabled:opacity-50 disabled:pointer-events-none',
    ghost:
      'bg-transparent text-[#9CA3AF] hover:text-white hover:bg-[#181B20]/60 border border-transparent disabled:opacity-50 disabled:pointer-events-none',
    danger:
      'bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/25 active:bg-[#EF4444]/30 border border-[#EF4444]/30 disabled:opacity-50 disabled:pointer-events-none',
    success:
      'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/25 active:bg-[#10B981]/30 border border-[#10B981]/30 disabled:opacity-50 disabled:pointer-events-none',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap transition-colors select-none cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
};
