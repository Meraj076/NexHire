import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AdminRoute — Guards every /admin/* path
 * ─────────────────────────────────────────────────────────────────────────────
 * Rules:
 *  1. Not authenticated  → redirect to /login  (preserves intended path)
 *  2. Authenticated USER → redirect to /dashboard
 *  3. Authenticated ADMIN → render children ✅
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function AdminRoute({ children }) {
    const { isAuthenticated, role } = useAuthStore();
    const location = useLocation();

    // Not logged in at all → send to login, remember where they wanted to go
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but wrong role → kick to user dashboard
    if (role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    // ✅ Authenticated ADMIN — grant access
    return children;
}
