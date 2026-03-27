import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Transaction } from '../api/transactionService';

interface TransactionCardProps {
    transaction: Transaction;
    onEdit: (tx: Transaction) => void;
    onDelete: (id: number) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onEdit, onDelete }) => {
    const isIncome = transaction.type === 'INCOME';

    return (
        <div className="bg-card p-4 rounded-xl shadow-soft border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1 duration-200">
            <div className="flex items-center gap-4">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm"
                    style={{
                        backgroundColor: `${transaction.categoryColor}20`, 
                        color: transaction.categoryColor
                    }}
                >
                    {transaction.categoryIcon}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{transaction.categoryName}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                        })}
                        {transaction.note && ` • ${transaction.note}`}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className={`text-lg font-bold ${isIncome ? 'text-income' : 'text-expense'}`}>
                        {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400">{transaction.currency}</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-2 text-gray-400 hover:text-expense hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;