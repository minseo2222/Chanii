import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { getRecommendedRecipe, getRecipeAvailability, sortRecipes } from '../lib/recipeMatcher';

const allCategory = '전체';

const sortOptions = [
  { id: 'recommended', label: '추천순' },
  { id: 'available', label: '내 재료 우선' },
  { id: 'quick', label: '빠른 요리' },
  { id: 'new', label: '안 해본 메뉴' }
];

const RecipeExplorer = ({
  inventory,
  recipes = [],
  shoppingList = [],
  onStartCookingComplete,
  onAddShoppingListItems,
  cookingHistory = [],
  initialRecipeId,
  onClearInitialRecipe,
  recipeOverrides = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(allCategory);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [sortMode, setSortMode] = useState('recommended');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const categories = useMemo(
    () => [allCategory, ...new Set(recipes.map((recipe) => recipe.category).filter(Boolean))],
    [recipes]
  );

  useEffect(() => {
    if (!initialRecipeId) return;

    const target = recipes.find((recipe) => recipe.id === initialRecipeId);
    if (target) {
      setSelectedRecipe({
        ...target,
        image: recipeOverrides[target.id] || target.image
      });
    }
    onClearInitialRecipe?.();
  }, [initialRecipeId, onClearInitialRecipe, recipeOverrides, recipes]);

  const filteredRecipes = useMemo(() => {
    const normalizedTerm = deferredSearchTerm.trim().toLowerCase();
    const categoryFiltered = recipes.filter((recipe) => selectedCategory === allCategory || recipe.category === selectedCategory);

    const searched = categoryFiltered.filter((recipe) => {
      if (!normalizedTerm) return true;

      return [recipe.name, recipe.description, recipe.category, ...recipe.ingredients.map((ingredient) => ingredient.name)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedTerm));
    });

    return sortRecipes(searched, inventory, cookingHistory, sortMode).map((recipe) => ({
      ...recipe,
      image: recipeOverrides[recipe.id] || recipe.image
    }));
  }, [cookingHistory, deferredSearchTerm, inventory, recipeOverrides, recipes, selectedCategory, sortMode]);

  const recipeSummary = useMemo(() => {
    const readyCount = recipes.filter((recipe) => getRecipeAvailability(recipe, inventory).readyToCook).length;
    return {
      total: recipes.length,
      readyCount,
      filteredCount: filteredRecipes.length
    };
  }, [filteredRecipes.length, inventory, recipes]);

  const featuredRecipe = useMemo(() => getRecommendedRecipe(recipes, inventory, cookingHistory), [cookingHistory, inventory, recipes]);

  const isCooked = (recipeId) => cookingHistory.some((history) => history.recipeId === recipeId);

  const handleCompleteRecipe = (recipe) => {
    setSelectedRecipe(null);
    onStartCookingComplete?.(recipe);
  };

  return (
    <div className="page-shell pb-24">
      <div className="layout-container space-y-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="section-card p-6">
            <p className="text-sm font-semibold text-slate-500">Recipe Intelligence</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">레시피 탐색</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              지금 있는 재료로 가능한 메뉴를 먼저 보여주고, 부족한 재료는 장보기로 자연스럽게 이어지게 만들었어요.
            </p>
          </div>

          {featuredRecipe ? (
            <motion.button
              type="button"
              onClick={() =>
                setSelectedRecipe({
                  ...featuredRecipe.recipe,
                  image: recipeOverrides[featuredRecipe.recipe.id] || featuredRecipe.recipe.image
                })
              }
              className="section-card bg-slate-900 p-6 text-left text-white"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-300">
                <Sparkles size={14} />
                오늘의 추천
              </div>
              <h2 className="mt-3 text-2xl font-bold">{featuredRecipe.recipe.name}</h2>
              <p className="mt-2 text-sm text-slate-300">
                현재 재료 기준 매칭 {featuredRecipe.availability.matchPercentage}%로 가장 빠르게 시작하기 좋은 메뉴예요.
              </p>
            </motion.button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="metric-card">
            <p className="text-sm text-slate-500">전체 레시피</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{recipeSummary.total}</p>
            <p className="mt-2 text-sm text-slate-500">한식 중심으로 빠른 메뉴를 우선 볼 수 있어요.</p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-slate-500">바로 가능한 메뉴</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{recipeSummary.readyCount}</p>
            <p className="mt-2 text-sm text-slate-500">핵심 재료가 모두 있는 레시피 수예요.</p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-slate-500">현재 결과</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{recipeSummary.filteredCount}</p>
            <p className="mt-2 text-sm text-slate-500">검색과 필터가 즉시 반영돼요.</p>
          </div>
        </div>

        <div className="section-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-lg">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="레시피명, 재료명, 카테고리로 검색"
                className="input-shell pl-11"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSortMode(option.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    sortMode === option.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="section-card flex flex-col items-center px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-slate-900">조건에 맞는 레시피가 없어요</h3>
            <p className="mt-2 max-w-md text-slate-500">검색어를 바꾸거나 카테고리를 전체로 돌리면 더 많은 메뉴를 볼 수 있어요.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setSearchTerm('')} className="btn-secondary">
                검색 초기화
              </button>
              <button type="button" onClick={() => setSelectedCategory(allCategory)} className="btn-primary">
                전체 카테고리 보기
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        )}
      </div>

      <AnimatePresence>
        {selectedRecipe ? (
          <RecipeDetailModal
            recipe={selectedRecipe}
            inventory={inventory}
            shoppingList={shoppingList}
            onAddShoppingListItems={onAddShoppingListItems}
            onClose={() => setSelectedRecipe(null)}
            onComplete={handleCompleteRecipe}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default RecipeExplorer;
