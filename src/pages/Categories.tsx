import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoryModal from '../components/CategoryModal';
import { categoryService } from '../api/categoryService';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../api/categoryService';
import { Plus, Pencil, Trash2, Lock } from 'lucide-react';

type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';

//type CategoryPayload = Omit<Category, 'id' | 'isSystem'>;

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<FilterType>('ALL');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category: Category) => {
        if (category.isSystem) return;
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category? Any transactions using this category might be affected.')) {
            try {
                await categoryService.deleteCategory(id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error("Failed to delete category", error);
            }
        }
    };

    const handleSaveCategory = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
        if (selectedCategory) {
            await categoryService.updateCategory(selectedCategory.id, data as UpdateCategoryRequest);
        } else {
            await categoryService.createCategory(data as CreateCategoryRequest);
        }
        await fetchCategories();
    };

    const filteredCategories = categories.filter(c => filterType === 'ALL' || c.type === filterType);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Type Filters */}
                        <div className="flex bg-card p-1 rounded-lg border border-gray-100">
                            {(['ALL', 'INCOME', 'EXPENSE'] as FilterType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === type
                                        ? 'bg-white shadow-sm text-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {type.charAt(0) + type.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus size={20} /> Add Category
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredCategories.map(category => (
                            <div key={category.id} className="bg-card p-5 rounded-xl shadow-soft border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-200 relative group">

                                {/* System Badge */}
                                {category.isSystem && (
                                    <div className="absolute top-3 right-3 text-gray-300" title="System Category (Cannot be modified)">
                                        <Lock size={14} />
                                    </div>
                                )}

                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 shadow-sm"
                                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                >
                                    {category.icon}
                                </div>

                                <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${category.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {category.type}
                                </span>

                                {/* Action Buttons (Only show if NOT system category) */}
                                {!category.isSystem && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 p-1 rounded-lg shadow-sm">
                                        <button onClick={() => handleOpenEdit(category)} className="p-1.5 text-gray-400 hover:text-primary rounded-md">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="p-1.5 text-gray-400 hover:text-expense rounded-md">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCategory}
                initialData={selectedCategory}
            />
        </div>
    );
};

export default Categories;