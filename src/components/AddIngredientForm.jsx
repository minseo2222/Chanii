import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { processingOptions, storageTabs } from '../lib/inventoryMeta';

const AddIngredientForm = ({ onAdd, onClose }) => {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    location: 'refrigerated',
    processingState: '생재료',
    expiryDate: today,
    icon: 'square'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.quantity.trim() || !formData.expiryDate) return;

    onAdd({
      ...formData,
      id: Date.now().toString(),
      name: formData.name.trim(),
      quantity: formData.quantity.trim(),
      addedDate: today
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content w-full max-w-lg p-6"
          initial={{ scale: 0.96, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 20 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Quick Capture</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">재료 추가</h2>
              <p className="mt-2 text-sm text-slate-500">자주 쓰는 정보만 빠르게 입력하고 바로 인벤토리에 반영할 수 있어요.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ingredient-name">
                재료명
              </label>
              <input
                id="ingredient-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-shell"
                placeholder="예: 양파, 닭가슴살, 김치"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ingredient-quantity">
                수량
              </label>
              <input
                id="ingredient-quantity"
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input-shell"
                placeholder="예: 2개, 300g, 1봉"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="ingredient-location">
                  보관 위치
                </label>
                <select
                  id="ingredient-location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-shell"
                >
                  {storageTabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.fullLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="ingredient-processing">
                  재료 상태
                </label>
                <select
                  id="ingredient-processing"
                  name="processingState"
                  value={formData.processingState}
                  onChange={handleChange}
                  className="input-shell"
                >
                  {processingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="ingredient-expiry">
                유통기한
              </label>
              <input
                id="ingredient-expiry"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="input-shell"
                required
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              빠른 팁: 보관 위치와 유통기한만 정확히 넣어도 추천 레시피와 만료 알림 품질이 크게 좋아져요.
            </div>

            <motion.button
              type="submit"
              className="btn-primary flex w-full items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Plus size={18} />
              인벤토리에 추가
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddIngredientForm;
