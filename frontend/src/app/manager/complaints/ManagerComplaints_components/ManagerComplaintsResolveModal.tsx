// RESPONSIBILITY: Renders the ManagerComplaintsResolveModal component.
// [COMPONENT] ManagerComplaintsResolveModal
// Responsibility: Renders the complaint resolution modal wired to React Hook Form (resolveForm).
// Receives: complaint data, onClose callback, and RHF UseFormReturn.
import { CheckCircle, X, IndianRupee } from 'lucide-react';

import type { UseFormReturn } from 'react-hook-form';
import type { ManagerComplaintData } from '@/app/manager/complaints/ManagerComplaints_types/ManagerComplaints.types';
import type { ComplaintResolveFormData } from '@/app/manager/complaints/ManagerComplaints_types/ManagerComplaints.types';
interface Props {
  resolvingComplaint: ManagerComplaintData;
  onClose: () => void;
  resolveForm: UseFormReturn<ComplaintResolveFormData>;
  handleResolveSubmit: (e?: React.BaseSyntheticEvent) => void;
}
export function ManagerComplaintsResolveModal({
  resolvingComplaint, onClose, resolveForm, handleResolveSubmit
}: Props) {
  const { register, formState: { errors } } = resolveForm;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 motion-safe:duration-200">
        <div className="flex justify-between items-center p-6 border-b border">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" /> Resolve Issue
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleResolveSubmit} className="p-6 space-y-5">
          <div className="p-4 bg-input rounded-lg text-sm mb-4">
            <div className="font-bold text-primary">{resolvingComplaint.title || resolvingComplaint.category}</div>
            <div className="text-secondary">Room {resolvingComplaint.roomNumber || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Repair Cost (₹)</label>
            <div className="relative">
              <IndianRupee className="w-5 h-5 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="0"
                {...register('repairCost')}
                className="w-full bg-page border border pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary transition-shadow"
                placeholder="e.g. 1500"
              />
            </div>
            {errors.repairCost && <p className="text-xs text-danger mt-1">{errors.repairCost.message}</p>}
            <p className="text-xs text-secondary mt-1.5">This will be automatically logged as a maintenance expense in your P&L.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Resolution Notes (Optional)</label>
            <textarea
              rows={3}
              {...register('resolutionNotes')}
              className="w-full bg-page border border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary resize-none transition-shadow"
              placeholder="e.g. AC gas refilled by technician..."
            />
          </div>
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-input text-primary rounded-xl font-bold hover:bg-border motion-safe:transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-success text-white rounded-xl font-bold shadow-lg shadow-success/20 hover:bg-success-hover,green motion-safe:transition-colors">Confirm & Resolve</button>
          </div>
        </form>
      </div>
    </div>
  );
}