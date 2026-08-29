import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingCTA = ({ movie, selectedShow }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    if (selectedShow) {
      navigate(`/booking/${selectedShow._id}`);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 sm:px-8 pointer-events-none">
      <div className="max-w-6xl mx-auto flex justify-center">
        <AnimatePresence mode="wait">
          {!selectedShow ? (
            /* Call to Action to select a show */
            <motion.div
              key="no-selection"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="glass-panel px-8 py-5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-white/10 flex items-center gap-3 pointer-events-auto backdrop-blur-2xl hover:scale-102 transition-transform duration-300 select-none cursor-pointer"
              onClick={() => {
                const element = document.getElementById('showtime-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Sparkles size={16} className="text-yellow-500 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-wider text-white/80">
                Choose a showtime below to book tickets
              </span>
            </motion.div>
          ) : (
            /* Selected show floating panel */
            <motion.div
              key="selected-show"
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 18, stiffness: 180 }}
              className="glass-panel w-full p-5 sm:p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(229,9,20,0.15)] border border-red-500/20 pointer-events-auto flex flex-col md:flex-row gap-5 items-center justify-between backdrop-blur-2xl"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full md:w-auto">
                {/* Movie Poster Thumbnail */}
                <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 hidden sm:block">
                  <img
                    src={movie?.poster || 'https://images.unsplash.com/photo-1542204172-e56559810b85?w=200&q=80'}
                    alt={movie?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Show Details */}
                <div className="space-y-1.5 text-left">
                  <h3 className="text-lg font-black uppercase text-white tracking-tight line-clamp-1">
                    {movie?.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50 font-bold uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-red-500" />
                      {selectedShow.theatreId?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(selectedShow.showDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {selectedShow.showTime}
                    </span>
                  </div>
                  <div className="text-[11px] text-red-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                    <span>Screen 1</span>
                    <span className="text-white/20">•</span>
                    <span>{selectedShow.availableSeats} Seats Left</span>
                  </div>
                </div>
              </div>

              {/* Price and Action Button */}
              <div className="flex items-center gap-6 justify-between w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                <div className="text-left md:text-right">
                  <div className="text-[10px] uppercase font-black tracking-widest text-white/40">Total Price</div>
                  <div className="text-3xl font-black text-red-500 tracking-tighter italic">
                    ₹{selectedShow.price}
                  </div>
                </div>

                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(229, 9, 20, 0.6)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBook}
                  className="bg-red-600 text-white font-black uppercase tracking-wider text-sm px-8 py-4.5 rounded-full flex items-center gap-2 cursor-pointer shadow-lg transition-colors hover:bg-red-750"
                  aria-label={`Book Tickets for ${movie?.name}`}
                >
                  <Ticket size={18} className="fill-white" />
                  <span>Book Tickets</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingCTA;
