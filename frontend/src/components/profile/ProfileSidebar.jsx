import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, Calendar, ShieldCheck, LogOut } from 'lucide-react';

const ProfileSidebar = ({ user, memberSince, onEditClick, onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-8 rounded-[3rem] border border-white/10 flex flex-col items-center text-center relative overflow-hidden bg-neutral-900/40 shadow-2xl backdrop-blur-2xl"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Avatar Container */}
      <div className="relative group mb-6 z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-blue-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 p-1 bg-neutral-950">
          <img 
            src={user?.avatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80'} 
            alt={user?.name} 
            loading="lazy"
            className="w-full h-full rounded-full object-cover" 
          />
        </div>
        <button 
          onClick={onEditClick}
          aria-label="Edit Profile Picture"
          className="absolute bottom-1 right-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-2.5 rounded-full cursor-pointer transition-all hover:scale-105"
        >
          <Camera size={14} aria-hidden="true" />
        </button>
      </div>

      {/* User Info */}
      <div className="space-y-2 z-10 w-full">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-md">
          {user?.name || 'Guest User'}
        </h2>
        
        <div className="flex items-center justify-center gap-1.5 text-white/50 text-sm font-medium">
          <Mail size={14} />
          <span className="truncate">{user?.email || 'No email provided'}</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-white/50 text-xs font-bold tracking-widest uppercase mt-2">
          <Calendar size={12} />
          <span>Member Since {memberSince}</span>
        </div>
      </div>

      {/* Premium Badge */}
      <div className="mt-8 z-10 w-full">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-xl text-red-500">
            <ShieldCheck size={20} />
          </div>
          <div className="text-left">
            <div className="text-xs font-black uppercase tracking-widest text-red-400">Cineverse Elite</div>
            <div className="text-[10px] text-white/50 font-semibold mt-0.5">Premium Dashboard Access</div>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 flex gap-3 z-10">
        <button 
          onClick={onEditClick}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md"
        >
          Edit Profile
        </button>
        <button 
          onClick={onLogout}
          className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 px-4 rounded-2xl transition-all shadow-md flex items-center justify-center"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProfileSidebar);
