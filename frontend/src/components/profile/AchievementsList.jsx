import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Medal, Award, Star, Trophy, Zap, Crown, Heart } from 'lucide-react';

const AchievementsList = ({ bookingsCount }) => {
  const achievements = useMemo(() => {
    const list = [
      { id: 'first', title: 'First Blood', desc: 'Booked your first movie', icon: Star, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', active: bookingsCount >= 1 },
      { id: 'lover', title: 'Movie Lover', desc: 'Booked 5+ movies', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', active: bookingsCount >= 5 },
      { id: 'binger', title: 'Weekend Binger', desc: 'Booked 10+ movies', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', active: bookingsCount >= 10 },
      { id: 'gold', title: 'Gold Member', desc: 'Booked 20+ movies', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', active: bookingsCount >= 20 },
      { id: 'elite', title: 'Cineverse Elite', desc: 'Top 1% of users', icon: Trophy, color: 'text-red-500', bg: 'bg-red-600/10', border: 'border-red-600/20', active: bookingsCount >= 50 },
    ];
    return list;
  }, [bookingsCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-6">
        <Award size={18} className="text-yellow-500" />
        <h3 className="text-xl font-black uppercase tracking-tighter text-white">
          Achievements
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {achievements.map((ach, idx) => {
          const isActive = ach.active;
          return (
            <motion.div
              key={ach.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className={`relative p-4 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 ${isActive ? `${ach.bg} ${ach.border}` : 'bg-white/5 border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
            >
              <div className={`p-3 rounded-full mb-3 ${isActive ? ach.bg : 'bg-white/10'} ${isActive ? ach.color : 'text-white/40'}`}>
                <ach.icon size={20} />
              </div>
              <h4 className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/60'}`}>
                {ach.title}
              </h4>
              <p className="text-[9px] font-bold text-white/40 mt-1 uppercase tracking-wider">
                {ach.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default React.memo(AchievementsList);
