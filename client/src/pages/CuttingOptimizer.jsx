import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOptimizationRuns, runOptimizer, fetchOptimizerStats } from '../features/optimizer/optimizerSlice';
import { fetchLogs } from '../features/logs/logsSlice';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import StatGrid from '../components/ui/StatGrid';
import Spinner from '../components/ui/Spinner';
import { Scissors, Play, History, TrendingUp, Cpu, Info } from 'lucide-react';

const CuttingOptimizer = () => {
    const dispatch = useDispatch();
    const { runs, stats, loading, result } = useSelector(state => state.optimizer);
    const { logs } = useSelector(state => state.logs);
    
    const [formData, setFormData] = useState({ logId: '', targetProduct: 'Standard Planks', priority: 'normal' });

    useEffect(() => {
        dispatch(fetchOptimizationRuns());
        dispatch(fetchOptimizerStats());
        dispatch(fetchLogs({ status: 'available' }));
    }, [dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(runOptimizer(formData));
    };

    const statItems = [
        { label: 'Calculated Yield', value: `${(stats.avgYield || 0).toFixed(1)}%`, trend: 2.1, sub: 'Avg across latest runs' },
        { label: 'Total Value Saved', value: `$${(stats.totalSaved || 0).toLocaleString()}`, sub: 'By waste reduction' },
        { label: 'Active Patterns', value: 42, sub: 'Validated templates' },
        { label: 'Core Engine Performance', value: '1.2s', sub: 'Calculated in real-time' },
    ];

    return (
        <div className="w-full">
            <PageHeader 
                title="Cutting Pattern Optimizer" 
                subtitle="Industrial-grade geometry engine for maximizing log yield and minimizing timber waste"
                actions={
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors">
                        <History className="w-4 h-4" /> Optimization History
                    </button>
                }
            />

            <StatGrid stats={statItems} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Control Panel */}
                <div className="lg:col-span-1">
                    <Card title="Optimizer Engine" subtitle="Input batch parameters for calculation">
                        <form onSubmit={onSubmit} className="space-y-5 mt-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Select Raw Log Feed</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
                                    value={formData.logId}
                                    onChange={(e) => setFormData({...formData, logId: e.target.value})}
                                    required
                                >
                                    <option value="">-- Choose log reference --</option>
                                    {logs.map(log => (
                                        <option key={log._id} value={log._id}>{log.logId} - {log.species} ({log.volume}m³)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target Product Pattern</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
                                    value={formData.targetProduct}
                                    onChange={(e) => setFormData({...formData, targetProduct: e.target.value})}
                                >
                                    <option>Standard Planks</option>
                                    <option>Dimension Boards</option>
                                    <option>Structural Beams</option>
                                    <option>Veneer Sheets</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Priority Scale</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['low', 'normal', 'high'].map(p => (
                                        <button 
                                            key={p}
                                            type="button"
                                            onClick={() => setFormData({...formData, priority: p})}
                                            className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${formData.priority === p ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-3">
                                <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <p className="text-[10px] text-amber-700 leading-normal font-medium">Optimization includes kerf allowance (4mm) and automatic off-cut detection for slabs above 5×5cm.</p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-3 shadow-lg shadow-black/10 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? <div className="flex items-center gap-3"><Spinner size="sm" className="border-t-white" /> Analyzing Geometry...</div> : <><Cpu className="w-4 h-4" /> Run Processor</>}
                            </button>
                        </form>
                    </Card>
                </div>

                {/* Live Analysis Display */}
                <div className="lg:col-span-2">
                    <Card className="h-full bg-gray-900 text-white border-0 shadow-xl overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Calculation Engine Output</h3>
                            </div>
                            <span className="text-[10px] font-mono text-white/30">V.3.1.2_BUILD_648</span>
                        </div>
                        
                        <div className="flex-1 p-8 flex flex-col items-center justify-center">
                            {loading ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 border-3 border-white/5 border-t-white rounded-full animate-spin mb-6"></div>
                                    <p className="text-sm font-mono text-white/60 mb-2">ACCESSING GEOMETRY KERNEL...</p>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-3 bg-white animate-pulse"></div>
                                        <div className="w-1 h-3 bg-white/40 animate-pulse delay-75"></div>
                                        <div className="w-1 h-3 bg-white/10 animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            ) : result ? (
                                <div className="w-full space-y-10 animate-in zoom-in-95 duration-500">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Yield Rate</p>
                                            <p className="text-3xl font-bold text-green-400">{result.yieldRate}%</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Slab Count</p>
                                            <p className="text-3xl font-bold">{result.patterns}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Waste Factor</p>
                                            <p className="text-3xl font-bold text-amber-400">{result.wasteRate}%</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Value Gain</p>
                                            <p className="text-3xl font-bold text-blue-400">+${result.valueSaved}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-center border-t border-white/5 pt-10">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8">Optimal Cutting Scheme</h4>
                                        <div className="w-full max-w-sm h-32 bg-white/5 rounded-lg border-2 border-white/10 relative overflow-hidden flex items-center justify-center group">
                                            <div className="absolute inset-4 rounded-full border-2 border-white/10 flex items-center justify-center p-2">
                                                <div className="w-full h-full border border-dashed border-white/20 rounded-full flex flex-wrap gap-1 p-3 overflow-hidden">
                                                    {[...Array(20)].map((_, i) => (
                                                        <div key={i} className="w-4 h-full bg-white/10 group-hover:bg-white/20 transition-all duration-700" style={{ height: `${Math.random() * 60 + 40}%` }}></div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-3 uppercase text-[9px] font-bold tracking-widest text-white/40">Visualizer Alpha Output</div>
                                        </div>
                                        <div className="flex gap-6 mt-8">
                                            <button className="text-[10px] font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-green-400 transition-colors">REPLY TO SAWMILL FAULT</button>
                                            <button className="text-[10px] font-bold border border-white/20 px-4 py-2 rounded-lg hover:border-white transition-colors">DOWNLOAD G-CODE</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4 max-w-xs opacity-30 select-none">
                                    <Cpu className="w-12 h-12 mx-auto mb-2" />
                                    <p className="text-sm font-medium tracking-tight">ENGINE IDLE. PLEASE INITIATE CALCULATION FROM THE CONTROL PANEL.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Run History */}
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Calculation Logs History</h2>
            <Card className="p-0 overflow-hidden mb-10">
                <DataTable 
                    headers={['Run Ref', 'Processed Date', 'Raw Material Log', 'Product Type', 'Yield %', 'Gain', 'Processing Status']}
                    data={runs}
                    renderRow={(run) => (
                        <>
                            <td className="px-5 py-4 text-[13px] font-bold text-gray-400">{run.runId}</td>
                            <td className="px-5 py-4 text-[13px] text-gray-500">{new Date(run.runDate).toLocaleString()}</td>
                            <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{run.log?.logId || 'LOG-FEED'}</td>
                            <td className="px-5 py-4 text-[13px] text-gray-700">{run.targetProduct}</td>
                            <td className="px-5 py-4 text-[13px] font-bold text-green-600">{run.yieldRate}%</td>
                            <td className="px-5 py-4 text-[13px] font-bold text-blue-600">+${run.valueSaved}</td>
                            <td className="px-5 py-4 text-[13px]"><Badge status="completed">Analyzed</Badge></td>
                        </>
                    )}
                />
            </Card>
        </div>
    );
};

export default CuttingOptimizer;
