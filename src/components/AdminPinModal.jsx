import React, { useState, useRef, useEffect } from 'react';
import { Lock, Unlock, X, ShieldAlert, KeyRound } from 'lucide-react';
import { verifyAdminPin } from '../lib/auth';

export default function AdminPinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError(false);
      setIsLoading(false);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (index, value) => {
    // Only allow single digit numeric
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal && value !== '') return;

    const newPin = [...pin];
    newPin[index] = cleanVal ? cleanVal[cleanVal.length - 1] : '';
    setPin(newPin);
    setError(false);

    // Auto-advance to next input
    if (cleanVal && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (cleanVal && index === 3 && newPin.every(d => d !== '')) {
      validateAndSubmit(newPin.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const validateAndSubmit = async (enteredPin) => {
    setIsLoading(true);
    setError(false);
    
    const isValid = await verifyAdminPin(enteredPin);
    setIsLoading(false);

    if (isValid) {
      onSuccess?.();
      onClose();
    } else {
      setError(true);
      setPin(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin.length === 4) {
      validateAndSubmit(fullPin);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-sm overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 p-6 sm:p-7 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon Emblem */}
        <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center transition-all ${
          error ? 'bg-rose-50 text-rose-600 ring-4 ring-rose-100' : 'bg-blue-50 text-blue-600 ring-4 ring-blue-100'
        }`}>
          {error ? (
            <ShieldAlert className="w-7 h-7" />
          ) : (
            <KeyRound className="w-7 h-7" />
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-slate-900 mt-4">
          Admin Access (நிர்வாக அனுமதி)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          படிவங்களை திருத்த மற்றும் நீக்க 4-Digit Security PIN-ஐ உள்ளிடவும்.
        </p>

        {/* 4-Digit PIN Input Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex justify-center items-center gap-3">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isLoading}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all outline-hidden ${
                  error 
                    ? 'border-rose-400 bg-rose-50/50 text-rose-700 focus:ring-2 focus:ring-rose-200 animate-shake' 
                    : 'border-slate-200 bg-slate-50/70 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 mt-3 animate-fade-in">
              தவறான PIN! (Incorrect PIN. Try again)
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading || pin.some(d => !d)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>சரிபார்க்கிறது...</span>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin Mode</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              ரத்து செய் (Cancel)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
