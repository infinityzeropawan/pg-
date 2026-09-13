// RESPONSIBILITY: Renders the OwnerPropertiesCreateBasicInfo component. Receives data via props/hooks.

import { Building2 } from 'lucide-react';

export interface OwnerPropertiesCreateBasicInfoProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function OwnerPropertiesCreateBasicInfo({ formData, handleInputChange }: OwnerPropertiesCreateBasicInfoProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)] flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-primary">Basic Information</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">Property Name *</label>
          <input required type="text" name="name" value={(formData as any).name} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
            placeholder="e.g. Sharma PG Coed"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">URL Slug</label>
          <input type="text" name="slug" value={(formData as any).slug} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
            placeholder="sharma-pg-coed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">PG Type *</label>
          <select required name="type" value={(formData as any).type} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
          >
            <option value="coed">Co-Ed / Both</option>
            <option value="boys">Boys Only</option>
            <option value="girls">Girls Only</option>
          </select>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium text-secondary">Description</label>
          <textarea name="description" value={(formData as any).description} onChange={handleInputChange} rows={3}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all resize-none"
            placeholder="Short description of the property..."
          />
        </div>
      </div>
    </div>
  );
}
