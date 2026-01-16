import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, Star, Sparkles, ChefHat, ShoppingBag, Info, AlertCircle, Camera } from 'lucide-react';

const RecipeDetailModal = ({ recipe, onClose, inventory, onComplete }) => {
    const [activeTab, setActiveTab] = useState('ingredients');

    const checkIngredientAvailability = (ingredientName) => {
        return inventory?.some(item =>
            item.name.toLowerCase().includes(ingredientName.toLowerCase())
        );
    };

    const getSubstituteSuggestion = (ingredientName) => {
        const substitutes = {
            '대파': '양파 또는 쪽파로 대체하여 단맛을 낼 수 있어요.',
            '참기름': '들기름을 쓰거나, 없으면 볶음참깨로 고소함을 더해보세요.',
            '김치': '배추김치가 없다면 깍두기나 총각김치를 잘게 썰어 써보세요.',
            '감자': '고구마로 대체하면 더 달콤해집니다.',
            '호박': '애호박이나 단호박, 혹은 당근으로 식감을 살려보세요.',
            '페페론치노': '청양고추나 고춧가루로 매운맛을 낼 수 있습니다.',
            '파슬리': '쪽파의 파란 부분이나 바질로 색감을 낼 수 있어요. 없으면 생략 가능!',
            '방울토마토': '일반 토마토를 썰어 쓰거나 케첩을 조금 넣어 감칠맛을 내보세요.',
            '드레싱': '올리브오일, 레몬즙, 간장, 설탕을 섞어 간단 드레싱을 만들어보세요.',
            '굴소스': '간장과 설탕을 1:1로 섞고 소금을 약간 치면 비슷해집니다.'
        };
        return substitutes[ingredientName] || '이 재료는 생략하거나 비슷한 식감의 재료로 대체해보세요.';
    };

    // Smart AI Advice Logic
    const aiAdvice = useMemo(() => {
        const missingIngredients = recipe.ingredients.filter(
            ing => !checkIngredientAvailability(ing.name)
        );

        const missingRequired = missingIngredients.filter(ing => ing.required);
        const missingOptional = missingIngredients.filter(ing => !ing.required);

        const canCook = missingRequired.length === 0;

        // Generate Contextual Message
        let message = "";
        let mood = "neutral";

        if (canCook) {
            if (missingOptional.length === 0) {
                message = "와우! 완벽해요 🌟 모든 재료가 냉장고에 있습니다. 지금 바로 최고의 요리를 만들 수 있어요!";
                mood = "happy";
            } else {
                message = "필수 재료는 모두 있네요! 👍 몇 가지 선택 재료가 없지만, 맛있는 요리를 만드는 데는 충분합니다.";
                mood = "happy";
            }
        } else {
            if (missingRequired.length === 1) {
                message = `아쉽게도 핵심 재료인 '${missingRequired[0].name}' 하나가 부족해요. 🥺`;
                mood = "concern";
            } else {
                message = "몇 가지 중요한 재료가 부족해 보입니다. 장을 보거나 대체 재료를 활용해야 할 것 같아요 🛒";
                mood = "concern";
            }
        }

        return {
            missingRequired,
            missingOptional,
            canCook,
            message,
            mood
        };
    }, [recipe, inventory]);

    const tabs = [
        { id: 'ingredients', label: '재료', icon: ShoppingBag },
        { id: 'steps', label: '요리법', icon: ChefHat },
        { id: 'ai', label: 'AI 조언', icon: Sparkles }
    ];

    const requiredIngredients = recipe.ingredients.filter(ing => ing.required);
    const optionalIngredients = recipe.ingredients.filter(ing => !ing.required);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-white rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Image */}
                <div className="relative h-72">
                    <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                            {recipe.isOfficial && (
                                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-full border border-white/30">
                                    ✨ 공식 레시피
                                </span>
                            )}
                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-full border border-white/30">
                                {recipe.category}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 text-shadow-lg">
                            {recipe.name}
                        </h2>
                        <div className="flex items-center gap-6 text-white/90">
                            <div className="flex items-center gap-1.5">
                                <Clock size={18} />
                                <span className="font-medium">{recipe.cookingTime}분</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star size={18} fill="gold" stroke="gold" />
                                <span className="font-medium">{recipe.rating}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Flame size={18} />
                                <span className="font-medium">{recipe.calories} kcal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-100 p-2 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all relative overflow-hidden ${isActive ? 'text-pastel-purple bg-white shadow-sm' : 'text-gray-500 hover:bg-white/50'
                                    }`}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {tab.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-pastel-purple rounded-full mx-8"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="p-6 pb-24 min-h-[400px] bg-white">
                    <AnimatePresence mode="wait">
                        {activeTab === 'ingredients' && (
                            <motion.div
                                key="ingredients"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg text-red-500 flex items-center gap-2">
                                        <AlertCircle size={18} /> 필수 재료
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {requiredIngredients.map((ing, idx) => {
                                            const hasItem = checkIngredientAvailability(ing.name);
                                            return (
                                                <div key={idx} className={`p-4 rounded-2xl flex items-center justify-between border ${hasItem ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${hasItem ? 'bg-green-100' : 'bg-white'}`}>
                                                            {hasItem ? '✅' : '🚨'}
                                                        </span>
                                                        <div>
                                                            <p className={`font-bold ${hasItem ? 'text-green-900' : 'text-red-900'}`}>{ing.name}</p>
                                                            <p className="text-xs text-gray-500">{ing.amount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {optionalIngredients.length > 0 && (
                                    <div className="space-y-3 pt-2">
                                        <h3 className="font-bold text-lg text-blue-500 flex items-center gap-2">
                                            <Info size={18} /> 선택 재료 (없어도 OK!)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {optionalIngredients.map((ing, idx) => {
                                                const hasItem = checkIngredientAvailability(ing.name);
                                                return (
                                                    <div key={idx} className={`p-4 rounded-2xl flex items-center justify-between border ${hasItem ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${hasItem ? 'bg-blue-100' : 'bg-gray-200'}`}>
                                                                {hasItem ? '✨' : '❔'}
                                                            </span>
                                                            <div>
                                                                <p className={`font-bold ${hasItem ? 'text-blue-900' : 'text-gray-600'}`}>{ing.name}</p>
                                                                <p className="text-xs text-gray-500">{ing.amount}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'steps' && (
                            <motion.div
                                key="steps"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {recipe.steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pastel-purple to-pastel-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform mt-1">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <p className="text-gray-800 leading-relaxed text-lg font-medium">
                                                {typeof step === 'object' ? step.text : step}
                                            </p>
                                            {typeof step === 'object' && step.tip && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-3 text-sm text-yellow-800">
                                                    <span className="text-lg">💡</span>
                                                    <div>
                                                        <span className="font-bold mr-1">TIPS:</span>
                                                        {step.tip}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'ai' && (
                            <motion.div
                                key="ai"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className={`bg-gradient-to-r p-6 rounded-3xl border shadow-sm ${aiAdvice.mood === 'happy' ? 'from-green-50 to-emerald-50 border-green-100' : 'from-orange-50 to-amber-50 border-orange-100'
                                    }`}>
                                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                        <Sparkles className={aiAdvice.mood === 'happy' ? "text-green-500" : "text-orange-500"} />
                                        찬이의 요리 분석
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        "{aiAdvice.message}"
                                    </p>
                                </div>

                                {aiAdvice.missingOptional.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-3 text-lg">💡 부족한 선택 재료 조언</h4>
                                        <div className="space-y-3">
                                            {aiAdvice.missingOptional.map((ing, idx) => (
                                                <div key={idx} className="bg-white border-l-4 border-blue-400 p-4 rounded-r-xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-bold text-blue-600 text-lg">{ing.name}</p>
                                                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-bold">선택</span>
                                                    </div>
                                                    <div className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                        <span className="text-xl">💡</span>
                                                        <p>{getSubstituteSuggestion(ing.name)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Fixed "Finish Cooking" Button at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
                    <motion.button
                        onClick={() => onComplete?.(recipe)}
                        className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-3 shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Camera size={24} />
                        요리 완료 인증샷 찍기
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RecipeDetailModal;
