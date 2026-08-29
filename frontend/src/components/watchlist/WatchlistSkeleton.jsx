import React from 'react';
import { motion } from 'framer-motion';

const WatchlistSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-64 bg-white/5 rounded-2xl" />
        <div className="h-4 w-40 bg-white/5 rounded-xl" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white/5 rounded-3xl border border-white/5" />
        ))}
      </div>

      {/* Search/Sort Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-12 bg-white/5 rounded-2xl" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-20 bg-white/5 rounded-full" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02]">
            <div className="aspect-[2/3] w-full bg-white/5" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-white/5 rounded-lg w-3/4" />
              <div className="h-3 bg-white/5 rounded-lg w-1/2" />
              <div className="h-10 bg-white/5 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistSkeleton;
