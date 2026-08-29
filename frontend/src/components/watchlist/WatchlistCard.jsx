import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Ticket, Trash2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';

const WatchlistCard = ({ movie }) => {
  const { id, name, poster, genre, duration, rating, releaseYear } = movie;
  const navigate = useNavigate();
  const { removeFromWatchlist } = useWatchlist();

  const handleNavigate = () => {
    navigate(`/movies/${id}`);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromWatchlist(id);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -8 }}
      onClick={handleNavigate}
      className="group relative bg-white/[0.02] rounded-[2rem] overflow-hidden border border-white/5 hover:border-red-500/20 transition-all duration-500 shadow-2xl flex flex-col h-full hover:shadow-[0_0_40px_rgba(229,9,20,0.12)] cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-neutral-900">
        <img 
          src={poster} 
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500"></div>
        
        {/* Remove Button */}
        <motion.button
          onClick={handleRemove}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer hover:bg-red-600/80 hover:border-red-500/50 transition-all group/btn"
          aria-label="Remove from watchlist"
        >
          <Trash2 size={16} className="text-white/70 group-hover/btn:text-white transition-colors" />
        </motion.button>

        {/* Floating Rating Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/10">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-black text-white">{rating ? Number(rating).toFixed(1) : 'N/A'}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div className="space-y-3">
          {/* Info row */}
          <div className="flex items-center gap-3 text-xs text-white/40 font-semibold tracking-wide flex-wrap">
            <span className="uppercase text-red-500/80">{genre}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1 opacity-80">
              <Clock size={12} />
              {duration}
            </span>
            {releaseYear && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1 opacity-80">
                  <Calendar size={12} />
                  {releaseYear}
                </span>
              </>
            )}
          </div>
          
          {/* Movie Title */}
          <h3 className="text-xl font-extrabold text-white group-hover:text-red-500 transition-colors duration-300 uppercase line-clamp-1" title={name}>
            {name}
          </h3>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex gap-2">
          <button 
            type="button"
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/20"
          >
            <Ticket size={16} />
            <span>Book</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(WatchlistCard);
