import api from './axios';

export interface Transaction {
    id: number;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    currency: string;
    note: string;
    date: string;
    createdAt: string;
    categoryId: number;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
}

export interface TransactionRequest {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    categoryId: number;
    currency: string;
    note: string;
    date: string;
}

export interface TransactionFilter {
    startDate?: string;
    endDate?: string;
    type?: string;
    categoryId?: number;
    page?: number;
    pageSize?: number;
}

export interface PagedResult<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export const transactionService = {
    getTransactions: async (filters?: TransactionFilter): Promise<PagedResult<Transaction>> => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.type) params.append('type', filters.type);
        if (filters?.categoryId) params.append('categoryId', String(filters.categoryId));
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.pageSize) params.append('pageSize', String(filters.pageSize));

        const response = await api.get<PagedResult<Transaction>>(
            `/api/Transactions?${params.toString()}`
        );
        return response.data;
    },

    getTransactionById: async (id: number): Promise<Transaction> => {
        const response = await api.get<Transaction>(`/api/Transactions/${id}`);
        return response.data;
    },

    createTransaction: async (data: TransactionRequest): Promise<Transaction> => {
        const response = await api.post<Transaction>('/api/Transactions', data);
        return response.data;
    },

    updateTransaction: async (id: number, data: TransactionRequest): Promise<Transaction> => {
        const response = await api.put<Transaction>(`/api/Transactions/${id}`, data);
        return response.data;
    },

    deleteTransaction: async (id: number): Promise<void> => {
        await api.delete(`/api/Transactions/${id}`);
    }
};