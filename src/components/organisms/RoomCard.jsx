import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const RoomCard = ({ room, onStart }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-error';
      default: return 'text-white/70';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'Circle';
      case 'medium': return 'CircleDot';
      case 'hard': return 'Target';
      default: return 'Circle';
    }
  };

  const backgroundImages = {
    'mansion-bg': 'linear-gradient(135deg, #2C1B47 0%, #4A3B5C 50%, #1A1125 100%)',
    'lab-bg': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F0F23 100%)',
    'ship-bg': 'linear-gradient(135deg, #8B5A2B 0%, #654321 50%, #3E2723 100%)'
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-surface rounded-xl overflow-hidden border border-secondary/20 shadow-xl"
    >
      {/* Background Image/Gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ 
          background: backgroundImages[room.backgroundImage] || backgroundImages['mansion-bg']
        }}
      />
      
      {/* Lock Overlay */}
      {room.isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"
        >
          <div className="text-center">
            <ApperIcon name="Lock" className="w-12 h-12 text-white/50 mx-auto mb-2" />
            <p className="text-white/70 text-sm">Complete previous rooms to unlock</p>
          </div>
        </motion.div>
      )}

      {/* Completion Badge */}
      {room.isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-success rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Check" className="w-5 h-5 text-white" />
        </motion.div>
      )}

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
            {room.name}
          </h3>
          <p className="text-white/60 text-sm mb-3">
            {room.theme}
          </p>
          
          {/* Difficulty & Time */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={getDifficultyIcon(room.difficulty)} 
                className={`w-4 h-4 ${getDifficultyColor(room.difficulty)}`} 
              />
              <span className={getDifficultyColor(room.difficulty)}>
                {room.difficulty}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-white/50">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>{room.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 mb-4">
          <p className="text-white/70 text-sm leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Stats */}
        {room.isCompleted && room.bestTime && (
          <div className="mb-4 p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Trophy" className="w-4 h-4 text-success" />
              <span className="text-success text-sm font-medium">
                Best Time: {Math.floor(room.bestTime / 60)}:{(room.bestTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onStart}
          disabled={room.isLocked}
          variant={room.isCompleted ? 'secondary' : 'primary'}
          icon={room.isCompleted ? 'RotateCcw' : room.isLocked ? 'Lock' : 'Play'}
          className="w-full"
        >
          {room.isLocked ? 'Locked' : room.isCompleted ? 'Play Again' : 'Start Room'}
        </Button>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.3) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  );
};

export default RoomCard;