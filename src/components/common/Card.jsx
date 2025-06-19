import React from 'react';

const Card = ({ 
  title, 
  children, 
  className = '',
  headerAction,
  ...props 
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <div className="card-header" style={{ 
          borderBottom: '1px solid #eee', 
          marginBottom: '16px', 
          paddingBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;