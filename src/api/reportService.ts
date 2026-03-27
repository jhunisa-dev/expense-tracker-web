import api from './axios';

export interface MonthlySummaryDto {
    year: number;
    month: number;
    monthName: string;
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingsRate: number;
    transactionCount: number;
}

export interface CategoryBreakdown {
    categoryId: number;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    type: string;
    totalAmount: number;
    transactionCount: number;
    percentage: number;
}

export interface DailyCashflow {
    date: string;
    income: number;
    expense: number;
    net: number;
    runningBalance: number;
}

export interface CashflowDto {
    totalIncome: number;
    totalExpense: number;
    netCashflow: number;
    cashflowStatus: string;           
    dailyBreakdown: DailyCashflow[];  
}

export const reportService = {
    getMonthlySummary: async (month: number, year: number): Promise<MonthlySummaryDto[]> => {
        const response = await api.get<MonthlySummaryDto[]>(
            `/api/Reports/summary/monthly?month=${month}&year=${year}`
        );
        return response.data;
    },

    getYearlySummary: async (year: number): Promise<MonthlySummaryDto[]> => {
        const response = await api.get<MonthlySummaryDto[]>(
            `/api/Reports/summary/yearly?year=${year}`
        );
        return response.data;
    },

    getCategoryBreakdown: async (month: number, year: number): Promise<CategoryBreakdown[]> => {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month
        const response = await api.get<CategoryBreakdown[]>(
            `/api/Reports/category-breakdown?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    },

    getCashflow: async (year: number): Promise<CashflowDto> => {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        const response = await api.get<CashflowDto>(
            `/api/Reports/cashflow?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    }
};