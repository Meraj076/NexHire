import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import API from '../services/api';

// ─── Call Secure Backend Chat Endpoint ──────────────────────────────────────
async function callGemini(conversationHistory) {
    const response = await API.post('/api/v1/chat', conversationHistory);
    return response.data;
}

// ─── Typing Indicator Component ──────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-[#00e472]/10 border border-[#00e472]/30 flex items-center justify-center mr-2 flex-shrink-0 mt-auto">
                <Bot size={14} className="text-[#00e472]" />
            </div>
            <div className="bg-bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#00e472]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[#00e472]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[#00e472]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}

// ─── Main ChatWidget Component ───────────────────────────────────────────────
export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "👋 Hi! I'm **PrepBot**, your AI interview coach.\n\nI can help you with:\n- 🎯 **Mock interviews** (DSA, System Design, Behavioral)\n- 📄 **Resume review** & ATS optimization\n- 💡 **Interview tips** & career advice\n- 💰 **Salary negotiation** guidance\n\nWhat would you like to practice today?",
            isBot: true
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // ─── Auto-scroll to latest message ──────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // ─── Focus input when chat opens ────────────────────────────────────────
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // ─── Build conversation history for Gemini (multi-turn) ─────────────────
    const buildHistory = (currentMessages) => {
        return currentMessages
            .filter(msg => msg.id !== 1) // skip initial greeting (handled by system prompt)
            .map(msg => ({
                role: msg.isBot ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
    };

    // ─── Send Message ────────────────────────────────────────────────────────
    const handleSend = async (e) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        setError(null);

        // Add user message
        const userMsg = { id: Date.now(), text: trimmedInput, isBot: false };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Build history including new user message
            const history = buildHistory(updatedMessages);
            const botReply = await callGemini(history);

            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, text: botReply, isBot: true }
            ]);
        } catch (err) {
            console.error('Gemini error:', err);
            const errMsg = err.response?.data || err.message || 'Something went wrong. Please try again.';
            setError(errMsg);
            // Remove the user message on error so they can retry
            setMessages(prev => prev.filter(m => m.id !== userMsg.id));
            setInput(trimmedInput);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Quick Prompt Chips ──────────────────────────────────────────────────
    const quickPrompts = [
        "Ask me a DSA question",
        "Review my resume",
        "System Design interview tips",
        "STAR method examples",
    ];

    const handleQuickPrompt = (prompt) => {
        setInput(prompt);
        inputRef.current?.focus();
    };

    return (
        <div className="flex fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 flex-col items-end">

            {/* ── Chat Window ─────────────────────────────────────────── */}
            {isOpen && (
                <div className="bg-bg-panel border border-border w-[calc(100vw-2rem)] max-w-[400px] h-[540px] md:h-[600px] rounded-2xl shadow-2xl mb-4 md:mb-6 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#00e472] to-[#00a854] p-4 flex justify-between items-center text-black relative overflow-hidden flex-shrink-0">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/10 rounded-full blur-xl" />

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 shadow-sm">
                                <Bot size={22} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                                    PrepBot <Sparkles size={13} className="text-yellow-200 animate-pulse" />
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    <p className="text-xs text-white/90 font-medium">Powered by Gemini 2.5 Flash</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-2 rounded-xl transition-all relative z-10 text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-500/10 border-b border-red-500/20 px-4 py-2.5 text-red-400 flex-shrink-0">
                            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                            <p className="text-xs leading-relaxed">{error}</p>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-bg-base relative">
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                            <Bot size={140} />
                        </div>

                        {/* Message Bubbles */}
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} relative z-10`}>
                                {msg.isBot && (
                                    <div className="w-7 h-7 rounded-full bg-[#00e472]/10 border border-[#00e472]/30 flex items-center justify-center mr-2 flex-shrink-0 mt-auto">
                                        <Bot size={13} className="text-[#00e472]" />
                                    </div>
                                )}
                                <div className={`max-w-[78%] p-3 shadow-sm text-sm leading-relaxed ${msg.isBot
                                    ? 'bg-bg-card border border-border text-text-main rounded-2xl rounded-bl-sm'
                                    : 'bg-gradient-to-br from-[#00e472] to-[#00c060] text-white rounded-2xl rounded-br-sm'
                                }`}>
                                    {msg.isBot ? (
                                        <ReactMarkdown
                                            components={{
                                                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                                strong: ({ children }) => <strong className="text-[#00e472] font-semibold">{children}</strong>,
                                                ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1">{children}</ul>,
                                                li: ({ children }) => <li className="text-sm">{children}</li>,
                                                code: ({ children }) => <code className="bg-bg-base px-1 py-0.5 rounded text-[#00e472] font-mono text-xs">{children}</code>,
                                                pre: ({ children }) => <pre className="bg-bg-base p-2 rounded-lg my-2 overflow-x-auto text-xs">{children}</pre>,
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    ) : (
                                        <p>{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && <TypingIndicator />}

                        {/* Scroll anchor */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompt Chips (shown only when 1 message = initial greeting) */}
                    {messages.length === 1 && (
                        <div className="px-4 py-2 bg-bg-base border-t border-border flex gap-2 flex-wrap flex-shrink-0">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => handleQuickPrompt(prompt)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-bg-panel border border-[#00e472]/30 text-[#00e472] hover:bg-[#00e472]/10 transition-all duration-200 font-mono"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-3 bg-bg-panel border-t border-border flex-shrink-0">
                        <form onSubmit={handleSend} className="relative flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything about interviews..."
                                disabled={isLoading}
                                className="flex-grow bg-bg-base border border-border rounded-full pl-4 pr-4 py-3 text-text-main focus:outline-none focus:border-[#00e472]/50 focus:ring-2 focus:ring-[#00e472]/20 transition-all text-sm disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`flex-shrink-0 w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                                    input.trim() && !isLoading
                                        ? 'bg-[#00e472] text-black hover:bg-[#00cc66] hover:scale-105 shadow-md shadow-[#00e472]/20'
                                        : 'bg-bg-card text-text-muted cursor-not-allowed'
                                }`}
                            >
                                {isLoading
                                    ? <Loader2 size={16} className="animate-spin" />
                                    : <Send size={16} />
                                }
                            </button>
                        </form>
                        <p className="text-center text-[10px] text-text-muted font-mono mt-2 opacity-50">
                            PrepBot · Gemini 2.5 Flash
                        </p>
                    </div>
                </div>
            )}

            {/* ── Floating Button ──────────────────────────────────────── */}
            <div className="relative group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                {!isOpen && (
                    <>
                        <div className="absolute inset-0 bg-[#00e472] rounded-full animate-ping opacity-20" />
                        <div className="absolute -inset-2 bg-[#00e472]/20 rounded-full blur-md group-hover:bg-[#00e472]/40 transition-all duration-500" />
                    </>
                )}
                <button
                    className={`relative z-10 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-2 overflow-hidden ${
                        isOpen
                            ? 'bg-bg-panel text-text-main border-border hover:bg-bg-card hover:scale-95'
                            : 'bg-gradient-to-tr from-[#00e472] to-[#00a854] text-black border-transparent hover:scale-110'
                    }`}
                >
                    {isOpen ? (
                        <X size={28} className="animate-in spin-in-90 duration-300" />
                    ) : (
                        <div className="relative flex items-center justify-center w-full h-full">
                            <Bot size={30} className="text-white drop-shadow-md animate-in zoom-in duration-300" />
                            <Sparkles size={11} className="text-yellow-300 absolute top-3 right-3 animate-pulse" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
