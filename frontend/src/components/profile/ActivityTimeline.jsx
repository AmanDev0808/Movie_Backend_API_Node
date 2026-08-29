import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Ticket, IndianRupee, XCircle, PlayCircle } from 'lucide-react';

const ActivityTimeline = ({ bookings }) => {
  const activities = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    
    // Create a timeline from bookings. We'll extract 2 events per booking: booked, and payment
    let timeline = [];
    bookings.forEach(b => {
      const movieName = b.showId?.movieId?.name || 'a movie';
      const dateStr = new Date(b.createdAt).toLocaleDateString();
      const timeStr = new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (b.status === 'CANCELLED') {
        timeline.push({ id: `${b._id}-cancel`, type: 'cancel', text: `Cancelled booking for ${movieName}`, date: `${dateStr} ${timeStr}`, timestamp: new Date(b.updatedAt || b.createdAt).getTime(), icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' });
      } else {
        timeline.push({ id: `${b._id}-book`, type: 'book', text: `Booked tickets for ${movieName}`, date: `${dateStr} ${timeStr}`, timestamp: new Date(b.createdAt).getTime(), icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10' });
        
        if (b.paymentStatus === 'COMPLETED' || b.paymentStatus === 'SUCCESS' || b.paymentId) {
          timeline.push({ id: `${b._id}-pay`, type: 'pay', text: `Payment successful for ${movieName}`, date: `${dateStr} ${timeStr}`, timestamp: new Date(b.createdAt).getTime() + 1000, icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-500/10' });
        }
      }
    });
    
    // Sort descending
    timeline.sort((a, b) => b.timestamp - a.timestamp);
    return timeline.slice(0, 5); // Show only top 5 recent
  }, [bookings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-8">
        <Activity size={18} className="text-blue-500" />
        <h3 className="text-xl font-black uppercase tracking-tighter text-white">
          Recent Activity
        </h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-white/40 text-sm font-semibold text-center py-8">
          No recent activity to display.
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {activities.map((activity, idx) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              {/* Icon marker */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-950 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${activity.bg} ${activity.color} shadow-lg ml-0 md:ml-0 md:absolute md:left-1/2`}>
                <activity.icon size={14} />
              </div>

              {/* Content Box */}
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-white">{activity.text}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{activity.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(ActivityTimeline);
