import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Mic, MicOff, Send, Bot, User, Loader2, PlayCircle, BarChart2, Video } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function InterviewRoom() {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [inputText, setInputText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [interviewPhase, setInterviewPhase] = useState('interview'); // 'interview' | 'completed' | 'results'
    const isInterviewActiveRef = useRef(true); // ref so setTimeout callbacks can check live state
    const [userRole, setUserRole] = useState("");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [hasStarted, setHasStarted] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [qnaList, setQnaList] = useState([]);

    useEffect(() => {
        // Scroll to bottom whenever messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cleanup speech synthesis on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const startInterview = async () => {
        if (!userRole.trim()) {
            toast.error("Please enter a job role before starting.");
            return;
        }

        setHasStarted(true);
        setMessages([{ sender: 'user', text: `I am applying for the role of ${userRole} at ${difficulty} level.` }]);
        
        const welcomeMsg = "Welcome to NexHire. I am your AI Interviewer. I will ask you questions and evaluate your responses.";
        askQuestion(welcomeMsg);
        
        try {
            const response = await API.post('/api/v1/interviews/start', {
                roleProfile: userRole,
                difficulty: difficulty
            });
            
            setSessionId(response.data.sessionId);
            setCurrentQuestion(response.data.questionText);
            
            setTimeout(() => {
                askQuestion(response.data.questionText);
            }, 4000); // wait briefly for welcome message to finish
        } catch (error) {
            console.error("START INTERVIEW ERROR:", error);
            if (error.response) {
                console.error("Backend Response Data:", error.response.data);
            }
            toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to start interview.");
            setHasStarted(false);
        }
    };

    const askQuestion = (text) => {
        // Don't speak if interview was already ended
        if (!isInterviewActiveRef.current) return;

        setIsSpeaking(true);
        setMessages(prev => [...prev, { sender: 'ai', text }]);
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            toast("Microphone muted", { icon: '🔇' });
        } else {
            setIsListening(true);
            toast("Listening...", { icon: '🎙️' });
        }
    };

    const submitAnswer = async () => {
        if (!inputText.trim()) return;

        const userText = inputText;
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setInputText("");

        if (interviewPhase === 'interview') {
            // Save QnA
            setQnaList(prev => [...prev, { question: currentQuestion, answer: userText }]);
            
            try {
                const response = await API.post(`/api/v1/interviews/next/${sessionId}`, {
                    roleProfile: userRole,
                    difficulty: difficulty,
                    previousQuestion: currentQuestion,
                    previousAnswer: userText
                });
                
                setCurrentQuestion(response.data.questionText);
                
                setTimeout(() => {
                    askQuestion(response.data.questionText);
                }, 1000);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch next question. You can end the interview.");
            }
        }
    };

    const handleEndInterview = async () => {
        // ── Stop voice IMMEDIATELY before any async work ──
        isInterviewActiveRef.current = false;   // block any queued askQuestion calls
        window.speechSynthesis.cancel();        // cut off any currently-playing speech
        setIsSpeaking(false);

        const loadingToast = toast.loading('Saving interview and generating AI Report...');
        
        try {
            const response = await API.post('/api/v1/interviews/end', {
                sessionId: sessionId,
                qnaList: qnaList
            });
            
            setEvaluationResult(response.data);
            setInterviewPhase('results');
            toast.success('Interview completed!', { id: loadingToast });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to end interview and save results.", { id: loadingToast });
        }
    };

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

            <main className="flex-grow flex flex-col min-h-0 relative overflow-hidden pt-16 md:pt-0">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00e472]/5 blur-[250px] rounded-full pointer-events-none z-0"></div>

                {/* Header — sits below mobile topbar on small screens */}
                <header className="sticky top-0 pt-0 md:pt-0 md:h-24 px-6 md:px-10 py-5 md:py-0 border-b border-border z-20 bg-bg-base/95 backdrop-blur-md flex flex-col md:flex-row md:justify-between items-start md:items-center shrink-0 gap-3 md:gap-0">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-text-main flex items-center gap-2">
                            <Video className="text-[#00e472]" /> AI Interview Room
                        </h1>
                        <p className="font-mono text-xs text-text-muted mt-1">
                            {!hasStarted ? 'Setup Phase: Specify your role.' : 
                             interviewPhase === 'interview' ? `Interview Phase - ${userRole} (${difficulty})` : 
                             interviewPhase === 'completed' ? 'Interview Completed' : 'Final Evaluation'}
                        </p>
                    </div>
                    {interviewPhase === 'interview' && hasStarted && (
                        <button 
                            onClick={handleEndInterview}
                            className="w-full md:w-auto px-6 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 hover:border-red-500 font-mono text-sm rounded-lg transition-all"
                        >
                            End Interview
                        </button>
                    )}
                </header>

                {/* Main Content Area */}
                {interviewPhase === 'results' ? (
                    <div className="flex-grow min-h-0 overflow-y-auto p-6 md:p-10 z-10 scroll-smooth flex flex-col items-center">
                        <div className="max-w-4xl w-full mx-auto space-y-8 my-auto">
                            
                            {/* OVERALL SCORE BANNER */}
                            <div className={`glass-panel p-10 rounded-3xl border border-border flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                                <div className={`absolute top-0 w-full h-1 ${getScoreBg(evaluationResult?.overallScore).split(' ')[0]} opacity-50`}></div>
                                
                                <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 mb-6 shadow-2xl ${getScoreBg(evaluationResult?.overallScore)}`}>
                                    <span className={`text-5xl font-bold ${getScoreColor(evaluationResult?.overallScore)}`}>
                                        {evaluationResult?.overallScore}%
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Interview Completed</h2>
                                <p className="text-text-muted max-w-lg mx-auto">
                                    Your AI-driven technical interview has concluded. Here is the detailed breakdown of your performance based on your responses.
                                </p>
                            </div>

                            {/* DETAILED QUESTION GRID */}
                            <h3 className="text-xl font-bold text-text-main mt-10 mb-6 flex items-center gap-2">
                                <BarChart2 className="text-[#00e472]" /> Question-by-Question Breakdown
                            </h3>
                            
                            <div className="space-y-6">
                                {evaluationResult?.evaluations.map((evalItem, idx) => (
                                    <div key={idx} className="glass-panel p-6 rounded-2xl border border-border hover:border-[#00e472]/30 transition-all">
                                        <div className="flex items-start justify-between gap-6 mb-4">
                                            <div>
                                                <span className="font-mono text-xs text-[#00e472] uppercase tracking-wider mb-2 block">Question {idx + 1}</span>
                                                <h4 className="text-lg font-bold text-text-main leading-relaxed">{evalItem.question}</h4>
                                            </div>
                                            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${getScoreBg(evalItem.feedbackScore * 10)} ${getScoreColor(evalItem.feedbackScore * 10)}`}>
                                                {evalItem.feedbackScore}/10
                                            </div>
                                        </div>
                                        
                                        <div className="bg-bg-base/50 p-4 rounded-xl border border-border mb-4">
                                            <span className="font-mono text-xs text-text-muted uppercase tracking-wider mb-2 block">Your Answer</span>
                                            <p className="text-sm text-text-main">{evalItem.answer}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                                                <span className="font-mono text-xs text-red-400 uppercase tracking-wider mb-2 block">Identified Weakness</span>
                                                <p className="text-sm text-red-200/80">{evalItem.identifiedWeakness}</p>
                                            </div>
                                            <div className="bg-[#00e472]/5 p-4 rounded-xl border border-[#00e472]/20">
                                                <span className="font-mono text-xs text-[#00e472] uppercase tracking-wider mb-2 block">Remediation Guide</span>
                                                <p className="text-sm text-[#00e472]/80">{evalItem.remediationGuide}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 pb-10 flex justify-center gap-4">
                                <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-bg-panel hover:bg-bg-base text-text-main font-bold border border-border rounded-xl transition-all">
                                    Return to Dashboard
                                </button>
                                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#00e472] hover:bg-[#00cc66] text-black font-bold rounded-xl transition-all">
                                    Start Another Interview
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat History Area */}
                        <div className="flex-grow min-h-0 overflow-y-auto p-6 md:p-10 space-y-6 z-10 scroll-smooth flex flex-col">
                            {!hasStarted ? (
                                <div className="flex-grow flex items-center justify-center">
                                    <div className="text-center bg-bg-card border border-border p-8 rounded-2xl max-w-md shadow-[0_0_30px_rgba(0,228,114,0.1)]">
                                        <div className="w-16 h-16 bg-[#00e472]/10 rounded-full flex items-center justify-center text-[#00e472] mx-auto mb-4">
                                            <Video size={32} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-text-main mb-2">Ready to Start?</h2>
                                        <p className="text-text-muted text-sm mb-6">Customize your mock interview below.</p>
                                        
                                        <div className="space-y-4 mb-8 text-left">
                                            <div>
                                                <label className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2 block">Job Role / Tech Stack</label>
                                                <input 
                                                    type="text" 
                                                    value={userRole}
                                                    onChange={(e) => setUserRole(e.target.value)}
                                                    placeholder="e.g. Java Backend Developer"
                                                    className="w-full bg-bg-panel border border-border focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50 rounded-xl p-3 text-text-main text-sm transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2 block">Experience Level</label>
                                                <select 
                                                    value={difficulty}
                                                    onChange={(e) => setDifficulty(e.target.value)}
                                                    className="w-full bg-bg-panel border border-border focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50 rounded-xl p-3 text-text-main text-sm transition-all outline-none appearance-none"
                                                >
                                                    <option value="Beginner">Beginner (0-1 years)</option>
                                                    <option value="Intermediate">Intermediate (2-4 years)</option>
                                                    <option value="Advanced">Advanced (5+ years)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={startInterview}
                                            disabled={!userRole.trim()}
                                            className="px-8 py-3 bg-[#00e472] hover:bg-[#00cc66] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all w-full flex items-center justify-center gap-2"
                                        >
                                            Start Interview <Mic size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                
                                                {/* Avatar */}
                                                <div className="shrink-0 mt-1">
                                                    {msg.sender === 'ai' ? (
                                                        <div className="w-10 h-10 rounded-full bg-bg-card border border-[#00e472]/30 flex items-center justify-center text-[#00e472] shadow-[0_0_10px_rgba(0,228,114,0.2)]">
                                                            <Bot size={20} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00e472] to-[#008f47] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(0,228,114,0.3)]">
                                                            <User size={20} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Message Bubble */}
                                                <div className={`p-4 rounded-2xl ${
                                                    msg.sender === 'ai' 
                                                        ? 'bg-bg-panel border border-border text-text-main' 
                                                        : 'bg-gradient-to-br from-[#00e472]/10 to-[#008f47]/10 border border-[#00e472]/30 text-text-main'
                                                }`}>
                                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Speaking Indicator */}
                                    {isSpeaking && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-4 max-w-[85%] md:max-w-[70%]">
                                                <div className="shrink-0 mt-1">
                                                    <div className="w-10 h-10 rounded-full bg-bg-card border border-[#00e472]/30 flex items-center justify-center text-[#00e472] shadow-[0_0_10px_rgba(0,228,114,0.2)]">
                                                        <Bot size={20} />
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-bg-panel border border-border text-text-main flex items-center gap-2">
                                                    <Loader2 className="animate-spin text-[#00e472]" size={16} />
                                                    <span className="text-sm font-mono text-text-muted animate-pulse">AI is speaking...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        {hasStarted && (
                            <div className="p-6 md:px-10 bg-bg-base/80 backdrop-blur-md border-t border-border z-10 shrink-0">
                                <div className="max-w-4xl mx-auto flex gap-4">
                                    <button 
                                        onClick={toggleListening}
                                        className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                            isListening 
                                                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                                                : 'bg-bg-panel border border-border text-text-main hover:border-[#00e472]/50 hover:text-[#00e472]'
                                        }`}
                                    >
                                        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                                    </button>
                                    
                                    <div className="flex-grow relative">
                                        <input 
                                            type="text" 
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                                            placeholder="Type your response or click the microphone to speak..."
                                            className="w-full h-14 bg-bg-panel border border-border rounded-2xl pl-6 pr-14 text-text-main placeholder-text-muted focus:outline-none focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50 transition-all"
                                        />
                                        <button 
                                            onClick={submitAnswer}
                                            disabled={!inputText.trim()}
                                            className="absolute right-2 top-2 bottom-2 w-10 bg-[#00e472] hover:bg-[#00cc66] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-black transition-all"
                                        >
                                            <Send size={18} className="ml-1" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center mt-3">
                                    <p className="font-mono text-[10px] text-text-muted">Powered by Google Gemini 2.5 Flash</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
