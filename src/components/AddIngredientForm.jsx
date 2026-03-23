import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

const AddIngredientForm = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        location: 'refrigerated',
        processingState: '원물',
        expiryDate: '',
        icon: 'square'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.quantity && formData.expiryDate) {
            onAdd({
                ...formData,
                id: Date.now().toString(),
                addedDate: new Date().toISOString().split('T')[0]
            });
            onClose();
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">식재료 추가</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                재료명 *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pastel-purple focus:outline-none transition-colors"
                                placeholder="예: 소고기"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                수량 *
                            </label>
                            <input
                                type="text"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pastel-purple focus:outline-none transition-colors"
                                placeholder="예: 300g"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                보관 위치 *
                            </label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pastel-purple focus:outline-none transition-colors"
                            >
                                <option value="refrigerated">냉장</option>
                                <option value="frozen">냉동</option>
                                <option value="room">실온</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                손질 상태 *
                            </label>
                            <select
                                name="processingState"
                                value={formData.processingState}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pastel-purple focus:outline-none transition-colors"
                            >
                                <option value="원물">원물</option>
                                <option value="소분">소분</option>
                                <option value="손질">손질</option>
                                <option value="완제품">완제품</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                유통기한 *
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pastel-purple focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Plus size={20} />
                            추가하기
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddIngredientForm;
