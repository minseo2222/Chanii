import { motion } from 'framer-motion';

const StatsDisplay = ({ level, xp, maxXp, coins }) => {
  const xpPercentage = Math.min(100, Math.max(0, (xp / Math.max(maxXp, 1)) * 100));

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-sm">
          <span className="text-2xl font-bold">Lv. {level}</span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <span className="text-xl">🪙</span>
          <span className="text-lg font-bold text-amber-700">{coins}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
          <span>경험치</span>
          <span>
            {xp} / {maxXp}
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
