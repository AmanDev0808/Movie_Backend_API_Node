import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Info, Star, Calendar, 
  Globe, Film, User, Users, Award, 
  Check, Ticket, Play, ChevronRight, Heart 
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import apiClient from '../api/api-client';
import { dummyMovies } from '../data/dummyMovies';
import './MovieDetails.css';

// Subcomponents
import CastSection from '../components/CastSection';
import TrailerSection from '../components/TrailerSection';
import BookingCTA from '../components/BookingCTA';
import RelatedMovies from '../components/RelatedMovies';
import MovieDetailsSkeleton from '../components/MovieDetailsSkeleton';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const movieRes = await apiClient.get(`/movies/${id}`);
        setMovie(movieRes.data.data);
        
        // Fetch shows for this movie
        const showsRes = await apiClient.get(`/shows?movieId=${id}`);
        setShows(showsRes.data.data);
        setSelectedShow(null); // Reset selection on movie change
      } catch (error) {
        console.error('Failed to fetch movie details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <MovieDetailsSkeleton />;
  if (!movie) return <div className="text-center py-32 text-xl font-bold">Movie not found</div>;

  // Lookup matching dummy data for backdrop fallback
  const dummyMatch = dummyMovies.find(m => m.name.toLowerCase() === movie.name.toLowerCase()) || {};
  const moviePoster = movie.poster || dummyMatch.poster || 'https://images.unsplash.com/photo-1542204172-e56559810b85?w=800&q=80';
  const backdropImage = movie.backdrop || dummyMatch.backdrop || moviePoster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80';
  const movieRating = movie.rating !== undefined ? movie.rating : (dummyMatch.rating !== undefined ? dummyMatch.rating : 8.5);
  const movieDuration = movie.duration || dummyMatch.duration || '150 Min';
  const releaseYear = movie.releaseYear || (movie.releasedDate ? new Date(movie.releasedDate).getFullYear() : new Date().getFullYear());
  const movieCastList = Array.isArray(movie.casts)
    ? movie.casts
    : typeof movie.casts === 'string'
      ? movie.casts.split(',').map((value) => value.trim()).filter(Boolean)
      : (dummyMatch.cast || []);
  const fallbackTrailerUrl = 'https://www.youtube.com/watch?v=QwRzss5QAW8';
  const movieTrailerUrl = movie.trailerUrl || fallbackTrailerUrl;

  const saved = isInWatchlist(movie._id || movie.id);

  const handleToggleWatchlist = () => {
    const movieId = movie._id || movie.id;
    if (saved) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist({
        id: movieId,
        name: movie.name,
        poster: movie.poster,
        genre: movie.genre || dummyMatch.genre || 'Action / Drama',
        duration: movieDuration,
        rating: movieRating,
        releaseYear: releaseYear
      });
    }
  };

  // Group shows by theatre
  const groupedShows = shows.reduce((acc, show) => {
    const theatreName = show.theatreId.name;
    if (!acc[theatreName]) acc[theatreName] = { 
        id: show.theatreId._id,
        name: theatreName,
        city: show.theatreId.city,
        shows: [] 
    };
    acc[theatreName].shows.push(show);
    return acc;
  }, {});

  const scrollToSection = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Stagger configurations for hero content
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const heroItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="space-y-20 relative min-h-screen text-white pb-28">
      <div className="absolute inset-x-0 top-0 h-[70vh] overflow-hidden pointer-events-none select-none z-0">
        <img
          src={backdropImage}
          alt=""
          className="h-full w-full object-cover opacity-30 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-[#09090b]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/25" />
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-8 pt-8 max-w-7xl mx-auto px-4 lg:grid-cols-12 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 110, damping: 16, delay: 0.08 }}
          className="lg:col-span-4 flex justify-center"
        >
          <div className="w-[280px] sm:w-[320px] aspect-[2/3] overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/20 p-2 shadow-[0_24px_36px_rgba(0,0,0,0.35)]">
            <img
              src={moviePoster}
              alt={movie.name}
              className="h-full w-full rounded-[1.2rem] object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 flex flex-col justify-center space-y-6 text-left"
        >
          <motion.div variants={heroItemVariants} className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {movie.releaseStatus}
            </span>

            <h1 className="text-4xl font-black uppercase tracking-[-0.06em] leading-none text-white sm:text-5xl lg:text-6xl">
              {movie.name}
            </h1>

            <div className="flex flex-wrap gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-sm font-semibold text-white/85">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {movieRating.toFixed(1)} IMDb
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-sm font-semibold text-white/80">
                <Clock size={14} className="text-red-400" />
                {movieDuration}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-sm font-semibold text-white/80">
                <Globe size={14} className="text-blue-400" />
                {movie.language}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={heroItemVariants}
            className="rounded-[1.5rem] border border-white/10 bg-[#101116]/80 p-6"
          >
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
              <Info size={16} className="text-red-400" />
              Synopsis
            </h2>
            <p className="text-base leading-7 text-white/72 sm:text-lg">
              {movie.description}
            </p>
          </motion.div>

          <motion.div variants={heroItemVariants} className="flex flex-wrap gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('showtime-section')}
              className="btn-primary px-6 py-3 text-sm sm:text-base"
            >
              <Ticket size={18} className="fill-white" />
              Book Tickets
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('trailer-section')}
              className="btn-secondary px-6 py-3 text-sm sm:text-base"
            >
              <Play size={18} className="fill-white" />
              Watch Trailer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggleWatchlist}
              className={`rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
                saved ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/4 text-white/80 hover:bg-white/8'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Heart size={16} className={saved ? 'fill-red-500 text-red-500' : ''} />
                {saved ? 'Saved' : 'Watchlist'}
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-24">
        {/* 8-Grid Movie Information Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Director', value: movie.director, icon: <User size={20} className="text-red-500" /> },
            { label: 'Lead Casts', value: movie.casts?.slice(0, 2).join(', '), icon: <Users size={20} className="text-orange-500" /> },
            { label: 'Language', value: movie.language, icon: <Globe size={20} className="text-blue-500" /> },
            { label: 'Genre', value: movie.genre || dummyMatch.genre || 'Action/Drama', icon: <Film size={20} className="text-green-500" /> },
            { label: 'Runtime', value: movieDuration, icon: <Clock size={20} className="text-yellow-500" /> },
            { label: 'Release Date', value: movie.releasedDate || 'Released', icon: <Calendar size={20} className="text-indigo-500" /> },
            { label: 'Certificate', value: 'PG-13', icon: <Award size={20} className="text-purple-500" /> },
            { label: 'IMDb Rating', value: `${movieRating.toFixed(1)} / 10`, icon: <Star size={20} className="text-pink-500 fill-pink-500/20" /> }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="glass-panel p-6 rounded-[2rem] glass-panel-hover flex flex-col justify-between h-28 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-white/40 tracking-wider">
                  {item.label}
                </span>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white line-clamp-1">
                {item.value || 'N/A'}
              </h4>
            </div>
          ))}
        </motion.section>

        {/* Cast Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CastSection casts={movieCastList} />
        </motion.div>

        {/* Trailer Section */}
        <motion.div
          id="trailer-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TrailerSection trailerUrl={movieTrailerUrl} />
        </motion.div>

        {/* Showtimes / Choose Experience Section */}
        <motion.section 
          id="showtime-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Choose <span className="text-red-500">Experience</span>
          </h2>

          <div className="space-y-6">
            {Object.values(groupedShows).length === 0 && (
              <div className="glass-panel p-16 text-center rounded-[2.5rem] opacity-50 italic border border-white/5">
                No shows available currently. Please check again later.
              </div>
            )}
            {Object.values(groupedShows).map((theatre) => (
              <div 
                key={theatre.name} 
                className="glass-panel p-8 sm:p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all shadow-xl"
              >
                {/* Theatre Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600 h-10 w-1 rounded-full"></div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
                        {theatre.name}
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-red-500" />
                        {theatre.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid of Interactive Showtime Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {theatre.shows.map((show) => {
                    const isSelected = selectedShow?._id === show._id;

                    return (
                      <motion.button 
                        key={show._id}
                        onClick={() => setSelectedShow(show)}
                        whileHover={{ scale: 1.025, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          group p-5 rounded-2xl transition-all duration-350 text-left border relative overflow-hidden flex flex-col justify-between h-36 cursor-pointer
                          ${isSelected 
                            ? 'selected-show-outline border-red-500 bg-red-650/10 shadow-[0_0_25px_rgba(229,9,20,0.25)]' 
                            : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/15'
                          }
                        `}
                      >
                        {/* Card Header: Screen & Available seats */}
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                            Screen 1
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 animate-pulse">
                            {show.availableSeats} LEFT
                          </span>
                        </div>

                        {/* Card Body: Time and Date */}
                        <div className="space-y-0.5">
                          <div className="text-2xl font-black text-white tracking-tight uppercase">
                            {show.showTime}
                          </div>
                          <div className="text-xs font-bold uppercase tracking-wide text-white/50">
                            {formatDate(show.showDate)}
                          </div>
                        </div>

                        {/* Card Footer: Price */}
                        <div className="flex items-center justify-between w-full pt-1.5 border-t border-white/5">
                          <div className="text-base font-black text-white">
                            ₹{show.price}
                          </div>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0" />
                        </div>

                        {/* Selected Animated Check Indicator */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center border border-white/10 shadow-lg"
                            >
                              <Check size={10} className="text-white stroke-[4]" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Related Movies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <RelatedMovies currentMovieId={movie._id} />
        </motion.div>
      </div>

      {/* Floating Booking summary dock at bottom */}
      <BookingCTA movie={movie} selectedShow={selectedShow} />
    </div>
  );
};

export default MovieDetails;
