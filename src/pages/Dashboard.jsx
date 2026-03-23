import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronRight, History, Trophy, User } from 'lucide-react';
import ChanCharacter from '../components/ChanCharacter';
import StatsDisplay from '../components/StatsDisplay';
import CookingHistoryModal from '../components/CookingHistoryModal';
import { calculateFreshness } from '../data/mockInventory';

const storageCards = [
    { id: 'refrigerated', label: '냉장 보관', shortLabel: '냉장', accent: 'text-pastel-purple', bg: 'from-white to-pastel-purple/10' },
    { id: 'frozen', label: '냉동 보관', shortLabel: '냉동', accent: 'text-cyan-600', bg: 'from-white to-cyan-100/70' },
    { id: 'room', label: '실온 보관', shortLabel: '실온', accent: 'text-amber-600', bg: 'from-white to-amber-100/70' }
];

const Dashboard = ({
    userStats,
    inventory,
    cookingHistory = [],
    onViewRecipe,
    onSetRecipeImage,
    recipeOverrides = {},
    onOpenStorageSection,
    bootstrapReady
}) => {
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const getCharacterMood = () => {
        const expiringSoon = inventory.filter((item) => {
            const freshness = calculateFreshness(item.expiryDate);
            return freshness.status === 'danger' || freshness.status === 'expired';
        });

        const frozenItems = inventory.filter((item) => item.location === 'frozen');

        if (expiringSoon.length > 0) return 'worried';
        if (frozenItems.length > inventory.length * 0.5) return 'cold';
        return 'happy';
    };

    const getCharacterMessage = () => {
        const mood = getCharacterMood();
        const expiringSoon = inventory.filter((item) => {
            const freshness = calculateFreshness(item.expiryDate);
            return freshness.status === 'danger' || freshness.status === 'expired';
        });

        if (mood === 'worried' && expiringSoon.length > 0) {
            return `주인님, ${expiringSoon[0].name} 유통기한이 가까워요!`;
        }
        if (mood === 'cold') {
            return '냉동실이 조금 꽉 찼어요. 오늘은 냉동 재료를 써볼까요?';
        }
        return '오늘도 찬이와 함께 냉장고를 깔끔하게 관리해봐요.';
    };

    const mood = getCharacterMood();
    const message = getCharacterMessage();

    const urgentItems = inventory.filter((item) => {
        const freshness = calculateFreshness(item.expiryDate);
        return freshness.status === 'danger' || freshness.status === 'expired';
    });

    const recentlyAdded = [...inventory]
        .sort((a, b) => String(b.addedDate || '').localeCompare(String(a.addedDate || '')))
        .slice(0, 3);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 relative">
            <div className="absolute top-6 right-6 z-10">
                <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur border border-white shadow-sm flex items-center justify-center overflow-hidden">
                    {userStats.profileImage ? (
                        <img
                            src={userStats.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <User className="text-gray-500" />
                    )}
                </div>
            </div>

            <motion.div
                className="w-full max-w-3xl space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center space-y-3">
                    <motion.h1
                        className="text-5xl font-bold text-white drop-shadow-lg"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        찬이 - 냉장고 가이드
                    </motion.h1>
                    <p className="text-white/90 font-medium">
                        {bootstrapReady ? '오늘의 냉장고 상태를 한눈에 확인해요.' : '찬이가 냉장고 상태를 불러오는 중이에요.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5 items-center">
                    <div className="flex justify-center">
                        <ChanCharacter mood={mood} message={message} />
                    </div>

                    <div className="space-y-4">
                        <div className="card bg-white/70 backdrop-blur-md border border-white/70">
                            <StatsDisplay
                                level={userStats.level}
                                xp={userStats.xp}
                                maxXp={userStats.maxXp}
                                coins={userStats.coins}
                            />
                        </div>

                        <div className="card bg-white/70 backdrop-blur-md border border-white/70">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-800">최근 등록 재료</h3>
                                <span className="text-xs text-gray-500">{inventory.length}개 보관 중</span>
                            </div>
                            <div className="space-y-2">
                                {recentlyAdded.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.quantity}</p>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500">{item.addedDate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {urgentItems.length > 0 && (
                    <motion.div
                        className="bg-red-100/95 border-2 border-red-300 rounded-2xl p-4 shadow-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-bold text-red-800 mb-1">긴급 알림</h3>
                                <p className="text-red-700">
                                    유통기한이 가까운 재료가 {urgentItems.length}개 있어요.
                                </p>
                                <ul className="mt-2 space-y-1">
                                    {urgentItems.slice(0, 3).map((item) => (
                                        <li key={item.id} className="text-sm text-red-600">
                                            {item.name} ({calculateFreshness(item.expiryDate).days > 0
                                                ? `${calculateFreshness(item.expiryDate).days}일 남음`
                                                : '기한 만료'})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white drop-shadow">보관 구역 바로가기</h2>
                        <p className="text-sm text-white/80">구역을 누르면 해당 인벤토리로 이동해요</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {storageCards.map((card) => {
                            const count = inventory.filter((item) => item.location === card.id).length;
                            return (
                                <motion.button
                                    key={card.id}
                                    onClick={() => onOpenStorageSection?.(card.id)}
                                    className={`text-left rounded-3xl bg-gradient-to-br ${card.bg} border border-white/80 shadow-lg p-5 hover:shadow-xl transition-all`}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className={`text-sm font-semibold ${card.accent}`}>{card.label}</p>
                                            <p className="text-3xl font-bold text-gray-800 mt-2">{count}</p>
                                            <p className="text-sm text-gray-500 mt-1">{card.shortLabel} 칸 보러 가기</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-gray-500 shadow-sm">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                <motion.button
                    onClick={() => setShowHistoryModal(true)}
                    className="w-full bg-white/85 backdrop-blur-md p-5 rounded-2xl shadow-lg border-2 border-white flex items-center justify-between group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pastel-purple/20 rounded-full flex items-center justify-center text-pastel-purple">
                            <History size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg text-gray-800">나의 요리 기록</h3>
                            <p className="text-sm text-gray-500">지금까지 {cookingHistory.length}번 요리했어요</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-full p-2 group-hover:bg-pastel-purple group-hover:text-white transition-colors">
                        <Trophy size={20} />
                    </div>
                </motion.button>
            </motion.div>

            {showHistoryModal && (
                <CookingHistoryModal
                    history={cookingHistory}
                    onClose={() => setShowHistoryModal(false)}
                    onViewRecipe={onViewRecipe}
                    onSetRecipeImage={onSetRecipeImage}
                    recipeOverrides={recipeOverrides}
                />
            )}
        </div>
    );
};

export default Dashboard;
