import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Languages, Calendar } from 'lucide-react';

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
    <div className="p-3 bg-white/5 rounded-xl text-white/50">
      <Icon size={18} />
    </div>
    <div className="flex-grow">
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
        {label}
      </div>
      <div className="text-sm font-bold text-white/90 truncate">
        {value || 'Not provided'}
      </div>
    </div>
  </div>
);

const ProfileInfoCards = ({ user, memberSince }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black uppercase tracking-tighter text-white">
          Personal Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField icon={User} label="Full Name" value={user?.name} />
        <InfoField icon={Mail} label="Email Address" value={user?.email} />
        <InfoField icon={Phone} label="Phone Number" value={user?.phone || '+91 98765 43210'} />
        <InfoField icon={MapPin} label="City" value={user?.city || 'Mumbai'} />
        <InfoField icon={Globe} label="Country" value={user?.country || 'India'} />
        <InfoField icon={Languages} label="Language" value={user?.language || 'English (US)'} />
        <InfoField icon={Calendar} label="Member Since" value={memberSince} />
      </div>
    </motion.div>
  );
};

export default React.memo(ProfileInfoCards);
