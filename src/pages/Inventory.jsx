import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import IngredientCard from '../components/IngredientCard';
import AddIngredientForm from '../components/AddIngredientForm';
import IngredientDetailModal from '../components/IngredientDetailModal';

const tabs = [
    { id: 'refrigerated', label: '냉장', icon: '🧊', emptyText: '냉장 칸이 비어 있어요.' },
    { id: 'frozen', label: '냉동', icon: '❄️', emptyText: '냉동 칸이 비어 있어요.' },
    { id: 'room', label: '실온', icon: '🥫', emptyText: '실온 보관 재료가 없어요.' }
];

const Inventory = ({ inventory, onAddIngredient, onUpdateIngredient, onDeleteIngredient, onToggleFreeze }) => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('refrigerated');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    useEffect(() => {
        const requestedTab = location.state?.initialTab;
        if (requestedTab && tabs.some((tab) => tab.id === requestedTab)) {
            setActiveTab(requestedTab);
        }
    }, [location.state]);

    const filteredItems = useMemo(
        () => inventory.filter((item) => item.location === activeTab),
        [inventory, activeTab]
    );

    const activeTabInfo = tabs.find((tab) => tab.id === activeTab);

    return (
        <div className="min-h-screen p-6 pb-24">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-pastel-purple mb-2">찬이 인벤토리</p>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
                            인벤토리
                        </h1>
                        <p className="text-gray-500 mt-2">
                            보관 위치별로 재료를 관리하고, 눌러서 바로 상태를 수정할 수 있어요.
                        </p>
                    </div>

                    <motion.button
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary flex items-center gap-2 self-start md:self-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={20} />
                        재료 추가
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
                    <div className="flex gap-4 bg-white/40 backdrop-blur-sm rounded-3xl p-3 overflow-x-auto">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[120px] tab ${activeTab === tab.id ? 'tab-active shadow-lg' : 'tab-inactive'}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>

                    <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-pastel-purple/15 text-pastel-purple flex items-center justify-center">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">현재 선택</p>
                                <p className="font-bold text-gray-800">{activeTabInfo?.label} 보관</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                            이 구역에 재료가 <span className="font-bold text-gray-800">{filteredItems.length}개</span> 있어요.
                        </p>
                    </div>
                </div>

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
                                    비어 있어요
                                </h3>
                                <p className="text-gray-500">
                                    {activeTabInfo?.emptyText}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.04 }}
                                        onClick={() => setSelectedIngredient(item)}
                                        className="cursor-pointer"
                                    >
                                        <IngredientCard ingredient={item} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    className="mt-2 bg-white/65 backdrop-blur-sm rounded-2xl p-6 border border-white/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="font-bold text-lg mb-2">빠른 사용 팁</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>재료 카드를 누르면 수량, 유통기한, 보관 위치를 바로 수정할 수 있어요.</li>
                        <li>냉장과 냉동 재료는 상세 창에서 한 번에 서로 이동시킬 수 있어요.</li>
                        <li>유통기한이 가까운 재료부터 먼저 요리에 사용하면 낭비를 줄일 수 있어요.</li>
                    </ul>
                </motion.div>
            </div>

            {showAddForm && (
                <AddIngredientForm
                    onAdd={onAddIngredient}
                    onClose={() => setShowAddForm(false)}
                />
            )}

            <AnimatePresence>
                {selectedIngredient && (
                    <IngredientDetailModal
                        ingredient={selectedIngredient}
                        onClose={() => setSelectedIngredient(null)}
                        onUpdate={onUpdateIngredient}
                        onDelete={onDeleteIngredient}
                        onToggleFreeze={onToggleFreeze}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
