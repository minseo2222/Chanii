import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUp, ArrowDown, ShoppingCart, Check, Plus } from 'lucide-react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const defaultExpiryDate = (daysFromNow = 7) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().slice(0, 10);
};

const matchesInventory = (inventory, ingredientName) => {
    const target = ingredientName?.toLowerCase?.() ?? '';
    return inventory?.some((item) => (item.name || '').toLowerCase().includes(target));
};

const CookingCompleteModal = ({ recipe, inventory, onClose, onConfirm }) => {
    const ingredients = recipe?.ingredients ?? [];

    const initialConsumption = useMemo(() => {
        return ingredients.map((ing) => {
            const defaultUnits = ing.required ? 1 : 0;
            return {
                name: ing.name,
                baseAmount: ing.amount || null,
                defaultUnits,
                units: defaultUnits,
                inInventory: matchesInventory(inventory, ing.name)
            };
        });
    }, [ingredients, inventory]);

    const [consumption, setConsumption] = useState(initialConsumption);
    const [hasPurchases, setHasPurchases] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [purchaseDraftName, setPurchaseDraftName] = useState('');

    const missingIngredients = useMemo(() => {
        return ingredients
            .filter((ing) => !matchesInventory(inventory, ing.name))
            .map((ing) => ing.name);
    }, [ingredients, inventory]);

    const addPurchase = (name) => {
        const trimmed = (name || '').trim();
        if (!trimmed) return;
        setPurchases((prev) => {
            if (prev.some((p) => p.name === trimmed)) return prev;
            return [
                ...prev,
                {
                    name: trimmed,
                    quantity: '',
                    location: 'refrigerated',
                    processingState: '원물',
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
            prev.map((c) => {
                if (c.name !== name) return c;
                return { ...c, units: clamp(c.units + delta, 0, 10) };
            })
        );
    };

    const updatePurchase = (name, updates) => {
        setPurchases((prev) => prev.map((p) => (p.name === name ? { ...p, ...updates } : p)));
    };

    const removePurchase = (name) => {
        setPurchases((prev) => prev.filter((p) => p.name !== name));
    };

    const handleConfirm = () => {
        onConfirm?.({
            recipeId: recipe?.id,
            recipeName: recipe?.name,
            consumption: consumption
                .filter((c) => c.units > 0)
                .map((c) => ({
                    name: c.name,
                    units: c.units,
                    defaultUnits: c.defaultUnits,
                    baseAmount: c.baseAmount
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
                    initial={{ scale: 0.92, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 20 }}
                    className="modal-content w-full max-w-2xl p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
                                요리 완료 정산
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                사용한 재료 소모량을 조정하고, 추가로 산 재료가 있으면 함께 기록해요.
                            </p>
                        </div>
                        <button onClick={onClose} className="btn-icon w-10 h-10">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <ShoppingCart size={18} className="text-pastel-purple" />
                                추가로 구매한 재료
                            </h3>
                            {missingIngredients.length > 0 && (
                                <button
                                    type="button"
                                    className="text-sm font-semibold text-pastel-purple hover:underline"
                                    onClick={addMissingAsPurchases}
                                >
                                    부족한 재료({missingIngredients.length}) 자동 추가
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={hasPurchases}
                                onChange={(e) => setHasPurchases(e.target.checked)}
                                className="w-5 h-5 text-pastel-purple rounded border-gray-300 focus:ring-pastel-purple accent-pastel-purple"
                                id="hasPurchases"
                            />
                            <label htmlFor="hasPurchases" className="text-sm font-medium text-gray-700">
                                이번 요리를 위해 추가 구매한 재료가 있어요
                            </label>
                        </div>

                        {hasPurchases && (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        value={purchaseDraftName}
                                        onChange={(e) => setPurchaseDraftName(e.target.value)}
                                        placeholder="예: 양파, 올리브오일"
                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        className="btn-primary px-4 py-3 rounded-xl"
                                        onClick={() => addPurchase(purchaseDraftName)}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {purchases.length === 0 ? (
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-500">
                                        구매한 재료를 추가해 주세요. 자동 추가 기능도 사용할 수 있어요.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {purchases.map((p) => (
                                            <div key={p.name} className="bg-white border border-gray-100 rounded-2xl p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="font-bold text-gray-800">{p.name}</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePurchase(p.name)}
                                                        className="text-xs font-bold text-gray-500 hover:text-gray-800"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                                                    <input
                                                        value={p.quantity}
                                                        onChange={(e) => updatePurchase(p.name, { quantity: e.target.value })}
                                                        placeholder="수량(선택)"
                                                        className="px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-purple focus:outline-none"
                                                    />
                                                    <select
                                                        value={p.location}
                                                        onChange={(e) => updatePurchase(p.name, { location: e.target.value })}
                                                        className="px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-purple focus:outline-none"
                                                    >
                                                        <option value="refrigerated">냉장</option>
                                                        <option value="frozen">냉동</option>
                                                        <option value="room">실온</option>
                                                    </select>
                                                    <input
                                                        type="date"
                                                        value={p.expiryDate}
                                                        onChange={(e) => updatePurchase(p.name, { expiryDate: e.target.value })}
                                                        className="px-3 py-2 rounded-xl border border-gray-200 focus:border-pastel-purple focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">사용한 식재료 정산</h3>
                            <p className="text-xs text-gray-500">0~10 사이로 조절</p>
                        </div>

                        <div className="space-y-2">
                            {consumption.map((c) => {
                                const delta = c.units - c.defaultUnits;
                                return (
                                    <div
                                        key={c.name}
                                        className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-gray-800 truncate">{c.name}</p>
                                                {c.inInventory ? (
                                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                        재고 있음
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                        재고 없음
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {c.baseAmount ? (
                                                    <span>
                                                        기본 {c.defaultUnits}회 × {c.baseAmount} / 현재 {c.units}회 × {c.baseAmount}
                                                    </span>
                                                ) : (
                                                    <span>기본 {c.defaultUnits} / 현재 {c.units}</span>
                                                )}
                                                {delta !== 0 && (
                                                    <span className="ml-2 font-semibold text-pastel-purple">
                                                        (기본 대비 {delta > 0 ? `+${delta}` : `${delta}`})
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                className="btn-icon w-10 h-10"
                                                onClick={() => updateConsumptionUnits(c.name, 1)}
                                                aria-label={`${c.name} 소모량 증가`}
                                                type="button"
                                            >
                                                <ArrowUp size={18} />
                                            </button>
                                            <div className="w-12 text-center font-bold text-gray-800 text-lg">
                                                {c.units}
                                            </div>
                                            <button
                                                className="btn-icon w-10 h-10"
                                                onClick={() => updateConsumptionUnits(c.name, -1)}
                                                aria-label={`${c.name} 소모량 감소`}
                                                type="button"
                                            >
                                                <ArrowDown size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button type="button" className="btn-secondary flex-1" onClick={onClose}>
                            나중에 할게요
                        </button>
                        <button type="button" className="btn-primary flex-1 flex items-center justify-center gap-2" onClick={handleConfirm}>
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
