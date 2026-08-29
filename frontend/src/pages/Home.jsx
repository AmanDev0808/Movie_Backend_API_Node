import React, { useState, useEffect } from 'react';
import apiClient from '../api/api-client';
import { dummyMovies } from '../data/dummyMovies';
import HeroSection from '../components/HeroSection';
import MovieSection from '../components/MovieSection';
import Footer from '../components/Footer';

const bahubaliPoster = '/bahubali-poster.jpg';

const normalizeReleaseStatus = (status) => {
  const value = String(status || '').trim().toLowerCase();

  if (['released', 'now showing', 'now_showing', 'nowshowing'].includes(value)) return 'Now Showing';
  if (['upcoming', 'coming soon', 'coming_soon', 'comingsoon'].includes(value)) return 'Coming Soon';
  if (['recommended', 'top pick', 'top_pick', 'featured'].includes(value)) return 'Recommended';

  return 'Now Showing';
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/movies');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const formattedMovies = response.data.data.map((movie) => {
          const dummyMatch = dummyMovies.find((m) => m.name.toLowerCase() === movie.name.toLowerCase()) || {};
          const isBahubali = String(movie.name || '').toLowerCase().includes('bahubali');
          return {
            id: movie._id || movie.id,
            name: movie.name,
            description: movie.description || dummyMatch.description || '',
            poster: isBahubali
              ? bahubaliPoster
              : (movie.poster || dummyMatch.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'),
            backdrop: movie.backdrop || movie.backdrop_path || dummyMatch.backdrop || null,
            genre: movie.genre || dummyMatch.genre || 'Action / Drama',
            duration: movie.duration || dummyMatch.duration || '120 Min',
            rating: movie.rating !== undefined ? movie.rating : (dummyMatch.rating !== undefined ? dummyMatch.rating : 8.5),
            releaseYear: movie.releaseYear || dummyMatch.releaseYear || new Date().getFullYear(),
            releaseStatus: normalizeReleaseStatus(movie.releaseStatus || dummyMatch.releaseStatus || 'Now Showing'),
          };
        });
        setMovies(formattedMovies);
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.response?.status === 429
        ? 'Too many requests right now. Please wait a moment and try again.'
        : 'We could not load movies right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <>
        <HeroSection featuredMovie={null} />
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-10 h-7 w-40 rounded-full bg-white/8" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#111116]">
                <div className="aspect-[2/3] animate-pulse bg-white/6" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 rounded-full bg-white/6" />
                  <div className="h-6 w-3/4 rounded bg-white/6" />
                  <div className="h-10 w-full rounded-full bg-white/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="rounded-[2rem] border border-white/8 bg-[#111116] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <h2 className="mb-2 text-2xl font-black text-white">Failed to load movies</h2>
          <p className="mb-6 text-sm leading-7 text-white/60">{error}</p>
          <button onClick={fetchMovies} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="rounded-[2rem] border border-white/8 bg-[#111116] p-8">
          <h2 className="text-2xl font-black text-white">No movies available</h2>
        </div>
      </div>
    );
  }

  const nowShowing = movies.filter((m) => String(m.releaseStatus).toLowerCase() === 'now showing');
  const upcoming = movies.filter((m) => String(m.releaseStatus).toLowerCase() === 'coming soon');
  const recommended = movies.filter((m) => String(m.releaseStatus).toLowerCase() === 'recommended');
  const featuredMovie = movies[0];

  return (
    <>
      <HeroSection featuredMovie={featuredMovie} />
      <div className="space-y-4 pb-12">
        {nowShowing.length > 0 && <MovieSection title="Now Showing" movies={nowShowing} />}
        {upcoming.length > 0 && <MovieSection title="Coming Soon" movies={upcoming} />}
        {recommended.length > 0 && <MovieSection title="Recommended" movies={recommended} />}
      </div>
      <Footer />
    </>
  );
};

export default Home;
