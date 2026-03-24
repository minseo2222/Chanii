import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Calendar, CheckCircle2, Hash, Image as ImageIcon, X } from 'lucide-react';

const CookingHistoryModal = ({ history = [], onClose, onViewRecipe, onSetRecipeImage, recipeOverrides = {} }) => {
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedItem, setSelectedItem] = useState(null);

  const uniqueRecipes = useMemo(
    () => Array.from(new Set(history.map((item) => item.recipeId).filter(Boolean))),
    [history]
  );

  const collectionByCategory = useMemo(
    () =>
      history.reduce((accumulator, item) => {
        if (!item.recipeId) return accumulator;
        if (!accumulator[item.category]) accumulator[item.category] = [];
        if (!accumulator[item.category].some((entry) => entry.recipeId === item.recipeId)) {
          accumulator[item.category].push(item);
        }
        return accumulator;
      }, {}),
    [history]
  );

  const selectedAlbumPhotos = useMemo(() => {
    if (!selectedItem?.recipeId) return [];
    return history.filter((entry) => entry.recipeId === selectedItem.recipeId && entry.thumbnail);
  }, [history, selectedItem]);

  return (
    <AnimatePresence>
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
          className="modal-content flex h-[85vh] w-full max-w-3xl flex-col"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
            <div>
              <div className="flex items-center gap-2 text-slate-900">
                <BookOpen size={20} />
                <h2 className="text-2xl font-bold">나의 요리 기록</h2>
              </div>
              <p className="mt-2 text-sm text-slate-500">최근 요리 흐름과 레시피 컬렉션을 함께 볼 수 있어요.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 transition-colors hover:bg-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-4 border-b border-slate-200 px-6 pt-4">
            {[
              { id: 'recent', label: '최근 기록' },
              { id: 'collection', label: `레시피 컬렉션 (${uniqueRecipes.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 text-lg font-bold transition-colors ${
                  activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id ? <motion.div layoutId="history-tab" className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-slate-900" /> : null}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50/60 p-6">
            {activeTab === 'recent' ? (
              history.length === 0 ? (
                <div className="section-card px-6 py-16 text-center">
                  <h3 className="text-xl font-bold text-slate-900">아직 저장된 요리 기록이 없어요</h3>
                  <p className="mt-2 text-slate-500">레시피를 하나 완성하면 이곳에서 다시 볼 수 있어요.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <motion.button
                      key={item.id}
                      layout
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="section-card flex w-full items-center gap-4 p-4 text-left"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-3xl">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <ImageIcon />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="line-clamp-1 text-lg font-bold text-slate-900">{item.title}</h3>
                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{item.date}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                          {item.category ? <span className="rounded-full bg-slate-100 px-3 py-1">{item.category}</span> : null}
                          {item.recipeId ? <span className="rounded-full bg-slate-100 px-3 py-1">레시피 #{item.recipeId}</span> : null}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )
            ) : (
              <div className="space-y-8">
                <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-sm">
                  <p className="text-sm text-slate-300">누적 컬렉션</p>
                  <p className="mt-2 text-3xl font-bold">{uniqueRecipes.length}개 레시피</p>
                  <p className="mt-2 text-sm text-slate-300">카테고리별로 다시 보기 좋게 묶어두었어요.</p>
                </div>

                {Object.entries(collectionByCategory).length === 0 ? (
                  <div className="section-card px-6 py-16 text-center text-slate-500">아직 저장된 컬렉션이 없어요.</div>
                ) : (
                  Object.entries(collectionByCategory).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
                        <Hash size={18} />
                        {category}
                        <span className="text-sm font-normal text-slate-500">({items.length})</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {items.map((item) => {
                          const displayImage = recipeOverrides[item.recipeId] || item.thumbnail;

                          return (
                            <button
                              key={`${category}-${item.recipeId}`}
                              type="button"
                              className="section-card flex flex-col items-center gap-3 p-4 text-center"
                              onClick={() => setSelectedItem(item)}
                            >
                              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                                {displayImage ? (
                                  <img src={displayImage} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                                ) : (
                                  <ImageIcon size={18} />
                                )}
                              </div>
                              <span className="line-clamp-2 text-sm font-semibold text-slate-800">{item.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>

        {selectedItem ? (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 p-4 backdrop-blur-[1px]" onClick={() => setSelectedItem(null)}>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="modal-content w-full max-w-lg p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>

              <div className="mb-4 flex h-56 w-full items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-4xl text-slate-400">
                {selectedItem.thumbnail ? (
                  <img src={selectedItem.thumbnail} alt={selectedItem.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <ImageIcon />
                )}
              </div>

              <h3 className="text-2xl font-bold text-slate-900">{selectedItem.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} />
                  {selectedItem.date}
                </span>
                {selectedItem.category ? <span>• {selectedItem.category}</span> : null}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                {selectedItem.description}
              </div>

              {selectedAlbumPhotos.length > 1 ? (
                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={16} />
                    같은 레시피의 기록 사진
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedAlbumPhotos.slice(0, 6).map((entry) => (
                      <div key={entry.id} className="h-20 overflow-hidden rounded-2xl bg-slate-100">
                        <img src={entry.thumbnail} alt={entry.title} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {selectedItem.recipeId ? (
                  <button
                    type="button"
                    onClick={() => {
                      onViewRecipe?.(selectedItem.recipeId);
                      setSelectedItem(null);
                      onClose?.();
                    }}
                    className="btn-primary flex-1"
                  >
                    레시피 다시 보기
                  </button>
                ) : null}
                {selectedItem.thumbnail && selectedItem.recipeId ? (
                  <button
                    type="button"
                    onClick={() => onSetRecipeImage?.(selectedItem.recipeId, selectedItem.thumbnail)}
                    className="btn-secondary flex-1"
                  >
                    대표 사진으로 지정
                  </button>
                ) : null}
              </div>
            </motion.div>
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
};

export default CookingHistoryModal;
