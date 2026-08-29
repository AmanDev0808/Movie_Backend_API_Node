import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/api-client';
import { dummyMovies } from '../data/dummyMovies';

const RelatedMovies = ({ currentMovieId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await apiClient.get('/movies');
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const formatted = response.data.data
            .map(movie => {
              const dummyMatch = dummyMovies.find(m => m.name.toLowerCase() === movie.name.toLowerCase()) || {};
              return {
                id: movie._id || movie.id,
                name: movie.name,
                poster: movie.poster || dummyMatch.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
                genre: movie.genre || dummyMatch.genre || 'Action / Drama',
                duration: movie.duration || dummyMatch.duration || '120 Min',
                rating: movie.rating !== undefined ? movie.rating : (dummyMatch.rating !== undefined ? dummyMatch.rating : 8.5),
              };
            })
            .filter(movie => movie.id !== currentMovieId);
          setMovies(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch related movies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [currentMovieId]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading || movies.length === 0) return null;

  return (
    <section className="space-y-6 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          You May <span className="text-red-500">Also Like</span>
        </h2>
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full glass-panel border border-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full glass-panel border border-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            onClick={() => {
              navigate(`/movies/${movie.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            whileHover={{ y: -8 }}
            className="w-[200px] sm:w-[240px] shrink-0 bg-white/[0.02] border border-white/5 hover:border-red-500/20 rounded-[2rem] overflow-hidden transition-all duration-300 shadow-xl flex flex-col group snap-start cursor-pointer hover:shadow-[0_0_30px_rgba(229,9,20,0.1)] relative"
          >
            {/* Poster Thumbnail */}
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={movie.poster}
                alt={movie.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300"></div>

              {/* Float Rating */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 border border-white/10">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-black text-white">{movie.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 flex flex-col flex-grow justify-between relative overflow-hidden bg-neutral-950/40">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <span className="line-clamp-1">{movie.genre}</span>
                  <span className="shrink-0">{movie.duration}</span>
                </div>
                <h3 className="text-base font-black text-white group-hover:text-red-500 transition-colors duration-300 uppercase line-clamp-1">
                  {movie.name}
                </h3>
              </div>

              {/* Book button overlay reveal on hover */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button
                  className="w-full py-2.5 bg-red-600 hover:bg-red-750 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Ticket size={14} className="fill-white" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedMovies;
