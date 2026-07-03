import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  text: 'bg-transparent text-primary font-semibold px-md py-sm transition-all duration-200 active:scale-95',
};

const sizes = {
  sm: 'text-label-md py-1.5 px-3',
  md: 'text-body-md py-sm px-md',
  lg: 'text-body-lg py-3 px-6',
  full: 'text-body-md py-sm px-md w-full',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4" />}
    </button>
  );
};

export default Button;
