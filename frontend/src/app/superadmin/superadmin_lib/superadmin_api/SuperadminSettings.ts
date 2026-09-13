import { superadminRequest } from './SuperadminClient';

export interface PlatformSettings {
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
  [key: string]: unknown;
}

export const settingsApi = {
  async getSettings(): Promise<PlatformSettings> {
    const settings = await superadminRequest<any>('/settings');
    return { ...settings, createdBy: 'system', updatedBy: settings.updatedBy || 'system', isDeleted: false };
  },
  
  async updateSettings(data: any) {
    const settings = await superadminRequest<any>('/settings', { method: 'PUT', body: JSON.stringify(data) });
    return { ...settings, createdBy: 'system', updatedBy: settings.updatedBy || 'system', isDeleted: false } as PlatformSettings;
  },

  exportDatabase(): string {
    if (typeof window === 'undefined') return '{}';
    const dump: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('spg_') || key.startsWith('app_') || key.includes('token'))) {
        try {
          dump[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          dump[key] = localStorage.getItem(key);
        }
      }
    }
    return JSON.stringify(dump, null, 2);
  },

  importDatabase(jsonString: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || !parsed) return false;
      Object.entries(parsed).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      return true;
    } catch {
      return false;
    }
  }
};
