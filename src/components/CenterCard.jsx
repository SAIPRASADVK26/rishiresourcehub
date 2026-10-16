import React from 'react';
import { ArrowRight, Copy, Check, Eye, Edit3 } from 'lucide-react';
import { BambooIllustration, LotusIllustration, IraiIllustration } from './Illustrations';

export default function CenterCard({ 
  center, 
  onPreviewForm, 
  onCopyLink, 
  onEditForm,
  copiedId 
}) {
  const isBlue = center.theme?.colorName === 'blue' || center.id === 'acupuncture';
  const isEmerald = center.theme?.colorName === 'emerald' || center.id === 'irai';

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-3 sm:p-4.5 transition-all duration-200 hover:shadow-md">
      
      {/* Compact Top Banner Header */}
      <div className={`group/banner rounded-xl ${center.theme.headerBg} p-3 sm:p-4 relative overflow-hidden border border-slate-200/60`}>
        
        {/* Decorative Vector Artwork */}
        <div className="absolute -right-1 -bottom-2 pointer-events-none select-none opacity-45 sm:opacity-60 group-hover/banner:opacity-90 group-hover/banner:scale-105 transition-all duration-300">
          {center.illustration === 'acupuncture' ? (
            <BambooIllustration className="w-16 h-16 sm:w-24 sm:h-24" />
          ) : center.illustration === 'irai' ? (
            <IraiIllustration className="w-16 h-16 sm:w-24 sm:h-24" />
          ) : (
            <LotusIllustration className="w-16 h-16 sm:w-24 sm:h-24" />
          )}
        </div>

        <div className="flex items-center justify-between gap-2.5 sm:gap-3 relative z-10">
          
          {/* Logo & Center Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-8 sm:pr-0">
            {/* Logo Container */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white p-1 shadow-2xs ring-1 ring-slate-200/80 shrink-0 flex items-center justify-center">
              <img 
                src={center.logoUrl || (isBlue ? "/rishi-acupuncture-logo.png" : isEmerald ? "/irai-academy-logo.png" : "/rishi-wellness-logo.png")} 
                alt={center.nameEn} 
                className="w-full h-full object-contain" 
              />
            </div>

            {/* Titles */}
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug break-words">
                {center.nameTa}
              </h2>
              <p className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${center.theme.accentText} mt-0.5`}>
                {center.nameEn}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Section Subheader Strip (Compact on mobile, strictly single straight line) */}
      <div className="flex items-center justify-between flex-nowrap gap-2 mt-2 sm:mt-2.5 mb-1.5 sm:mb-2 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${center.theme.accentDot}`}></div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-700 sm:text-slate-800 whitespace-nowrap">
            {center.sectionTitle}
          </h3>
        </div>

        <span className={`px-2 py-0.5 text-[10.5px] sm:text-xs font-bold rounded-full shrink-0 whitespace-nowrap ${center.theme.pillBadge}`}>
          {center.forms.length} {center.forms.length === 1 ? 'படிவம்' : 'படிவங்கள்'}
        </span>
      </div>

      {/* Compact Forms List */}
      <div className="space-y-1.5 sm:space-y-2">
        {center.forms.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            No documents found.
          </div>
        ) : (
          center.forms.map((form) => {
            const isCopied = copiedId === form.id;

            return (
              <div
                key={form.id}
                onClick={() => onPreviewForm(form, center)}
                className={`group relative flex items-center justify-between p-2.5 sm:p-3 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/70 ${
                  isBlue 
                    ? 'hover:border-blue-300 hover:shadow-blue-500/10' 
                    : isEmerald
                      ? 'hover:border-emerald-300 hover:shadow-emerald-500/10'
                      : 'hover:border-amber-300 hover:shadow-amber-500/10'
                } hover:shadow-sm transition-all duration-150 cursor-pointer`}
              >
                {/* Left: Number + Titles */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                  
                  {/* Number Badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-all duration-150 ${
                    isBlue 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200/70 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600' 
                      : isEmerald
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/80 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600'
                  }`}>
                    {form.number}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-bold text-slate-800 text-sm sm:text-[15px] leading-snug break-words transition-colors duration-150 ${
                      isBlue 
                        ? 'group-hover:text-blue-600' 
                        : isEmerald
                          ? 'group-hover:text-emerald-700'
                          : 'group-hover:text-amber-700'
                    }`}>
                      {form.titleTa}
                    </h4>
                    <p className="text-xs sm:text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                      {form.titleEn}
                    </p>
                  </div>

                </div>

                {/* Right: Actions & Arrow Circle */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  
                  {/* Copy Link Button (Desktop Hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyLink(form);
                    }}
                    className="form-action-copy p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="Copy Link"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Edit Form Button (Mobile & Desktop) */}
                  {onEditForm && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditForm(form, center);
                      }}
                      className="form-action-edit p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-center shrink-0"
                      title="Edit Form"
                      aria-label="Edit Form"
                    >
                      <Edit3 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                  )}

                  {/* Quick Preview / View Button (Visible on mobile, reveals on desktop hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewForm(form, center);
                    }}
                    className="form-action-view p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-center shrink-0"
                    title="View Form"
                    aria-label="View Form"
                  >
                    <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </button>

                  {/* Primary Arrow Circle Button (Opens Drive) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(form.driveUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer ${
                      isBlue
                        ? 'bg-blue-50/80 text-blue-600 border border-blue-200/60 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
                        : isEmerald
                          ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/70 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600'
                          : 'bg-amber-50/80 text-amber-700 border border-amber-200/70 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600'
                    }`}
                    title="Open in Google Drive"
                  >
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
