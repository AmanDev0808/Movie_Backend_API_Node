import React from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  CalendarRange, 
  CalendarCheck,
  CreditCard, 
  Coins, 
  Film, 
  MapPin, 
  Award 
} from 'lucide-react';
import CountUpNumber from './CountUpNumber';
import GlassCard from './GlassCard';

// Helper to check if show time has passed
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

const StatsCardItem = ({ title, value, icon: Icon, gradient, shadowColor, prefix, suffix, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ 
        y: -4,
        scale: 1.015,
        boxShadow: `0 10px 25px -5px ${shadowColor}`,
        borderColor: 'rgba(255, 255, 255, 0.12)'
      }}
      className={`glass relative overflow-hidden p-5 rounded-[2rem] flex flex-col justify-between h-36 transition-all duration-300 group cursor-pointer border border-white/5 bg-neutral-900/40`}
    >
      {/* Background Gradient Mesh */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15 transition-opacity duration-500 group-hover:opacity-25`} />
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500" />

      <div className="flex justify-between items-start relative z-10">
        <span className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none">{title}</span>
        <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:bg-red-600 group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(229,9,20,0.5)] transition-all duration-300 text-white/80 group-hover:text-white">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10 mt-auto text-left">
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white flex items-baseline gap-1 truncate max-w-full">
          <CountUpNumber value={value} prefix={prefix} suffix={suffix} />
        </h3>
      </div>
    </motion.div>
  );
};

const StatsCard = ({ bookings }) => {
  // Mode helper
  const getMostFrequent = (arr) => {
    if (arr.length === 0) return 'N/A';
    const modeMap = {};
    let maxEl = arr[0], maxCount = 1;
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      if (modeMap[el] == null) modeMap[el] = 1;
      else modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  };

  // Calculations
  const totalBookings = bookings.length;
  const successBookings = bookings.filter(b => b.status === 'SUCCESS').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const failedBookings = bookings.filter(b => b.status === 'FAILED').length;

  const upcomingBookings = bookings.filter(
    b => b.status === 'SUCCESS' && !isShowPast(b.showId?.showDate, b.showId?.showTime)
  ).length;

  const completedShows = bookings.filter(
    b => b.status === 'SUCCESS' && isShowPast(b.showId?.showDate, b.showId?.showTime)
  ).length;

  const moneySpent = bookings
    .filter(b => b.status === 'SUCCESS')
    .reduce((sum, b) => sum + (b.totalCost || 0), 0);

  const totalTickets = bookings
    .filter(b => b.status === 'SUCCESS')
    .reduce((sum, b) => sum + (b.seats || b.seatNumbers?.length || 0), 0);

  const averageTicketPrice = totalTickets > 0 ? Math.round(moneySpent / totalTickets) : 0;

  const movies = bookings
    .filter(b => b.status === 'SUCCESS')
    .map(b => b.showId?.movieId?.name)
    .filter(Boolean);
  const favoriteMovie = getMostFrequent(movies);

  const theatres = bookings
    .filter(b => b.status === 'SUCCESS')
    .map(b => b.showId?.theatreId?.name)
    .filter(Boolean);
  const favoriteTheatre = getMostFrequent(theatres);

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Ticket,
      gradient: 'from-orange-500/20 to-red-600/10',
      shadowColor: 'rgba(239, 68, 68, 0.12)',
    },
    {
      title: 'Successful',
      value: successBookings,
      icon: CheckCircle,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      shadowColor: 'rgba(16, 185, 129, 0.12)',
    },
    {
      title: 'Pending',
      value: pendingBookings,
      icon: AlertCircle,
      gradient: 'from-amber-500/20 to-yellow-500/10',
      shadowColor: 'rgba(245, 158, 11, 0.12)',
    },
    {
      title: 'Cancelled',
      value: cancelledBookings,
      icon: XCircle,
      gradient: 'from-neutral-500/20 to-stone-600/10',
      shadowColor: 'rgba(115, 115, 115, 0.12)',
    },
    {
      title: 'Failed',
      value: failedBookings,
      icon: XCircle,
      gradient: 'from-red-500/20 to-rose-600/10',
      shadowColor: 'rgba(239, 68, 68, 0.12)',
    },
    {
      title: 'Upcoming Bookings',
      value: upcomingBookings,
      icon: CalendarRange,
      gradient: 'from-blue-500/20 to-indigo-600/10',
      shadowColor: 'rgba(59, 130, 246, 0.12)',
    },
    {
      title: 'Completed Shows',
      value: completedShows,
      icon: CalendarCheck,
      gradient: 'from-violet-500/20 to-purple-600/10',
      shadowColor: 'rgba(139, 92, 246, 0.12)',
    },
    {
      title: 'Money Spent',
      value: moneySpent,
      icon: CreditCard,
      gradient: 'from-teal-500/20 to-emerald-600/10',
      shadowColor: 'rgba(20, 184, 166, 0.12)',
      prefix: '₹',
    },
    {
      title: 'Tickets Purchased',
      value: totalTickets,
      icon: Award,
      gradient: 'from-pink-500/20 to-rose-600/10',
      shadowColor: 'rgba(236, 72, 153, 0.12)',
      suffix: ' Pass',
    },
    {
      title: 'Average Ticket Price',
      value: averageTicketPrice,
      icon: Coins,
      gradient: 'from-cyan-500/20 to-blue-600/10',
      shadowColor: 'rgba(6, 182, 212, 0.12)',
      prefix: '₹',
    },
    {
      title: 'Favorite Movie',
      value: favoriteMovie,
      icon: Film,
      gradient: 'from-amber-500/20 to-yellow-600/10',
      shadowColor: 'rgba(245, 158, 11, 0.12)',
    },
    {
      title: 'Favorite Theatre',
      value: favoriteTheatre,
      icon: MapPin,
      gradient: 'from-fuchsia-500/20 to-pink-600/10',
      shadowColor: 'rgba(217, 70, 239, 0.12)',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, index) => (
        <StatsCardItem
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          gradient={stat.gradient}
          shadowColor={stat.shadowColor}
          prefix={stat.prefix}
          suffix={stat.suffix}
          index={index}
        />
      ))}
    </div>
  );
};

export default StatsCard;
