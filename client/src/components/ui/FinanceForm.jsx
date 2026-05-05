import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const FinanceForm = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    category: 'Production',
    name: '',
    amount: '',
    workerCount: '',
    wagePerDay: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [showForm, setShowForm] = useState(false);

  const categories = [
    'Production',
    'Supplier',
    'Management',
    'Supervisor Salary',
    'Daily Wages',
    'Revenue',
  ];

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value,
      name: '',
      amount: '',
      workerCount: '',
      wagePerDay: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateDailyWages = () => {
    if (formData.category === 'Daily Wages' && formData.workerCount && formData.wagePerDay) {
      return parseInt(formData.workerCount) * parseInt(formData.wagePerDay);
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let amount = 0;
    let name = formData.name;

    if (formData.category === 'Daily Wages') {
      amount = calculateDailyWages();
      name = `${formData.workerCount} workers @ ₹${formData.wagePerDay}/day`;
    } else {
      amount = parseInt(formData.amount) || 0;
    }

    if (!amount || !name) {
      alert('Please fill all required fields');
      return;
    }

    onAddTransaction({
      category: formData.category,
      name,
      amount,
      date: formData.date,
    });

    setFormData({
      category: 'Production',
      name: '',
      amount: '',
      workerCount: '',
      wagePerDay: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  return (
    <>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Finance Entry
        </button>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add New Entry</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Daily Wages Specific Fields */}
            {formData.category === 'Daily Wages' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Worker Count</label>
                    <input
                      type="number"
                      name="workerCount"
                      value={formData.workerCount}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wage per Day</label>
                    <input
                      type="number"
                      name="wagePerDay"
                      value={formData.wagePerDay}
                      onChange={handleInputChange}
                      placeholder="e.g., 500"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {calculateDailyWages() > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Daily Wages</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{calculateDailyWages().toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name/Description</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`e.g., ${formData.category === 'Revenue' ? 'Wood Sale' : formData.category === 'Supervisor Salary' ? 'Supervisor Name' : 'Item name'}`}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FinanceForm;
