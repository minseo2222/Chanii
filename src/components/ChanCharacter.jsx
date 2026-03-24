import { motion } from 'framer-motion';
import { Snowflake } from 'lucide-react';

const expressions = {
  happy: {
    eyes: '^ ^',
    mouth: 'smile',
    color: 'from-slate-100 to-slate-200',
    animation: { y: [0, -7, 0] }
  },
  worried: {
    eyes: '• •',
    mouth: 'line',
    color: 'from-amber-50 to-orange-100',
    animation: { y: [0, -4, 0], rotate: [-2, 2, -2] }
  },
  cold: {
    eyes: '- -',
    mouth: 'cold',
    color: 'from-sky-100 to-cyan-100',
    animation: { y: [0, -7, 0] }
  }
};

const ChanCharacter = ({ mood = 'happy', message = '안녕하세요, 주인님!' }) => {
  const currentExpression = expressions[mood] || expressions.happy;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative"
        animate={currentExpression.animation}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className={`relative h-64 w-48 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-b ${currentExpression.color} shadow-xl`}
        >
          <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-white/80" />
          <div className="absolute right-4 top-1/2 h-16 w-2 -translate-y-1/2 rounded-full bg-slate-300" />

          <div className="absolute left-0 right-0 top-16 flex flex-col items-center gap-3">
            <div className="text-3xl font-bold tracking-widest text-slate-700">{currentExpression.eyes}</div>

            <div className="flex h-8 w-16 items-center justify-center rounded-full border border-slate-200 bg-white">
              {currentExpression.mouth === 'smile' ? <div className="h-4 w-12 rounded-full border-b-4 border-slate-700" /> : null}
              {currentExpression.mouth === 'line' ? <div className="h-1 w-10 rounded-full bg-slate-700" /> : null}
              {currentExpression.mouth === 'cold' ? <div className="h-3 w-12 rounded-full bg-sky-400" /> : null}
            </div>
          </div>

          {mood === 'cold' ? (
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="h-16 w-20 rounded-t-full border-4 border-white bg-rose-400" />
              <div className="-mt-1 mx-auto h-4 w-24 rounded-full bg-white" />
              <Snowflake className="absolute right-2 top-2 text-white" size={16} />
            </motion.div>
          ) : null}

          {mood === 'worried' ? (
            <>
              <motion.div
                className="absolute left-8 top-12 text-xl"
                animate={{ y: [0, 18], opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                💧
              </motion.div>
              <motion.div
                className="absolute right-8 top-14 text-xl"
                animate={{ y: [0, 18], opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              >
                💧
              </motion.div>
            </>
          ) : null}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative max-w-sm rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm"
      >
        <div className="absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-white" />
        <p className="text-center font-semibold text-slate-700">{message}</p>
      </motion.div>
    </div>
  );
};

export default ChanCharacter;
