import { motion } from 'framer-motion';

const LoadingSkeleton = ({ 
  height = "h-4", 
  width = "w-full", 
  className = "",
  count = 1 
}) => {
  if (count > 1) {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`${height} ${width} bg-gradient-to-r from-surface via-secondary/30 to-surface rounded animate-pulse`}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${height} ${width} bg-gradient-to-r from-surface via-secondary/30 to-surface rounded animate-pulse ${className}`}
    />
  );
};

export default LoadingSkeleton;