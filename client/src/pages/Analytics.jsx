import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKPITrends, fetchRevenueTrend, fetchProductionAnalytics, fetchAnalyticsStats } from '../features/analytics/analyticsSlice';
import PageHeader from '../components/ui/PageHeader';
import StatGrid from '../components/ui/StatGrid';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon, TrendingUp, Zap, Target, ShieldCheck } from 'lucide-react';

const Analytics = () => {
    const dispatch = useDispatch();
    const { kpiTrends, revenueTrend, productionAnalytics, stats, loading } = useSelector(state => state.analytics);

    useEffect(() => {
        dispatch(fetchKPITrends());
        dispatch(fetchRevenueTrend());
        dispatch(fetchProductionAnalytics());
        dispatch(fetchAnalyticsStats());
    }, [dispatch]);

    const statItems = [
        { label: 'Overall OEE', value: `${stats.oee || 0}%`, trend: 2.1, sub: 'Operational Effectiveness' },
        { label: 'Cust. Satisfaction', value: `${stats.customerSat || 0}%`, sub: 'Post-delivery NPS' },
        { label: 'On-Time Delivery', value: `${stats.otdRate || 0}%`, trend: 5.4, sub: 'Logistics SLA completion' },
        { label: 'FSC Compliance', value: `${stats.fscCompliance || 0}%`, sub: 'Certified chain of custody' },
    ];

    return (
        <div>
            <PageHeader 
                title="Industrial Analytics & BI" 
                subtitle="In-depth trend analysis, operational performance tracking, and strategic data visualization"
            />

            <StatGrid stats={statItems} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Long-term Revenue Trend */}
                <Card title="Revenue Growth" subtitle="YTD monthly revenue trajectory">
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrend}>
                                <defs>
                                    <linearGradient id="colorRevTarget" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#111111" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#111111" fillOpacity={1} fill="url(#colorRevTarget)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Efficiency Trends */}
                <Card title="KPI Momentum" subtitle="Operational health tracking (12 months)">
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kpiTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                <Line type="monotone" dataKey="yield" stroke="#111111" strokeWidth={2} dot={false} name="Yield %" />
                                <Line type="monotone" dataKey="satisfaction" stroke="#6B7280" strokeWidth={2} dot={false} name="Sat %" />
                                <Line type="monotone" dataKey="otd" stroke="#D1D5DB" strokeWidth={2} dot={false} name="OTD %" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Production Mix stacked Bar */}
            <Card title="Production Output Stack" subtitle="Weekly volume analysis by primary species">
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productionAnalytics}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                            <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} verticalAlign="top" height={36}/>
                            <Bar dataKey="Pine" stackId="a" fill="#111111" />
                            <Bar dataKey="Oak" stackId="a" fill="#4B5563" />
                            <Bar dataKey="Teak" stackId="a" fill="#9CA3AF" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
