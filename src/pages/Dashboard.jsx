import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, History, Trophy, User } from 'lucide-react';
import ChanCharacter from '../components/ChanCharacter';
import StatsDisplay from '../components/StatsDisplay';
import CookingHistoryModal from '../components/CookingHistoryModal';
import { calculateFreshness } from '../data/mockInventory';

const Dashboard = ({ userStats, inventory, cookingHistory = [], onNavigate, onViewRecipe, onSetRecipeImage, recipeOverrides = {} }) => {
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    // Determine Chan-i's mood based on inventory
    const getCharacterMood = () => {
        const expiringSoon = inventory.filter(item => {
            const freshness = calculateFreshness(item.expiryDate);
            return freshness.status === 'danger' || freshness.status === 'expired';
        });

        const frozenItems = inventory.filter(item => item.location === 'frozen');

        if (expiringSoon.length > 0) return 'worried';
        if (frozenItems.length > inventory.length * 0.5) return 'cold';
        return 'happy';
    };

    const getCharacterMessage = () => {
        const mood = getCharacterMood();
        const expiringSoon = inventory.filter(item => {
            const freshness = calculateFreshness(item.expiryDate);
            return freshness.status === 'danger' || freshness.status === 'expired';
        });

        if (mood === 'worried' && expiringSoon.length > 0) {
            return `주인님, ${expiringSoon[0].name}이(가) 곧 위험해요! 😰`;
        }
        if (mood === 'cold') {
            return '냉동실이 꽉 차있어요! 뭔가 요리해볼까요? 🥶';
        }
        return '오늘도 좋은 하루 보내세요, 주인님! 😊';
    };

    const mood = getCharacterMood();
    const message = getCharacterMessage();

    // Get items expiring in next 3 days
    const urgentItems = inventory.filter(item => {
        const freshness = calculateFreshness(item.expiryDate);
        return freshness.status === 'danger' || freshness.status === 'expired';
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-20 relative">
            {/* User Profile (Top Right) */}
            <div className="absolute top-6 right-6 z-10">
                <div className="w-12 h-12 rounded-full bg-white/50 backdrop-blur border border-white shadow-sm flex items-center justify-center overflow-hidden">
                    {userStats.profileImage ? (
                        <img src={userStats.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="text-gray-500" />
                    )}
                </div>
            </div>

            <motion.div
                className="w-full max-w-2xl space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Title */}
                <motion.h1
                    className="text-5xl font-bold text-center text-white drop-shadow-lg"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    찬이 - 냉장고 가이드
                </motion.h1>

                {/* Chan-i Character */}
                <div className="flex justify-center">
                    <ChanCharacter mood={mood} message={message} />
                </div>

                {/* Stats */}
                <div className="flex justify-center">
                    <StatsDisplay
                        level={userStats.level}
                        xp={userStats.xp}
                        maxXp={userStats.maxXp}
                        coins={userStats.coins}
                    />
                </div>

                {/* Urgent Items Alert */}
                {urgentItems.length > 0 && (
                    <motion.div
                        className="bg-red-100 border-2 border-red-400 rounded-2xl p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-bold text-red-800 mb-1">긴급 알림!</h3>
                                <p className="text-red-700">
                                    {urgentItems.length}개의 식재료가 곧 유통기한이 지나요!
                                </p>
                                <ul className="mt-2 space-y-1">
                                    {urgentItems.slice(0, 3).map(item => (
                                        <li key={item.id} className="text-sm text-red-600">
                                            • {item.name} ({calculateFreshness(item.expiryDate).days > 0
                                                ? `${calculateFreshness(item.expiryDate).days}일 남음`
                                                : '기한 만료'})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-pastel-purple">
                            {inventory.filter(i => i.location === 'refrigerated').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">냉장 보관</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-cyan-600">
                            {inventory.filter(i => i.location === 'frozen').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">냉동 보관</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-amber-600">
                            {inventory.filter(i => i.location === 'room').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">실온 보관</div>
                    </div>
                </div>

                {/* Open History Button */}
                <motion.button
                    onClick={() => setShowHistoryModal(true)}
                    className="w-full bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border-2 border-white flex items-center justify-between group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pastel-purple/20 rounded-full flex items-center justify-center text-pastel-purple">
                            <History size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg text-gray-800">나의 요리 일지</h3>
                            <p className="text-sm text-gray-500">지금까지 {cookingHistory.length}번 요리했어요!</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-full p-2 group-hover:bg-pastel-purple group-hover:text-white transition-colors">
                        <Trophy size={20} />
                    </div>
                </motion.button>
            </motion.div>

            {/* History Modal */}
            {showHistoryModal && (
                <CookingHistoryModal
                    history={cookingHistory}
                    onClose={() => setShowHistoryModal(false)}
                    onViewRecipe={onViewRecipe}
                    onSetRecipeImage={onSetRecipeImage}
                    recipeOverrides={recipeOverrides} // Passed down
                />
            )}
        </div>
    );
};

export default Dashboard;
