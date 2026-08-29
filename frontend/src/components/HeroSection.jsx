import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Play, Star, Clock, Calendar, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FALLBACK_BG = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80';

const HeroSkeleton = () => (
  <section className="relative h-[68vh] min-h-[520px] overflow-hidden bg-[#070709]">
    <div className="absolute inset-0 bg-gradient-to-r from-[#111114] via-[#09090b] to-[#070709] animate-pulse" />
    <div className="relative z-10 flex h-full max-w-6xl items-center px-6 sm:px-10 lg:px-16">
      <div className="w-full max-w-xl space-y-5">
        <div className="h-5 w-28 rounded-full bg-white/10" />
        <div className="h-16 w-3/4 rounded-2xl bg-white/10" />
        <div className="h-10 w-2/3 rounded-2xl bg-white/10" />
        <div className="flex gap-3">{[...Array(3)].map((_, i) => <div key={i} className="h-8 w-20 rounded-full bg-white/10" />)}</div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-5/6 rounded bg-white/10" />
          <div className="h-4 w-2/3 rounded bg-white/10" />
        </div>
        <div className="flex gap-3 pt-2">{[...Array(2)].map((_, i) => <div key={i} className="h-12 w-36 rounded-full bg-white/10" />)}</div>
      </div>
    </div>
  </section>
);

const HeroSection = ({ featuredMovie }) => {
  const navigate = useNavigate();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const trailerUrl = featuredMovie?.trailerUrl;
  const trailerMatch = trailerUrl?.match(/[?&]v=([^&]+)|youtu\.be\/([^?]+)/);
  const trailerId = trailerMatch?.[1] || trailerMatch?.[2];

  useEffect(() => {
    if (!trailerOpen) return undefined;
    const handleEscape = (event) => event.key === 'Escape' && setTrailerOpen(false);
    window.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [trailerOpen]);

  if (!featuredMovie) return <HeroSkeleton />;

  const { id, name, description, rating, genre, duration, releaseYear, backdrop, poster } = featuredMovie;
  const backgroundUrl = backdrop || poster || FALLBACK_BG;

  return (
    <section className="relative h-[70vh] min-h-[560px] overflow-hidden bg-[#09090b]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,9,20,0.22),transparent_28%),linear-gradient(90deg,rgba(9,9,11,0.9)_0%,rgba(9,9,11,0.72)_38%,rgba(9,9,11,0.28)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 flex h-full max-w-6xl items-center px-4 sm:px-8 lg:px-16"
      >
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {genre || 'Now Showing'}
          </div>

          <h1 className="mb-5 text-4xl font-black leading-none tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
            {name}
          </h1>

          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 font-semibold text-white/90">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              {typeof rating === 'number' ? rating.toFixed(1) : rating}
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/70">
              <Clock size={14} />
              {duration}
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/70">
              <Calendar size={14} />
              {releaseYear}
            </span>
          </div>

          <p className="mb-8 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
            {description || 'Experience this cinematic story in a premium movie-going environment.'}
          </p>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate(`/movies/${id}`)} className="btn-primary gap-2 px-6 py-3.5 text-sm sm:text-base">
              <Ticket size={18} />
              Book Tickets
            </button>
            <button type="button" onClick={() => trailerId && setTrailerOpen(true)} disabled={!trailerId} className="btn-secondary gap-2 px-6 py-3.5 text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-50">
              <Play size={18} className="fill-white" />
              Watch Trailer
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {trailerOpen && trailerId && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTrailerOpen(false)} role="dialog" aria-modal="true" aria-label={`${name} trailer`}>
            <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black" onClick={(event) => event.stopPropagation()}>
              <button type="button" onClick={() => setTrailerOpen(false)} aria-label="Close trailer" className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-red-600"><X size={18} /></button>
              <iframe title={`${name} trailer`} src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0`} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.68, behavior: 'smooth' })}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/55 transition-colors hover:text-white"
        aria-label="Scroll to movies"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.20em]">Scroll</span>
        <ChevronDown size={18} />
      </button>
    </section>
  );
};

export default HeroSection;
