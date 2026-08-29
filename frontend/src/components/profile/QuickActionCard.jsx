import React from 'react';
import { motion } from 'framer-motion';
import { Film, CalendarRange, Ticket, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionItem = ({ title, desc, icon: Icon, gradient, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        borderColor: 'rgba(229, 9, 20, 0.3)',
      }}
      onClick={onClick}
      className="glass p-5 rounded-[2rem] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden group shadow-lg"
    >
      {/* Background Gradient Mesh */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl group-hover:bg-red-600 group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(229,9,20,0.4)] text-white/80 group-hover:text-white transition-all duration-300 flex-shrink-0">
        <Icon size={20} className="transform group-hover:rotate-6 transition-transform duration-300" />
      </div>

      <div className="relative z-10 text-left">
        <h4 className="font-black text-sm uppercase tracking-wide text-white group-hover:text-red-500 transition-colors duration-300">
          {title}
        </h4>
        <p className="text-white/40 text-[11px] font-medium mt-0.5 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

const QuickActionCard = ({ onEditProfile, onShowUpcoming, onShowTickets }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Browse Movies',
      desc: 'Explore now-showing and upcoming blockbusters.',
      icon: Film,
      gradient: 'from-red-500 to-orange-500',
      onClick: () => navigate('/')
    },
    {
      title: 'Upcoming Shows',
      desc: 'Check live countdowns for your active reservations.',
      icon: CalendarRange,
      gradient: 'from-amber-500 to-yellow-500',
      onClick: onShowUpcoming
    },
    {
      title: 'My Tickets',
      desc: 'View, print, download, or share verified booking passes.',
      icon: Ticket,
      gradient: 'from-teal-500 to-emerald-500',
      onClick: onShowTickets
    },
    {
      title: 'Edit Profile',
      desc: 'Modify name, email, and choose a premium movie avatar.',
      icon: UserCheck,
      gradient: 'from-blue-500 to-indigo-500',
      onClick: onEditProfile
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {actions.map((action, index) => (
        <QuickActionItem
          key={action.title}
          title={action.title}
          desc={action.desc}
          icon={action.icon}
          gradient={action.gradient}
          onClick={action.onClick}
          index={index}
        />
      ))}
    </div>
  );
};

export default QuickActionCard;
