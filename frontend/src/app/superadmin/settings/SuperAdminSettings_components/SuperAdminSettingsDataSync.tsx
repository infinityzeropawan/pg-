// RESPONSIBILITY: Renders the SuperAdminSettingsDataSync component.
import React from 'react';
import { Database, Download, Upload, AlertTriangle } from 'lucide-react';

import type { SuperAdminSettingsDataSyncProps } from '@/app/superadmin/settings/SuperAdminSettings_types/SuperAdminSettings.types';

export const SuperAdminSettingsDataSync: React.FC<SuperAdminSettingsDataSyncProps> = ({ handleExport, handleImport, isImporting }) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm mt-8">
      <div className="bg-page border-b border p-4 flex items-center gap-2">
        <Database className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-primary">Data Management</h2>
      </div>
      <div className="p-6">
        <p className="text-sm text-secondary mb-6">
          Export the entire LocalStorage database to a JSON file, or import an existing backup. Useful for demos, migrations, or backend mapping.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button 
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-input hover:bg-primary-subtle hover:text-primary border border hover:border-primary rounded-[var(--radius-md,8px)] motion-safe:transition-all font-medium text-primary"
          >
            <Download className="w-5 h-5" />
            Export JSON Backup
          </button>
          
          <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-danger-bg text-danger hover:bg-red-900/40 border border-danger rounded-[var(--radius-md,8px)] motion-safe:transition-all font-medium cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload className="w-5 h-5" />
            {isImporting ? 'Importing...' : 'Import & Replace DB'}
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleImport}
              disabled={isImporting}
            />
          </label>
        </div>

        <div className="bg-warning-bg border border-warning text-warning p-4 rounded-[var(--radius-md,8px)] flex gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong>Warning:</strong> Importing a JSON backup will completely wipe the current state of the application and replace it with the uploaded data. Please ensure you have exported a recent backup before importing.
          </div>
        </div>
      </div>
    </div>
  );
};
