import { motion } from 'framer-motion';

const StatsDisplay = ({ level, xp, maxXp, coins }) => {
    const xpPercentage = (xp / maxXp) * 100;

    return (
        <div className="w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-white drop-shadow-lg">Lv. {level}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                    <span className="text-2xl">🪙</span>
                    <span className="text-xl font-bold text-yellow-600">{coins}</span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-sm font-semibold text-white drop-shadow">
                    <span>경험치</span>
                    <span>{xp} / {maxXp}</span>
                </div>
                <div className="w-full h-6 bg-white/40 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className="h-full bg-gradient-to-r from-pastel-purple via-pastel-blue to-pastel-green shadow-lg"
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
