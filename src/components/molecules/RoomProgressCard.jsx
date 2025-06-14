import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const RoomProgressCard = ({ room, stats, formatTime, className = '' }) => {
  const isCompleted = stats?.completed || false;
  const bestTime = stats?.bestTime;
  const attempts = stats?.attempts || 0;
  const hintsUsed = stats?.hintsUsed || 0;

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={`bg-primary/10 border border-secondary/20 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-success/20 text-success' : room.isLocked ? 'bg-white/10 text-white/50' : 'bg-accent/20 text-accent'
          }`}>
            {isCompleted ? (
              <ApperIcon name="CheckCircle" className="w-5 h-5" />
            ) : room.isLocked ? (
              <ApperIcon name="Lock" className="w-5 h-5" />
            ) : (
              <ApperIcon name="Clock" className="w-5 h-5" />
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-white">{room.name}</h3>
            <p className="text-white/60 text-sm">{room.theme}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-sm font-medium ${
            isCompleted ? 'text-success' : room.isLocked ? 'text-white/50' : 'text-accent'
          }`}>
            {isCompleted ? 'Completed' : room.isLocked ? 'Locked' : 'Available'}
          </div>
          {bestTime && (
            <div className="text-white/60 text-xs">
              Best: {formatTime(bestTime)}
            </div>
          )}
        </div>
      </div>
      
      {isCompleted && (
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
          <div className="text-center">
            <div className="text-accent font-medium">{formatTime(bestTime)}</div>
            <div className="text-white/50 text-xs">Best Time</div>
          </div>
          <div className="text-center">
            <div className="text-info font-medium">{attempts}</div>
            <div className="text-white/50 text-xs">Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-warning font-medium">{hintsUsed}</div>
            <div className="text-white/50 text-xs">Hints Used</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RoomProgressCard;