import React from 'react';

const Card = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="glass-card-header">
          {title && <h3 className="text-base font-semibold glass-card-title">{title}</h3>}
          {subtitle && <p className="text-sm glass-card-subtitle mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="glass-card-body">{children}</div>
    </div>
  );
};

export default Card;
