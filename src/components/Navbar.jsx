import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ShieldCheck, Plus, Search } from 'lucide-react';

export default function Navbar({ 
  onOpenAddModal, 
  totalFormsCount, 
  searchQuery, 
  setSearchQuery,
  centers,
  setActiveFilter,
  isSupabaseLive
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Dynamic counts for centers
  const acupunctureFormsCount = centers?.find(c => c.id === 'acupuncture')?.forms?.length ?? 6;
  const wellnessFormsCount = centers?.find(c => c.id === 'wellness')?.forms?.length ?? 6;
  const iraiFormsCount = centers?.find(c => c.id === 'irai')?.forms?.length ?? 0;

  // Global Ctrl+K / Cmd+K shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13 sm:h-15 gap-2 sm:gap-6">
            
            {/* Left: Clean Stylized 'Rishi' Brand */}
            <div className="flex items-center cursor-pointer select-none shrink-0">
              <img 
                src="/rishi-brand-text.png" 
                alt="Rishi" 
                className="h-7 sm:h-9 w-auto object-contain transition-transform duration-200 hover:scale-105"
              />
            </div>

            {/* Middle: Industry Standard Search Bar */}
            <div className="flex items-center flex-1 max-w-md mx-auto">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search forms..."
                  className="w-full pl-8 sm:pl-9 pr-7 sm:pr-14 py-1.5 text-sm sm:text-xs bg-slate-100/80 hover:bg-white focus:bg-white text-slate-800 rounded-xl border border-slate-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all placeholder:text-slate-400 font-medium"
                />

                <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                      Ctrl K
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Cloud Database Connected Badge */}
              {isSupabaseLive && (
                <div 
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg select-none"
                  title="Supabase Cloud Database Connected (Live CRUD)"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Supabase Live</span>
                </div>
              )}

              <button
                onClick={onOpenAddModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Form</span>
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all active:scale-95 shadow-2xs cursor-pointer"
                aria-label="Open Menu"
              >
                <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu (Full Screen on Mobile, Slide-out Drawer on Tablet/Desktop) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop on tablet/desktop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 hidden sm:block"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel: Full Screen (w-full) on Mobile, sleek max-w-md on sm+ */}
          <div className="relative w-full sm:max-w-md h-full bg-white flex flex-col justify-between p-4 sm:p-6 shadow-2xl sm:border-l sm:border-slate-200/80 overflow-y-auto max-h-screen animate-in slide-in-from-right duration-250 z-10">
              
              <div className="flex flex-col flex-1">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <img src="/rishi-brand-text.png" alt="Rishi" className="h-8.5 w-auto object-contain" />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-3 sm:py-4 space-y-3 sm:space-y-4 flex-1">
                  {/* Total Resources Banner Card */}
                  <div 
                    onClick={() => {
                      setActiveFilter?.('all');
                      setMobileMenuOpen(false);
                    }}
                    className="relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-indigo-50/40 border border-blue-100/90 shadow-2xs cursor-pointer hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                        Internal Resource Hub
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-black bg-blue-600 text-white rounded-full shadow-2xs group-hover:scale-105 transition-transform">
                        {totalFormsCount} Forms
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Official directory for internal forms, circulars, and announcements.
                    </p>
                  </div>

                  {/* Division Quick View Cards */}
                  <div className="space-y-2.5">
                    
                    {/* Acupuncture Division Card */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFilter?.('acupuncture');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-blue-100/80 bg-gradient-to-r from-blue-50/40 via-white to-white hover:border-blue-300 hover:shadow-xs transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white p-1 ring-1 ring-slate-200/80 shadow-2xs shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img 
                          src="/rishi-acupuncture-logo.png" 
                          alt="Rishi Acupuncture" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                          ரிஷி அக்குபஞ்சர் சென்டர்
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                            Acupuncture Center
                          </p>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full shrink-0">
                            {acupunctureFormsCount} {acupunctureFormsCount === 1 ? 'படிவம்' : 'படிவங்கள்'}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Wellness Division Card */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFilter?.('wellness');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-amber-100/80 bg-gradient-to-r from-amber-50/40 via-white to-white hover:border-amber-300 hover:shadow-xs transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white p-1 ring-1 ring-slate-200/80 shadow-2xs shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img 
                          src="/rishi-wellness-logo.png" 
                          alt="Rishi Wellness" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                          ரிஷி வெல்னஸ் சென்டர்
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-[10px] font-bold text-amber-700 tracking-wider uppercase">
                            Wellness Center
                          </p>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full shrink-0">
                            {wellnessFormsCount} {wellnessFormsCount === 1 ? 'படிவம்' : 'படிவங்கள்'}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Irai Academy Division Card */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFilter?.('irai');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-2xl border border-emerald-100/80 bg-gradient-to-r from-emerald-50/40 via-white to-white hover:border-emerald-300 hover:shadow-xs transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white p-1 ring-1 ring-slate-200/80 shadow-2xs shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <img 
                          src="/irai-academy-logo.png" 
                          alt="Irai Academy" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                          இறை அகாடமி
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
                            Irai Academy
                          </p>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0">
                            {iraiFormsCount} {iraiFormsCount === 1 ? 'படிவம்' : 'படிவங்கள்'}
                          </span>
                        </div>
                      </div>
                    </button>

                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAddModal();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-98 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add / Manage Forms</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-3 sm:pt-4 border-t border-slate-100 text-center space-y-2 shrink-0 mt-3 sm:mt-4">
                {isSupabaseLive && (
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50/90 py-1.5 px-3 rounded-xl border border-emerald-200/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Supabase Cloud Connected (Live CRUD)</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Official Internal Use Only</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Designed and Developed by <span className="font-semibold text-slate-700">Zequv</span>
                </p>
              </div>

            </div>
        </div>
      )}
    </>
  );
}
