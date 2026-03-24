import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import PageFallback from './components/PageFallback';
import { mockInventory } from './data/mockInventory';
import { enhancedRecipes } from './data/mockRecipesEnhanced';
import { mockBoardPosts, mockShortsData } from './data/mockCommunityData';
import { shoppingListSeed } from '../shared/seedData.js';
import { api } from './lib/api';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const RecipeExplorer = lazy(() => import('./pages/RecipeExplorer'));
const Community = lazy(() => import('./pages/Community'));
const UploadModal = lazy(() => import('./components/UploadModal'));
const CookingCompleteModal = lazy(() => import('./components/CookingCompleteModal'));

const defaultStats = {
  level: 1,
  xp: 35,
  maxXp: 100,
  coins: 150,
  profileImage: null
};

const createClientId = (prefix = 'temp') =>
  `${prefix}-${Date.now()}-${globalThis.crypto?.randomUUID?.() || Math.random().toString(16).slice(2)}`;

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(mockInventory);
  const [recipes, setRecipes] = useState(enhancedRecipes);
  const [communityPosts, setCommunityPosts] = useState(mockBoardPosts);
  const [communityShorts, setCommunityShorts] = useState(mockShortsData);
  const [shoppingList, setShoppingList] = useState(shoppingListSeed);
  const [userStats, setUserStats] = useState(defaultStats);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPrefill, setUploadPrefill] = useState(null);
  const [cookingHistory, setCookingHistory] = useState([]);
  const [recipeOverrides, setRecipeOverrides] = useState({});
  const [initialRecipeId, setInitialRecipeId] = useState(null);
  const [justLeveledUp, setJustLeveledUp] = useState(null);
  const [pendingCooking, setPendingCooking] = useState(null);
  const [bootstrapReady, setBootstrapReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadBootstrap = async () => {
      try {
        const data = await api.getBootstrap();
        if (cancelled) return;

        setInventory(data.inventory || mockInventory);
        setRecipes(data.recipes || enhancedRecipes);
        setCookingHistory(data.cookingHistory || []);
        setCommunityPosts(data.communityPosts || mockBoardPosts);
        setCommunityShorts(data.communityShorts || mockShortsData);
        setShoppingList(data.shoppingList || shoppingListSeed);
        setUserStats(data.userStats || defaultStats);
      } catch (error) {
        console.warn('Bootstrap failed, using local seed data.', error);
      } finally {
        if (!cancelled) {
          setBootstrapReady(true);
        }
      }
    };

    loadBootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleViewRecipe = (recipeId) => {
    setInitialRecipeId(recipeId);
    navigate('/recipes');
  };

  const handleOpenStorageSection = (section) => {
    navigate('/inventory', { state: { initialTab: section } });
  };

  const handleClearInitialRecipe = () => {
    setInitialRecipeId(null);
  };

  const handleAddIngredient = async (newIngredient) => {
    setInventory((prev) => [newIngredient, ...prev]);
    try {
      const created = await api.addInventoryItem(newIngredient);
      setInventory((prev) => prev.map((item) => (item.id === newIngredient.id ? created : item)));
    } catch (error) {
      console.warn('Failed to persist ingredient.', error);
    }
  };

  const handleToggleFreeze = async (ingredientId) => {
    const target = inventory.find((item) => item.id === ingredientId);
    if (!target || target.location === 'room') return;

    const nextLocation = target.location === 'refrigerated' ? 'frozen' : 'refrigerated';
    await handleUpdateIngredient(ingredientId, { location: nextLocation });
  };

  const handleUpdateIngredient = async (ingredientId, updates) => {
    setInventory((prev) => prev.map((item) => (item.id === ingredientId ? { ...item, ...updates } : item)));
    try {
      await api.updateInventoryItem(ingredientId, updates);
    } catch (error) {
      console.warn('Failed to update ingredient.', error);
    }
  };

  const handleDeleteIngredient = async (ingredientId) => {
    const previous = inventory;
    setInventory((prev) => prev.filter((item) => item.id !== ingredientId));
    try {
      await api.deleteInventoryItem(ingredientId);
    } catch (error) {
      console.warn('Failed to delete ingredient.', error);
      setInventory(previous);
    }
  };

  const handleSetRecipeImage = (recipeId, imageUrl) => {
    setRecipeOverrides((prev) => ({
      ...prev,
      [recipeId]: imageUrl
    }));
  };

  const handleOpenUpload = (prefill = null) => {
    setUploadPrefill(prefill);
    setShowUploadModal(true);
  };

  const applyLevelRewards = (xpGain, coinGain) => {
    setUserStats((prev) => {
      const newXpTotal = prev.xp + xpGain;

      if (newXpTotal < prev.maxXp) {
        return {
          ...prev,
          xp: newXpTotal,
          coins: prev.coins + coinGain
        };
      }

      const overflow = newXpTotal - prev.maxXp;
      const nextMaxXp = Math.round(prev.maxXp * 1.2);
      const updated = {
        ...prev,
        level: prev.level + 1,
        xp: overflow,
        maxXp: nextMaxXp,
        coins: prev.coins + coinGain
      };

      setJustLeveledUp({
        newLevel: updated.level,
        coinsEarned: coinGain
      });

      return updated;
    });
  };

  const handleUpload = async (data) => {
    alert('사진 업로드가 완료되었어요.');

    if (uploadPrefill) {
      const finalImage = data.image || uploadPrefill.image;
      const historyRecord = {
        ...data,
        id: Date.now(),
        thumbnail: finalImage,
        date: new Date().toLocaleDateString('ko-KR'),
        recipeId: uploadPrefill.recipeId,
        xpReward: 20,
        coinReward: 30
      };

      setCookingHistory((prev) => [historyRecord, ...prev]);
      applyLevelRewards(20, 30);

      try {
        await api.addCookingHistory(historyRecord);
      } catch (error) {
        console.warn('Failed to persist cooking history.', error);
      }

      if (data.setProfile && finalImage && uploadPrefill.recipeId) {
        handleSetRecipeImage(uploadPrefill.recipeId, finalImage);
        alert(`'${data.title}' 사진을 이 레시피의 대표 사진으로 설정했어요.`);
      }
    }

    setShowUploadModal(false);
    setUploadPrefill(null);
  };

  const handleStartCookingComplete = (recipe) => {
    setPendingCooking({ recipe });
  };

  const handleConfirmCookingComplete = (result) => {
    const { consumption = [], purchases = [] } = result || {};

    if (consumption.length || purchases.length) {
      const addedDate = new Date().toISOString().slice(0, 10);

      setInventory((prev) => {
        let updated = [...prev];

        if (consumption.length) {
          updated = updated
            .map((item) => {
              const match = consumption.find((c) => (item.name || '').toLowerCase().includes((c.name || '').toLowerCase()));
              if (!match || !match.units || match.units <= 0 || !item.quantity) {
                return item;
              }

              const quantityStr = String(item.quantity);
              const numberMatch = quantityStr.match(/\d+/);
              if (!numberMatch) return item;

              const current = parseInt(numberMatch[0], 10);
              if (Number.isNaN(current)) return item;

              const next = current - match.units;
              if (next <= 0) return null;

              return {
                ...item,
                quantity: quantityStr.replace(/\d+/, String(next))
              };
            })
            .filter(Boolean);
        }

        if (purchases.length) {
          const addedItems = purchases.map((purchase) => ({
            id: createClientId('purchase'),
            name: purchase.name,
            icon: 'square',
            quantity: purchase.quantity || '',
            location: purchase.location || 'refrigerated',
            processingState: purchase.processingState || '가공식품',
            expiryDate: purchase.expiryDate || addedDate,
            addedDate
          }));

          addedItems.forEach((item) => {
            api.addInventoryItem(item).catch((error) => console.warn('Failed to persist purchased item.', error));
          });

          updated = [...updated, ...addedItems];
        }

        consumption.forEach((consumed) => {
          const target = updated.find((item) => (item.name || '').toLowerCase().includes((consumed.name || '').toLowerCase()));
          if (target) {
            api.updateInventoryItem(target.id, { quantity: target.quantity }).catch((error) =>
              console.warn('Failed to persist consumption update.', error)
            );
          }
        });

        return updated;
      });
    }

    const recipe = pendingCooking?.recipe;
    if (recipe) {
      handleOpenUpload({
        recipeId: recipe.id,
        image: recipe.image,
        title: `${recipe.name} 완성 성공!`,
        description: `${recipe.name}을(를) 맛있게 만들었어요. 다음에도 다시 해볼 만한 메뉴예요.`,
        ingredients: recipe.ingredients.map((item) => item.name).join(', '),
        category: recipe.category,
        consumption,
        purchases
      });
    }

    setPendingCooking(null);
  };

  const handleAddShoppingListItems = async (items) => {
    if (!Array.isArray(items) || items.length === 0) return;

    const deduped = items.filter((item) => {
      const normalizedName = (item.name || '').trim().toLowerCase();
      return normalizedName && !shoppingList.some((existing) => (existing.name || '').trim().toLowerCase() === normalizedName);
    });

    if (deduped.length === 0) {
      alert('이미 장보기 리스트에 담겨 있는 재료예요.');
      return;
    }

    const optimisticItems = deduped.map((item) => ({
      id: createClientId('shopping'),
      name: item.name,
      amount: item.amount || '',
      source: item.source || '',
      checked: false,
      createdAt: new Date().toISOString()
    }));

    setShoppingList((prev) => [...optimisticItems, ...prev]);

    try {
      const created = await api.addShoppingListItems(deduped);
      setShoppingList((prev) => [...created, ...prev.filter((item) => !optimisticItems.some((temp) => temp.id === item.id))]);
      alert(`장보기 리스트에 ${created.length}개 재료를 추가했어요.`);
    } catch (error) {
      console.warn('Failed to persist shopping list items.', error);
      setShoppingList((prev) => prev.filter((item) => !optimisticItems.some((temp) => temp.id === item.id)));
    }
  };

  const handleToggleShoppingListItem = async (itemId) => {
    const target = shoppingList.find((item) => String(item.id) === String(itemId));
    if (!target) return;

    const nextChecked = !target.checked;
    setShoppingList((prev) => prev.map((item) => (String(item.id) === String(itemId) ? { ...item, checked: nextChecked } : item)));

    try {
      await api.updateShoppingListItem(itemId, { checked: nextChecked });
    } catch (error) {
      console.warn('Failed to update shopping list item.', error);
      setShoppingList((prev) => prev.map((item) => (String(item.id) === String(itemId) ? target : item)));
    }
  };

  const handleRemoveShoppingListItem = async (itemId) => {
    const previous = shoppingList;
    setShoppingList((prev) => prev.filter((item) => String(item.id) !== String(itemId)));
    try {
      await api.deleteShoppingListItem(itemId);
    } catch (error) {
      console.warn('Failed to delete shopping list item.', error);
      setShoppingList(previous);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className="app">
      <Suspense fallback={<PageFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                  <Dashboard
                    userStats={userStats}
                    inventory={inventory}
                    recipes={recipes}
                    cookingHistory={cookingHistory}
                    shoppingList={shoppingList}
                    onViewRecipe={handleViewRecipe}
                    onOpenStorageSection={handleOpenStorageSection}
                    onSetRecipeImage={handleSetRecipeImage}
                    onToggleShoppingListItem={handleToggleShoppingListItem}
                    onRemoveShoppingListItem={handleRemoveShoppingListItem}
                    recipeOverrides={recipeOverrides}
                    bootstrapReady={bootstrapReady}
                  />
                </motion.div>
              }
            />

            <Route
              path="/inventory"
              element={
                <motion.div key="inventory" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                  <Inventory
                    inventory={inventory}
                    onAddIngredient={handleAddIngredient}
                    onUpdateIngredient={handleUpdateIngredient}
                    onDeleteIngredient={handleDeleteIngredient}
                    onToggleFreeze={handleToggleFreeze}
                  />
                </motion.div>
              }
            />

            <Route
              path="/recipes"
              element={
                <motion.div key="recipes" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                  <RecipeExplorer
                    inventory={inventory}
                    recipes={recipes}
                    shoppingList={shoppingList}
                    onStartCookingComplete={handleStartCookingComplete}
                    onAddShoppingListItems={handleAddShoppingListItems}
                    cookingHistory={cookingHistory}
                    initialRecipeId={initialRecipeId}
                    onClearInitialRecipe={handleClearInitialRecipe}
                    recipeOverrides={recipeOverrides}
                  />
                </motion.div>
              }
            />

            <Route
              path="/community"
              element={
                <motion.div key="community" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                  <Community inventory={inventory} posts={communityPosts} shorts={communityShorts} onOpenUpload={handleOpenUpload} />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <BottomNav />

      {showUploadModal ? (
        <Suspense fallback={null}>
          <UploadModal
            prefillData={uploadPrefill}
            onClose={() => {
              setShowUploadModal(false);
              setUploadPrefill(null);
            }}
            onUpload={handleUpload}
          />
        </Suspense>
      ) : null}

      {pendingCooking?.recipe ? (
        <Suspense fallback={null}>
          <CookingCompleteModal
            recipe={pendingCooking.recipe}
            inventory={inventory}
            onClose={() => setPendingCooking(null)}
            onConfirm={handleConfirmCookingComplete}
          />
        </Suspense>
      ) : null}

      {justLeveledUp ? (
        <div className="modal-overlay">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="modal-content max-w-sm w-full p-6 text-center"
          >
            <h2 className="mb-2 text-2xl font-bold text-slate-900">레벨 업!</h2>
            <p className="mb-4 text-gray-700">찬이가 한 단계 성장했어요. 현재 레벨은 {justLeveledUp.newLevel} 레벨입니다.</p>
            <p className="mb-6 font-semibold text-amber-600">보상으로 코인 {justLeveledUp.coinsEarned}개를 받았어요.</p>
            <button className="btn-primary w-full" onClick={() => setJustLeveledUp(null)}>
              계속하기
            </button>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
