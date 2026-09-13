'use client';

// RESPONSIBILITY: Renders the OwnerSettingsMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, Building2, CreditCard, Shield, Users } from 'lucide-react';

import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';

export function OwnerSettingsMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId, setSelectedPropertyId } = useOwnerPropertyContext();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    lateFine: 50,
    dueDate: 5,
    nightEntryTime: '22:00',
    noticeDays: 30
  });

  // Auto-select first property if "all" is selected
  useEffect(() => {
    if (selectedPropertyId === 'all' && properties.length > 0) {
      if (properties[0]?.id) {
        setSelectedPropertyId(properties[0].id);
      }
    }
  }, [selectedPropertyId, properties, setSelectedPropertyId]);

  const property = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setSaving(true);
    setSuccess(false);
    
    // Simulate API update delay
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  if (!property && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Building2 className="w-16 h-16 text-secondary opacity-30 mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">No Properties Found</h2>
        <p className="text-secondary max-w-md">
          You need to add a property first before configuring settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Property Rules & Settings</h1>
          <p className="text-sm text-secondary">Configure operational rules for {property?.name || 'your PG'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="xl:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-border bg-primary-subtle flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-primary">Financial Rules</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-primary">Rent Due Date (Day of Month)</label>
                  <input 
                    type="number" min="1" max="31"
                    value={(formData as any).dueDate} onChange={e => setFormData(p => ({...p, dueDate: parseInt(e.target.value)}))}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <p className="text-xs text-secondary mt-1">When rent is considered due.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-primary">Late Fine Per Day (₹)</label>
                  <input 
                    type="number" min="0"
                    value={(formData as any).lateFine} onChange={e => setFormData(p => ({...p, lateFine: parseInt(e.target.value)}))}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <p className="text-xs text-secondary mt-1">Penalty applied after due date.</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-border bg-[rgba(99,102,241,0.05)] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2D7D9A]" />
                <h2 className="text-base font-bold text-primary">Operational Rules</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-primary">Notice Period (Days)</label>
                  <input 
                    type="number" min="1"
                    value={(formData as any).noticeDays} onChange={e => setFormData(p => ({...p, noticeDays: parseInt(e.target.value)}))}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <p className="text-xs text-secondary mt-1">Required notice before move-out.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-primary">Night Entry Cutoff Time</label>
                  <input 
                    type="time"
                    value={(formData as any).nightEntryTime} onChange={e => setFormData(p => ({...p, nightEntryTime: e.target.value}))}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <p className="text-xs text-secondary mt-1">Alerts managers if student is late.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {success ? (
                <div className="text-sm font-bold text-success flex items-center gap-2 bg-success-bg px-4 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4" /> Settings saved successfully!
                </div>
              ) : <div />}
              <button 
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-50 text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Panel - Data & Info */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-secondary" /> Property Snapshot
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm font-medium text-secondary">Name</span>
                <span className="text-sm font-bold text-primary">{property?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm font-medium text-secondary">Type</span>
                <span className="text-sm font-bold text-primary capitalize">{(property as any)?.type || 'Mixed'} PG</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm font-medium text-secondary">Location</span>
                <span className="text-sm font-bold text-primary">{(property as any)?.city || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm font-medium text-secondary">Total Beds</span>
                <span className="text-sm font-bold text-primary">{(property as any)?.bedsPlanned || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a3a4a] to-[#0d1f2a] rounded-xl p-6 shadow-md text-white">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F5A623]" /> Admin Access
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              These settings apply directly to the staff application. Changing rent dates or fine amounts will instantly reflect in the manager portal for this specific branch.
            </p>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
              <div className="text-xs font-bold text-white/60 mb-1">Current Logged-in Owner</div>
              <div className="text-sm font-semibold">{user?.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
