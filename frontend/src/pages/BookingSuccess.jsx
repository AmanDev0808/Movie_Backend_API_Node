import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../api/api-client';
import { dummyMovies } from '../data/dummyMovies';
import { CheckCircle, Calendar, MapPin, Ticket, CreditCard, ArrowLeft, Download, Film, AlertTriangle } from 'lucide-react';
import './SeatSelection.css'; // Reuse CSS rules for ticket styling and print setups
import './MovieDetails.css'; // For glass-panel utility class

// Confetti canvas particles component
const ConfettiEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff'];
    const particles = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 4 + 2,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 8 - 4,
      tiltAngleIncremental: Math.random() * 0.05 + 0.02,
      tiltAngle: 0
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3.5 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 12;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      // Update position
      particles.forEach(p => {
        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />;
};

// Numeric seat label helper
const getRowAndCol = (seatNumber) => {
  const index = seatNumber - 1;
  const rowCode = Math.floor(index / 10);
  const rowLetter = String.fromCharCode(65 + rowCode);
  const colNumber = (index % 10) + 1;
  return { rowLetter, colNumber };
};

const getSeatLabel = (seatNumber) => {
  const { rowLetter, colNumber } = getRowAndCol(seatNumber);
  return `${rowLetter}${colNumber}`;
};

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve payment reference from route state transitions
  const passedPaymentId = location.state?.paymentId;

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/bookings/${bookingId}`);
        setBooking(data.data);
      } catch (err) {
        console.error("Failed to load booking details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleDownloadTicket = () => {
    // Triggers standard system print dialog
    window.print();
  };

  const formattedDate = useMemo(() => {
    if (!booking?.showId?.showDate) return '';
    const date = new Date(booking.showId.showDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [booking]);

  const posterUrl = useMemo(() => {
    if (!booking?.showId?.movieId) return '';
    const dummyMatch = dummyMovies.find(m => m.name.toLowerCase() === booking.showId.movieId.name.toLowerCase()) || {};
    return booking.showId.movieId.poster || dummyMatch.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80';
  }, [booking]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-black uppercase tracking-widest text-white/50 animate-pulse">
          Generating Digital Ticket...
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 glass-panel rounded-[2.5rem] border border-white/5 space-y-4 text-white">
        <AlertTriangle size={48} className="text-red-500 mx-auto" />
        <h2 className="text-2xl font-black uppercase tracking-tight">Booking Not Found</h2>
        <p className="text-white/50 text-sm">We couldn't find this booking. It may have expired or been cancelled.</p>
        <Link to="/" className="btn-primary inline-block py-3 px-8 rounded-full text-xs font-black uppercase tracking-widest mt-2">
          Return Home
        </Link>
      </div>
    );
  }

  const paymentReference = passedPaymentId || booking.paymentId || `pay_${Math.random().toString(36).substring(2, 14)}`;

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-12 px-4 relative z-10 select-none text-white">
      {/* Burst celebration confetti */}
      <ConfettiEffect />

      {/* Confirmation header message */}
      <div className="text-center mb-8 no-print">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className="bg-green-600/10 border border-green-500/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        >
          <CheckCircle size={36} className="text-green-500" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic"
        >
          Booking Confirmed!
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-white/50 text-sm sm:text-base font-medium mt-1.5"
        >
          Grab your snacks, {booking.userId.name.split(' ')[0]}! Your seats are secure.
        </motion.p>
      </div>

      {/* Premium Digital Ticket */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.25 }}
        className="ticket-card print-ticket-area max-w-md mx-auto"
      >
        {/* Ticket Header Banner (Blurred movie poster backdrop) */}
        <div className="relative p-6 sm:p-8 flex gap-5 border-b border-white/5 overflow-hidden">
          {/* Backdrop fill */}
          <div className="absolute inset-0 z-0 opacity-15 filter blur-md select-none pointer-events-none">
            <img src={posterUrl} className="w-full h-full object-cover scale-110" alt="" />
          </div>

          <div className="w-16 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0 relative z-10 shadow-md">
            <img src={posterUrl} className="w-full h-full object-cover" alt="" />
          </div>

          <div className="text-left space-y-1 relative z-10 flex flex-col justify-center">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-red-500">
              Admit One
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight line-clamp-1">
              {booking.showId.movieId.name}
            </h3>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40 flex items-center gap-1.5 pt-0.5">
              <Film size={12} />
              {booking.showId.movieId.genre || 'Action/Drama'}
            </p>
          </div>
        </div>

        {/* Separator Tear Notches */}
        <div className="relative w-full h-0 flex items-center z-20">
          <div className="ticket-notch-left top-[-14px]"></div>
          <div className="ticket-notch-right top-[-14px]"></div>
          <div className="ticket-divider"></div>
        </div>

        {/* Ticket Body Content */}
        <div className="p-6 sm:p-8 grid grid-cols-12 gap-6 items-center text-left">
          {/* Details Column */}
          <div className="col-span-8 space-y-4">
            <div className="space-y-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Theatre & Screen</div>
              <div className="text-xs font-black uppercase text-white truncate">
                {booking.showId.theatreId.name}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-red-500">
                Screen 1
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Date</div>
                <div className="text-xs font-extrabold text-white">
                  {formattedDate}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Time</div>
                <div className="text-xs font-extrabold text-white">
                  {booking.showId.showTime}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Seats Reservation ({booking.seatNumbers.length})</div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {booking.seatNumbers.map(n => (
                  <span key={n} className="bg-white/5 border border-white/10 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {getSeatLabel(n)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Side Layout */}
          <div className="col-span-4 flex flex-col items-center justify-center gap-1.5 pl-3 border-l border-white/5">
            <svg width="85" height="85" viewBox="0 0 29 29" className="text-white fill-current opacity-85 bg-white p-1.5 rounded-xl qr-code-glow">
              <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2zm19-2h7v7h-7zm1 1v5h5V1zm1 1h3v3h-3zM0 21h7v7H0zm1 1v5h5v-5zm1 1h3v3H2z" />
              <path d="M9 1h1v1H9zm2 0h1v1h-1zm1 2h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zm-3 2h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm-5 2h1v2h-1zm2 1h1v1h-1zm1 1h1v1h-1zm1-2h2v1h-2zm0 2h1v1h-1zm3-2h1v3h-1zm-2 2h1v1h-1zm-9 3h1v1H9zm2 0h2v1h-2zm1 2h1v1h-1zm2-2h1v1h-1zm0 2h2v1h-2zm3-2h1v1h-1zm0 2h1v1h-1zm2-2h1v2h-1zm2 1h1v1h-1zm0-3h1v1h-1zm2 0h1v1h-1zm-1 3h2v1h-2z" />
            </svg>
            <span className="text-[7px] font-mono opacity-25 text-center mt-1 uppercase truncate w-20">
              Ref: {paymentReference.substring(0, 12)}
            </span>
          </div>
        </div>

        {/* Pricing split footer */}
        <div className="px-6 sm:px-8 py-4.5 bg-red-650/10 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-red-500" />
            <span className="font-black uppercase tracking-widest text-[9px] text-white/50">Amount Paid</span>
          </div>
          <div className="text-xl font-black italic text-red-500">₹{booking.totalCost}</div>
        </div>

        {/* Barcode Footer design */}
        <div className="px-6 sm:px-8 py-5 border-t border-white/5 flex flex-col gap-2 bg-neutral-950/20 text-center items-center">
          <div className="w-full flex justify-between items-stretch h-8 opacity-45 px-2">
            {Array.from({ length: 42 }).map((_, i) => {
              const width = i % 3 === 0 ? '1px' : i % 5 === 0 ? '3px' : '2px';
              return <div key={i} className="barcode-line" style={{ width }} />;
            })}
          </div>
          <span className="text-[8px] font-mono opacity-25 uppercase tracking-widest">
            Booking ID: {booking._id}
          </span>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto no-print">
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadTicket}
          className="flex-1 btn-primary py-4.5 text-center font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={16} />
          <span>Download Ticket</span>
        </motion.button>
        <Link 
          to="/my-bookings" 
          className="flex-1 glass-panel hover:bg-white/10 py-4.5 text-center font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10 transition-colors"
        >
          View Bookings
        </Link>
      </div>

      <div className="mt-4 text-center no-print">
        <Link 
          to="/" 
          className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Go back to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
