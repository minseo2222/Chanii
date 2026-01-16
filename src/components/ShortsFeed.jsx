import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, X, ShoppingBag } from 'lucide-react';
import { mockShortsData } from '../data/mockCommunityData';

const ShortsFeed = ({ inventory }) => {
    const [shorts, setShorts] = useState(mockShortsData);
    const [selectedShort, setSelectedShort] = useState(null);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const containerRef = useRef(null);

    const handleLike = (id) => {
        setShorts(prev => prev.map(short =>
            short.id === id
                ? { ...short, isLiked: !short.isLiked, likes: short.isLiked ? short.likes - 1 : short.likes + 1 }
                : short
        ));
    };

    const handleCheckIngredients = (short) => {
        setSelectedShort(short);
        setShowIngredientModal(true);
    };

    const checkIngredientAvailability = (ingredientName) => {
        return inventory?.some(item =>
            item.name.toLowerCase().includes(ingredientName.toLowerCase())
        );
    };

    return (
        <div className="flex justify-center bg-black min-h-screen">
            {/* Main Feed Container - Snap Scrolling */}
            <div
                ref={containerRef}
                className="w-full max-w-md h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-gray-900"
            >
                {shorts.map((short) => (
                    <div
                        key={short.id}
                        className="relative w-full h-full snap-start snap-always"
                    >
                        {/* Video Layer (Image for mock) */}
                        <img
                            src={short.thumbnail}
                            alt={short.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

                        {/* Top: User Info */}
                        <div className="absolute top-6 left-4 flex items-center gap-3 z-10">
                            <div className="w-10 h-10 border-2 border-white rounded-full overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-lg text-white font-bold">
                                    {short.userAvatar}
                                </div>
                            </div>
                            <span className="text-white font-bold text-shadow shadow-black/50">
                                {short.username}
                            </span>
                            <button className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                                팔로우
                            </button>
                        </div>

                        {/* Right: Interaction Buttons */}
                        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-10">
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    onClick={() => handleLike(short.id)}
                                    className="p-2 transition-transform active:scale-75"
                                >
                                    <Heart
                                        size={36}
                                        fill={short.isLiked ? "#ef4444" : "transparent"}
                                        stroke={short.isLiked ? "#ef4444" : "white"}
                                        strokeWidth={2}
                                        className="drop-shadow-lg"
                                    />
                                </button>
                                <span className="text-white text-xs font-bold shadow-black/50 drop-shadow-md">
                                    {short.likes}
                                </span>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <button className="p-2 transition-transform active:scale-90">
                                    <MessageCircle size={34} stroke="white" strokeWidth={2} className="drop-shadow-lg" />
                                </button>
                                <span className="text-white text-xs font-bold shadow-black/50 drop-shadow-md">
                                    {short.comments}
                                </span>
                            </div>

                            <button className="p-2 transition-transform active:scale-90">
                                <Share2 size={34} stroke="white" strokeWidth={2} className="drop-shadow-lg" />
                            </button>

                            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden animate-spin-slow mt-2">
                                <div className="w-full h-full bg-gray-800" />
                            </div>
                        </div>

                        {/* Bottom: Info & Ingredients */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 z-10 bg-gradient-to-t from-black/90 to-transparent pt-20">
                            <h3 className="text-white text-lg font-bold mb-3 drop-shadow-md line-clamp-2 pr-12">
                                {short.title}
                            </h3>

                            {/* Ingredient Chips */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {short.ingredients.slice(0, 3).map((ing, i) => (
                                    <span key={i} className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs">
                                        {ing.name}
                                    </span>
                                ))}
                                {short.ingredients.length > 3 && (
                                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs">
                                        +{short.ingredients.length - 3}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => handleCheckIngredients(short)}
                                className="w-full bg-pastel-purple hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                            >
                                <ShoppingBag size={18} />
                                이 재료로 요리하기
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ingredient Modal */}
            <AnimatePresence>
                {showIngredientModal && selectedShort && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowIngredientModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">재료 체크</h3>
                                    <p className="text-gray-500 text-sm">내 냉장고와 비교해볼게요!</p>
                                </div>
                                <button
                                    onClick={() => setShowIngredientModal(false)}
                                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                                {selectedShort.ingredients.map((ing, idx) => {
                                    const hasIngredient = checkIngredientAvailability(ing.name);
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex items-center justify-between p-3 rounded-2xl border ${hasIngredient
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-orange-50 border-orange-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${hasIngredient ? 'bg-green-100' : 'bg-orange-100'
                                                    }`}>
                                                    {hasIngredient ? '🥦' : '🛒'}
                                                </div>
                                                <div>
                                                    <p className={`font-bold ${hasIngredient ? 'text-green-900' : 'text-gray-800'}`}>
                                                        {ing.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{ing.amount}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {hasIngredient ? (
                                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">보유중</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">필요함</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setShowIngredientModal(false)}
                                className="w-full mt-6 bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                            >
                                확인 완료
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShortsFeed;
