import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  type = 'text',
  label,
  error,
  icon,
  className = '',
  disabled = false,
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 bg-surface border border-secondary/30 rounded-lg
    text-white placeholder-white/50 
    focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    ${icon ? 'pl-12' : ''}
    ${error ? 'border-error focus:ring-error focus:border-error' : ''}
  `;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-sm font-medium text-white/80 mb-2"
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-white/50" />
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={inputClasses}
          disabled={disabled}
          whileFocus={{ scale: 1.02 }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;