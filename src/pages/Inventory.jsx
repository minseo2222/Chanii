import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckSquare, MoveHorizontal, Package, Plus, Search, Sparkles, Square } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import AddIngredientForm from '../components/AddIngredientForm';
import IngredientCard from '../components/IngredientCard';
import IngredientDetailModal from '../components/IngredientDetailModal';
import { calculateFreshness } from '../data/mockInventory';
import { storageMeta, storageTabs } from '../lib/inventoryMeta';

const Inventory = ({ inventory, onAddIngredient, onUpdateIngredient, onDeleteIngredient, onToggleFreeze }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('refrigerated');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    const requestedTab = location.state?.initialTab;
    if (requestedTab && storageTabs.some((tab) => tab.id === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [location.state]);

  useEffect(() => {
    setSelectedIds([]);
    setSelectionMode(false);
  }, [activeTab]);

  const tabItems = useMemo(() => inventory.filter((item) => item.location === activeTab), [inventory, activeTab]);

  const visibleItems = useMemo(() => {
    const normalizedTerm = deferredSearchTerm.trim().toLowerCase();
    if (!normalizedTerm) return tabItems;

    return tabItems.filter((item) =>
      [item.name, item.quantity, item.processingState]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedTerm))
    );
  }, [deferredSearchTerm, tabItems]);

  const activeStorage = storageMeta[activeTab] || storageMeta.refrigerated;
  const selectable = activeTab !== 'room';
  const transferLabel = activeTab === 'refrigerated' ? '냉동 보관으로 이동' : '냉장 보관으로 이동';

  const summary = useMemo(() => {
    const expiringSoon = tabItems.filter((item) => {
      const freshness = calculateFreshness(item.expiryDate);
      return freshness.status === 'danger' || freshness.status === 'expired';
    }).length;

    return {
      total: tabItems.length,
      expiringSoon,
      selected: selectedIds.length
    };
  }, [selectedIds.length, tabItems]);

  const toggleSelected = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const handleCardClick = (item) => {
    if (selectionMode) {
      toggleSelected(item.id);
      return;
    }

    setSelectedIngredient(item);
  };

  const handleMoveSelected = async () => {
    await Promise.all(selectedIds.map((id) => onToggleFreeze?.(id)));
    setSelectedIds([]);
    setSelectionMode(false);
  };

  return (
    <div className="page-shell pb-24">
      <div className="layout-container space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-500">Inventory Control</p>
            <h1 className="text-4xl font-bold text-slate-900">인벤토리</h1>
            <p className="max-w-2xl text-slate-500">
              자주 쓰는 재료를 빠르게 찾고, 냉장·냉동·실온 흐름을 한 번에 관리할 수 있게 정리했어요.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {selectable ? (
              <motion.button
                type="button"
                onClick={() => {
                  setSelectionMode((prev) => !prev);
                  setSelectedIds([]);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 font-semibold transition-colors ${
                  selectionMode ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {selectionMode ? <CheckSquare size={18} /> : <Square size={18} />}
                {selectionMode ? '선택 종료' : '다중 선택'}
              </motion.button>
            ) : null}

            <motion.button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Plus size={18} />
              재료 추가
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="section-card p-3">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {storageTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab min-w-[132px] ${activeTab === tab.id ? 'tab-active shadow-sm' : 'tab-inactive'}`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="section-card flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">현재 구역</p>
              <p className="font-bold text-slate-900">{activeStorage.fullLabel}</p>
              <p className="mt-1 text-sm text-slate-500">{activeStorage.helperText}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="metric-card">
            <p className="text-sm text-slate-500">현재 구역 재고</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{summary.total}</p>
            <p className="mt-2 text-sm text-slate-500">선택한 보관 칸 기준 수량이에요.</p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-slate-500">유통기한 임박</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{summary.expiringSoon}</p>
            <p className="mt-2 text-sm text-slate-500">오늘 먼저 써야 하는 재료 수예요.</p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-slate-500">다중 선택</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{summary.selected}</p>
            <p className="mt-2 text-sm text-slate-500">선택 모드에서 한 번에 이동할 수 있어요.</p>
          </div>
        </div>

        <div className="section-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">빠른 탐색</h2>
              <p className="mt-1 text-sm text-slate-500">재료명, 수량, 상태로 바로 찾을 수 있어요.</p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="예: 김치, 300g, 반찬"
                className="input-shell pl-11"
              />
            </div>
          </div>
        </div>

        {selectionMode && selectable ? (
          <div className="rounded-[2rem] bg-slate-900 p-4 text-white shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold">선택한 재료 {selectedIds.length}개</p>
                <p className="mt-1 text-sm text-slate-300">한 번에 옮겨서 재고 정리를 빠르게 끝낼 수 있어요.</p>
              </div>
              <motion.button
                type="button"
                onClick={handleMoveSelected}
                disabled={selectedIds.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-slate-900 disabled:opacity-40"
                whileHover={{ scale: selectedIds.length > 0 ? 1.01 : 1 }}
                whileTap={{ scale: selectedIds.length > 0 ? 0.99 : 1 }}
              >
                <MoveHorizontal size={18} />
                {transferLabel}
              </motion.button>
            </div>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectionMode}-${deferredSearchTerm}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            {visibleItems.length === 0 ? (
              <div className="section-card flex flex-col items-center px-6 py-16 text-center">
                <Package className="mb-4 text-slate-300" size={56} />
                <h3 className="text-xl font-bold text-slate-800">
                  {searchTerm.trim() ? '검색 결과가 없어요' : activeStorage.emptyTitle}
                </h3>
                <p className="mt-2 max-w-md text-slate-500">
                  {searchTerm.trim()
                    ? '검색어를 바꾸거나 다른 보관 구역으로 이동해 보세요.'
                    : activeStorage.emptyDescription}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {searchTerm.trim() ? (
                    <button type="button" onClick={() => setSearchTerm('')} className="btn-secondary">
                      검색 초기화
                    </button>
                  ) : null}
                  <button type="button" onClick={() => setShowAddForm(true)} className="btn-primary">
                    재료 추가하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleCardClick(item)}
                    className="cursor-pointer"
                  >
                    <IngredientCard ingredient={item} selectionMode={selectionMode} selected={selectedIds.includes(item.id)} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="section-card p-6">
          <h3 className="text-lg font-bold text-slate-900">운영 팁</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              냉장과 냉동만 다중 이동이 가능해서 정리 작업이 빨라져요.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              유통기한 임박 재료를 먼저 등록하면 메인 추천과 알림 품질이 좋아져요.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              재료 카드를 눌러 수량, 날짜, 위치를 바로 수정할 수 있어요.
            </div>
          </div>
        </div>
      </div>

      {showAddForm ? <AddIngredientForm onAdd={onAddIngredient} onClose={() => setShowAddForm(false)} /> : null}

      <AnimatePresence>
        {selectedIngredient && !selectionMode ? (
          <IngredientDetailModal
            ingredient={selectedIngredient}
            onClose={() => setSelectedIngredient(null)}
            onUpdate={onUpdateIngredient}
            onDelete={onDeleteIngredient}
            onToggleFreeze={onToggleFreeze}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
