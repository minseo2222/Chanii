import express from 'express';
import { store } from '../store.js';

const router = express.Router();

const normalize = (value) => String(value || '').trim().toLowerCase();

const getInventorySnapshot = (body) => {
  if (Array.isArray(body?.inventorySnapshot) && body.inventorySnapshot.length > 0) {
    return body.inventorySnapshot;
  }
  return store.getInventory();
};

const scoreRecipe = (recipe, inventory) => {
  const today = new Date();
  const inventoryNames = inventory.map((item) => normalize(item.name));
  const matchedIngredients = recipe.ingredients.filter((ingredient) =>
    inventoryNames.some((name) => name.includes(normalize(ingredient.name)))
  );
  const missingIngredients = recipe.ingredients.filter((ingredient) => !matchedIngredients.includes(ingredient));
  const expiringItems = inventory.filter((item) => {
    const expiry = new Date(item.expiryDate);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 3 && matchedIngredients.some((ingredient) => normalize(item.name).includes(normalize(ingredient.name)));
  });

  const matchRatio = matchedIngredients.length / Math.max(recipe.ingredients.length, 1);
  const quickBonus = recipe.cookingTime <= 20 ? 0.08 : 0;
  const expiringBonus = expiringItems.length * 0.08;
  const score = Math.min(0.99, Number((matchRatio * 0.84 + quickBonus + expiringBonus).toFixed(2)));

  return {
    recipe,
    score,
    matchedIngredients,
    missingIngredients,
    expiringItems
  };
};

const substitutionMap = {
  양파: { replacement: '대파', note: '향은 조금 달라지지만 볶음이나 찌개에서는 충분히 대체할 수 있어요.' },
  대파: { replacement: '양파', note: '단맛은 조금 올라가지만 감칠맛을 보완할 수 있어요.' },
  두부: { replacement: '달걀', note: '찌개나 볶음에서는 단백질 보완 재료로 무난해요.' },
  김치: { replacement: '참치캔', note: '완전히 같은 맛은 아니지만 감칠맛 중심으로 방향을 바꿀 수 있어요.' },
  올리브오일: { replacement: '식용유', note: '향은 약해지지만 조리에는 무리 없어요.' },
  페퍼론치노: { replacement: '고춧가루', note: '칼칼함은 비슷하게 낼 수 있어요.' },
  드레싱: { replacement: '올리브오일+식초', note: '집에 있는 기본 양념으로 간단히 만들 수 있어요.' }
};

router.post('/recommendations', (req, res) => {
  const inventory = getInventorySnapshot(req.body);
  const recommendations = store
    .getRecipes()
    .map((recipe) => scoreRecipe(recipe, inventory))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ recipe, score, matchedIngredients, missingIngredients, expiringItems }) => ({
      recipeId: recipe.id,
      recipeName: recipe.name,
      score,
      reason:
        expiringItems.length > 0
          ? `유통기한이 가까운 ${expiringItems.map((item) => item.name).join(', ')}를 활용할 수 있어요.`
          : `${matchedIngredients.length}개의 재료가 이미 있어 바로 만들기 좋아요.`,
      usesExpiringItems: expiringItems.map((item) => item.name),
      availableIngredients: matchedIngredients.map((item) => item.name),
      missingIngredients: missingIngredients.map((item) => item.name),
      estimatedDifficulty: recipe.difficulty <= 1 ? 'easy' : recipe.difficulty === 2 ? 'medium' : 'hard'
    }));

  res.json({
    recommendations,
    inventorySnapshot: inventory
  });
});

router.post('/substitutions', (req, res) => {
  const { recipeId, missingIngredients = [] } = req.body || {};
  const recipe = store.getRecipeById(recipeId);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  const adaptedIngredients = missingIngredients.map((name) => {
    const info = substitutionMap[name] || {
      replacement: null,
      note: '대체 재료가 명확하지 않으면 생략하고 기본 간을 조금 조정해 보세요.'
    };
    return {
      original: name,
      replacement: info.replacement,
      note: info.note
    };
  });

  const removedIngredients = adaptedIngredients
    .filter((item) => !item.replacement)
    .map((item) => ({
      name: item.original,
      reason: '대체 재료가 명확하지 않아 생략을 추천해요.'
    }));

  const updatedSteps = recipe.steps.map((step, index) => {
    const text = typeof step === 'string' ? step : step.text;
    if (index === 0 && adaptedIngredients.length > 0) {
      return `${text} 부족한 재료는 ${adaptedIngredients
        .map((item) => (item.replacement ? `${item.original} 대신 ${item.replacement}` : `${item.original}는 생략`))
        .join(', ')} 방식으로 조정해요.`;
    }
    return text;
  });

  res.json({
    recipeId: recipe.id,
    adaptedIngredients,
    removedIngredients,
    updatedSteps
  });
});

router.post('/qa', (req, res) => {
  const { question = '', recipeId, recipeContext } = req.body || {};
  const lowerQuestion = normalize(question);
  const recipe = recipeId ? store.getRecipeById(recipeId) : recipeContext || null;

  let answer = '현재 레시피 기준으로 조리 순서와 재료 상태를 보고 조금씩 간을 맞추는 것을 추천해요.';
  const safetyNotes = [];

  if (lowerQuestion.includes('에어프라이어')) {
    answer = '에어프라이어 사용은 가능하지만 수분이 많은 요리는 프라이팬이나 냄비 조리가 더 안정적이에요. 굽는 재료라면 180도에서 8~12분 정도부터 확인해 보세요.';
  } else if (lowerQuestion.includes('전자레인지')) {
    answer = '전자레인지 조리는 가능하지만 볶음 향은 약해질 수 있어요. 중간에 한 번 섞어가며 1분 단위로 확인하는 편이 좋아요.';
  } else if (lowerQuestion.includes('대체') || lowerQuestion.includes('없')) {
    answer = recipe
      ? `${recipe.name}는 부족한 재료가 있어도 핵심 재료만 있으면 방향을 크게 해치지 않고 조리할 수 있어요. 부족한 재료는 양파/대파, 식용유/올리브오일처럼 역할이 비슷한 재료로 바꿔 보세요.`
      : '부족한 재료는 향을 내는 재료, 단백질 재료, 수분을 주는 재료처럼 역할 기준으로 비슷한 재료를 찾는 것이 좋아요.';
  } else if (lowerQuestion.includes('얼마나') || lowerQuestion.includes('몇 분')) {
    answer = recipe
      ? `${recipe.name}는 보통 ${recipe.cookingTime}분 안팎이면 완성돼요. 불 세기와 재료 양에 따라 2~3분 정도 차이날 수 있어요.`
      : '재료 양과 불 세기에 따라 다르지만, 조리 시간은 포장지나 기본 레시피 시간에서 2~3분 범위로 조절하면 안전해요.';
  }

  if (lowerQuestion.includes('상했') || lowerQuestion.includes('유통기한')) {
    safetyNotes.push('냄새나 색이 이상하면 조리하지 말고 버리는 편이 안전해요.');
  }

  if (recipe?.ingredients?.some((ingredient) => normalize(ingredient.name).includes('달걀'))) {
    safetyNotes.push('달걀은 중심까지 충분히 익혔는지 확인하세요.');
  }

  res.json({
    answer,
    safetyNotes,
    recipeId: recipe?.id || null
  });
});

export default router;
