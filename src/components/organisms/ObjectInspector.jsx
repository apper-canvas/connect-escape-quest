import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ObjectInspector = ({ object, onCollect, onClose }) => {
  if (!object) return null;

  const getObjectIcon = (category) => {
    const iconMap = {
      decoration: 'Frame',
      key: 'Key',
      furniture: 'Armchair',
      mystical: 'Sparkles',
      chemical: 'TestTube',
      technology: 'Monitor',
      document: 'FileText',
      navigation: 'Compass',
      weapon: 'Zap',
      container: 'Package'
    };
    return iconMap[category] || 'Circle';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl shadow-2xl max-w-md w-full p-6 border border-secondary/30"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <ApperIcon 
                name={getObjectIcon(object.category)} 
                className="w-6 h-6 text-accent" 
              />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                {object.name}
              </h2>
              <p className="text-white/60 text-sm capitalize">
                {object.category}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClose}
            className="text-white/70 hover:text-white"
          />
        </div>

        {/* 3D Object View */}
        <div className="mb-6 h-48 bg-primary/20 rounded-lg border border-accent/30 flex items-center justify-center relative overflow-hidden">
          {/* Rotating Object Icon */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-8xl text-accent/50"
          >
            <ApperIcon 
              name={getObjectIcon(object.category)} 
              className="w-20 h-20" 
            />
          </motion.div>
          
          {/* Interaction Hint */}
          <div className="absolute bottom-3 left-3 text-xs text-white/50">
            Click and drag to rotate
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-2">Description</h3>
          <p className="text-white/70 leading-relaxed">
            {object.description}
          </p>
        </div>

        {/* Clue Reveal */}
        {object.revealsClue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/30"
          >
            <div className="flex items-start space-x-2">
              <ApperIcon name="Lightbulb" className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-accent font-medium mb-1">Clue</h4>
                <p className="text-white/80 text-sm">
                  {object.revealsClue}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Combination Info */}
        {object.combinesWith?.length > 0 && (
          <div className="mb-6 p-4 bg-info/10 rounded-lg border border-info/30">
            <div className="flex items-start space-x-2">
              <ApperIcon name="Link" className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-info font-medium mb-1">Can Combine With</h4>
                <p className="text-white/80 text-sm">
                  This item can be combined with other objects you find.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          {onCollect && (
            <Button
              onClick={onCollect}
              variant="primary"
              icon="Package"
              className="flex-1"
            >
              Collect Item
            </Button>
          )}
          
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ObjectInspector;