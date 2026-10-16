import React from 'react';
import { X, ExternalLink, Copy, Check, Download, FileText, AlertCircle, Edit3, Trash2 } from 'lucide-react';

export default function PreviewModal({ 
  form, 
  center, 
  onClose, 
  onCopyLink, 
  onEditForm,
  onDeleteForm,
  isCopied 
}) {
  if (!form) return null;

  // Convert Google Drive view URL to preview URL for iframe embedding
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(form.driveUrl);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${form.titleTa}"?`)) {
      onClose();
      if (onDeleteForm) {
        onDeleteForm(center.id, form.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-3 sm:px-5 sm:py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
              {form.number}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">
                {form.titleTa}
              </h3>
              <p className="text-xs sm:text-xs text-slate-500 font-medium truncate">
                {form.titleEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Edit Form Button */}
            {onEditForm && (
              <button
                onClick={() => {
                  onClose();
                  onEditForm(form, center);
                }}
                className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
                title="Edit Form"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}

            {/* Delete Form Button */}
            {onDeleteForm && (
              <button
                onClick={handleDelete}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
                title="Delete Form"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            )}

            {/* Copy Drive Link */}
            <button
              onClick={() => onCopyLink(form)}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
              title="Copy Drive Link"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Open in Drive */}
            <a
              href={form.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">Open in Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* PDF / Document Viewer Frame */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
          {form.driveUrl ? (
            <iframe
              src={embedUrl}
              title={form.titleEn}
              className="w-full h-full border-0 bg-white"
              allow="autoplay"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No Google Drive link attached yet</p>
              <p className="text-xs text-slate-400 mt-1">Add your Google Drive sharing link to preview here</p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-3.5 py-2 sm:px-5 sm:py-2.5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-1 text-center sm:text-left">
          <span>Format: {form.type || 'PDF'} ({form.size || 'A4'})</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400">Click "Open in Drive" to print or download the original file</span>
        </div>

      </div>

    </div>
  );
}
