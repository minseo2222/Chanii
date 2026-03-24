import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import CommunityBoard from '../components/CommunityBoard';
import ShortsFeed from '../components/ShortsFeed';

const tabs = [
  { id: 'shorts', label: '쇼츠', description: '짧은 요리 팁과 빠른 발견 흐름' },
  { id: 'all', label: '전체 글', description: '후기, 팁, 자취 레시피를 한눈에' },
  { id: 'popular', label: '인기', description: '반응이 좋은 콘텐츠만 빠르게' }
];

const Community = ({ inventory, posts = [], shorts = [], onOpenUpload }) => {
  const [activeTab, setActiveTab] = useState('shorts');

  const popularPosts = useMemo(() => posts.filter((post) => post.likes >= 100), [posts]);

  const summary = useMemo(
    () => ({
      shorts: shorts.length,
      posts: posts.length,
      popular: popularPosts.length
    }),
    [popularPosts.length, posts.length, shorts.length]
  );

  return (
    <div className="page-shell pb-24">
      <div className="layout-container space-y-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="section-card p-6">
            <p className="text-sm font-semibold text-slate-500">Community Layer</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">커뮤니티</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              발견성은 쇼츠처럼 빠르게, 신뢰감은 게시판처럼 차분하게 가져가는 구조로 정리했어요.
            </p>
          </div>

          <div className="section-card p-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              <Sparkles size={12} />
              Community Health
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">쇼츠</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{summary.shorts}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">게시글</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{summary.posts}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">인기 글</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{summary.popular}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section-card p-3">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`tab min-w-[160px] text-left ${activeTab === tab.id ? 'tab-active shadow-sm' : 'tab-inactive'}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div>{tab.label}</div>
                <div className={`mt-1 text-xs ${activeTab === tab.id ? 'text-slate-300' : 'text-slate-500'}`}>{tab.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {activeTab === 'shorts' ? <ShortsFeed inventory={inventory} shorts={shorts} /> : null}

        {activeTab === 'all' ? (
          <div className="space-y-4">
            <div className="px-1 text-sm text-slate-500">자취 레시피 후기, 실패 방지 팁, 추천 메뉴 공유를 모아봤어요.</div>
            <CommunityBoard posts={posts} />
          </div>
        ) : null}

        {activeTab === 'popular' ? (
          <div className="space-y-4">
            <div className="px-1 text-sm text-slate-500">좋아요가 많이 쌓인 글만 모아서 빠르게 살펴볼 수 있어요.</div>
            <CommunityBoard posts={popularPosts} />
          </div>
        ) : null}
      </div>

      <motion.button
        type="button"
        onClick={() => onOpenUpload?.()}
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        <Plus size={26} strokeWidth={3} />
      </motion.button>
    </div>
  );
};

export default Community;
