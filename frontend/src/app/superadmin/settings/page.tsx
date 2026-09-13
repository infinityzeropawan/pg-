'use client';

import React from 'react';

import { SuperadminUseSuperAdminSettingsData } from '@/app/superadmin/settings/SuperAdminSettings_hooks/SuperadminUseSuperAdminSettingsData';
import { SuperadminUseSuperAdminSettingsDataSync } from '@/app/superadmin/settings/SuperAdminSettings_hooks/SuperadminUseSuperAdminSettingsDataSync';
import { SuperAdminSettingsHeader } from '@/app/superadmin/settings/SuperAdminSettings_components/SuperAdminSettingsHeader';
import { SuperAdminSettingsForm } from '@/app/superadmin/settings/SuperAdminSettings_components/SuperAdminSettingsForm';
import { SuperAdminSettingsDataSync } from '@/app/superadmin/settings/SuperAdminSettings_components/SuperAdminSettingsDataSync';

export default function PlatformSettingsPage() {
  const { settings, setSettings, loading, saving, handleSave } = SuperadminUseSuperAdminSettingsData();
  const { isImporting, handleExport, handleImport } = SuperadminUseSuperAdminSettingsDataSync();

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

      <SuperAdminSettingsDataSync 
        handleExport={handleExport} 
        handleImport={handleImport} 
        isImporting={isImporting} 
      />
    </div>
  );
}