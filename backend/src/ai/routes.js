import express from 'express';
import { store } from '../store.js';
import { direction, topic } from '../../../shared/josa.js';

const router = express.Router();

const normalize = (value) => String(value || '').trim().toLowerCase();

const getInventorySnapshot = (body) => {
  if (Array.isArray(body?.inventorySnapshot) && body.inventorySnapshot.length > 0) {
    return body.inventorySnapshot;
  }
  return store.getInventory();
};

const ingredientAliases = {
  밥: ['밥', '쌀밥', '즉석밥'],
  김치: ['김치'],
  계란: ['계란', '달걀'],
  양파: ['양파'],
  대파: ['대파', '파'],
  두부: ['두부'],
  참치캔: ['참치', '참치캔'],
  소면: ['소면', '국수면'],
  라면: ['라면'],
  스파게티면: ['스파게티면', '파스타면'],
  식용유: ['식용유', '기름'],
  간장: ['간장'],
  국간장: ['국간장'],
  된장: ['된장'],
  고추장: ['고추장'],
  치즈: ['치즈', '슬라이스치즈', '모짜렐라'],
  떡: ['떡', '떡볶이떡'],
  냉동만두: ['만두', '냉동만두'],
  우유: ['우유'],
  마요네즈: ['마요네즈', '마요'],
  고구마: ['고구마'],
  식빵: ['식빵', '빵'],
  또띠아: ['또띠아'],
  물: ['물', '생수'],
  찬물: ['찬물', '차가운 물', '얼음물'],
  식초: ['식초'],
  케첩: ['케첩'],
  후추: ['후추'],
  김가루: ['김가루'],
  오이: ['오이'],
  마늘: ['마늘']
};

const substitutionMap = {
  양파: {
    replacement: '대파',
    note: '볶음이나 찌개에서는 대파로 향을 어느 정도 보완할 수 있어요.',
    status: 'replaceable'
  },
  대파: {
    replacement: '양파',
    note: '향이 조금 달라지지만 양파로 단맛과 향을 보완할 수 있어요.',
    status: 'replaceable'
  },
  마늘: {
    replacement: '마늘가루',
    note: '소량만 넣어도 향을 살리기 쉬워요.',
    status: 'replaceable'
  },
  식용유: {
    replacement: '올리브유',
    note: '향이 조금 달라져도 조리 자체에는 무리가 없어요.',
    status: 'replaceable'
  },
  참기름: {
    replacement: '들기름',
    note: '마무리 향은 조금 달라지지만 고소한 느낌은 유지돼요.',
    status: 'replaceable'
  },
  식초: {
    replacement: '레몬즙',
    note: '상큼함을 더하는 용도라 레몬즙으로 어느 정도 보완할 수 있어요.',
    status: 'replaceable'
  },
  케첩: {
    replacement: '고추장 1/2작은술 + 설탕 약간',
    note: '완전히 같은 맛은 아니지만 새콤달콤한 방향으로 맞출 수 있어요.',
    status: 'replaceable'
  },
  물: {
    replacement: '생수',
    note: '기본 조리용이라 생수나 정수된 물이면 충분해요.',
    status: 'replaceable'
  },
  찬물: {
    replacement: '차갑게 식힌 물',
    note: '냉국수나 냉요리에서는 차갑게 식힌 물로 대체해도 괜찮아요.',
    status: 'replaceable'
  },
  오이: {
    replacement: null,
    note: '고명 역할이라 없어도 조리에는 큰 문제가 없어요.',
    status: 'optional-omittable'
  },
  김가루: {
    replacement: null,
    note: '마무리 토핑이라 생략해도 괜찮아요.',
    status: 'optional-omittable'
  },
  후추: {
    replacement: null,
    note: '향을 더하는 재료라 없어도 조리는 가능해요.',
    status: 'optional-omittable'
  }
};

const coreIngredientNames = new Set([
  '김치',
  '된장',
  '고추장',
  '냉동만두',
  '라면',
  '소면',
  '스파게티면',
  '두부',
  '참치캔',
  '밥',
  '계란',
  '치즈',
  '고구마',
  '식빵',
  '또띠아'
]);

const findInventoryMatch = (ingredientName, inventoryNames) => {
  const aliases = ingredientAliases[ingredientName] || [ingredientName];
  return inventoryNames.some((name) => aliases.some((alias) => name.includes(normalize(alias))));
};

const scoreRecipe = (recipe, inventory) => {
  const today = new Date();
  const inventoryNames = inventory.map((item) => normalize(item.name));
  const matchedIngredients = recipe.ingredients.filter((ingredient) =>
    findInventoryMatch(ingredient.name, inventoryNames)
  );
  const missingIngredients = recipe.ingredients.filter((ingredient) => !matchedIngredients.includes(ingredient));
  const expiringItems = inventory.filter((item) => {
    const expiry = new Date(item.expiryDate);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return (
      diff >= 0 &&
      diff <= 3 &&
      matchedIngredients.some((ingredient) => normalize(item.name).includes(normalize(ingredient.name)))
    );
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

const getSubstitutionDecision = (recipe, ingredientName) => {
  const mapped = substitutionMap[ingredientName];
  if (mapped) {
    return {
      original: ingredientName,
      replacement: mapped.replacement,
      note: mapped.note,
      status: mapped.status
    };
  }

  const recipeIngredient = recipe.ingredients.find((item) => item.name === ingredientName);
  if (recipeIngredient?.required === false) {
    return {
      original: ingredientName,
      replacement: null,
      note: '선택 재료라서 생략해도 맛의 방향은 크게 무너지지 않아요.',
      status: 'optional-omittable'
    };
  }

  if (coreIngredientNames.has(ingredientName)) {
    return {
      original: ingredientName,
      replacement: null,
      note: '이 재료는 레시피의 핵심이라 대체가 어렵고 가능하면 준비하는 편이 좋아요.',
      status: 'required-unreplaceable'
    };
  }

  return {
    original: ingredientName,
    replacement: null,
    note: '명확한 대체 재료가 없어서 가능하면 준비해서 만드는 편을 추천해요.',
    status: 'required-unreplaceable'
  };
};

const findMentionedIngredient = (recipe, question) => {
  const lowerQuestion = normalize(question);
  return (
    recipe.ingredients.find((ingredient) => {
      const aliases = ingredientAliases[ingredient.name] || [ingredient.name];
      return aliases.some((alias) => lowerQuestion.includes(normalize(alias)));
    }) || null
  );
};

const getRecipeTips = (recipe) =>
  recipe.steps
    .map((step) => (typeof step === 'object' ? step.tip : ''))
    .filter(Boolean)
    .slice(0, 2);

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
          ? `유통기한이 가까운 ${expiringItems.map((item) => item.name).join(', ')}을 활용하기 좋아요.`
          : `${matchedIngredients.length}개의 재료가 이미 있어서 지금 바로 만들기 쉬워요.`,
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

  const adaptedIngredients = missingIngredients.map((name) => getSubstitutionDecision(recipe, name));
  const impossibleIngredients = adaptedIngredients
    .filter((item) => item.status === 'required-unreplaceable')
    .map((item) => item.original);

  const skippedOptionalIngredients = adaptedIngredients
    .filter((item) => item.status === 'optional-omittable')
    .map((item) => item.original);

  const cookingNotes = [];
  if (impossibleIngredients.length > 0) {
    cookingNotes.push(`중요한 재료인 ${impossibleIngredients.map(topic).join(', ')} 가능하면 준비하는 편이 좋아요.`);
  }
  if (skippedOptionalIngredients.length > 0) {
    cookingNotes.push(`선택 재료인 ${skippedOptionalIngredients.map(topic).join(', ')} 없어도 조리는 가능해요.`);
  }
  if (impossibleIngredients.length === 0 && adaptedIngredients.length > 0) {
    cookingNotes.push('대체 가능한 재료만 조정하면 현재 재료로도 충분히 도전할 수 있어요.');
  }

  res.json({
    recipeId: recipe.id,
    adaptedIngredients,
    impossibleIngredients,
    cookingNotes,
    updatedSteps: recipe.steps
  });
});

router.post('/qa', (req, res) => {
  const { question = '', recipeId, recipeContext } = req.body || {};
  const lowerQuestion = normalize(question);
  const recipe = recipeId ? store.getRecipeById(recipeId) : recipeContext || null;
  const mentionedIngredient = recipe ? findMentionedIngredient(recipe, question) : null;
  const recipeTips = recipe ? getRecipeTips(recipe) : [];

  let answer = '현재는 질문 문장에서 핵심 키워드를 찾아 레시피 맥락에 맞는 조리 팁과 안전 메모를 정리해서 답하고 있어요.';
  const safetyNotes = [];

  if (lowerQuestion.includes('에어프라이어')) {
    answer = recipe
      ? `${topic(recipe.name)} 에어프라이어로 일부 단계만 대체 가능한 경우가 많아요. 굽거나 치즈를 녹이는 단계는 180도 기준 5~8분부터 확인해보세요.`
      : '에어프라이어는 굽기나 마무리 단계 대체에 유용하지만 국물 요리나 볶음은 팬이나 냄비가 더 안정적이에요.';
  } else if (lowerQuestion.includes('전자레인지')) {
    answer =
      '전자레인지는 데우기, 치즈 녹이기, 재료 익히기에는 편하지만 볶음 향은 약해질 수 있어요. 1분 단위로 끊어서 상태를 확인하는 게 좋아요.';
  } else if (
    lowerQuestion.includes('대체') ||
    lowerQuestion.includes('없어') ||
    lowerQuestion.includes('없으') ||
    lowerQuestion.includes('빼도')
  ) {
    if (recipe && mentionedIngredient) {
      const decision = getSubstitutionDecision(recipe, mentionedIngredient.name);
      if (decision.status === 'replaceable') {
        answer = `${topic(mentionedIngredient.name)} ${direction(decision.replacement)} 바꿔도 괜찮아요. ${decision.note}`;
      } else if (decision.status === 'optional-omittable') {
        answer = `${topic(mentionedIngredient.name)} 선택 재료라서 없어도 조리는 가능해요. ${decision.note}`;
      } else {
        answer = `${topic(mentionedIngredient.name)} 이 레시피에서 중요한 재료라 가능하면 준비하는 편이 좋아요. ${decision.note}`;
      }
    } else if (recipe) {
      answer = `${topic(recipe.name)} 빠진 재료는 AI 조언 탭 기준으로 판단하고 있어요. 핵심 재료는 준비 필요, 선택 재료는 생략 가능, 일부는 대체 가능으로 안내해요.`;
    } else {
      answer = '대체 질문은 재료가 핵심인지, 향을 더하는 재료인지, 식감만 보완하는 재료인지 기준으로 답하고 있어요.';
    }
  } else if (lowerQuestion.includes('얼마나') || lowerQuestion.includes('몇 분') || lowerQuestion.includes('시간')) {
    answer = recipe
      ? `${topic(recipe.name)} 보통 ${recipe.cookingTime}분 안팎이면 충분해요. 불 세기와 재료 두께에 따라 2~3분 정도 차이가 날 수 있어요.`
      : '조리 시간은 기본 시간에서 2~3분 정도 여유를 두고 재료 상태를 보며 조절하면 좋아요.';
  } else if (lowerQuestion.includes('보관') || lowerQuestion.includes('남으면')) {
    answer =
      '남은 음식은 한 김 식힌 뒤 밀폐용기에 담아 냉장 보관하고 가능한 한 1~2일 안에 드세요. 국물 요리는 다시 끓여 먹는 편이 안전해요.';
  } else if (lowerQuestion.includes('재가열') || lowerQuestion.includes('데워')) {
    answer =
      '다시 데울 때는 가운데까지 충분히 뜨거워지도록 데우는 게 중요해요. 국물은 한 번 끓이고, 볶음이나 그라탕은 전자레인지 후 팬이나 에어프라이어로 마무리하면 식감이 덜 죽어요.';
  } else if (lowerQuestion.includes('매워') || lowerQuestion.includes('맵')) {
    answer =
      '매운맛을 줄이고 싶다면 고추장이나 고춧가루 양을 먼저 줄이고, 치즈나 우유처럼 맛을 부드럽게 해주는 재료를 더하는 편이 좋아요.';
  } else if (lowerQuestion.includes('싱거') || lowerQuestion.includes('간이 약')) {
    answer =
      '간이 약하면 간장, 소금, 된장 같은 핵심 양념을 한 번에 많이 넣지 말고 조금씩 추가하면서 맞추는 편이 좋아요.';
  } else if (lowerQuestion.includes('짠') || lowerQuestion.includes('짜')) {
    answer =
      '너무 짜면 물, 우유, 밥처럼 염도를 낮출 수 있는 재료를 조금 더 넣어보세요. 볶음 요리는 양파나 채소를 추가해도 완화돼요.';
  } else if (lowerQuestion.includes('익었') || lowerQuestion.includes('덜 익')) {
    answer =
      '겉만 보지 말고 가장 두꺼운 재료를 잘라 보세요. 중심부가 차갑거나 붉다면 조금 더 익히는 게 안전해요.';
  } else if (lowerQuestion.includes('팁') || lowerQuestion.includes('요령') || lowerQuestion.includes('주의')) {
    answer =
      recipeTips.length > 0
        ? `이 레시피에서 특히 중요한 포인트는 ${recipeTips.join(' ')}`
        : '불 조절과 재료 물기 관리만 잘해도 실패 확률을 크게 줄일 수 있어요.';
  }

  if (mentionedIngredient && (lowerQuestion.includes('언제') || lowerQuestion.includes('어느 단계'))) {
    const stepIndex = recipe.steps.findIndex((step) => {
      const text = typeof step === 'object' ? step.text : step;
      return normalize(text).includes(normalize(mentionedIngredient.name));
    });

    if (stepIndex >= 0) {
      const stepText = typeof recipe.steps[stepIndex] === 'object' ? recipe.steps[stepIndex].text : recipe.steps[stepIndex];
      answer = `${topic(mentionedIngredient.name)} 보통 ${stepIndex + 1}단계 즈음에 들어가요. ${stepText}`;
    }
  }

  if (lowerQuestion.includes('상했') || lowerQuestion.includes('유통기한')) {
    safetyNotes.push('냄새나 색이 평소와 다르면 아깝더라도 먹지 않는 편이 안전해요.');
  }

  if (recipe?.ingredients?.some((ingredient) => normalize(ingredient.name).includes('계란'))) {
    safetyNotes.push(`${topic('계란')} 흰자가 완전히 익었는지 확인하면 더 안전해요.`);
  }

  if (recipe?.ingredients?.some((ingredient) => normalize(ingredient.name).includes('만두'))) {
    safetyNotes.push(`${topic('냉동만두')} 속까지 충분히 뜨겁게 익혀야 해요.`);
  }

  res.json({
    answer,
    safetyNotes,
    recipeId: recipe?.id || null,
    mode: 'rule-based-keyword'
  });
});

export default router;
