import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getYouTubeId = (url) => {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtu.be')) return parsedUrl.pathname.slice(1) || null;
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop() || null;
    }
  } catch {
    return null;
  }
  return null;
};

const TrailerSection = ({ trailerUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const videoId = getYouTubeId(trailerUrl);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!videoId) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight">Official <span className="text-red-500">Trailer</span></h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-sm text-white/50">Trailer unavailable for this movie.</div>
      </section>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-black uppercase tracking-tight">
        Official <span className="text-red-500">Trailer</span>
      </h2>

      {/* Cinematic Preview Card */}
      <motion.div 
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setIsOpen(true)}
        className="aspect-video w-full rounded-[2.5rem] overflow-hidden relative border border-white/10 group cursor-pointer shadow-2xl reflection-container"
      >
        <img 
          src={thumbnailUrl} 
          onError={(e) => { e.target.src = fallbackUrl; }}
          alt="Watch Trailer"
          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 ease-out"
          loading="lazy"
        />

        {/* Cinematic Backdrop Overlays */}
        <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/10 transition-colors duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/40"></div>

        {/* Pulsing Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.08, 1],
              boxShadow: [
                "0 0 0 0 rgba(229, 9, 20, 0.4)",
                "0 0 0 15px rgba(229, 9, 20, 0)",
                "0 0 0 0 rgba(229, 9, 20, 0.4)"
              ]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
            className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
          >
            <Play size={32} className="fill-white translate-x-0.5" />
          </motion.div>
        </div>

        {/* Floating Label */}
        <div className="absolute bottom-6 left-8 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-xs font-black uppercase tracking-widest text-white/90">Click to Play Preview</span>
        </div>
      </motion.div>

      {/* Cinematic Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Movie Trailer Video Player"
          >
            {/* Modal Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/65 hover:bg-red-600 text-white hover:scale-110 p-2.5 rounded-full transition-all border border-white/10"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* YouTube IFrame */}
              <iframe
                title="Movie Trailer"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TrailerSection;
