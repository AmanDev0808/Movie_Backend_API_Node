import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { User, LogOut, LayoutDashboard, Ticket, Heart, Menu, X, Search, Home } from 'lucide-react';
import apiClient from '../api/api-client';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-white/8 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
  }`;

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchState, setSearchState] = useState({ loading: false, error: '', results: [] });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    if (!searchOpen || !searchTerm.trim()) {
      setSearchState({ loading: false, error: '', results: [] });
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      setSearchState({ loading: true, error: '', results: [] });
      try {
        const response = await apiClient.get('/movies', { params: { search: searchTerm.trim() } });
        const results = Array.isArray(response.data?.data) ? response.data.data.slice(0, 6) : [];
        setSearchState({ loading: false, error: '', results });
      } catch (error) {
        console.error('Movie search failed', error);
        setSearchState({ loading: false, error: 'Search is temporarily unavailable.', results: [] });
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchOpen, searchTerm]);

  const openSearch = () => {
    setSearchOpen(true);
    setMobileOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchTerm('');
  };

  const selectMovie = (movie) => {
    closeSearch();
    navigate(`/movies/${movie._id || movie.id}`);
  };

  const searchPanel = searchOpen && (
    <div className="absolute left-1/2 top-full mt-3 w-[min(92vw,30rem)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#111116]/98 p-2 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2 px-3 py-2">
        <Search size={16} className="shrink-0 text-white/45" />
        <input
          autoFocus
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(event) => event.key === 'Escape' && closeSearch()}
          placeholder="Search movies, actors, genres..."
          aria-label="Search movies"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        />
        <button type="button" onClick={closeSearch} aria-label="Close search" className="text-white/45 hover:text-white">
          <X size={16} />
        </button>
      </div>
      {searchTerm.trim() && (
        <div className="border-t border-white/8 pt-1">
          {searchState.loading && <p className="px-3 py-4 text-sm text-white/50">Searching...</p>}
          {searchState.error && <p className="px-3 py-4 text-sm text-red-300">{searchState.error}</p>}
          {!searchState.loading && !searchState.error && searchState.results.length === 0 && (
            <p className="px-3 py-4 text-sm text-white/50">No movies found.</p>
          )}
          {!searchState.loading && searchState.results.map((movie) => (
            <button
              type="button"
              key={movie._id || movie.id}
              onClick={() => selectMovie(movie)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/8"
            >
              <img src={movie.poster} alt="" className="h-12 w-8 rounded object-cover" loading="lazy" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">{movie.name}</span>
                <span className="block truncate text-xs text-white/45">{movie.genre || movie.language || 'Movie'}</span>
              </span>
              <span className="text-white/25">&#8594;</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? 'pt-3' : 'pt-4'
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full border px-3 sm:px-4 py-2.5 backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? 'border-white/10 bg-[#0d0d11]/80 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
              : 'border-white/0 bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/35 bg-red-500/10 text-sm font-black tracking-[-0.12em] text-red-400">
              C<span className="text-white/80">V</span>
            </span>
            <span className="text-lg font-black tracking-[0.22em] text-white/95">CINEVERSE</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navLinkClass} end>
              <Home size={15} />
              Home
            </NavLink>
            <NavLink to="/my-bookings" className={navLinkClass}>
              <Ticket size={15} />
              My Bookings
            </NavLink>
            <NavLink to="/watchlist" className={navLinkClass}>
              <Heart size={15} />
              Watchlist
              {watchlist.length > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                  {watchlist.length > 9 ? '9+' : watchlist.length}
                </span>
              )}
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <LayoutDashboard size={15} />
                Admin
              </NavLink>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              aria-label="Search movies"
              onClick={searchOpen ? closeSearch : openSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white/80 transition-colors hover:bg-white/8 hover:text-white"
            >
              <Search size={16} />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white/80 transition-colors hover:text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white">
                    <User size={14} />
                  </span>
                  {user.name}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-500/8 text-red-500 transition-colors hover:bg-red-500/14"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary px-5 py-2.5 text-sm">
                Sign In
              </Link>
            )}
          </div>
          {searchPanel}

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label="Search movies"
              onClick={searchOpen ? closeSearch : openSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80"
            >
              <Search size={16} />
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="relative md:hidden">{searchPanel}</div>

      {mobileOpen && (
        <div className="border-t border-white/8 bg-[#0d0d11]/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>
              <Home size={15} />
              Home
            </NavLink>
            <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <Ticket size={15} />
              My Bookings
            </NavLink>
            <NavLink to="/watchlist" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <Heart size={15} />
              Watchlist
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard size={15} />
                Admin
              </NavLink>
            )}

            {user ? (
              <>
                <NavLink to="/profile" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  <User size={15} />
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary mt-2 justify-center">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

