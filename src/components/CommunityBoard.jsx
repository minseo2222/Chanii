import { motion } from 'framer-motion';
import { MessageCircle, Heart } from 'lucide-react';

const CommunityBoard = ({ posts }) => {
    return (
        <div className="space-y-3 p-4">
            {posts.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer border border-gray-100"
                >
                    <div className="flex gap-4">
                        {post.thumbnail && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 inline-block">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800 line-clamp-1 text-lg mb-1">{post.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {post.description || `${post.title} 레시피를 공유했어요.`}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-600">{post.username}</span>
                                    <span>•</span>
                                    <span>{post.timeAgo || '방금 전'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-red-400">
                                        <Heart size={14} className={post.likes > 0 ? 'fill-red-400' : ''} />
                                        <span>{post.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-400">
                                        <MessageCircle size={14} />
                                        <span>{post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default CommunityBoard;
