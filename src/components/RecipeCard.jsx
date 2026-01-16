import { motion } from 'framer-motion';
import { Clock, Flame, Star, CheckCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { calculateFreshness } from '../data/mockInventory';

const RecipeCard = ({ recipe, onClick, inventory, isCooked }) => {
    // Calculate how many ingredients we have
    const availableIngredients = recipe.ingredients.filter(ing =>
        inventory.some(item => item.name.includes(ing.name))
    );
    const missingIngredients = recipe.ingredients.length - availableIngredients.length;
    const matchPercentage = Math.round((availableIngredients.length / recipe.ingredients.length) * 100);

    return (
        <motion.div
            layout
            onClick={onClick}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex gap-4 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Cooked Badge */}
            {isCooked && (
                <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-br-xl z-20 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    요리 완료
                </div>
            )}

            {/* Image */}
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{recipe.name}</h3>

                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${matchPercentage === 100 ? 'bg-green-100 text-green-700' :
                            matchPercentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                            재료 {matchPercentage}%
                        </span>
                        <span className="text-xs text-gray-400">
                            • {missingIngredients === 0 ? '조리 가능!' : `${missingIngredients}개 부족`}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {recipe.cookingTime}분
                        </div>
                        <div className="flex items-center gap-1">
                            <Flame size={14} />
                            {recipe.calories}kcal
                        </div>
                    </div>

                </div>
            </div>

            <div className="self-center text-gray-300">
                <ChevronRight />
            </div>
        </motion.div>
    );
};

export default RecipeCard;
