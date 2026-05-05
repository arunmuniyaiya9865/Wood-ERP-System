import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventoryItems, fetchInventoryStats } from '../features/inventory/inventorySlice';
import PageHeader from '../components/ui/PageHeader';
import StatGrid from '../components/ui/StatGrid';
import Card from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatCurrency } from '../utils/formatters';
import { Package, Download, Search, Settings as SettingsIcon } from 'lucide-react';

const Inventory = () => {
  const [activeTabs, setActiveTabs] = useState("raw wood");
  const dispatch = useDispatch();
  const { items, stats, loading } = useSelector(state => state.inventory);

  useEffect(() => {
    dispatch(fetchInventoryItems());
    dispatch(fetchInventoryStats());
  }, [dispatch]);

  const statItems = [
    { label: 'Active SKUs', value: stats.totalSKUs || 0, trend: 2 },
    { label: 'Stock Valuation', value: formatCurrency(stats.stockValue || 0), sub: 'Total Asset Value' },
    { label: 'Reserved Stock', value: formatCurrency(stats.reservedValue || 0), sub: 'Committed to Orders' },
    { label: 'Low Stock Alerts', value: stats.lowStockCount || 0, sub: 'Needs Replenishment', trend: -4 },
  ];

  return (
    <div className="w-full">
      <PageHeader 
        title="Finished Goods Inventory" 
        subtitle="Manage warehouse stock, product valuation, and dispatch readiness"
        actions={
          <>
            <div className="relative group mr-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find SKU or product..." 
                className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-black outline-none shadow-sm transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="w-4 h-4 text-gray-400" />
              Export CSV
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm">
              <Package className="w-4 h-4" />
              Adjust Stock
            </button> */}
          </>
        }
      />

      <StatGrid stats={statItems} />

      <Card className="p-0">

        <div className="flex border-b border-gray-100 bg-gray-50/30 px-4">
              <button
                onClick={() => setActiveTabs('raw wood')}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTabs === 'raw wood' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Wood Logs
              </button>
              <button
                onClick={() => setActiveTabs('cutted logs')}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTabs === 'cutted logs' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Cutted Logs
              </button>
              <button
                onClick={() => setActiveTabs('finished goods')}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTabs === 'finished goods' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Finished Goods
              </button>
            </div>

        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{activeTabs}</h3>
          </div>
          <div className="flex gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
            <span>WH-1: Regional</span>
            <span>WH-2: Logistical Central</span>
          </div>
        </div>

        {loading ? (
            <div className="py-20 flex justify-center"><Spinner /></div>
        ) : (
            <DataTable 
                headers={['SKU', 'Product Name', 'Unit', 'In Stock', 'Reserved', 'Available', 'Location', 'Unit Value', 'Total Value']}
                data={items}
                renderRow={(item) => (
                    <>
                        <td className="px-5 py-4 text-[13px] font-bold text-gray-400">{item.sku}</td>
                        <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{item.name}</td>
                        <td className="px-5 py-4 text-[13px] text-gray-500">{item.unit}</td>
                        <td className="px-5 py-4 text-[13px] text-gray-700 font-medium">{item.inStock}</td>
                        <td className="px-5 py-4 text-[13px] text-red-500 font-medium">-{item.reserved}</td>
                        <td className="px-5 py-4 text-[13px] font-bold text-green-700">{item.available}</td>
                        <td className="px-5 py-4 text-[13px] text-gray-600 font-medium">{item.location}</td>
                        <td className="px-5 py-4 text-[13px] text-gray-700">{formatCurrency(item.unitValue)}</td>
                        <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{formatCurrency(item.totalValue)}</td>
                    </>
                )}
            />
        )}
      </Card>
    </div>
  );
};

export default Inventory;
