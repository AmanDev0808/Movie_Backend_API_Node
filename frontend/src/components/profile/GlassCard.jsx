import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true, 
  glowColor = 'rgba(229, 9, 20, 0.1)', 
  ...props 
}) => {
  return (
    <motion.div
      {...props}
      whileHover={hover ? { 
        y: -4, 
        scale: 1.005,
        boxShadow: `0 15px 35px -5px ${glowColor}`,
        borderColor: 'rgba(255, 255, 255, 0.15)'
      } : {}}
      className={`glass rounded-[2rem] border border-white/5 bg-neutral-900/40 backdrop-blur-xl p-6 transition-all duration-300 relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
