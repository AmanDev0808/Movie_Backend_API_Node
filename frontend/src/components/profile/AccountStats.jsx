import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Film, IndianRupee, Heart } from 'lucide-react';
import CountUpNumber from './CountUpNumber';

const AccountStats = ({ totalBookings, moviesWatched, moneySpent, favoriteGenre }) => {
  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      isCurrency: false,
      isString: false,
      icon: Ticket,
      color: 'blue'
    },
    {
      title: 'Movies Watched',
      value: moviesWatched,
      isCurrency: false,
      isString: false,
      icon: Film,
      color: 'green'
    },
    {
      title: 'Money Spent',
      value: moneySpent,
      isCurrency: true,
      isString: false,
      icon: IndianRupee,
      color: 'yellow'
    },
    {
      title: 'Top Genre',
      value: favoriteGenre || 'Action',
      isCurrency: false,
      isString: true,
      icon: Heart,
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 from-blue-600/0 via-blue-600/0 to-blue-600/10';
      case 'green': return 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40 from-green-600/0 via-green-600/0 to-green-600/10';
      case 'yellow': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20 hover:border-yellow-500/40 from-yellow-600/0 via-yellow-600/0 to-yellow-600/10';
      case 'red': return 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 from-red-600/0 via-red-600/0 to-red-600/10';
      default: return 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:border-white/20';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const colors = getColorClasses(stat.color);
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className={`group glass rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${colors.split(' hover:')[0]} hover:${colors.split(' hover:')[1]} hover:${colors.split(' hover:')[2]}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-tr ${colors.split(' ').slice(-3).join(' ')} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            
            <div className="flex justify-between items-start z-10">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
                {stat.title}
              </span>
              <stat.icon size={16} className="opacity-80" />
            </div>
            
            <h3 className="text-3xl font-black mt-4 flex items-center gap-1 z-10">
              {stat.isCurrency && <span className="text-xl opacity-50">₹</span>}
              {stat.isString ? (
                <span className="truncate">{stat.value}</span>
              ) : (
                <CountUpNumber value={stat.value} />
              )}
            </h3>
          </motion.div>
        );
      })}
    </div>
  );
};

export default React.memo(AccountStats);
