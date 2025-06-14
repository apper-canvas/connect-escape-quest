import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Layout = () => {
  const location = useLocation();
  const isInRoom = location.pathname.includes('/room/');

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-white">
      {/* Header - Hidden when in room for immersion */}
      {!isInRoom && (
        <motion.header 
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          className="flex-shrink-0 h-16 bg-surface border-b border-secondary/30 z-40"
        >
          <div className="h-full flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="KeyRound" className="w-8 h-8 text-accent" />
                <h1 className="text-xl font-display font-semibold text-accent">
                  Escape Quest
                </h1>
              </motion.div>
            </div>

            <nav className="flex items-center space-x-6">
              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'text-white/70 hover:text-accent hover:bg-accent/10'
                  }`
                }
              >
                <ApperIcon name="Home" size={18} />
                <span className="font-medium">Rooms</span>
              </NavLink>

              <NavLink
                to="/progress"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'text-white/70 hover:text-accent hover:bg-accent/10'
                  }`
                }
              >
                <ApperIcon name="Trophy" size={18} />
                <span className="font-medium">Progress</span>
              </NavLink>
            </nav>
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;