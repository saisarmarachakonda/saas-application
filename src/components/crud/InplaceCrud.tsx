'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'date' | 'textarea' | 'boolean';
  options?: { label: string; value: any }[];
  refModel?: string; // e.g. 'company', will fetch options from /api/crud/company
  refLabelField?: string; // e.g. 'name'
  required?: boolean;
}

export interface ModelConfig {
  name: string; // prisma model parameter name, e.g. 'company'
  label: string; // User facing title, e.g. 'Company Setup'
  fields: FieldConfig[];
  columns: string[]; // keys to show in data table
}

export default function InplaceCrud({
  configs,
  defaultTab,
  hideTabs = false
}: {
  configs: ModelConfig[];
  defaultTab: string;
  hideTabs?: boolean;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const currentConfig = configs.find(c => c.name === activeTab) || configs[0];

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});

  // Dropdown reference options
  const [refOptions, setRefOptions] = useState<{ [modelName: string]: { label: string; value: any }[] }>({});

  // Fetch primary data when tab changes
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/crud/${currentConfig.name}`);
      if (!res.ok) throw new Error(`Failed to load data for ${currentConfig.label}`);
      const list = await res.json();
      setData(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSearchQuery('');
  }, [activeTab]);

  // Load foreign key references dynamically
  useEffect(() => {
    const fetchReferences = async () => {
      const newRefOptions = { ...refOptions };
      
      for (const field of currentConfig.fields) {
        if (field.refModel && !newRefOptions[field.refModel]) {
          try {
            const res = await fetch(`/api/crud/${field.refModel}`);
            if (res.ok) {
              const list = await res.json();
              newRefOptions[field.refModel] = list.map((item: any) => ({
                label: item[field.refLabelField || 'name'] || item.code || item.id,
                value: item.id
              }));
            }
          } catch (e) {
            console.error(`Error loading reference ${field.refModel}:`, e);
          }
        }
      }
      setRefOptions(newRefOptions);
    };

    fetchReferences();
  }, [activeTab, currentConfig]);

  // Handle open Form modal
  const openFormModal = (item: any = null) => {
    setError('');
    setFormErrors({});
    if (item) {
      setEditingId(item.id);
      // Format date fields appropriately for HTML inputs
      const formattedItem = { ...item };
      currentConfig.fields.forEach(field => {
        if (field.type === 'date' && item[field.name]) {
          formattedItem[field.name] = new Date(item[field.name]).toISOString().split('T')[0];
        }
      });
      setFormData(formattedItem);
    } else {
      setEditingId(null);
      const initialForm: any = {};
      currentConfig.fields.forEach(field => {
        initialForm[field.name] = field.type === 'boolean' ? false : '';
      });
      setFormData(initialForm);
    }
    setModalOpen(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    const errors: any = {};
    currentConfig.fields.forEach(f => {
      if (f.required && (formData[f.name] === undefined || formData[f.name] === '')) {
        errors[f.name] = `${f.label} is required`;
      }
    });
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const url = editingId 
        ? `/api/crud/${currentConfig.name}?id=${editingId}` 
        : `/api/crud/${currentConfig.name}`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save record');
      }

      setSuccess(`Record ${editingId ? 'updated' : 'created'} successfully!`);
      setModalOpen(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving record');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    setError('');
    try {
      const res = await fetch(`/api/crud/${currentConfig.name}?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete record');
      }
      setSuccess('Record deleted successfully');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error deleting record');
    }
  };

  // Filter items matching query
  const filteredData = data.filter(item => {
    const query = searchQuery.toLowerCase();
    return currentConfig.columns.some(col => {
      const val = item[col];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(query);
    });
  });

  // Resolve foreign ID to readable name
  const resolveDisplayValue = (field: FieldConfig, val: any) => {
    if (val === undefined || val === null) return '';
    if (field.refModel && refOptions[field.refModel]) {
      const found = refOptions[field.refModel].find(opt => opt.value === val);
      return found ? found.label : val;
    }
    if (field.type === 'date') {
      return new Date(val).toLocaleDateString();
    }
    if (field.type === 'boolean') {
      return val ? 'True' : 'False';
    }
    return String(val);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Sub-tabs Navigation */}
      {!hideTabs && configs.length > 1 && (
        <div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/50 dark:border-slate-850/50 w-fit max-w-full overflow-x-auto gap-1 scrollbar-none shadow-xs">
          {configs.map(cfg => (
            <button
              key={cfg.name}
              onClick={() => setActiveTab(cfg.name)}
              className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all shrink-0 ${
                activeTab === cfg.name
                  ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      )}

      {/* Action Controls & Feedbacks */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Filter ${currentConfig.label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            {filteredData.length} Total Records
          </span>
          <button
            onClick={() => openFormModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create {currentConfig.label.slice(0, -1)}</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-xs text-green-500 rounded-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-green-500 bg-green-500/20 rounded-full p-0.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-500 rounded-lg flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                {currentConfig.columns.map(col => {
                  const field = currentConfig.fields.find(f => f.name === col);
                  return (
                    <th key={col} className="px-4 py-3">
                      {field ? field.label : col}
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={currentConfig.columns.length + 1} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                      <span>Loading dataset records...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={currentConfig.columns.length + 1} className="py-12 text-center text-slate-400 font-light">
                    No matching records found in database.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    {currentConfig.columns.map(col => {
                      const field = currentConfig.fields.find(f => f.name === col);
                      const displayVal = field ? resolveDisplayValue(field, item[col]) : String(item[col] || '');

                      // Render Indian Currency for financial amounts
                      if (['amount', 'value', 'price', 'spent', 'allocated', 'variance', 'estimatedcost'].includes(col.toLowerCase())) {
                        const num = parseFloat(displayVal.replace(/[^0-9.-]/g, ''));
                        if (!isNaN(num)) {
                          return (
                            <td key={col} className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                              ₹{num.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          );
                        }
                      }

                      // Render status as pill badges
                      if (col.toLowerCase().includes('status') || col.toLowerCase() === 'type') {
                        let colorClass = 'bg-slate-150 text-slate-700 dark:bg-slate-800/80 dark:text-slate-350 border-slate-250';
                        const lowerVal = displayVal.toLowerCase();
                        if (['approved', 'processed', 'reconciled', 'passed', 'delivered', 'active', 'true', 'completed', 'verified', 'won'].includes(lowerVal)) {
                          colorClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20';
                        } else if (['pending', 'sent', 'draft', 'transit', 'planning', 'tracked', 'in progress', 'processing', 'pending approval', 'discovery', 'proposal', 'negotiation'].includes(lowerVal)) {
                          colorClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-455 border border-amber-500/20';
                        } else if (['rejected', 'failed', 'delayed', 'low stock', 'false', 'lost'].includes(lowerVal)) {
                          colorClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/20';
                        }

                        return (
                          <td key={col} className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${colorClass}`}>
                              {displayVal}
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={col} className="px-4 py-3 font-normal truncate max-w-[200px]">
                          {displayVal}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-right space-x-2 shrink-0">
                      {/* Hide edit / delete for activity logs or predefined matrices */}
                      {currentConfig.name !== 'activitylog' && (
                        <>
                          <button
                            onClick={() => openFormModal(item)}
                            className="p-1 text-slate-400 hover:text-indigo-500 rounded transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong className="text-slate-800 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, filteredData.length)}</strong> of <strong className="text-slate-800 dark:text-slate-200">{filteredData.length}</strong> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 3. CRUD Dialog Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className={`glass-card w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] shadow-2xl relative max-h-[90vh] flex flex-col transition-all duration-300 ${
            currentConfig.fields.filter(f => !(f.name === 'password' && editingId)).length > 4 ? 'max-w-2xl' : 'max-w-lg'
          }`}>
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {editingId ? 'Edit' : 'Create'} {currentConfig.label}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className={`grid gap-4 ${
                currentConfig.fields.filter(f => !(f.name === 'password' && editingId)).length > 4 
                  ? 'grid-cols-1 sm:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {currentConfig.fields.map(field => {
                  // If it is password, hide it during edit
                  if (field.name === 'password' && editingId) return null;

                  const isFullWidth = field.type === 'textarea';

                  return (
                    <div key={field.name} className={`space-y-1.5 ${isFullWidth ? 'sm:col-span-2' : ''}`}>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                        {field.label} {field.required && <span className="text-red-500 font-bold">*</span>}
                      </label>

                      {/* TEXT / EMAIL / PASSWORD / NUMBER / DATE */}
                      {['text', 'email', 'password', 'number', 'date'].includes(field.type) && (
                        <input
                          type={field.type}
                          value={formData[field.name] !== undefined ? formData[field.name] : ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          required={field.required}
                          className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-800 dark:text-slate-150"
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      )}

                      {/* BOOLEAN */}
                      {field.type === 'boolean' && (
                        <select
                          value={formData[field.name] ? 'true' : 'false'}
                          onChange={(e) => handleInputChange(field.name, e.target.value === 'true')}
                          className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-800 dark:text-slate-150"
                        >
                          <option value="false" className="dark:bg-slate-900">False</option>
                          <option value="true" className="dark:bg-slate-900">True</option>
                        </select>
                      )}

                      {/* TEXTAREA */}
                      {field.type === 'textarea' && (
                        <textarea
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          required={field.required}
                          rows={3}
                          className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none text-slate-800 dark:text-slate-150"
                          placeholder={`Enter ${field.label.toLowerCase()} details...`}
                        />
                      )}

                      {/* SELECT: Static or Reference keys */}
                      {field.type === 'select' && (
                        <select
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          required={field.required}
                          className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-800 dark:text-slate-150"
                        >
                          <option value="" className="dark:bg-slate-900">-- Select Option --</option>
                          
                          {/* Static Options */}
                          {field.options && field.options.map(opt => (
                            <option key={opt.value} value={opt.value} className="dark:bg-slate-900">{opt.label}</option>
                          ))}

                          {/* Foreign Reference Options */}
                          {field.refModel && refOptions[field.refModel] && refOptions[field.refModel].map(opt => (
                            <option key={opt.value} value={opt.value} className="dark:bg-slate-900">{opt.label}</option>
                          ))}
                        </select>
                      )}

                      {formErrors[field.name] && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">{formErrors[field.name]}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3.5 justify-end pt-5 border-t border-slate-200/80 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md shadow-indigo-650/10 hover:scale-[1.01] active:scale-[0.99]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple check icon wrapper helper
function Check(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
