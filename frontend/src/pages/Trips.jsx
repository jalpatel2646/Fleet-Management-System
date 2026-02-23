import React, { useState, useEffect } from 'react';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';
import { useConfirm, useToast } from '../context/ConfirmContext';
import { Plus, ChevronDown, Navigation, Check, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '../components/AnimatedComponents';

/* ═══════════════════════════════════════════
   STATUS BADGE CONFIG
   ═══════════════════════════════════════════ */
const STATUS_CONFIG = {
    Dispatched: { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: 'rgba(59,130,246,0.25)' },
    Completed: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
    Draft: { bg: 'rgba(100,116,139,0.12)', color: '#94A3B8', border: 'rgba(100,116,139,0.25)' },
    Cancelled: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [hoveredRow, setHoveredRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        tripId: '',
        vehicle: '',
        driver: '',
        origin: '',
        destination: '',
        cargoWeight: '',
        status: 'Draft',
    });

    const { token } = useAuth();
    const toast = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tripsRes, vehRes, driRes] = await Promise.all([
                api.get('/trips'),
                api.get('/vehicles'),
                api.get('/drivers')
            ]);
            setTrips(tripsRes.data);
            setVehicles(vehRes.data.filter(v => v.status === 'Available'));
            setDrivers(driRes.data.filter(d => d.status === 'Off Duty'));
        } catch (error) {
            console.error('Error fetching data:', error);
            toast('Failed to load trips data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrip = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                cargoWeight: Number(formData.cargoWeight),
            };
            await api.post('/trips', payload);
            toast('Trip created successfully', 'success');
            setIsModalOpen(false);
            setFormData({
                tripId: '', vehicle: '', driver: '',
                origin: '', destination: '', cargoWeight: '', status: 'Draft'
            });
            fetchData();
        } catch (error) {
            toast(error.response?.data?.error || 'Failed to create trip', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCompleteTrip = async (id) => {
        const isConfirmed = await confirm({
            title: 'Complete Trip',
            message: 'Are you sure you want to mark this trip as completed?',
            confirmText: 'Complete',
            type: 'primary'
        });
        if (!isConfirmed) return;

        try {
            await api.patch(`/trips/${id}/complete`, {});
            toast('Trip completed', 'success');
            fetchData();
        } catch (error) {
            toast('Failed to complete trip', 'error');
        }
    };

    const handleDeleteTrip = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Trip',
            message: 'Are you sure you want to delete this trip record?',
            confirmText: 'Delete',
            type: 'danger'
        });
        if (!isConfirmed) return;

        try {
            await api.delete(`/trips/${id}`);
            toast('Trip deleted', 'success');
            setTrips(trips.filter(t => t._id !== id));
        } catch (error) {
            toast('Failed to delete trip', 'error');
        }
    };

    const statuses = ['All Statuses', 'Dispatched', 'Completed', 'Draft', 'Cancelled'];

    const filteredTrips = statusFilter === 'All Statuses'
        ? trips
        : trips.filter((t) => t.status === statusFilter);

    const renderActions = (trip) => {
        return (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {trip.status === 'Dispatched' && (
                    <button
                        onClick={() => handleCompleteTrip(trip._id)}
                        title="Complete"
                        style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            border: '1px solid rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.1)',
                            color: '#4ade80', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Check size={14} />
                    </button>
                )}
                <button
                    onClick={() => handleDeleteTrip(trip._id)}
                    title="Delete"
                    style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.1)',
                        color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        );
    };

    const renderBadge = (status) => {
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Draft;
        return (
            <span style={{
                display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px',
                fontSize: '11px', fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                textTransform: 'uppercase', letterSpacing: '0.02em'
            }}>
                {status}
            </span>
        );
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Loader2 className="animate-spin" size={40} color="#3b82f6" />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', padding: '36px 40px', color: '#e2e8f0', margin: '-40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px' }}>Trips</h1>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                appearance: 'none', padding: '8px 36px 8px 14px', borderRadius: '8px',
                                border: '1px solid #2a2a2a', background: '#141414', color: '#94A3B8',
                                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                            }}
                        >
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={14} color="#555" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                </div>

                <AnimatedButton variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} /> New Trip
                </AnimatedButton>
            </div>

            {/* Table */}
            <div style={{ background: '#141414', borderRadius: '14px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '960px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1e1e1e', background: '#0f0f0f' }}>
                                {['Route', 'Vehicle', 'Driver', 'Cargo', 'Status', 'Actions'].map((h, i) => (
                                    <th key={h} style={{ padding: '14px 20px', textAlign: i === 5 ? 'center' : 'left', fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredTrips.map((trip) => (
                                    <motion.tr
                                        key={trip._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onMouseEnter={() => setHoveredRow(trip._id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: hoveredRow === trip._id ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.2s' }}
                                    >
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{trip.origin}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '12px' }}>
                                                    <Navigation size={10} style={{ transform: 'rotate(135deg)' }} /> {trip.destination}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', background: 'rgba(129,140,248,0.1)', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                                                {trip.vehicle?.plateNumber || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#cbd5e1', fontSize: '13px' }}>{trip.driver?.name || 'N/A'}</td>
                                        <td style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '13px' }}>{trip.cargoWeight} kg</td>
                                        <td style={{ padding: '16px 20px' }}>{renderBadge(trip.status)}</td>
                                        <td style={{ padding: '16px 20px' }}>{renderActions(trip)}</td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredTrips.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>No trips found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0 }}>Create New Trip</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: '#1a1a1a', border: 'none', color: '#64748b', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleCreateTrip} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Trip ID</label>
                                    <input required type="text" placeholder="e.g. TRP-101" value={formData.tripId} onChange={(e) => setFormData({ ...formData, tripId: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#111', border: '1px solid #222', color: '#fff' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Cargo Weight (kg)</label>
                                    <input required type="number" placeholder="2800" value={formData.cargoWeight} onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#111', border: '1px solid #222', color: '#fff' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vehicle</label>
                                    <select required value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#111', border: '1px solid #222', color: '#fff' }}>
                                        <option value="">Select Vehicle</option>
                                        {vehicles.map(v => <option key={v._id} value={v._id}>{v.plateNumber} ({v.model})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Driver</label>
                                    <select required value={formData.driver} onChange={(e) => setFormData({ ...formData, driver: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#111', border: '1px solid #222', color: '#fff' }}>
                                        <option value="">Select Driver</option>
                                        {drivers.map(d => <option key={d._id} value={d._id}>{d.name} ({d.licenseNumber})</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Origin</label>
                                    <input required type="text" placeholder="Los Angeles, CA" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#111', border: '1px solid #222', color: '#fff' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Destination</label>
                                    <input required type="text" placeholder="San Francisco, CA" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#111', border: '1px solid #222', color: '#fff' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <AnimatedButton variant="secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Cancel</AnimatedButton>
                                <AnimatedButton type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>
                                    {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Dispatch Trip'}
                                </AnimatedButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Trips;
