// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminSettingsData.ts]
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { settingsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminSettings';

import type { SuperAdminSettingsData } from '@/app/superadmin/settings/SuperAdminSettings_types/SuperAdminSettings.types';

export function SuperadminUseSuperAdminSettingsData() {
  const [settings, setSettings] = useState<SuperAdminSettingsData | null>({} as SuperAdminSettingsData); // Will be populated by useEffect but no loading screen
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  

  useEffect(() => {
    setSettings(settingsApi.getSettings() as SuperAdminSettingsData);
    setLoading(false);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    settingsApi.updateSettings(settings as unknown as import('@/app/superadmin/superadmin_lib/superadmin_api/SuperadminSettings').PlatformSettings);
    setTimeout(() => {
      setSaving(false);
      toast.success('Platform settings saved successfully.');
    }, 500);
  };

  return {
    settings,
    setSettings,
    loading,
    saving,
    handleSave
  };
}

