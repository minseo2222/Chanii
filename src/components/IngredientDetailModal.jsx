import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Calendar, Edit3, Package2, Snowflake, Thermometer, Trash2, X } from 'lucide-react';
import { calculateFreshness } from '../data/mockInventory';
import {
  formatFreshnessCountdown,
  formatFreshnessStatus,
  processingMeta,
  processingOptions,
  storageMeta
} from '../lib/inventoryMeta';

const locationIcons = {
  refrigerated: Thermometer,
  frozen: Snowflake,
  room: Calendar
};

const IngredientDetailModal = ({ ingredient, onClose, onUpdate, onDelete, onToggleFreeze }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: ingredient.name,
    location: ingredient.location,
    addedDate: ingredient.addedDate,
    expiryDate: ingredient.expiryDate,
    quantity: ingredient.quantity,
    processingState: ingredient.processingState
  });

  const freshness = calculateFreshness(editData.expiryDate);
  const locationMeta = storageMeta[editData.location] || storageMeta.refrigerated;
  const LocationIcon = locationIcons[editData.location] || Thermometer;
  const transferTarget = useMemo(() => {
    if (editData.location === 'refrigerated') return storageMeta.frozen;
    if (editData.location === 'frozen') return storageMeta.refrigerated;
    return null;
  }, [editData.location]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(ingredient.id, editData);
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    if (!window.confirm(`${ingredient.name} 재료를 삭제할까요?`)) return;
    onDelete(ingredient.id);
    onClose();
  };

  const handleTransfer = () => {
    if (!transferTarget) return;
    onToggleFreeze?.(ingredient.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        className="modal-content w-full max-w-lg p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">{isEditing ? 'Edit Item' : 'Ingredient Profile'}</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{isEditing ? '재료 수정' : ingredient.name}</h2>
            <p className="mt-2 text-sm text-slate-500">수량, 보관 위치, 유통기한을 바로 조정할 수 있어요.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
            >
              <Edit3 size={18} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
              <Package2 size={26} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className={`badge border ${locationMeta.accentClass}`}>{locationMeta.fullLabel}</span>
                <span className={`badge border ${(processingMeta[editData.processingState] || processingMeta.생재료).className}`}>
                  {editData.processingState}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500">{locationMeta.helperText}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="detail-name">
              재료명
            </label>
            {isEditing ? (
              <input id="detail-name" name="name" value={editData.name} onChange={handleChange} className="input-shell" />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">{ingredient.name}</div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="detail-quantity">
                수량
              </label>
              {isEditing ? (
                <input id="detail-quantity" name="quantity" value={editData.quantity} onChange={handleChange} className="input-shell" />
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">{ingredient.quantity}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="detail-processing">
                재료 상태
              </label>
              {isEditing ? (
                <select
                  id="detail-processing"
                  name="processingState"
                  value={editData.processingState}
                  onChange={handleChange}
                  className="input-shell"
                >
                  {processingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">{ingredient.processingState}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">보관 위치</label>
            {isEditing ? (
              <div className="grid grid-cols-3 gap-2">
                {Object.values(storageMeta).map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => setEditData((prev) => ({ ...prev, location: location.id }))}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      editData.location === location.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {location.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <LocationIcon size={18} />
                <span className="font-semibold">{locationMeta.fullLabel}</span>
              </div>
            )}
          </div>

          {!isEditing && transferTarget ? (
            <motion.button
              type="button"
              onClick={handleTransfer}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <ArrowRightLeft size={18} />
              {transferTarget.fullLabel}으로 옮기기
            </motion.button>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="detail-added">
                등록일
              </label>
              {isEditing ? (
                <input id="detail-added" name="addedDate" type="date" value={editData.addedDate} onChange={handleChange} className="input-shell" />
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">{ingredient.addedDate}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="detail-expiry">
                유통기한
              </label>
              {isEditing ? (
                <input
                  id="detail-expiry"
                  name="expiryDate"
                  type="date"
                  value={editData.expiryDate}
                  onChange={handleChange}
                  className="input-shell"
                />
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">{ingredient.expiryDate}</div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">{formatFreshnessStatus(freshness)}</span>
              <span className="text-sm text-slate-500">{formatFreshnessCountdown(freshness)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${freshness.percentage}%` }}
                className={`h-full rounded-full ${
                  freshness.status === 'good'
                    ? 'bg-emerald-500'
                    : freshness.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {isEditing ? (
            <>
              <motion.button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary flex-1"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                취소
              </motion.button>
              <motion.button
                type="button"
                onClick={handleSave}
                className="btn-primary flex-1"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                저장
              </motion.button>
            </>
          ) : (
            <motion.button
              type="button"
              onClick={handleDelete}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-red-600"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Trash2 size={18} />
              삭제
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IngredientDetailModal;
