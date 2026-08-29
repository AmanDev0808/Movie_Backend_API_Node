import React from 'react';
import { Star, Clock, Ticket, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie }) => {
  const { id, name, poster, genre, duration, rating } = movie;
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const saved = isInWatchlist(id);

  const handleNavigate = () => {
    navigate(`/movies/${id}`);
  };

  const handleToggleWatchlist = (e) => {
    e.stopPropagation();
    if (saved) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <article
      onClick={handleNavigate}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#111116] transition-all duration-200 hover:-translate-y-1 hover:border-red-500/25"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={poster}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/10 to-transparent" />

        <button
          type="button"
          onClick={handleToggleWatchlist}
          className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/80 transition-colors hover:bg-black/55 hover:text-white"
          aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart size={15} className={saved ? 'fill-red-500 text-red-500' : ''} />
        </button>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[11px] font-bold text-yellow-300">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {rating ? Number(rating).toFixed(1) : 'N/A'}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-4.5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
            <span>{genre || 'Drama'}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={11} />
              {duration || '120 min'}
            </span>
          </div>
          <h3 className="text-lg font-bold tracking-[-0.03em] text-white transition-colors group-hover:text-red-400">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button type="button" className="btn-primary flex-1 justify-center gap-2 py-2.5 text-sm">
            <Ticket size={15} />
            Book
          </button>
          <button type="button" className="btn-secondary px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.1em]">
            Info
          </button>
        </div>
      </div>
    </article>
  );
};

export default React.memo(MovieCard);

