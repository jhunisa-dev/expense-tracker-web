import api from './axios';

export interface Category {
    id: number;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    icon: string;
    color: string;
    isSystem: boolean;  
}

export const categoryService = {
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/api/Categories');
        return response.data;
    }
};