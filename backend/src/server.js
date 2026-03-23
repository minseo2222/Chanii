import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './ai/routes.js';
import { store } from './store.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/ai', aiRoutes);

app.get('/health', async (req, res) => {
  res.json({ status: 'ok', storage: 'json-file' });
});

app.get('/api/bootstrap', (req, res) => {
  const user = store.getUser(1);
  res.json({
    inventory: store.getInventory(),
    recipes: store.getRecipes(),
    cookingHistory: store.getCookingHistory(),
    communityPosts: store.getCommunityPosts(),
    communityShorts: store.getCommunityShorts(),
    userStats: user
      ? {
          level: user.level,
          xp: user.xp,
          maxXp: user.maxXp,
          coins: user.coins,
          profileImage: user.profileImage
        }
      : null
  });
});

app.get('/api/inventory', (req, res) => {
  res.json(store.getInventory());
});

app.post('/api/inventory', (req, res) => {
  const item = req.body || {};
  const created = store.addInventoryItem(item);
  res.status(201).json(created);
});

app.put('/api/inventory/:id', (req, res) => {
  const updated = store.updateInventoryItem(req.params.id, req.body || {});
  if (!updated) {
    return res.status(404).json({ message: 'Inventory item not found' });
  }
  res.json(updated);
});

app.delete('/api/inventory/:id', (req, res) => {
  const ok = store.deleteInventoryItem(req.params.id);
  if (!ok) {
    return res.status(404).json({ message: 'Inventory item not found' });
  }
  res.status(204).send();
});

app.get('/api/recipes', (req, res) => {
  res.json(store.getRecipes());
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = store.getRecipeById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  res.json(recipe);
});

app.get('/api/cooking-history', (req, res) => {
  res.json(store.getCookingHistory());
});

app.post('/api/cooking-history', (req, res) => {
  const payload = req.body || {};
  const created = store.addCookingHistory(payload);

  const user = store.getUser(payload.userId || 1);
  if (user) {
    const xpReward = Number(payload.xpReward ?? 20);
    const coinReward = Number(payload.coinReward ?? 30);
    const nextXp = user.xp + xpReward;
    if (nextXp >= user.maxXp) {
      const overflow = nextXp - user.maxXp;
      store.updateUser(user.id, {
        level: user.level + 1,
        xp: overflow,
        maxXp: Math.round(user.maxXp * 1.2),
        coins: user.coins + coinReward
      });
    } else {
      store.updateUser(user.id, {
        xp: nextXp,
        coins: user.coins + coinReward
      });
    }
  }

  res.status(201).json(created);
});

app.get('/api/community/posts', (req, res) => {
  res.json(store.getCommunityPosts());
});

app.get('/api/community/shorts', (req, res) => {
  res.json(store.getCommunityShorts());
});

app.post('/api/dev/reset', (req, res) => {
  const data = store.reset();
  res.json({ ok: true, data });
});

app.listen(port, () => {
  console.log(`Chan-i backend listening on port ${port}`);
});
