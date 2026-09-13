'use client';

// RESPONSIBILITY: Renders the Student Settings UI.

import { useState } from 'react';
import { Bell, Lock, Palette, LogOut, Check } from 'lucide-react';
import { toast } from 'sonner';

export function StudentSettingsMain() {
  const [settings, setSettings] = useState({
    emailNotif: true,
    smsNotif: false,
    pushNotif: true,
    showProfileToRoommates: true,
    theme: 'light'
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Settings updated');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          ⚙️ Settings & Preferences
        </h1>
        <p className="text-sm text-secondary mt-1">Manage your account settings, privacy, and notifications.</p>
      </div>

      <div className="space-y-6">
        
        {/* Notifications */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-input/50 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-primary text-lg">Notifications</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-primary text-sm">Push Notifications</h4>
                <p className="text-xs text-secondary">Receive alerts for rent dues and important notices on your device.</p>
              </div>
              <button 
                onClick={() => toggleSetting('pushNotif')}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.pushNotif ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.pushNotif ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-primary text-sm">Email Alerts</h4>
                <p className="text-xs text-secondary">Get monthly rent invoices and payment receipts via email.</p>
              </div>
              <button 
                onClick={() => toggleSetting('emailNotif')}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.emailNotif ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.emailNotif ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-primary text-sm">SMS Alerts</h4>
                <p className="text-xs text-secondary">Get critical updates like water/electricity cutoff via SMS.</p>
              </div>
              <button 
                onClick={() => toggleSetting('smsNotif')}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.smsNotif ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.smsNotif ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-input/50 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-primary text-lg">Privacy</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-primary text-sm">Profile Visibility</h4>
                <p className="text-xs text-secondary">Allow roommates to view your basic profile (Phone number, Course).</p>
              </div>
              <button 
                onClick={() => toggleSetting('showProfileToRoommates')}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.showProfileToRoommates ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.showProfileToRoommates ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-input/50 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-primary text-lg">Appearance</h3>
          </div>
          <div className="p-6">
            <h4 className="font-bold text-primary text-sm mb-3">App Theme</h4>
            <div className="flex gap-4">
              <button 
                onClick={() => { setSettings(s => ({...s, theme: 'light'})); toast.success('Theme updated'); }}
                className={`flex-1 p-4 rounded-[var(--radius-md)] border-2 flex items-center justify-between transition-colors ${settings.theme === 'light' ? 'border-primary bg-primary-subtle' : 'border-border bg-page hover:bg-input'}`}
              >
                <span className="font-bold text-primary text-sm">Light Mode</span>
                {settings.theme === 'light' && <Check className="w-4 h-4 text-primary" />}
              </button>
              <button 
                onClick={() => { setSettings(s => ({...s, theme: 'dark'})); toast.success('Theme updated'); }}
                className={`flex-1 p-4 rounded-[var(--radius-md)] border-2 flex items-center justify-between transition-colors ${settings.theme === 'dark' ? 'border-primary bg-primary-subtle' : 'border-border bg-page hover:bg-input'}`}
              >
                <span className="font-bold text-primary text-sm">Dark Mode</span>
                {settings.theme === 'dark' && <Check className="w-4 h-4 text-primary" />}
              </button>
            </div>
            <p className="text-xs text-secondary mt-3">Note: Dark mode is a visual placeholder in this demo.</p>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <button onClick={handleLogout} className="w-full py-3 bg-danger-bg text-danger font-bold rounded-[var(--radius-md)] border border-danger/30 hover:bg-danger hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm">
            <LogOut className="w-5 h-5" /> Logout from all devices
          </button>
        </div>

      </div>
    </div>
  );
}
