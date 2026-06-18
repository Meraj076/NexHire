import React, { useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, CheckCircle, AlertTriangle, Loader, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';

export default function Resumes() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length > 0) {
            setSelectedFile(acceptedFiles[0]);
            setAnalysisResult(null); // Clear previous results
        } else {
            toast.error("Please upload a valid PDF file.");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    });

    const removeFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setAnalysisResult(null);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await API.post('/api/v1/resumes/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setAnalysisResult(response.data);
            toast.success("Resume analyzed successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to analyze resume.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex h-screen bg-bg-base text-text-main font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-grow flex flex-col relative overflow-hidden pt-16 md:pt-0">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00e472]/5 blur-[200px] rounded-full pointer-events-none z-0"></div>

                {/* Header (Aligned perfectly with Sidebar logo area via h-24) */}
                <header className="h-24 px-6 border-b border-border z-10 bg-bg-base/80 backdrop-blur-md flex justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
                            <FileText className="text-[#00e472]" /> Resume Upload & Analysis
                        </h1>
                        <p className="font-mono text-xs text-text-muted mt-1">Upload your PDF resume to get an AI-powered ATS score.</p>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-6 md:p-10 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* DROPZONE AREA */}
                        <div 
                            {...getRootProps()} 
                            className={`glass-panel border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                                isDragActive 
                                    ? 'border-[#00e472] bg-[#00e472]/5 scale-[1.02]' 
                                    : 'border-border hover:border-[#00e472]/50 hover:bg-bg-panel'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className={`p-4 rounded-full ${isDragActive ? 'bg-[#00e472]/20 text-[#00e472]' : 'bg-bg-card text-text-muted'}`}>
                                    <UploadCloud size={40} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-main mb-1">
                                        {isDragActive ? "Drop your resume here!" : "Drag & drop your resume"}
                                    </h3>
                                    <p className="font-mono text-xs text-text-muted">or click to browse files (PDF only, max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        {/* SELECTED FILE PREVIEW */}
                        {selectedFile && (
                            <div className="bg-bg-panel border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#00e472]/10 rounded-lg text-[#00e472] shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-text-main text-sm truncate">{selectedFile.name}</p>
                                        <p className="font-mono text-xs text-text-muted">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                                    <button 
                                        onClick={removeFile}
                                        disabled={isAnalyzing}
                                        className="text-text-muted hover:text-red-400 transition-colors p-2 disabled:opacity-50"
                                        title="Remove File"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                                        disabled={isAnalyzing}
                                        className="flex-1 sm:flex-none px-4 md:px-6 py-2 bg-[#00e472] hover:bg-[#00cc66] text-black font-bold font-mono text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader className="animate-spin" size={16} />
                                                Analyzing...
                                            </>
                                        ) : (
                                            "Analyze with AI"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ANALYSIS RESULTS CARD */}
                        {analysisResult && (
                            <div className="glass-panel rounded-2xl border border-border bg-bg-panel/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-card/50">
                                    <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                                        <CheckCircle className="text-[#00e472]" size={20} /> 
                                        Analysis Complete
                                    </h2>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-[#00e472]">{analysisResult.atsScore}%</div>
                                        <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">ATS Match Score</div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* AI Suggestion */}
                                    <div className="bg-[#00e472]/5 rounded-xl p-4 border border-[#00e472]/20">
                                        <h3 className="font-mono text-xs font-bold text-[#00e472] uppercase tracking-wider mb-2">Gemini AI Feedback</h3>
                                        <p className="text-sm text-[#b9cbb8] leading-relaxed">
                                            {analysisResult.aiSuggestion}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Detected Skills */}
                                        <div className="bg-bg-card rounded-xl p-4 border border-border">
                                            <div className="flex items-center gap-2 text-[#00e472] text-xs font-mono uppercase tracking-wider mb-3">
                                                <CheckCircle size={14} /> Detected Skills
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.extractedSkill.split(',').map((skill, i) => (
                                                    <span key={i} className="px-2 py-1 bg-bg-card text-text-main text-xs rounded font-mono border border-white/5">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Missing Keywords */}
                                        <div className="bg-bg-card rounded-xl p-4 border border-border">
                                            <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono uppercase tracking-wider mb-3">
                                                <AlertTriangle size={14} /> Missing Keywords
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.missingKeywords.split(',').map((kw, i) => (
                                                    <span key={i} className="px-2 py-1 bg-[#2a2015] text-yellow-400 text-xs rounded border border-yellow-400/20 font-mono">
                                                        {kw.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}
