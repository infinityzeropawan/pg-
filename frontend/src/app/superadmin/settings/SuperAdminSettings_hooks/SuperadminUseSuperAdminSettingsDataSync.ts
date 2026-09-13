// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminSettingsDataSync.ts]
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { settingsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminSettings';

export function SuperadminUseSuperAdminSettingsDataSync() {
  const [isImporting, setIsImporting] = useState(false);
  

  const handleExport = () => {
    const data = settingsApi.exportDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartpg_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Database exported successfully');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('WARNING: Importing a database will completely overwrite all existing data. Are you sure you want to continue?')) {
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = settingsApi.importDatabase(content);
        if (success) {
          toast.success('Database imported successfully. Reloading...');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          toast.error('Failed to import database. Invalid format.');
        }
      }
      setIsImporting(false);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };

  return {
    isImporting,
    handleExport,
    handleImport
  };
}
