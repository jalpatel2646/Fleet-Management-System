import React, { useState, useEffect } from 'react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';
import { useConfirm, useToast } from '../context/ConfirmContext';
import { Loader2, Plus, Fuel, DollarSign, TrendingUp, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard, AnimatedButton } from '../components/AnimatedComponents';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        vehicle: '',
        type: 'Fuel',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        liters: '',
        serviceType: '',
        description: ''
    });

    const { token } = useAuth();
    const confirm = useConfirm();
    const toast = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [expRes, vehRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/vehicles')
            ]);
            setExpenses(expRes.data);
            setVehicles(vehRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                vehicle: formData.vehicle,
                type: formData.type,
                amount: Number(formData.amount),
                date: formData.date,
                details: {
                    liters: formData.type === 'Fuel' ? Number(formData.liters) : undefined,
                    serviceType: formData.type === 'Maintenance' ? formData.serviceType : undefined,
                    description: formData.description
                }
            };

            await api.post('/expenses', payload);
            toast('Entry added successfully', 'success');
            setIsModalOpen(false);
            setFormData({
                vehicle: '',
                type: 'Fuel',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                liters: '',
                serviceType: '',
                description: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error adding expense:', error);
            toast(error.response?.data?.message || 'Failed to add entry', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteExpense = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Expense Entry',
            message: 'Are you sure you want to permanently remove this expense record?',
            confirmText: 'Delete Record',
            type: 'danger'
        });

        if (!isConfirmed) return;

        try {
            await api.delete(`/expenses/${id}`);
            toast('Entry deleted', 'success');
            setExpenses(expenses.filter(e => e._id !== id));
        } catch (error) {
            toast('Failed to delete entry', 'error');
        }
    };

    const totalFuelCost = expenses.filter(e => e.type === 'Fuel').reduce((s, e) => s + e.amount, 0);
    const totalMaintCost = expenses.filter(e => e.type === 'Maintenance').reduce((s, e) => s + e.amount, 0);
    const totalLiters = expenses.reduce((s, e) => s + (e.details?.liters || 0), 0);

    const KPICard = ({ label, value, icon: Icon, iconColor, iconBg }) => (
        <AnimatedCard style={{ flex: '1 1 0', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>{label}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={iconColor} />
                </div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0 }}>{value}</h2>
        </AnimatedCard>
    );

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Loader2 className="animate-spin" size={40} color="#6366f1" />
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Fuel &amp; Expenses</h1>
                    <p style={{ fontSize: '14px', color: '#555', margin: 0, fontWeight: 500 }}>
                        <span style={{ color: '#818cf8', fontWeight: 700 }}>{expenses.length}</span> total entries
                    </p>
                </motion.div>
                <AnimatedButton variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={17} /> Add Entry
                </AnimatedButton>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'flex', gap: '16px' }}>
                <KPICard label="Total Fuel Cost" value={`$${totalFuelCost.toLocaleString()}`} icon={Fuel} iconColor="#fbbf24" iconBg="rgba(251,191,36,0.15)" />
                <KPICard label="Maintenance Cost" value={`$${totalMaintCost.toLocaleString()}`} icon={DollarSign} iconColor="#ef4444" iconBg="rgba(239,68,68,0.15)" />
                <KPICard label="Total Liters" value={totalLiters.toLocaleString()} icon={TrendingUp} iconColor="#3b82f6" iconBg="rgba(59,130,246,0.15)" />
            </div>

            {/* Table */}
            <div style={{ background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1e1e1e', background: '#0f0f0f' }}>
                                {['Vehicle', 'Type', 'Date', 'Amount', 'Liters/Service', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '14px 22px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {expenses.map((exp, idx) => (
                                    <motion.tr
                                        key={exp._id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onMouseEnter={() => setHoveredRow(exp._id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        style={{ borderBottom: '1px solid #1a1a1a', background: hoveredRow === exp._id ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.2s' }}
                                    >
                                        <td style={{ padding: '16px 22px', color: '#e2e8f0', fontWeight: 700, fontFamily: 'monospace' }}>{exp.vehicle?.plateNumber || 'N/A'}</td>
                                        <td style={{ padding: '16px 22px' }}>
                                            <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: exp.type === 'Fuel' ? 'rgba(251,191,36,0.1)' : 'rgba(239,68,68,0.1)', color: exp.type === 'Fuel' ? '#fbbf24' : '#ef4444' }}>{exp.type}</span>
                                        </td>
                                        <td style={{ padding: '16px 22px', color: '#888', fontSize: '13px' }}>{new Date(exp.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px 22px', color: '#fff', fontWeight: 800 }}>${exp.amount.toLocaleString()}</td>
                                        <td style={{ padding: '16px 22px', color: '#94a3b8', fontSize: '13px' }}>
                                            {exp.type === 'Fuel' ? `${exp.details?.liters}L` : exp.details?.serviceType || '-'}
                                        </td>
                                        <td style={{ padding: '16px 22px' }}>
                                            <button onClick={() => handleDeleteExpense(exp._id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#141414', border: '1px solid #222', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Add Expense Entry</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#555', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Vehicle</label>
                                    <select required value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff' }}>
                                        <option value="">Select Vehicle</option>
                                        {vehicles.map(v => <option key={v._id} value={v._id}>{v.plateNumber} ({v.model})</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#555', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Type</label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff' }}>
                                        <option value="Fuel">Fuel</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#555', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Amount ($)</label>
                                    <input required type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#555', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Date</label>
                                    <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff' }} />
                                </div>
                            </div>

                            {formData.type === 'Fuel' ? (
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#555', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Liters</label>
                                    <input required type="number" value={formData.liters} onChange={(e) => setFormData({ ...formData, liters: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff' }} />
                                </div>
                            ) : (
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#555', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Service Type</label>
                                    <input required type="text" placeholder="e.g. Oil Change, Tire Rotation" value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff' }} />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#555', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Description</label>
                                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff', resize: 'none' }}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <AnimatedButton variant="secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Cancel</AnimatedButton>
                                <AnimatedButton type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>
                                    {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Save Entry'}
                                </AnimatedButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
