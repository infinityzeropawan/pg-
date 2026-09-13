// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminSettingsData.ts]
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { settingsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminSettings';

import type { SuperAdminSettingsData } from '@/app/superadmin/settings/SuperAdminSettings_types/SuperAdminSettings.types';

export function SuperadminUseSuperAdminSettingsData() {
  const [settings, setSettings] = useState<SuperAdminSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  

  useEffect(() => {
    void settingsApi.getSettings().then((data) => setSettings(data as SuperAdminSettingsData)).catch((error) => toast.error(error.message)).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await settingsApi.updateSettings(settings);
      setSettings(updated as SuperAdminSettingsData);
      toast.success('Platform settings saved successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save platform settings.');
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    setSettings,
    loading,
    saving,
    handleSave
  };
}
