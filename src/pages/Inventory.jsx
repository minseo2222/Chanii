import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package } from 'lucide-react';
import IngredientCard from '../components/IngredientCard';
import AddIngredientForm from '../components/AddIngredientForm';
import IngredientDetailModal from '../components/IngredientDetailModal';

const Inventory = ({ inventory, onAddIngredient, onUpdateIngredient, onDeleteIngredient, onToggleFreeze, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('refrigerated');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    const tabs = [
        { id: 'refrigerated', label: '냉장', icon: '🧊' },
        { id: 'frozen', label: '냉동', icon: '❄️' },
        { id: 'room', label: '실온', icon: '🌡️' }
    ];

    const filteredItems = inventory.filter(item => item.location === activeTab);

    return (
        <div className="min-h-screen p-6 pb-20">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
                        인벤토리
                    </h1>

                    <motion.button
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={20} />
                        추가
                    </motion.button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 bg-white/30 backdrop-blur-sm rounded-full p-2">
                    {tabs.map(tab => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 tab ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </motion.button>
                    ))}
                </div>

                {/* Inventory Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filteredItems.length === 0 ? (
                            <motion.div
                                className="card text-center py-16"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                            >
                                <Package className="mx-auto mb-4 text-gray-400" size={64} />
                                <h3 className="text-xl font-bold text-gray-600 mb-2">
                                    비어있습니다
                                </h3>
                                <p className="text-gray-500">
                                    {activeTab === 'refrigerated' && '냉장실이 비어있어요'}
                                    {activeTab === 'frozen' && '냉동실이 비어있어요'}
                                    {activeTab === 'room' && '실온 보관 식재료가 없어요'}
                                </p>
                                <motion.button
                                    onClick={() => setShowAddForm(true)}
                                    className="btn-primary mt-4 inline-flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Plus size={20} />
                                    식재료 추가하기
                                </motion.button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedIngredient(item)}
                                        className="cursor-pointer"
                                    >
                                        <IngredientCard
                                            ingredient={item}
                                            onToggleFreeze={onToggleFreeze}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Tips */}
                <motion.div
                    className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="font-bold text-lg mb-2">💡 팁</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• 카드를 클릭하면 상세 정보를 볼 수 있어요</li>
                        <li>• 상세 화면에서 재료를 수정하거나 삭제할 수 있어요</li>
                        <li>• 냉장 ↔ 냉동 버튼으로 쉽게 이동할 수 있어요</li>
                    </ul>
                </motion.div>
            </div>

            {/* Add Ingredient Form Modal */}
            {showAddForm && (
                <AddIngredientForm
                    onAdd={onAddIngredient}
                    onClose={() => setShowAddForm(false)}
                />
            )}

            {/* Ingredient Detail Modal */}
            <AnimatePresence>
                {selectedIngredient && (
                    <IngredientDetailModal
                        ingredient={selectedIngredient}
                        onClose={() => setSelectedIngredient(null)}
                        onUpdate={onUpdateIngredient}
                        onDelete={onDeleteIngredient}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;

