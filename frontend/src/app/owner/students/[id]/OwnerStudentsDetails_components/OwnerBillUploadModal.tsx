import React, { useState } from 'react';
import { X, Upload, IndianRupee } from 'lucide-react';

interface OwnerBillUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, imageUrl: string) => void;
  invoiceTitle: string;
}

export function OwnerBillUploadModal({ isOpen, onClose, onSubmit, invoiceTitle }: OwnerBillUploadModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    // Simulate image upload by providing a dummy URL
    // In a real app, we would upload the file to S3/Cloudinary here
    const dummyImageUrl = 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=500&auto=format&fit=crop';
    
    setTimeout(() => {
      onSubmit(Number(amount), dummyImageUrl);
      setLoading(false);
      setAmount('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-[var(--radius-lg,12px)] shadow-2xl overflow-hidden border border">
        <div className="flex justify-between items-center p-5 border-b border bg-input">
          <div>
            <h2 className="text-lg font-black text-primary">Add Electricity Bill</h2>
            <p className="text-xs text-secondary mt-1">For {invoiceTitle}</p>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary motion-safe:transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-secondary">Bill Amount</label>
            <div className="relative">
              <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                required
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 bg-page border border rounded-[var(--radius-md,8px)] text-primary focus:outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-secondary">Upload Bill Image</label>
            <div className="border-2 border-dashed border rounded-[var(--radius-md,8px)] p-6 flex flex-col items-center justify-center text-center hover:bg-input motion-safe:transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-primary-subtle flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-bold text-primary">Click to upload image</p>
              <p className="text-xs text-secondary mt-1">PNG, JPG up to 5MB (Simulation)</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-secondary hover:bg-input rounded-[var(--radius-md,8px)] motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount}
              className="px-6 py-2 bg-primary text-white font-bold rounded-[var(--radius-md,8px)] hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Save Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
