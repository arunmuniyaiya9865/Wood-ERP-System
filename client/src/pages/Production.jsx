import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkOrders, fetchProductionStats } from '../features/production/productionSlice';
import PageHeader from '../components/ui/PageHeader';
import StatGrid from '../components/ui/StatGrid';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatDate } from '../utils/formatters';
import { Plus, Play, Pause, CheckCircle2, Users as UsersIcon } from 'lucide-react';

const Production = () => {
    const dispatch = useDispatch();
    const { workOrders, stats, loading } = useSelector(state => state.production);

    useEffect(() => {
        dispatch(fetchWorkOrders());
        dispatch(fetchProductionStats());
    }, [dispatch]);

    const statItems = [
        { label: 'Active Jobs', value: stats.activeCount || 0, sub: 'Currently on floor' },
        { label: 'Completed Today', value: stats.completedToday || 0, trend: 15, sub: 'Target: 25 units' },
        { label: 'Avg Throughput', value: `${stats.throughput || 0} m³/hr`, sub: 'Peak performance' },
        { label: 'Floor Efficiency', value: `${stats.efficiency || 0}%`, trend: 2.5, sub: 'OEE aggregated' },
    ];

    return (
        <div className="w-full">
            <PageHeader
                title="Production Management"
                subtitle="Monitor work order progression and floor team assignments"
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm">
                        <Plus className="w-4 h-4" />
                        New Work Order
                    </button>
                }
            />

            <StatGrid stats={statItems} />

            <div className="grid grid-cols-1 gap-6 mb-10">
                <Card className="p-0 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/20">
                        <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Active Floor Work Orders</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> <span className="text-[10px] font-bold text-gray-500 uppercase">Processing</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> <span className="text-[10px] font-bold text-gray-500 uppercase">Queued</span></div>
                        </div>
                    </div>

                    {loading ? <div className="py-20 flex justify-center"><Spinner /></div> : (
                        <div className="divide-y divide-gray-100">
                            {workOrders.map((wo) => (
                                <div key={wo._id} className="p-5 flex flex-col lg:flex-row lg:items-center gap-6 hover:bg-gray-50/50 transition-colors">
                                    {/* WO ID and Status */}
                                    <div className="w-32 flex-shrink-0">
                                        <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-tighter">Reference</p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-bold text-gray-900">{wo.woId}</span>
                                            {/* <Badge status={wo.status} /> */}
                                        </div>
                                    </div>

                                    {/* Product and Specs */}
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-tighter">Job Details</p>
                                        <h4 className="text-base font-bold text-gray-900">{wo.product}</h4>
                                        {/* <p className="text-xs text-gray-500 mt-1">Quantity: <span className="font-bold text-gray-700">{wo.quantity} {wo.unit}</span> &bull; Species: <span className="font-bold text-gray-700">{wo.species}</span></p> */}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-tighter">Quantity</p>
                                        {/* <h4 className="text-base font-bold text-gray-900">{wo.product}</h4> */}
                                        <p className="text-sm text-gray-500 mt-1"><span className="font-bold text-gray-700">{wo.quantity} {wo.unit}</span></p>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-tighter">Species</p>
                                        {/* <h4 className="text-base font-bold text-gray-900">{wo.product}</h4> */}
                                        <p className="text-sm text-gray-500 mt-1"> <span className="font-bold text-gray-700">{wo.species}</span></p>
                                    </div>

                                    {/* Team and Deadlines */}
                                    <div className="w-48">
                                        <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-tighter">DUE</p>
                                        {/* <div className="flex items-center gap-2 mb-1">
                                            <UsersIcon className="w-3.5 h-3.5 text-gray-400" />
                                            <p className="text-xs font-bold text-gray-700">{wo.team || 'Unassigned'}</p>
                                        </div> */}
                                        <p className="text-[14px] text-gray-700 font-medium uppercase tracking-tighter">{formatDate(wo.dueDate)}</p>
                                    </div>

                                    {/* Progress */}
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-400 ms-4 mb-1.5 uppercase tracking-tighter">Status</p>
                                        <Badge status={wo.status} />

                                        {/* <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Progression</span>
                                            <span className="text-[11px] font-bold text-gray-900">{wo.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gray-900 transition-all duration-1000" style={{ width: `${wo.progress}%` }}></div>
                                        </div> */}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 px-4">
                                        {/* {wo.status === 'in_progress' ? (
                                            <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><Pause className="w-4 h-4 fill-current" /></button>
                                        ) : (
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"><Play className="w-4 h-4 fill-current" /></button>
                                        )} */}
                                        <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold border border-gray-200 rounded-lg text-gray-600 uppercase hover:border-black hover:text-black hover:bg-white transition-all shadow-sm">Update Progress</button>
                                    </div>
                                </div>
                            ))}
                            {workOrders.length === 0 && <p className="p-10 text-center text-gray-400 text-sm italic">No workspace production jobs active</p>}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Production;
