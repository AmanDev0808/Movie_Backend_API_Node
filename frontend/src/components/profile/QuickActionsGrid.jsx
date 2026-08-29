import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Film, Ticket, Heart, IndianRupee, Bell, HelpCircle } from 'lucide-react';

const actions = [
  { name: 'Browse Movies', path: '/', icon: Film, color: 'text-blue-400' },
  { name: 'My Bookings', path: '/my-bookings', icon: Ticket, color: 'text-green-400' },
  { name: 'Watchlist', path: '/', icon: Heart, color: 'text-red-400' },
  { name: 'Payment History', path: '/my-bookings', icon: IndianRupee, color: 'text-yellow-400' },
  { name: 'Notifications', path: '/profile', icon: Bell, color: 'text-orange-400' },
  { name: 'Help Center', path: '/', icon: HelpCircle, color: 'text-purple-400' },
];

const QuickActionsGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 relative overflow-hidden"
    >
      <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className="group bg-neutral-900/50 hover:bg-neutral-800 border border-white/5 hover:border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl"
          >
            <div className={`p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-300 ${action.color}`}>
              <action.icon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
              {action.name}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default React.memo(QuickActionsGrid);
