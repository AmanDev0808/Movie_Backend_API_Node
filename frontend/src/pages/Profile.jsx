import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/api-client';

import AnimatedBackground from '../components/profile/AnimatedBackground';
import LoadingSkeleton from '../components/profile/LoadingSkeleton';
import EditProfileModal from '../components/profile/EditProfileModal';

import ProfileSidebar from '../components/profile/ProfileSidebar';
import AccountStats from '../components/profile/AccountStats';
import ProfileInfoCards from '../components/profile/ProfileInfoCards';
import QuickActionsGrid from '../components/profile/QuickActionsGrid';
import WatchHistoryCarousel from '../components/profile/WatchHistoryCarousel';
import FavoriteGenres from '../components/profile/FavoriteGenres';
import AchievementsList from '../components/profile/AchievementsList';
import ActivityTimeline from '../components/profile/ActivityTimeline';
import SettingsToggles from '../components/profile/SettingsToggles';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileResponse, bookingsResponse] = await Promise.all([
          apiClient.get('/auth/me'),
          apiClient.get('/bookings/my-bookings?page=1&limit=1000')
        ]);
        if (profileResponse.data?.success) updateUser(profileResponse.data.data);
        if (bookingsResponse.data?.success && bookingsResponse.data.data) {
          setBookings(bookingsResponse.data.data.bookings || []);
        }
      } catch (err) {
        console.error('Failed to fetch profile stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const memberSince = useMemo(() => {
    if (!user?.id && !user?._id) return 'Joined July 2026';
    try {
      const id = user.id || user._id;
      const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Joined July 2026';
    }
  }, [user]);

  // Derived Stats
  const { totalBookings, moviesWatched, moneySpent, pastBookings } = useMemo(() => {
    let watched = 0;
    let spent = 0;
    const past = [];
    
    bookings.forEach(b => {
      if (b.status === 'SUCCESS') {
        const showTime = b.showId?.showTime || '';
        const showDate = b.showId?.showDate || '';
        const baseDate = new Date(showDate);
        // Simple past check
        const match = showTime.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (match) {
          let hours = parseInt(match[1], 10);
          if (match[3] === 'PM' && hours < 12) hours += 12;
          else if (match[3] === 'AM' && hours === 12) hours = 0;
          baseDate.setHours(hours, parseInt(match[2], 10), 0, 0);
        }
        
        if (baseDate <= new Date()) {
          watched += 1;
          past.push(b);
        }
        spent += b.totalCost || 0;
      }
    });
    
    return { 
      totalBookings: bookings.length, 
      moviesWatched: watched, 
      moneySpent: spent,
      pastBookings: past.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    };
  }, [bookings]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async (updatedData) => {
    const { data } = await apiClient.patch('/auth/me', updatedData);
    if (!data?.success) throw new Error('Profile update failed');
    updateUser(data.data);
  };

  const handlePreferencesChange = async (notificationPreferences) => {
    const { data } = await apiClient.patch('/auth/me', { notificationPreferences });
    if (!data?.success) throw new Error('Preference update failed');
    updateUser(data.data);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 w-full text-left"
    >
      <AnimatedBackground />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <ProfileSidebar 
              user={user} 
              memberSince={memberSince} 
              onEditClick={() => setIsEditModalOpen(true)}
              onLogout={handleLogout}
            />
            <AchievementsList bookingsCount={totalBookings} />
          </div>
        </div>

        {/* RIGHT DASHBOARD */}
        <div className="lg:col-span-3 space-y-8">
          {/* Welcome Header */}
          <div className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="z-10">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-1">
                Welcome back, {(user?.name ? user.name.split(' ')[0] : 'User')} 👋
              </h2>
              <p className="text-white/60 font-semibold text-sm tracking-wide">
                Movie Lover since {new Date(user?.createdAt || Date.now()).getFullYear()}
              </p>
            </div>
          </div>

          {bookings.length > 0 ? (
            <>
              <AccountStats 
                totalBookings={totalBookings}
                moviesWatched={moviesWatched}
                moneySpent={moneySpent}
                favoriteGenre={null} 
              />
              
              <QuickActionsGrid />
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ProfileInfoCards user={user} memberSince={memberSince} />
                <FavoriteGenres bookings={bookings} />
              </div>

              <WatchHistoryCarousel pastBookings={pastBookings} />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ActivityTimeline bookings={bookings} />
                <SettingsToggles user={user} onPreferencesChange={handlePreferencesChange} onLogout={handleLogout} />
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <QuickActionsGrid />
              
              <div className="glass p-12 text-center rounded-[3rem] border border-dashed border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] bg-neutral-900/20">
                <div className="absolute top-0 left-0 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="w-20 h-20 bg-gradient-to-tr from-neutral-800 to-neutral-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-white/10">
                  <div className="absolute inset-0 bg-white/5 rounded-3xl" />
                  <span className="text-4xl">🍿</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
                  Start your movie journey today
                </h3>
                <p className="text-white/40 text-sm max-w-sm mt-3 leading-relaxed font-semibold">
                  You haven't booked any movies yet. Browse the latest blockbusters and grab your seats!
                </p>
                <button onClick={() => navigate('/')} className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 cursor-pointer">
                  Browse Movies
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ProfileInfoCards user={user} memberSince={memberSince} />
                <SettingsToggles user={user} onPreferencesChange={handlePreferencesChange} onLogout={handleLogout} />
              </div>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </motion.div>
  );
};

export default Profile;
