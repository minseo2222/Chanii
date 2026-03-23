import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { inventorySeed, recipeSeed, communityPostsSeed, communityShortsSeed } from '../../shared/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');
const dataFile = path.join(dataDir, 'app-data.json');

const ensureDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const createInitialData = () => ({
  inventory: inventorySeed,
  recipes: recipeSeed,
  cookingHistory: [],
  communityPosts: communityPostsSeed,
  communityShorts: communityShortsSeed,
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

const readData = () => {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
};

const writeData = (data) => {
  ensureDir();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  return data;
};

const nextId = (items) => {
  return String(
    items.reduce((max, item) => {
      const value = Number(item.id);
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0) + 1
  );
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
