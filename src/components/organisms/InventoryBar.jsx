import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const InventoryBar = ({ inventory, roomObjects, onCombineItems, onUseItem }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const getInventoryObjects = () => {
    return inventory.map(itemId => 
      roomObjects.find(obj => obj.id === itemId)
    ).filter(Boolean);
  };

  const getObjectIcon = (category) => {
    const iconMap = {
      key: 'Key',
      document: 'FileText',
      mystical: 'Sparkles',
      chemical: 'TestTube',
      navigation: 'Compass',
      container: 'Package'
    };
    return iconMap[category] || 'Circle';
  };

  const handleDragStart = (e, itemId) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, itemId) => {
    e.preventDefault();
    setDragOverItem(itemId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, targetItemId) => {
    e.preventDefault();
    
    if (draggedItem && targetItemId && draggedItem !== targetItemId) {
      onCombineItems(draggedItem, targetItemId);
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const inventoryObjects = getInventoryObjects();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="flex-shrink-0 h-20 bg-surface/95 backdrop-blur-sm border-t border-secondary/30"
    >
      <div className="h-full px-6 flex items-center">
        {/* Inventory Label */}
        <div className="flex items-center space-x-2 mr-6">
          <ApperIcon name="Package" className="w-5 h-5 text-accent" />
          <span className="text-white/70 font-medium">Inventory</span>
        </div>

        {/* Inventory Items */}
        <div className="flex-1 flex items-center space-x-3 overflow-x-auto scrollbar-hide">
          <AnimatePresence>
            {inventoryObjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/50 text-sm italic"
              >
                No items collected yet
              </motion.div>
            ) : (
              inventoryObjects.map((object, index) => (
                <motion.div
                  key={object.id}
                  initial={{ opacity: 0, scale: 0.5, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: -50 }}
                  transition={{ delay: index * 0.1 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, object.id)}
                  onDragOver={(e) => handleDragOver(e, object.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, object.id)}
                  className={`
                    group relative w-12 h-12 rounded-lg border-2 cursor-move
                    flex items-center justify-center transition-all duration-200
                    ${dragOverItem === object.id 
                      ? 'border-accent bg-accent/30 scale-110' 
                      : 'border-accent/50 bg-accent/10 hover:border-accent hover:bg-accent/20'
                    }
                    ${draggedItem === object.id ? 'opacity-50 scale-95' : ''}
                  `}
                >
                  <ApperIcon 
                    name={getObjectIcon(object.category)} 
                    className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" 
                  />
                  
                  {/* Item Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-surface/90 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap border border-accent/30 z-10"
                  >
                    {object.name}
                  </motion.div>

                  {/* Combine Indicator */}
                  {draggedItem && draggedItem !== object.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center"
                    >
                      <ApperIcon name="Plus" className="w-2 h-2 text-background" />
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        {inventoryObjects.length > 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white/50 text-xs ml-4 hidden md:block"
          >
            Drag items together to combine
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default InventoryBar;