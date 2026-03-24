import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ChefHat, Home, Package, Users } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: '찬이', icon: Home, path: '/' },
  { id: 'inventory', label: '인벤토리', icon: Package, path: '/inventory' },
  { id: 'recipes', label: '레시피', icon: ChefHat, path: '/recipes' },
  { id: 'community', label: '커뮤니티', icon: Users, path: '/community' }
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-screen-xl px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        <div className="grid grid-cols-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.id} to={item.path} className="flex justify-center" end={item.path === '/'}>
                {({ isActive }) => (
                  <motion.span
                    className={`relative flex w-full flex-col items-center justify-center gap-1 rounded-3xl px-2 py-3 text-xs font-semibold transition-colors ${
                      isActive ? 'text-slate-900' : 'text-slate-400'
                    }`}
                    whileTap={{ scale: 0.96 }}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="bottom-nav-active"
                        className="absolute inset-0 rounded-3xl bg-slate-100"
                        transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                      />
                    ) : null}

                    <span className="relative z-10 flex flex-col items-center gap-1">
                      <motion.span
                        animate={{ y: isActive ? -1 : 0, scale: isActive ? 1.04 : 1 }}
                        transition={{ type: 'spring', stiffness: 520, damping: 30 }}
                      >
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      </motion.span>
                      <span>{item.label}</span>
                    </span>
                  </motion.span>
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
