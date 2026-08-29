import React from 'react';
import { Film, Mail, Globe, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/8 bg-[#09090b]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/15 text-red-500 ring-1 ring-red-500/20">
                <Film size={18} />
              </span>
              <span className="text-lg font-black tracking-[0.22em] text-white/90">CINEVERSE</span>
            </Link>
            <p className="max-w-xs text-sm leading-7 text-white/55">
              Premium movie experiences, from discovery to booking, thoughtfully crafted for modern cinema lovers.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                { label: 'Home', to: '/' },
                { label: 'My Bookings', to: '/my-bookings' },
                { label: 'Watchlist', to: '/watchlist' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="transition-colors hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Contact</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2"><Mail size={14} className="text-red-400" /> support@cineverse.com</li>
              <li className="flex items-center gap-2"><Clock size={14} className="text-red-400" /> Mon – Sun, 9am – 11pm</li>
              <li className="flex items-center gap-2"><Globe size={14} className="text-red-400" /> Mumbai, India</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Newsletter</h3>
            <p className="text-sm leading-7 text-white/55">Get updates on new releases, events, and special offers.</p>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/2 p-1.5">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email for newsletter"
                className="flex-1 border-0 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <button aria-label="Subscribe" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white transition-colors hover:bg-red-500">
                <Mail size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 text-xs text-white/30 md:flex-row">
          <span>© {new Date().getFullYear()} Cineverse. All rights reserved.</span>
          <div className="inline-flex items-center gap-2 text-white/45">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            Premium Movie Experience
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
