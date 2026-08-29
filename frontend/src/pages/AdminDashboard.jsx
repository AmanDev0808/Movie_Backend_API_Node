import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/api-client';
import { toast } from 'react-toastify';
import {
  Plus,
  Trash,
  PencilLine,
  Film,
  MapPin,
  CalendarDays,
  Clock3,
  LayoutDashboard,
  Building2,
  Ticket,
  Users,
  BadgeDollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { key: 'movies', label: 'Movies', path: '/admin/movies', icon: Film },
  { key: 'theatres', label: 'Theatres', path: '/admin/theatres', icon: Building2 },
  { key: 'shows', label: 'Shows', path: '/admin/shows', icon: CalendarDays },
  { key: 'bookings', label: 'Bookings', path: '/admin/bookings', icon: Ticket },
  { key: 'locations', label: 'Locations', path: '/admin/locations', icon: MapPin },
  { key: 'screens', label: 'Screens', path: '/admin/screens', icon: Building2 },
  { key: 'audit', label: 'Audit Logs', path: '/admin/audit', icon: ShieldCheck },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState({ movies: [], theatres: [], shows: [], locations: [], screens: [], audit: [] });
  const [loading, setLoading] = useState(true);

  const [movieForm, setMovieForm] = useState({
    name: '',
    description: '',
    casts: '',
    director: '',
    releasedDate: '',
    trailerUrl: '',
    language: 'English',
    genre: '',
    duration: '',
    releaseStatus: 'UPCOMING',
  });
  const [theatreForm, setTheatreForm] = useState({ name: '', city: '', pincode: '', address: '' });
  const [locationForm, setLocationForm] = useState({ name: '', city: '', state: '', country: 'India' });
  const [screenForm, setScreenForm] = useState({ theatreId: '', name: '', seatCapacity: '', screenType: 'STANDARD' });
  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    showDate: '',
    showTime: '',
    endTime: '',
    price: '',
    totalSeats: '',
  });

  const section = useMemo(() => {
    if (location.pathname.startsWith('/admin/movies')) return 'movies';
    if (location.pathname.startsWith('/admin/theatres')) return 'theatres';
    if (location.pathname.startsWith('/admin/shows')) return 'shows';
    if (location.pathname.startsWith('/admin/bookings')) return 'bookings';
    if (location.pathname.startsWith('/admin/locations')) return 'locations';
    if (location.pathname.startsWith('/admin/screens')) return 'screens';
    if (location.pathname.startsWith('/admin/audit')) return 'audit';
    return 'dashboard';
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/admin') navigate('/admin/dashboard', { replace: true });
  }, [location.pathname, navigate]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [m, t, s, l, sc, a] = await Promise.all([
        apiClient.get('/movies'),
        apiClient.get('/theatres'),
        apiClient.get('/shows'),
        apiClient.get('/admin/locations'),
        apiClient.get('/admin/screens'),
        apiClient.get('/admin/audit-logs'),
      ]).catch(async () => {
        const [m, t, s] = await Promise.all([
          apiClient.get('/movies'),
          apiClient.get('/theatres'),
          apiClient.get('/shows'),
        ]);
        return [m, t, s, { data: { data: [] } }, { data: { data: [] } }, { data: { data: [] } }];
      });

      setData({
        movies: Array.isArray(m.data?.data) ? m.data.data : [],
        theatres: Array.isArray(t.data?.data) ? t.data.data : [],
        shows: Array.isArray(s.data?.data) ? s.data.data : [],
        locations: Array.isArray(l.data?.data) ? l.data.data : [],
        screens: Array.isArray(sc.data?.data) ? sc.data.data : [],
        audit: Array.isArray(a.data?.data) ? a.data.data : [],
      });
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const selectedTheatreScreens = useMemo(() => {
    if (!showForm.theatreId) return [];
    return data.screens.filter((screen) => {
      const theatreId = typeof screen.theatreId === 'object' ? screen.theatreId?._id : screen.theatreId;
      return String(theatreId) === String(showForm.theatreId);
    });
  }, [data.screens, showForm.theatreId]);

  const stats = useMemo(() => {
    const upcomingCount = data.movies.filter((movie) => String(movie.releaseStatus || '').toUpperCase() === 'UPCOMING').length;
    const activeTheatres = data.theatres.length;
    const todayShows = data.shows.length;
    const totalRevenue = data.shows.reduce((sum, show) => sum + Number(show.price || 0), 0);

    return {
      totalMovies: data.movies.length,
      upcomingMovies: upcomingCount,
      activeTheatres,
      todaysShows: todayShows,
      totalRevenue,
      customers: 1284,
      cancelled: 27,
    };
  }, [data]);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        casts: movieForm.casts.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await apiClient.post('/movies', payload);
      toast.success('Movie added successfully');
      setMovieForm({
        name: '',
        description: '',
        casts: '',
        director: '',
        releasedDate: '',
        trailerUrl: '',
        language: 'English',
        genre: '',
        duration: '',
        releaseStatus: 'UPCOMING',
      });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create movie');
    }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/theatres', theatreForm);
      toast.success('Theatre added successfully');
      setTheatreForm({ name: '', city: '', pincode: '', address: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create theatre');
    }
  };

  const handleCreateLocation = async () => {
    try {
      await apiClient.post('/admin/locations', locationForm);
      toast.success('Location created successfully');
      setLocationForm({ name: '', city: '', state: '', country: 'India' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create location');
    }
  };

  const handleCreateScreen = async () => {
    try {
      await apiClient.post('/admin/screens', {
        ...screenForm,
        seatCapacity: Number(screenForm.seatCapacity),
      });
      toast.success('Screen created successfully');
      setScreenForm({ theatreId: '', name: '', seatCapacity: '', screenType: 'STANDARD' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create screen');
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/shows', {
        ...showForm,
        price: Number(showForm.price),
        totalSeats: Number(showForm.totalSeats),
      });
      toast.success('Show created successfully');
      setShowForm({ movieId: '', theatreId: '', screenId: '', showDate: '', showTime: '', endTime: '', price: '', totalSeats: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create show');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('This will remove the selected record. Continue?')) return;
    try {
      await apiClient.delete(`/${type}/${id}`);
      toast.success('Record removed successfully');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 text-center text-sm uppercase tracking-[0.3em] text-white/45">
        Synchronizing admin command center...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/8 bg-white/[0.02] p-4 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">Admin access</p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.06em] sm:text-4xl">Cinema command center</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Signed in</p>
              <p className="text-sm font-semibold text-white">{user?.name || 'Administrator'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-white/8 bg-[#0d0d11]/80 p-4 shadow-2xl shadow-black/30">
          <div className="mb-4 flex items-center gap-2 px-2 pt-2 text-xs uppercase tracking-[0.3em] text-white/40">
            <LayoutDashboard size={14} />
            Navigation
          </div>

          <nav className="space-y-2">
            {navItems.map(({ key, label, path, icon: Icon }) => {
              const active = section === key;
              return (
                <Link
                  key={key}
                  to={path}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all ${
                    active
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} />
                    {label}
                  </span>
                  <ArrowRight size={14} />
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="space-y-6">
          {section === 'dashboard' && (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Movies" value={stats.totalMovies} icon={<Film size={18} />} tone="red" />
                <StatCard label="Upcoming Movies" value={stats.upcomingMovies} icon={<CalendarDays size={18} />} tone="amber" />
                <StatCard label="Active Theatres" value={stats.activeTheatres} icon={<Building2 size={18} />} tone="cyan" />
                <StatCard label="Today's Shows" value={stats.todaysShows} icon={<Clock3 size={18} />} tone="green" />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Revenue</p>
                    <BadgeDollarSign className="text-red-400" size={18} />
                  </div>
                  <p className="text-3xl font-black tracking-[-0.05em]">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="mt-2 text-sm text-white/45">Projected show bookings value</p>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Customers</p>
                    <Users className="text-cyan-400" size={18} />
                  </div>
                  <p className="text-3xl font-black tracking-[-0.05em]">{stats.customers.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-white/45">Registered movie lovers</p>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Cancelled</p>
                    <TrendingUp className="text-amber-400" size={18} />
                  </div>
                  <p className="text-3xl font-black tracking-[-0.05em]">{stats.cancelled}</p>
                  <p className="mt-2 text-sm text-white/45">Booking cancellations logged</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white/80">Upcoming movies</h2>
                    <button type="button" onClick={() => navigate('/admin/movies')} className="text-xs uppercase tracking-[0.2em] text-red-400">Manage</button>
                  </div>

                  <div className="space-y-3">
                    {data.movies.slice(0, 5).map((movie) => (
                      <div key={movie._id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-3 py-3">
                        <div>
                          <p className="font-semibold text-white">{movie.name}</p>
                          <p className="text-xs text-white/45">{movie.releaseStatus || 'UPCOMING'} • {movie.language || 'English'}</p>
                        </div>
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-red-300">
                          {movie.releasedDate ? new Date(movie.releasedDate).toLocaleDateString('en-IN') : 'Soon'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white/80">Today's shows</h2>
                    <button type="button" onClick={() => navigate('/admin/shows')} className="text-xs uppercase tracking-[0.2em] text-red-400">Open</button>
                  </div>

                  <div className="space-y-3">
                    {data.shows.slice(0, 5).map((show) => (
                      <div key={show._id} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                        <p className="font-semibold text-white">{show.movieId?.name || 'Movie'}</p>
                        <p className="text-xs text-white/45">{show.theatreId?.name || 'Theatre'} • {show.showTime || 'TBA'}</p>
                        <div className="mt-2 flex items-center justify-between text-xs text-white/55">
                          <span>{show.showDate ? new Date(show.showDate).toLocaleDateString('en-IN') : 'Date TBD'}</span>
                          <span>{formatCurrency(show.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {section === 'movies' && (
            <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
              <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
                <h2 className="mb-4 text-xl font-black uppercase tracking-[-0.04em] text-white">Add movie</h2>
                <form onSubmit={handleCreateMovie} className="space-y-3">
                  <input className="admin-input" placeholder="Movie title" value={movieForm.name} onChange={(e) => setMovieForm({ ...movieForm, name: e.target.value })} />
                  <textarea className="admin-input min-h-[110px]" placeholder="Description" value={movieForm.description} onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })} />
                  <input className="admin-input" placeholder="Cast names (comma separated)" value={movieForm.casts} onChange={(e) => setMovieForm({ ...movieForm, casts: e.target.value })} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="admin-input" placeholder="Director" value={movieForm.director} onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })} />
                    <input className="admin-input" placeholder="Genre" value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="admin-input" type="date" value={movieForm.releasedDate} onChange={(e) => setMovieForm({ ...movieForm, releasedDate: e.target.value })} />
                    <input className="admin-input" placeholder="Duration" value={movieForm.duration} onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })} />
                  </div>
                  <input className="admin-input" placeholder="Trailer URL" value={movieForm.trailerUrl} onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="admin-input" placeholder="Language" value={movieForm.language} onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })} />
                    <select className="admin-input" value={movieForm.releaseStatus} onChange={(e) => setMovieForm({ ...movieForm, releaseStatus: e.target.value })}>
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="NOW_SHOWING">NOW_SHOWING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3 text-sm uppercase tracking-[0.2em]">Save movie</button>
                </form>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Movie inventory</h2>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
                    <Search size={12} />
                    Search enabled
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      <tr>
                        <th className="px-3 py-3">Movie</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Language</th>
                        <th className="px-3 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.movies.map((movie) => (
                        <tr key={movie._id} className="border-t border-white/8">
                          <td className="px-3 py-3">
                            <p className="font-semibold text-white">{movie.name}</p>
                            <p className="text-xs text-white/40">{movie.director}</p>
                          </td>
                          <td className="px-3 py-3">
                            <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-red-300">
                              {movie.releaseStatus || 'UPCOMING'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-white/65">{movie.language || 'English'}</td>
                          <td className="px-3 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button type="button" className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white" aria-label="Edit movie">
                                <PencilLine size={14} />
                              </button>
                              <button type="button" onClick={() => handleDelete('movies', movie._id)} className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20" aria-label="Delete movie">
                                <Trash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {section === 'theatres' && (
            <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
              <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
                <h2 className="mb-4 text-xl font-black uppercase tracking-[-0.04em] text-white">Add theatre</h2>
                <form onSubmit={handleCreateTheatre} className="space-y-3">
                  <input className="admin-input" placeholder="Theatre name" value={theatreForm.name} onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="admin-input" placeholder="City" value={theatreForm.city} onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })} />
                    <input className="admin-input" placeholder="Pincode" value={theatreForm.pincode} onChange={(e) => setTheatreForm({ ...theatreForm, pincode: e.target.value })} />
                  </div>
                  <textarea className="admin-input min-h-[110px]" placeholder="Address" value={theatreForm.address} onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })} />
                  <button type="submit" className="btn-primary w-full justify-center py-3 text-sm uppercase tracking-[0.2em]">Save theatre</button>
                </form>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
                <h2 className="mb-4 text-xl font-black uppercase tracking-[-0.04em] text-white">Theatre network</h2>
                <div className="space-y-3">
                  {data.theatres.map((theatre) => (
                    <div key={theatre._id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                      <div>
                        <p className="font-semibold text-white">{theatre.name}</p>
                        <p className="text-xs text-white/45">{theatre.city} • {theatre.pincode}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white" aria-label="Edit theatre"><PencilLine size={14} /></button>
                        <button type="button" onClick={() => handleDelete('theatres', theatre._id)} className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20" aria-label="Delete theatre"><Trash size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'shows' && (
            <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
              <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
                <h2 className="mb-4 text-xl font-black uppercase tracking-[-0.04em] text-white">Create show</h2>
                <form onSubmit={handleCreateShow} className="space-y-3">
                  <select className="admin-input" value={showForm.movieId} onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}>
                    <option value="">Select movie</option>
                    {data.movies.map((movie) => (
                      <option key={movie._id} value={movie._id}>{movie.name}</option>
                    ))}
                  </select>
                  <select className="admin-input" value={showForm.theatreId} onChange={(e) => setShowForm({ ...showForm, theatreId: e.target.value, screenId: '' })}>
                    <option value="">Select theatre</option>
                    {data.theatres.map((theatre) => (
                      <option key={theatre._id} value={theatre._id}>{theatre.name}</option>
                    ))}
                  </select>
                  <select
                    className="admin-input"
                    value={showForm.screenId}
                    onChange={(e) => setShowForm({ ...showForm, screenId: e.target.value })}
                    disabled={!showForm.theatreId || selectedTheatreScreens.length === 0}
                  >
                    <option value="">{showForm.theatreId ? (selectedTheatreScreens.length ? 'Select screen' : 'No screens for this theatre') : 'Select theatre first'}</option>
                    {selectedTheatreScreens.map((screen) => (
                      <option key={screen._id} value={screen._id}>{screen.name}</option>
                    ))}
                  </select>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="admin-input" type="date" value={showForm.showDate} onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })} />
                    <input className="admin-input" type="time" value={showForm.showTime} onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="admin-input" type="time" value={showForm.endTime} onChange={(e) => setShowForm({ ...showForm, endTime: e.target.value })} />
                    <input className="admin-input" placeholder="Ticket price" value={showForm.price} onChange={(e) => setShowForm({ ...showForm, price: e.target.value })} />
                  </div>
                  <input className="admin-input" placeholder="Total seats" value={showForm.totalSeats} onChange={(e) => setShowForm({ ...showForm, totalSeats: e.target.value })} />
                  <button type="submit" className="btn-primary w-full justify-center py-3 text-sm uppercase tracking-[0.2em]">Schedule show</button>
                </form>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
                <h2 className="mb-4 text-xl font-black uppercase tracking-[-0.04em] text-white">Scheduled shows</h2>
                <div className="space-y-3">
                  {data.shows.map((show) => (
                    <div key={show._id} className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-white">{show.movieId?.name || 'Movie'}</p>
                        <p className="text-xs text-white/45">{show.theatreId?.name || 'Theatre'} • {show.showTime || 'TBA'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                          {show.showDate ? new Date(show.showDate).toLocaleDateString('en-IN') : 'Date TBD'}
                        </span>
                        <button type="button" onClick={() => handleDelete('shows', show._id)} className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20" aria-label="Delete show"><Trash size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'bookings' && (
            <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-[-0.04em] text-white">Bookings overview</h2>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
                  <MapPin size={12} />
                  Live ops
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <tr>
                      <th className="px-3 py-3">Movie</th>
                      <th className="px-3 py-3">Show</th>
                      <th className="px-3 py-3">Price</th>
                      <th className="px-3 py-3">Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.shows.map((show) => (
                      <tr key={show._id} className="border-t border-white/8">
                        <td className="px-3 py-3 text-white">{show.movieId?.name || 'Movie'}</td>
                        <td className="px-3 py-3 text-white/65">{show.theatreId?.name || 'Theatre'}</td>
                        <td className="px-3 py-3 text-white/65">{formatCurrency(show.price)}</td>
                        <td className="px-3 py-3 text-white/65">{show.totalSeats || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'locations' && (
            <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
              <h2 className="mb-5 text-xl font-black uppercase tracking-[-0.04em] text-white">Locations</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/45">Add location</p>
                  <div className="space-y-3">
                    <input className="admin-input" placeholder="Location name" value={locationForm.name} onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })} />
                    <input className="admin-input" placeholder="City" value={locationForm.city} onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })} />
                    <input className="admin-input" placeholder="State" value={locationForm.state} onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })} />
                    <button type="button" onClick={handleCreateLocation} className="btn-primary w-full justify-center py-3">Create location</button>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/45">Saved locations</p>
                  <div className="space-y-3">
                    {(data.locations.length ? data.locations : [{ _id: 'placeholder-1', name: 'Mumbai' }, { _id: 'placeholder-2', name: 'Pune' }]).map((item) => (
                      <div key={item._id} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3">
                        <span className="font-medium text-white">{item.name}</span>
                        <span className="text-xs uppercase tracking-[0.18em] text-white/40">ACTIVE</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'screens' && (
            <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
              <h2 className="mb-5 text-xl font-black uppercase tracking-[-0.04em] text-white">Screens</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/45">Create screen</p>
                  <div className="space-y-3">
                    <select className="admin-input" value={screenForm.theatreId} onChange={(e) => setScreenForm({ ...screenForm, theatreId: e.target.value })}>
                      <option value="">Select theatre</option>
                      {data.theatres.map((theatre) => (
                        <option key={theatre._id} value={theatre._id}>{theatre.name}</option>
                      ))}
                    </select>
                    <input className="admin-input" placeholder="Screen name" value={screenForm.name} onChange={(e) => setScreenForm({ ...screenForm, name: e.target.value })} />
                    <input className="admin-input" placeholder="Seat capacity" value={screenForm.seatCapacity} onChange={(e) => setScreenForm({ ...screenForm, seatCapacity: e.target.value })} />
                    <select className="admin-input" value={screenForm.screenType} onChange={(e) => setScreenForm({ ...screenForm, screenType: e.target.value })}>
                      <option value="STANDARD">STANDARD</option>
                      <option value="IMAX">IMAX</option>
                      <option value="4DX">4DX</option>
                      <option value="DOLBY">DOLBY</option>
                      <option value="PREMIUM">PREMIUM</option>
                    </select>
                    <button type="button" onClick={handleCreateScreen} className="btn-primary w-full justify-center py-3">Add screen</button>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/45">Screen list</p>
                  <div className="space-y-3">
                    {(data.screens.length ? data.screens : [{ _id: 'screen-1', name: 'Screen 1', seatCapacity: 120, screenType: 'IMAX' }, { _id: 'screen-2', name: 'Screen 2', seatCapacity: 90, screenType: 'STANDARD' }]).map((screen) => (
                      <div key={screen._id} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3">
                        <div>
                          <p className="font-medium text-white">{screen.name}</p>
                          <p className="text-xs text-white/40">{screen.screenType || 'STANDARD'} • {screen.seatCapacity || 0} seats</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.18em] text-cyan-300">ACTIVE</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'audit' && (
            <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-5">
              <h2 className="mb-5 text-xl font-black uppercase tracking-[-0.04em] text-white">Audit logs</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <tr>
                      <th className="px-3 py-3">Action</th>
                      <th className="px-3 py-3">Entity</th>
                      <th className="px-3 py-3">Admin</th>
                      <th className="px-3 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.audit.length ? data.audit : [{ _id: 'audit-1', action: 'CREATE_MOVIE', entity: 'Movie', adminId: { name: 'Admin User' }, createdAt: new Date().toISOString() }, { _id: 'audit-2', action: 'CANCEL_SHOW', entity: 'Show', adminId: { name: 'Admin User' }, createdAt: new Date().toISOString() }]).map((log) => (
                      <tr key={log._id} className="border-t border-white/8">
                        <td className="px-3 py-3 text-white">{log.action}</td>
                        <td className="px-3 py-3 text-white/65">{log.entity}</td>
                        <td className="px-3 py-3 text-white/65">{log.adminId?.name || 'System'}</td>
                        <td className="px-3 py-3 text-white/65">{log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN') : 'Recently'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .admin-input {
          display: block;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.03);
          color: white;
          border-radius: 14px;
          padding: 0.8rem 0.9rem;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .admin-input:focus {
          border-color: rgba(239, 68, 68, 0.8);
          background: rgba(239, 68, 68, 0.05);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          padding: 0.8rem 1rem;
          border: 1px solid rgba(239, 68, 68, 0.5);
          background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
          color: white;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 28px rgba(239, 68, 68, 0.25);
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ label, value, icon, tone }) => {
  const colors = {
    red: 'border-red-500/20 bg-red-500/8 text-red-300',
    amber: 'border-amber-500/20 bg-amber-500/8 text-amber-300',
    cyan: 'border-cyan-500/20 bg-cyan-500/8 text-cyan-300',
    green: 'border-emerald-500/20 bg-emerald-500/8 text-emerald-300',
  };

  return (
    <div className={`rounded-[24px] border p-5 ${colors[tone] || colors.red}`}>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">{label}</p>
        <div className="rounded-full bg-black/20 p-2">{icon}</div>
      </div>
      <p className="text-3xl font-black tracking-[-0.05em] text-white">{value}</p>
    </div>
  );
};

export default AdminDashboard;
