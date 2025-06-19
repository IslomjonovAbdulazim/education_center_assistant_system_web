import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : '';
  
  const classes = [baseClass, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;