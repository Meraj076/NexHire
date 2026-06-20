import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const reviews = [
    {
        name: "Sarah K.",
        role: "Software Engineer",
        initials: "SK",
        stars: 5,
        text: '"NexHire helped me crack my system design round at Google. The AI feedback is brutally honest and spot-on. Highly recommended!"'
    },
    {
        name: "David M.",
        role: "Product Manager",
        initials: "DM",
        stars: 5,
        text: '"I was struggling with ATS screens for months. The resume analyzer fixed my keywords, and the mock interviews gave me immense confidence."'
    },
    {
        name: "Aisha T.",
        role: "Frontend Developer",
        initials: "AT",
        stars: 5,
        text: '"It\'s literally like having a senior engineer grilling you, but available 24/7 without judgment. Best investment for my career transition."'
    },
    {
        name: "James L.",
        role: "DevOps Engineer",
        initials: "JL",
        stars: 5,
        text: '"The DevOps and cloud questions were super relevant. Landing my role at AWS was so much easier thanks to the structured feedback."'
    },
    {
        name: "Emily R.",
        role: "Data Scientist",
        initials: "ER",
        stars: 5,
        text: '"I loved the live coding interface and data science metrics. The system design mock evaluation is incredibly detailed and accurate."'
    },
    {
        name: "Meraj A.",
        role: "Backend Developer",
        initials: "MA",
        stars: 5,
        text: '"ATS optimization alone got me 3x more callbacks. The AI mock feedback is extremely fast and high-quality. Best tool on the market!"'
    },
    {
        name: "Sophia V.",
        role: "Security Engineer",
        initials: "SV",
        stars: 5,
        text: '"The security scenarios were incredibly accurate. It simulates the actual high-pressure environment perfectly. Highly recommend to everyone."'
    }
];

export default function LandingPage() {
    const canvasRef = useRef(null);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    useEffect(() => {
        // --- 1. WebGL Background Animation ---
        const canvas = canvasRef.current;
        const gl = canvas?.getContext('webgl');
        let animationFrameId;

        if (gl) {
            const vertexShaderSource = `
                attribute vec2 position;
                varying vec2 v_texCoord;
                void main() {
                    v_texCoord = position * 0.5 + 0.5;
                    v_texCoord.y = 1.0 - v_texCoord.y;
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `;
            const fragmentShaderSource = `
                precision highp float;
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform vec2 u_mouse;
                varying vec2 v_texCoord;
                void main() {
                    vec2 uv = v_texCoord;
                    vec2 mouse = u_mouse / u_resolution;
                    float dist = distance(uv, mouse);
                    float spotlight = smoothstep(0.7, 0.0, dist) * 0.25;
                    float wave1 = sin(uv.x * 2.0 + u_time * 0.1) * cos(uv.y * 2.0 + u_time * 0.08);
                    float wave2 = sin(uv.y * 2.5 - u_time * 0.07) * cos(uv.x * 1.5 + u_time * 0.12);
                    vec3 baseColor = vec3(0.01, 0.015, 0.015);
                    vec3 accentColor = vec3(0.0, 1.0, 0.5);
                    vec3 color = mix(baseColor, accentColor * 0.06, (wave1 + wave2) * 0.5 + 0.5);
                    color += accentColor * spotlight;
                    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5));
                    color *= vignette;
                    gl_FragColor = vec4(color, 1.0);
                }
            `;

            function createShader(gl, type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                return shader;
            }

            const program = gl.createProgram();
            gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
            gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
            gl.linkProgram(program);
            gl.useProgram(program);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, "position");
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            const timeLocation = gl.getUniformLocation(program, "u_time");
            const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
            const mouseLocation = gl.getUniformLocation(program, "u_mouse");

            let mouseX = 0, mouseY = 0;
            const handleMouseMove = (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            };
            window.addEventListener('mousemove', handleMouseMove);

            function render(time) {
                if(canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    gl.viewport(0, 0, canvas.width, canvas.height);
                    gl.uniform1f(timeLocation, time * 0.001);
                    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
                    gl.uniform2f(mouseLocation, mouseX, mouseY);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
                animationFrameId = requestAnimationFrame(render);
            }
            render(0);
        }

        // --- 2. Intersection Observer (Scroll Animations) ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal-up, .line-reveal-content').forEach(el => observer.observe(el));

        // --- 3. Initial Load Sequences ---
        setTimeout(() => {
            const badge = document.getElementById('announcement-badge');
            if(badge) {
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }
        }, 600);

        document.querySelectorAll('.line-reveal-content').forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), 800 + (i * 200));
        });

        setTimeout(() => {
            const preview = document.getElementById('dashboard-preview');
            if(preview) {
                preview.style.opacity = '1';
                preview.style.transform = 'translateY(0) scale(1.05)';
            }
            setTimeout(() => {
                document.getElementById('ai-msg-1')?.classList.remove('opacity-0', '-translate-x-8');
                setTimeout(() => {
                    document.getElementById('user-msg-1')?.classList.remove('opacity-0', 'translate-x-8');
                    setTimeout(() => {
                        document.getElementById('typing-msg')?.classList.remove('opacity-0');
                    }, 1500);
                }, 2000);
            }, 1000);
        }, 1200);

        // --- 4. Timeline Scroll Logic ---
        const handleScroll = () => {
            const workflow = document.getElementById('workflow');
            const progress = document.querySelector('.timeline-progress');
            const steps = document.querySelectorAll('.timeline-step');
            
            if(workflow && progress) {
                const rect = workflow.getBoundingClientRect();
                const winHeight = window.innerHeight;
                
                if (rect.top < winHeight && rect.bottom > 0) {
                    const scrollPercent = Math.max(0, Math.min(100, ((winHeight - rect.top) / (rect.height + winHeight / 2)) * 100));
                    progress.style.height = `${scrollPercent}%`;

                    steps.forEach((step) => {
                        const stepRect = step.getBoundingClientRect();
                        const blob = step.querySelector('.step-blob');
                        if (stepRect.top < winHeight * 0.7) {
                            blob.style.borderColor = '#00e472';
                            blob.style.color = '#00e472';
                            blob.style.boxShadow = '0 0 15px rgba(0, 228, 114, 0.4)';
                        } else {
                            blob.style.borderColor = '#262626';
                            blob.style.color = '#e2e2e2';
                            blob.style.boxShadow = 'none';
                        }
                    });
                }
            }
        };
        window.addEventListener('scroll', handleScroll);

        // --- Cleanup ---
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    // 🧲 Magnetic Button & Parallax Logic (React handlers)
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

    const handleParallaxMove = (e) => {
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width - 0.5) * 10;
        const yPercent = (y / rect.height - 0.5) * -10;
        container.style.transform = `perspective(1000px) rotateX(${yPercent}deg) rotateY(${xPercent}deg) scale(1.05)`;
    };

    const handleParallaxLeave = (e) => {
        e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.05)`;
    };

    return (
        <div className="antialiased min-h-screen flex flex-col relative bg-black text-[#e2e2e2] font-sans">
            
            {/* Inline Custom Styles for Animations */}
            <style>{`
                canvas#canvas-background { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; }
                .glass-panel { background: rgba(23, 23, 23, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
                .card-hover-effect { transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s ease, box-shadow 0.4s ease; }
                .card-hover-effect:hover { transform: translateY(-6px); border-color: #00e472; box-shadow: 0 10px 30px rgba(0, 228, 114, 0.15); }
                .card-hover-effect:hover .material-symbols-outlined { color: #00e472; text-shadow: 0 0 10px rgba(0, 228, 114, 0.5); }
                .electric-glow { box-shadow: 0 0 30px rgba(0, 228, 114, 0.1); }
                .gradient-text { background: linear-gradient(90deg, #ffffff, #00e472, #ffffff); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradient-sweep 4s linear infinite; }
                @keyframes gradient-sweep { to { background-position: 200% center; } }
                .reveal-up { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
                .reveal-up.active { opacity: 1; transform: translateY(0); }
                .floating-anim { animation: floating 6s ease-in-out infinite; }
                @keyframes floating { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
                .line-reveal { overflow: hidden; display: block; }
                .line-reveal-content { display: block; transform: translateY(100%); transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1); }
                .line-reveal-content.active { transform: translateY(0); }
                .typing-indicator span { display: inline-block; width: 4px; height: 4px; border-radius: 50%; background-color: #00e472; margin: 0 1px; animation: bounce 1s infinite alternate; }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes bounce { to { transform: translateY(-4px); opacity: 0.5; } }
                .timeline-progress { position: absolute; left: 23px; top: 0; width: 2px; background: #00e472; height: 0%; transition: height 0.1s linear; z-index: 5; }
                @media (min-width: 768px) { .timeline-progress { left: 50%; transform: translateX(-50%); } }
                
                /* Reviews Slider styles */
                @keyframes scroll-reviews {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .reviews-slider {
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                }
                .reviews-slider::before, .reviews-slider::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    width: 100px;
                    height: 100%;
                    z-index: 2;
                    pointer-events: none;
                }
                .reviews-slider::before {
                    left: 0;
                    background: linear-gradient(to right, #000 0%, transparent 100%);
                }
                .reviews-slider::after {
                    right: 0;
                    background: linear-gradient(to left, #000 0%, transparent 100%);
                }
                .reviews-slide-track {
                    display: flex;
                    width: max-content;
                    animation: scroll-reviews 40s linear infinite;
                }
                .reviews-slide-track:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <canvas id="canvas-background" ref={canvasRef}></canvas>
            
            <Header />
            
            <main className="flex-grow z-10 relative">
                
                {/* Hero Section */}
                <section className="py-32 px-4 md:px-16 flex flex-col items-center text-center max-w-[1280px] mx-auto relative">
                    <div className="opacity-0 translate-y-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00e472]/30 bg-[#00e472]/10 mb-8 transition-all duration-1000 shadow-[0_0_15px_rgba(0,228,114,0.1)]" id="announcement-badge">
                        <span className="w-2 h-2 rounded-full bg-[#00e472] animate-pulse"></span>
                        <span className="font-mono text-xs text-[#00e472]">Powered by Google Gemini</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-[#e2e2e2] mb-6 max-w-4xl tracking-tight">
                        <span className="line-reveal"><span className="line-reveal-content">Crack Any Tech Interview.</span></span>
                        <span className="line-reveal"><span className="line-reveal-content"><span className="gradient-text">Train Smarter, Get Hired.</span></span></span>
                    </h1>
                    
                    <p className="reveal-up font-mono text-lg text-[#b9cbb8] max-w-2xl mb-10 leading-relaxed">
                        Bypass ATS filters, experience adaptive AI mock interviews, and get real-time feedback to land your dream role faster.
                    </p>
                    
                    <div className="reveal-up flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link to="/signup" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave} className="w-full sm:w-auto bg-[#00e472] text-[#00210b] px-6 md:px-8 py-3 md:py-4 rounded font-mono text-sm md:text-base font-bold hover:bg-[#63ff94] transition-all flex items-center justify-center gap-2">
                            Start Free Interview
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                        <Link to="/login" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave} className="w-full sm:w-auto glass-panel text-[#e2e2e2] px-6 md:px-8 py-3 md:py-4 rounded font-mono text-sm md:text-base font-medium hover:bg-white/5 transition-all flex items-center justify-center gap-3 border border-white/20">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                            Continue with Google
                        </Link>
                    </div>

                    {/* Trust Indicators / Stats */}
                    <div className="reveal-up flex flex-wrap justify-center gap-8 md:gap-20 mt-16 pt-10 border-t border-[#262626]/50 w-full max-w-4xl">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-[#e2e2e2]">10k+</h3>
                            <p className="font-mono text-xs text-[#b9cbb8] mt-2 uppercase tracking-wider">Interviews Simulated</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-[#00e472]">95%</h3>
                            <p className="font-mono text-xs text-[#b9cbb8] mt-2 uppercase tracking-wider">Offer Success Rate</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-[#e2e2e2]">50+</h3>
                            <p className="font-mono text-xs text-[#b9cbb8] mt-2 uppercase tracking-wider">Tech Roles Covered</p>
                        </div>
                    </div>

                    {/* Dashboard Preview Immersive */}
                    <div id="dashboard-preview" onMouseMove={handleParallaxMove} onMouseLeave={handleParallaxLeave} className="opacity-0 translate-y-16 mt-24 w-full max-w-6xl rounded-xl border border-white/20 glass-panel overflow-hidden electric-glow relative transform md:scale-105 transition-all duration-1000 shadow-2xl shadow-[#00e472]/20 z-20">
                        <div className="h-10 border-b border-white/20 bg-[#0A0A0A] flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#333535]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#333535]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#333535]"></div>
                        </div>
                        <div className="h-[450px] bg-[#050505] p-8 md:p-12 flex flex-col gap-6 overflow-hidden relative floating-anim">
                            <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
                                <div className="flex items-start gap-4 transform -translate-x-8 opacity-0 transition-all duration-700" id="ai-msg-1">
                                    <div className="w-8 h-8 rounded bg-[#00e472]/20 flex items-center justify-center border border-[#00e472]/50 shrink-0">
                                        <span className="material-symbols-outlined text-[#00e472] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>robot_2</span>
                                    </div>
                                    <div className="glass-panel p-5 rounded-lg rounded-tl-none border-l-2 border-l-[#00e472]">
                                        <p className="font-mono text-sm text-[#e2e2e2]">Let's start with a systems design question. How would you architect a highly scalable rate limiter for a public API?</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 flex-row-reverse self-end transform translate-x-8 opacity-0 transition-all duration-700" id="user-msg-1">
                                    <div className="w-8 h-8 rounded bg-[#333535] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[#e2e2e2] text-sm">person</span>
                                    </div>
                                    <div className="bg-bg-card p-5 rounded-lg rounded-tr-none border border-white/20">
                                        <p className="font-mono text-sm text-[#e2e2e2]">I would use a token bucket algorithm stored in Redis...</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 opacity-0 transition-all duration-500" id="typing-msg">
                                    <div className="w-8 h-8 rounded bg-[#00e472]/20 flex items-center justify-center border border-[#00e472]/50 shrink-0">
                                        <span className="material-symbols-outlined text-[#00e472] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>robot_2</span>
                                    </div>
                                    <div className="flex gap-1 items-center h-8 typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By Section */}
                <section className="py-10 border-b border-[#262626]/50 bg-[#050505]">
                    <div className="max-w-[1280px] mx-auto px-4 text-center reveal-up">
                        <p className="text-[#555] font-mono text-sm uppercase tracking-widest mb-8 font-bold">Our candidates have landed offers at</p>
                        <div className="flex flex-wrap justify-center gap-10 md:gap-20 items-center opacity-60 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0">
                            <div className="text-2xl font-bold font-sans tracking-tighter">Google</div>
                            <div className="text-2xl font-bold font-sans tracking-tight">META</div>
                            <div className="text-2xl font-bold font-sans tracking-tighter flex items-center gap-1"><span className="material-symbols-outlined text-3xl">shopping_cart</span>amazon</div>
                            <div className="text-2xl font-bold font-sans tracking-tight">Microsoft</div>
                            <div className="text-2xl font-bold font-sans tracking-widest text-[#E50914]">NETFLIX</div>
                        </div>
                    </div>
                </section>

                {/* Feature Matrix */}
                <section id="features" className="py-32 px-4 md:px-16 max-w-[1280px] mx-auto">
                    <div className="text-center mb-16 reveal-up">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4 tracking-tight">Engineered for Precision</h2>
                        <p className="font-mono text-lg text-[#b9cbb8] max-w-2xl mx-auto">Advanced tools designed to deconstruct the interview process.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6">
                        <div className="lg:col-span-2 lg:row-span-2 bg-[#0A0A0A]/60 border border-[#262626] rounded-xl p-10 lg:p-12 card-hover-effect relative overflow-hidden group flex flex-col h-full reveal-up">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00e472]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-16 h-16 rounded-lg bg-bg-card mb-8 flex items-center justify-center border border-white/20 group-hover:border-[#00e472]/50 transition-colors relative z-10">
                                <span className="material-symbols-outlined text-3xl text-[#e2e2e2] transition-colors">description</span>
                            </div>
                            <h3 className="text-[32px] md:text-[40px] font-bold text-[#e2e2e2] mb-4 relative z-10 leading-tight">Smart Resume Analysis</h3>
                            <p className="font-mono text-base text-[#b9cbb8] flex-grow relative z-10 max-w-xl">Upload your PDF. We instantly identify missing keywords, calculate ATS compatibility scores, and suggest structural improvements to ensure your application gets past automated screeners and into the hands of recruiters.</p>
                        </div>
                        <div className="lg:col-span-1 bg-[#0A0A0A]/60 border border-[#262626] rounded-xl p-8 card-hover-effect relative overflow-hidden group flex flex-col h-full reveal-up">
                            <div className="w-12 h-12 rounded bg-bg-card mb-6 flex items-center justify-center border border-white/20 group-hover:border-[#00e472]/50 transition-colors z-10 relative">
                                <span className="material-symbols-outlined text-[#e2e2e2] transition-colors">record_voice_over</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#e2e2e2] mb-3 z-10 relative">Role-Specific Mock Rooms</h3>
                            <p className="font-mono text-sm text-[#b9cbb8] flex-grow z-10 relative">Dynamic interactive sessions that adapt to your answers in real-time, simulating high-pressure technical environments.</p>
                        </div>
                        <div className="lg:col-span-1 bg-[#0A0A0A]/60 border border-[#262626] rounded-xl p-8 card-hover-effect relative overflow-hidden group flex flex-col h-full reveal-up">
                            <div className="w-12 h-12 rounded bg-bg-card mb-6 flex items-center justify-center border border-white/20 group-hover:border-[#00e472]/50 transition-colors">
                                <span className="material-symbols-outlined text-[#e2e2e2] transition-colors">memory</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#e2e2e2] mb-3">Bulk Evaluation Engine</h3>
                            <p className="font-mono text-sm text-[#b9cbb8] flex-grow">Optimized backend processing. Review comprehensive logs, code execution results, and communication metrics instantly.</p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-32 bg-[#050505]/40 border-y border-[#262626]" id="workflow">
                    <div className="px-4 md:px-16 max-w-[1280px] mx-auto">
                        <div className="mb-24 text-center reveal-up">
                            <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4 tracking-tight">The Workflow</h2>
                            <p className="font-mono text-lg text-[#b9cbb8] max-w-2xl mx-auto">A streamlined path from signup to interview mastery.</p>
                        </div>
                        <div className="relative pl-12 md:pl-0 max-w-4xl mx-auto">
                            <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-[2px] bg-bg-panel md:-translate-x-1/2 z-0"></div>
                            <div className="timeline-progress"></div>
                            <div className="flex flex-col gap-20 relative z-10">
                                <div className="timeline-step relative flex flex-col md:flex-row items-start md:items-center justify-between group">
                                    <div className="md:w-[45%] text-left md:text-right order-2 md:order-1 mt-4 md:mt-0 ml-4 md:ml-0">
                                        <h4 className="text-[24px] font-bold text-[#e2e2e2] mb-3 group-hover:text-[#00e472] transition-colors">Secure Authentication</h4>
                                        <p className="font-mono text-sm text-[#b9cbb8] leading-relaxed">One-click Google Sign-In to sync your professional profile.</p>
                                    </div>
                                    <div className="absolute left-[-47px] md:relative md:left-auto md:w-[10%] flex justify-center order-1 md:order-2 z-10">
                                        <div className="step-blob w-12 h-12 rounded-full border-2 border-[#262626] flex items-center justify-center text-[#e2e2e2] font-mono font-bold transition-all bg-[#0A0A0A]">01</div>
                                    </div>
                                    <div className="md:w-[45%] order-3 hidden md:block"></div>
                                </div>
                                <div className="timeline-step relative flex flex-col md:flex-row items-start md:items-center justify-between group">
                                    <div className="md:w-[45%] order-2 md:order-1 hidden md:block"></div>
                                    <div className="absolute left-[-47px] md:relative md:left-auto md:w-[10%] flex justify-center order-1 md:order-2 z-10">
                                        <div className="step-blob w-12 h-12 rounded-full border-2 border-[#262626] flex items-center justify-center text-[#e2e2e2] font-mono font-bold transition-all bg-[#0A0A0A]">02</div>
                                    </div>
                                    <div className="md:w-[45%] text-left order-3 mt-4 md:mt-0 ml-4 md:ml-0">
                                        <h4 className="text-[24px] font-bold text-[#e2e2e2] mb-3 group-hover:text-[#00e472] transition-colors">Adaptive Interview</h4>
                                        <p className="font-mono text-sm text-[#b9cbb8] leading-relaxed">Engage in a dynamic mock session tailored to your target role.</p>
                                    </div>
                                </div>
                                <div className="timeline-step relative flex flex-col md:flex-row items-start md:items-center justify-between group">
                                    <div className="md:w-[45%] text-left md:text-right order-2 md:order-1 mt-4 md:mt-0 ml-4 md:ml-0">
                                        <h4 className="text-[24px] font-bold text-[#e2e2e2] mb-3 group-hover:text-[#00e472] transition-colors">Instant Analytics</h4>
                                        <p className="font-mono text-sm text-[#b9cbb8] leading-relaxed">Receive a detailed breakdown of your performance and areas for improvement.</p>
                                    </div>
                                    <div className="absolute left-[-47px] md:relative md:left-auto md:w-[10%] flex justify-center order-1 md:order-2 z-10">
                                        <div className="step-blob w-12 h-12 rounded-full border-2 border-[#262626] flex items-center justify-center text-[#e2e2e2] font-mono font-bold transition-all bg-[#0A0A0A]">03</div>
                                    </div>
                                    <div className="md:w-[45%] order-3 hidden md:block"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Wall of Love (Testimonials Marquee Slider) */}
                <section className="pt-32 pb-12 overflow-hidden" id="reviews">
                    <div className="max-w-[1280px] mx-auto px-4 text-center mb-16 reveal-up">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4 tracking-tight">Wall of Love</h2>
                        <p className="font-mono text-lg text-[#b9cbb8] max-w-2xl mx-auto">See how NexHire is transforming careers worldwide.</p>
                    </div>
                    
                    <div className="reviews-slider reveal-up">
                        <div className="reviews-slide-track">
                            {[...reviews, ...reviews].map((rev, idx) => (
                                <div 
                                    key={idx} 
                                    className="w-[310px] md:w-[360px] mx-4 glass-panel p-8 rounded-xl border border-[#262626] flex flex-col gap-6 flex-shrink-0 card-hover-effect"
                                >
                                    <div className="flex text-[#00e472]">
                                        {[...Array(rev.stars)].map((_, sIdx) => (
                                            <span key={sIdx} className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                        ))}
                                    </div>
                                    <p className="font-mono text-sm text-[#e2e2e2] flex-grow leading-relaxed">
                                        {rev.text}
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-[#e2e2e2] font-bold shrink-0">
                                            {rev.initials}
                                        </div>
                                        <div className="text-left">
                                            <h4 className="text-sm font-bold text-[#e2e2e2]">{rev.name}</h4>
                                            <p className="text-xs text-[#b9cbb8]">{rev.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="py-32 px-4 md:px-16 max-w-[1280px] mx-auto border-t border-[#262626]/50">
                    <div className="text-center mb-16 reveal-up">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4 tracking-tight">The Unfair Advantage</h2>
                        <p className="font-mono text-lg text-[#b9cbb8] max-w-2xl mx-auto">Why top engineers switch to NexHire.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center reveal-up">
                        {/* Traditional */}
                        <div className="flex-1 bg-[#050505] border border-[#262626] rounded-2xl p-8 md:p-10 opacity-70">
                            <h3 className="text-2xl font-bold text-[#bab8b7] mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#ff4b4b]">cancel</span>
                                Traditional Prep
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-[#555] mt-1">remove</span><span className="text-[#bab8b7]">Generic leetcode grinding without real context.</span></li>
                                <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-[#555] mt-1">remove</span><span className="text-[#bab8b7]">Waiting days for human peer mocks to be scheduled.</span></li>
                                <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-[#555] mt-1">remove</span><span className="text-[#bab8b7]">No feedback on communication style or tone.</span></li>
                                <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-[#555] mt-1">remove</span><span className="text-[#bab8b7]">Guessing why your resume gets rejected by ATS.</span></li>
                            </ul>
                        </div>
                        {/* NexHire */}
                        <div className="flex-1 glass-panel border border-[#00e472]/50 rounded-2xl p-8 md:p-10 relative overflow-hidden card-hover-effect">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e472]/10 blur-[50px] rounded-full"></div>
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                                <span className="material-symbols-outlined text-[#00e472]">check_circle</span>
                                NexHire AI
                            </h3>
                            <ul className="space-y-4 relative z-10">
                                <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-[#00e472] mt-1">check</span><span className="text-[#e2e2e2] font-medium">Role-specific system design & behavioral scenarios.</span></li>
                                <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-[#00e472] mt-1">check</span><span className="text-[#e2e2e2] font-medium">On-demand 24/7 mock interviews with brutal honesty.</span></li>
                                <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-[#00e472] mt-1">check</span><span className="text-[#e2e2e2] font-medium">Detailed metrics on phrasing, confidence, and pacing.</span></li>
                                <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-[#00e472] mt-1">check</span><span className="text-[#e2e2e2] font-medium">Instant resume keyword gap analysis and ATS scoring.</span></li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Supported Roles & Tech */}
                <section className="py-20 bg-[#00e472]/[0.02] border-y border-[#00e472]/10 overflow-hidden mb-12">
                    <div className="px-4 md:px-16 max-w-[1280px] mx-auto text-center mb-10 reveal-up">
                        <p className="font-mono text-sm text-[#00e472] uppercase tracking-widest font-bold">Simulate Interviews For Any Tech Stack</p>
                    </div>
                    
                    {/* CSS Marquee animation */}
                    <style>{`
                        @keyframes scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(calc(-250px * 7)); }
                        }
                        .slider {
                            width: 100%;
                            overflow: hidden;
                            position: relative;
                        }
                        .slider::before, .slider::after {
                            content: "";
                            position: absolute;
                            top: 0;
                            width: 150px;
                            height: 100%;
                            z-index: 2;
                        }
                        .slider::before {
                            left: 0;
                            background: linear-gradient(to right, #000 0%, transparent 100%);
                        }
                        .slider::after {
                            right: 0;
                            background: linear-gradient(to left, #000 0%, transparent 100%);
                        }
                        .slide-track {
                            display: flex;
                            width: calc(250px * 14);
                            animation: scroll 40s linear infinite;
                        }
                        .slide {
                            width: 250px;
                            padding: 0 15px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .tech-badge {
                            background: rgba(10, 10, 10, 0.8);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            padding: 12px 24px;
                            border-radius: 100px;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            color: #b9cbb8;
                            font-family: monospace;
                            font-weight: bold;
                            transition: all 0.3s ease;
                        }
                        .tech-badge:hover {
                            border-color: #00e472;
                            color: #fff;
                            transform: translateY(-2px);
                            box-shadow: 0 5px 15px rgba(0, 228, 114, 0.2);
                        }
                    `}</style>
                    
                    <div className="slider">
                        <div className="slide-track">
                            {[...Array(2)].map((_, i) => (
                                <React.Fragment key={i}>
                                    <div className="slide"><div className="tech-badge"><span className="material-symbols-outlined text-[#00e472]">code</span> Frontend</div></div>
                                    <div className="slide"><div className="tech-badge"><span className="material-symbols-outlined text-[#4285F4]">storage</span> Backend</div></div>
                                    <div className="slide"><div className="tech-badge"><span className="material-symbols-outlined text-[#F4B400]">architecture</span> System Design</div></div>
                                    <div className="slide"><div className="tech-badge"><span className="material-symbols-outlined text-[#0F9D58]">data_usage</span> Data Science</div></div>
                                    <div className="slide"><div className="tech-badge"><span className="material-symbols-outlined text-[#DB4437]">cloud</span> DevOps</div></div>
                                    <div className="slide"><div className="tech-badge"><span className="material-symbols-outlined text-[#AB47BC]">security</span> Security</div></div>
                                    <div className="slide"><div className="tech-badge"><span className="material-symbols-outlined text-[#00ACC1]">smartphone</span> Mobile</div></div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 px-4 md:px-4 max-w-[1280px] mx-auto">
                    <div className="text-center mb-16 reveal-up">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#e2e2e2] mb-4 tracking-tight">Got Questions?</h2>
                        <p className="font-mono text-lg text-[#b9cbb8] mx-auto">Everything you need to know about NexHire.</p>
                    </div>
                    <div className="space-y-4 reveal-up">
                        {[
                            { q: "Is the AI feedback truly accurate?", a: "Yes, our models are trained on thousands of successful interview transcripts from FAANG companies and fine-tuned to evaluate technical accuracy, communication clarity, and problem-solving structure." },
                            { q: "Can I practice for non-technical roles?", a: "While our core focus is engineering and product roles (Frontend, Backend, System Design), our behavioral interview modules are universally applicable to any role." },
                            { q: "Does the resume parser work with all PDF formats?", a: "Our ATS parser is designed to read standard PDF formats. For best results, we recommend using clean, single-column text-based resumes without heavy graphics." },
                            { q: "How many mock interviews can I take?", a: "Free users get 2 full mock interviews. Pro users have unlimited access to all role-specific rooms, advanced analytics, and unlimited resume reviews." }
                        ].map((faq, i) => (
                            <div key={i} className="glass-panel border border-[#262626] rounded-xl overflow-hidden transition-all duration-300">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full text-left p-6 flex items-center justify-between gap-4 group hover:bg-[#00e472]/[0.02] transition-colors"
                                >
                                    <h4 className="text-lg font-bold text-[#e2e2e2] flex items-center gap-4 text-left">
                                        <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#262626] flex items-center justify-center group-hover:border-[#00e472] transition-colors shrink-0">
                                            <span className="material-symbols-outlined text-[#00e472] text-sm">help</span>
                                        </div>
                                        {faq.q}
                                    </h4>
                                    <span className={`material-symbols-outlined text-[#b9cbb8] group-hover:text-[#00e472] transition-transform duration-300 shrink-0 ${
                                        openFaqIndex === i ? 'rotate-180' : 'rotate-0'
                                    }`}>
                                        expand_more
                                    </span>
                                </button>
                                <div 
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                        openFaqIndex === i 
                                            ? 'max-h-[300px] border-t border-[#262626]/40 opacity-100 py-6 px-6' 
                                            : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <p className="font-mono text-sm text-[#b9cbb8] md:ml-12 leading-relaxed text-left">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="pt-12 pb-32 px-4 md:px-16 max-w-[1280px] mx-auto">
                    <div className="glass-panel rounded-3xl p-12 md:p-24 text-center relative overflow-hidden border border-[#00e472]/30 reveal-up electric-glow">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00e472]/20 via-transparent to-[#00e472]/5 opacity-60"></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00e472]/20 blur-[120px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">Elevate Your Career.</h2>
                            <p className="font-mono text-xl text-[#b9cbb8] max-w-2xl mb-12">Don't let your next interview be a practice run. Join thousands of engineers who landed their dream jobs with NexHire.</p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                <Link to="/signup" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave} className="bg-[#00e472] text-[#00210b] px-10 py-5 rounded-xl font-mono text-lg font-bold hover:bg-[#63ff94] transition-all flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(0,228,114,0.4)]">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                                    Get Started for Free
                                </Link>
                                <Link to="/pricing" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave} className="glass-panel text-[#e2e2e2] px-10 py-5 rounded-xl font-mono text-lg font-medium hover:bg-white/10 transition-all flex items-center justify-center border border-white/20">
                                    View Pricing
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                
            </main>
            
            <Footer />
        </div>
    );
}