import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';
import { Bot, Video, FileText, Activity, TrendingUp } from 'lucide-react';

const BigNum = ({ value, label, color = 'text-[#00e472]' }) => (
    <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl p-6 text-center flex flex-col items-center gap-2">
        <span className={`text-5xl font-bold ${color}`}>{value}</span>
        <span className="font-mono text-xs text-[#849584] uppercase tracking-widest">{label}</span>
    </div>
);

const ScoreBadge = ({ score }) => {
    const cls = score >= 80 ? 'text-[#00e472]' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
    return <span className={`font-mono font-bold text-sm ${cls}`}>{score}%</span>;
};

export default function AdminApiAnalytics() {
    const [usage, setUsage]           = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [resumes, setResumes]       = useState([]);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [uRes, iRes, rRes] = await Promise.all([
                    API.get('/api/v1/admin/api-usage'),
                    API.get('/api/v1/admin/interviews'),
                    API.get('/api/v1/admin/resumes'),
                ]);
                setUsage(uRes.data);
                setInterviews(iRes.data);
                setResumes(rRes.data);
            } catch (e) {
                console.error('Failed to load API analytics', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Estimate avg questions per interview from total interviews count
    const totalInterviews  = interviews.length;
    const completedCount   = interviews.filter(i => i.status === 'COMPLETED').length;
    const completionRate   = totalInterviews > 0 ? Math.round((completedCount / totalInterviews) * 100) : 0;
    const avgScore         = totalInterviews > 0 ? Math.round(interviews.reduce((a, i) => a + i.overallScore, 0) / totalInterviews) : 0;

    // Donut chart percentages
    const total     = (usage?.totalToday ?? 0) || 1;
    const iPercent  = Math.round(((usage?.todayInterviews ?? 0) / total) * 100);
    const rPercent  = 100 - iPercent;

    return (
        <div className="flex h-screen bg-[#121414] text-[#e2e2e2] font-sans overflow-hidden">
            <AdminSidebar />
            <main className="flex-grow overflow-y-auto relative pt-14 md:pt-0">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">

                    {/* Header */}
                    <div className="border-b border-[#2a2c2c] pb-6">
                        <h1 className="text-3xl font-bold text-[#e2e2e2] flex items-center gap-3">
                            <Bot size={28} className="text-[#00e472]" /> AI & API Analytics
                        </h1>
                        <p className="text-sm font-mono text-[#849584] mt-1">Monitor your Gemini API quota usage</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-[#00e472] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Big Numbers */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <BigNum value={usage?.todayInterviews ?? 0} label="Interview API Calls Today" />
                                <BigNum value={usage?.todayResumes ?? 0} label="Resume API Calls Today" color="text-blue-400" />
                                <BigNum value={usage?.totalToday ?? 0} label="Total Gemini Calls Today" color="text-yellow-400" />
                            </div>

                            {/* Donut + Completion Rate */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* API Split Donut */}
                                <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl p-6">
                                    <h3 className="font-semibold text-[#e2e2e2] mb-5 flex items-center gap-2">
                                        <Activity size={18} className="text-[#00e472]" /> Today's API Split
                                    </h3>
                                    <div className="flex items-center gap-8">
                                        {/* CSS Donut */}
                                        <div className="relative w-32 h-32 shrink-0">
                                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0c0f0f" strokeWidth="3.8" />
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3.8"
                                                    strokeDasharray={`${rPercent} ${100 - rPercent}`} strokeLinecap="round" />
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00e472" strokeWidth="3.8"
                                                    strokeDasharray={`${iPercent} ${100 - iPercent}`} strokeDashoffset={`-${rPercent}`} strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-xl font-bold text-[#e2e2e2]">{usage?.totalToday ?? 0}</span>
                                                <span className="text-[9px] font-mono text-[#849584] uppercase">Total</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="w-3 h-3 rounded-full bg-[#00e472] shrink-0" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between font-mono text-xs text-[#849584]">
                                                        <span>Interviews</span><span className="text-[#00e472]">{iPercent}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-[#0c0f0f] rounded-full mt-1">
                                                        <div className="h-full bg-[#00e472] rounded-full" style={{ width: `${iPercent}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-3 h-3 rounded-full bg-blue-400 shrink-0" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between font-mono text-xs text-[#849584]">
                                                        <span>Resumes</span><span className="text-blue-400">{rPercent}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-[#0c0f0f] rounded-full mt-1">
                                                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${rPercent}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Platform Health */}
                                <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl p-6 space-y-4">
                                    <h3 className="font-semibold text-[#e2e2e2] flex items-center gap-2">
                                        <TrendingUp size={18} className="text-[#00e472]" /> Platform Health
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between font-mono text-xs mb-1">
                                                <span className="text-[#849584]">Interview Completion Rate</span>
                                                <span className="text-[#00e472]">{completionRate}%</span>
                                            </div>
                                            <div className="h-2 bg-[#0c0f0f] rounded-full">
                                                <div className="h-full bg-gradient-to-r from-[#00e472] to-[#008f47] rounded-full" style={{ width: `${completionRate}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between font-mono text-xs mb-1">
                                                <span className="text-[#849584]">Average Interview Score</span>
                                                <span className="text-yellow-400">{avgScore}%</span>
                                            </div>
                                            <div className="h-2 bg-[#0c0f0f] rounded-full">
                                                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full" style={{ width: `${avgScore}%` }} />
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-[#2a2c2c] grid grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-[#e2e2e2]">{totalInterviews}</p>
                                                <p className="font-mono text-xs text-[#849584]">Total Interviews</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-[#e2e2e2]">{resumes.length}</p>
                                                <p className="font-mono text-xs text-[#849584]">Total Resumes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Interviews Table */}
                            <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#2a2c2c] flex items-center gap-2">
                                    <Video size={18} className="text-[#00e472]" />
                                    <h3 className="font-semibold text-[#e2e2e2]">All Interview Sessions</h3>
                                    <span className="ml-auto text-xs font-mono text-[#849584]">{totalInterviews} total</span>
                                </div>
                                <div className="overflow-x-auto max-h-80">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-[#1a1c1c]">
                                            <tr className="border-b border-[#2a2c2c]">
                                                {['User', 'Role Profile', 'Difficulty', 'Score', 'Status', 'Date'].map(h => (
                                                    <th key={h} className="px-5 py-3 text-left font-mono text-xs text-[#849584] uppercase">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#2a2c2c]">
                                            {interviews.map(i => (
                                                <tr key={i.id} className="hover:bg-[#1a1c1c] transition-colors">
                                                    <td className="px-5 py-3">
                                                        <p className="text-[#e2e2e2]">{i.username}</p>
                                                        <p className="text-xs font-mono text-[#849584]">{i.userEmail}</p>
                                                    </td>
                                                    <td className="px-5 py-3 text-[#e2e2e2]">{i.roleProfile}</td>
                                                    <td className="px-5 py-3 font-mono text-xs text-[#849584]">{i.difficulty}</td>
                                                    <td className="px-5 py-3"><ScoreBadge score={i.overallScore} /></td>
                                                    <td className="px-5 py-3">
                                                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${i.status === 'COMPLETED' ? 'text-[#00e472] border-[#00e472]/20 bg-[#00e472]/5' : 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5'}`}>
                                                            {i.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 font-mono text-xs text-[#849584] whitespace-nowrap">
                                                        {i.startTime ? new Date(i.startTime).toLocaleDateString() : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
