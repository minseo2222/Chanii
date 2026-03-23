import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Snowflake, Thermometer, Trash2, Edit3, Package2, ArrowRightLeft } from 'lucide-react';
import { calculateFreshness } from '../data/mockInventory';

const locationLabels = {
    refrigerated: { label: '냉장', icon: Thermometer },
    frozen: { label: '냉동', icon: Snowflake },
    room: { label: '실온', icon: Calendar }
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
    const LocationIcon = locationLabels[editData.location].icon;

    const transferTarget = useMemo(() => {
        if (editData.location === 'refrigerated') return '냉동';
        if (editData.location === 'frozen') return '냉장';
        return null;
    }, [editData.location]);

    const handleSave = () => {
        onUpdate(ingredient.id, editData);
        setIsEditing(false);
        onClose();
    };

    const handleDelete = () => {
        if (confirm(`${ingredient.name}을(를) 삭제할까요?`)) {
            onDelete(ingredient.id);
            onClose();
        }
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        {isEditing ? '재료 수정' : '재료 상세'}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-gray-500 hover:text-pastel-purple transition-colors"
                        >
                            <Edit3 size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-pastel-pink to-pastel-peach rounded-full flex items-center justify-center shadow-lg">
                        <Package2 className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-1">
                            재료명
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none"
                            />
                        ) : (
                            <p className="text-lg font-bold">{ingredient.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-2">
                            보관 위치
                        </label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                {Object.entries(locationLabels).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setEditData({ ...editData, location: key })}
                                        className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-all ${editData.location === key ? 'bg-pastel-purple text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700">
                                <LocationIcon size={18} />
                                <span className="font-semibold">{locationLabels[ingredient.location].label}</span>
                            </div>
                        )}
                    </div>

                    {!isEditing && transferTarget && (
                        <motion.button
                            type="button"
                            onClick={handleTransfer}
                            className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-4 shadow-lg flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ArrowRightLeft size={18} />
                            {transferTarget} 보관으로 옮기기
                        </motion.button>
                    )}

                    <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-1">
                            수량
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.quantity}
                                onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none"
                            />
                        ) : (
                            <p className="text-base text-gray-700">{ingredient.quantity}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-1">
                            손질 상태
                        </label>
                        {isEditing ? (
                            <select
                                value={editData.processingState}
                                onChange={(e) => setEditData({ ...editData, processingState: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none"
                            >
                                <option value="원물">원물</option>
                                <option value="소분">소분</option>
                                <option value="손질">손질</option>
                                <option value="완제품">완제품</option>
                            </select>
                        ) : (
                            <p className="text-base text-gray-700">{ingredient.processingState}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">
                                등록일
                            </label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData.addedDate}
                                    onChange={(e) => setEditData({ ...editData, addedDate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none text-sm"
                                />
                            ) : (
                                <p className="text-sm text-gray-700">{ingredient.addedDate}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">
                                유통기한
                            </label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData.expiryDate}
                                    onChange={(e) => setEditData({ ...editData, expiryDate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none text-sm"
                                />
                            ) : (
                                <p className="text-sm text-gray-700">{ingredient.expiryDate}</p>
                            )}
                        </div>
                    </div>

                    {!isEditing && (
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">신선도</span>
                                <span className="text-sm font-bold text-gray-700">
                                    {freshness.days > 0 ? `${freshness.days}일 남음` : '유통기한 만료'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${freshness.percentage}%` }}
                                    className={`h-full rounded-full ${freshness.status === 'good' ? 'bg-green-500' : freshness.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-3">
                    {isEditing ? (
                        <>
                            <motion.button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                취소
                            </motion.button>
                            <motion.button
                                onClick={handleSave}
                                className="flex-1 btn-primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                저장
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            onClick={handleDelete}
                            className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
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
