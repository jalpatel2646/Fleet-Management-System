import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';
import {
    TrendingUp, DollarSign, Calendar, Truck, Activity,
    PieChart as PieIcon, ArrowUpRight, ArrowDownRight,
    Filter, Download, RefreshCw, Zap, Shield, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard, AnimatedNumber, StaggerContainer, StaggerItem, AnimatedButton } from '../components/AnimatedComponents';

const COLORS = {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    danger: '#f43f5e', // Rose
    info: '#06b6d4', // Cyan
};

const GRADIENTS = {
    primary: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
};

const Analytics = () => {
    const [data, setData] = useState({ vehicles: [], expenses: [], trips: [] });
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalExpenses: 0,
        activeVehicles: 0,
        avgEfficiency: 0,
        revenue: 0,
        costs: 0
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('Last 30 Days');

    const { token } = useAuth();
    const toast = useToast();

    useEffect(() => {
        totalTrips: trips.data.length,
            totalExpenses,
            activeVehicles: vehicles.data.filter(v => v.status === 'Available' || v.status === 'On Trip').length,
                avgEfficiency: 94.2,
                    revenue: mockRevenue,
                        costs: totalExpenses
    });

    setData({
        tripsByDay: [
            { name: 'Mon', trips: 14 }, { name: 'Tue', trips: 18 }, { name: 'Wed', trips: 15 },
            { name: 'Thu', trips: 22 }, { name: 'Fri', trips: 28 }, { name: 'Sat', trips: 12 }, { name: 'Sun', trips: 7 }
        ],
        expensesByType: [
            { name: 'Fuel', value: fuelExpenses || 4500, color: COLORS.warning },
            { name: 'Maintenance', value: maintExpenses || 2800, color: COLORS.danger },
            { name: 'Insurance', value: 1200, color: COLORS.primary },
            { name: 'Service', value: 900, color: COLORS.info }
        ],
        fleetUtilization: [
            { name: 'Week 1', rate: 75 }, { name: 'Week 2', rate: 82 }, { name: 'Week 3', rate: 88 }, { name: 'Week 4', rate: 91 }
        ],
        revenueVsCost: [
            { name: 'Jan', cost: 4200, revenue: 5800 },
            { name: 'Feb', cost: 3800, revenue: 6200 },
            { name: 'Mar', cost: 4500, revenue: 7100 },
            { name: 'Apr', cost: 4100, revenue: 6900 },
            { name: 'May', cost: 5200, revenue: 8400 },
            { name: 'Jun', cost: 4800, revenue: 8100 }
        ],
        driverPerformance: [
            { name: 'Safety', value: 92 },
            { name: 'Punctuality', value: 88 },
            { name: 'Efficiency', value: 85 },
            { name: 'Fuel Economy', value: 79 },
            { name: 'Maintenance', value: 94 }
        ]
    });
} catch (e) {
    console.error('Analytics load error:', e);
} finally {
    setLoading(false);
}
    };

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(20, 20, 20, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>{label}</p>
                {payload.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color || p.fill }} />
                        <span style={{ color: '#aaa', fontSize: '12px' }}>{p.name}: </span>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}>
                            {p.name.includes('Revenue') || p.name.includes('Cost') || p.name.includes('Value') ? `₹${p.value.toLocaleString()}` : `${p.value}%`}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(99, 102, 241, 0.1)', borderTop: '4px solid #6366f1' }}
        />
    </div>
);

return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                        padding: '8px', background: 'rgba(99, 102, 241, 0.15)',
                        borderRadius: '10px', color: '#6366f1'
                    }}>
                        <Activity size={24} />
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Intelligence Hub</h1>
                </div>
                <p style={{ fontSize: '15px', color: '#666', margin: 0, fontWeight: 500 }}>Deep-dive analytics for performance optimization.</p>
            </motion.div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '4px' }}>
                    {['7D', '30D', '90D', 'ALL'].map(r => (
                        <button
                            key={r}
                            onClick={() => setTimeRange(r === '30D' ? 'Last 30 Days' : r)}
                            style={{
                                padding: '8px 16px', borderRadius: '10px', border: 'none',
                                background: timeRange.includes(r) ? '#4f46e5' : 'transparent',
                                color: timeRange.includes(r) ? '#fff' : '#888',
                                fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                <AnimatedButton variant="secondary" onClick={loadAnalytics}>
                    <RefreshCw size={16} /> Sync
                </AnimatedButton>
                <AnimatedButton variant="primary">
                    <Download size={16} /> Export
                </AnimatedButton>
            </div>
        </div>

        {/* Quick Stats Grid */}
        <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
                { label: 'Market Revenue', value: stats.revenue, prefix: '₹', icon: TrendingUp, color: COLORS.success, trend: '+24.5%', sub: 'vs last month' },
                { label: 'Operational Cost', value: stats.costs, prefix: '₹', icon: DollarSign, color: COLORS.danger, trend: '-3.2%', sub: 'vs projected' },
                { label: 'Fleet Efficiency', value: stats.avgEfficiency, suffix: '%', icon: Zap, color: COLORS.info, trend: '+1.8%', sub: 'Real-time score' },
                { label: 'Compliance Score', value: 98.4, suffix: '%', icon: Shield, color: COLORS.primary, trend: 'Optimal', sub: 'Security & Safety' },
            ].map((s, i) => (
                <StaggerItem key={i}>
                    <AnimatedCard style={{
                        padding: '24px', position: 'relative', overflow: 'hidden',
                        background: 'rgba(20, 20, 20, 0.4)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${s.color}20`
                    }}>
                        <div style={{
                            position: 'absolute', top: '-20px', right: '-20px',
                            width: '80px', height: '80px', background: `${s.color}10`,
                            borderRadius: '50%', filter: 'blur(30px)'
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px',
                                background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: `1px solid ${s.color}30`
                            }}>
                                <s.icon size={22} color={s.color} />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    color: s.trend.includes('+') ? COLORS.success : s.trend.includes('-') ? COLORS.danger : s.color,
                                    fontSize: '12px', fontWeight: 800
                                }}>
                                    {s.trend.includes('+') ? <ArrowUpRight size={14} /> : s.trend.includes('-') ? <ArrowDownRight size={14} /> : null}
                                    {s.trend}
                                </div>
                                <span style={{ fontSize: '11px', color: '#444', fontWeight: 600 }}>{s.sub}</span>
                            </div>
                        </div>

                        <p style={{ fontSize: '11px', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</p>
                        <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-1px' }}>
                            {s.prefix}<AnimatedNumber value={s.value} />{s.suffix}
                        </h2>
                    </AnimatedCard>
                </StaggerItem>
            ))}
        </StaggerContainer>

        {/* Main Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
            {/* Revenue vs Cost Line Chart */}
            <AnimatedCard style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>Revenue & Expenditure Flux</h3>
                        <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0', fontWeight: 600 }}>Monthly financial flow analysis</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: COLORS.primary }} />
                            <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>Revenue</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: COLORS.danger }} />
                            <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>Cost</span>
                        </div>
                    </div>
                </div>

                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.revenueVsCost} margin={{ left: -20, right: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#333"
                                fontSize={12}
                                fontWeight={600}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#333"
                                fontSize={11}
                                fontWeight={600}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `₹${v / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                name="Revenue"
                                type="monotone"
                                dataKey="revenue"
                                stroke={COLORS.primary}
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                animationDuration={2000}
                            />
                            <Area
                                name="Cost"
                                type="monotone"
                                dataKey="cost"
                                stroke={COLORS.danger}
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorCost)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </AnimatedCard>

            {/* Expense Pie Chart */}
            <AnimatedCard style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>Expenditure DNA</h3>
                    <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0', fontWeight: 600 }}>Breaking down where capital flows</p>
                </div>

                <div style={{ height: '260px', width: '100%', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.expensesByType}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="value"
                                animationDuration={1500}
                            >
                                {data.expensesByType.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        textAlign: 'center', pointerEvents: 'none'
                    }}>
                        <p style={{ fontSize: '11px', color: '#555', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>Total</p>
                        <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: 0 }}>₹{(stats.totalExpenses / 1000).toFixed(1)}k</h4>
                    </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.expensesByType.map((ex, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: ex.color }} />
                                <span style={{ fontSize: '13px', color: '#888', fontWeight: 600 }}>{ex.name}</span>
                            </div>
                            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>₹{ex.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </AnimatedCard>
        </div>

        {/* Bottom Section: Bar Chart & Driver Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px' }}>
            {/* Fleet Utilization Bar */}
            <AnimatedCard style={{ padding: '32px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>Fleet Activity</h3>
                    <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0', fontWeight: 600 }}>Utilization intensity per week</p>
                </div>

                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.fleetUtilization} margin={{ left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="name" stroke="#333" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#333" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar
                                dataKey="rate"
                                name="Utilization"
                                fill={COLORS.primary}
                                radius={[8, 8, 2, 2]}
                                barSize={40}
                                animationDuration={2000}
                            >
                                {data.fleetUtilization.map((entry, index) => (
                                    <Cell key={index} fill={index === 3 ? COLORS.success : COLORS.primary} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </AnimatedCard>

            {/* Performance Insights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <AnimatedCard style={{ padding: '28px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>Performance Benchmark</h3>
                            <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0', fontWeight: 600 }}>Core operational metrics vs industry standard</p>
                        </div>
                        <div style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: COLORS.success, fontSize: '12px', fontWeight: 800 }}>
                            HIGH PERFORMANCE
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {data.driverPerformance.map((p, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '13px', color: '#aaa', fontWeight: 600 }}>{p.name}</span>
                                        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 800 }}>{p.value}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${p.value}%` }}
                                            transition={{ duration: 1.5, delay: i * 0.1 }}
                                            style={{
                                                height: '100%',
                                                background: p.value > 90 ? COLORS.success : p.value > 80 ? COLORS.primary : COLORS.warning,
                                                borderRadius: '3px'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.02)', borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.05)', padding: '24px',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '11px', color: '#555', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Overall IQ Score</p>
                                <h4 style={{ fontSize: '48px', fontWeight: 900, color: COLORS.primary, margin: 0, letterSpacing: '-2px' }}>
                                    <AnimatedNumber value={89.4} />
                                </h4>
                                <p style={{ fontSize: '13px', color: '#888', fontWeight: 600, marginTop: '4px' }}>System Health: <span style={{ color: COLORS.success }}>Alpha</span></p>
                            </div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <p style={{ fontSize: '10px', color: '#444', fontWeight: 800, margin: '0 0 4px' }}>SECURITY</p>
                                    <p style={{ fontSize: '14px', color: '#eee', fontWeight: 700, margin: 0 }}>99.9%</p>
                                </div>
                                <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <p style={{ fontSize: '10px', color: '#444', fontWeight: 800, margin: '0 0 4px' }}>UPTIME</p>
                                    <p style={{ fontSize: '14px', color: '#eee', fontWeight: 700, margin: 0 }}>100%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedCard>
            </div>
        </div>
    </div>
);
};

export default Analytics;
