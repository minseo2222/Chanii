import { motion } from 'framer-motion';
import { Apple, Beef, Carrot, Check, Cookie, Egg, Fish, Milk, Salad, Snowflake, Square } from 'lucide-react';
import { calculateFreshness } from '../data/mockInventory';
import {
  formatFreshnessCountdown,
  formatFreshnessStatus,
  getProcessingLabel,
  getStorageLabel,
  processingMeta,
  storageMeta
} from '../lib/inventoryMeta';

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

const freshnessColorMap = {
  good: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  expired: '#dc2626'
};

const IngredientCard = ({ ingredient, selected = false, selectionMode = false }) => {
  const freshness = calculateFreshness(ingredient.expiryDate);
  const Icon = iconMap[ingredient.icon] || Square;
  const storage = storageMeta[ingredient.location] || storageMeta.refrigerated;
  const processing = processingMeta[ingredient.processingState] || processingMeta.생재료;

  return (
    <motion.article
      layout
      className={`card relative cursor-pointer border ${
        selected ? 'border-slate-900 ring-2 ring-slate-200' : 'border-slate-200'
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      {ingredient.location === 'frozen' ? (
        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-sm">
          <Snowflake size={16} />
        </div>
      ) : null}

      {selectionMode ? (
        <div
          className={`absolute left-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border ${
            selected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-transparent'
          }`}
        >
          <Check size={14} />
        </div>
      ) : null}

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon size={26} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900">{ingredient.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{ingredient.quantity}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`badge border ${storage.accentClass}`}>{getStorageLabel(ingredient.location)}</span>
            <span className={`badge border ${processing.className}`}>{getProcessingLabel(ingredient.processingState)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-700">{formatFreshnessStatus(freshness)}</span>
          <span className="text-slate-500">{formatFreshnessCountdown(freshness)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${freshness.percentage}%` }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: freshnessColorMap[freshness.status] || freshnessColorMap.good }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{ingredient.expiryDate}</span>
          <span>{storage.helperText}</span>
        </div>
      </div>
    </motion.article>
  );
};

export default IngredientCard;
