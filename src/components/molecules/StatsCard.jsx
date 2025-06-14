import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatsCard = ({ 
  icon, 
  label, 
  value, 
  subtitle, 
  total,
  color = 'accent',
  className = '' 
}) => {
  const colorClasses = {
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-surface rounded-xl p-6 border border-secondary/20 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <ApperIcon name={icon} className={`w-8 h-8 ${colorClasses[color]}`} />
        {total && (
          <div className="text-xs text-white/50">
            of {total}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className={`text-2xl font-bold ${colorClasses[color]}`}>
          {value}
        </div>
        <div className="text-white/70 font-medium">
          {label}
        </div>
        {subtitle && (
          <div className="text-xs text-white/50">
            {subtitle}
          </div>
        )}
      </div>
      
      {total && typeof value === 'number' && (
        <div className="mt-4">
          <div className="w-full bg-primary/30 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(value / total) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-2 rounded-full bg-${color}`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;