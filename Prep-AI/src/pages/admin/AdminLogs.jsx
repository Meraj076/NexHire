import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { FileWarning, RefreshCw, Trash2, AlertTriangle, XCircle } from 'lucide-react';

const StatusBadge = ({ code }) => {
    if (code >= 500) return <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-full">{code}</span>;
    if (code >= 400) return <span className="px-2 py-0.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-mono rounded-full">{code}</span>;
    return <span className="px-2 py-0.5 bg-[#849584]/10 border border-[#849584]/20 text-[#849584] text-[10px] font-mono rounded-full">{code}</span>;
};

export default function AdminLogs() {
    const [logs, setLogs]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [filter, setFilter]       = useState('all');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [clearConfirm, setClearConfirm] = useState(false);
    const intervalRef = useRef(null);

    const fetchLogs = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await API.get('/api/v1/admin/logs');
            setLogs(res.data);
        } catch {
            if (!silent) toast.error('Failed to load logs');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    // Auto-refresh every 30s
    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(() => fetchLogs(true), 30000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [autoRefresh]);

    const clearLogs = async () => {
        try {
            await API.delete('/api/v1/admin/logs');
            toast.success('All error logs cleared.');
            setClearConfirm(false);
            fetchLogs();
        } catch { toast.error('Failed to clear logs'); }
    };

    const filtered = logs.filter(l => {
        if (filter === '5xx') return l.httpStatus >= 500;
        if (filter === '4xx') return l.httpStatus >= 400 && l.httpStatus < 500;
        return true;
    });

    return (
        <div className="flex h-screen bg-[#121414] text-[#e2e2e2] font-sans overflow-hidden">
            <AdminSidebar />
            <main className="flex-grow overflow-y-auto relative pt-14 md:pt-0">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a2c2c] pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#e2e2e2] flex items-center gap-3">
                                <FileWarning size={28} className="text-red-400" /> Support & Error Logs
                            </h1>
                            <p className="text-sm font-mono text-[#849584] mt-1">
                                {logs.length} total events — API failures captured automatically
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Auto-refresh toggle */}
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
                                    autoRefresh
                                        ? 'bg-[#00e472]/10 border-[#00e472]/20 text-[#00e472]'
                                        : 'bg-[#1e2020] border-[#2a2c2c] text-[#849584]'
                                }`}
                            >
                                <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} />
                                {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
                            </button>
                            <button onClick={() => fetchLogs()} className="flex items-center gap-2 px-4 py-2 bg-[#1e2020] border border-[#2a2c2c] rounded-xl text-xs font-mono text-[#849584] hover:text-[#00e472] hover:border-[#00e472]/30 transition-all">
                                <RefreshCw size={12} /> Refresh
                            </button>
                            <button onClick={() => setClearConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/20 transition-all">
                                <Trash2 size={12} /> Clear All
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-[#e2e2e2]">{logs.length}</p>
                            <p className="font-mono text-xs text-[#849584] mt-1">Total Errors</p>
                        </div>
                        <div className="bg-[#1e2020] border border-yellow-400/20 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-yellow-400">{logs.filter(l => l.httpStatus >= 400 && l.httpStatus < 500).length}</p>
                            <p className="font-mono text-xs text-[#849584] mt-1">4xx Errors</p>
                        </div>
                        <div className="bg-[#1e2020] border border-red-500/20 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-red-400">{logs.filter(l => l.httpStatus >= 500).length}</p>
                            <p className="font-mono text-xs text-[#849584] mt-1">5xx Errors</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        {[['all', 'All Logs'], ['5xx', '5xx Server Errors'], ['4xx', '4xx Client Errors']].map(([val, lbl]) => (
                            <button
                                key={val}
                                onClick={() => setFilter(val)}
                                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                                    filter === val
                                        ? 'bg-[#00e472]/10 border border-[#00e472]/20 text-[#00e472]'
                                        : 'bg-[#1e2020] border border-[#2a2c2c] text-[#849584] hover:text-[#e2e2e2]'
                                }`}
                            >
                                {lbl}
                            </button>
                        ))}
                    </div>

                    {/* Log Table */}
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="w-8 h-8 border-2 border-[#00e472] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#2a2c2c] bg-[#1a1c1c]">
                                            {['Time', 'Endpoint', 'User', 'Status', 'Error Message'].map(h => (
                                                <th key={h} className="px-5 py-3 text-left font-mono text-xs text-[#849584] uppercase whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2a2c2c]">
                                        {filtered.map(log => (
                                            <tr key={log.id} className="hover:bg-[#1a1c1c] transition-colors">
                                                <td className="px-5 py-3 font-mono text-xs text-[#849584] whitespace-nowrap">
                                                    {new Date(log.occurredAt).toLocaleString()}
                                                </td>
                                                <td className="px-5 py-3 font-mono text-xs text-[#00e472] whitespace-nowrap">{log.endpoint}</td>
                                                <td className="px-5 py-3 font-mono text-xs text-[#849584]">{log.userEmail || '—'}</td>
                                                <td className="px-5 py-3"><StatusBadge code={log.httpStatus} /></td>
                                                <td className="px-5 py-3 text-xs text-[#e2e2e2] max-w-xs">
                                                    <p className="truncate" title={log.errorMessage}>{log.errorMessage}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filtered.length === 0 && (
                                <div className="text-center py-16 text-[#849584]">
                                    <XCircle size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="font-mono text-sm">No error logs found.</p>
                                    <p className="font-mono text-xs mt-1">The system is running clean 🎉</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Clear Confirm Modal */}
                {clearConfirm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#1e2020] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertTriangle size={20} className="text-red-400" />
                                <h3 className="font-bold text-[#e2e2e2]">Clear All Logs?</h3>
                            </div>
                            <p className="text-sm text-[#849584] mb-5">This will permanently delete all {logs.length} error log entries from the database.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setClearConfirm(false)} className="flex-1 px-4 py-2 bg-[#2a2c2c] rounded-xl text-sm font-mono text-[#e2e2e2] hover:bg-[#333535]">Cancel</button>
                                <button onClick={clearLogs} className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-sm font-mono text-red-400 hover:bg-red-500/30">Clear All</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
