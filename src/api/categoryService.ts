import api from './axios';

export interface Category {
    id: number;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    icon: string;
    color: string;
    isSystem: boolean;
}

export interface CreateCategoryRequest {
    name: string;
    type: 'INCOME' | 'EXPENSE';
    icon: string;
    color: string;
}

export interface UpdateCategoryRequest {
    name?: string;
    type?: 'INCOME' | 'EXPENSE';
    icon?: string;
    color?: string;
}

export const categoryService = {
    getCategories: async () => {
        const response = await api.get<Category[]>('/api/Categories');
        return response.data;
    },
    createCategory: async (data: CreateCategoryRequest) => {
        const response = await api.post<Category>('/api/Categories', data);
        return response.data;
    },
    updateCategory: async (id: number, data: UpdateCategoryRequest) => {
        const response = await api.put<Category>(`/api/Categories/${id}`, data);
        return response.data;
    },
    deleteCategory: async (id: number) => {
        const response = await api.delete(`/api/Categories/${id}`);
        return response.data;
    }
};