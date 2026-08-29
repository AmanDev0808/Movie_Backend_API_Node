import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

const FavoriteGenres = ({ bookings }) => {
  const genres = useMemo(() => {
    if (!bookings || bookings.length === 0) return ['Action', 'Sci-Fi', 'Comedy']; // Default
    const counts = {};
    bookings.forEach(b => {
      const gStr = b.showId?.movieId?.genre;
      if (gStr) {
        const parts = gStr.split(',').map(s => s.trim());
        parts.forEach(p => {
          counts[p] = (counts[p] || 0) + 1;
        });
      }
    });
    
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(e => e[0]);
    return sorted.length > 0 ? sorted.slice(0, 5) : ['Action', 'Sci-Fi', 'Comedy'];
  }, [bookings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-6">
        <Tag size={18} className="text-red-500" />
        <h3 className="text-xl font-black uppercase tracking-tighter text-white">
          Favorite Genres
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {genres.map((genre, idx) => (
          <motion.div
            key={genre}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className="px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full text-xs font-black uppercase tracking-widest text-red-400 hover:scale-105 hover:bg-red-500/20 transition-all cursor-default"
          >
            {genre}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default React.memo(FavoriteGenres);
