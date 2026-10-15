import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import CenterCard from './components/CenterCard';
import PreviewModal from './components/PreviewModal';
import AddFormModal from './components/AddFormModal';
import LoadingSpinner from './components/LoadingSpinner';
import { centersData as defaultCentersData } from './data/formsData';
import { 
  isSupabaseConfigured, 
  fetchFormsFromSupabase, 
  upsertFormToSupabase, 
  deleteFormFromSupabase, 
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
      // Fallback check earlier versions and sanitize sectionTitle
      const savedPrev = localStorage.getItem('rishi_forms_data_v4') || localStorage.getItem('rishi_forms_data_v3') || localStorage.getItem('rishi_forms_data_v2');
      if (savedPrev) {
        const parsed = JSON.parse(savedPrev);
        const hasIrai = parsed.some(c => c.id === 'irai');
        let list = parsed;
        if (!hasIrai) {
          const iraiDefault = defaultCentersData.find(c => c.id === 'irai');
          if (iraiDefault) list = [...parsed, iraiDefault];
        }
        return list.map(c => ({
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

  // Sync to Supabase cloud if configured, with Realtime updates
  useEffect(() => {
    let isMounted = true;

    const loadFromSupabase = async () => {
      if (!isSupabaseConfigured) return;
      try {
        // First check if user has custom edited forms in localStorage to migrate to cloud
        const savedLocal = localStorage.getItem('rishi_forms_data_v4') || localStorage.getItem('rishi_forms_data_v3') || localStorage.getItem('rishi_forms_data_v2');
        if (savedLocal) {
          try {
            const localCenters = JSON.parse(savedLocal);
            const customForms = [];
            localCenters.forEach(center => {
              (center.forms || []).forEach((form, idx) => {
                const isCustomUrl = form.driveUrl && !form.driveUrl.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
                const isNewForm = !['acu-01','acu-02','acu-03','acu-04','acu-05','acu-06','wel-01','wel-02','wel-03','wel-04','wel-05','wel-06','irai-01'].includes(form.id);
                if (isCustomUrl || isNewForm) {
                  customForms.push({
                    id: form.id,
                    center_id: center.id,
                    number: form.number,
                    title_ta: form.titleTa,
                    title_en: form.titleEn,
                    drive_url: form.driveUrl,
                    type: form.type || 'PDF',
                    size: form.size || 'A4',
                    sort_order: idx + 1
                  });
                }
              });
            });

            if (customForms.length > 0) {
              for (const cf of customForms) {
                await upsertFormToSupabase(cf);
              }
            }
          } catch (e) {
            console.error('LocalStorage migration check failed:', e);
          }
        }

        const dbForms = await fetchFormsFromSupabase();
        if (dbForms && dbForms.length > 0 && isMounted) {
          setCenters(() => {
            return defaultCentersData.map(center => {
              const matching = dbForms.filter(f => f.center_id === center.id);
              if (matching.length === 0) return center;
              return {
                ...center,
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
      const unsubscribe = subscribeToForms(() => {
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
    setEditingForm(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (form, center) => {
    setEditingForm({ centerId: center.id, form });
    setIsAddModalOpen(true);
  };

  const handleAddForm = (centerId, newFormData) => {
    const currentCenter = centers.find(c => c.id === centerId);
    const newNumber = String((currentCenter?.forms?.length || 0) + 1).padStart(2, '0');
    const newForm = {
      id: `${centerId}-${Date.now()}`,
      number: newNumber,
      ...newFormData
    };

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

    // Cloud sync to Supabase if configured
    if (isSupabaseConfigured) {
      upsertFormToSupabase({
        id: newForm.id,
        center_id: centerId,
        number: newForm.number,
        title_ta: newForm.titleTa,
        title_en: newForm.titleEn,
        drive_url: newForm.driveUrl,
        type: newForm.type || 'PDF',
        size: newForm.size || 'A4',
        sort_order: parseInt(newForm.number, 10) || 0
      }).catch(err => console.error('Supabase add failed:', err));
    }

    showToast('புதிய படிவம் சேர்க்கப்பட்டது! (New form added!)');
  };

  const handleEditForm = (centerId, formId, updatedFormData) => {
    setCenters(prevCenters => {
      return prevCenters.map(center => {
        if (center.id === centerId) {
          return {
            ...center,
            forms: center.forms.map(form => {
              if (form.id === formId) {
                const merged = { ...form, ...updatedFormData };
                // Cloud sync to Supabase if configured
                if (isSupabaseConfigured) {
                  upsertFormToSupabase({
                    id: merged.id,
                    center_id: centerId,
                    number: merged.number,
                    title_ta: merged.titleTa,
                    title_en: merged.titleEn,
                    drive_url: merged.driveUrl,
                    type: merged.type || 'PDF',
                    size: merged.size || 'A4',
                    sort_order: parseInt(merged.number, 10) || 0
                  }).catch(err => console.error('Supabase update failed:', err));
                }
                return merged;
              }
              return form;
            })
          };
        }
        return center;
      });
    });
    showToast('படிவம் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது! (Form updated!)');
  };

  const handleDeleteForm = (centerId, formId) => {
    setCenters(prevCenters => {
      return prevCenters.map(center => {
        if (center.id === centerId) {
          const remainingForms = center.forms
            .filter(form => form.id !== formId)
            .map((form, index) => ({
              ...form,
              number: String(index + 1).padStart(2, '0')
            }));
          return {
            ...center,
            forms: remainingForms
          };
        }
        return center;
      });
    });

    // Cloud delete from Supabase if configured
    if (isSupabaseConfigured) {
      deleteFormFromSupabase(formId).catch(err => console.error('Supabase delete failed:', err));
    }

    showToast('படிவம் நீக்கப்பட்டது! (Form deleted!)');
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
            <div className={`grid grid-cols-1 ${filteredCenters.length === 1 ? 'max-w-2xl mx-auto' : filteredCenters.length === 2 ? 'lg:grid-cols-2 max-w-5xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-5 sm:gap-6 items-start`}>
              {filteredCenters.map(center => (
                <CenterCard
                  key={center.id}
                  center={center}
                  onPreviewForm={(form) => setPreviewData({ form, center })}
                  onCopyLink={handleCopyLink}
                  onEditForm={(form) => handleOpenEditModal(form, center)}
                  copiedId={copiedId}
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
