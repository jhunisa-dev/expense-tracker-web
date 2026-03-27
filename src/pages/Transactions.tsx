import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TransactionCard from '../components/TransactionCard';
import TransactionModal from '../components/TransactionModal';
import { transactionService } from '../api/transactionService';
import type { Transaction, TransactionRequest, TransactionFilter } from '../api/transactionService';
import { categoryService } from '../api/categoryService';
import type { Category } from '../api/categoryService';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 20;

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const filters: TransactionFilter = {
                page,
                pageSize: PAGE_SIZE,
                ...(filterType !== 'ALL' && { type: filterType }),
            };

            const [pagedResult, catData] = await Promise.all([
                transactionService.getTransactions(filters),
                categoryService.getCategories()
            ]);

            setTransactions(pagedResult.data);
            setCurrentPage(pagedResult.page);
            setTotalPages(pagedResult.totalPages);
            setTotalCount(pagedResult.totalCount);
            setCategories(catData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, [filterType]);

    const handleOpenAdd = () => {
        setSelectedTx(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (tx: Transaction) => {
        setSelectedTx(tx);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await transactionService.deleteTransaction(id);
                await fetchData(currentPage);
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    const handleSaveTransaction = async (data: TransactionRequest) => {
        if (selectedTx) {
            await transactionService.updateTransaction(selectedTx.id, data);
        } else {
            await transactionService.createTransaction(data);
        }
        await fetchData(1);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                        {/* Shows live count from backend */}
                        {!loading && (
                            <p className="text-sm text-gray-500 mt-1">
                                {totalCount} transaction{totalCount !== 1 ? 's' : ''} found
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Filter — sent to API */}
                        <div className="flex items-center gap-2 bg-card p-1 rounded-lg border border-gray-100 flex-1 sm:flex-none">
                            <Filter size={16} className="text-gray-400 ml-2" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as 'ALL' | 'INCOME' | 'EXPENSE')}
                                className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none cursor-pointer py-1.5 focus:ring-0"
                            >
                                <option value="ALL">All Types</option>
                                <option value="INCOME">Income Only</option>
                                <option value="EXPENSE">Expense Only</option>
                            </select>
                        </div>

                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center justify-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                            <Plus size={20} /> Add New
                        </button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No transactions found.</p>
                        <button onClick={handleOpenAdd} className="text-primary mt-2 hover:underline text-sm">
                            Create your first one
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {transactions.map(tx => (
                                <TransactionCard
                                    key={tx.id}
                                    transaction={tx}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {/* Pagination — only shows when there are multiple pages */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 bg-card px-4 py-3 rounded-xl border border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Page {currentPage} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchData(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => fetchData(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTransaction}
                initialData={selectedTx}
                categories={categories}
            />
        </div>
    );
};

export default Transactions;