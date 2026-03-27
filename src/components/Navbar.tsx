import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Tags, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const auth = useContext(AuthContext);
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Transactions', path: '/transactions', icon: <ReceiptText size={20} /> },
        { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
    ];

    return (
        <nav className="bg-card shadow-soft sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex gap-8">
                        {/* Logo area */}
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-primary">💰 TrackerPro</span>
                        </div>
                        {/* Nav links */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`inline-flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${location.pathname === link.path
                                            ? 'border-primary text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {link.icon} {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Profile & Logout */}
                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
                            <User size={18} /> {auth?.user}
                        </Link>
                        <button
                            onClick={() => auth?.logout()}
                            className="text-sm font-medium text-expense hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;