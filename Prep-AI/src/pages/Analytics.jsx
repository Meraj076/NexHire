import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { PieChart as PieChartIcon, TrendingUp, Activity, FileText, Loader } from 'lucide-react';
import { 
  LineChart, Line, 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import API from '../services/api';
import toast from 'react-hot-toast';

// Custom Tooltip for dark theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-panel border border-border p-3 rounded-lg shadow-xl">
        <p className="text-text-main font-bold text-sm mb-1">{label}</p>
        <p className="text-[#00e472] font-mono text-sm">
          Score: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [interviewData, setInterviewData] = useState([]);
    const [resumeData, setResumeData] = useState([]);
    
    // Derived Metrics
    const totalInterviews = interviewData.length;
    const resumesAnalyzed = resumeData.length;
    
    const averageAiScore = totalInterviews > 0 
        ? (interviewData.reduce((acc, curr) => acc + curr.score, 0) / totalInterviews).toFixed(1) 
        : 0;

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                // Fetch in parallel
                const [interviewsRes, resumesRes] = await Promise.all([
                    API.get('/api/v1/interviews/history'),
                    API.get('/api/v1/resumes/history')
                ]);

                // The backend returns latest first, but charts should show chronological order (left to right)
                // So we reverse the arrays for charting.
                
                const formattedInterviews = interviewsRes.data.reverse().map((item, index) => ({
                    name: `Attempt ${index + 1}`,
                    score: item.overallScore || 0,
                    role: item.roleProfile
                }));

                const formattedResumes = resumesRes.data.reverse().map((item, index) => ({
                    name: `Resume ${index + 1}`,
                    score: item.atsScore || 0,
                    fileName: item.fileName
                }));

                setInterviewData(formattedInterviews);
                setResumeData(formattedResumes);
            } catch (error) {
                toast.error("Failed to load analytics data.");
                console.error("Analytics fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    return (
        <div className="flex h-screen bg-bg-base text-text-main font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-grow flex flex-col relative overflow-hidden pt-16 md:pt-0">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00e472]/5 blur-[200px] rounded-full pointer-events-none z-0"></div>

                {/* Header */}
                <header className="h-24 px-6 border-b border-border z-10 bg-bg-base/80 backdrop-blur-md flex justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
                            <PieChartIcon className="text-[#00e472]" /> Performance Analytics
                        </h1>
                        <p className="font-mono text-xs text-text-muted mt-1">Track your AI interview scores and ATS resume matches over time.</p>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-6 md:p-10 relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Loader className="animate-spin text-[#00e472] mb-4" size={40} />
                            <p className="text-text-muted font-mono text-sm animate-pulse">Loading Your Data...</p>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto space-y-8">
                            
                            {/* QUICK STATS ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass-panel p-6 rounded-2xl border border-border hover:border-[#00e472]/30 transition-all flex items-center gap-4">
                                    <div className="p-4 bg-[#00e472]/10 rounded-xl text-[#00e472]">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-text-muted uppercase tracking-wider">Total Interviews</p>
                                        <h3 className="text-3xl font-bold text-text-main mt-1">{totalInterviews}</h3>
                                    </div>
                                </div>
                                
                                <div className="glass-panel p-6 rounded-2xl border border-border hover:border-[#00e472]/30 transition-all flex items-center gap-4">
                                    <div className="p-4 bg-[#00e472]/10 rounded-xl text-[#00e472]">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-text-muted uppercase tracking-wider">Average AI Score</p>
                                        <h3 className="text-3xl font-bold text-text-main mt-1">{averageAiScore}%</h3>
                                    </div>
                                </div>

                                <div className="glass-panel p-6 rounded-2xl border border-border hover:border-[#00e472]/30 transition-all flex items-center gap-4">
                                    <div className="p-4 bg-[#00e472]/10 rounded-xl text-[#00e472]">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-text-muted uppercase tracking-wider">Resumes Analyzed</p>
                                        <h3 className="text-3xl font-bold text-text-main mt-1">{resumesAnalyzed}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* CHARTS GRID */}
                            <div className="grid grid-cols-1 gap-6">
                                
                                {/* INTERVIEW TRENDS */}
                                <div className="glass-panel rounded-2xl border border-border p-6">
                                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                                        <TrendingUp className="text-[#00e472]" size={18} /> Interview Trends
                                    </h3>
                                    {totalInterviews > 0 ? (
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={interviewData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2020" vertical={false} />
                                                    <XAxis dataKey="name" stroke="#889290" tick={{ fill: '#889290', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                    <YAxis stroke="#889290" tick={{ fill: '#889290', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Line 
                                                        type="monotone" 
                                                        dataKey="score" 
                                                        stroke="#00e472" 
                                                        strokeWidth={3}
                                                        dot={{ r: 6, fill: '#0a0a0a', stroke: '#00e472', strokeWidth: 2 }} 
                                                        activeDot={{ r: 8, fill: '#00e472', stroke: '#0a0a0a', strokeWidth: 2 }}
                                                        animationDuration={1500}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-[200px] bg-bg-base/30 rounded-xl border border-border border-dashed">
                                            <p className="text-text-muted font-mono text-sm">No interviews completed yet.</p>
                                        </div>
                                    )}
                                </div>

                                {/* ATS HISTORY */}
                                <div className="glass-panel rounded-2xl border border-border p-6">
                                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                                        <FileText className="text-[#00e472]" size={18} /> ATS Score History
                                    </h3>
                                    {resumesAnalyzed > 0 ? (
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={resumeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2020" vertical={false} />
                                                    <XAxis dataKey="name" stroke="#889290" tick={{ fill: '#889290', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                    <YAxis stroke="#889290" tick={{ fill: '#889290', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e2020', opacity: 0.4 }} />
                                                    <Bar 
                                                        dataKey="score" 
                                                        fill="#00e472" 
                                                        radius={[4, 4, 0, 0]} 
                                                        animationDuration={1500}
                                                        maxBarSize={60}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-[200px] bg-bg-base/30 rounded-xl border border-border border-dashed">
                                            <p className="text-text-muted font-mono text-sm">No resumes uploaded yet.</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
