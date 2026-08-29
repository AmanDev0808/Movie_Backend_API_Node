import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, QrCode, Download, Share2, 
  RotateCw, Film, Type, BadgeAlert, IndianRupee, Hash 
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatusBadge from './StatusBadge';

const BookingCard = ({ 
  booking, 
  onViewTicketClick,
  onDownloadTicketClick,
  isPast 
}) => {
  const show = booking.showId || {};
  const movie = show.movieId || {};
  const theatre = show.theatreId || {};

  // Status computation for Booking
  let computedStatus = booking.status;
  if (booking.status === 'SUCCESS') {
    computedStatus = isPast ? 'COMPLETED' : 'UPCOMING';
  }

  const formattedBookingDate = new Date(booking.createdAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedShowDate = show.showDate ? new Date(show.showDate).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'TBA';

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/success/${booking._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Movie Ticket - ${movie.name}`,
          text: `I'm watching ${movie.name} at ${theatre.name}!`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Ticket link copied to clipboard!', { theme: 'dark' });
    }
  };

  const getGradientBorder = () => {
    switch(computedStatus) {
      case 'UPCOMING': return 'hover:border-blue-500/50';
      case 'COMPLETED': return 'hover:border-green-500/50';
      case 'CANCELLED': return 'hover:border-red-500/50';
      default: return 'hover:border-yellow-500/50';
    }
  };

  const getGlowColor = () => {
    switch(computedStatus) {
      case 'UPCOMING': return 'from-blue-600/0 via-blue-600/0 to-blue-600/10';
      case 'COMPLETED': return 'from-green-600/0 via-green-600/0 to-green-600/10';
      case 'CANCELLED': return 'from-red-600/0 via-red-600/0 to-red-600/10';
      default: return 'from-yellow-600/0 via-yellow-600/0 to-yellow-600/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={`group glass rounded-[2rem] flex flex-col sm:flex-row border border-white/10 ${getGradientBorder()} transition-all duration-500 shadow-2xl relative overflow-hidden bg-neutral-950/60 backdrop-blur-xl`}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getGlowColor()} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
      
      {/* Poster image */}
      <div className="w-full sm:w-48 aspect-[2/3] sm:aspect-auto sm:h-auto shrink-0 relative bg-neutral-900 border-b sm:border-b-0 sm:border-r border-white/10">
        <img 
          src={movie.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'} 
          alt={`Movie poster for ${movie.name || 'Untitled Movie'}`}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90 sm:hidden" />
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col p-5 md:p-6 text-left relative z-10 w-full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white drop-shadow-md">
              {movie.name || 'Untitled Movie'}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/50">
              <span className="flex items-center gap-1 border border-white/10 bg-white/5 px-2 py-0.5 rounded-full"><Film size={10} /> {movie.genre || 'Cinema'}</span>
              <span className="flex items-center gap-1 border border-white/10 bg-white/5 px-2 py-0.5 rounded-full"><Type size={10} /> {movie.language || 'EN'}</span>
              <span className="flex items-center gap-1 border border-white/10 bg-white/5 px-2 py-0.5 rounded-full"><BadgeAlert size={10} /> {movie.certificate || 'U/A'}</span>
            </div>
          </div>
          <StatusBadge status={computedStatus} type="booking" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/10">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">Date</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Calendar size={12} className="text-white/50" />
              {formattedShowDate}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">Time</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Clock size={12} className="text-white/50" />
              {show.showTime || 'TBA'}
            </span>
          </div>
          <div className="col-span-2 md:col-span-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">Theatre & Screen</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              <MapPin size={12} className="text-white/50 shrink-0" />
              <span className="truncate">{theatre.name || 'TBA'} • Screen 1</span>
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">Tickets ({booking.seatNumbers?.length || 0})</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Hash size={12} className="text-white/50" />
              {booking.seatNumbers ? booking.seatNumbers.map(s => `#${s}`).join(', ') : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">Total Paid</span>
            <span className="text-sm font-black text-white flex items-center gap-0.5">
              <IndianRupee size={12} className="text-white/50" />
              {booking.totalCost}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">Booking ID</span>
            <span className="text-xs font-mono font-bold text-white/70 block truncate bg-white/5 px-2 py-0.5 rounded border border-white/5" aria-label={`Booking ID ${booking._id}`}>
              {booking._id.substring(10, 24).toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">Payment ID</span>
            <span className="text-xs font-mono font-bold text-white/70 block truncate bg-white/5 px-2 py-0.5 rounded border border-white/5" aria-label={`Payment ID`}>
              {booking.paymentId ? booking.paymentId.substring(4, 18).toUpperCase() : `PAY-${booking._id.substring(10, 18).toUpperCase()}`}
            </span>
          </div>
        </div>

        {/* Action Buttons (Revealed on Hover) */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-2 opacity-100 sm:opacity-0 sm:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <button
            onClick={() => onViewTicketClick(booking)}
            aria-label="View digital ticket stub"
            className="flex-1 min-w-[100px] bg-white border border-white hover:bg-neutral-200 text-black px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
          >
            <QrCode size={14} aria-hidden="true" /> View
          </button>
          
          <button
            onClick={() => onDownloadTicketClick(booking)}
            aria-label="Download ticket as SVG"
            className="flex-1 min-w-[100px] bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
          >
            <Download size={14} aria-hidden="true" /> Ticket
          </button>
          
          <Link
            to={`/movies/${movie._id}`}
            aria-label={`Book another ticket for ${movie.name}`}
            className="flex-1 min-w-[100px] bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 text-center"
          >
            <RotateCw size={14} aria-hidden="true" /> Again
          </Link>

          <button
            onClick={handleShare}
            aria-label="Share ticket details"
            className="flex-1 min-w-[100px] bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
          >
            <Share2 size={14} aria-hidden="true" /> Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BookingCard);
