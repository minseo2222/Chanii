const normalizeText = (value = '') => String(value).toLowerCase().replace(/\s+/g, '');

export const getRecipeAvailability = (recipe, inventory = []) => {
  const normalizedInventory = inventory.map((item) => normalizeText(item.name));
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];

  const matchedIngredients = ingredients.filter((ingredient) =>
    normalizedInventory.some((itemName) => itemName.includes(normalizeText(ingredient.name)))
  );
  const missingIngredients = ingredients.filter(
    (ingredient) =>
      !normalizedInventory.some((itemName) => itemName.includes(normalizeText(ingredient.name)))
  );
  const missingRequiredIngredients = missingIngredients.filter((ingredient) => ingredient.required !== false);
  const missingOptionalIngredients = missingIngredients.filter((ingredient) => ingredient.required === false);
  const matchedCount = matchedIngredients.length;
  const totalIngredients = Math.max(ingredients.length, 1);
  const matchPercentage = Math.round((matchedCount / totalIngredients) * 100);

  return {
    matchedIngredients,
    missingIngredients,
    missingRequiredIngredients,
    missingOptionalIngredients,
    matchedCount,
    missingCount: missingIngredients.length,
    totalIngredients,
    matchPercentage,
    readyToCook: missingRequiredIngredients.length === 0
  };
};

export const getRecommendedRecipe = (recipes = [], inventory = [], cookingHistory = []) => {
  if (!recipes.length) return null;

  const cookedIds = new Set(cookingHistory.map((entry) => entry.recipeId));

  const scoredRecipes = recipes.map((recipe) => {
    const availability = getRecipeAvailability(recipe, inventory);
    const freshnessBoost = availability.readyToCook ? 0.2 : 0;
    const noveltyBoost = cookedIds.has(recipe.id) ? 0 : 0.08;
    const speedBoost = Math.max(0, 0.15 - (recipe.cookingTime || 0) / 200);
    const score = availability.matchPercentage / 100 + freshnessBoost + noveltyBoost + speedBoost;

    return {
      recipe,
      availability,
      score
    };
  });

  scoredRecipes.sort((left, right) => right.score - left.score);
  return scoredRecipes[0] || null;
};

export const sortRecipes = (recipes = [], inventory = [], cookingHistory = [], sortMode = 'recommended') => {
  const cookedIds = new Set(cookingHistory.map((entry) => entry.recipeId));

  return [...recipes].sort((left, right) => {
    const leftAvailability = getRecipeAvailability(left, inventory);
    const rightAvailability = getRecipeAvailability(right, inventory);

    if (sortMode === 'quick') {
      return (left.cookingTime || 0) - (right.cookingTime || 0) || rightAvailability.matchPercentage - leftAvailability.matchPercentage;
    }

    if (sortMode === 'available') {
      return rightAvailability.matchPercentage - leftAvailability.matchPercentage || (left.cookingTime || 0) - (right.cookingTime || 0);
    }

    if (sortMode === 'new') {
      return Number(cookedIds.has(left.id)) - Number(cookedIds.has(right.id)) || rightAvailability.matchPercentage - leftAvailability.matchPercentage;
    }

    const leftScore =
      leftAvailability.matchPercentage / 100 +
      (leftAvailability.readyToCook ? 0.2 : 0) +
      (cookedIds.has(left.id) ? 0 : 0.08) +
      Math.max(0, 0.15 - (left.cookingTime || 0) / 200);
    const rightScore =
      rightAvailability.matchPercentage / 100 +
      (rightAvailability.readyToCook ? 0.2 : 0) +
      (cookedIds.has(right.id) ? 0 : 0.08) +
      Math.max(0, 0.15 - (right.cookingTime || 0) / 200);

    return rightScore - leftScore;
  });
};

export { normalizeText };
