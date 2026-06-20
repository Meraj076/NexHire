import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'

// ── Page Imports ──────────────────────────────────────────────────────────────
import Login           from "./pages/Login"
import Signup          from "./pages/Signup"
import LandingPage     from "./pages/LandingPage"
import Pricing         from "./pages/Pricing"
import Dashboard       from "./pages/Dashboard"
import InterviewRoom   from "./pages/InterviewRoom"
import Resumes         from "./pages/Resumes"
import Analytics       from "./pages/Analytics"
import Settings        from "./pages/Settings"
import Privacy         from "./pages/Privacy"
import Terms           from "./pages/Terms"
import ApiDocs         from "./pages/ApiDocs"
import Support         from "./pages/Support"
import ChatWidget      from "./components/ChatWidget"

// ── Route Guards ──────────────────────────────────────────────────────────────
import AdminRoute      from "./components/AdminRoute"     // ADMIN only
import ProtectedRoute  from "./components/ProtectedRoute"  // USER only (kicks ADMIN to /admin)

// ── Admin Pages ───────────────────────────────────────────────────────────────
import AdminDashboard    from "./pages/admin/AdminDashboard"
import AdminUsers        from "./pages/admin/AdminUsers"
import AdminApiAnalytics from "./pages/admin/AdminApiAnalytics"
import AdminPrompts      from "./pages/admin/AdminPrompts"
import AdminLogs         from "./pages/admin/AdminLogs"

import './App.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

/** Only show the AI chat widget on the user dashboard, not on admin pages */
function GlobalBot() {
  const location = useLocation();
  return location.pathname === '/dashboard' ? <ChatWidget /> : null;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#1e2020', color: '#e2e2e2', border: '1px solid #00e472' }
        }}
      />
      <BrowserRouter>
        <Routes>

          {/* ── Public Routes (no auth required) ─────────────────────────── */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/signup"   element={<Signup />} />
          <Route path="/pricing"  element={<Pricing />} />
          <Route path="/privacy"  element={<Privacy />} />
          <Route path="/terms"    element={<Terms />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/support"  element={<Support />} />

          {/* ── USER Routes (ProtectedRoute: kicks ADMIN → /admin) ────────── */}
          <Route path="/dashboard"            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/interview"  element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
          <Route path="/dashboard/resumes"    element={<ProtectedRoute><Resumes /></ProtectedRoute>} />
          <Route path="/dashboard/analytics"  element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/settings"   element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* ── ADMIN Routes (AdminRoute: kicks USER → /dashboard) ─────────── */}
          <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users"     element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminApiAnalytics /></AdminRoute>} />
          <Route path="/admin/prompts"   element={<AdminRoute><AdminPrompts /></AdminRoute>} />
          <Route path="/admin/logs"      element={<AdminRoute><AdminLogs /></AdminRoute>} />

          {/* ── Catch-all fallback ────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        <GlobalBot />
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
