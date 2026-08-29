import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Film, Clapperboard, ArrowRight, Video } from 'lucide-react';

const FloatingIcon = ({ icon: Icon, delay, className, xRange, yRange }) => {
  return (
    <motion.div
      animate={{
        x: xRange,
        y: yRange,
        rotate: [0, 10, -10, 0]
      }}
      transition={{
        duration: 5,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute text-white/20 p-3 bg-white/[0.01] border border-white/[0.03] rounded-2xl pointer-events-none ${className}`}
    >
      <Icon size={24} />
    </motion.div>
  );
};

const EmptyState = ({ isFiltered, onReset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass p-12 text-center rounded-[3rem] border border-dashed border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] bg-neutral-900/20"
    >
      {/* Background radial glows */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating Cinematic Items */}
      <FloatingIcon icon={Film} delay={0} className="top-10 left-10 md:left-24 text-red-500/20" xRange={[-5, 5, -5]} yRange={[-10, 10, -10]} />
      <FloatingIcon icon={Clapperboard} delay={1.5} className="top-16 right-10 md:right-24 text-blue-500/20" xRange={[5, -5, 5]} yRange={[-15, 5, -15]} />
      <FloatingIcon icon={Video} delay={0.7} className="bottom-14 left-16 md:left-32 text-green-500/20" xRange={[-8, 8, -8]} yRange={[5, -15, 5]} />
      <FloatingIcon icon={Ticket} delay={2.2} className="bottom-16 right-16 md:right-32 text-yellow-500/20" xRange={[10, -10, 10]} yRange={[-5, 12, -5]} />

      {/* Main Centerpiece */}
      <motion.div 
        animate={{ 
          rotate: [-3, 3, -3],
          y: [-5, 5, -5]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4, 
          ease: "easeInOut" 
        }}
        className="w-20 h-20 bg-gradient-to-tr from-neutral-800 to-neutral-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-white/10 text-white relative"
      >
        <div className="absolute inset-0 bg-white/5 rounded-3xl" />
        <Ticket className="w-10 h-10 text-white/80 transform -rotate-12" />
      </motion.div>
      
      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
        {isFiltered ? "No Matches Found" : "No Bookings Yet"}
      </h3>
      
      <p className="text-white/40 text-sm max-w-sm mt-3 leading-relaxed font-semibold">
        {isFiltered
          ? "No bookings match your current search queries or status filters. Try clearing your options."
          : "You haven't booked your first movie yet. Discover the latest blockbusters and reserve your seats now."}
      </p>
      
      <div className="mt-8 relative z-10">
        {isFiltered ? (
          <button 
            onClick={onReset}
            className="bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-md"
          >
            Clear Filters
          </button>
        ) : (
          <Link 
            to="/" 
            className="btn-primary px-8 py-3 text-xs flex items-center gap-2 group text-white font-black rounded-2xl"
          >
            <span>Browse Movies</span>
            <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
