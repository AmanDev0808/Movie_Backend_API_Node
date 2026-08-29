import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Calendar, Mail, Award, Edit2 } from 'lucide-react';

const ProfileCard = ({ user, memberSince, totalBookings, onEditClick, onLogout }) => {
  // Determine Membership Badge based on bookings count and type
  const getBadgeDetails = () => {
    if (user?.userType === 'ADMIN') {
      return {
        label: 'ADMIN ELITE',
        bg: 'bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-pink-600/20 border-fuchsia-500/30 text-fuchsia-300',
        shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]',
        spark: '⚡'
      };
    }
    if (totalBookings >= 6) {
      return {
        label: 'PLATINUM VIP',
        bg: 'bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 border-red-500/30 text-red-300',
        shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
        spark: '👑'
      };
    }
    if (totalBookings >= 3) {
      return {
        label: 'GOLD CINEPHILE',
        bg: 'bg-gradient-to-r from-amber-600/20 to-yellow-500/20 border-amber-500/30 text-amber-300',
        shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
        spark: '🎬'
      };
    }
    return {
      label: 'CLASSIC CINEPHILE',
      bg: 'bg-white/5 border-white/10 text-white/60',
      shadow: '',
      spark: '🍿'
    };
  };

  const badge = getBadgeDetails();

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 rounded-[2.5rem] flex flex-col items-center justify-between border border-white/5 relative overflow-hidden shadow-2xl h-full min-h-[500px]"
    >
      {/* Background abstract ambient glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Info */}
      <div className="w-full flex flex-col items-center text-center">
        {/* Avatar Frame with Animated Gradient Border */}
        <div className="relative group mb-5">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-amber-500 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-500/50 p-1 bg-neutral-950 transition-all duration-300 shadow-2xl"
          >
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80'} 
              alt={user?.name || 'User Avatar'} 
              className="w-full h-full rounded-full object-cover"
            />
          </motion.div>

          {/* Edit Badge overlay */}
          <button
            onClick={onEditClick}
            className="absolute bottom-1 right-1 bg-red-600 border border-red-500 text-white p-2 rounded-full hover:bg-red-700 shadow-lg cursor-pointer transform hover:scale-105 transition-all"
            title="Edit Profile"
          >
            <Edit2 size={12} />
          </button>
        </div>

        {/* User Details */}
        <div className="space-y-1 w-full px-2">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white truncate max-w-full">
            {user?.name}
          </h2>
          <p className="text-white/40 text-xs font-semibold flex items-center justify-center gap-1.5 truncate">
            <Mail size={12} className="text-red-500 flex-shrink-0" />
            <span>{user?.email}</span>
          </p>
        </div>

        {/* Membership Badge */}
        <div className={`mt-5 px-4 py-2 rounded-2xl border text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 ${badge.bg} ${badge.shadow}`}>
          <span>{badge.spark}</span>
          <span>{badge.label}</span>
        </div>

        {/* Metadata Details */}
        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 mt-6 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/30 font-black uppercase tracking-wider text-[9px]">Status</span>
            <span className="text-emerald-400 font-extrabold text-[10px] tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-white/5 pt-3">
            <span className="text-white/30 font-black uppercase tracking-wider text-[9px]">Member Since</span>
            <span className="text-white/80 font-bold flex items-center gap-1">
              <Calendar size={12} className="text-red-500" />
              <span>{memberSince}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="w-full mt-8 border border-white/5 hover:border-red-500/20 bg-white/5 hover:bg-red-600/10 text-white/70 hover:text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(229,9,20,0.1)]"
      >
        <LogOut size={14} className="text-red-500" />
        <span>Sign Out</span>
      </button>
    </motion.div>
  );
};

export default ProfileCard;
