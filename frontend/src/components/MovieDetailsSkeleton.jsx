import React from 'react';

const MovieDetailsSkeleton = () => {
  return (
    <div className="space-y-16 animate-pulse max-w-7xl mx-auto px-4 py-8">
      {/* Hero & Poster Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
        {/* Left: Poster Skeleton */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-[300px] sm:w-[350px] aspect-[2/3] rounded-[2rem] bg-neutral-900 border border-white/5 relative overflow-hidden flex flex-col justify-end p-6">
            <div className="skeleton-shimmer absolute inset-0"></div>
            <div className="h-6 w-3/4 bg-neutral-800 rounded-lg relative z-10 mb-3"></div>
            <div className="h-4 w-1/2 bg-neutral-800 rounded-lg relative z-10"></div>
          </div>
        </div>

        {/* Right: Info & Description Skeleton */}
        <div className="lg:col-span-8 space-y-8 flex flex-col justify-center">
          <div>
            {/* Tag/Badge Skeleton */}
            <div className="h-5 w-24 bg-neutral-900 skeleton-shimmer rounded mb-4"></div>
            {/* Title Skeleton */}
            <div className="h-16 w-3/4 bg-neutral-900 skeleton-shimmer rounded-xl mb-6"></div>
            {/* Meta Row Skeletons */}
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-20 bg-neutral-900 skeleton-shimmer rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Description Block */}
          <div className="p-8 rounded-3xl bg-neutral-900/40 border border-white/5 space-y-3 relative overflow-hidden">
            <div className="skeleton-shimmer absolute inset-0"></div>
            <div className="h-5 w-32 bg-neutral-850 rounded"></div>
            <div className="h-4 w-full bg-neutral-850 rounded"></div>
            <div className="h-4 w-11/12 bg-neutral-850 rounded"></div>
            <div className="h-4 w-4/5 bg-neutral-850 rounded"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="h-14 w-48 bg-neutral-900 skeleton-shimmer rounded-full"></div>
            <div className="h-14 w-40 bg-neutral-900 skeleton-shimmer rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Info Grid Section Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-28 rounded-3xl bg-neutral-900/30 border border-white/5 p-6 relative overflow-hidden">
            <div className="skeleton-shimmer absolute inset-0"></div>
            <div className="h-4 w-12 bg-neutral-850 rounded mb-2"></div>
            <div className="h-6 w-24 bg-neutral-850 rounded"></div>
          </div>
        ))}
      </div>

      {/* Cast Section Skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-40 bg-neutral-900 skeleton-shimmer rounded"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-4 p-4 rounded-3xl bg-neutral-900/20 border border-white/5 relative overflow-hidden">
              <div className="skeleton-shimmer absolute inset-0"></div>
              <div className="w-24 h-24 rounded-full bg-neutral-850"></div>
              <div className="h-4 w-20 bg-neutral-850 rounded"></div>
              <div className="h-3 w-16 bg-neutral-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Trailer Preview Skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-900 skeleton-shimmer rounded"></div>
        <div className="aspect-video w-full rounded-[2.5rem] bg-neutral-900/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
          <div className="skeleton-shimmer absolute inset-0"></div>
          <div className="w-20 h-20 rounded-full bg-neutral-800/80 flex items-center justify-center">
            <div className="w-6 h-6 border-t-8 border-b-8 border-l-12 border-transparent border-l-neutral-700 ml-1"></div>
          </div>
        </div>
      </div>

      {/* Experience / Shows Skeleton */}
      <div className="space-y-8">
        <div className="h-10 w-64 bg-neutral-900 skeleton-shimmer rounded"></div>
        {[1, 2].map((i) => (
          <div key={i} className="p-8 rounded-3xl bg-neutral-900/20 border border-white/5 space-y-6 relative overflow-hidden">
            <div className="skeleton-shimmer absolute inset-0"></div>
            <div className="h-6 w-48 bg-neutral-850 rounded"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-20 bg-neutral-850 rounded-2xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Related Movies Skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-44 bg-neutral-900 skeleton-shimmer rounded"></div>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-[180px] sm:w-[220px] shrink-0 aspect-[2/3] rounded-[2rem] bg-neutral-900/40 border border-white/5 relative overflow-hidden p-4 flex flex-col justify-end">
              <div className="skeleton-shimmer absolute inset-0"></div>
              <div className="h-4 w-3/4 bg-neutral-800 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-neutral-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsSkeleton;
