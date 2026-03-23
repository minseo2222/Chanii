import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, Star, Sparkles, ChefHat, ShoppingBag, Info, AlertCircle, Camera, SendHorizonal } from 'lucide-react';
import { api } from '../lib/api';

const RecipeDetailModal = ({ recipe, onClose, inventory, onComplete }) => {
    const [activeTab, setActiveTab] = useState('ingredients');
    const [aiAdvice, setAiAdvice] = useState(null);
    const [question, setQuestion] = useState('');
    const [qaAnswer, setQaAnswer] = useState(null);

    const checkIngredientAvailability = (ingredientName) => {
        return inventory?.some((item) =>
            item.name.toLowerCase().includes(ingredientName.toLowerCase())
        );
    };

    const missingIngredients = useMemo(() => {
        return recipe.ingredients.filter((ing) => !checkIngredientAvailability(ing.name));
    }, [recipe, inventory]);

    useEffect(() => {
        let cancelled = false;

        const loadAdvice = async () => {
            try {
                const [recommendations, substitutions] = await Promise.all([
                    api.getRecommendations(inventory),
                    api.getSubstitutions(recipe.id, missingIngredients.map((ing) => ing.name))
                ]);

                if (cancelled) return;
                setAiAdvice({
                    recommendations,
                    substitutions
                });
            } catch (error) {
                console.warn('Failed to load AI advice.', error);
            }
        };

        loadAdvice();
        return () => {
            cancelled = true;
        };
    }, [inventory, missingIngredients, recipe.id]);

    const handleAskQuestion = async () => {
        if (!question.trim()) return;
        try {
            const answer = await api.askCookingQuestion({
                question,
                recipeId: recipe.id
            });
            setQaAnswer(answer);
        } catch (error) {
            console.warn('Failed to ask cooking question.', error);
        }
    };

    const tabs = [
        { id: 'ingredients', label: '재료', icon: ShoppingBag },
        { id: 'steps', label: '조리법', icon: ChefHat },
        { id: 'ai', label: 'AI 조언', icon: Sparkles }
    ];

    const requiredIngredients = recipe.ingredients.filter((ing) => ing.required);
    const optionalIngredients = recipe.ingredients.filter((ing) => !ing.required);

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

                <div className="flex border-b border-gray-100 p-2 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all relative overflow-hidden ${isActive ? 'text-pastel-purple bg-white shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
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
                                                            {hasItem ? 'O' : '!'}
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
                                            <Info size={18} /> 선택 재료
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {optionalIngredients.map((ing, idx) => {
                                                const hasItem = checkIngredientAvailability(ing.name);
                                                return (
                                                    <div key={idx} className={`p-4 rounded-2xl flex items-center justify-between border ${hasItem ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${hasItem ? 'bg-blue-100' : 'bg-gray-200'}`}>
                                                                {hasItem ? 'O' : '-'}
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
                                                    <span className="text-lg">팁</span>
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
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-6 rounded-3xl shadow-sm">
                                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                        <Sparkles className="text-green-500" />
                                        찬이의 추천
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {aiAdvice?.recommendations?.recommendations?.find((item) => item.recipeId === recipe.id)?.reason ||
                                            '현재 냉장고 재료를 기준으로 이 레시피를 만들 수 있는지 분석 중이에요.'}
                                    </p>
                                </div>

                                {aiAdvice?.substitutions?.adaptedIngredients?.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-3 text-lg">부족한 재료 대체안</h4>
                                        <div className="space-y-3">
                                            {aiAdvice.substitutions.adaptedIngredients.map((ing, idx) => (
                                                <div key={idx} className="bg-white border-l-4 border-blue-400 p-4 rounded-r-xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-bold text-blue-600 text-lg">{ing.original}</p>
                                                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                                                            {ing.replacement ? `${ing.replacement}로 대체` : '생략 추천'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                        <span className="text-xl">팁</span>
                                                        <p>{ing.note}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <h4 className="font-bold text-gray-700 text-lg">요리 질문하기</h4>
                                    <div className="flex gap-2">
                                        <input
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="예: 에어프라이어로도 가능해?"
                                            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple/40"
                                        />
                                        <button type="button" className="btn-primary px-4" onClick={handleAskQuestion}>
                                            <SendHorizonal size={18} />
                                        </button>
                                    </div>

                                    {qaAnswer && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                                            <p className="text-gray-800">{qaAnswer.answer}</p>
                                            {qaAnswer.safetyNotes?.length > 0 && (
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {qaAnswer.safetyNotes.map((note, index) => (
                                                        <li key={index}>• {note}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
                    <motion.button
                        onClick={() => onComplete?.(recipe)}
                        className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-3 shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Camera size={24} />
                        요리 완료 인증 남기기
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RecipeDetailModal;
