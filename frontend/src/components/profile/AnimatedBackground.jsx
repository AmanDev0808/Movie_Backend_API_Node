import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-neutral-950 pointer-events-none">
      {/* Dark overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent_70%)]" />

      {/* Blob 1: Red/Orange Glow */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-[120px]"
      />

      {/* Blob 2: Deep Purple/Indigo Glow */}
      <motion.div
        animate={{
          x: [0, -90, 60, 0],
          y: [0, 80, -90, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-purple-900/10 blur-[130px]"
      />

      {/* Blob 3: Amber/Rose Glow */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, 60, 100, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-rose-600/5 blur-[100px]"
      />
      
      {/* Ambient Grid overlay if needed for structural depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
};

export default AnimatedBackground;
