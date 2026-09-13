// RESPONSIBILITY: Type-safe localStorage database wrapper.

const isBrowser = typeof window !== 'undefined';

function getStorageItem(key: string): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(key);
}

function setStorageItem(key: string, value: string): void {
  if (!isBrowser) return;
  localStorage.setItem(key, value);
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  [key: string]: unknown;
}

export const db = {
  getAll<T extends BaseEntity>(key: string): T[] {
    const data = getStorageItem(key);
    return data ? (JSON.parse(data) as T[]) : [];
  },

  getById<T extends BaseEntity>(key: string, id: string): T | null {
    const items = this.getAll<T>(key);
    return items.find((item: T) => item.id === id) ?? null;
  },

  insert<T extends BaseEntity>(key: string, item: T): T {
    const items = this.getAll<T>(key);
    items.push(item);
    setStorageItem(key, JSON.stringify(items));
    return item;
  },

  update<T extends BaseEntity>(key: string, id: string, patch: Partial<T>): T | null {
    const items = this.getAll<T>(key);
    const index = items.findIndex((item: T) => item.id === id);
    if (index === -1) return null;
    const updated = { ...items[index], ...patch, updatedAt: new Date().toISOString() } as T;
    items[index] = updated;
    setStorageItem(key, JSON.stringify(items));
    return items[index] ?? null;
  },

  remove<T extends BaseEntity>(key: string, id: string): boolean {
    const items = this.getAll<T>(key);
    const index = items.findIndex((item: T) => item.id === id);
    if (index === -1) return false;
    const item = items[index];
    if (item) {
      item.isDeleted = true;
      item.updatedAt = new Date().toISOString();
    }
    setStorageItem(key, JSON.stringify(items));
    return true;
  },

  query<T extends BaseEntity>(key: string, predicate: (item: T) => boolean): T[] {
    const items = this.getAll<T>(key);
    return items.filter(predicate);
  },

  replaceAll<T extends BaseEntity>(key: string, items: T[]): void {
    setStorageItem(key, JSON.stringify(items));
  }
};
