import React from 'react';

export default function Header({ 
  activeFilter, 
  setActiveFilter, 
  totalResults 
}) {
  return (
    <div className="pt-3 pb-3 sm:pt-8 sm:pb-8 text-center px-3 sm:px-4 max-w-4xl mx-auto relative z-10">
      
      {/* Clean Main Title */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-sans leading-tight">
        Rishi <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">Forms Hub</span>
      </h1>

      {/* Mobile-optimized Horizontal Filter Chips */}
      <div className="mt-3 sm:mt-5 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/80'
          }`}
        >
          அனைத்தும் (All)
        </button>

        <button
          onClick={() => setActiveFilter('acupuncture')}
          className={`px-3 py-1.5 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeFilter === 'acupuncture'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-blue-700 hover:bg-blue-50/60 border border-blue-200/80'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${activeFilter === 'acupuncture' ? 'bg-white' : 'bg-blue-600'}`}></span>
          ரிஷி அக்குபஞ்சர்
        </button>

        <button
          onClick={() => setActiveFilter('wellness')}
          className={`px-3 py-1.5 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeFilter === 'wellness'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-800 hover:bg-amber-50/60 border border-amber-200/80'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${activeFilter === 'wellness' ? 'bg-white' : 'bg-amber-600'}`}></span>
          ரிஷி வெல்னஸ்
        </button>

        <button
          onClick={() => setActiveFilter('irai')}
          className={`px-3 py-1.5 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
            activeFilter === 'irai'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-800 hover:bg-emerald-50/60 border border-emerald-200/80'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${activeFilter === 'irai' ? 'bg-white' : 'bg-emerald-600'}`}></span>
          இறை அகாடமி
        </button>
      </div>

    </div>
  );
}
