import React from 'react';

const TabSwitcher = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 mb-6 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-black text-white shadow-lg scale-100'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <div className="absolute inset-0 rounded-full bg-black opacity-0 -z-10" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
