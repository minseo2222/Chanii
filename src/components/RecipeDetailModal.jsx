import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Flame,
  Star,
  Sparkles,
  ChefHat,
  ShoppingBag,
  Info,
  AlertCircle,
  Camera,
  SendHorizonal,
  CheckCircle2
} from 'lucide-react';
import { api } from '../lib/api';
import { direction, topic } from '../../shared/josa.js';

const statusBadgeMap = {
  replaceable: {
    label: '대체 가능',
    className: 'bg-emerald-100 text-emerald-700'
  },
  'optional-omittable': {
    label: '생략 가능',
    className: 'bg-slate-100 text-slate-700'
  },
  'required-unreplaceable': {
    label: '준비 필요',
    className: 'bg-rose-100 text-rose-700'
  }
};

const RecipeDetailModal = ({ recipe, onClose, inventory, shoppingList = [], onAddShoppingListItems, onComplete }) => {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [aiAdvice, setAiAdvice] = useState(null);
  const [question, setQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState(null);

  const checkIngredientAvailability = (ingredientName) =>
    inventory?.some((item) => item.name.toLowerCase().includes(ingredientName.toLowerCase()));

  const missingIngredients = useMemo(
    () => recipe.ingredients.filter((ingredient) => !checkIngredientAvailability(ingredient.name)),
    [recipe, inventory]
  );

  useEffect(() => {
    let cancelled = false;

    const loadAdvice = async () => {
      try {
        const [recommendations, substitutions] = await Promise.all([
          api.getRecommendations(inventory),
          api.getSubstitutions(recipe.id, missingIngredients.map((ingredient) => ingredient.name))
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

  const shoppingListNames = shoppingList.map((item) => (item.name || '').toLowerCase());
  const addableMissingIngredients = missingIngredients.filter(
    (ingredient) => !shoppingListNames.includes((ingredient.name || '').toLowerCase())
  );

  const handleAddMissingToShoppingList = () => {
    onAddShoppingListItems?.(
      addableMissingIngredients.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        source: recipe.name
      }))
    );
  };

  const tabs = [
    { id: 'ingredients', label: '재료', icon: ShoppingBag },
    { id: 'steps', label: '조리법', icon: ChefHat },
    { id: 'ai', label: 'AI 조언', icon: Sparkles }
  ];

  const requiredIngredients = recipe.ingredients.filter((ingredient) => ingredient.required);
  const optionalIngredients = recipe.ingredients.filter((ingredient) => !ingredient.required);
  const recipeRecommendation = aiAdvice?.recommendations?.recommendations?.find((item) => item.recipeId === recipe.id);
  const substitutionAdvice = aiAdvice?.substitutions;
  const adjustmentItems = substitutionAdvice?.adaptedIngredients || [];
  const replaceableItems = adjustmentItems.filter((item) => item.status === 'replaceable');
  const omittableItems = adjustmentItems.filter((item) => item.status === 'optional-omittable');
  const requiredItems = adjustmentItems.filter((item) => item.status === 'required-unreplaceable');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="relative my-8 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-72">
          <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/50"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-white/30 bg-white/20 px-2 py-1 text-xs font-bold text-white backdrop-blur-md">
                {recipe.category}
              </span>
            </div>
            <h2 className="mb-3 text-3xl font-bold text-white">{recipe.name}</h2>
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

        <div className="sticky top-0 z-10 flex border-b border-gray-100 bg-gray-50/50 p-2 backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 overflow-hidden rounded-xl py-3 font-bold transition-all ${
                  isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:bg-white/50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label}
                </span>
                {isActive ? <motion.div layoutId="activeTabIndicator" className="mx-8 mt-2 h-1 rounded-full bg-slate-900" /> : null}
              </button>
            );
          })}
        </div>

        <div className="min-h-[400px] bg-white p-6 pb-24">
          <AnimatePresence mode="wait">
            {activeTab === 'ingredients' ? (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {missingIngredients.length > 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">부족한 재료 장보기에 담기</h3>
                        <p className="mt-1 text-sm text-slate-500">레시피에 없는 재료를 바로 장보기 목록으로 보낼 수 있어요.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddMissingToShoppingList}
                        disabled={addableMissingIngredients.length === 0}
                        className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        담기
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {missingIngredients.map((ingredient) => {
                        const alreadyAdded = shoppingListNames.includes((ingredient.name || '').toLowerCase());
                        return (
                          <span
                            key={ingredient.name}
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
                              alreadyAdded ? 'border border-slate-200 bg-white text-slate-500' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {alreadyAdded ? <CheckCircle2 size={14} /> : null}
                            {ingredient.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-rose-500">
                    <AlertCircle size={18} /> 필수 재료
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {requiredIngredients.map((ingredient) => {
                      const hasItem = checkIngredientAvailability(ingredient.name);
                      return (
                        <div
                          key={ingredient.name}
                          className={`flex items-center justify-between rounded-2xl border p-4 ${
                            hasItem ? 'border-green-200 bg-green-50' : 'border-rose-200 bg-rose-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${hasItem ? 'bg-green-100' : 'bg-white'}`}>
                              {hasItem ? 'O' : '!'}
                            </span>
                            <div>
                              <p className={`font-bold ${hasItem ? 'text-green-900' : 'text-rose-900'}`}>{ingredient.name}</p>
                              <p className="text-xs text-gray-500">{ingredient.amount}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {optionalIngredients.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-sky-500">
                      <Info size={18} /> 선택 재료
                    </h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {optionalIngredients.map((ingredient) => {
                        const hasItem = checkIngredientAvailability(ingredient.name);
                        return (
                          <div
                            key={ingredient.name}
                            className={`flex items-center justify-between rounded-2xl border p-4 ${
                              hasItem ? 'border-sky-200 bg-sky-50' : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${hasItem ? 'bg-sky-100' : 'bg-gray-200'}`}>
                                {hasItem ? 'O' : '-'}
                              </span>
                              <div>
                                <p className={`font-bold ${hasItem ? 'text-sky-900' : 'text-gray-600'}`}>{ingredient.name}</p>
                                <p className="text-xs text-gray-500">{ingredient.amount}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ) : null}

            {activeTab === 'steps' ? (
              <motion.div
                key="steps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-amber-800">
                    <Sparkles size={18} />
                    <h3 className="font-bold">조리 TIP 활용 포인트</h3>
                  </div>
                  <p className="text-sm leading-6 text-amber-900">
                    각 단계의 TIP은 실패를 줄이는 핵심 메모예요. 불 조절, 식감, 향을 살리는 포인트를 먼저 보고 조리하면 성공률이 훨씬 높아져요.
                  </p>
                </div>

                {adjustmentItems.length > 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-3 font-bold text-slate-900">조리 전 체크</h3>
                    <div className="space-y-2 text-sm leading-6 text-slate-700">
                      {replaceableItems.map((item) => (
                        <p key={item.original}>
                          {topic(item.original)} {direction(item.replacement)} 바꿔도 괜찮아요.
                        </p>
                      ))}
                      {omittableItems.map((item) => (
                        <p key={item.original}>{topic(item.original)} 없어도 조리 가능해서 생략해도 돼요.</p>
                      ))}
                      {requiredItems.map((item) => (
                        <p key={item.original}>{topic(item.original)} 이 레시피에 중요해서 가능하면 준비하는 편이 좋아요.</p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {recipe.steps.map((step, index) => (
                  <div key={index} className="group flex gap-4">
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white shadow-md transition-transform group-hover:scale-110">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-lg font-medium leading-relaxed text-gray-800">{typeof step === 'object' ? step.text : step}</p>
                      {typeof step === 'object' && step.tip ? (
                        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm leading-6 text-yellow-900">
                          <span className="font-semibold text-yellow-900">TIP</span>
                          <span className="ml-2">{step.tip}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : null}

            {activeTab === 'ai' ? (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 text-xl font-bold">
                    <Sparkles className="text-green-500" />
                    찬이의 추천
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {recipeRecommendation?.reason || '현재 냉장고 재료를 기준으로 이 레시피를 만들기 좋은지 분석 중이에요.'}
                  </p>
                </div>

                {substitutionAdvice?.cookingNotes?.length > 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 font-bold text-slate-900">AI 조리 메모</h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      {substitutionAdvice.cookingNotes.map((note) => (
                        <p key={note}>{note}</p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {adjustmentItems.length > 0 ? (
                  <div>
                    <h4 className="mb-3 text-lg font-bold text-gray-700">부족한 재료 판단</h4>
                    <div className="space-y-3">
                      {adjustmentItems.map((ingredient) => {
                        const badge = statusBadgeMap[ingredient.status] || statusBadgeMap['required-unreplaceable'];
                        return (
                          <div key={ingredient.original} className="rounded-r-xl border-l-4 border-blue-400 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                            <div className="mb-2 flex items-start justify-between gap-3">
                              <div>
                                <p className="text-lg font-bold text-blue-600">{ingredient.original}</p>
                                {ingredient.replacement ? (
                                  <p className="mt-1 text-sm text-slate-600">추천 대체 재료: {ingredient.replacement}</p>
                                ) : null}
                              </div>
                              <span className={`rounded px-2 py-1 text-xs font-bold ${badge.className}`}>{badge.label}</span>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                              <span className="mr-1 font-semibold text-slate-800">메모:</span>
                              {ingredient.note}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-bold text-gray-700">질문하기</h4>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">현재는 강화된 규칙 기반 조리 도우미</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      placeholder="예: 양파 없으면 어떻게 해? 남으면 어떻게 보관해?"
                      className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    <button type="button" className="btn-primary px-4" onClick={handleAskQuestion}>
                      <SendHorizonal size={18} />
                    </button>
                  </div>

                  {qaAnswer ? (
                    <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-gray-800">{qaAnswer.answer}</p>
                      {qaAnswer.safetyNotes?.length > 0 ? (
                        <ul className="space-y-1 text-sm text-gray-600">
                          {qaAnswer.safetyNotes.map((note) => (
                            <li key={note}>- {note}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-transparent p-6">
          <motion.button
            onClick={() => onComplete?.(recipe)}
            className="btn-primary flex w-full items-center justify-center gap-3 py-4 text-xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Camera size={24} />
            요리 완료 인증 올리기
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipeDetailModal;
