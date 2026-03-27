import React, { useState, useEffect } from 'react';
import {
    reportService,
} from '../api/reportService';
import type {
    MonthlySummaryDto,
    CategoryBreakdown,
    DailyCashflow,
    CashflowDto
} from '../api/reportService';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import CashFlowChart from '../components/charts/CashFlowChart';
import { Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [summary, setSummary] = useState<MonthlySummaryDto | null>(null);
    const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);

    const [cashflow, setCashflow] = useState<DailyCashflow[]>([]);
    const [cashflowMeta, setCashflowMeta] = useState<Omit<CashflowDto, 'dailyBreakdown'> | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [summaryArr, breakdownArr, cashflowObj] = await Promise.all([
                    reportService.getMonthlySummary(selectedMonth, selectedYear),
                    reportService.getCategoryBreakdown(selectedMonth, selectedYear),
                    reportService.getCashflow(selectedYear),
                ]);

                setSummary(summaryArr.length > 0 ? summaryArr[0] : null);

                setBreakdown(breakdownArr.filter(c => c.type === 'EXPENSE'));

                setCashflow(cashflowObj.dailyBreakdown ?? []);

                const { dailyBreakdown: omitted, ...meta } = cashflowObj;
                void omitted;
                setCashflowMeta(meta);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedMonth, selectedYear]);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Header & Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

                    <div className="flex items-center gap-3 bg-card p-2 rounded-xl shadow-soft border border-gray-100">
                        <Calendar size={20} className="text-gray-400 ml-2" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none cursor-pointer"
                        >
                            {months.map((m, i) => (
                                <option key={m} value={i + 1}>{m}</option>
                            ))}
                        </select>
                        <span className="text-gray-300">|</span>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none cursor-pointer mr-2"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <SummaryCard
                                title="Total Income"
                                amount={summary?.totalIncome ?? 0}
                                type="income"
                            />
                            <SummaryCard
                                title="Total Expense"
                                amount={summary?.totalExpense ?? 0}
                                type="expense"
                            />
                            {/* netSavings replaces the old 'balance' field name */}
                            <SummaryCard
                                title="Net Savings"
                                amount={summary?.netSavings ?? 0}
                                type="balance"
                            />
                        </div>

                        {cashflowMeta && (
                            <div className={`mb-6 p-4 rounded-xl border text-sm font-medium flex justify-between items-center
                ${cashflowMeta.cashflowStatus === 'SURPLUS'
                                    ? 'bg-green-50 border-green-100 text-green-700'
                                    : cashflowMeta.cashflowStatus === 'DEFICIT'
                                        ? 'bg-red-50 border-red-100 text-red-700'
                                        : 'bg-gray-50 border-gray-100 text-gray-600'}`}
                            >
                                <span>
                                    {cashflowMeta.cashflowStatus === 'SURPLUS' && '📈 You are in a surplus this period.'}
                                    {cashflowMeta.cashflowStatus === 'DEFICIT' && '📉 You are in a deficit this period.'}
                                    {cashflowMeta.cashflowStatus === 'BREAK_EVEN' && '⚖️ You are breaking even this period.'}
                                </span>
                                <span>
                                    Net: ${cashflowMeta.netCashflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-card p-6 rounded-xl shadow-soft border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Expenses by Category</h2>
                                <ExpensePieChart data={breakdown} />
                            </div>

                            <div className="bg-card p-6 rounded-xl shadow-soft border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">
                                    Cashflow Overview ({selectedYear})
                                </h2>
                                <CashFlowChart data={cashflow} />
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;