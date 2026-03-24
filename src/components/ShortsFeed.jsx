import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Heart, MessageCircle, Share2, ShoppingBag, X } from 'lucide-react';
import { normalizeText } from '../lib/recipeMatcher';

const ShortsFeed = ({ inventory, shorts: initialShorts = [] }) => {
  const [shorts, setShorts] = useState(initialShorts);
  const [selectedShort, setSelectedShort] = useState(null);

  useEffect(() => {
    setShorts(initialShorts);
  }, [initialShorts]);

  const handleLike = (id) => {
    setShorts((prev) =>
      prev.map((short) =>
        short.id === id
          ? { ...short, isLiked: !short.isLiked, likes: short.isLiked ? short.likes - 1 : short.likes + 1 }
          : short
      )
    );
  };

  const checkIngredientAvailability = (ingredientName) =>
    inventory?.some((item) => normalizeText(item.name).includes(normalizeText(ingredientName)));

  if (!shorts.length) {
    return (
      <div className="section-card px-6 py-16 text-center">
        <h3 className="text-xl font-bold text-slate-900">아직 올라온 쇼츠가 없어요</h3>
        <p className="mt-2 text-slate-500">짧은 요리 팁이나 완성 사진을 올리면 발견성이 크게 좋아져요.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md space-y-4">
        {shorts.map((short) => (
          <section key={short.id} className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-lg">
            <div className="absolute inset-0">
              <img src={short.thumbnail} alt={short.title} className="h-full w-full object-cover opacity-75" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/80" />
            </div>

            <div className="relative flex min-h-[520px] flex-col justify-between p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-sm font-bold text-white backdrop-blur">
                    {short.userAvatar || '찬'}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{short.username || '찬이 사용자'}</p>
                    <p className="text-xs text-white/70">요리 쇼츠</p>
                  </div>
                </div>
                <button type="button" className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900">
                  팔로우
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="pr-8 text-2xl font-bold text-white drop-shadow-sm">{short.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {short.ingredients.slice(0, 4).map((ingredient, index) => (
                      <span
                        key={`${short.id}-${ingredient.name}-${index}`}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur"
                      >
                        {ingredient.name}
                      </span>
                    ))}
                    {short.ingredients.length > 4 ? (
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur">
                        +{short.ingredients.length - 4}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5 text-white">
                    <button type="button" onClick={() => handleLike(short.id)} className="flex items-center gap-2">
                      <Heart
                        size={22}
                        className={short.isLiked ? 'fill-red-400 text-red-400' : 'text-white'}
                        strokeWidth={2}
                      />
                      <span className="text-sm font-semibold">{short.likes}</span>
                    </button>
                    <button type="button" className="flex items-center gap-2">
                      <MessageCircle size={22} />
                      <span className="text-sm font-semibold">{short.comments}</span>
                    </button>
                    <button type="button" className="flex items-center gap-2">
                      <Share2 size={22} />
                      <span className="text-sm font-semibold">공유</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedShort(short)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900"
                >
                  <ShoppingBag size={18} />
                  내 재료로 가능한지 보기
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {selectedShort ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedShort(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              className="modal-content w-full max-w-md p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Ingredient Check</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">재료 체크</h3>
                  <p className="mt-2 text-sm text-slate-500">현재 냉장고와 비교해서 바로 가능한지 보여줘요.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedShort(null)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {selectedShort.ingredients.map((ingredient, index) => {
                  const hasIngredient = checkIngredientAvailability(ingredient.name);

                  return (
                    <div
                      key={`${selectedShort.id}-${ingredient.name}-${index}`}
                      className={`flex items-center justify-between rounded-2xl border p-4 ${
                        hasIngredient ? 'border-emerald-100 bg-emerald-50' : 'border-amber-100 bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            hasIngredient ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {hasIngredient ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{ingredient.name}</p>
                          <p className="text-xs text-slate-500">{ingredient.amount}</p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          hasIngredient ? 'bg-white text-emerald-700' : 'bg-white text-amber-700'
                        }`}
                      >
                        {hasIngredient ? '보유 중' : '추가 필요'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button type="button" onClick={() => setSelectedShort(null)} className="btn-primary mt-6 w-full">
                확인 완료
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ShortsFeed;
