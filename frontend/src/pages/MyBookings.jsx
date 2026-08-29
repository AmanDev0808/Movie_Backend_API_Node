import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/api-client';
import { toast } from 'react-toastify';
import { 
  Hourglass, Search, SlidersHorizontal, ChevronLeft, ChevronRight, 
  CreditCard, Camera, AlertTriangle, RefreshCw, LogOut, Ticket, 
  CalendarCheck, CalendarRange, XCircle, Film
} from 'lucide-react';

// Subcomponents
import BookingCard from '../components/profile/BookingCard';
import FilterBar from '../components/profile/FilterBar';
import TicketModal from '../components/profile/TicketModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import AnimatedBackground from '../components/profile/AnimatedBackground';
import LoadingSkeleton from '../components/profile/LoadingSkeleton';
import EmptyState from '../components/profile/EmptyState';
import CountUpNumber from '../components/profile/CountUpNumber';

// Helper to get show start date-time
const getShowStartDateTime = (showDate, showTime) => {
  const baseDate = new Date(showDate);
  let hours = 0;
  let minutes = 0;

  const timeStr = (showTime || '').trim().toUpperCase();
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const ampm = match[3];
    if (ampm) {
      if (ampm === "PM" && hours < 12) {
        hours += 12;
      } else if (ampm === "AM" && hours === 12) {
        hours = 0;
      }
    }
  } else {
    const parts = timeStr.split(":");
    hours = parseInt(parts[0], 10) || 0;
    minutes = parseInt(parts[1] || "0", 10) || 0;
  }

  baseDate.setHours(hours, minutes, 0, 0);
  return baseDate;
};

const isShowPast = (showDate, showTime) => {
  const now = new Date();
  const showDateTime = getShowStartDateTime(showDate, showTime);
  return showDateTime <= now;
};

const MyBookings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjusted for 2-column grid

  const [selectedBookingForTicket, setSelectedBookingForTicket] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get('/bookings/my-bookings?page=1&limit=1000');
      if (data && data.success && data.data) {
        setAllBookings(data.data.bookings || []);
      } else {
        throw new Error('Failed to retrieve bookings.');
      }
    } catch (err) {
      console.error('Failed to fetch bookings', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const memberSince = useMemo(() => {
    if (!user?.id && !user?._id) return 'Joined July 2026';
    try {
      const id = user.id || user._id;
      const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Joined July 2026';
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = (updatedUser) => {
    updateUser(updatedUser);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    const targetId = bookingToCancel;
    setBookingToCancel(null);
    try {
      setCancellingId(targetId);
      const { data } = await apiClient.post(`/bookings/${targetId}/cancel`);
      if (data && data.success) {
        toast.success('Booking cancelled successfully!', { theme: 'dark' });
        setAllBookings(prev => 
          prev.map(b => b._id === targetId ? { ...b, status: 'CANCELLED', paymentStatus: 'REFUNDED' } : b)
        );
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.', { theme: 'dark' });
    } finally {
      setCancellingId(null);
    }
  };

  const downloadTicketSVG = (booking) => {
    const show = booking.showId || {};
    const movie = show.movieId || {};
    const theatre = show.theatreId || {};
    const formattedShowDate = show.showDate ? new Date(show.showDate).toLocaleDateString() : 'TBA';

    const svgString = `
      <svg width="600" height="300" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="300" rx="20" fill="#0c0c0c"/>
        <rect x="2" y="2" width="596" height="296" rx="18" stroke="#e50914" stroke-width="1.5" stroke-dasharray="6 3"/>
        <line x1="420" y1="0" x2="420" y2="300" stroke="#262626" stroke-width="2" stroke-dasharray="6 6"/>
        <circle cx="420" cy="0" r="14" fill="#000"/>
        <circle cx="420" cy="300" r="14" fill="#000"/>
        <text x="30" y="50" fill="#e50914" font-family="Arial" font-size="26" font-weight="900" letter-spacing="-1">CINEVERSE</text>
        <text x="30" y="70" fill="#444" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">DIGITAL ENTRY PASS</text>
        <text x="30" y="115" fill="#ffffff" font-family="Arial" font-size="22" font-weight="bold">${movie.name || 'Movie'}</text>
        <text x="30" y="165" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">THEATRE</text>
        <text x="30" y="182" fill="#ffffff" font-family="Arial" font-size="12" font-weight="bold">${theatre.name || 'TBA'}</text>
        <text x="240" y="165" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">DATE & TIME</text>
        <text x="240" y="182" fill="#ffffff" font-family="Arial" font-size="12" font-weight="bold">${formattedShowDate} at ${show.showTime || 'TBA'}</text>
        <text x="30" y="225" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">SEATS</text>
        <text x="30" y="242" fill="#e50914" font-family="Arial" font-size="14" font-weight="bold">${booking.seatNumbers ? booking.seatNumbers.join(', ') : 'TBA'}</text>
        <text x="180" y="225" fill="#555" font-family="Arial" font-size="9" font-weight="bold" letter-spacing="1">BOOKING ID</text>
        <text x="180" y="242" fill="#ffffff" font-family="Courier" font-size="10" font-weight="bold">${booking._id}</text>
        <text x="440" y="50" fill="#e50914" font-family="Arial" font-size="14" font-weight="900">STUB</text>
        <text x="440" y="70" fill="#ffffff" font-family="Arial" font-size="12" font-weight="bold">${(movie.name || 'Movie').substring(0, 12)}</text>
        <text x="440" y="105" fill="#555" font-family="Arial" font-size="8" font-weight="bold">SEATS</text>
        <text x="440" y="120" fill="#ffffff" font-family="Arial" font-size="11" font-weight="bold">${booking.seatNumbers ? booking.seatNumbers.join(',') : 'TBA'}</text>
        <rect x="440" y="150" width="130" height="35" fill="#151515"/>
        <rect x="448" y="155" width="4" height="25" fill="#444"/>
        <rect x="456" y="155" width="2" height="25" fill="#444"/>
        <rect x="460" y="155" width="5" height="25" fill="#444"/>
        <rect x="474" y="155" width="3" height="25" fill="#444"/>
        <rect x="482" y="155" width="7" height="25" fill="#444"/>
        <text x="440" y="230" fill="#10b981" font-family="Arial" font-size="9" font-weight="bold">STATUS: VERIFIED</text>
      </svg>
    `;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${booking._id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Cinematic Ticket Downloaded!', { theme: 'dark' });
  };

  // Header Statistics calculations
  const totalBookingsCount = allBookings.length;
  const upcomingCount = allBookings.filter(b => b.status === 'SUCCESS' && !isShowPast(b.showId?.showDate, b.showId?.showTime)).length;
  const completedCount = allBookings.filter(b => b.status === 'SUCCESS' && isShowPast(b.showId?.showDate, b.showId?.showTime)).length;
  const cancelledCount = allBookings.filter(b => b.status === 'CANCELLED').length;

  const filteredBookings = useMemo(() => {
    return allBookings
      .filter((b) => {
        if (statusFilter === 'UPCOMING') {
          if (b.status !== 'SUCCESS' || isShowPast(b.showId?.showDate, b.showId?.showTime)) return false;
        } else if (statusFilter === 'COMPLETED') {
          if (b.status !== 'SUCCESS' || !isShowPast(b.showId?.showDate, b.showId?.showTime)) return false;
        } else if (statusFilter !== 'ALL' && b.status !== statusFilter) {
          return false;
        }
        
        if (searchTerm.trim() !== '') {
          const query = searchTerm.toLowerCase();
          const movieName = (b.showId?.movieId?.name || '').toLowerCase();
          const theatreName = (b.showId?.theatreId?.name || '').toLowerCase();
          const bookingId = (b._id || '').toLowerCase();
          
          if (!movieName.includes(query) && !theatreName.includes(query) && !bookingId.includes(query)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'highestPrice') return b.totalCost - a.totalCost;
        if (sortBy === 'lowestPrice') return a.totalCost - b.totalCost;
        return 0;
      });
  }, [allBookings, searchTerm, statusFilter, sortBy]);

  const filteredPayments = useMemo(() => {
    return allBookings
      .filter((b) => {
        if (searchTerm.trim() !== '') {
          const query = searchTerm.toLowerCase();
          const movieName = (b.showId?.movieId?.name || '').toLowerCase();
          const theatreName = (b.showId?.theatreId?.name || '').toLowerCase();
          const bookingId = (b._id || '').toLowerCase();
          if (!movieName.includes(query) && !theatreName.includes(query) && !bookingId.includes(query)) return false;
        }
        return true;
      })
      .map(b => ({
        id: `PAY-${b._id.substring(10, 24).toUpperCase()}`,
        bookingId: b._id,
        movieName: b.showId?.movieId?.name || 'Untitled Movie',
        date: new Date(b.createdAt).toLocaleDateString(),
        amount: b.totalCost,
        status: b.paymentStatus || 'PENDING',
        method: 'Razorpay Digital'
      }))
      .sort((a, b) => {
        if (sortBy === 'highestPrice') return b.amount - a.amount;
        if (sortBy === 'lowestPrice') return a.amount - b.amount;
        return 0; // fallback to original sorting logic if needed
      });
  }, [allBookings, searchTerm, sortBy]);

  const totalPages = Math.max(1, Math.ceil((activeTab === 'bookings' ? filteredBookings.length : filteredPayments.length) / itemsPerPage));
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, sortBy, activeTab]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-6 glass p-8 rounded-[2.5rem] border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.05)]">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter">Connection Failed</h3>
          <p className="text-sm text-white/60">{error}</p>
        </div>
        <button onClick={fetchBookings} className="btn-primary w-full flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 w-full text-left"
    >
      <AnimatedBackground />

      {/* DASHBOARD HEADER */}
      <section className="relative glass p-6 md:p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-neutral-950/80 to-neutral-900/60 mb-8 overflow-hidden shadow-2xl flex flex-col xl:flex-row items-center xl:items-stretch gap-8 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* User Info Column */}
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left gap-4 z-10 w-full xl:w-1/3 xl:border-r border-white/10 xl:pr-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-blue-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 p-1 bg-neutral-950">
              <img src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80'} alt={user?.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <button onClick={() => setIsEditModalOpen(true)} className="absolute bottom-0 right-0 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-2.5 rounded-full cursor-pointer transition-all">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Welcome, {user?.name}</h2>
            <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mt-1">Member since {memberSince}</p>
          </div>
          <button onClick={handleLogout} className="mt-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer w-full xl:w-auto">
            <LogOut size={12} /> Sign Out
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 z-10 w-full">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex flex-col justify-between hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Bookings</span>
              <Ticket size={16} className="text-white" />
            </div>
            <h3 className="text-3xl font-black text-white mt-4"><CountUpNumber value={totalBookingsCount} /></h3>
          </div>
          
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-[2rem] p-5 flex flex-col justify-between hover:bg-blue-500/10 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Upcoming Movies</span>
              <CalendarRange size={16} className="text-blue-400" />
            </div>
            <h3 className="text-3xl font-black text-white mt-4"><CountUpNumber value={upcomingCount} /></h3>
          </div>

          <div className="bg-green-500/5 border border-green-500/20 rounded-[2rem] p-5 flex flex-col justify-between hover:bg-green-500/10 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Completed</span>
              <CalendarCheck size={16} className="text-green-400" />
            </div>
            <h3 className="text-3xl font-black text-white mt-4"><CountUpNumber value={completedCount} /></h3>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-5 flex flex-col justify-between hover:bg-red-500/10 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Cancelled</span>
              <XCircle size={16} className="text-red-400" />
            </div>
            <h3 className="text-3xl font-black text-white mt-4"><CountUpNumber value={cancelledCount} /></h3>
          </div>
        </div>
      </section>

      {/* FILTER AND SEARCH BAR */}
      <section className="mb-8">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </section>

      {/* BOOKING CARDS GRID */}
      <section className="min-h-[400px]">
        {paginatedBookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginatedBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onViewTicketClick={(b) => setSelectedBookingForTicket(b)}
                onDownloadTicketClick={downloadTicketSVG}
                isPast={isShowPast(booking.showId?.showDate, booking.showId?.showTime)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            isFiltered={searchTerm !== '' || statusFilter !== 'ALL'}
            onReset={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
          />
        )}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/10 mt-8">
          <p className="text-xs font-semibold text-white/40">
            Page <span className="text-white font-extrabold">{currentPage}</span> of <span className="text-white font-extrabold">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-red-500/30 text-white hover:bg-white/10 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-500'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-red-500/30 text-white hover:bg-white/10 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      <TicketModal
        isOpen={!!selectedBookingForTicket}
        booking={selectedBookingForTicket}
        onClose={() => setSelectedBookingForTicket(null)}
      />

    </motion.div>
  );
};

export default MyBookings;
