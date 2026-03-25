import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-md mx-auto bg-card rounded-xl shadow-soft p-8 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {user}! 👋
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    Your dashboard is ready. Start building!
                </p>
                <button
                    onClick={logout}
                    className="mt-6 w-full py-2.5 px-4 rounded-lg text-sm font-medium 
                     text-white bg-primary hover:bg-indigo-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;