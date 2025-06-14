import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const AchievementCard = ({ achievement, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className={`bg-primary/20 border border-accent/30 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
            <ApperIcon name={achievement.icon || 'Award'} className="w-6 h-6 text-accent" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white mb-1">
            {achievement.name}
          </h3>
          <p className="text-white/70 text-sm mb-2">
            {achievement.description}
          </p>
          {achievement.unlockedAt && (
            <p className="text-accent text-xs">
              Unlocked {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;