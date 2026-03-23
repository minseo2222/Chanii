import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ShortsFeed from '../components/ShortsFeed';
import CommunityBoard from '../components/CommunityBoard';

const Community = ({ inventory, posts = [], shorts = [], onOpenUpload }) => {
    const [activeTab, setActiveTab] = useState('shorts');

    const tabs = [
        { id: 'shorts', label: '쇼츠' },
        { id: 'all', label: '전체' },
        { id: 'popular', label: '인기' }
    ];

    const popularPosts = posts.filter((post) => post.likes >= 100);

    return (
        <div className="min-h-screen pb-20">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-200">
                <div className="max-w-screen-xl mx-auto px-4 py-4">
                    <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
                        커뮤니티
                    </h1>
                    <div className="flex gap-2 justify-center">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`tab ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto">
                {activeTab === 'shorts' && <ShortsFeed inventory={inventory} shorts={shorts} />}

                {activeTab === 'all' && (
                    <div className="p-4">
                        <div className="mb-4 text-sm text-gray-500 font-medium px-2">
                            자유롭게 레시피를 공유하는 공간이에요.
                        </div>
                        <CommunityBoard posts={posts} />
                    </div>
                )}

                {activeTab === 'popular' && (
                    <div className="p-4">
                        <div className="mb-4 text-sm text-gray-500 font-medium px-2">
                            지금 가장 반응이 좋은 레시피들이에요.
                        </div>
                        <CommunityBoard posts={popularPosts} />
                    </div>
                )}
            </div>

            <motion.button
                onClick={() => onOpenUpload?.()}
                className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-pastel-purple to-pastel-blue text-white rounded-full shadow-lg flex items-center justify-center z-40"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <Plus size={28} strokeWidth={3} />
            </motion.button>
        </div>
    );
};

export default Community;
