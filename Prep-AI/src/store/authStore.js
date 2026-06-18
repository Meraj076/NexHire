import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * NexHire Authentication Store
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses Zustand's `persist` middleware so the state survives page refreshes
 * without manual localStorage.getItem() calls scattered everywhere.
 *
 * Roles expected from the backend:
 *   'ADMIN' → /admin dashboard
 *   'USER'  → /dashboard
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const useAuthStore = create(
    persist(
        (set, get) => ({

            // ── State ──────────────────────────────────────────────────────────
            token:           null,
            userEmail:       null,
            username:        null,
            role:            null,   // 'ADMIN' | 'USER' | null
            isAuthenticated: false,

            // ── Computed helper (call as a function) ────────────────────────
            isAdmin: () => get().role === 'ADMIN',

            // ── Actions ────────────────────────────────────────────────────────

            /**
             * Called after a successful login API response.
             * Saves token, email, username and role from the backend payload.
             */
            login: (token, email, username, role) => {
                set({
                    token,
                    userEmail:       email,
                    username:        username || email,
                    role:            role,          // 'ADMIN' or 'USER'
                    isAuthenticated: true,
                });
            },

            /**
             * Alias kept for backward compat — same as `login`.
             * Prefer using `login` for new code.
             */
            setAuth: (token, role) => {
                set({ token, role, isAuthenticated: true });
            },

            /**
             * Clears all auth state and removes the persisted key from storage.
             * Use this in logout handlers.
             */
            logout: () => {
                set({
                    token:           null,
                    userEmail:       null,
                    username:        null,
                    role:            null,
                    isAuthenticated: false,
                });
            },

            /** Alias for logout — kept for backward compat */
            clearAuth: () => get().logout(),
        }),
        {
            name: 'nexhire-auth',   // localStorage key
            // Only persist the fields we actually need; skip derived ones
            partialize: (state) => ({
                token:           state.token,
                userEmail:       state.userEmail,
                username:        state.username,
                role:            state.role,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);