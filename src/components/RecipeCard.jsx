import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Clock, Flame, Sparkles } from 'lucide-react';
import { getRecipeAvailability } from '../lib/recipeMatcher';

const RecipeCard = ({ recipe, onClick, inventory, isCooked }) => {
  const availability = getRecipeAvailability(recipe, inventory);

  return (
    <motion.article
      layout
      onClick={onClick}
      className="section-card relative cursor-pointer overflow-hidden p-4"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      {isCooked ? (
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
          <CheckCircle2 size={12} />
          요리 완료
        </div>
      ) : null}

      <div className="flex gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" loading="lazy" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <Sparkles size={12} />
                {recipe.category}
              </div>
              <h3 className="mt-2 line-clamp-1 text-lg font-bold text-slate-900">{recipe.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{recipe.description}</p>
            </div>
            <div className="self-center text-slate-300">
              <ChevronRight />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                availability.readyToCook
                  ? 'bg-emerald-50 text-emerald-700'
                  : availability.matchPercentage >= 70
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              재료 매칭 {availability.matchPercentage}%
            </span>
            <span className="text-xs text-slate-500">
              {availability.readyToCook ? '바로 조리 가능' : `핵심 재료 ${availability.missingRequiredIngredients.length}개 부족`}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {recipe.cookingTime}분
            </div>
            <div className="flex items-center gap-1">
              <Flame size={14} />
              {recipe.calories} kcal
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default RecipeCard;
