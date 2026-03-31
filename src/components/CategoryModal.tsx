import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../api/categoryService';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
    initialData?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [icon, setIcon] = useState('📦');
    const [color, setColor] = useState('#6B7280');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setType(initialData.type);
            setIcon(initialData.icon);
            setColor(initialData.color);
        } else {
            setName('');
            setType('EXPENSE');
            setIcon('📦');
            setColor('#6B7280');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ name, type, icon, color });
            onClose();
        } catch (error) {
            console.error("Failed to save category", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Edit Category' : 'New Category'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Type Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'EXPENSE' ? 'bg-white text-expense shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setType('EXPENSE')}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'INCOME' ? 'bg-white text-income shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setType('INCOME')}
                        >
                            Income
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            minLength={2}
                            maxLength={50}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g., Subscriptions"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Emoji Icon</label>
                            <input
                                type="text"
                                required
                                maxLength={2}
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-center text-xl"
                                placeholder="🍕"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    required
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-10 w-10 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-sm text-gray-500 uppercase">{color}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-primary hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;