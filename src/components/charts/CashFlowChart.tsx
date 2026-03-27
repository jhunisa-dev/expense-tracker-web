import React from 'react';
import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { DailyCashflow } from '../../api/reportService'; 

interface CashFlowChartProps {
    data: DailyCashflow[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No cashflow data for this period.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                    dataKey="date"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${Number(value ?? 0).toFixed(2)}`]}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3}
                    dot={{ r: 4 }} activeDot={{ r: 6 }} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3}
                    dot={{ r: 4 }} activeDot={{ r: 6 }} name="Expense" />
                {/* Bonus: Running balance line using the backend-computed field */}
                <Line type="monotone" dataKey="runningBalance" stroke="#6366f1" strokeWidth={2}
                    strokeDasharray="5 5" dot={false} name="Running Balance" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CashFlowChart;