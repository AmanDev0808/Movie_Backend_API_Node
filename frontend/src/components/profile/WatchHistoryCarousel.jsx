import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCw, Star } from 'lucide-react';

const WatchHistoryCarousel = ({ pastBookings }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!pastBookings || pastBookings.length === 0) {
    return null; // Don't show the section if no history exists
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black uppercase tracking-tighter text-white">
          Watch History
        </h3>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {pastBookings.map((booking) => {
          const show = booking.showId || {};
          const movie = show.movieId || {};
          const date = show.showDate ? new Date(show.showDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'TBA';
          
          return (
            <div 
              key={booking._id} 
              className="min-w-[160px] max-w-[160px] snap-start group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg shrink-0"
            >
              <div className="aspect-[2/3] w-full relative overflow-hidden">
                <img 
                  src={movie.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'} 
                  alt={movie.name}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-90" />
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                  <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-[9px] font-bold text-white">4.8</span>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-sm font-black uppercase tracking-tight text-white truncate drop-shadow-md">
                  {movie.name}
                </h4>
                <div className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-3 drop-shadow-sm">
                  Watched {date}
                </div>
                
                <Link
                  to={`/movies/${movie._id}`}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCw size={10} /> Book Again
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default React.memo(WatchHistoryCarousel);
