import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-2">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1f3459] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#60719a] mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
