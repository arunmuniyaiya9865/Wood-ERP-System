import React from 'react';

const StatusBadge = ({ status, children, className = '' }) => {
  const getStyles = (status) => {
    const s = status?.toLowerCase() || '';
    
    // Green - Delivered
    if (['active', 'approved', 'completed', 'paid', 'delivered'].includes(s)) {
      return 'bg-[#dcfdf3] text-[#1f6b52] shadow-sm ring-1 ring-[#8fedc8]';
    }
    
    // Yellow - In Transit / Pending
    if (['pending', 'open', 'customs', 'warning', 'transit', 'in_progress', 'dispatch', 'out_for_delivery'].includes(s)) {
      return 'bg-[#f4ebcd] text-[#906e2c] shadow-sm ring-1 ring-[#efda9a]';
    }
    
    // Red - Delayed / Critical
    if (['overdue', 'critical', 'maintenance', 'cancelled', 'delayed'].includes(s)) {
      return 'bg-[#ffe3e7] text-[#a62a36] shadow-sm ring-1 ring-[#f5b3bb]';
    }
    
    // Blue - Processing / Shipping
    if (['shipping', 'shipped', 'processing', 'loading'].includes(s)) {
      return 'bg-[#d7efff] text-[#1f5781] shadow-sm ring-1 ring-[#9fcdf5]';
    }
    
    // Default
    return 'bg-[#f2f6ff] text-[#475d87] shadow-sm ring-1 ring-[#c6d7f5]';
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyles(status)} ${className}`}>
      {children || status}
    </span>
  );
};

export default StatusBadge;
