import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages (placeholders — you'll build these next)
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
    return (
        // Step 1: BrowserRouter enables all routing features
        <BrowserRouter>
            {/* Step 2: AuthProvider wraps everything so ALL routes can access auth state */}
            <AuthProvider>
                <Routes>

                    {/* ── Public Routes ───────────────────────────────────── */}
                    {/* Anyone can visit these, logged in or not              */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ── Protected Routes ────────────────────────────────── */}
                    {/* ProtectedRoute checks isAuthenticated before rendering */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* 
              Future pages go here, e.g.:
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/categories"   element={<Categories />} />
              <Route path="/reports"      element={<Reports />} />
              <Route path="/profile"      element={<Profile />} />
            */}
                    </Route>

                    {/* ── Fallback Routes ─────────────────────────────────── */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;