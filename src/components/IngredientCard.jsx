import { motion } from 'framer-motion';
import { Beef, Salad, Egg, Cookie, Apple, Milk, Fish, Square, Snowflake, Carrot } from 'lucide-react';
import { calculateFreshness } from '../data/mockInventory';

const iconMap = {
    beef: Beef,
    salad: Salad,
    egg: Egg,
    cookie: Cookie,
    apple: Apple,
    carrot: Carrot,
    milk: Milk,
    fish: Fish,
    square: Square
};

const IngredientCard = ({ ingredient }) => {
    const freshness = calculateFreshness(ingredient.expiryDate);
    const Icon = iconMap[ingredient.icon] || Square;

    const locationColors = {
        refrigerated: 'bg-blue-100 text-blue-700',
        frozen: 'bg-cyan-200 text-cyan-800',
        room: 'bg-amber-100 text-amber-700'
    };

    const locationLabels = {
        refrigerated: '냉장',
        frozen: '냉동',
        room: '실온'
    };

    const processingColors = {
        원물: 'bg-green-100 text-green-700',
        소분: 'bg-purple-100 text-purple-700',
        손질: 'bg-pink-100 text-pink-700',
        완제품: 'bg-gray-100 text-gray-700'
    };

    const freshnessLabel =
        freshness.status === 'expired'
            ? '유통기한 지남'
            : freshness.status === 'danger'
              ? '곧 만료'
              : freshness.status === 'warning'
                ? '주의'
                : '신선';

    return (
        <motion.div
            className="card relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            {ingredient.location === 'frozen' && (
                <motion.div
                    className="absolute -top-2 -right-2 bg-cyan-400 rounded-full p-2 shadow-lg"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                    <Snowflake className="text-white" size={20} />
                </motion.div>
            )}

            <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-pastel-pink to-pastel-purple p-3 rounded-xl">
                    <Icon className="text-white" size={32} />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{ingredient.name}</h3>
                    <p className="text-sm text-gray-600">{ingredient.quantity}</p>

                    <div className="flex gap-2 mt-2 flex-wrap">
                        <span className={`badge ${locationColors[ingredient.location]}`}>
                            {locationLabels[ingredient.location]}
                        </span>
                        <span className={`badge ${processingColors[ingredient.processingState] || processingColors.원물}`}>
                            {ingredient.processingState}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="font-semibold">{freshnessLabel}</span>
                    <span className="text-gray-600">
                        {freshness.days > 0 ? `${freshness.days}일 남음` : '기한 만료'}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="freshness-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${freshness.percentage}%` }}
                        transition={{ duration: 0.5 }}
                        style={{
                            backgroundColor:
                                freshness.status === 'good'
                                    ? '#4ADE80'
                                    : freshness.status === 'warning'
                                      ? '#FBBF24'
                                      : '#EF4444'
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default IngredientCard;
