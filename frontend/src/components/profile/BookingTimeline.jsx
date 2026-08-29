import React from 'react';
import { motion } from 'framer-motion';
import BookingCard from './BookingCard';

const BookingTimeline = ({ 
  bookings, 
  onCancelClick, 
  onViewTicketClick, 
  cancellingId, 
  isShowPast 
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="relative pl-6 md:pl-10 space-y-8 text-left"
    >
      {/* Timeline main thread */}
      <div className="absolute top-2 bottom-2 left-0 w-[2px] bg-gradient-to-b from-red-600 via-neutral-800 to-transparent pointer-events-none" />

      {bookings.map((booking, index) => (
        <div key={booking._id} className="relative">
          {/* Timeline Bullet Anchor */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: 'spring', stiffness: 200, delay: index * 0.05 }}
            className={`absolute -left-[30px] md:-left-[46px] top-10 w-4 h-4 rounded-full border-4 bg-neutral-950 z-20 flex items-center justify-center ${
              booking.status === 'SUCCESS' 
                ? 'border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : booking.status === 'CANCELLED'
                ? 'border-neutral-500'
                : 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
            }`}
          >
            {/* Glow dot */}
            <div className={`w-1 h-1 rounded-full ${
              booking.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-white/40'
            }`} />
          </motion.div>

          <BookingCard
            booking={booking}
            onCancelClick={onCancelClick}
            onViewTicketClick={onViewTicketClick}
            cancellingId={cancellingId}
            isShowPast={isShowPast}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default BookingTimeline;
