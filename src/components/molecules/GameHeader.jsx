import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const GameHeader = ({ roomName, gameTime, hintsUsed, onExit }) => {
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="flex-shrink-0 h-16 bg-surface/95 backdrop-blur-sm border-b border-secondary/30 z-50"
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Room Info */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate('/rooms')}
            className="text-white/70 hover:text-white"
          >
            Exit Room
          </Button>
          
          <div className="h-6 w-px bg-white/20" />
          
          <div>
            <h1 className="font-display font-semibold text-white text-lg">
              {roomName}
            </h1>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-white/70">
            <ApperIcon name="Clock" size={18} />
            <span className="font-mono text-accent font-medium">
              {formatTime(gameTime)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-white/70">
            <ApperIcon name="Lightbulb" size={18} />
            <span className="font-mono text-warning font-medium">
              {hintsUsed}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            icon="X"
            onClick={onExit}
            className="text-white/70 border-white/30 hover:text-white hover:border-white"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default GameHeader;