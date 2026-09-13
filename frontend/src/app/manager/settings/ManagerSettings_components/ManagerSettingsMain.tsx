'use client';
import { useManagerSettings } from '../ManagerSettings_hooks/useManagerSettings';
import { User, Bell, Building2, ShieldCheck, Save } from 'lucide-react';

export function ManagerSettingsMain() {
  const { 
    user, 
    loading, 
    gateTiming, setGateTiming, 
    visitorAllowed, setVisitorAllowed, 
    notifications, setNotifications, 
    handleSave 
  } = useManagerSettings();

  if (loading) {
    return <div className="p-6 text-secondary motion-safe:animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-secondary mt-1">Manage your profile, notifications, and property rules.</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
        <h2 className="text-lg font-black text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
          <User className="w-5 h-5 text-theme-primary" /> Profile Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-secondary mb-1 block">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary outline-none focus:border-theme-primary" 
              defaultValue={user?.name || ''} 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-secondary mb-1 block">Email</label>
            <input 
              type="email" 
              disabled
              className="w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm text-secondary outline-none cursor-not-allowed" 
              value={user?.id || 'manager@pg.com'} 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-secondary mb-1 block">Phone Number</label>
            <input 
              type="text" 
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary outline-none focus:border-theme-primary" 
              defaultValue="9876543210" 
            />
          </div>
        </div>
      </div>

      {/* Property Rules */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
        <h2 className="text-lg font-black text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
          <Building2 className="w-5 h-5 text-warning" /> Property Rules
        </h2>
        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-primary">Gate Closing Time</p>
              <p className="text-xs text-secondary">Time after which late entry is marked</p>
            </div>
            <input 
              type="time" 
              value={gateTiming}
              onChange={(e) => setGateTiming(e.target.value)}
              className="bg-input border border-border rounded-md px-3 py-1.5 text-sm text-primary outline-none focus:border-warning" 
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-bold text-primary">Allow Visitors</p>
              <p className="text-xs text-secondary">Can students bring visitors?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={visitorAllowed} onChange={(e) => setVisitorAllowed(e.target.checked)} />
              <div className="w-11 h-6 bg-input border-border border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
        <h2 className="text-lg font-black text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
          <Bell className="w-5 h-5 text-info" /> Notification Preferences
        </h2>
        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-danger" />
              <span className="text-sm font-bold text-primary">SOS Alerts (SMS & App)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={notifications.sos} onChange={(e) => setNotifications({...notifications, sos: e.target.checked})} />
              <div className="w-11 h-6 bg-input border-border border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
            </label>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-primary">New Complaints</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={notifications.complaints} onChange={(e) => setNotifications({...notifications, complaints: e.target.checked})} />
              <div className="w-11 h-6 bg-input border-border border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
            </label>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-primary">Rent Payment Received</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={notifications.rent} onChange={(e) => setNotifications({...notifications, rent: e.target.checked})} />
              <div className="w-11 h-6 bg-input border-border border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-[var(--radius-md)] font-bold text-sm flex items-center gap-2 motion-safe:transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}
