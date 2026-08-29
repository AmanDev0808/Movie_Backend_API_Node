import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Key, Monitor, LogOut, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../api/api-client';
import { toast } from 'react-toastify';

const ToggleSwitch = ({ label, desc, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
      <div>
        <div className="text-sm font-bold text-white">{label}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{desc}</div>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-red-600' : 'bg-neutral-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
};

const SettingsToggles = ({ onLogout, user, onPreferencesChange }) => {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const preferences = user?.notificationPreferences || { notifications: true, emailUpdates: true, darkMode: true };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match', { theme: 'dark' });
      return;
    }
    setSavingPassword(true);
    try {
      await apiClient.post('/auth/change-password', passwords);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordOpen(false);
      toast.success('Password changed successfully', { theme: 'dark' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to change password', { theme: 'dark' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    try {
      await onPreferencesChange({ ...preferences, [key]: value });
    } catch (error) {
      toast.error('Unable to save this preference', { theme: 'dark' });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-6">
          <Bell size={18} className="text-white" />
          <h3 className="text-xl font-black uppercase tracking-tighter text-white">
            Notification Preferences
          </h3>
        </div>
        <div className="space-y-3">
          <ToggleSwitch label="Notifications" desc="Push notifications for your account" checked={preferences.notifications} onChange={(value) => handlePreferenceChange('notifications', value)} />
          <ToggleSwitch label="Email Updates" desc="Get latest news and offers" checked={preferences.emailUpdates} onChange={(value) => handlePreferenceChange('emailUpdates', value)} />
          <ToggleSwitch label="Dark Mode" desc="Switch between light and dark UI" checked={preferences.darkMode} onChange={(value) => handlePreferenceChange('darkMode', value)} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass p-6 md:p-8 rounded-[3rem] border border-white/10 bg-neutral-900/40 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield size={18} className="text-white" />
          <h3 className="text-xl font-black uppercase tracking-tighter text-white">
            Security & Privacy
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button type="button" onClick={() => setPasswordOpen((open) => !open)} className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl"><Key size={16} /></div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Change Password</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-0.5">Updated 3 months ago</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer">
            <div className="p-2 bg-green-500/20 text-green-400 rounded-xl"><Shield size={16} /></div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Privacy</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-0.5">Manage Data Settings</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer sm:col-span-2">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl"><Monitor size={16} /></div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Security</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-0.5">Active Devices & Sessions</div>
            </div>
          </button>
        </div>

        {passwordOpen && (
          <form onSubmit={handleChangePassword} className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <div key={field} className="relative">
                <input
                  required
                  minLength={field === 'currentPassword' ? undefined : 6}
                  type={showPasswords ? 'text' : 'password'}
                  value={passwords[field]}
                  onChange={(event) => setPasswords({ ...passwords, [field]: event.target.value })}
                  placeholder={field.replace('Password', ' password').replace(/^./, (letter) => letter.toUpperCase())}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 pr-10 text-sm text-white outline-none focus:border-red-500/50"
                />
                {field === 'confirmPassword' && (
                  <button type="button" onClick={() => setShowPasswords((show) => !show)} aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'} className="absolute right-3 top-3 text-white/45">
                    {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            ))}
            <button type="submit" disabled={savingPassword} className="btn-primary w-full justify-center py-2.5 text-sm">
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex justify-center items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Sign Out Completely
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(SettingsToggles);
