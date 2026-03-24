import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  History,
  ShoppingCart,
  Sparkles,
  Trash2,
  Trophy,
  User
} from 'lucide-react';
import ChanCharacter from '../components/ChanCharacter';
import CookingHistoryModal from '../components/CookingHistoryModal';
import StatsDisplay from '../components/StatsDisplay';
import { calculateFreshness } from '../data/mockInventory';
import { storageMeta } from '../lib/inventoryMeta';
import { getRecommendedRecipe } from '../lib/recipeMatcher';

const storageCards = [
  { ...storageMeta.refrigerated, shortLabel: '냉장 칸 확인' },
  { ...storageMeta.frozen, shortLabel: '냉동 칸 확인' },
  { ...storageMeta.room, shortLabel: '실온 재고 확인' }
];

const Dashboard = ({
  userStats,
  inventory,
  recipes = [],
  cookingHistory = [],
  shoppingList = [],
  onViewRecipe,
  onSetRecipeImage,
  onToggleShoppingListItem,
  onRemoveShoppingListItem,
  recipeOverrides = {},
  onOpenStorageSection,
  bootstrapReady
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const urgentItems = useMemo(
    () =>
      inventory.filter((item) => {
        const freshness = calculateFreshness(item.expiryDate);
        return freshness.status === 'danger' || freshness.status === 'expired';
      }),
    [inventory]
  );

  const recentlyAdded = useMemo(
    () =>
      [...inventory]
        .sort((a, b) => String(b.addedDate || '').localeCompare(String(a.addedDate || '')))
        .slice(0, 3),
    [inventory]
  );

  const shoppingProgress = useMemo(() => {
    const completed = shoppingList.filter((item) => item.checked).length;
    return { total: shoppingList.length, completed };
  }, [shoppingList]);

  const todayRecommendation = useMemo(
    () => getRecommendedRecipe(recipes, inventory, cookingHistory),
    [cookingHistory, inventory, recipes]
  );

  const mood = useMemo(() => {
    const frozenItems = inventory.filter((item) => item.location === 'frozen');
    if (urgentItems.length > 0) return 'worried';
    if (frozenItems.length > inventory.length * 0.5) return 'cold';
    return 'happy';
  }, [inventory, urgentItems.length]);

  const message = useMemo(() => {
    if (urgentItems.length > 0) {
      return `${urgentItems[0].name} 유통기한이 가까워요. 오늘 먼저 챙겨보면 좋아요.`;
    }
    if (shoppingProgress.total > 0 && shoppingProgress.completed < shoppingProgress.total) {
      return `장보기 리스트에 ${shoppingProgress.total - shoppingProgress.completed}개가 남아 있어요. 필요한 재료를 채우면 추천 메뉴가 더 늘어나요.`;
    }
    return '오늘도 냉장고를 깔끔하게 관리해 볼까요?';
  }, [shoppingProgress, urgentItems]);

  const focusItems = useMemo(() => {
    const items = [];

    if (urgentItems.length > 0) {
      items.push({
        id: 'urgent',
        title: '오늘 먼저 써야 하는 재료',
        description: `${urgentItems[0].name} 포함 ${urgentItems.length}개 재료가 만료 임박 상태예요.`,
        actionLabel: '인벤토리 보기',
        action: () => onOpenStorageSection?.(urgentItems[0].location || 'refrigerated')
      });
    }

    if (todayRecommendation) {
      items.push({
        id: 'recipe',
        title: '지금 만들기 좋은 메뉴',
        description: `${todayRecommendation.recipe.name}은 현재 재료 매칭이 ${todayRecommendation.availability.matchPercentage}%예요.`,
        actionLabel: '레시피 열기',
        action: () => onViewRecipe?.(todayRecommendation.recipe.id)
      });
    }

    if (shoppingProgress.total > 0 && shoppingProgress.completed < shoppingProgress.total) {
      items.push({
        id: 'shopping',
        title: '장보기 마무리',
        description: `아직 ${shoppingProgress.total - shoppingProgress.completed}개 품목이 남아 있어요.`,
        actionLabel: null,
        action: null
      });
    }

    return items.slice(0, 3);
  }, [onOpenStorageSection, onViewRecipe, shoppingProgress, todayRecommendation, urgentItems]);

  return (
    <div className="page-shell pb-24">
      <div className="layout-container space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-500">Chan-i Refrigerator Guide</p>
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">찬이</h1>
            <p className="text-slate-500">
              {bootstrapReady ? '오늘의 냉장고 상태를 빠르게 훑어보고 바로 행동할 수 있어요.' : '찬이가 냉장고 상태를 불러오고 있어요.'}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
            {userStats.profileImage ? (
              <img src={userStats.profileImage} alt="Profile" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <User className="text-slate-500" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="section-card p-6">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex justify-center">
                <ChanCharacter mood={mood} message={message} />
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <StatsDisplay level={userStats.level} xp={userStats.xp} maxXp={userStats.maxXp} coins={userStats.coins} />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">최근 등록 재료</h3>
                    <span className="text-xs text-slate-500">총 {inventory.length}개 보관 중</span>
                  </div>
                  <div className="space-y-2">
                    {recentlyAdded.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3">
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.quantity}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">{item.addedDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {todayRecommendation ? (
              <motion.button
                type="button"
                onClick={() => onViewRecipe?.(todayRecommendation.recipe.id)}
                className="w-full rounded-[2rem] bg-slate-900 p-6 text-left text-white shadow-sm"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-300">
                      <Sparkles size={14} />
                      오늘 요리 추천
                    </div>
                    <h2 className="mt-3 text-2xl font-bold">{todayRecommendation.recipe.name}</h2>
                    <p className="mt-2 text-sm text-slate-300">
                      현재 재료 {todayRecommendation.availability.matchedCount}개와 맞아서 바로 시작하기 좋은 메뉴예요.
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </motion.button>
            ) : null}

            <div className="section-card p-5">
              <div className="mb-4">
                <h3 className="font-bold text-slate-900">오늘의 집중</h3>
                <p className="mt-1 text-sm text-slate-500">다음 행동이 바로 보이도록 핵심 작업만 추렸어요.</p>
              </div>
              <div className="space-y-3">
                {focusItems.length > 0 ? (
                  focusItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                      {item.action ? (
                        <button type="button" className="mt-3 text-sm font-semibold text-slate-900 underline" onClick={item.action}>
                          {item.actionLabel}
                        </button>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    오늘 처리할 중요한 항목이 없어요. 현재 상태가 안정적입니다.
                  </div>
                )}
              </div>
            </div>

            {urgentItems.length > 0 ? (
              <div className="rounded-[2rem] border border-red-200 bg-red-50 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 flex-shrink-0 text-red-500" size={22} />
                  <div>
                    <h3 className="font-bold text-red-800">긴급 알림</h3>
                    <p className="mt-1 text-sm text-red-700">유통기한이 가까운 재료가 {urgentItems.length}개 있어요.</p>
                    <ul className="mt-3 space-y-1 text-sm text-red-700">
                      {urgentItems.slice(0, 3).map((item) => {
                        const freshness = calculateFreshness(item.expiryDate);
                        return <li key={item.id}>{item.name} • {freshness.days > 0 ? `${freshness.days}일 남음` : '기한 만료'}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="section-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">장보기 리스트</h3>
                    <p className="text-sm text-slate-500">
                      완료 {shoppingProgress.completed} / 전체 {shoppingProgress.total}
                    </p>
                  </div>
                </div>
              </div>

              {shoppingList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                  레시피 상세에서 부족한 재료를 장보기 리스트로 바로 보낼 수 있어요.
                </div>
              ) : (
                <div className="space-y-2">
                  {shoppingList.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <button type="button" onClick={() => onToggleShoppingListItem?.(item.id)} className="flex items-center gap-3 text-left">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                            item.checked ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-transparent'
                          }`}
                        >
                          <CheckCircle2 size={14} />
                        </div>
                        <div>
                          <p className={`font-semibold ${item.checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.name}</p>
                          <p className="text-xs text-slate-500">{[item.amount, item.source].filter(Boolean).join(' • ')}</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveShoppingListItem?.(item.id)}
                        className="rounded-full p-2 text-slate-400 hover:bg-white hover:text-slate-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <motion.button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="group flex w-full items-center justify-between rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <History size={22} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">나의 요리 기록</h3>
                  <p className="text-sm text-slate-500">지금까지 {cookingHistory.length}번 저장했어요.</p>
                </div>
              </div>
              <div className="rounded-full bg-slate-100 p-2 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <Trophy size={18} />
              </div>
            </motion.button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">보관 구역 바로가기</h2>
            <p className="text-sm text-slate-500">구역을 누르면 해당 인벤토리로 바로 이동해요.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {storageCards.map((card) => {
              const count = inventory.filter((item) => item.location === card.id).length;
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  onClick={() => onOpenStorageSection?.(card.id)}
                  className="section-card p-5 text-left"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${card.accentClass}`}>
                        {card.fullLabel}
                      </p>
                      <p className="mt-4 text-3xl font-bold text-slate-900">{count}</p>
                      <p className="mt-1 text-sm text-slate-500">{card.shortLabel}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-sm">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {showHistoryModal ? (
        <CookingHistoryModal
          history={cookingHistory}
          onClose={() => setShowHistoryModal(false)}
          onViewRecipe={onViewRecipe}
          onSetRecipeImage={onSetRecipeImage}
          recipeOverrides={recipeOverrides}
        />
      ) : null}
    </div>
  );
};

export default Dashboard;
