import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'add' | 'edit' | 'delete';
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  language?: 'en' | 'dv';
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  loading = false,
  fullWidth = false,
  language = 'en',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = `
    glass-button inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
    text-sm font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${language === 'dv' ? 'thaana-waheed' : ''}
  `;
  
  const variants = {
    add: 'text-emerald-700 hover:text-emerald-800 focus:ring-emerald-500',
    edit: 'text-blue-700 hover:text-blue-800 focus:ring-blue-500',
    delete: 'text-red-700 hover:text-red-800 focus:ring-red-500',
  };

  const icons = {
    add: <Plus size={16} className={language === 'dv' ? 'ml-2' : 'mr-2'} />,
    edit: <Pencil size={16} className={language === 'dv' ? 'ml-2' : 'mr-2'} />,
    delete: <Trash2 size={16} className={language === 'dv' ? 'ml-2' : 'mr-2'} />,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'delete') {
      const confirmed = window.confirm(
        language === 'dv' 
          ? 'މި އައިޓަމް ޑިލީޓްކުރަން ބޭނުންތޯ؟' 
          : 'Are you sure you want to delete this item?'
      );
      if (!confirmed) {
        e.preventDefault();
        return;
      }
    }
    onClick?.(e);
  };

  // Prepare accessible label
  const ariaLabel = props['aria-label'] || 
    (language === 'dv' 
      ? `${children} ${variant === 'add' ? 'އިތުރުކުރައްވާ' : variant === 'edit' ? 'އެޑިޓްކުރައްވާ' : 'ޑިލީޓްކުރައްވާ'}`
      : `${variant === 'add' ? 'Add' : variant === 'edit' ? 'Edit' : 'Delete'} ${children}`);

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={handleClick}
      dir={language === 'dv' ? 'rtl' : 'ltr'}
      disabled={loading || props.disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : language === 'dv' ? (
        <>
          {children}
          {icons[variant]}
        </>
      ) : (
        <>
          {icons[variant]}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;