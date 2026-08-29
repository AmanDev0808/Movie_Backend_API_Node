import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/api-client';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { 
  Armchair, CreditCard, ArrowLeft, 
  Clock, AlertTriangle, ChevronUp, 
  ChevronDown, CheckCircle, Ticket 
} from 'lucide-react';
import './SeatSelection.css';

// Pure helper to convert numerical seat ID to row letter & column index
const getRowAndCol = (seatNumber) => {
  const index = seatNumber - 1; // 0-indexed
  const rowCode = Math.floor(index / 10); // 10 seats per row
  const rowLetter = String.fromCharCode(65 + rowCode); // 65 is 'A'
  const colNumber = (index % 10) + 1;
  return { rowLetter, colNumber };
};

const getSeatLabel = (seatNumber) => {
  const { rowLetter, colNumber } = getRowAndCol(seatNumber);
  return `${rowLetter}${colNumber}`;
};

const isSeatVIP = (seatNumber) => {
  // First 20 seats (Rows A & B) are VIP
  return seatNumber <= 20;
};

const isSeatReserved = (seatNumber) => {
  const { colNumber } = getRowAndCol(seatNumber);
  // Column 7 and 8 are reserved sections
  return colNumber === 7 || colNumber === 8;
};

// Seat Button Component (Memoized for grid performance)
const SeatButton = ({ 
  seat, 
  isSelected, 
  isBooked, 
  isReservedState, 
  isVIPState, 
  rowIndex, 
  colIndex, 
  onToggle, 
  onKeyDown 
}) => {
  const seatType = isBooked 
    ? 'Booked' 
    : isSelected 
      ? 'Selected' 
      : isReservedState 
        ? 'Reserved' 
        : isVIPState 
          ? 'VIP' 
          : 'Available';

  const styleClasses = useMemo(() => {
    switch (seatType) {
      case 'Booked':
        return 'bg-neutral-900 border-transparent text-neutral-800 opacity-20 cursor-not-allowed';
      case 'Reserved':
        return 'bg-amber-500/10 border-amber-500/25 text-amber-500/50 cursor-not-allowed';
      case 'Selected':
        return 'bg-gradient-to-tr from-red-650 to-red-550 border-red-500 text-white seat-selected-glow shadow-[0_0_15px_rgba(229,9,20,0.6)]';
      case 'VIP':
        return 'bg-yellow-500/5 border-yellow-500/30 text-yellow-500/80 hover:bg-yellow-500/15 hover:border-yellow-500/50';
      default:
        return 'bg-white/5 border-white/10 text-white/40 hover:bg-white/15 hover:border-white/20';
    }
  }, [seatType]);

  const isDisabled = isBooked || isReservedState;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onToggle(seat.seatNumber)}
      onKeyDown={(e) => onKeyDown(e, rowIndex, colIndex)}
      data-seat-id={seat.seatNumber}
      tabIndex={isDisabled ? -1 : 0}
      className={`
        w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-300 relative group seat-focus-ring cursor-pointer
        ${styleClasses}
      `}
      aria-label={`Seat ${getSeatLabel(seat.seatNumber)} - ${seatType}`}
    >
      <Armchair size={16} className={isSelected ? 'scale-110' : ''} />
      {!isDisabled && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-red-650 font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-md">
          {getSeatLabel(seat.seatNumber)}
        </span>
      )}
    </button>
  );
};

const SeatSelection = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Payment Status Overlay states (IDLE, PREPARING, WAITING, VERIFYING, FAILED)
  const [paymentStatus, setPaymentStatus] = useState('IDLE');
  const [paymentError, setPaymentError] = useState('');

  // Timer States
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showTimerModal, setShowTimerModal] = useState(false);

  // Mobile Drawer Toggle
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Load show details & seat layout
  useEffect(() => {
    const fetchShowAndSeats = async () => {
      try {
        setLoading(true);
        const showRes = await apiClient.get(`/shows/${showId}`);
        setShow(showRes.data.data);

        const seatRes = await apiClient.get(`/shows/${showId}/seats`);
        setSeats(seatRes.data.data.seats);
      } catch (error) {
        toast.error('Failed to load seats layout');
      } finally {
        setLoading(false);
      }
    };
    fetchShowAndSeats();
  }, [showId]);

  // Countdown timer logic (pauses during payments)
  useEffect(() => {
    if (loading || processing || showTimerModal || paymentStatus !== 'IDLE') return;

    if (timeLeft <= 0) {
      setShowTimerModal(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, processing, showTimerModal, paymentStatus]);

  // Group seats by sorted rows & columns
  const seatsGrid = useMemo(() => {
    if (!seats || seats.length === 0) return [];
    
    const rows = {};
    seats.forEach(seat => {
      const { rowLetter, colNumber } = getRowAndCol(seat.seatNumber);
      if (!rows[rowLetter]) rows[rowLetter] = [];
      rows[rowLetter].push({
        ...seat,
        rowLetter,
        colNumber
      });
    });

    Object.keys(rows).forEach(row => {
      rows[row].sort((a, b) => a.colNumber - b.colNumber);
    });

    const sortedRowLetters = Object.keys(rows).sort();
    return sortedRowLetters.map(row => rows[row]);
  }, [seats]);

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 10) {
        toast.warn('Maximum selection limit is 10 tickets');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Keyboard navigation inside grid
  const handleGridKeyDown = (e, rowIndex, colIndex) => {
    let targetRow = rowIndex;
    let targetCol = colIndex;

    switch (e.key) {
      case 'ArrowUp':
        targetRow = rowIndex - 1;
        break;
      case 'ArrowDown':
        targetRow = rowIndex + 1;
        break;
      case 'ArrowLeft':
        targetCol = colIndex - 1;
        break;
      case 'ArrowRight':
        targetCol = colIndex + 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const targetedSeat = seatsGrid[rowIndex]?.[colIndex];
        if (targetedSeat && !targetedSeat.isAvailable === false && !isSeatReserved(targetedSeat.seatNumber)) {
          toggleSeat(targetedSeat.seatNumber);
        }
        return;
      default:
        return;
    }

    if (seatsGrid[targetRow]?.[targetCol]) {
      e.preventDefault();
      const seatNum = seatsGrid[targetRow][targetCol].seatNumber;
      const targetBtn = document.querySelector(`[data-seat-id="${seatNum}"]`);
      if (targetBtn) targetBtn.focus();
    }
  };

  // Calculations
  const pricingData = useMemo(() => {
    if (!show) return { subtotal: 0, fees: 0, taxes: 0, grandTotal: 0 };
    
    let subtotal = 0;
    selectedSeats.forEach(seatNum => {
      subtotal += isSeatVIP(seatNum) ? show.price + 100 : show.price;
    });

    const fees = selectedSeats.length * 30; // 30 Booking Fee per ticket
    const taxes = Math.round(subtotal * 0.18); // 18% GST on subtotal
    const grandTotal = subtotal + fees + taxes;

    return { subtotal, fees, taxes, grandTotal };
  }, [selectedSeats, show]);

  const handleBookingAndPayment = async () => {
    if (selectedSeats.length === 0) return toast.warn('Please select at least one seat');
    
    // Prevent double clicking
    if (processing && paymentStatus !== 'FAILED') return;

    setProcessing(true);
    setPaymentStatus('PREPARING');
    setPaymentError('');

    try {
      // 1. Create Booking
      const bookingRes = await apiClient.post('/bookings', {
        showId: showId,
        seatNumbers: selectedSeats
      });
      const booking = bookingRes.data.data;

      // 2. Create Payment Order
      const paymentRes = await apiClient.post('/payments/create-order', {
        bookingId: booking._id
      });
      const order = paymentRes.data.data;

      setPaymentStatus('WAITING');

      // 3. Initiate Razorpay Checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'CINEVERSE',
        description: `Booking for ${show.movieId.name}`,
        order_id: order.orderId,
        handler: async function (response) {
          setPaymentStatus('VERIFYING');
          
          let verified = false;
          let retries = 3;
          let verificationError = '';

          while (retries > 0 && !verified) {
            try {
              await apiClient.post("/payments/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              verified = true;
            } catch (err) {
              retries--;
              verificationError = err.response?.data?.message || 'Verification failed';
              if (retries > 0) {
                toast.info(`Retrying payment verification... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 3000));
              }
            }
          }

          if (verified) {
            toast.success("Payment Successful!");
            setPaymentStatus('IDLE');
            setProcessing(false);
            navigate(`/success/${booking._id}`, { state: { paymentId: response.razorpay_payment_id } });
          } else {
            setPaymentStatus('FAILED');
            setPaymentError(verificationError || 'Verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            setPaymentStatus('FAILED');
            setPaymentError('Payment authorization was cancelled by the user.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#e50914'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setPaymentStatus('FAILED');
      setPaymentError(error.response?.data?.message || 'Payment Order initialization failed');
    }
  };

  const handleTimerExpirationClose = () => {
    setShowTimerModal(false);
    navigate(`/movies/${show?.movieId?._id || ''}`);
  };

  // Format timeLeft to MM:SS
  const formattedTimeLeft = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  // Circle progress color configurations
  const timerCircleProps = useMemo(() => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (timeLeft / 600) * circumference;

    let color = '#10b981'; // Green
    if (timeLeft <= 300 && timeLeft > 120) {
      color = '#f59e0b'; // Yellow
    } else if (timeLeft <= 120) {
      color = '#ef4444'; // Red
    }

    return { strokeDashoffset, strokeDasharray: circumference, color };
  }, [timeLeft]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-pulse">
        {/* Header loading */}
        <div className="h-24 bg-neutral-900/60 border border-white/5 rounded-3xl skeleton-shimmer"></div>
        {/* Workspace grid loading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-neutral-900/40 border border-white/5 rounded-[2.5rem] skeleton-shimmer"></div>
          <div className="lg:col-span-4 h-96 bg-neutral-900/40 border border-white/5 rounded-[2.5rem] skeleton-shimmer"></div>
        </div>
      </div>
    );
  }

  if (!show || seats.length === 0) {
    // Empty state layout
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-6 glass-panel rounded-[2.5rem] border border-white/5 space-y-8 select-none shadow-2xl">
        <div className="w-24 h-24 rounded-full bg-red-650/10 flex items-center justify-center text-red-500 mx-auto animate-bounce">
          <AlertTriangle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">No Seats Available</h2>
          <p className="text-white/40 text-sm font-medium">This show doesn't have any seats configured or show selection is inactive.</p>
        </div>
        <button
          onClick={() => navigate(`/movies/${show?.movieId?._id || ''}`)}
          className="btn-primary w-full py-4.5 text-base font-black tracking-wider uppercase rounded-full shadow-lg cursor-pointer"
        >
          Choose Another Show
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 space-y-8 min-h-screen text-white select-none">
      {/* Header Container */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl gap-4">
        <div className="flex items-center gap-4 text-left">
          <button 
            onClick={() => navigate(`/movies/${show.movieId._id}`)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white border border-white/5 cursor-pointer transition-colors"
            aria-label="Back to movie details"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
              {show.movieId.name}
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-white/40 mt-1 flex flex-wrap gap-x-2 gap-y-1">
              <span>{show.theatreId.name}</span>
              <span className="text-red-500">•</span>
              <span>{show.showTime}</span>
            </p>
          </div>
        </div>

        {/* Circular Countdown Timer */}
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-full shadow-md shrink-0">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="22"
                className="stroke-white/5 fill-none stroke-[2]"
              />
              <circle
                cx="24"
                cy="24"
                r="22"
                className="fill-none stroke-[3] countdown-circle"
                stroke={timerCircleProps.color}
                strokeDasharray={timerCircleProps.strokeDasharray}
                strokeDashoffset={timerCircleProps.strokeDashoffset}
              />
            </svg>
            <span className="absolute text-[11px] font-black text-white/90">
              {formattedTimeLeft.split(':')[0]}m
            </span>
          </div>
          <div className="text-left text-[10px] leading-tight font-black uppercase tracking-wider">
            <div className="text-white/40">Seats Lock</div>
            <div className="text-white text-base tracking-tighter italic">
              {formattedTimeLeft}
            </div>
          </div>
        </div>
      </header>

      {/* Main Section Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Seat Layout Board */}
        <section className="lg:col-span-8 glass-panel p-6 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
          
          {/* Legend row */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-16 text-[10px] font-black uppercase tracking-wider text-white/50 bg-white/[0.01] border border-white/5 px-6 py-3 rounded-full">
            <div className="flex items-center gap-2"><Armchair size={14} className="text-white/40 bg-white/5 border border-white/10 rounded p-0.5" /> Available</div>
            <div className="flex items-center gap-2"><Armchair size={14} className="text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/30 rounded p-0.5" /> VIP</div>
            <div className="flex items-center gap-2"><Armchair size={14} className="text-white bg-gradient-to-tr from-red-650 to-red-550 border border-red-500 rounded p-0.5" /> Selected</div>
            <div className="flex items-center gap-2"><Armchair size={14} className="text-amber-500/50 bg-amber-500/10 border border-amber-500/25 rounded p-0.5 cursor-not-allowed" /> Reserved</div>
            <div className="flex items-center gap-2"><Armchair size={14} className="text-neutral-800 bg-neutral-900 border border-transparent rounded p-0.5 cursor-not-allowed opacity-20" /> Booked</div>
          </div>

          {/* Screen curve rendering */}
          <div className="w-full max-w-lg mb-20 space-y-4 text-center cinema-screen-container">
            <div className="curved-cinema-screen"></div>
            {/* Soft Reflection glow and project beam */}
            <div className="w-full h-8 screen-reflection-glow absolute left-1/2 -translate-x-1/2 top-28 sm:top-32"></div>
            <div className="w-full h-32 projection-beam absolute left-1/2 -translate-x-1/2 top-10"></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
              Cinema Screen
            </div>
          </div>

          {/* Seats Layout Matrix */}
          <div 
            role="grid" 
            aria-label="Cinema Seat Layout Grid" 
            className="flex flex-col gap-3.5 max-w-full overflow-x-auto pb-4 px-2 no-scrollbar"
          >
            {seatsGrid.map((rowSeats, rIdx) => {
              const rowLetter = rowSeats[0]?.rowLetter || '';
              return (
                <div key={rIdx} role="row" className="flex items-center gap-3.5">
                  {/* Left row labels */}
                  <span className="w-6 text-sm font-black text-white/30 uppercase text-center block">
                    {rowLetter}
                  </span>

                  {/* Row Seat buttons grid */}
                  <div className="flex items-center gap-3.5">
                    {rowSeats.map((seat, cIdx) => {
                      const isSelected = selectedSeats.includes(seat.seatNumber);
                      const isBooked = !seat.isAvailable;
                      const isReservedState = isSeatReserved(seat.seatNumber);
                      const isVIPState = isSeatVIP(seat.seatNumber);

                      // Break aisle spacing (adds wider spacing after 3rd and 7th columns for theater look)
                      const needsAisle = seat.colNumber === 3 || seat.colNumber === 7;

                      return (
                        <div key={seat.seatNumber} className="flex items-center">
                          <SeatButton
                            seat={seat}
                            isSelected={isSelected}
                            isBooked={isBooked}
                            isReservedState={isReservedState}
                            isVIPState={isVIPState}
                            rowIndex={rIdx}
                            colIndex={cIdx}
                            onToggle={toggleSeat}
                            onKeyDown={handleGridKeyDown}
                          />
                          {needsAisle && (
                            <div className="w-6 shrink-0" aria-hidden="true"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right row labels */}
                  <span className="w-6 text-sm font-black text-white/30 uppercase text-center block">
                    {rowLetter}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: Desktop Booking Summary Card (tall sidebar) */}
        <aside className="lg:col-span-4 hidden lg:block sticky top-8 glass-panel p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-left space-y-6">
          <div className="space-y-1.5 pb-5 border-b border-white/10">
            <h3 className="text-2xl font-black uppercase text-white tracking-tight leading-none">
              Summary
            </h3>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider">
              Screen 1 • Standard
            </p>
          </div>

          <div className="space-y-4 text-sm font-medium">
            {/* Movie / Theatre */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Movie</span>
              <span className="text-white font-black text-right line-clamp-1">{show.movieId.name}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Theatre</span>
              <span className="text-white font-black text-right line-clamp-1">{show.theatreId.name}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Showtime</span>
              <span className="text-white font-black text-right">{show.showTime}</span>
            </div>

            {/* Selected seat chips list */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="text-white/40 text-xs font-bold uppercase tracking-wider">Seats Selected ({selectedSeats.length})</div>
              {selectedSeats.length === 0 ? (
                <div className="text-xs text-white/20 italic">No seats selected</div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1 max-h-24 overflow-y-auto no-scrollbar">
                  {selectedSeats.map(seat => (
                    <span 
                      key={seat}
                      className={`text-xs font-black uppercase px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm
                        ${isSeatVIP(seat) 
                          ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500' 
                          : 'bg-red-650/10 border-red-500/20 text-red-500'
                        }
                      `}
                    >
                      {getSeatLabel(seat)} {isSeatVIP(seat) && <span className="text-[9px] opacity-70">VIP</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing breakdowns */}
          <div className="pt-5 border-t border-white/10 space-y-3 text-xs font-bold uppercase tracking-wider text-white/50">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-black">₹{pricingData.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Fee</span>
              <span className="text-white font-black">₹{pricingData.fees}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (18% GST)</span>
              <span className="text-white font-black">₹{pricingData.taxes}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-white/5 text-sm font-black text-white tracking-wide">
              <span className="text-red-500">Grand Total</span>
              <span className="text-red-500 text-2xl tracking-tighter italic font-black">₹{pricingData.grandTotal}</span>
            </div>
          </div>

          {/* Large Action Continue Button */}
          <motion.button
            whileHover={{ scale: selectedSeats.length === 0 ? 1 : 1.025, boxShadow: selectedSeats.length === 0 ? "none" : "0 0 20px rgba(229, 9, 20, 0.4)" }}
            whileTap={{ scale: selectedSeats.length === 0 ? 1 : 0.98 }}
            disabled={processing || selectedSeats.length === 0}
            onClick={handleBookingAndPayment}
            className={`
              w-full py-4.5 bg-gradient-to-r from-red-600 to-red-750 hover:from-red-700 hover:to-red-800 text-white font-black uppercase tracking-wider text-base rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              ${processing ? 'animate-pulse' : ''}
            `}
          >
            {processing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CreditCard size={18} className="fill-white" />
                <span>Continue to Payment</span>
              </>
            )}
          </motion.button>
        </aside>
      </div>

      {/* Floating Summary Bottom Sheet for Mobile Screen sizes */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl p-4 flex flex-col gap-4 pointer-events-auto">
        
        {/* Toggle trigger bar */}
        <button
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-white/50 border-b border-white/5 pb-2"
        >
          <span className="flex items-center gap-1.5">
            <Ticket size={14} />
            Summary ({selectedSeats.length} Seats)
          </span>
          <span className="flex items-center gap-1">
            {isMobileSummaryOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </span>
        </button>

        {/* Expandable details content drawer */}
        <AnimatePresence>
          {isMobileSummaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-4 text-xs font-bold uppercase tracking-wider text-white/60 text-left"
            >
              <div className="grid grid-cols-2 gap-2 text-[10px] text-white">
                <div><span className="opacity-40 block">Movie</span> {show.movieId.name}</div>
                <div><span className="opacity-40 block">Theatre</span> {show.theatreId.name}</div>
              </div>

              {/* Selected seat chips list */}
              <div className="space-y-1.5">
                <div className="text-[10px] opacity-40">Seats Selected</div>
                {selectedSeats.length === 0 ? (
                  <div className="text-[10px] opacity-20 italic">No seats selected</div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto no-scrollbar">
                    {selectedSeats.map(seat => (
                      <span key={seat} className="bg-white/5 border border-white/10 text-[9px] px-2.5 py-0.5 rounded-full">
                        {getSeatLabel(seat)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cost splits */}
              <div className="space-y-2 border-t border-white/5 pt-2 text-[10px] opacity-70">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{pricingData.subtotal}</span></div>
                <div className="flex justify-between"><span>Booking Fee</span><span>₹{pricingData.fees}</span></div>
                <div className="flex justify-between"><span>GST (18%)</span><span>₹{pricingData.taxes}</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile footer bar containing final price & continue CTA */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Amount</div>
            <div className="text-2xl font-black text-red-500 tracking-tighter italic leading-none">
              ₹{pricingData.grandTotal}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: selectedSeats.length === 0 ? 1 : 0.98 }}
            disabled={processing || selectedSeats.length === 0}
            onClick={handleBookingAndPayment}
            className="flex-grow max-w-[200px] py-4 bg-gradient-to-r from-red-600 to-red-750 text-white font-black uppercase tracking-wider text-xs rounded-full flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {processing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CreditCard size={14} className="fill-white" />
                <span>Continue</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Preparing Secure Payment Overlay & Verifying transaction */}
      <AnimatePresence>
        {['PREPARING', 'VERIFYING'].includes(paymentStatus) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="glass-panel w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center space-y-6"
            >
              {/* Movie poster thumbnail */}
              <div className="w-24 h-36 rounded-2xl overflow-hidden border border-white/10 mx-auto shadow-xl">
                <img 
                  src={show?.movieId?.poster || 'https://images.unsplash.com/photo-1542204172-e56559810b85?w=200&q=80'} 
                  className="w-full h-full object-cover" 
                  alt=""
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase text-white tracking-tight">
                  {paymentStatus === 'PREPARING' ? 'Preparing Secure Payment...' : 'Verifying Secure Transaction...'}
                </h3>
                <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-wider">
                  {paymentStatus === 'PREPARING' 
                    ? 'Please wait while we connect to Razorpay' 
                    : 'Do not close this page or navigate away'}
                </p>
              </div>

              {/* Animated spinner and linear progress */}
              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="w-10 h-10 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 left-0 bg-red-650 rounded-full animate-pulse w-full"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waiting for Razorpay Dimmed overlay */}
      <AnimatePresence>
        {paymentStatus === 'WAITING' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-sm p-6 rounded-3xl border border-white/10 shadow-2xl text-center space-y-4"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-xs font-black uppercase tracking-widest text-white/90">
                  Waiting for payment confirmation...
                </span>
              </div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
                Accidental clicks are disabled during transaction processing.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Failed Modal Overlay wrapper */}
      <AnimatePresence>
        {paymentStatus === 'FAILED' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(229,9,20,0.15)] text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-red-650/15 flex items-center justify-center text-red-500 mx-auto">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Payment Failed</h3>
                <p className="text-sm font-medium text-white/50">
                  {paymentError || 'An error occurred while completing the booking payment.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleBookingAndPayment}
                  className="w-full btn-primary py-4.5 text-xs font-black uppercase tracking-widest rounded-full cursor-pointer shadow-lg"
                >
                  Retry Payment
                </button>
                <button
                  onClick={() => {
                    setPaymentStatus('IDLE');
                    setProcessing(false);
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest py-4 text-xs rounded-full border border-white/10 cursor-pointer transition-colors"
                >
                  Back to Seat Selection
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-transparent text-white/40 hover:text-white/60 font-black uppercase tracking-widest text-xs py-2 cursor-pointer transition-colors"
                >
                  Go Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Expired Modal Overlay wrapper */}
      <AnimatePresence>
        {showTimerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(229,9,20,0.15)] text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-red-650/15 flex items-center justify-center text-red-500 mx-auto animate-pulse">
                <Clock size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Session Expired</h3>
                <p className="text-sm font-medium text-white/50">
                  Your seat booking session of 10:00 minutes has expired. Any selected seats have been released.
                </p>
              </div>
              <button
                onClick={handleTimerExpirationClose}
                className="w-full btn-primary py-4 text-sm font-black uppercase tracking-widest rounded-full cursor-pointer"
              >
                Choose Another Show
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatSelection;
