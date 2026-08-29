import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  sortBy, 
  setSortBy 
}) => {
  const statuses = [
    { value: 'ALL', label: 'All' },
    { value: 'SUCCESS', label: 'Completed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'FAILED', label: 'Failed' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass p-5 rounded-[2rem] flex flex-col gap-4 md:flex-row md:items-center justify-between shadow-2xl relative overflow-hidden"
    >
      {/* Search Input */}
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movie, theatre, booking ID..."
          className="w-full bg-neutral-900/60 border border-white/5 focus:border-red-500/50 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-white/30 focus:outline-none transition-all duration-300 shadow-inner"
        />
      </div>

      {/* Filter and Sort options */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-950/60 rounded-2xl border border-white/5">
          {statuses.map((status) => {
            const isActive = statusFilter === status.value;
            return (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/75'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-red-600 rounded-xl shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{status.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-neutral-900/60 border border-white/5 rounded-2xl px-3 py-2 text-xs font-bold text-white/70">
          <SlidersHorizontal size={14} className="text-red-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none cursor-pointer pr-2 font-bold tracking-wide uppercase"
          >
            <option value="newest" className="bg-neutral-950">Newest</option>
            <option value="oldest" className="bg-neutral-950">Oldest</option>
            <option value="highestPrice" className="bg-neutral-950">Highest Price</option>
            <option value="lowestPrice" className="bg-neutral-950">Lowest Price</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
