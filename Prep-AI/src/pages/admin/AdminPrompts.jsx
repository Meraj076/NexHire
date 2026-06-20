import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Settings2, Save, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';

const PROMPT_META = {
    interview_first_question: {
        title: '🎙️ First Interview Question',
        desc: 'Used when a user starts a new interview session. Gets the first question from Gemini.',
        vars: ['{roleProfile}', '{difficulty}'],
    },
    interview_next_question: {
        title: '⏭️ Next Interview Question',
        desc: 'Used after each answer to generate a follow-up question based on context.',
        vars: ['{roleProfile}', '{difficulty}', '{previousQuestion}', '{previousAnswer}'],
    },
    interview_bulk_eval: {
        title: '📊 Interview Bulk Evaluator',
        desc: 'Sent to Gemini at the end of the interview to score all Q&A pairs.',
        vars: ['{roleProfile}', '{difficulty}', '{qnaHistory}'],
    },
    resume_analysis: {
        title: '📄 Resume ATS Analyzer',
        desc: 'Analyzes resume text and returns ATS score, skills, suggestions and missing keywords.',
        vars: ['{resumeText}'],
    },
};

export default function AdminPrompts() {
    const [prompts, setPrompts]   = useState({});
    const [edited, setEdited]     = useState({});
    const [saved, setSaved]       = useState({});
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState({});

    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get('/api/v1/admin/prompts');
                const map = {};
                res.data.forEach(p => { map[p.promptKey] = p.promptValue; });
                setPrompts(map);
                setEdited(map);
            } catch {
                toast.error('Failed to load prompts');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async (key) => {
        setSaving(prev => ({ ...prev, [key]: true }));
        try {
            await API.put(`/api/v1/admin/prompts/${key}`, { promptValue: edited[key] });
            setPrompts(prev => ({ ...prev, [key]: edited[key] }));
            setSaved(prev => ({ ...prev, [key]: true }));
            toast.success('Prompt saved! Changes are live immediately.');
            setTimeout(() => setSaved(prev => ({ ...prev, [key]: false })), 3000);
        } catch {
            toast.error('Failed to save prompt');
        } finally {
            setSaving(prev => ({ ...prev, [key]: false }));
        }
    };

    const isDirty = (key) => edited[key] !== prompts[key];

    return (
        <div className="flex h-screen bg-[#121414] text-[#e2e2e2] font-sans overflow-hidden">
            <AdminSidebar />
            <main className="flex-grow overflow-y-auto relative pt-14 md:pt-0">
                <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 space-y-8">

                    {/* Header */}
                    <div className="border-b border-[#2a2c2c] pb-6">
                        <h1 className="text-3xl font-bold text-[#e2e2e2] flex items-center gap-3">
                            <Settings2 size={28} className="text-[#00e472]" /> Dynamic Prompt Management
                        </h1>
                        <p className="text-sm font-mono text-[#849584] mt-1">Edit Gemini AI prompts live — changes apply instantly without redeployment.</p>
                    </div>

                    {/* Warning Banner */}
                    <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-5 py-4">
                        <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-yellow-400">Live Production Warning</p>
                            <p className="text-xs text-[#849584] font-mono mt-0.5">
                                Saving a prompt affects ALL active users immediately. Use the placeholder variables listed under each card — they get replaced with real values at runtime.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-[#00e472] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(PROMPT_META).map(([key, meta]) => (
                                <div key={key} className={`bg-[#1e2020] border rounded-2xl overflow-hidden transition-all duration-300 ${isDirty(key) ? 'border-yellow-400/30' : 'border-[#2a2c2c]'}`}>
                                    <div className="px-6 py-4 border-b border-[#2a2c2c] flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-[#e2e2e2]">{meta.title}</h3>
                                            <p className="text-xs text-[#849584] font-mono mt-0.5">{meta.desc}</p>
                                        </div>
                                        {isDirty(key) && (
                                            <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded-lg">Unsaved</span>
                                        )}
                                    </div>

                                    <div className="px-6 py-4 space-y-4">
                                        {/* Variable pills */}
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-xs font-mono text-[#849584]">Available vars:</span>
                                            {meta.vars.map(v => (
                                                <code key={v} className="text-xs bg-[#00e472]/10 text-[#00e472] border border-[#00e472]/20 px-2 py-0.5 rounded font-mono">{v}</code>
                                            ))}
                                        </div>

                                        {/* Textarea */}
                                        <textarea
                                            value={edited[key] || ''}
                                            onChange={e => setEdited(prev => ({ ...prev, [key]: e.target.value }))}
                                            rows={7}
                                            className="w-full bg-[#0c0f0f] border border-[#2a2c2c] rounded-xl p-4 text-sm font-mono text-[#e2e2e2] placeholder-[#849584] focus:outline-none focus:border-[#00e472]/40 resize-y transition-colors leading-relaxed"
                                            placeholder="Enter your prompt template here..."
                                        />

                                        {/* Action Row */}
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => setEdited(prev => ({ ...prev, [key]: prompts[key] }))}
                                                disabled={!isDirty(key)}
                                                className="flex items-center gap-2 text-xs font-mono text-[#849584] hover:text-[#e2e2e2] disabled:opacity-30 transition-colors"
                                            >
                                                <RefreshCw size={12} /> Reset to current
                                            </button>
                                            <button
                                                onClick={() => handleSave(key)}
                                                disabled={!isDirty(key) || saving[key]}
                                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-mono font-medium transition-all duration-200 ${
                                                    saved[key]
                                                        ? 'bg-[#00e472]/20 text-[#00e472] border border-[#00e472]/30'
                                                        : isDirty(key)
                                                            ? 'bg-[#00e472] text-black hover:bg-[#00ff80] shadow-[0_0_15px_rgba(0,228,114,0.2)]'
                                                            : 'bg-[#2a2c2c] text-[#849584] cursor-not-allowed'
                                                }`}
                                            >
                                                {saved[key] ? <><CheckCircle size={14} /> Saved!</> : saving[key] ? 'Saving...' : <><Save size={14} /> Save Changes</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
