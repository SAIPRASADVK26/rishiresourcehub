import React from 'react';

/**
 * Modern, high-precision SVG artwork for Rishi Acupuncture & Wellness Center.
 * Replaces faint/crude doodles with crisp, elegant medical vitality & sacred lotus vector art.
 */

export const BambooIllustration = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="acu-grad-blue" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#2563eb" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="acu-grad-soft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
      </linearGradient>
      <radialGradient id="acu-glow-radial" cx="55%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ambient Glow */}
    <circle cx="65" cy="55" r="46" fill="url(#acu-glow-radial)" />

    {/* Concentric Vitality Rings */}
    <circle cx="65" cy="55" r="42" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />
    <circle cx="65" cy="55" r="30" stroke="#2563eb" strokeWidth="1.2" opacity="0.3" />
    <circle cx="65" cy="55" r="18" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />

    {/* Flowing Energy Meridian Pathways */}
    <path 
      d="M 24 96 C 42 78, 52 46, 84 22" 
      stroke="url(#acu-grad-blue)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M 38 102 C 54 82, 68 58, 98 34" 
      stroke="url(#acu-grad-blue)" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      opacity="0.8" 
    />
    <path 
      d="M 16 78 C 38 60, 68 52, 96 64" 
      stroke="url(#acu-grad-soft)" 
      strokeWidth="1.5" 
      strokeDasharray="4 3" 
      strokeLinecap="round" 
    />

    {/* Acupoints / Meridian Nodes (Glowing Energy Points) */}
    <circle cx="84" cy="22" r="3.5" fill="#0284c7" />
    <circle cx="84" cy="22" r="1.5" fill="#ffffff" />

    <circle cx="60" cy="52" r="3" fill="#2563eb" />
    <circle cx="60" cy="52" r="1.2" fill="#ffffff" />

    <circle cx="44" cy="74" r="3" fill="#06b6d4" />
    <circle cx="44" cy="74" r="1.2" fill="#ffffff" />

    <circle cx="98" cy="34" r="2.5" fill="#38bdf8" />
    <circle cx="98" cy="34" r="1" fill="#ffffff" />

    {/* Precision 4-Point Health Sparkles */}
    <path 
      d="M 102 14 Q 102 20 108 20 Q 102 20 102 26 Q 102 20 96 20 Q 102 20 102 14 Z" 
      fill="#0284c7" 
      opacity="0.85" 
    />
    <path 
      d="M 30 38 Q 30 42 34 42 Q 30 42 30 46 Q 30 42 26 42 Q 30 42 30 38 Z" 
      fill="#38bdf8" 
      opacity="0.75" 
    />
    <path 
      d="M 94 72 Q 94 75 97 75 Q 94 75 94 78 Q 94 75 91 75 Q 94 75 94 72 Z" 
      fill="#2563eb" 
      opacity="0.6" 
    />
  </svg>
);

export const LotusIllustration = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wel-grad-amber" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#b45309" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#d97706" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="wel-grad-glow" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#d97706" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.85" />
      </linearGradient>
      <radialGradient id="wel-glow-radial" cx="50%" cy="58%" r="48%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ambient Warm Glow */}
    <circle cx="60" cy="60" r="48" fill="url(#wel-glow-radial)" />

    {/* Concentric Zen Aura Rings */}
    <circle cx="60" cy="60" r="44" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />
    <circle cx="60" cy="60" r="32" stroke="#d97706" strokeWidth="1" opacity="0.3" />

    {/* Outer Lotus Petals */}
    <path 
      d="M 60 82 C 28 78, 16 56, 28 42 C 38 48, 52 66, 60 82 Z" 
      fill="url(#wel-grad-glow)" 
      opacity="0.65" 
    />
    <path 
      d="M 60 82 C 92 78, 104 56, 92 42 C 82 48, 68 66, 60 82 Z" 
      fill="url(#wel-grad-glow)" 
      opacity="0.65" 
    />

    {/* Mid Lotus Petals */}
    <path 
      d="M 60 84 C 36 74, 30 46, 44 32 C 50 44, 56 65, 60 84 Z" 
      fill="url(#wel-grad-amber)" 
      opacity="0.8" 
    />
    <path 
      d="M 60 84 C 84 74, 90 46, 76 32 C 70 44, 64 65, 60 84 Z" 
      fill="url(#wel-grad-amber)" 
      opacity="0.8" 
    />

    {/* Center Crown Lotus Petal */}
    <path 
      d="M 60 86 C 47 66, 47 38, 60 18 C 73 38, 73 66, 60 86 Z" 
      fill="url(#wel-grad-amber)" 
    />
    <path 
      d="M 60 78 C 53 62, 53 44, 60 28 C 67 44, 67 62, 60 78 Z" 
      fill="#fef3c7" 
      opacity="0.8" 
    />

    {/* Lotus Base Support Curve */}
    <path 
      d="M 38 86 Q 60 94 82 86 Q 60 89 38 86 Z" 
      fill="#b45309" 
      opacity="0.7" 
    />

    {/* Golden Wellness Sparkles */}
    <path 
      d="M 100 18 Q 100 24 106 24 Q 100 24 100 30 Q 100 24 94 24 Q 100 24 100 18 Z" 
      fill="#d97706" 
      opacity="0.85" 
    />
    <path 
      d="M 22 26 Q 22 30 26 30 Q 22 30 22 34 Q 22 30 18 30 Q 22 30 22 26 Z" 
      fill="#f59e0b" 
      opacity="0.75" 
    />
    <path 
      d="M 60 8 Q 60 11 63 11 Q 60 11 60 14 Q 60 11 57 11 Q 60 11 60 8 Z" 
      fill="#b45309" 
      opacity="0.8" 
    />
  </svg>
);

export const IraiIllustration = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="irai-grad-emerald" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#047857" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#059669" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="irai-grad-teal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.75" />
      </linearGradient>
      <radialGradient id="irai-glow-radial" cx="55%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ambient Glow */}
    <circle cx="65" cy="55" r="46" fill="url(#irai-glow-radial)" />

    {/* Concentric Knowledge & Globe Rings */}
    <circle cx="65" cy="55" r="42" stroke="#10b981" strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />
    <circle cx="65" cy="55" r="30" stroke="#047857" strokeWidth="1.2" opacity="0.3" />
    <circle cx="65" cy="55" r="18" stroke="#059669" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />

    {/* Flowing Academy Knowledge Wings / Globe Arcs */}
    <path 
      d="M 24 96 C 42 78, 52 46, 84 22" 
      stroke="url(#irai-grad-emerald)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M 38 102 C 54 82, 68 58, 98 34" 
      stroke="url(#irai-grad-emerald)" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      opacity="0.8" 
    />
    <path 
      d="M 16 78 C 38 60, 68 52, 96 64" 
      stroke="url(#irai-grad-teal)" 
      strokeWidth="1.5" 
      strokeDasharray="4 3" 
      strokeLinecap="round" 
    />

    {/* Globe Latitude Arc */}
    <ellipse cx="65" cy="55" rx="36" ry="16" stroke="url(#irai-grad-teal)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" transform="rotate(-20 65 55)" />

    {/* Radiant Knowledge Nodes */}
    <circle cx="84" cy="22" r="3.5" fill="#047857" />
    <circle cx="84" cy="22" r="1.5" fill="#ffffff" />

    <circle cx="60" cy="52" r="3" fill="#059669" />
    <circle cx="60" cy="52" r="1.2" fill="#ffffff" />

    <circle cx="44" cy="74" r="3" fill="#10b981" />
    <circle cx="44" cy="74" r="1.2" fill="#ffffff" />

    <circle cx="98" cy="34" r="2.5" fill="#34d399" />
    <circle cx="98" cy="34" r="1" fill="#ffffff" />

    {/* Precision 4-Point Emerald Sparkles */}
    <path 
      d="M 102 14 Q 102 20 108 20 Q 102 20 102 26 Q 102 20 96 20 Q 102 20 102 14 Z" 
      fill="#047857" 
      opacity="0.85" 
    />
    <path 
      d="M 30 38 Q 30 42 34 42 Q 30 42 30 46 Q 30 42 26 42 Q 30 42 30 38 Z" 
      fill="#10b981" 
      opacity="0.75" 
    />
    <path 
      d="M 94 72 Q 94 75 97 75 Q 94 75 94 78 Q 94 75 91 75 Q 94 75 94 72 Z" 
      fill="#059669" 
      opacity="0.6" 
    />
  </svg>
);
