import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  to,
  href,
  onClick,
  variant = 'outline', // 'primary', 'outline', 'disabled'
  type = 'button',
  className = '',
  icon = null,
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-10 py-4 font-bold uppercase tracking-widest text-[0.75rem] rounded-full transition-all duration-300 group";
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  let variantClasses = "";
  if (variant === 'outline') {
    variantClasses = "border-2 border-[#1A3C2E] text-[#1A3C2E] hover:bg-[#1A3C2E] hover:text-white";
  } else if (variant === 'primary') {
    variantClasses = "bg-[#1A3C2E] text-white border-2 border-[#1A3C2E] hover:bg-[#0f2419] hover:border-[#0f2419]";
  } else if (variant === 'secondary') {
    variantClasses = "bg-[#B48253] text-white border-2 border-[#B48253] hover:bg-[#8e6540] hover:border-[#8e6540]";
  } else if (variant === 'disabled' || disabled) {
    variantClasses = "bg-gray-200 text-gray-500 border-2 border-gray-200 cursor-not-allowed";
  } else if (variant === 'white') {
    variantClasses = "bg-white text-[#1A3C2E] border-2 border-white hover:bg-transparent hover:text-white";
  } else if (variant === 'white-outline') {
    variantClasses = "bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#1A3C2E]";
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${widthClass} ${disabledClass} ${className}`;

  const renderIcon = () => {
    if (icon === 'arrow-right') {
      return (
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      );
    }
    return icon;
  };

  if (to) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick} {...props}>
        {children}
        {renderIcon()}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} onClick={onClick} {...props}>
        {children}
        {renderIcon()}
      </a>
    );
  }

  return (
    <button type={type} className={combinedClasses} onClick={onClick} disabled={disabled} {...props}>
      {children}
      {renderIcon()}
    </button>
  );
};

export default Button;
