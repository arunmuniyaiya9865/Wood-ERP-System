import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, fetchSalesOrders, fetchPipeline, fetchSalesStats } from '../features/sales/salesSlice';
import PageHeader from '../components/ui/PageHeader';
import StatGrid from '../components/ui/StatGrid';
import Card from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatCurrency } from '../utils/formatters';
import { Users, ShoppingBag, TrendingUp, DollarSign, Plus, Download, Mail, Phone, Globe } from 'lucide-react';

const SalesCRM = () => {
    const [view, setView] = useState('pipeline');
    const dispatch = useDispatch();
    const { customers, orders, pipeline, stats, loading } = useSelector(state => state.sales);

    useEffect(() => {
        dispatch(fetchCustomers());
        dispatch(fetchSalesOrders());
        dispatch(fetchPipeline());
        dispatch(fetchSalesStats());
    }, [dispatch]);

    const statItems = [
        { label: 'Sales Revenue', value: formatCurrency(stats.revenue || 0), trend: 12.4 },
        { label: 'Active Leads', value: stats.activeLeads || 0, sub: 'Qualified prospects' },
        { label: 'Conversion Rate', value: `${stats.conversionRate || 0}%`, trend: 2.2, sub: 'Lead to Customer' },
        { label: 'Avg Deal Size', value: formatCurrency(stats.avgDealSize || 0), sub: 'Per confirmed order' },
    ];

    const STAGE_ORDER = ['prospect', 'qualified', 'proposal', 'negotiation', 'customer'];

    return (
        <div className="w-full">
            <PageHeader 
                title="Sales & CRM Workspace" 
                subtitle="Nurture customer relationships, manage pipeline, and track sales performance"
                actions={
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                            <Download className="w-4 h-4 text-gray-400" />
                            Sales Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm">
                            <Plus className="w-4 h-4" />
                            New {view === 'customers' ? 'Customer' : 'Order'}
                        </button>
                    </>
                }
            />

            <StatGrid stats={statItems} />

            {/* View Switcher */}
            <div className="flex gap-4 mb-6">
                {['pipeline', 'customers', 'orders'].map(v => (
                    <button 
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${view === v ? 'bg-black text-white shadow-lg shadow-black/10' : 'bg-white border border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                    >
                        {v}
                    </button>
                ))}
            </div>

            {loading ? <div className="py-20 flex justify-center"><Spinner /></div> : (
                <>
                    {view === 'pipeline' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
                            {STAGE_ORDER.map(stage => {
                                const stageData = pipeline.find(p => p._id === stage) || { count: 0, value: 0 };
                                return (
                                    <div key={stage} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 min-w-[200px]">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stage}</span>
                                            <Badge status={stage === 'customer' ? 'active' : 'idle'}>{stageData.count}</Badge>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Estimated Value</p>
                                            <h4 className="text-lg font-bold text-gray-900">{formatCurrency(stageData.value)}</h4>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {view === 'customers' && (
                        <Card className="p-0 overflow-hidden shadow-sm">
                            <DataTable 
                                headers={['Ref ID', 'Company & Sector', 'Location', 'YTD Revenue', 'Relationship Stage', 'Account Rep', 'Contacts']}
                                data={customers}
                                renderRow={(c) => (
                                    <>
                                        <td className="px-5 py-4 text-[13px] font-bold text-gray-400">{c.customerId}</td>
                                        <td className="px-5 py-4 text-[13px]">
                                            <p className="font-bold text-gray-900">{c.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{c.sector}</p>
                                        </td>
                                        <td className="px-5 py-4 text-[13px] text-gray-700 font-medium">
                                            <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-300" /> {c.country}</div>
                                        </td>
                                        <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{formatCurrency(c.ytdRevenue)}</td>
                                        <td className="px-5 py-4 text-[13px]"><Badge status={c.stage}>{c.stage}</Badge></td>
                                        <td className="px-5 py-4 text-[13px] text-gray-600 font-medium">{c.assignedRep?.name || 'In Rotation'}</td>
                                        <td className="px-5 py-4 text-[13px]">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"><Mail className="w-3.5 h-3.5" /></button>
                                                <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"><Phone className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            />
                        </Card>
                    )}

                    {view === 'orders' && (
                        <Card className="p-0 overflow-hidden shadow-sm">
                            <DataTable 
                                headers={['Order Ref', 'Customer', 'Product Specs', 'Volume', 'Total Value', 'Status Tracking']}
                                data={orders}
                                renderRow={(o) => (
                                    <>
                                        <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{o.orderId}</td>
                                        <td className="px-5 py-4 text-[13px] font-bold text-gray-700">{o.customer?.name}</td>
                                        <td className="px-5 py-4 text-[13px] text-gray-500 font-medium">{o.product}</td>
                                        <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{o.volume} {o.unit}</td>
                                        <td className="px-5 py-4 text-[13px] font-black text-gray-900">{formatCurrency(o.totalValue)}</td>
                                        <td className="px-5 py-4 text-[13px]"><Badge status={o.status} /></td>
                                    </>
                                )}
                            />
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default SalesCRM;
