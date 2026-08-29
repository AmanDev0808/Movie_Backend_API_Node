import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, Heart, Plus, Ticket, Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useNavigate } from 'react-router-dom';
import WatchlistCard from '../components/watchlist/WatchlistCard';
import WatchlistSkeleton from '../components/watchlist/WatchlistSkeleton';

const SORT_OPTIONS = ['Recently Added', 'Highest Rated', 'A-Z', 'Release Year'];

const Watchlist = () => {
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('Recently Added');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for smooth skeleton transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const total = watchlist.length;
    let avgRating = 0;
    let totalMins = 0;
    
    if (total > 0) {
      avgRating = watchlist.reduce((acc, m) => acc + Number(m.rating || 0), 0) / total;
      totalMins = watchlist.reduce((acc, m) => {
        const mins = parseInt(String(m.duration || '0').replace(/\D/g, ''), 10) || 0;
        return acc + mins;
      }, 0);
    }
    
    return {
      total,
      avgRating: avgRating.toFixed(1),
      totalHours: Math.round(totalMins / 60)
    };
  }, [watchlist]);

  // Filter & Sort
  const filteredAndSortedWatchlist = useMemo(() => {
    let result = [...watchlist];
    
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name?.toLowerCase().includes(q) || 
        m.genre?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (activeSort) {
      case 'Highest Rated':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'A-Z':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'Release Year':
        result.sort((a, b) => parseInt(b.releaseYear || 0) - parseInt(a.releaseYear || 0));
        break;
      case 'Recently Added':
      default:
        result.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        break;
    }

    return result;
  }, [watchlist, searchQuery, activeSort]);

  // Page Animation Variants
  const pageFade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemSlideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      variants={pageFade}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto"
    >
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-red-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-1/4 w-[40vw] h-[40vw] bg-neutral-900/40 rounded-full blur-[100px]" />
      </div>

      <div className="flex flex-col gap-10">
        
        {/* Header Section */}
        <motion.div variants={itemSlideUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3">
              My <span className="text-red-500">Watchlist</span>
            </h1>
            <p className="text-white/50 font-medium">Keep track of movies you want to watch next.</p>
          </div>
        </motion.div>

        {isLoading ? (
          <WatchlistSkeleton />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-10">
            
            {watchlist.length > 0 && (
              <>
                {/* Stats Section */}
                <motion.div variants={itemSlideUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex flex-col justify-center items-center gap-2">
                    <Heart size={24} className="text-red-500 mb-1" />
                    <span className="text-2xl font-black text-white">{stats.total}</span>
                    <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Saved Movies</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex flex-col justify-center items-center gap-2">
                    <Star size={24} className="text-yellow-500 mb-1" />
                    <span className="text-2xl font-black text-white">{stats.avgRating}</span>
                    <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Avg Rating</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex flex-col justify-center items-center gap-2">
                    <Clock size={24} className="text-blue-500 mb-1" />
                    <span className="text-2xl font-black text-white">{stats.totalHours}h</span>
                    <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Total Watch Time</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex flex-col justify-center items-center gap-2">
                    <Ticket size={24} className="text-green-500 mb-1" />
                    <span className="text-2xl font-black text-white">0</span>
                    <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Tickets Booked</span>
                  </div>
                </motion.div>

                {/* Filters & Search */}
                <motion.div variants={itemSlideUp} className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative w-full lg:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search size={18} className="text-white/40" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search saved movies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium"
                    />
                  </div>

                  {/* Sort Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    <div className="flex items-center gap-2 text-white/40 mr-2 shrink-0">
                      <Filter size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Sort By</span>
                    </div>
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setActiveSort(opt)}
                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          activeSort === opt 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* Movie Grid */}
            {watchlist.length === 0 ? (
              <motion.div variants={itemSlideUp} className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/[0.02] border border-white/5 rounded-3xl mt-8">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Heart size={40} className="text-white/20" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Your Watchlist is Empty</h3>
                <p className="text-white/50 max-w-md mb-8">
                  Looks like you haven't saved any movies yet. Explore our collection and tap the heart icon to save movies for later.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide flex items-center gap-2 transition-all shadow-lg shadow-red-600/20"
                >
                  <Plus size={18} />
                  Explore Movies
                </button>
              </motion.div>
            ) : filteredAndSortedWatchlist.length === 0 ? (
              <motion.div variants={itemSlideUp} className="text-center py-20">
                <p className="text-white/50 text-lg">No movies found matching "{searchQuery}"</p>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedWatchlist.map(movie => (
                    <WatchlistCard key={movie.id} movie={movie} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

export default Watchlist;
