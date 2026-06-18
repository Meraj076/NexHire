import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Search, ShieldCheck, ShieldX, Trash2, Eye, RefreshCw, UserCog } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const RoleBadge = ({ role }) => (
    role === 'ADMIN'
        ? <span className="px-2 py-0.5 bg-[#00e472]/10 border border-[#00e472]/20 text-[#00e472] text-[10px] font-mono rounded-full">ADMIN</span>
        : <span className="px-2 py-0.5 bg-[#849584]/10 border border-[#849584]/20 text-[#849584] text-[10px] font-mono rounded-full">USER</span>
);

const StatusBadge = ({ blocked }) => (
    blocked
        ? <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-full">BLOCKED</span>
        : <span className="px-2 py-0.5 bg-[#00e472]/10 border border-[#00e472]/20 text-[#00e472] text-[10px] font-mono rounded-full">ACTIVE</span>
);

export default function AdminUsers() {
    const { userEmail }             = useAuthStore();
    const [users, setUsers]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [search, setSearch]       = useState('');
    const [delConfirm, setDelConfirm] = useState(null); // userId to confirm delete

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get('/api/v1/admin/users');
            setUsers(res.data);
        } catch (e) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const toggleBlock = async (id) => {
        try {
            const res = await API.put(`/api/v1/admin/users/${id}/block`);
            toast.success(res.data);
            fetchUsers();
        } catch { toast.error('Failed to update user status'); }
    };

    const changeRole = async (id, currentRole) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        try {
            const res = await API.put(`/api/v1/admin/users/${id}/role`, { role: newRole });
            toast.success(res.data);
            fetchUsers();
        } catch { toast.error('Failed to change role'); }
    };

    const deleteUser = async (id) => {
        try {
            const res = await API.delete(`/api/v1/admin/users/${id}`);
            toast.success(res.data);
            setDelConfirm(null);
            fetchUsers();
        } catch { toast.error('Failed to delete user'); }
    };

    const impersonate = async (id) => {
        try {
            const res = await API.get(`/api/v1/admin/users/${id}/impersonate`);
            const token = res.data.token;
            const url = `${window.location.origin}/dashboard?impersonation_token=${token}`;
            window.open(url, '_blank');
            toast.success('Opened user session in new tab');
        } catch { toast.error('Impersonation failed'); }
    };

    const filtered = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#121414] text-[#e2e2e2] font-sans overflow-hidden">
            <AdminSidebar />
            <main className="flex-grow overflow-y-auto relative pt-14 md:pt-0">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-6">

                    {/* Header */}
                    <div className="flex items-end justify-between border-b border-[#2a2c2c] pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#e2e2e2] flex items-center gap-3">
                                <Users size={28} className="text-[#00e472]" /> User Management
                            </h1>
                            <p className="text-sm font-mono text-[#849584] mt-1">
                                {users.length} registered users
                            </p>
                        </div>
                        <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 bg-[#1e2020] border border-[#2a2c2c] rounded-xl text-sm font-mono text-[#849584] hover:text-[#00e472] hover:border-[#00e472]/30 transition-all">
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#849584]" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full bg-[#1e2020] border border-[#2a2c2c] rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-[#e2e2e2] placeholder-[#849584] focus:outline-none focus:border-[#00e472]/50 transition-colors"
                        />
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-[#00e472] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-[#1e2020] border border-[#2a2c2c] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#2a2c2c] bg-[#1a1c1c]">
                                            {['ID', 'User', 'Role', 'Status', 'Interviews', 'Resumes', 'Joined', 'Actions'].map(h => (
                                                <th key={h} className="px-5 py-3 text-left font-mono text-xs text-[#849584] uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2a2c2c]">
                                        {filtered.map(user => (
                                            <tr key={user.id} className="hover:bg-[#1a1c1c] transition-colors">
                                                <td className="px-5 py-4 font-mono text-xs text-[#849584]">#{user.id}</td>
                                                <td className="px-5 py-4">
                                                    <p className="font-medium text-[#e2e2e2]">{user.username}</p>
                                                    <p className="text-xs text-[#849584] font-mono">{user.email}</p>
                                                </td>
                                                <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                                                <td className="px-5 py-4"><StatusBadge blocked={user.isBlocked} /></td>
                                                <td className="px-5 py-4 font-mono text-sm text-[#e2e2e2] text-center">{user.interviewCount}</td>
                                                <td className="px-5 py-4 font-mono text-sm text-[#e2e2e2] text-center">{user.resumeCount}</td>
                                                <td className="px-5 py-4 font-mono text-xs text-[#849584] whitespace-nowrap">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-1">
                                                        {/* Block / Unblock */}
                                                        <button
                                                            onClick={() => toggleBlock(user.id)}
                                                            title={user.email === userEmail ? "Cannot block self" : (user.isBlocked ? 'Unblock' : 'Block')}
                                                            className={`p-1.5 rounded-lg transition-colors ${
                                                                user.email === userEmail 
                                                                    ? 'text-gray-600 cursor-not-allowed' 
                                                                    : (user.isBlocked ? 'text-[#00e472] hover:bg-[#00e472]/10' : 'text-red-400 hover:bg-red-400/10')
                                                            }`}
                                                            disabled={user.email === userEmail}
                                                        >
                                                            {user.isBlocked ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
                                                        </button>

                                                        {/* Change Role */}
                                                        <button
                                                            onClick={() => changeRole(user.id, user.role)}
                                                            title={user.email === userEmail ? "Cannot modify own role" : "Toggle Role"}
                                                            className={`p-1.5 rounded-lg transition-colors ${
                                                                user.email === userEmail 
                                                                    ? 'text-gray-600 cursor-not-allowed' 
                                                                    : 'text-yellow-400 hover:bg-yellow-400/10'
                                                            }`}
                                                            disabled={user.email === userEmail}
                                                        >
                                                            <UserCog size={16} />
                                                        </button>

                                                        {/* Impersonate */}
                                                        <button
                                                            onClick={() => impersonate(user.id)}
                                                            title={user.email === userEmail ? "Cannot impersonate self" : "View as User"}
                                                            className={`p-1.5 rounded-lg transition-colors ${
                                                                user.email === userEmail 
                                                                    ? 'text-gray-600 cursor-not-allowed' 
                                                                    : 'text-blue-400 hover:bg-blue-400/10'
                                                            }`}
                                                            disabled={user.email === userEmail}
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => setDelConfirm(user.id)}
                                                            title={user.email === userEmail ? "Cannot delete self" : "Delete User"}
                                                            className={`p-1.5 rounded-lg transition-colors ${
                                                                user.email === userEmail 
                                                                    ? 'text-gray-600 cursor-not-allowed' 
                                                                    : 'text-red-500 hover:bg-red-500/10'
                                                            }`}
                                                            disabled={user.email === userEmail}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filtered.length === 0 && (
                                <div className="text-center py-12 text-[#849584] font-mono text-sm">No users match your search.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {delConfirm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#1e2020] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-xl">
                            <h3 className="text-lg font-bold text-[#e2e2e2] mb-2">Delete User?</h3>
                            <p className="text-sm text-[#849584] mb-6">This will permanently delete the user and all their interviews & resumes. This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDelConfirm(null)} className="flex-1 px-4 py-2 bg-[#2a2c2c] rounded-xl text-sm font-mono text-[#e2e2e2] hover:bg-[#333535] transition-colors">Cancel</button>
                                <button onClick={() => deleteUser(delConfirm)} className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-sm font-mono text-red-400 hover:bg-red-500/30 transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
