import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChefHat } from 'lucide-react';
import RecipeDetailModal from '../components/RecipeDetailModal';
import RecipeCard from '../components/RecipeCard';
import { enhancedRecipes } from '../data/mockRecipesEnhanced';

const RecipeExplorer = ({ inventory, onOpenUpload, cookingHistory = [], initialRecipeId, onClearInitialRecipe, recipeOverrides = {} }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const categories = ['전체', '한식', '양식', '중식', '일식', '분식', '디저트'];

    // Handle Deep Linking
    useEffect(() => {
        if (initialRecipeId) {
            const target = enhancedRecipes.find(r => r.id === initialRecipeId);
            if (target) {
                // Apply override if exists
                const finalRecipe = {
                    ...target,
                    image: recipeOverrides[target.id] || target.image
                };
                setSelectedRecipe(finalRecipe);
            }
            onClearInitialRecipe?.();
        }
    }, [initialRecipeId, onClearInitialRecipe, recipeOverrides]);

    // Filter recipes
    const filteredRecipes = enhancedRecipes.filter(recipe => {
        const matchesSearch = recipe.name.includes(searchTerm) ||
            recipe.ingredients.some(ing => ing.name.includes(searchTerm));
        const matchesCategory = selectedCategory === '전체' || recipe.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }).map(recipe => ({
        ...recipe,
        image: recipeOverrides[recipe.id] || recipe.image
    }));

    const isCooked = (recipeId) => {
        return cookingHistory.some(history => history.recipeId === recipeId);
    };

    // Handle Recipe Completion
    const handleCompleteRecipe = (recipe) => {
        setSelectedRecipe(null); // Close modal
        // Open the upload modal with prefilled data
        onOpenUpload?.({
            recipeId: recipe.id,
            image: recipe.image,
            title: `${recipe.name} 도전 성공!`,
            description: `${recipe.name}을(를) 맛있게 요리했습니다. 레시피가 정말 좋네요!`,
            ingredients: recipe.ingredients.map(i => i.name).join(', '),
            category: recipe.category
        });
    };

    return (
        <div className="min-h-screen p-6 pb-24">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent mb-2">
                    레시피
                </h1>
                <p className="text-gray-500">냉장고 속 재료로 무엇을 만들까요?</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="요리명, 재료명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple/50 transition-all"
                />
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${selectedCategory === category
                                ? 'bg-pastel-purple text-white'
                                : 'bg-white text-gray-600 border border-gray-100'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => setSelectedRecipe(recipe)}
                        inventory={inventory}
                        isCooked={isCooked(recipe.id)}
                    />
                ))}
            </div>

            {/* Detailed Modal */}
            <AnimatePresence>
                {selectedRecipe && (
                    <RecipeDetailModal
                        recipe={selectedRecipe}
                        inventory={inventory}
                        onClose={() => setSelectedRecipe(null)}
                        onComplete={handleCompleteRecipe}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecipeExplorer;
