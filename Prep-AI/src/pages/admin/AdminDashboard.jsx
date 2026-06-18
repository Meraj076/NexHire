import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';
import { Users, Video, FileText, TrendingUp, Activity, Cpu, Calendar, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon, label, value, sub, accent, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-[#1e2020] border border-[#2a2c2c] rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 ${
            onClick ? 'cursor-pointer hover:border-[#00e472]/40 hover:bg-[#232525]' : 'hover:border-[#00e472]/30'
        }`}
    >
        <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#849584] uppercase tracking-widest">{label}</span>
            <div className={`p-2 rounded-lg ${accent || 'bg-[#00e472]/10'}`}>{icon}</div>
        </div>
        <div className={`text-4xl font-bold tracking-tight ${accent ? 'text-yellow-400' : 'text-[#00e472]'}`}>{value}</div>
        {sub && <p className="text-xs text-[#849584] font-mono">{sub}</p>}
    </div>
);

const FeedBadge = ({ type }) => (
    type === 'INTERVIEW'
        ? <span className="px-2 py-0.5 bg-[#00e472]/10 border border-[#00e472]/20 text-[#00e472] text-[10px] font-mono rounded-full uppercase">Interview</span>
        : <span className="px-2 py-0.5 bg-blue-400/10 border border-blue-400/20 text-blue-400 text-[10px] font-mono rounded-full uppercase">Resume</span>
);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [sRes, aRes] = await Promise.all([
                    API.get('/api/v1/admin/stats'),
                    API.get('/api/v1/admin/activity'),
                ]);
                setStats(sRes.data);
                setActivity(aRes.data);
            } catch (e) {
                console.error('Failed to load admin dashboard', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const fmtScore = (s) => {
        if (s >= 80) return 'text-[#00e472]';
        if (s >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="flex h-screen bg-[#121414] text-[#e2e2e2] font-sans overflow-hidden">
            <AdminSidebar />
            <main className="flex-grow overflow-y-auto relative pt-14 md:pt-0">

                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00e472]/3 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 relative z-10 space-y-8">

                    {/* Header */}
                    <div className="flex items-end justify-between border-b border-[#2a2c2c] pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#e2e2e2]">Founder's Dashboard</h1>
                            <p className="text-sm font-mono text-[#849584] mt-1">Platform health at a glance</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#00e472] bg-[#00e472]/5 border border-[#00e472]/20 px-4 py-2 rounded-lg">
                            <Activity size={14} /> Live Data
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-[#00e472] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Stat Cards Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                <StatCard 
                                    onClick={() => navigate('/admin/users')}
                                    icon={<Users size={18} className="text-[#00e472]" />} 
                                    label="Total Users" 
                                    value={stats?.totalUsers ?? 0} 
                                    sub={`+${stats?.todaySignups ?? 0} today`} 
                                />
                                <StatCard 
                                    onClick={() => {
                                        const el = document.getElementById('recent-activity');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    icon={<Video size={18} className="text-[#00e472]" />} 
                                    label="Total Interviews" 
                                    value={stats?.totalInterviews ?? 0} 
                                    sub={`${stats?.todayInterviews ?? 0} via AI today`} 
                                />
                                <StatCard 
                                    onClick={() => navigate('/admin/analytics')}
                                    icon={<FileText size={18} className="text-[#00e472]" />} 
                                    label="Resumes Analysed" 
                                    value={stats?.totalResumes ?? 0} 
                                    sub={`${stats?.todayResumes ?? 0} analysed today`} 
                                />
                                <StatCard 
                                    onClick={() => navigate('/admin/analytics')}
                                    icon={<TrendingUp size={18} className="text-yellow-400" />} 
                                    label="Avg Interview Score" 
                                    value={`${stats?.avgInterviewScore ?? 0}%`} 
                                    accent="bg-yellow-400/10" 
                                    sub="Across completed sessions" 
                                />
                            </div>

                            {/* API Usage + Signups Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Today's API Usage */}
                                <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Cpu size={18} className="text-[#00e472]" />
                                        <h3 className="font-semibold text-[#e2e2e2]">Today's Gemini API Usage</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between font-mono text-xs text-[#849584] mb-1">
                                                <span>Mock Interviews</span><span className="text-[#00e472]">{stats?.todayInterviews ?? 0} calls</span>
                                            </div>
                                            <div className="h-2 bg-[#0c0f0f] rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-[#00e472] to-[#008f47] rounded-full transition-all" style={{ width: `${Math.min((stats?.todayInterviews ?? 0) / 2, 100)}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between font-mono text-xs text-[#849584] mb-1">
                                                <span>Resume Analyses</span><span className="text-blue-400">{stats?.todayResumes ?? 0} calls</span>
                                            </div>
                                            <div className="h-2 bg-[#0c0f0f] rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all" style={{ width: `${Math.min((stats?.todayResumes ?? 0) / 2, 100)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-[#2a2c2c] flex justify-between font-mono text-sm">
                                        <span className="text-[#849584]">Total Today</span>
                                        <span className="text-[#00e472] font-bold">{(stats?.todayInterviews ?? 0) + (stats?.todayResumes ?? 0)} API Calls</span>
                                    </div>
                                </div>

                                {/* Today's Signups */}
                                <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl p-6 flex flex-col justify-between">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calendar size={18} className="text-[#00e472]" />
                                        <h3 className="font-semibold text-[#e2e2e2]">Today's Signups</h3>
                                    </div>
                                    <div className="text-6xl font-bold text-[#00e472] text-center py-4">{stats?.todaySignups ?? 0}</div>
                                    <p className="font-mono text-xs text-[#849584] text-center">New users registered today</p>
                                </div>
                            </div>

                            {/* Recent Activity Feed */}
                            <div id="recent-activity" className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#2a2c2c] flex items-center justify-between">
                                    <h3 className="font-semibold text-[#e2e2e2] flex items-center gap-2">
                                        <Activity size={18} className="text-[#00e472]" /> Recent Activity Feed
                                    </h3>
                                    <span className="text-xs font-mono text-[#849584]">Last 20 events</span>
                                </div>
                                <div className="divide-y divide-[#2a2c2c] max-h-96 overflow-y-auto">
                                    {activity.length === 0 ? (
                                        <div className="text-center py-12 text-[#849584] font-mono text-sm">No recent activity found.</div>
                                    ) : activity.map((item, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-[#1a1c1c] transition-colors">
                                            <FeedBadge type={item.type} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-[#e2e2e2]">
                                                    <span className="font-semibold text-[#00e472]">{item.username}</span>
                                                    {item.type === 'INTERVIEW'
                                                        ? ` finished a ${item.detail} interview`
                                                        : ` uploaded ${item.detail}`}
                                                </p>
                                                <p className="text-xs text-[#849584] font-mono mt-0.5">{item.userEmail}</p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className={`font-mono font-bold text-sm ${fmtScore(item.score)}`}>{item.score}%</span>
                                                <span className="text-[10px] font-mono text-[#849584]">
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
