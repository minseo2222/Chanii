import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  inventorySeed,
  recipeSeed,
  communityPostsSeed,
  communityShortsSeed,
  shoppingListSeed
} from '../../shared/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');
const dataFile = path.join(dataDir, 'app-data.json');

const ensureDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const nextId = (items) =>
  String(
    items.reduce((max, item) => {
      const value = Number(item.id);
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0) + 1
  );

const createInitialData = () => ({
  inventory: structuredClone(inventorySeed),
  recipes: structuredClone(recipeSeed),
  cookingHistory: [],
  communityPosts: structuredClone(communityPostsSeed),
  communityShorts: structuredClone(communityShortsSeed),
  shoppingList: structuredClone(shoppingListSeed),
  users: [
    {
      id: 1,
      nickname: '찬이 사용자',
      level: 1,
      xp: 35,
      maxXp: 100,
      coins: 150,
      profileImage: null
    }
  ]
});

const ensureDataFile = () => {
  ensureDir();
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(createInitialData(), null, 2));
  }
};

const looksBrokenText = (value) => typeof value === 'string' && (value.includes('�') || /\?{2,}/.test(value));

const isSafeString = (value) => typeof value === 'string' && value.trim().length > 0 && !looksBrokenText(value);

const sanitizeInventory = (inventory, fallback) => {
  if (!Array.isArray(inventory)) {
    return structuredClone(fallback);
  }

  if (inventory.some((item) => looksBrokenText(item?.name) || looksBrokenText(item?.processingState))) {
    return structuredClone(fallback);
  }

  return inventory;
};

const sanitizeRecipes = (recipes, fallback) => {
  if (!Array.isArray(recipes) || recipes.length < fallback.length) {
    return structuredClone(fallback);
  }

  if (recipes.some((recipe) => [recipe?.name, recipe?.title, recipe?.category, recipe?.description].some(looksBrokenText))) {
    return structuredClone(fallback);
  }

  return recipes;
};

const sanitizeCommunity = (items, fallback) => {
  if (!Array.isArray(items) || items.length < fallback.length) {
    return structuredClone(fallback);
  }

  if (items.some((item) => [item?.title, item?.description, item?.username, item?.category].some((value) => value && looksBrokenText(value)))) {
    return structuredClone(fallback);
  }

  return items;
};

const sanitizeShoppingList = (shoppingList, fallback) => {
  if (!Array.isArray(shoppingList)) {
    return structuredClone(fallback);
  }

  const cleaned = shoppingList
    .filter((item) => isSafeString(item?.name))
    .map((item) => ({
      id: String(item.id),
      name: item.name.trim(),
      amount: typeof item.amount === 'string' && !looksBrokenText(item.amount) ? item.amount.trim() : '',
      source: typeof item.source === 'string' && !looksBrokenText(item.source) ? item.source.trim() : '',
      checked: Boolean(item.checked),
      createdAt: item.createdAt || new Date().toISOString()
    }));

  return cleaned.length > 0 ? cleaned : structuredClone(fallback);
};

const sanitizeCookingHistory = (history, recipes) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((entry, index) => {
      const matchedRecipe = recipes.find((recipe) => Number(recipe.id) === Number(entry.recipeId)) || recipes[0];
      if (!matchedRecipe) return null;

      return {
        id: entry.id || String(Date.now() + index),
        cookedAt: entry.cookedAt || new Date().toISOString(),
        title: isSafeString(entry?.title) ? entry.title : `${matchedRecipe.name} 완성 성공!`,
        description: isSafeString(entry?.description)
          ? entry.description
          : `${matchedRecipe.name}을(를) 맛있게 만들었어요. 다음에도 다시 해볼 만한 메뉴예요.`,
        ingredients: matchedRecipe.ingredients.map((item) => item.name).join(', '),
        category: matchedRecipe.category,
        image: matchedRecipe.image,
        setProfile: Boolean(entry?.setProfile),
        consumption: Array.isArray(entry?.consumption)
          ? entry.consumption
              .filter((item) => isSafeString(item?.name))
              .map((item) => ({
                name: item.name,
                units: Number(item.units) || 1,
                defaultUnits: Number(item.defaultUnits) || 1,
                baseAmount: isSafeString(item.baseAmount) ? item.baseAmount : ''
              }))
          : [],
        purchases: Array.isArray(entry?.purchases) ? entry.purchases.filter((item) => isSafeString(item?.name)) : [],
        thumbnail: matchedRecipe.image,
        date: entry.date || new Date().toLocaleDateString('ko-KR'),
        recipeId: matchedRecipe.id,
        xpReward: Number(entry?.xpReward) || matchedRecipe.xpReward || 20,
        coinReward: Number(entry?.coinReward) || matchedRecipe.coinReward || 30
      };
    })
    .filter(Boolean);
};

const sanitizeUsers = (users, fallback) => {
  const baseUser = fallback[0];
  const candidate = Array.isArray(users) && users[0] ? users[0] : baseUser;

  return [
    {
      id: 1,
      nickname: isSafeString(candidate.nickname) ? candidate.nickname : baseUser.nickname,
      level: Math.max(1, Number(candidate.level) || baseUser.level),
      xp: Math.max(0, Number(candidate.xp) || baseUser.xp),
      maxXp: Math.max(100, Number(candidate.maxXp) || baseUser.maxXp),
      coins: Math.max(0, Number(candidate.coins) || baseUser.coins),
      profileImage: candidate.profileImage || null
    }
  ];
};

const normalizeData = (data) => {
  const initial = createInitialData();
  return {
    ...initial,
    ...data,
    inventory: sanitizeInventory(data.inventory, initial.inventory),
    recipes: sanitizeRecipes(data.recipes, initial.recipes),
    communityPosts: sanitizeCommunity(data.communityPosts, initial.communityPosts),
    communityShorts: sanitizeCommunity(data.communityShorts, initial.communityShorts),
    shoppingList: sanitizeShoppingList(data.shoppingList, initial.shoppingList),
    users: sanitizeUsers(data.users, initial.users),
    cookingHistory: sanitizeCookingHistory(data.cookingHistory, sanitizeRecipes(data.recipes, initial.recipes))
  };
};

const readData = () => {
  ensureDataFile();
  const raw = fs.readFileSync(dataFile, 'utf8');
  const parsed = JSON.parse(raw);
  const normalized = normalizeData(parsed);
  if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
    writeData(normalized);
  }
  return normalized;
};

const writeData = (data) => {
  ensureDir();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  return data;
};

export const store = {
  getAll() {
    return readData();
  },

  reset() {
    return writeData(createInitialData());
  },

  getInventory() {
    return readData().inventory;
  },

  addInventoryItem(item) {
    const data = readData();
    const record = {
      id: item.id || nextId(data.inventory),
      ...item
    };
    data.inventory.unshift(record);
    writeData(data);
    return record;
  },

  updateInventoryItem(id, updates) {
    const data = readData();
    const index = data.inventory.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;
    data.inventory[index] = { ...data.inventory[index], ...updates, id: data.inventory[index].id };
    writeData(data);
    return data.inventory[index];
  },

  deleteInventoryItem(id) {
    const data = readData();
    const before = data.inventory.length;
    data.inventory = data.inventory.filter((item) => String(item.id) !== String(id));
    if (data.inventory.length === before) return false;
    writeData(data);
    return true;
  },

  getRecipes() {
    return readData().recipes;
  },

  getRecipeById(id) {
    return readData().recipes.find((recipe) => String(recipe.id) === String(id)) || null;
  },

  getCookingHistory() {
    return readData().cookingHistory;
  },

  addCookingHistory(entry) {
    const data = readData();
    const record = {
      id: entry.id || nextId(data.cookingHistory),
      cookedAt: new Date().toISOString(),
      ...entry
    };
    data.cookingHistory.unshift(record);
    writeData(data);
    return record;
  },

  getCommunityPosts() {
    return readData().communityPosts;
  },

  getCommunityShorts() {
    return readData().communityShorts;
  },

  getShoppingList() {
    return readData().shoppingList || [];
  },

  addShoppingListItems(items) {
    const data = readData();
    const current = data.shoppingList || [];
    const normalizedExisting = new Set(current.map((item) => String(item.name || '').trim().toLowerCase()));
    const nextNumericId = current.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);

    const created = items
      .filter((item) => isSafeString(item?.name))
      .filter((item) => !normalizedExisting.has(String(item.name).trim().toLowerCase()))
      .map((item, index) => ({
        id: String(nextNumericId + index + 1),
        name: item.name.trim(),
        amount: typeof item.amount === 'string' ? item.amount : '',
        source: typeof item.source === 'string' ? item.source : '',
        checked: false,
        createdAt: new Date().toISOString()
      }));

    data.shoppingList = [...created, ...current];
    writeData(data);
    return created;
  },

  updateShoppingListItem(id, updates) {
    const data = readData();
    const list = data.shoppingList || [];
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, id: list[index].id };
    data.shoppingList = list;
    writeData(data);
    return list[index];
  },

  deleteShoppingListItem(id) {
    const data = readData();
    const before = (data.shoppingList || []).length;
    data.shoppingList = (data.shoppingList || []).filter((item) => String(item.id) !== String(id));
    if (data.shoppingList.length === before) return false;
    writeData(data);
    return true;
  },

  getUser(userId = 1) {
    return readData().users.find((user) => Number(user.id) === Number(userId)) || null;
  },

  updateUser(userId, updates) {
    const data = readData();
    const index = data.users.findIndex((user) => Number(user.id) === Number(userId));
    if (index === -1) return null;
    data.users[index] = { ...data.users[index], ...updates, id: data.users[index].id };
    writeData(data);
    return data.users[index];
  }
};
