import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import nexhireLogo from '../assets/nexhire-logo.png';
import { LayoutDashboard, FileText, Video, PieChart, Settings, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();
    const { logout, role } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Resumes', path: '/dashboard/resumes', icon: <FileText size={20} /> },
        { name: 'Interview', path: '/dashboard/interview', icon: <Video size={20} /> },
        { name: 'Analytics', path: '/dashboard/analytics', icon: <PieChart size={20} /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
    ];

    return (
        <>
            {/* Mobile Top Navigation Bar (Only visible on small screens) */}
            <div className="md:hidden w-full h-16 bg-bg-base border-b border-border flex items-center justify-between px-4 fixed top-0 left-0 z-40">
                <Link to="/">
                    <img src={nexhireLogo} alt="NexHire" className="h-6 w-auto" />
                </Link>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-text-main p-2 hover:text-[#00e472] transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar Container */}
            <aside 
                className={`fixed top-0 left-0 h-screen w-64 bg-bg-base border-r border-border flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 md:static md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div>
                    {/* Logo Area */}
                    <div className="h-16 md:h-24 border-b border-border flex items-center justify-between md:justify-center px-6">
                        <Link to="/">
                            <img src={nexhireLogo} alt="NexHire" className="h-6 md:h-8 w-auto" />
                        </Link>
                        {/* Close button inside sidebar for mobile */}
                        <button 
                            className="md:hidden text-text-muted hover:text-[#00e472]"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-4 space-y-2 mt-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-[#00e472]/10 text-[#00e472] border border-[#00e472]/20 shadow-[0_0_15px_rgba(0,228,114,0.1)]' 
                                            : 'text-text-muted hover:bg-[#1a1c1c] hover:text-text-main'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-border space-y-2">
                    {/* Admin Panel Link (ADMIN only) */}
                    {role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-mono text-sm text-[#00e472] bg-[#00e472]/5 border border-[#00e472]/15 hover:bg-[#00e472]/10 transition-all duration-300"
                        >
                            <Shield size={20} />
                            <span>Admin Panel</span>
                            <span className="ml-auto w-2 h-2 rounded-full bg-[#00e472] animate-pulse" />
                        </Link>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-mono text-sm text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                    >
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
