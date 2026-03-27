import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Transaction, TransactionRequest } from '../api/transactionService';
import type { Category } from '../api/categoryService';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: TransactionRequest) => Promise<void>;
    initialData?: Transaction | null;
    categories: Category[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, initialData, categories }) => {
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [currency, setCurrency] = useState('USD');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            setType(initialData.type);
            setAmount(initialData.amount.toString());
            setCategoryId(initialData.categoryId.toString());
            setDate(initialData.date.split('T')[0]); // format for date input
            setCurrency(initialData.currency);
            setNote(initialData.note || '');
        } else {
            // Reset form for new entry
            setType('EXPENSE');
            setAmount('');
            setCategoryId('');
            setDate(new Date().toISOString().split('T')[0]);
            setNote('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const filteredCategories = categories.filter(c => c.type === type);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                type,
                amount: parseFloat(amount),
                categoryId: parseInt(categoryId),
                date: new Date(date).toISOString(),
                currency,
                note
            });
            onClose();
        } catch (error) {
            console.error("Failed to save transaction", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Edit Transaction' : 'Add Transaction'}
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
                            onClick={() => { setType('EXPENSE'); setCategoryId(''); }}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'INCOME' ? 'bg-white text-income shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => { setType('INCOME'); setCategoryId(''); }}
                        >
                            Income
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none bg-white"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="PHP">PHP (₱)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            required
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none bg-white"
                        >
                            <option value="" disabled>Select a category...</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                            placeholder="e.g., Grocery run"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-primary hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;