import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = () => {
  return (
    <div className="relative z-10 w-full text-left space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="glass p-8 rounded-[3rem] border border-white/5 bg-neutral-900/40 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-white/5 shrink-0" />
        <div className="flex-grow space-y-3 w-full">
          <div className="h-8 bg-white/5 rounded-lg w-3/4 max-w-sm" />
          <div className="h-4 bg-white/5 rounded-lg w-1/2 max-w-xs" />
          <div className="h-3 bg-white/5 rounded-lg w-1/3 max-w-[200px]" />
        </div>
        <div className="hidden md:flex gap-4">
          <div className="w-24 h-24 bg-white/5 rounded-[1.5rem]" />
          <div className="w-24 h-24 bg-white/5 rounded-[1.5rem]" />
          <div className="w-24 h-24 bg-white/5 rounded-[1.5rem]" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="glass p-5 rounded-[2rem] border border-white/5 bg-neutral-900/40 flex flex-col md:flex-row gap-4 h-20" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-[2rem] border border-white/5 bg-neutral-900/40 flex flex-col sm:flex-row overflow-hidden min-h-[220px]">
            <div className="w-full sm:w-48 aspect-[2/3] sm:aspect-auto sm:h-full bg-white/5 shrink-0" />
            <div className="p-6 flex-grow flex flex-col gap-4 w-full">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                  <div className="h-6 bg-white/5 rounded-lg w-2/3" />
                  <div className="h-4 bg-white/5 rounded-lg w-1/3" />
                </div>
                <div className="w-16 h-6 bg-white/5 rounded-full shrink-0" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="h-10 bg-white/5 rounded-lg" />
                <div className="h-10 bg-white/5 rounded-lg" />
                <div className="h-10 bg-white/5 rounded-lg col-span-2" />
              </div>
              <div className="flex gap-2 mt-2">
                <div className="h-8 bg-white/5 rounded-xl w-full" />
                <div className="h-8 bg-white/5 rounded-xl w-full" />
                <div className="h-8 bg-white/5 rounded-xl w-full" />
                <div className="h-8 bg-white/5 rounded-xl w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
