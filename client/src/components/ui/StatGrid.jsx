import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ label, value, sub, trend }) => {
  const isPositive = trend > 0;
  
  return (
    <div className="stat-card p-5">
      <p className="stat-card-label uppercase text-[10px] font-bold tracking-wider mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-extrabold stat-card-value leading-tight">{value}</h2>
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      {sub && <p className="text-xs stat-card-sub mt-1">{sub}</p>}
    </div>
  );
};

const StatGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};

export default StatGrid;
