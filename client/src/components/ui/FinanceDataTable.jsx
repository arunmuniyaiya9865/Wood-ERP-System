import React from 'react';
import { Trash2, ChevronDown } from 'lucide-react';

const FinanceDataTable = ({ transactions, onDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Production': 'bg-orange-100 text-orange-700',
      'Supplier': 'bg-red-100 text-red-700',
      'Management': 'bg-yellow-100 text-yellow-700',
      'Supervisor Salary': 'bg-purple-100 text-purple-700',
      'Daily Wages': 'bg-indigo-100 text-indigo-700',
      'Revenue': 'bg-blue-100 text-blue-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryType = (category) => {
    return ['Production', 'Supplier', 'Management', 'Supervisor Salary', 'Daily Wages'].includes(category) 
      ? 'cost' 
      : 'revenue';
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <p className="text-sm text-gray-500 mt-1">{transactions.length} entries</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <p className="text-gray-500 text-sm">No transactions yet. Add your first entry to get started.</p>
                </td>
              </tr>
            ) : (
              transactions.map((transaction, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {transaction.name}
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold text-right ${
                    getCategoryType(transaction.category) === 'revenue' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {getCategoryType(transaction.category) === 'revenue' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(idx)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {transactions.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-600">
          Showing {transactions.length} transactions
        </div>
      )}
    </div>
  );
};

export default FinanceDataTable;
