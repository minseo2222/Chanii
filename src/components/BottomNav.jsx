import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Home, Package, ChefHat, Users } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { id: 'dashboard', label: '찬이', icon: Home, path: '/' },
        { id: 'inventory', label: '인벤토리', icon: Package, path: '/inventory' },
        { id: 'recipes', label: '레시피', icon: ChefHat, path: '/recipes' },
        { id: 'community', label: '커뮤니티', icon: Users, path: '/community' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t-2 border-pastel-purple/20 z-50">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className="flex-1 flex justify-center"
                                end={item.path === '/'}
                            >
                                {({ isActive }) => (
                                    <motion.button
                                        className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all relative ${isActive ? 'text-pastel-purple' : 'text-gray-500'}`}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-pastel-purple/10 to-pastel-blue/10 rounded-xl"
                                                transition={{ type: 'spring', duration: 0.5 }}
                                            />
                                        )}

                                        <div className="relative z-10 flex flex-col items-center gap-1">
                                            <motion.div
                                                animate={{
                                                    scale: isActive ? 1.1 : 1,
                                                    y: isActive ? -2 : 0
                                                }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            >
                                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                            </motion.div>
                                            <span className={`text-xs font-semibold ${isActive ? 'text-pastel-purple' : 'text-gray-500'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    </motion.button>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
