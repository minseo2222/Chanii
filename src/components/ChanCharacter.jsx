import { motion } from 'framer-motion';
import { Snowflake } from 'lucide-react';

const ChanCharacter = ({ mood = 'happy', message = '안녕하세요, 주인님!' }) => {
    const expressions = {
        happy: {
            eyes: '^ ^',
            color: 'from-pastel-blue to-pastel-purple',
            animation: { y: [0, -10, 0] }
        },
        worried: {
            eyes: '• •',
            color: 'from-pastel-yellow to-pastel-peach',
            animation: { y: [0, -5, 0], rotate: [-2, 2, -2] }
        },
        cold: {
            eyes: '- -',
            color: 'from-blue-200 to-blue-300',
            animation: { y: [0, -8, 0] }
        }
    };

    const currentExpression = expressions[mood] || expressions.happy;

    return (
        <div className="flex flex-col items-center gap-4">
            <motion.div
                className="relative"
                animate={currentExpression.animation}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            >
                <div className={`relative w-48 h-64 bg-gradient-to-b ${currentExpression.color} rounded-3xl shadow-2xl overflow-hidden`}>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-white/40 rounded-full" />
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-white/20" />

                    <div className="absolute top-16 left-0 right-0 flex flex-col items-center gap-3">
                        <div className="text-3xl font-bold tracking-widest text-gray-700">{currentExpression.eyes}</div>

                        <div className="w-16 h-8 bg-white/80 rounded-full flex items-center justify-center">
                            {mood === 'happy' && <div className="w-12 h-4 border-b-4 border-gray-700 rounded-full" />}
                            {mood === 'worried' && <div className="w-10 h-1 bg-gray-700 rounded-full" />}
                            {mood === 'cold' && <div className="w-12 h-3 bg-blue-400 rounded-full" />}
                        </div>
                    </div>

                    {mood === 'cold' && (
                        <motion.div
                            className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                            animate={{ rotate: [-5, 5, -5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <div className="w-20 h-16 bg-red-400 rounded-t-full border-4 border-white" />
                            <div className="w-24 h-4 bg-white rounded-full -mt-1 ml-auto mr-auto" />
                            <Snowflake className="absolute top-2 right-2 text-white" size={16} />
                        </motion.div>
                    )}

                    {mood === 'worried' && (
                        <>
                            <motion.div
                                className="absolute top-12 left-8 text-xl"
                                animate={{ y: [0, 20], opacity: [1, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                💧
                            </motion.div>
                            <motion.div
                                className="absolute top-14 right-8 text-xl"
                                animate={{ y: [0, 20], opacity: [1, 0] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                            >
                                💧
                            </motion.div>
                        </>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg max-w-sm"
            >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white/90" />
                <p className="text-center font-semibold text-gray-700">{message}</p>
            </motion.div>
        </div>
    );
};

export default ChanCharacter;
