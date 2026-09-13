// RESPONSIBILITY: Renders the OwnerPropertiesCreatePhotos component. Receives data via props/hooks.

import { Image as ImageIcon } from 'lucide-react';

export interface OwnerPropertiesCreatePhotosProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function OwnerPropertiesCreatePhotos({ formData, handleInputChange }: OwnerPropertiesCreatePhotosProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)] flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-primary">Property Photos</h2>
      </div>
      <div className="p-6">
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">Photo URLs (comma separated)</label>
          <textarea name="photos" value={(formData as any).photos} onChange={handleInputChange} rows={3}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all resize-none"
            placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
          />
          <p className="text-[10px] text-secondary mt-1">Leave empty to use a beautiful default placeholder image.</p>
        </div>
      </div>
    </div>
  );
}
