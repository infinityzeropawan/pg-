export interface SuperAdminSettingsData {
  id: string;
  otpEnabled: boolean;
  defaultNightEntryTime: string;
  defaultNoticeDays: number;
  supportPhone: string;
  maintenanceMode: boolean;
  whatsappEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
}

export interface SuperAdminSettingsHeaderProps {}

export interface SuperAdminSettingsFormProps {
  settings: SuperAdminSettingsData;
  setSettings: (settings: SuperAdminSettingsData) => void;
  handleSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export interface SuperAdminSettingsDataSyncProps {
  handleExport: () => void;
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
}
