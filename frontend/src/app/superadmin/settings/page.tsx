'use client';

import React from 'react';

import { SuperadminUseSuperAdminSettingsData } from '@/app/superadmin/settings/SuperAdminSettings_hooks/SuperadminUseSuperAdminSettingsData';
import { SuperAdminSettingsHeader } from '@/app/superadmin/settings/SuperAdminSettings_components/SuperAdminSettingsHeader';
import { SuperAdminSettingsForm } from '@/app/superadmin/settings/SuperAdminSettings_components/SuperAdminSettingsForm';

export default function PlatformSettingsPage() {
  const { settings, setSettings, loading, saving, handleSave } = SuperadminUseSuperAdminSettingsData();

  if (loading || !settings) return null; // Let loading.tsx handle it

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <SuperAdminSettingsHeader />

      <SuperAdminSettingsForm 
        settings={settings} 
        setSettings={setSettings} 
        handleSave={handleSave} 
        saving={saving} 
      />
    </div>
  );
}
