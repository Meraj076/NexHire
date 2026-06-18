import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import nexhireLogo from '../assets/NexHire2.png';

export default function Header() {
    const [navLoaded, setNavLoaded] = useState(false);
    const [linksLoaded, setLinksLoaded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('features');

    // Scroll to section on hash changes or initial navigate from another page
    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            const targetId = location.hash.substring(1);
            const timer = setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location.pathname, location.hash]);

    // Scroll Spy for highlighting active section on Landing Page
    useEffect(() => {
        if (location.pathname !== '/') return;

        const handleScrollSpy = () => {
            const featuresEl = document.getElementById('features');
            const workflowEl = document.getElementById('workflow');
            
            if (!featuresEl || !workflowEl) return;

            const scrollPos = window.scrollY + window.innerHeight / 3;

            // Get offsets of the elements
            const featuresOffset = featuresEl.offsetTop;
            const workflowOffset = workflowEl.offsetTop;

            if (scrollPos >= workflowOffset) {
                setActiveSection('workflow');
            } else {
                setActiveSection('features');
            }
        };

        window.addEventListener('scroll', handleScrollSpy);
        handleScrollSpy();

        return () => window.removeEventListener('scroll', handleScrollSpy);
    }, [location.pathname]);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        if (location.pathname === '/') {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            window.history.pushState(null, null, `/#${targetId}`);
            setActiveSection(targetId);
        } else {
            navigate(`/#${targetId}`);
        }
    };

    const isPricingActive = location.pathname === '/pricing';
    const isFeaturesActive = location.pathname === '/' && activeSection === 'features';
    const isWorkflowActive = location.pathname === '/' && activeSection === 'workflow';

    // 🚀 Slide-down & Fade-in Animation Logic
    useEffect(() => {
        setTimeout(() => setNavLoaded(true), 100);
        setTimeout(() => setLinksLoaded(true), 300);
    }, []);

    // 🧲 Magnetic Button Logic (React Way)
    const handleMouseMove = (e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };

    const handleMouseLeave = (e) => {
        const btn = e.currentTarget;
        btn.style.transform = `translate(0, 0)`;
    };

    return (
        <nav 
            className={`bg-surface/40 backdrop-blur-xl sticky top-0 w-full z-50 border-b border-outline-variant/20 transform transition-transform duration-700 ${navLoaded ? 'translate-y-0' : '-translate-y-full'}`}
        >
            <div className="flex justify-between items-center px-4 lg:px-16 h-20 max-w-[1280px] mx-auto relative">
                
                {/* Brand Logo */}
                <Link 
                    to="/" 
                    onClick={(e) => {
                        if (location.pathname === '/') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            navigate('/', { replace: true });
                        }
                    }}
                    className="flex items-center gap-2 cursor-pointer z-10"
                >
                    <img src={nexhireLogo} alt="NexHire Logo" style={{ width: '140px', height: 'auto', display: 'block' }} />
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2 w-full z-0">
                    <a 
                        href="/#features" 
                        onClick={(e) => handleNavClick(e, 'features')}
                        className={`nav-link-underline ${
                            isFeaturesActive ? 'text-[#00e472]' : 'text-[#b9cbb8] hover:text-[#00e472]'
                        } transition-all duration-300 font-mono text-base px-3 py-1 rounded transition-opacity duration-700 ${linksLoaded ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Features
                    </a>
                    <a 
                        href="/#workflow" 
                        onClick={(e) => handleNavClick(e, 'workflow')}
                        className={`nav-link-underline ${
                            isWorkflowActive ? 'text-[#00e472]' : 'text-[#b9cbb8] hover:text-[#00e472]'
                        } transition-all duration-300 font-mono text-base px-3 py-1 rounded ${linksLoaded ? 'opacity-100' : 'opacity-0 delay-100'}`}
                    >
                        How It Works
                    </a>
                    <Link 
                        to="/pricing" 
                        className={`nav-link-underline ${
                            isPricingActive ? 'text-[#00e472]' : 'text-[#b9cbb8] hover:text-[#00e472]'
                        } transition-all duration-300 font-mono text-base px-3 py-1 rounded ${linksLoaded ? 'opacity-100' : 'opacity-0 delay-200'}`}
                    >
                        Pricing
                    </Link>
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-4 z-10">
                    <Link 
                        to="/login"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="hidden lg:block px-4 py-2 text-[#b9cbb8] hover:text-[#00e472] font-mono text-base transition-colors"
                        style={{ transition: 'transform 0.1s ease-out, color 0.3s' }}
                    >
                        Login
                    </Link>
                    
                    <Link 
                        to="/signup"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="hidden lg:flex bg-[#00e472] text-[#00210b] px-6 py-2 rounded font-mono text-base font-semibold hover:bg-[#63ff94] transition-colors"
                        style={{ transition: 'transform 0.1s ease-out, background-color 0.3s' }}
                    >
                        Get Started
                    </Link>

                    {/* Mobile Hamburger Menu */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-[#e2e2e2] p-2 hover:text-[#00e472] transition-colors"
                    >
                        <span className="material-symbols-outlined">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Backdrop Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Right Drawer Menu */}
            <div 
                className={`lg:hidden fixed top-0 right-0 h-screen w-[280px] bg-[#0a0a0a]/98 backdrop-blur-3xl border-l border-[#00e472]/20 transition-all duration-300 z-50 flex flex-col p-6 ${
                    isMobileMenuOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'
                }`}
            >
                {/* Drawer Close Button */}
                <div className="flex justify-end mb-8">
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[#e2e2e2] p-2 hover:text-[#00e472] transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex flex-col items-left gap-6">
                    <a 
                        href="/#features" 
                        onClick={(e) => handleNavClick(e, 'features')}
                        className={`font-mono text-base transition-colors ${
                            isFeaturesActive ? 'text-[#00e472]' : 'text-[#b9cbb8] hover:text-[#00e472]'
                        }`}
                    >
                        Features
                    </a>
                    <a 
                        href="/#workflow" 
                        onClick={(e) => handleNavClick(e, 'workflow')}
                        className={`font-mono text-base transition-colors ${
                            isWorkflowActive ? 'text-[#00e472]' : 'text-[#b9cbb8] hover:text-[#00e472]'
                        }`}
                    >
                        How It Works
                    </a>
                    <Link 
                        to="/pricing" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`font-mono text-base transition-colors ${
                            isPricingActive ? 'text-[#00e472]' : 'text-[#b9cbb8] hover:text-[#00e472]'
                        }`}
                    >
                        Pricing
                    </Link>
                    <div className="w-full h-px bg-[#262626]"></div>
                    <Link 
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[#b9cbb8] hover:text-[#00e472] font-mono text-base transition-colors"
                    >
                        Login
                    </Link>
                    <Link 
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="bg-[#00e472] text-[#00210b] px-8 py-3 rounded-full font-mono text-base font-bold w-full text-center hover:bg-[#63ff94] transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}