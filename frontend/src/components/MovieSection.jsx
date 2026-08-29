import React from 'react';
import MovieCard from './MovieCard';

const MovieSection = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2 text-red-400">Browse</p>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">{title}</h2>
        </div>
        <span className="hidden text-sm text-white/45 sm:inline-block">
          {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
        </span>
      </div>

      <div className="no-scrollbar overflow-x-auto pb-2 md:overflow-visible">
        <div className="grid min-w-[260px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSection;
