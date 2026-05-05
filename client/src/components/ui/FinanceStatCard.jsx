import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel,
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    orange: 'bg-orange-50 border-orange-100',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
  };

  const isPositive = trend > 0;

  return (
    <div className={`${colorClasses[color]} border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900">
            ₹{value.toLocaleString('en-IN')}
          </h3>
        </div>
        {Icon && (
          <div className={`${iconColorClasses[color]} p-3 rounded-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(trend)}%</span>
          {trendLabel && <span className="text-gray-600 ml-1">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
