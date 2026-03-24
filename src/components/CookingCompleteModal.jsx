import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Check, Plus, ShoppingCart, X } from 'lucide-react';
import { processingOptions, storageTabs } from '../lib/inventoryMeta';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const defaultExpiryDate = (daysFromNow = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
};

const matchesInventory = (inventory, ingredientName) => {
  const target = ingredientName?.toLowerCase?.() ?? '';
  return inventory?.some((item) => (item.name || '').toLowerCase().includes(target));
};

const CookingCompleteModal = ({ recipe, inventory, onClose, onConfirm }) => {
  const ingredients = recipe?.ingredients ?? [];

  const initialConsumption = useMemo(
    () =>
      ingredients.map((ingredient) => {
        const defaultUnits = ingredient.required ? 1 : 0;
        return {
          name: ingredient.name,
          baseAmount: ingredient.amount || null,
          defaultUnits,
          units: defaultUnits,
          inInventory: matchesInventory(inventory, ingredient.name)
        };
      }),
    [ingredients, inventory]
  );

  const [consumption, setConsumption] = useState(initialConsumption);
  const [hasPurchases, setHasPurchases] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [purchaseDraftName, setPurchaseDraftName] = useState('');

  const missingIngredients = useMemo(
    () => ingredients.filter((ingredient) => !matchesInventory(inventory, ingredient.name)).map((ingredient) => ingredient.name),
    [ingredients, inventory]
  );

  const addPurchase = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;

    setPurchases((prev) => {
      if (prev.some((purchase) => purchase.name === trimmed)) return prev;
      return [
        ...prev,
        {
          name: trimmed,
          quantity: '',
          location: 'refrigerated',
          processingState: '생재료',
          expiryDate: defaultExpiryDate(7)
        }
      ];
    });
    setPurchaseDraftName('');
  };

  const addMissingAsPurchases = () => {
    missingIngredients.forEach((name) => addPurchase(name));
    setHasPurchases(true);
  };

  const updateConsumptionUnits = (name, delta) => {
    setConsumption((prev) =>
      prev.map((item) => {
        if (item.name !== name) return item;
        return { ...item, units: clamp(item.units + delta, 0, 10) };
      })
    );
  };

  const updatePurchase = (name, updates) => {
    setPurchases((prev) => prev.map((purchase) => (purchase.name === name ? { ...purchase, ...updates } : purchase)));
  };

  const removePurchase = (name) => {
    setPurchases((prev) => prev.filter((purchase) => purchase.name !== name));
  };

  const handleConfirm = () => {
    onConfirm?.({
      recipeId: recipe?.id,
      recipeName: recipe?.name,
      consumption: consumption
        .filter((item) => item.units > 0)
        .map((item) => ({
          name: item.name,
          units: item.units,
          defaultUnits: item.defaultUnits,
          baseAmount: item.baseAmount
        })),
      purchases: hasPurchases ? purchases : []
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 20 }}
          className="modal-content w-full max-w-3xl p-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Post Cooking Check</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">요리 완료 정산</h2>
              <p className="mt-2 text-sm text-slate-500">사용한 재료와 추가 구매 재료를 함께 반영해서 인벤토리를 최신 상태로 맞춰요.</p>
            </div>
            <button type="button" onClick={onClose} className="btn-secondary flex h-11 w-11 items-center justify-center px-0">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <ShoppingCart size={18} />
                    추가 구매 재료
                  </h3>
                  {missingIngredients.length > 0 ? (
                    <button type="button" className="text-sm font-semibold text-slate-900 underline" onClick={addMissingAsPurchases}>
                      부족한 재료 {missingIngredients.length}개 자동 추가
                    </button>
                  ) : null}
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={hasPurchases}
                    onChange={(event) => setHasPurchases(event.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 accent-slate-900"
                  />
                  이번 요리를 위해 새로 산 재료가 있어요
                </label>
              </div>

              {hasPurchases ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      value={purchaseDraftName}
                      onChange={(event) => setPurchaseDraftName(event.target.value)}
                      placeholder="예: 양파, 올리브오일"
                      className="input-shell flex-1"
                    />
                    <button type="button" className="btn-primary flex items-center justify-center px-4" onClick={() => addPurchase(purchaseDraftName)}>
                      <Plus size={18} />
                    </button>
                  </div>

                  {purchases.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                      구매한 재료를 추가하면 다음 추천과 재고 관리가 더 정확해져요.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {purchases.map((purchase) => (
                        <div key={purchase.name} className="rounded-3xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-bold text-slate-900">{purchase.name}</p>
                            <button type="button" onClick={() => removePurchase(purchase.name)} className="text-xs font-bold text-slate-500 hover:text-slate-900">
                              삭제
                            </button>
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <input
                              value={purchase.quantity}
                              onChange={(event) => updatePurchase(purchase.name, { quantity: event.target.value })}
                              placeholder="수량"
                              className="input-shell"
                            />

                            <select
                              value={purchase.processingState}
                              onChange={(event) => updatePurchase(purchase.name, { processingState: event.target.value })}
                              className="input-shell"
                            >
                              {processingOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>

                            <select
                              value={purchase.location}
                              onChange={(event) => updatePurchase(purchase.name, { location: event.target.value })}
                              className="input-shell"
                            >
                              {storageTabs.map((tab) => (
                                <option key={tab.id} value={tab.id}>
                                  {tab.fullLabel}
                                </option>
                              ))}
                            </select>

                            <input
                              type="date"
                              value={purchase.expiryDate}
                              onChange={(event) => updatePurchase(purchase.name, { expiryDate: event.target.value })}
                              className="input-shell"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </section>

            <section className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">사용한 재료 정산</h3>
                  <p className="text-xs text-slate-500">0~10 범위로 조절</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">기본값은 레시피 기준 사용량이고, 실제 소비량에 맞춰 조정할 수 있어요.</p>
              </div>

              <div className="space-y-3">
                {consumption.map((item) => {
                  const delta = item.units - item.defaultUnits;

                  return (
                    <div key={item.name} className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-bold text-slate-900">{item.name}</p>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                item.inInventory ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.inInventory ? '재고 있음' : '재고 없음'}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            {item.baseAmount
                              ? `기본 ${item.defaultUnits}회 · ${item.baseAmount} / 현재 ${item.units}회`
                              : `기본 ${item.defaultUnits}회 / 현재 ${item.units}회`}
                            {delta !== 0 ? <span className="ml-2 font-semibold text-slate-900">기본 대비 {delta > 0 ? `+${delta}` : delta}</span> : null}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="btn-secondary flex h-10 w-10 items-center justify-center px-0"
                            onClick={() => updateConsumptionUnits(item.name, 1)}
                            aria-label={`${item.name} 사용량 증가`}
                          >
                            <ArrowUp size={18} />
                          </button>
                          <div className="w-12 text-center text-lg font-bold text-slate-900">{item.units}</div>
                          <button
                            type="button"
                            className="btn-secondary flex h-10 w-10 items-center justify-center px-0"
                            onClick={() => updateConsumptionUnits(item.name, -1)}
                            aria-label={`${item.name} 사용량 감소`}
                          >
                            <ArrowDown size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              수정 없이 닫기
            </button>
            <button type="button" className="btn-primary flex flex-1 items-center justify-center gap-2" onClick={handleConfirm}>
              <Check size={18} />
              기록하고 계속
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookingCompleteModal;
