import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, BookOpen, ChevronRight, Hash, Image as ImageIcon, CheckCircle } from 'lucide-react';

const CookingHistoryModal = ({ history, onClose, onViewRecipe, onSetRecipeImage, recipeOverrides = {} }) => {
    const [activeTab, setActiveTab] = useState('recent');
    const [selectedItem, setSelectedItem] = useState(null);

    // Calculate Collection Stats
    const uniqueRecipes = Array.from(new Set(history.map(item => item.recipeId))).filter(Boolean);
    const collectionCount = uniqueRecipes.length;

    // Group unique recipes by category
    const collectionByCategory = history.reduce((acc, item) => {
        if (!item.recipeId) return acc;
        if (!acc[item.category]) acc[item.category] = new Set();
        acc[item.category].add(item.recipeId); // Use Set to track unique IDs
        return acc;
    }, {});

    // Get all photos for the selected recipe (Album)
    const getRecipeAlbum = () => {
        if (!selectedItem || !selectedItem.recipeId) return [];
        return history.filter(h => h.recipeId === selectedItem.recipeId && h.thumbnail);
    };

    const albumPhotos = getRecipeAlbum();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <BookOpen className="text-pastel-purple" />
                                나의 요리 일지
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">내가 만든 요리들의 기록입니다.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-6 pt-4 gap-4 border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('recent')}
                            className={`pb-3 px-2 font-bold text-lg transition-colors relative ${activeTab === 'recent' ? 'text-pastel-purple' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            최신 기록
                            {activeTab === 'recent' && (
                                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-pastel-purple rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('collection')}
                            className={`pb-3 px-2 font-bold text-lg transition-colors relative ${activeTab === 'collection' ? 'text-pastel-purple' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            요리 도감 ({collectionCount})
                            {activeTab === 'collection' && (
                                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-pastel-purple rounded-t-full" />
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                        {activeTab === 'recent' && (
                            <div className="space-y-4">
                                {history.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400">
                                        <div className="text-4xl mb-4">🍳</div>
                                        <p>아직 요리 기록이 없어요.</p>
                                        <p className="text-sm">레시피를 보고 요리를 만들어보세요!</p>
                                    </div>
                                ) : (
                                    history.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex gap-4"
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            {/* Thumbnail Placeholder */}
                                            <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden">
                                                {item.thumbnail ? (
                                                    <img src={item.thumbnail} className="w-full h-full object-cover" />
                                                ) : '🍽️'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.title}</h3>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-full">{item.date}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                                <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-pastel-purple">
                                                    <span className="bg-pastel-purple/10 px-2 py-1 rounded-md">{item.category}</span>
                                                    {item.recipeId && <span>#{item.recipeId}</span>}
                                                </div>
                                            </div>
                                            <div className="self-center text-gray-300">
                                                <ChevronRight />
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'collection' && (
                            <div className="space-y-8">
                                <div className="bg-gradient-to-r from-pastel-purple to-pastel-blue p-6 rounded-3xl text-white shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                                            🏆
                                        </div>
                                        <div>
                                            <p className="font-medium text-white/80">총 수집한 요리</p>
                                            <h3 className="text-3xl font-bold">{collectionCount}개</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Categories */}
                                {Object.entries(collectionByCategory).map(([category, idSet]) => (
                                    <div key={category}>
                                        <h3 className="font-bold text-lg text-gray-700 mb-3 flex items-center gap-2">
                                            <Hash size={20} className="text-pastel-purple" />
                                            {category} <span className="text-sm font-normal text-gray-500">({idSet.size}개)</span>
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {Array.from(idSet).map(id => {
                                                // Find details from history (take first occurrence)
                                                const record = history.find(h => h.recipeId === id);
                                                // Use override image if available, else history thumbnail
                                                const displayImage = recipeOverrides[id] || record?.thumbnail;

                                                return (
                                                    <div key={id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedItem(record)}>
                                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                                                            {displayImage ? (
                                                                <img src={displayImage} className="w-full h-full object-cover" />
                                                            ) : '🍽️'}
                                                        </div>
                                                        <span className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight px-1">{record?.title || '요리'}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {collectionCount === 0 && (
                                    <div className="text-center py-10 text-gray-400">
                                        아직 수집한 도감이 없어요.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Detail Popup with Album */}
                {selectedItem && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[1px]" onClick={() => setSelectedItem(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                <X size={20} />
                            </button>

                            {/* Main Image (History Record) */}
                            <div className="w-full h-56 bg-gray-200 rounded-2xl mb-4 overflow-hidden flex items-center justify-center text-5xl">
                                {selectedItem.thumbnail ? (
                                    <img src={selectedItem.thumbnail} className="w-full h-full object-cover" />
                                ) : '🍱'}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedItem.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <Calendar size={14} />
                                {selectedItem.date}
                                <span className="mx-1">•</span>
                                <span>{selectedItem.category}</span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm mb-6">
                                "{selectedItem.description}"
                            </div>

                            {/* Album Section */}
                            {albumPhotos.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <ImageIcon size={18} className="text-pastel-purple" />
                                        요리 앨범 ({albumPhotos.length})
                                        <span className="text-xs font-normal text-gray-400 ml-auto">눌러서 대표 사진 설정</span>
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {albumPhotos.map((photo) => {
                                            const isCurrentProfile = recipeOverrides[photo.recipeId] === photo.thumbnail;
                                            return (
                                                <motion.div
                                                    key={photo.id}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 cursor-pointer relative ${isCurrentProfile ? 'border-pastel-purple' : 'border-transparent'
                                                        }`}
                                                    onClick={() => {
                                                        onSetRecipeImage?.(photo.recipeId, photo.thumbnail);
                                                        alert('대표 사진이 변경되었습니다!');
                                                    }}
                                                >
                                                    <img src={photo.thumbnail} alt="History" className="w-full h-full object-cover" />
                                                    {isCurrentProfile && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <CheckCircle className="text-white drop-shadow-md" size={24} />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {selectedItem.recipeId && (
                                <button
                                    onClick={() => {
                                        onViewRecipe?.(selectedItem.recipeId);
                                        setSelectedItem(null);
                                        onClose();
                                    }}
                                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                                >
                                    <BookOpen size={18} />
                                    레시피로 이동
                                </button>
                            )}
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default CookingHistoryModal;
