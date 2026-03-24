import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';

const CommunityBoard = ({ posts = [] }) => {
  if (posts.length === 0) {
    return (
      <div className="section-card px-6 py-16 text-center">
        <h3 className="text-xl font-bold text-slate-900">아직 올라온 글이 없어요</h3>
        <p className="mt-2 text-slate-500">첫 후기나 요리 기록을 올리면 커뮤니티 흐름이 시작돼요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="section-card p-4"
        >
          <div className="flex gap-4">
            {post.thumbnail ? (
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                <img src={post.thumbnail} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-lg font-bold text-slate-900">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {post.description || `${post.title} 이야기를 커뮤니티에 공유했어요.`}
                  </p>
                </div>
                {post.category ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{post.category}</span>
                ) : null}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-semibold text-slate-700">{post.username || '찬이 사용자'}</span>
                  <span>•</span>
                  <span>{post.timeAgo || '방금 전'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Heart size={14} className={post.likes > 0 ? 'fill-red-400 text-red-400' : 'text-slate-400'} />
                    {post.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {post.comments || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default CommunityBoard;
