import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDashboardStats, fetchRevenueData, fetchProductionDataByDay, 
  fetchSpeciesMix, fetchRecentOrders, fetchStockAlerts 
} from '../features/dashboard/dashboardSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import StatGrid from '../components/ui/StatGrid';
import Card from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, revenue, production, speciesMix, recentOrders, stockAlerts, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRevenueData());
    dispatch(fetchProductionDataByDay());
    dispatch(fetchSpeciesMix());
    dispatch(fetchRecentOrders());
    dispatch(fetchStockAlerts());
  }, [dispatch]);

  const COLORS = ['#6f77bf', '#67b8d8', '#98d29e', '#f6a9ae'];

  if (loading && !stats.revenue) return <Spinner className="h-96" />;

  const statItems = [
    { label: 'Total Revenue', value: formatCurrency(stats.revenue || 0), trend: stats.trend?.revenue },
    { label: 'Sales Orders', value: stats.orders || 0, trend: stats.trend?.orders },
    { label: 'Raw Log Stock', value: `${stats.logStock || 0} pcs`, sub: 'Available in Yard' },
    { label: 'Avg Yield Rate', value: `${(stats.yieldRate || 0).toFixed(1)}%`, trend: stats.trend?.yield, sub: 'Efficiency Target: 92%' },
  ];

  return (
    <div className="w-full">
      <PageHeader 
        title="Command Center" 
        subtitle="Real-time wood industry performance overview" 
      />

      <StatGrid stats={statItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <Card title="Revenue vs Material Cost" subtitle="Last 12 months financial performance">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f8ee8" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#4f8ee8" stopOpacity={0.01}/>
                  </linearGradient>

                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9645e6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#9645e6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(137, 154, 187, 0.25)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid rgba(148, 163, 184, 0.35)',
                    background: 'rgba(255, 255, 255, 0.88)',
                    boxShadow: '0 15px 30px rgba(26, 72, 132, 0.15)',
                  }}
                  itemStyle={{ fontSize: '12px', color: '#334155' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="url(#colorRev)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} name="Revenue" activeDot={{ r: 6, stroke: '#60a5fa', strokeWidth: 2, fill: '#eef5ff' }} />
                <Area type="monotone" dataKey="cost" stroke="url(#colorCost)" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2.5} strokeDasharray="6 6" name="Material Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Species Mix */}
        <Card title="Raw Material Mix" subtitle="Inventory breakdown by wood species">
          <div className="h-[250px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {speciesMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card title="Recent Sales Orders" subtitle="Top 5 latest confirmed transactions">
          <DataTable 
            headers={['Order ID', 'Customer', 'Product', 'Total', 'Status']}
            data={recentOrders}
            renderRow={(order) => (
              <>
                <td className="px-5 py-4 text-[13px] font-bold text-[#253b60]">{order.orderId}</td>
                <td className="px-5 py-4 text-[13px] text-[#4f607d]">{order.customer?.name}</td>
                <td className="px-5 py-4 text-[13px] text-[#4f607d]">{order.product}</td>
                <td className="px-5 py-4 text-[13px] font-semibold text-[#293f67]">{formatCurrency(order.totalValue)}</td>
                <td className="px-5 py-4 text-[13px]"><Badge status={order.status} /></td>
              </>
            )}
          />
        </Card>

        {/* Low Stock Alerts */}
        <Card title="Finished Goods Alerts" subtitle="Items below minimum threshold">
          <div className="space-y-6 pt-2">
            {stockAlerts.map((item) => (
              <div key={item.sku} className="space-y-2">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="font-bold text-gray-900">{item.name} <span className="font-normal text-gray-400">({item.sku})</span></span>
                  <span className="text-red-600 font-bold">{item.inStock} {item.unit}</span>
                </div>
                <div className="h-1.5 w-full bg-white/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full progress-crit" 
                    style={{ width: `${(item.inStock / 20) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                  <span>Critical: 20 {item.unit}</span>
                  <span>Warehouse: {item.location}</span>
                </div>
              </div>
            ))}
            {stockAlerts.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No critical stock alerts</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
