import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        className={`form-input ${error ? 'error' : ''} ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {error && <div className="error-text" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default Input;