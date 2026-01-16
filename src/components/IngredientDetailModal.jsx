import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Snowflake, Thermometer, Trash2, Edit3 } from 'lucide-react';
import { calculateFreshness } from '../data/mockInventory';

const IngredientDetailModal = ({ ingredient, onClose, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: ingredient.name,
        location: ingredient.location,
        purchaseDate: ingredient.purchaseDate,
        expiryDate: ingredient.expiryDate
    });

    const freshness = calculateFreshness(ingredient.expiryDate);

    const locationLabels = {
        refrigerated: { label: '냉장', icon: Thermometer, color: 'blue' },
        frozen: { label: '냉동', icon: Snowflake, color: 'cyan' },
        room: { label: '실온', icon: Calendar, color: 'amber' }
    };

    const handleSave = () => {
        onUpdate(ingredient.id, editData);
        setIsEditing(false);
        onClose();
    };

    const handleToggleFreeze = () => {
        if (ingredient.location !== 'room') {
            const newLocation = ingredient.location === 'refrigerated' ? 'frozen' : 'refrigerated';
            onUpdate(ingredient.id, { ...editData, location: newLocation });
            setEditData({ ...editData, location: newLocation });
        }
    };

    const handleDelete = () => {
        if (confirm(`${ingredient.name}을(를) 삭제하시겠습니까?`)) {
            onDelete(ingredient.id);
            onClose();
        }
    };

    const LocationIcon = locationLabels[editData.location].icon;

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
                className="bg-white rounded-3xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
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

                {/* Emoji Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-pastel-pink to-pastel-peach rounded-full flex items-center justify-center text-6xl shadow-lg">
                        {ingredient.emoji}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Name */}
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

                    {/* Location */}
                    <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-2">
                            보관 위치
                        </label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                {Object.entries(locationLabels).map(([key, { label, color }]) => (
                                    <button
                                        key={key}
                                        onClick={() => setEditData({ ...editData, location: key })}
                                        className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-all ${editData.location === key
                                                ? `bg-${color}-500 text-white shadow-md`
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${locationLabels[ingredient.location].color}-100 text-${locationLabels[ingredient.location].color}-700`}>
                                <LocationIcon size={18} />
                                <span className="font-semibold">{locationLabels[ingredient.location].label}</span>
                            </div>
                        )}
                    </div>

                    {/* Quick Toggle (only for refrigerated/frozen) */}
                    {!isEditing && ingredient.location !== 'room' && (
                        <motion.button
                            onClick={handleToggleFreeze}
                            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-md"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {ingredient.location === 'refrigerated' ? '냉동실로 이동 ❄️' : '냉장실로 이동 🧊'}
                        </motion.button>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">
                                구매일
                            </label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData.purchaseDate}
                                    onChange={(e) => setEditData({ ...editData, purchaseDate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none text-sm"
                                />
                            ) : (
                                <p className="text-sm text-gray-700">{ingredient.purchaseDate}</p>
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

                    {/* Freshness Indicator */}
                    {!isEditing && (
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">신선도</span>
                                <span className={`text-sm font-bold ${freshness.status === 'fresh' ? 'text-green-600' :
                                        freshness.status === 'warning' ? 'text-yellow-600' :
                                            freshness.status === 'danger' ? 'text-orange-600' :
                                                'text-red-600'
                                    }`}>
                                    {freshness.days > 0 ? `${freshness.days}일 남음` : '유통기한 만료'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${freshness.percentage}%` }}
                                    className={`h-full rounded-full ${freshness.status === 'fresh' ? 'bg-green-500' :
                                            freshness.status === 'warning' ? 'bg-yellow-500' :
                                                freshness.status === 'danger' ? 'bg-orange-500' :
                                                    'bg-red-500'
                                        }`}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
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
