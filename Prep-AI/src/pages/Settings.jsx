import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Save, AlertTriangle, HelpCircle, Gift, Copy, ExternalLink, FileText, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import API from '../services/api';

export default function Settings() {
    const navigate = useNavigate();
    const { username, userEmail, login, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    
    // Profile State
    const [profileData, setProfileData] = useState({
        username: username || '',
        email: userEmail || ''
    });

    useEffect(() => {
        setProfileData({
            username: username || '',
            email: userEmail || ''
        });
    }, [username, userEmail]);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    // Password visibility toggle states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Mock State for toggles
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [featureUpdates, setFeatureUpdates] = useState(false);

    // Support State
    const [ticketData, setTicketData] = useState({ subject: '', message: '' });
    const [activeDoc, setActiveDoc] = useState(null);

    const handleTicketSubmit = (e) => {
        e.preventDefault();
        if (!ticketData.subject.trim() || !ticketData.message.trim()) {
            toast.error("Please fill in both subject and description fields.");
            return;
        }
        toast.success("Support ticket sent successfully!");
        setTicketData({ subject: '', message: '' });
    };

    const toggleDoc = (index) => {
        setActiveDoc(activeDoc === index ? null : index);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        
        if (!profileData.username.trim() || !profileData.email.trim()) {
            toast.error("Username and email cannot be empty.");
            return;
        }

        const loadingToast = toast.loading('Updating profile...');
        
        try {
            const response = await API.put('/api/v1/users/profile/update', {
                username: profileData.username,
                email: profileData.email
            });
            
            // The backend returns a new token and updated user details in AuthResponse
            const { token, email, username: newUsername, role } = response.data;
            
            // Update global store and local storage with new JWT and details
            login(token, email, newUsername, role);
            
            toast.success("Profile updated successfully!", { id: loadingToast });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile", { id: loadingToast });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error("Please fill all password fields.");
            return;
        }
        
        const loadingToast = toast.loading('Changing password...');
        try {
            await API.put('/api/v1/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password changed successfully!", { id: loadingToast });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password", { id: loadingToast });
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and will erase all your history.")) {
            const loadingToast = toast.loading('Deleting account...');
            try {
                await API.delete('/api/v1/users/delete-account');
                toast.success("Account deleted successfully!", { id: loadingToast });
                logout();
                navigate('/signup');
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete account", { id: loadingToast });
            }
        }
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: <User size={18} /> },
        { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
        { id: 'security', name: 'Security', icon: <Shield size={18} /> },
        { id: 'billing', name: 'Billing', icon: <CreditCard size={18} /> },
        { id: 'referral', name: 'Refer & Earn', icon: <Gift size={18} /> },
        { id: 'support', name: 'Help & Support', icon: <HelpCircle size={18} /> },
    ];

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
                            <SettingsIcon className="text-[#00e472]" /> Account Settings
                        </h1>
                        <p className="font-mono text-xs text-text-muted mt-1">Manage your account preferences and configurations.</p>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-6 md:p-10 relative z-10">
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
                        
                        {/* LEFT: Tab Navigation */}
                        <aside className="w-full lg:w-64 shrink-0 space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        activeTab === tab.id 
                                            ? 'bg-[#00e472]/10 text-[#00e472] border border-[#00e472]/30 font-bold' 
                                            : 'text-text-muted hover:bg-bg-panel hover:text-text-main border border-transparent'
                                    }`}
                                >
                                    {tab.icon} {tab.name}
                                </button>
                            ))}
                        </aside>

                        {/* RIGHT: Tab Content */}
                        <div className="flex-grow">
                            
                            {/* ===================== PROFILE TAB ===================== */}
                            {activeTab === 'profile' && (
                                <div className="glass-panel border border-border rounded-2xl p-6 md:p-8 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Profile Information</h2>
                                    <form onSubmit={handleProfileSave} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-muted">Username</label>
                                                <input 
                                                    type="text" 
                                                    value={profileData.username} 
                                                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                                                    className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50 transition-all" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-muted">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={profileData.email} 
                                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                                    className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50 transition-all" 
                                                />
                                                <p className="text-[10px] text-text-muted mt-1">Note: Changing your email will seamlessly update your current session.</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-border flex justify-end">
                                            <button type="submit" className="px-4 md:px-6 py-2 bg-[#00e472] hover:bg-[#00cc66] text-black font-bold rounded-xl transition-colors flex items-center gap-2 text-sm md:text-base">
                                                <Save size={16} /> Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ===================== NOTIFICATIONS TAB ===================== */}
                            {activeTab === 'notifications' && (
                                <div className="glass-panel border border-border rounded-2xl p-6 md:p-8 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Email Notifications</h2>
                                    <div className="space-y-6">
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-text-main font-bold">Weekly Performance Reports</h3>
                                                <p className="text-sm text-text-muted mt-1">Receive a weekly summary of your AI interview progress and ATS scores.</p>
                                            </div>
                                            <button 
                                                onClick={() => setEmailAlerts(!emailAlerts)}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailAlerts ? 'bg-[#00e472]' : 'bg-[#1e2020]'}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-text-main font-bold">Product Updates</h3>
                                                <p className="text-sm text-text-muted mt-1">Get notified when we add new features or AI algorithms.</p>
                                            </div>
                                            <button 
                                                onClick={() => setFeatureUpdates(!featureUpdates)}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${featureUpdates ? 'bg-[#00e472]' : 'bg-[#1e2020]'}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${featureUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* ===================== SECURITY TAB ===================== */}
                            {activeTab === 'security' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="glass-panel border border-border rounded-2xl p-6 md:p-8">
                                        <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Change Password</h2>
                                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-muted">Current Password</label>
                                                <div className="relative">
                                                    <input 
                                                        type={showCurrentPassword ? "text" : "password"} 
                                                        placeholder="••••••••" 
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                        className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 pr-12 text-text-main focus:outline-none focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50" 
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-[#00e472] transition-colors"
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-muted">New Password</label>
                                                <div className="relative">
                                                    <input 
                                                        type={showNewPassword ? "text" : "password"} 
                                                        placeholder="••••••••" 
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                        className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 pr-12 text-text-main focus:outline-none focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50" 
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-[#00e472] transition-colors"
                                                    >
                                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-muted">Confirm New Password</label>
                                                <div className="relative">
                                                    <input 
                                                        type={showConfirmPassword ? "text" : "password"} 
                                                        placeholder="••••••••" 
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                        className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 pr-12 text-text-main focus:outline-none focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50" 
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-[#00e472] transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-border">
                                                <button type="submit" className="px-4 md:px-6 py-2 bg-bg-card hover:bg-bg-panel text-text-main border border-border font-bold rounded-xl transition-colors text-sm md:text-base">
                                                    Update Password
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-6 md:p-8">
                                        <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                                            <AlertTriangle size={20} /> Danger Zone
                                        </h2>
                                        <p className="text-sm text-text-muted mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                                        <button onClick={handleDeleteAccount} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-text-main font-bold rounded-xl transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ===================== BILLING TAB ===================== */}
                            {activeTab === 'billing' && (
                                <div className="glass-panel border border-border rounded-2xl p-6 md:p-8 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Subscription Plan</h2>
                                    
                                    <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-text-main">Free Tier</h3>
                                                <span className="px-2 py-0.5 bg-bg-card text-text-muted text-xs font-mono rounded border border-border">Active</span>
                                            </div>
                                            <p className="text-sm text-text-muted">You are currently on the free evaluation plan. Features are limited.</p>
                                        </div>
                                        <div className="shrink-0 w-full sm:w-auto">
                                            <Link to="/pricing" className="px-4 md:px-6 py-3 bg-[#00e472] hover:bg-[#00cc66] text-black font-bold rounded-xl transition-colors inline-block text-center w-full text-sm md:text-base">
                                                Upgrade to Pro
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Removed Appearance Tab */}

                            {/* ===================== REFERRAL TAB ===================== */}
                            {activeTab === 'referral' && (
                                <div className="glass-panel border border-border rounded-2xl p-6 md:p-8 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                                        <div className="p-3 bg-[#00e472]/10 text-[#00e472] rounded-xl">
                                            <Gift size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-text-main">Refer & Earn</h2>
                                            <p className="text-sm text-text-muted">Invite friends to Prep-AI and earn free premium features!</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-bg-card border border-border rounded-xl p-6 mb-6 text-center">
                                        <p className="text-text-muted font-mono text-sm mb-2 uppercase tracking-wider">Your Unique Invite Link</p>
                                        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                                            <input type="text" readOnly value="https://prep-ai.com/invite/meraj_07" className="w-full bg-bg-panel border border-border rounded-lg px-4 py-2 text-[#00e472] font-mono text-center focus:outline-none" />
                                            <button onClick={() => { navigator.clipboard.writeText('https://prep-ai.com/invite/meraj_07'); toast.success('Link copied!'); }} className="p-2 bg-bg-card hover:bg-bg-panel text-text-main rounded-lg transition-colors" title="Copy Link">
                                                <Copy size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border border-border rounded-xl p-4 text-center">
                                            <p className="text-text-muted text-sm mb-1">Friends Invited</p>
                                            <h3 className="text-2xl font-bold text-text-main">0</h3>
                                        </div>
                                        <div className="border border-border rounded-xl p-4 text-center">
                                            <p className="text-text-muted text-sm mb-1">Rewards Earned</p>
                                            <h3 className="text-2xl font-bold text-[#00e472]">0 Days Pro</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===================== SUPPORT TAB ===================== */}
                            {activeTab === 'support' && (
                                <div className="glass-panel border border-border rounded-2xl p-6 md:p-8 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Help & Support</h2>
                                    
                                    {/* Documentation Section */}
                                    <div className="bg-bg-card border border-border p-6 rounded-xl mb-6">
                                        <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                                            <FileText className="text-[#00e472]" size={18} /> Quick Documentation
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { title: 'Getting Started with AI Mock Interviews', content: 'Learn the basics of setting up your microphone, camera, and starting your first mock interview. We recommend finding a quiet place and treating it like a real interview.' },
                                                { title: 'How to interpret your ATS Analytics & Scores', content: 'Your ATS score reflects how well your resume matches industry-standard keywords and formatting. A score above 80% generally indicates high compatibility with automated screening tools.' },
                                                { title: 'Best practices for formatting your Resume', content: 'Avoid complex tables, multiple columns, or unusual fonts. Stick to a clean, single-column layout with standard headings like Experience, Education, and Skills to ensure the AI parses it correctly.' },
                                                { title: 'Understanding technical skill gap analysis', content: 'Our AI compares the skills listed in your resume against the current job market demands for your role, highlighting what you might need to learn next to stay competitive.' }
                                            ].map((doc, idx) => (
                                                <div key={idx} className="border border-border rounded-lg overflow-hidden transition-all bg-bg-base">
                                                    <button onClick={() => toggleDoc(idx)} className="w-full text-left p-3 flex justify-between items-center hover:bg-bg-card transition-colors">
                                                        <span className="text-[#00e472] font-bold text-sm flex items-center gap-2">
                                                            <FileText size={14} /> {doc.title}
                                                        </span>
                                                        <span className="text-text-muted text-xs">{activeDoc === idx ? '▲' : '▼'}</span>
                                                    </button>
                                                    {activeDoc === idx && (
                                                        <div className="p-3 bg-bg-card border-t border-border text-sm text-text-muted animate-in slide-in-from-top-1">
                                                            {doc.content}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Support Ticket Section */}
                                    <div className="bg-bg-card border border-border p-6 rounded-xl mb-8">
                                        <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                                            <HelpCircle className="text-[#00e472]" size={18} /> Send a Support Ticket
                                        </h3>
                                        <form onSubmit={handleTicketSubmit} className="space-y-4">
                                            <input 
                                                type="text" 
                                                value={ticketData.subject}
                                                onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                                                placeholder="Subject (e.g., Issue with video recording)" 
                                                className="w-full bg-bg-panel border border-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50 transition-all" 
                                            />
                                            <textarea 
                                                value={ticketData.message}
                                                onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                                                placeholder="Describe your issue or ask a question..." 
                                                rows="4" 
                                                className="w-full bg-bg-panel border border-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-[#00e472]/50 focus:ring-1 focus:ring-[#00e472]/50 transition-all resize-none"
                                            ></textarea>
                                            <div className="text-right">
                                                <button type="submit" className="px-6 py-2 bg-[#00e472] hover:bg-[#00cc66] text-black font-bold rounded-lg transition-colors inline-flex items-center gap-2">
                                                    Submit Ticket
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <h3 className="font-bold text-text-main mb-4">Frequently Asked Questions</h3>
                                    <div className="space-y-4">
                                        <div className="bg-bg-card border border-border p-4 rounded-xl">
                                            <h4 className="font-bold text-text-main mb-2">How does the AI grading work?</h4>
                                            <p className="text-sm text-text-muted">Our AI uses advanced NLP models to compare your spoken answers against industry standards, looking for technical accuracy and clear communication.</p>
                                        </div>
                                        <div className="bg-bg-card border border-border p-4 rounded-xl">
                                            <h4 className="font-bold text-text-main mb-2">Can I delete my interview history?</h4>
                                            <p className="text-sm text-text-muted">Yes, you can manage and delete individual interview sessions from the Analytics page.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
