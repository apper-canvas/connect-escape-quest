import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const HintButton = ({ onHintRequest, cooldownEnd, disabled }) => {
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (!cooldownEnd) return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, cooldownEnd - Date.now());
      setCooldownRemaining(remaining);
      
      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownEnd]);

  const isOnCooldown = cooldownRemaining > 0;
  const isDisabled = disabled || isOnCooldown;

  const formatCooldown = (ms) => {
    return Math.ceil(ms / 1000);
  };

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.1 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={!isDisabled ? onHintRequest : undefined}
      disabled={isDisabled}
      className={`
        relative w-14 h-14 rounded-full flex items-center justify-center
        transition-all duration-300 border-2
        ${isDisabled 
          ? 'bg-surface/50 border-white/20 text-white/30 cursor-not-allowed' 
          : 'bg-warning/20 border-warning text-warning hover:bg-warning/30 animate-pulse-gold'
        }
      `}
    >
      {isOnCooldown ? (
        <div className="text-xs font-bold">
          {formatCooldown(cooldownRemaining)}
        </div>
      ) : (
        <ApperIcon name="Lightbulb" className="w-6 h-6" />
      )}
      
      {!disabled && !isOnCooldown && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-warning/50"
        />
      )}
    </motion.button>
  );
};

export default HintButton;