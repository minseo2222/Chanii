import { motion } from 'framer-motion';
import { Heart, MessageCircle, TrendingUp } from 'lucide-react';

const PopularRecipes = ({ posts = [] }) => {
    return (
        <div className="p-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-pastel-purple" />
                <h2 className="text-xl font-bold text-gray-800">지금 뜨는 레시피 🔥</h2>
            </div>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    아직 인기 게시물이 없어요!
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Image */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                {post.thumbnail ? (
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                        🍽️
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                {/* Category Badge */}
                                <div className="absolute top-2 left-2">
                                    <span className="bg-black/30 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/20">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Stats Overlay */}
                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs font-medium">
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

                            {/* Content */}
                            <div className="p-3">
                                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 leading-tight group-hover:text-pastel-purple transition-colors">
                                    {post.title}
                                </h3>

                                {/* User Info */}
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs border border-gray-200 overflow-hidden">
                                        {post.userAvatar}
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium truncate">{post.username}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopularRecipes;
