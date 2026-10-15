import React, { useState, useEffect } from 'react';

export default function LoadingSpinner({ onFinished }) {
  // Steps:
  // 0: start (hidden)
  // 1: 'R'
  // 2: 'Ri' (with yellow dot)
  // 3: 'Ris'
  // 4: 'Rish'
  // 5: 'Rishi' (complete word with yellow dots & yellow underline)
  const [step, setStep] = useState(0);
  const [isGliding, setIsGliding] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Letter-by-letter reveal sequence
    const t0 = setTimeout(() => setStep(1), 100);  // R
    const t1 = setTimeout(() => setStep(2), 350);  // Ri
    const t2 = setTimeout(() => setStep(3), 650);  // Ris
    const t3 = setTimeout(() => setStep(4), 950);  // Rish
    const t4 = setTimeout(() => setStep(5), 1250); // Rishi (full with yellow dots + underline)

    // Smooth glide to navbar position
    const tGlide = setTimeout(() => {
      setIsGliding(true);
    }, 1850);

    // Complete transition and unmount
    const tDone = setTimeout(() => {
      setIsDone(true);
      if (onFinished) onFinished();
    }, 2550);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tGlide);
      clearTimeout(tDone);
    };
  }, []);

  if (isDone) return null;

  // Percentage of width to reveal for each letter
  const getClipWidth = () => {
    switch (step) {
      case 1: return '33%';  // 'R'
      case 2: return '51%';  // 'Ri' (includes first yellow dot)
      case 3: return '69%';  // 'Ris'
      case 4: return '85%';  // 'Rish'
      case 5: return '100%'; // 'Rishi' + yellow underline
      default: return '0%';
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-600 ease-out pointer-events-none ${
        isGliding ? 'opacity-0' : 'opacity-100 bg-white'
      }`}
    >
      {/* Ambient background glow (Sapphire Blue & Amber Yellow aura) */}
      <div 
        className={`absolute w-80 h-80 rounded-full transition-all duration-700 pointer-events-none blur-3xl ${
          step === 5 ? 'bg-amber-400/20 scale-125' : 'bg-blue-500/15 scale-100'
        } ${isGliding ? 'opacity-0' : 'opacity-100'}`}
      ></div>

      {/* Main Rishi Brand Logo Container with Exact Navbar Pattern */}
      <div 
        className={`relative z-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isGliding 
            ? '-translate-y-[42vh] sm:-translate-y-[44vh] -translate-x-0 sm:-translate-x-[26vw] scale-35 sm:scale-40 opacity-0' 
            : 'translate-y-0 translate-x-0 scale-100 opacity-100'
        }`}
      >
        <div className="relative inline-block overflow-hidden py-4 px-2">
          
          {/* Exact Brand Logo with Royal Blue Text, Yellow Dots, and Yellow Underline */}
          <div 
            className="transition-all duration-300 ease-out"
            style={{
              clipPath: `inset(0 calc(100% - ${getClipWidth()}) 0 0)`
            }}
          >
            <img 
              src="/rishi-brand-text.png" 
              alt="Rishi" 
              className="h-20 sm:h-28 md:h-32 w-auto object-contain drop-shadow-[0_8px_20px_rgba(37,99,235,0.15)]"
            />
          </div>

          {/* Golden shimmer spark when fully revealed */}
          {step === 5 && (
            <div className="absolute inset-0 pointer-events-none animate-pulse bg-gradient-to-r from-transparent via-amber-300/10 to-transparent"></div>
          )}

        </div>
      </div>

    </div>
  );
}
