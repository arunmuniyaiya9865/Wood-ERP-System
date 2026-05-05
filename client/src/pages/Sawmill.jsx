import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachines, fetchQueue } from '../features/sawmill/sawmillSlice';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import DataTable from '../components/ui/DataTable';
import { Monitor, Play, RotateCcw, AlertTriangle, User } from 'lucide-react';

const Sawmill = () => {
    const dispatch = useDispatch();
    const { machines, queue, loading } = useSelector(state => state.sawmill);

    useEffect(() => {
        dispatch(fetchMachines());
        dispatch(fetchQueue());
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'active': return 'bg-green-500';
            case 'idle': return 'bg-amber-500';
            case 'maintenance': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="w-full">
            <PageHeader 
                title="Sawmill Operations" 
                subtitle="Live status of production machinery and log processing queue"
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm">
                        <RotateCcw className="w-4 h-4" />
                        Refresh Live Feed
                    </button>
                }
            />

            {/* Machine Monitor Grid */}
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Industrial Asset Monitor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {machines.map((machine) => (
                    <Card key={machine.machineId} className="relative group">
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(machine.status)}`}></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{machine.status}</span>
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shadow-inner group-hover:bg-white transition-colors">
                                <Monitor className="w-6 h-6 text-gray-900" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 leading-tight">{machine.name}</h3>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter mt-0.5">{machine.type}</p>
                            </div>
                        </div>

                        {machine.status === 'active' && (
                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50/80 rounded-lg border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        <span className="text-xs font-bold text-gray-700">{machine.currentLog?.logId || 'LOG-5524'}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Processing...</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                        <span>Live Efficiency</span>
                                        <span className="text-black">{machine.efficiency}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-black rounded-full" style={{ width: `${machine.efficiency}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {machine.status === 'idle' && (
                            <div className="py-6 flex flex-col items-center justify-center border-t border-dashed border-gray-200 mt-2">
                                <p className="text-xs text-gray-400 font-medium mb-3 italic">Awaiting Log from queue</p>
                                <button className="flex items-center gap-2 px-5 py-1.5 bg-gray-900 text-white border border-black rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all">
                                    <Play className="w-3 h-3 fill-current" /> Assign Task
                                </button>
                            </div>
                        )}

                        {machine.status === 'maintenance' && (
                            <div className="py-6 flex flex-col items-center justify-center border-t border-dashed border-gray-200 mt-2">
                                <AlertTriangle className="w-6 h-6 text-red-500 mb-2 animate-bounce" />
                                <p className="text-xs text-red-600 font-bold uppercase tracking-tighter">Machine Down</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">EST. Return: 14:00 PM</p>
                            </div>
                        )}

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                                    <User className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                <span className="text-[11px] font-bold text-gray-600">{machine.operator?.name || 'Unassigned'}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded-md uppercase">{machine.machineId}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Processing Queue */}
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Log Processing Queue</h2>
            <Card className="p-0 overflow-hidden mb-10">
                {loading ? <div className="py-20 flex justify-center"><Spinner /></div> : (
                    <DataTable 
                        headers={['Pos.', 'Reference ID', 'Timber Species', 'Grade', 'Volume (m³)', 'Avg. Processing ET', 'Priority']}
                        data={queue}
                        renderRow={(log, idx) => (
                            <>
                                <td className="px-5 py-4 text-[13px] font-bold text-gray-400">#{(idx + 1).toString().padStart(2, '0')}</td>
                                <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{log.logId}</td>
                                <td className="px-5 py-4 text-[13px] font-medium text-gray-700">{log.species}</td>
                                <td className="px-5 py-4 text-[13px]"><Badge status={log.grade.startsWith('A') ? 'approved' : 'warning'}>{log.grade}</Badge></td>
                                <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{log.volume}</td>
                                <td className="px-5 py-4 text-[13px] text-gray-500">12:45m</td>
                                <td className="px-5 py-4 text-[13px]"><Badge status={idx < 2 ? 'critical' : 'idle'}>{idx < 2 ? 'High' : 'Normal'}</Badge></td>
                            </>
                        )}
                    />
                )}
            </Card>
        </div>
    );
};

export default Sawmill;
