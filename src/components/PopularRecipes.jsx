import { motion } from 'framer-motion';
import { Heart, MessageCircle, TrendingUp } from 'lucide-react';

const PopularRecipes = ({ posts = [] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="text-slate-900" />
        <h2 className="text-xl font-bold text-slate-900">지금 반응 좋은 레시피</h2>
      </div>

      {posts.length === 0 ? (
        <div className="section-card px-6 py-12 text-center text-slate-500">아직 인기 게시물이 없어요.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">🖼️</div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                <div className="absolute left-3 top-3">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {post.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-white">
                  <div className="flex items-center gap-1">
                    <Heart size={14} className="fill-white/20" />
                    <span>{post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} className="fill-white/20" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-tight text-slate-800 transition-colors hover:text-slate-900">
                  {post.title}
                </h3>

                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs">
                    {post.userAvatar}
                  </div>
                  <span className="truncate text-xs font-medium text-slate-500">{post.username}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularRecipes;
