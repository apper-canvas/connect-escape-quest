import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
  
  const variants = {
    primary: 'bg-accent text-background hover:bg-accent/90 focus:ring-accent disabled:bg-accent/50',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary disabled:bg-secondary/50',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-background focus:ring-accent disabled:opacity-50',
    ghost: 'text-white hover:bg-white/10 focus:ring-white/20 disabled:opacity-50',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error disabled:bg-error/50'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`animate-spin ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${children ? 'mr-2' : ''}`} 
        />
      )}
      {icon && !loading && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${children ? 'mr-2' : ''}`} 
        />
      )}
      {children}
      {icon && !loading && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${children ? 'ml-2' : ''}`} 
        />
      )}
    </>
  );

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;