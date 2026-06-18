import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ProtectedRoute — Guards all authenticated user routes (/dashboard/*)
 * ─────────────────────────────────────────────────────────────────────────────
 * Rules:
 *  1. Impersonation token present → login as target user & clean URL via useEffect
 *  2. Not authenticated → redirect to /login (preserves intended path)
 *  3. Authenticated ADMIN who manually types /dashboard → kick to /admin
 *  4. Authenticated USER → render children ✅
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, role, login } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Check for impersonation token in the query params
    const searchParams = new URLSearchParams(location.search);
    const impersonationToken = searchParams.get('impersonation_token');

    useEffect(() => {
        if (impersonationToken) {
            // Prevent duplicate execution (e.g. in React StrictMode) if this token is already processed
            const currentActiveToken = useAuthStore.getState().token;
            if (currentActiveToken === impersonationToken) {
                navigate('/dashboard', { replace: true });
                return;
            }

            try {
                // Decode the base64 URL-safe JWT payload
                const base64Url = impersonationToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);

                const email = payload.sub;
                const userRole = payload.role;
                const username = payload.username || email.split('@')[0];

                // Store the impersonated session in Zustand
                login(impersonationToken, email, username, userRole);
                toast.success(`Impersonated: Logged in as ${username}`, {
                    icon: '👁️',
                    duration: 4000
                });

                // Redirect to dashboard without the query param in the URL
                navigate('/dashboard', { replace: true });
            } catch (error) {
                console.error('Failed to parse impersonation token', error);
                toast.error('Impersonation token is invalid or expired.');
                navigate('/dashboard', { replace: true });
            }
        }
    }, [impersonationToken, login, navigate]);

    // Show a loader while the impersonation session is being initialized in useEffect
    if (impersonationToken) {
        return (
            <div className="flex h-screen w-screen bg-[#0c0f0f] items-center justify-center font-mono text-sm text-[#00e472]">
                <div className="w-8 h-8 border-2 border-[#00e472] border-t-transparent rounded-full animate-spin mr-3" />
                <span>Initializing Impersonation Session...</span>
            </div>
        );
    }

    // Not logged in → send to login, remember where they wanted to go
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin manually typed /dashboard → kick them to their own panel
    if (role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
    }

    // ✅ Authenticated USER — grant access
    return children;
}
