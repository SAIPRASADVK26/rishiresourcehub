import React, { useState, useEffect } from 'react';
import { X, Plus, Copy, Check, FileText, Download, Code, Edit3, Trash2, AlertTriangle } from 'lucide-react';

export default function AddFormModal({ 
  isOpen, 
  onClose, 
  onAddForm, 
  onEditForm,
  onDeleteForm,
  editData,
  centersData 
}) {
  if (!isOpen) return null;

  const isEditing = Boolean(editData && editData.form);

  const [selectedCenter, setSelectedCenter] = useState('acupuncture');
  const [titleTa, setTitleTa] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [size, setSize] = useState('A4');
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (editData && editData.form) {
      setSelectedCenter(editData.centerId || 'acupuncture');
      setTitleTa(editData.form.titleTa || '');
      setTitleEn(editData.form.titleEn || '');
      setDriveUrl(editData.form.driveUrl || '');
      setSize(editData.form.size || 'A4');
    } else {
      setSelectedCenter('acupuncture');
      setTitleTa('');
      setTitleEn('');
      setDriveUrl('');
      setSize('A4');
    }
    setConfirmDelete(false);
    setShowCodeExport(false);
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleTa.trim() || !titleEn.trim()) return;

    if (isEditing) {
      if (onEditForm && editData && editData.form) {
        onEditForm(editData.centerId, editData.form.id, {
          titleTa: titleTa.trim(),
          titleEn: titleEn.trim(),
          driveUrl: driveUrl.trim() || 'https://drive.google.com',
          size: size,
          type: 'PDF'
        });
      }
    } else {
      if (onAddForm) {
        onAddForm(selectedCenter, {
          titleTa: titleTa.trim(),
          titleEn: titleEn.trim(),
          driveUrl: driveUrl.trim() || 'https://drive.google.com',
          size: size,
          type: 'PDF'
        });
      }
    }

    onClose();
  };

  const handleDelete = () => {
    if (onDeleteForm && editData && editData.form) {
      onDeleteForm(editData.centerId, editData.form.id);
      onClose();
    }
  };

  const generateDataCode = () => {
    return `// Updated formsData.js content\nexport const centersData = ${JSON.stringify(centersData, null, 2)};\n`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateDataCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              {isEditing ? (
                <>
                  <Edit3 className="w-4.5 h-4.5 text-blue-600" />
                  <span>Edit Form (படிவத்தைத் திருத்துக)</span>
                </>
              ) : showCodeExport ? (
                <span>Export formsData.js Code</span>
              ) : (
                <>
                  <Plus className="w-4.5 h-4.5 text-blue-600" />
                  <span>Add New Form (புதிய படிவம்)</span>
                </>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update form details or Google Drive link'
                : showCodeExport 
                  ? 'Copy this code to permanently save in src/data/formsData.js' 
                  : 'Add a new PDF form with its Google Drive link'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showCodeExport ? (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="relative">
              <pre className="p-4 bg-slate-900 text-emerald-400 text-xs rounded-2xl max-h-72 overflow-y-auto font-mono">
                {generateDataCode()}
              </pre>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCodeExport(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                Back to Form
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Center Selector (Disabled or fixed in edit mode, selectable in add mode) */}
            {!isEditing && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Center (மையம்)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCenter('acupuncture')}
                    className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                      selectedCenter === 'acupuncture'
                        ? 'border-blue-500 bg-blue-50/80 text-blue-900 font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">ரிஷி அக்குபஞ்சர்</p>
                    <p className="text-[10px] text-slate-500 truncate">Acupuncture</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCenter('wellness')}
                    className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                      selectedCenter === 'wellness'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-900 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">ரிஷி வெல்னஸ்</p>
                    <p className="text-[10px] text-slate-500 truncate">Wellness</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCenter('irai')}
                    className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                      selectedCenter === 'irai'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">இறை அகாடமி</p>
                    <p className="text-[10px] text-slate-500 truncate">Irai Academy</p>
                  </button>
                </div>
              </div>
            )}

            {/* Tamil Form Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tamil Title (படிவத்தின் பெயர் - தமிழ்) *
              </label>
              <input
                type="text"
                required
                value={titleTa}
                onChange={(e) => setTitleTa(e.target.value)}
                placeholder="எ.கா: பணியாளர் முன்பண விண்ணப்பம்"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
              />
            </div>

            {/* English Form Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                English Subtitle (படிவத்தின் பெயர் - ஆங்கிலம்) *
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Staff Advance Application Form"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
              />
            </div>

            {/* Google Drive Link */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Google Drive PDF Link
              </label>
              <input
                type="url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-mono text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Google Drive-ல் "Anyone with the link can view" permission வழங்கி link-ஐ இங்கே ஒட்டவும்.
              </p>
            </div>

            {/* Paper Size & Export */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Format / Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="A4">A4 Portrait</option>
                  <option value="A5">A5 Portrait</option>
                  <option value="A4 Landscape">A4 Landscape</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setShowCodeExport(true)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Export Code</span>
                </button>
              </div>
            </div>

            {/* Delete Confirmation Box (if triggered) */}
            {confirmDelete && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>இந்த படிவத்தை நீக்க உறுதிப்படுத்தவும் (Confirm Delete)</span>
                </div>
                <p className="text-xs text-red-700 leading-relaxed">
                  "{titleTa}" படிவம் நிரந்தரமாக நீக்கப்படும். தொடரவா?
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    ஆம், நீக்குக (Delete)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    ரத்து (Cancel)
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Form</span>
                    </>
                  )}
                </button>
              </div>

              {/* Delete Button (Only visible when editing and not already in confirm state) */}
              {isEditing && !confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold text-xs rounded-xl transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Delete Form (படிவத்தை நீக்குக)</span>
                </button>
              )}
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
