import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Mail, Calendar, FileText, Activity, Video, TrendingUp, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const { username, userEmail, role } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [latestResume, setLatestResume] = useState(null);
    const [latestInterview, setLatestInterview] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [interviewsRes, resumesRes] = await Promise.all([
                    API.get('/api/v1/interviews/history'),
                    API.get('/api/v1/resumes/history')
                ]);

                // The endpoints already sort descending by date.
                if (resumesRes.data && resumesRes.data.length > 0) {
                    setLatestResume(resumesRes.data[0]);
                }
                if (interviewsRes.data && interviewsRes.data.length > 0) {
                    setLatestInterview(interviewsRes.data[0]);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // ==========================================
    // RENDER HELPERS
    // ==========================================

    const getScoreColor = (score) => {
        if (score >= 80) return "text-[#00e472]";
        if (score >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-[#00e472]/10 border-[#00e472]/30";
        if (score >= 60) return "bg-yellow-400/10 border-yellow-400/30";
        return "bg-red-400/10 border-red-400/30";
    };

    return (
        <div className="flex h-screen bg-bg-base text-text-main font-sans overflow-hidden">
            <Sidebar />

            {/* MAIN DASHBOARD CONTENT */}
            <main className="flex-grow overflow-y-auto overflow-x-hidden relative pt-16 md:pt-0">
                
                {/* Background Glow */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00e472]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

                <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10 space-y-8">
                    
                    {/* Header Row */}
                    <header className="flex justify-between items-end border-b border-border pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main mb-2">Dashboard</h1>
                            <p className="font-mono text-sm text-text-muted">Welcome back, let's review your recent performance.</p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 bg-bg-panel border border-border px-4 py-2 rounded-lg font-mono text-xs text-[#00e472]">
                            <Activity size={16} />
                            <span>System Status: Online</span>
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader className="animate-spin text-[#00e472] mb-4" size={40} />
                            <p className="text-text-muted font-mono text-sm animate-pulse">Loading Dashboard Data...</p>
                        </div>
                    ) : (
                        <>
                            {/* TOP ROW: Profile & Resume Highlight */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                {/* Profile Card */}
                                <div className="col-span-1 glass-panel rounded-2xl p-6 border border-border bg-bg-panel/50 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00e472] to-[#008f47] flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_20px_rgba(0,228,114,0.3)]">
                                            {username ? username.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-text-main">{username || 'User'}</h2>
                                            <span className="inline-block px-2 py-1 bg-bg-panel rounded text-[10px] font-mono text-[#00e472] uppercase tracking-widest mt-1">
                                                {role || 'CANDIDATE'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 font-mono text-xs text-text-muted">
                                        <div className="flex items-center gap-3">
                                            <Mail size={14} className="text-[#00e472]" />
                                            <span>{userEmail || 'No email found'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar size={14} className="text-[#00e472]" />
                                            <span>Active Member</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Highlight Card */}
                                <div 
                                    onClick={() => {
                                        if (latestResume) {
                                            navigate('/dashboard/analytics');
                                        }
                                    }}
                                    className={`col-span-1 lg:col-span-2 glass-panel rounded-2xl p-6 border border-border bg-bg-panel/50 relative overflow-hidden hover:border-[#00e472]/40 transition-all duration-300 ${
                                        latestResume ? 'cursor-pointer' : 'cursor-default'
                                    } ${latestResume ? '' : 'flex flex-col items-center justify-center text-text-muted'}`}
                                >
                                    {latestResume ? (
                                        <div className="flex flex-col h-full justify-between">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold flex items-center gap-2">
                                                    <FileText className="text-[#00e472]" size={20} /> Latest ATS Scan
                                                </h3>
                                                <span className="font-mono text-xs text-text-muted">
                                                    {new Date(latestResume.uploadedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 bg-bg-base/50 p-4 rounded-xl border border-border">
                                                <div className={`w-20 h-20 min-w-[5rem] min-h-[5rem] shrink-0 rounded-full flex flex-col items-center justify-center border-4 ${getScoreBg(latestResume.atsScore)}`}>
                                                    <span className={`text-2xl font-bold ${getScoreColor(latestResume.atsScore)}`}>
                                                        {latestResume.atsScore}%
                                                    </span>
                                                </div>
                                                <div className="space-y-2 min-w-0">
                                                    <p className="font-mono text-sm text-[#00e472] break-all">{latestResume.fileName}</p>
                                                    <p className="text-sm text-text-muted">AI ATS Analysis completed. Check analytics for trend history.</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-4 text-center py-6">
                                            <p className="font-mono text-sm">No recent resume analysis found.</p>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/dashboard/resumes');
                                                }}
                                                className="bg-[#00e472] text-[#00210b] px-6 py-2 rounded font-mono text-xs font-semibold hover:bg-[#63ff94] transition-colors cursor-pointer"
                                            >
                                                Upload Resume
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* INTERVIEW EVALUATION SECTION */}
                            <div 
                                onClick={() => {
                                    if (latestInterview) {
                                        navigate('/dashboard/analytics');
                                    }
                                }}
                                className={`glass-panel rounded-2xl border border-border bg-bg-panel/50 overflow-hidden transition-all duration-300 hover:border-[#00e472]/40 ${
                                    latestInterview ? 'cursor-pointer' : 'cursor-default'
                                }`}
                            >
                                {latestInterview ? (
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <Video className="text-[#00e472]" size={20} /> Most Recent AI Interview
                                            </h3>
                                            <span className="font-mono text-xs text-text-muted uppercase tracking-wider px-3 py-1 bg-bg-base rounded-full border border-border">
                                                {latestInterview.status}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className={`col-span-1 flex flex-col items-center justify-center p-6 rounded-xl border ${getScoreBg(latestInterview.overallScore)}`}>
                                                <span className="font-mono text-xs uppercase tracking-wider mb-2 opacity-80">Overall Score</span>
                                                <span className={`text-5xl font-bold ${getScoreColor(latestInterview.overallScore)}`}>
                                                    {latestInterview.overallScore}%
                                                </span>
                                            </div>
                                            
                                            <div className="col-span-1 md:col-span-2 bg-bg-base/50 rounded-xl p-6 border border-border flex flex-col justify-center">
                                                <h4 className="text-[#00e472] font-mono text-sm font-bold mb-4 flex items-center gap-2">
                                                    <TrendingUp size={16} /> Interview Details
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-xs text-text-muted font-mono uppercase">Role Profile</span>
                                                        <p className="text-sm font-medium">{latestInterview.roleProfile}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-text-muted font-mono uppercase">Date</span>
                                                        <p className="text-sm font-medium">{new Date(latestInterview.startTime).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-4 py-20 text-text-muted text-center">
                                        <p className="font-mono text-sm">No recent mock interviews found.</p>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/dashboard/interview');
                                            }}
                                            className="bg-[#00e472] text-[#00210b] px-6 py-2.5 rounded font-mono text-sm font-semibold hover:bg-[#63ff94] transition-colors cursor-pointer"
                                        >
                                            Start Mock Interview
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </main>
        </div>
    );
}
