import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Bot, Settings2, FileWarning, LogOut, ChevronLeft, Shield, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import nexhireLogo from '../assets/nexhire-logo.png';

const navItems = [
    { name: 'Dashboard',    path: '/admin',            icon: <LayoutDashboard size={20} /> },
    { name: 'Users',        path: '/admin/users',       icon: <Users size={20} /> },
    { name: 'API Analytics',path: '/admin/analytics',   icon: <Bot size={20} /> },
    { name: 'Prompts',      path: '/admin/prompts',     icon: <Settings2 size={20} /> },
    { name: 'Error Logs',   path: '/admin/logs',        icon: <FileWarning size={20} /> },
];

export default function AdminSidebar() {
    const location = useLocation();
    const navigate  = useNavigate();
    const logout    = useAuthStore((state) => state.logout);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };

    const SidebarContent = () => (
        <aside className="h-full flex flex-col justify-between bg-[#0c0f0f] border-r border-[#00e472]/10">
            {/* Top — Logo + Admin Badge */}
            <div>
                <div className="h-20 border-b border-[#00e472]/10 flex items-center justify-between px-5">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={nexhireLogo} alt="NexHire" className="h-6 w-auto" />
                    </Link>
                    <span className="flex items-center gap-1 px-2 py-1 bg-[#00e472]/10 border border-[#00e472]/20 rounded-lg text-[10px] font-mono text-[#00e472] uppercase tracking-widest">
                        <Shield size={10} /> Admin
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="p-4 mt-2 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm transition-all duration-200 ${
                                    isActive
                                        ? 'bg-[#00e472]/10 text-[#00e472] border border-[#00e472]/20 shadow-[0_0_12px_rgba(0,228,114,0.08)]'
                                        : 'text-[#849584] hover:bg-[#1a1c1c] hover:text-[#e2e2e2]'
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00e472]" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 space-y-2 border-t border-[#00e472]/10">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-mono text-sm text-[#849584] hover:bg-[#1a1c1c] hover:text-[#00e472] transition-all duration-200"
                >
                    <ChevronLeft size={20} />
                    <span>Back to App</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-mono text-sm text-[#849584] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0c0f0f] border-b border-[#00e472]/10 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-[#00e472]" />
                    <span className="font-mono text-sm text-[#00e472]">Admin Panel</span>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#849584] hover:text-[#00e472]">
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Drawer */}
            <div className={`md:hidden fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </div>
        </>
    );
}
