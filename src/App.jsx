import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import CenterCard from './components/CenterCard';
import PreviewModal from './components/PreviewModal';
import AddFormModal from './components/AddFormModal';
import AdminPinModal from './components/AdminPinModal';
import LoadingSpinner from './components/LoadingSpinner';
import { centersData as defaultCentersData } from './data/formsData';
import { getAdminSession, setAdminSession } from './lib/auth';
import { 
  isSupabaseConfigured, 
  fetchFormsFromSupabase, 
  upsertFormToSupabase, 
  batchUpsertFormsToSupabase,
  deleteFormFromSupabase, 
  syncAllCentersToSupabase,
  subscribeToForms 
} from './lib/supabase';
import { Check } from 'lucide-react';

export default function App() {
  // Load data from localStorage if available, otherwise use default
  const [centers, setCenters] = useState(() => {
    try {
      const saved = localStorage.getItem('rishi_forms_data_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(c => ({
          ...c,
          sectionTitle: 'அலுவலகப் படிவங்கள்'
        }));
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return defaultCentersData;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [previewData, setPreviewData] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(isSupabaseConfigured);
  const [isAdmin, setIsAdmin] = useState(getAdminSession);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const handleUnlockAdmin = () => {
    setIsAdmin(true);
    setAdminSession(true);
    showToast('நிர்வாக பயன்முறை திறக்கப்பட்டது! (Admin Mode Unlocked)');
  };

  const handleLockAdmin = () => {
    setIsAdmin(false);
    setAdminSession(false);
    showToast('நிர்வாக பயன்முறை பூட்டப்பட்டது (Admin Mode Locked)');
  };

  // Sync to Supabase cloud if configured, with Realtime updates
  useEffect(() => {
    let isMounted = true;

    const loadFromSupabase = async () => {
      if (!isSupabaseConfigured) return;
      try {
        // One-time cleanup of legacy keys so deleted forms are never re-created
        try {
          localStorage.removeItem('rishi_forms_data_v4');
          localStorage.removeItem('rishi_forms_data_v3');
          localStorage.removeItem('rishi_forms_data_v2');
        } catch {
          // ignore
        }

        const dbForms = await fetchFormsFromSupabase();
        if (dbForms && isMounted) {
          setIsSupabaseLive(true);

          // If Supabase table is completely empty, auto-seed it with default centers
          if (dbForms.length === 0) {
            console.log('Supabase table is empty, seeding default data...');
            await syncAllCentersToSupabase(defaultCentersData);
            return;
          }

          // Map database records directly to centers
          setCenters(() => {
            return defaultCentersData.map(center => {
              const matching = dbForms
                .filter(f => f.center_id === center.id)
                .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || String(a.number).localeCompare(String(b.number)));

              return {
                ...center,
                sectionTitle: 'அலுவலகப் படிவங்கள்',
                forms: matching.map(f => ({
                  id: f.id,
                  number: f.number,
                  titleTa: f.title_ta,
                  titleEn: f.title_en,
                  driveUrl: f.drive_url,
                  type: f.type || 'PDF',
                  size: f.size || 'A4'
                }))
              };
            });
          });
        }
      } catch (err) {
        console.error('Failed to fetch from Supabase:', err);
      }
    };

    loadFromSupabase();

    if (isSupabaseConfigured) {
      const unsubscribe = subscribeToForms((payload) => {
        console.log('Realtime change received from Supabase:', payload);
        loadFromSupabase();
      });
      return () => {
        isMounted = false;
        unsubscribe();
      };
    }
  }, []);

  // Sync to localStorage and persist to disk (formsData.js) in local dev
  useEffect(() => {
    try {
      localStorage.setItem('rishi_forms_data_v5', JSON.stringify(centers));
    } catch (e) {
      console.error('Failed to save to storage', e);
    }

    // Automatically write to formsData.js on disk so Mobile & Vercel get all real links
    if (Array.isArray(centers) && centers.length > 0) {
      fetch('/api/save-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(centers)
      }).catch(() => {
        // Ignored on production static deployments
      });
    }
  }, [centers]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyLink = (form) => {
    if (!form.driveUrl) return;
    navigator.clipboard.writeText(form.driveUrl);
    setCopiedId(form.id);
    showToast(`"${form.titleTa}" link copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      setIsPinModalOpen(true);
      return;
    }
    setEditingForm(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (form, center) => {
    if (!isAdmin) {
      setIsPinModalOpen(true);
      return;
    }
    setEditingForm({ centerId: center.id, form });
    setIsAddModalOpen(true);
  };

  const handleAddForm = async (centerId, newFormData) => {
    const currentCenter = centers.find(c => c.id === centerId);
    const newNumber = String((currentCenter?.forms?.length || 0) + 1).padStart(2, '0');
    const newForm = {
      id: `${centerId}-${Date.now()}`,
      number: newNumber,
      titleTa: newFormData.titleTa,
      titleEn: newFormData.titleEn,
      driveUrl: newFormData.driveUrl,
      type: newFormData.type || 'PDF',
      size: newFormData.size || 'A4'
    };

    // Immediate UI update
    setCenters(prevCenters => {
      return prevCenters.map(center => {
        if (center.id === centerId) {
          return {
            ...center,
            forms: [...center.forms, newForm]
          };
        }
        return center;
      });
    });

    if (isSupabaseConfigured) {
      try {
        await upsertFormToSupabase({
          id: newForm.id,
          center_id: centerId,
          number: newForm.number,
          title_ta: newForm.titleTa,
          title_en: newForm.titleEn,
          drive_url: newForm.driveUrl,
          type: newForm.type || 'PDF',
          size: newForm.size || 'A4',
          sort_order: parseInt(newForm.number, 10) || 1
        });
        showToast('புதிய படிவம் Supabase-ல் சேமிக்கப்பட்டது! (Saved to Supabase!)');
      } catch (err) {
        console.error('Supabase add failed:', err);
        showToast('Supabase-ல் சேமிப்பதில் பிழை ஏற்பட்டது! (Failed to save)');
      }
    } else {
      showToast('புதிய படிவம் சேர்க்கப்பட்டது! (Form added)');
    }
  };

  const handleEditForm = async (centerId, formId, updatedFormData) => {
    let targetForm = null;

    setCenters(prevCenters => {
      return prevCenters.map(center => {
        if (center.id === centerId) {
          return {
            ...center,
            forms: center.forms.map(form => {
              if (form.id === formId) {
                targetForm = { ...form, ...updatedFormData };
                return targetForm;
              }
              return form;
            })
          };
        }
        return center;
      });
    });

    if (isSupabaseConfigured && targetForm) {
      try {
        await upsertFormToSupabase({
          id: targetForm.id,
          center_id: centerId,
          number: targetForm.number,
          title_ta: targetForm.titleTa,
          title_en: targetForm.titleEn,
          drive_url: targetForm.driveUrl,
          type: targetForm.type || 'PDF',
          size: targetForm.size || 'A4',
          sort_order: parseInt(targetForm.number, 10) || 1
        });
        showToast('படிவம் Supabase-ல் புதுப்பிக்கப்பட்டது! (Updated in Supabase!)');
      } catch (err) {
        console.error('Supabase update failed:', err);
        showToast('Supabase-ல் புதுப்பிப்பதில் பிழை! (Update failed)');
      }
    } else {
      showToast('படிவம் புதுப்பிக்கப்பட்டது! (Form updated)');
    }
  };

  const handleDeleteForm = async (centerId, formId) => {
    const currentCenter = centers.find(c => c.id === centerId);
    if (!currentCenter) return;

    const remainingForms = currentCenter.forms
      .filter(form => form.id !== formId)
      .map((form, index) => ({
        ...form,
        number: String(index + 1).padStart(2, '0')
      }));

    // Immediate UI update
    setCenters(prevCenters => {
      return prevCenters.map(center => {
        if (center.id === centerId) {
          return {
            ...center,
            forms: remainingForms
          };
        }
        return center;
      });
    });

    if (isSupabaseConfigured) {
      try {
        // 1. Delete from Supabase
        await deleteFormFromSupabase(formId);

        // 2. Renumber remaining forms in Supabase so sequential order is preserved
        if (remainingForms.length > 0) {
          const batchRows = remainingForms.map((rf, idx) => ({
            id: rf.id,
            center_id: centerId,
            number: rf.number,
            title_ta: rf.titleTa,
            title_en: rf.titleEn,
            drive_url: rf.driveUrl,
            type: rf.type || 'PDF',
            size: rf.size || 'A4',
            sort_order: idx + 1
          }));
          await batchUpsertFormsToSupabase(batchRows);
        }

        showToast('படிவம் Supabase-லிருந்து நிரந்தரமாக நீக்கப்பட்டது! (Deleted from Supabase!)');
      } catch (err) {
        console.error('Supabase delete failed:', err);
        showToast('Supabase-ல் நீக்குவதில் பிழை! (Delete failed)');
      }
    } else {
      showToast('படிவம் நீக்கப்பட்டது! (Form deleted)');
    }
  };

  // Filter centers and forms based on search query and active tab
  const filteredCenters = centers
    .filter(center => {
      if (activeFilter === 'all') return true;
      return center.id === activeFilter;
    })
    .map(center => {
      if (!searchQuery.trim()) return center;

      const q = searchQuery.toLowerCase().trim();
      const matchingForms = center.forms.filter(form => 
        form.titleTa.toLowerCase().includes(q) ||
        form.titleEn.toLowerCase().includes(q) ||
        form.number.includes(q)
      );

      return {
        ...center,
        forms: matchingForms
      };
    });

  // Calculate total forms and matching forms
  const totalAllForms = centers.reduce((sum, c) => sum + c.forms.length, 0);
  const totalMatchingForms = filteredCenters.reduce((sum, c) => sum + c.forms.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Initial Splash Loading Screen with Rishi Brand Animation */}
      <LoadingSpinner onFinished={() => setIsLoading(false)} />

      {/* Background Aurora Mesh Glows */}
      <div className="aurora-bg"></div>

      {/* Top Navigation with Industry Standard Search Bar */}
      <Navbar 
        onOpenAddModal={handleOpenAddModal} 
        totalFormsCount={totalAllForms}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        centers={centers}
        setActiveFilter={setActiveFilter}
        isSupabaseLive={isSupabaseLive}
        isAdmin={isAdmin}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onLogoutAdmin={handleLockAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        
        {/* Clean Hero Title & Category Filters */}
        <Header 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          totalResults={totalMatchingForms}
        />

        {/* Forms Directory Two-Column Layout */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-1 sm:pt-2">
          
          {filteredCenters.length === 0 || (searchQuery && totalMatchingForms === 0) ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-lg mx-auto p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg font-bold">
                ?
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-3">எந்த படிவமும் கிடைக்கவில்லை</h3>
              <p className="text-xs text-slate-500 mt-1">
                No forms found matching "{searchQuery}". Try searching for another keyword.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${filteredCenters.length === 1 ? 'max-w-2xl mx-auto' : filteredCenters.length === 2 ? 'lg:grid-cols-2 max-w-5xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-5 sm:gap-6 items-stretch`}>
              {filteredCenters.map(center => (
                <CenterCard
                  key={center.id}
                  center={center}
                  onPreviewForm={(form) => setPreviewData({ form, center })}
                  onCopyLink={handleCopyLink}
                  onEditForm={(form) => handleOpenEditModal(form, center)}
                  copiedId={copiedId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}

        </div>

      </main>

      {/* Compact Minimal Footer */}
      <footer className="border-t border-slate-200/60 bg-white/80 py-3 sm:py-3.5 px-4 text-center mt-auto">
        <p className="text-xs text-slate-500">
          Designed and Developed by <span className="font-semibold text-slate-800 tracking-wide">Zequv</span>
        </p>
      </footer>

      {/* Preview Modal */}
      {previewData && (
        <PreviewModal
          form={previewData.form}
          center={previewData.center}
          onClose={() => setPreviewData(null)}
          onCopyLink={handleCopyLink}
          onEditForm={(form, center) => handleOpenEditModal(form, center)}
          onDeleteForm={handleDeleteForm}
          isCopied={copiedId === previewData.form.id}
          isAdmin={isAdmin}
        />
      )}

      {/* Add / Edit Form Modal */}
      <AddFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingForm(null);
        }}
        onAddForm={handleAddForm}
        onEditForm={handleEditForm}
        onDeleteForm={handleDeleteForm}
        editData={editingForm}
        centersData={centers}
      />

      {/* Admin Security PIN Modal */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleUnlockAdmin}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
