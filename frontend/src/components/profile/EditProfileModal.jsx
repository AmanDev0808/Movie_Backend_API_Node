import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Sparkles, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const AVATARS = [
  { id: 'neo', name: 'The One', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80' },
  { id: 'widow', name: 'Black Widow', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
  { id: 'joker', name: 'Joker', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
  { id: 'wanderer', name: 'Wanderer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
  { id: 'barbie', name: 'Director', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' },
  { id: 'star', name: 'Cinephile', url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&q=80' }
];

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATARS[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setEmail(user?.email || '');
      setSelectedAvatar(user?.avatar || AVATARS[0].url);
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.length < 2) {
      toast.error('Name must be at least 2 characters.', { theme: 'dark' });
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.', { theme: 'dark' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ name, email, avatarUrl: selectedAvatar });
      
      toast.success('Profile updated successfully!', { theme: 'dark' });
      onClose();
    } catch (err) {
      toast.error('Failed to update profile. Please try again.', { theme: 'dark' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass max-w-lg w-full rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-[0_0_80px_rgba(229,9,20,0.15)] relative overflow-hidden"
        >
          {/* Top Notch Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_20px_#ef4444]" />

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
              <Sparkles className="text-red-500 w-5 h-5 animate-pulse" />
              <span>Customize Profile</span>
            </h3>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-red-600 rounded-full text-white border border-white/5 hover:border-red-500/20 hover:shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Cinematic Avatar</label>
              <div className="grid grid-cols-6 gap-3">
                {AVATARS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.url)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-red-500 shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-105' 
                          : 'border-white/10 hover:border-white/30 hover:scale-102'
                      }`}
                    >
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1">
                <User size={10} className="text-red-500" /> Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-900/60 border border-white/5 focus:border-red-500/50 rounded-2xl py-3 px-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1">
                <Mail size={10} className="text-red-500" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900/60 border border-white/5 focus:border-red-500/50 rounded-2xl py-3 px-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none transition-all"
                placeholder="Enter email address"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-2xl transition-all cursor-pointer border border-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary text-xs py-3 px-4 rounded-2xl cursor-pointer"
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
