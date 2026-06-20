import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Pricing() {
    useEffect(() => {
        // Simple scroll animation observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
        
        // Window scroll to top on mount
        window.scrollTo(0, 0);
        
        return () => observer.disconnect();
    }, []);

    const handleMagneticMove = (e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };

    const handleMagneticLeave = (e) => {
        e.currentTarget.style.transform = `translate(0, 0)`;
    };

    return (
        <div className="antialiased min-h-screen flex flex-col relative bg-black text-[#e2e2e2] font-sans overflow-x-hidden">
            
            {/* Inline Custom Styles for Animations */}
            <style>{`
                .glass-panel { background: rgba(23, 23, 23, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
                .card-hover-effect { transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s ease, box-shadow 0.4s ease; }
                .card-hover-effect:hover { transform: translateY(-6px); }
                .reveal-up { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
                .reveal-up.active { opacity: 1; transform: translateY(0); }
                .pro-glow { box-shadow: 0 0 30px rgba(0, 228, 114, 0.1); }
                .gradient-text { background: linear-gradient(90deg, #ffffff, #00e472, #ffffff); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradient-sweep 4s linear infinite; }
                @keyframes gradient-sweep { to { background-position: 200% center; } }
            `}</style>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00e472]/10 blur-[150px] rounded-full pointer-events-none"></div>

            <Header />
            
            <main className="flex-grow z-10 relative">
                
                {/* Header Section */}
                <section className="pt-32 pb-20 px-4 md:px-16 flex flex-col items-center text-center max-w-[1280px] mx-auto relative">
                    <h1 className="text-5xl md:text-7xl font-bold text-[#e2e2e2] mb-6 tracking-tight reveal-up">
                        Simple, <span className="gradient-text">Transparent</span> Pricing.
                    </h1>
                    <p className="font-mono text-lg text-[#b9cbb8] max-w-2xl reveal-up" style={{transitionDelay: '100ms'}}>
                        Choose the perfect plan to accelerate your career. No hidden fees, cancel anytime.
                    </p>
                </section>

                {/* Pricing Cards */}
                <section className="py-12 px-4 md:px-16 max-w-[1280px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        
                        {/* Free Tier */}
                        <div className="glass-panel p-10 rounded-2xl border border-[#262626] flex flex-col gap-8 reveal-up card-hover-effect">
                            <div>
                                <h3 className="text-2xl font-bold text-[#e2e2e2] mb-2">Basic</h3>
                                <p className="font-mono text-sm text-[#b9cbb8]">For casual practice</p>
                            </div>
                            <div className="flex items-end gap-1">
                                <span className="text-5xl font-bold text-white">$0</span>
                                <span className="font-mono text-[#b9cbb8] mb-1">/ forever</span>
                            </div>
                            <div className="flex flex-col gap-4 flex-grow border-t border-[#262626] pt-8">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">1 AI Mock Interview per month</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Basic Resume Analysis</span>
                                </div>
                                <div className="flex items-start gap-3 opacity-50">
                                    <span className="material-symbols-outlined text-[#b9cbb8] text-sm mt-1">cancel</span>
                                    <span className="font-mono text-sm text-[#b9cbb8]">Advanced ATS Scoring</span>
                                </div>
                                <div className="flex items-start gap-3 opacity-50">
                                    <span className="material-symbols-outlined text-[#b9cbb8] text-sm mt-1">cancel</span>
                                    <span className="font-mono text-sm text-[#b9cbb8]">Detailed Performance Analytics</span>
                                </div>
                            </div>
                            <Link to="/signup" className="mt-8 glass-panel text-[#e2e2e2] py-4 rounded-xl font-mono text-base font-bold hover:bg-white/5 transition-all text-center border border-white/20">
                                Get Started
                            </Link>
                        </div>

                        {/* Pro Tier (Highlighted) */}
                        <div className="glass-panel p-10 rounded-2xl border-2 border-[#00e472] flex flex-col gap-8 reveal-up card-hover-effect pro-glow relative transform md:scale-105 z-10 bg-[#0A0A0A]/80" style={{transitionDelay: '100ms'}}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00e472] text-[#00210b] font-mono font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#e2e2e2] mb-2">Pro</h3>
                                <p className="font-mono text-sm text-[#b9cbb8]">For serious job seekers</p>
                            </div>
                            <div className="flex items-end gap-1">
                                <span className="text-5xl font-bold text-white">$19</span>
                                <span className="font-mono text-[#b9cbb8] mb-1">/ month</span>
                            </div>
                            <div className="flex flex-col gap-4 flex-grow border-t border-[#262626] pt-8">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Unlimited AI Mock Interviews</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Deep ATS Resume Optimization</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Advanced Performance Analytics</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Role-specific Question Banks</span>
                                </div>
                            </div>
                            <Link to="/signup" className="mt-8 bg-[#00e472] text-[#00210b] py-4 rounded-xl font-mono text-base font-bold hover:bg-[#63ff94] transition-all text-center shadow-[0_0_15px_rgba(0,228,114,0.3)]">
                                Upgrade to Pro
                            </Link>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="glass-panel p-10 rounded-2xl border border-[#262626] flex flex-col gap-8 reveal-up card-hover-effect" style={{transitionDelay: '200ms'}}>
                            <div>
                                <h3 className="text-2xl font-bold text-[#e2e2e2] mb-2">Enterprise</h3>
                                <p className="font-mono text-sm text-[#b9cbb8]">For bootcamps & teams</p>
                            </div>
                            <div className="flex items-end gap-1">
                                <span className="text-5xl font-bold text-white">Custom</span>
                            </div>
                            <div className="flex flex-col gap-4 flex-grow border-t border-[#262626] pt-8">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Everything in Pro</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Team Management Dashboard</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Custom Role Configurations</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-[#00e472] text-sm mt-1">check_circle</span>
                                    <span className="font-mono text-sm text-[#e2e2e2]">Dedicated Support</span>
                                </div>
                            </div>
                            <a href="mailto:contact@nexhire.ai" className="mt-8 glass-panel text-[#e2e2e2] py-4 rounded-xl font-mono text-base font-bold hover:bg-white/5 transition-all text-center border border-white/20">
                                Contact Sales
                            </a>
                        </div>

                    </div>
                </section>

                {/* FAQ Section (Bonus) */}
                <section className="py-32 px-4 md:px-16 max-w-[800px] mx-auto">
                    <div className="text-center mb-16 reveal-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#e2e2e2] mb-4 tracking-tight">Frequently Asked Questions</h2>
                    </div>
                    <div className="flex flex-col gap-6 reveal-up">
                        <div className="glass-panel p-6 rounded-xl border border-[#262626]">
                            <h4 className="text-lg font-bold text-[#e2e2e2] mb-2">Can I cancel my subscription anytime?</h4>
                            <p className="font-mono text-sm text-[#b9cbb8]">Yes, you can cancel your Pro subscription at any time from your account settings. You will retain access until the end of your billing cycle.</p>
                        </div>
                        <div className="glass-panel p-6 rounded-xl border border-[#262626]">
                            <h4 className="text-lg font-bold text-[#e2e2e2] mb-2">How accurate is the AI feedback?</h4>
                            <p className="font-mono text-sm text-[#b9cbb8]">Our AI is powered by fine-tuned Gemini models, trained on thousands of successful tech interviews. It provides highly accurate, context-aware technical and behavioral feedback.</p>
                        </div>
                    </div>
                </section>

            </main>
            
            <Footer />
        </div>
    );
}
