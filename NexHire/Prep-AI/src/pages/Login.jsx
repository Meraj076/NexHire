import React from 'react';
import nexhireLogo from '../assets/nexhire-logo.png';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import API from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Login() {
    // 🧱 React Hook Form Hooks for strict variable mapping
    const { register, handleSubmit, formState: { errors } } = useForm();
    const loginGlobal = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    // 🟢 1. Email-Password Login Logic Handler
    const onNativeSubmit = async (data) => {
        try {
            const response = await API.post('/api/v1/auth/authenticate', data);
            const { token, email, username, role } = response.data;

            // Persist to Zustand store (also saved to localStorage via persist middleware)
            loginGlobal(token, email, username, role);
            toast.success('Welcome back to NexHire!');

            // Strict role-based redirect — ADMIN NEVER lands on /dashboard
            navigate(role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid email or password.');
        }
    };

    // 🔵 2. Google Sign-In Callback Handler
    const onGoogleSuccess = async (credentialResponse) => {
        try {
            const googleToken = credentialResponse.credential;
            const response = await API.post('/api/v1/auth/google', { idToken: googleToken });

            const { token, email, username, role } = response.data;
            loginGlobal(token, email, username, role);
            toast.success('Google authentication successful!');

            // Strict role-based redirect — ADMIN NEVER lands on /dashboard
            navigate(role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google authentication failed.');
        }
    };

    return (
        <>
            {/* Embedded Native Design Style Rules from your exact HTML template */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');
                body {
                    background-color: #0c0f0f !important;
                    color: #ffffff !important;
                }
                .bg-surface-dim { background-color: #0c0f0f !important; }
                .bg-surface { background-color: #121414 !important; }
                .text-brand { color: #00ff80 !important; }
                .bg-brand { background-color: #00ff80 !important; }
                .hover\\:bg-brand-dark:hover { background-color: #00cc66 !important; }
                
                .glass-card {
                    background: rgba(26, 28, 28, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .text-neon-glow {
                    text-shadow: 0 0 15px rgba(0, 255, 128, 0.4);
                }
                .focus-glow:focus {
                    box-shadow: 0 0 10px rgba(0, 255, 128, 0.2) !important;
                    border-color: #00ff80 !important;
                }
                .min-h-screen-dynamic {
                    min-height: 100vh;
                }
                .nexhire-font {
                    font-family: 'Syncopate', sans-serif;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                }
            `}</style>

            <div className="min-h-screen w-screen flex flex-col overflow-y-auto overflow-x-hidden font-sans antialiased bg-surface-dim">
                <main className="w-full flex-grow flex flex-col md:flex-row">
                    
                    {/* LEFT PANEL: Branding & Hero — hidden on mobile, shown on tablet+ */}
                    <section className="hidden md:flex w-full md:w-1/2 p-6 md:p-12 flex-col justify-between bg-surface-dim relative overflow-hidden">
                        
                        {/* Top Branding Logo — absolutely positioned at top-left */}
                        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
                            <img
                                src={nexhireLogo}
                                alt="NexHire Logo"
                                style={{ width: '180px', height: 'auto', display: 'block' }}
                            />
                        </div>

                        {/* Main Typography Headline Blocks */}
                        <div className="z-10 max-w-lg mt-20 md:mt-24">
                            <h1 className="text-4xl md:text-6xl font-bold text-brand leading-tight mb-4 text-neon-glow">
                                Master <br /> Your Future.
                            </h1>
                            <p className="text-base text-gray-400 font-light leading-relaxed">
                                Experience the next evolution of career intelligence. Precise. Fast. Autonomous.
                            </p>
                        </div>

                        {/* Visual Trailing Accent Tagline */}
                        <div className="z-10 flex items-center space-x-4">
                            <div className="h-0.5 w-10 bg-brand"></div>
                            <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">Engineered for Ambition</span>
                        </div>

                        {/* Micro Ambient Radial Light Overlay */}
                        <div className="absolute -bottom-24 -left-24 w-72 h-72 md:w-96 md:h-96 bg-brand/10 rounded-full blur-[100px]"></div>
                    </section>

                    {/* RIGHT PANEL: Interactive Form Glass Layer */}
                    <section className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center bg-surface relative overflow-y-auto min-h-screen md:min-h-0">
                        
                        <div className="glass-card w-full max-w-md p-6 md:p-8 rounded-[30px] md:rounded-[40px] flex flex-col items-center z-10">
                            
                            {/* Inner Header Identity */}
                            <div className="mb-2 md:mb-4 text-center">
                                <div className="flex justify-center items-center mb-3 md:mb-4">
                                    <img
                                        src={nexhireLogo}
                                        alt="NexHire Logo"
                                        style={{ width: '80px', height: 'auto' }}
                                    />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Welcome Back</h2>
                                <p className="text-gray-500 text-xs md:text-sm">Enter your credentials to access your AI career dashboard.</p>
                            </div>

                            {/* Authentication Input Forms linked to RHF runtime definitions */}
                            <form onSubmit={handleSubmit(onNativeSubmit)} className="w-full space-y-3 md:space-y-4">
                                
                                {/* Email Field Control Block */}
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 block" htmlFor="email">Email Address</label>
                                    <input 
                                        type="email"
                                        id="email"
                                        {...register('email', { required: 'Email field is mandatory' })}
                                        className="w-full bg-[#E8F0FE]/10 border-transparent rounded-full py-2.5 md:py-3 px-5 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand focus-glow transition-all" 
                                        placeholder="meraj123@gmail.com" 
                                    />
                                    {errors.email && <p className="text-red-400 text-[10px] md:text-xs font-mono pl-4 mt-1">{errors.email.message}</p>}
                                </div>

                                {/* Password Field Control Block */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider" htmlFor="password">Password</label>
                                        <a className="text-[10px] md:text-xs text-brand hover:underline" href="#">Forgot Password?</a>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="password"
                                            id="password"
                                            {...register('password', { required: 'Password validation required' })}
                                            className="w-full bg-[#E8F0FE]/10 border-transparent rounded-full py-2.5 md:py-3 px-5 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand focus-glow transition-all" 
                                            placeholder="••••••••" 
                                        />
                                    </div>
                                    {errors.password && <p className="text-red-400 text-[10px] md:text-xs font-mono pl-4 mt-1">{errors.password.message}</p>}
                                </div>

                                {/* Dynamic Action Interactive Button with Lightning Bolt Icon */}
                                <button className="w-full bg-brand hover:bg-brand-dark text-black font-bold py-2.5 md:py-3 text-sm md:text-base rounded-full transition-all duration-300 transform active:scale-[0.98] mt-2 md:mt-3 flex items-center justify-center space-x-2 cursor-pointer" type="submit">
                                    <span>Sign In</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13 10V3L4 14H11V21L20 10H13Z"></path>
                                    </svg>
                                </button>
                            </form>

                            {/* Clean Standard Content Dividers */}
                            <div className="w-full flex items-center my-4 md:my-5">
                                <div className="flex-grow h-[1px] bg-white/10"></div>
                                <span className="px-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Or</span>
                                <div className="flex-grow h-[1px] bg-white/10"></div>
                            </div>

                            {/* Custom Integrated Google Login Portal Wrapper Layout */}
                            <div className="w-full flex justify-center transform transition-all hover:brightness-110">
                                <GoogleLogin
                                    onSuccess={onGoogleSuccess}
                                    onError={() => toast.error('Google authorization initialization aborted')}
                                    shape="pill"
                                    theme="filled_black"
                                    size="medium"
                                    text="continue_with"
                                    width="320px" // Perfect absolute fitting bounds inside glassmorphic card boundaries
                                />
                            </div>

                            {/* Contextual Link Triggers */}
                            <p className="mt-4 md:mt-6 text-xs text-gray-500">
                                Don't have an account? 
                                <Link className="text-brand font-semibold hover:underline underline-offset-4 ml-1" to="/signup">Join the Elite</Link>
                            </p>

                            <Link to="/" className="mt-6 flex items-center gap-2 text-gray-400 hover:text-brand transition-colors text-xs font-mono uppercase tracking-widest group">
                                <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                Back to Home
                            </Link>
                        </div>

                        {/* Aura Glow Layer behind Glassmorphic Card structures */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none"></div>
                    </section>

                </main>
                <Footer compact={true} />
            </div>
        </>
    );
}