import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    amount: number;
    type: 'income' | 'expense' | 'balance';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type }) => {
    // Determine styling based on type
    const isIncome = type === 'income';
    const isExpense = type === 'expense';

    const iconColorClass = isIncome ? 'text-income bg-green-50' : isExpense ? 'text-expense bg-red-50' : 'text-primary bg-indigo-50';
    const textColorClass = isIncome ? 'text-income' : isExpense ? 'text-expense' : 'text-gray-900';

    const Icon = isIncome ? TrendingUp : isExpense ? TrendingDown : Wallet;

    return (
        <div className="bg-card p-6 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
            <div className={`p-4 rounded-full ${iconColorClass}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className={`text-2xl font-bold ${textColorClass}`}>
                    ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </div>
        </div>
    );
};

export default SummaryCard;