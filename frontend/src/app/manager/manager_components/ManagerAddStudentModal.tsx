// RESPONSIBILITY: Renders the ManagerAddStudentModal component.
'use client';
import React, { useState } from 'react';
import { X, User, Home, IndianRupee, Users } from 'lucide-react';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
interface AddStudentModalProps {
  propertyId: string;
  onClose: () => void;
  onSuccess: () => void;
}
export function ManagerAddStudentModal({ propertyId, onClose, onSuccess }: AddStudentModalProps) {
  const user = useManagerSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    bedId: '',
    roomId: '',
    rentAmount: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    hasMessFacility: false,
    stayDuration: 3 // Default to 3 months
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableBeds, setAvailableBeds] = useState<Record<string, unknown>[]>([]);
  const [rooms, setRooms] = useState<Record<string, unknown>[]>([]);
  React.useEffect(() => {
    const allRooms = api.rooms.listByProperty(propertyId) as Record<string, unknown>[];
    const allBeds = api.beds.listByProperty(propertyId) as Record<string, unknown>[];
    setRooms(allRooms);
    setAvailableBeds(allBeds.filter((b) => (b as Record<string, unknown>).status === 'available'));
  }, [propertyId]);
  const handleBedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bedId = e.target.value;
    const bed = availableBeds.find(b => String((b as Record<string, unknown>).id) === bedId);
    if (bed) {
      const room = rooms.find(r => String(r.id) === String(bed.roomId));
      setFormData(prev => ({
        ...prev,
        bedId,
        roomId: String(room?.id || ''),
        rentAmount: String(room?.rentPerBed || prev.rentAmount || '')
      }));
    } else {
      setFormData(prev => ({ ...prev, bedId: '', roomId: '' }));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + Number(formData.stayDuration));
      (api.students as unknown as { onboardStudent: (data: Record<string, unknown>, userId: string) => void }).onboardStudent({
        ...formData,
        propertyId,
        stayStartDate: startDate.toISOString().split('T')[0],
        stayEndDate: endDate.toISOString().split('T')[0]
      }, user?.id || '');
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String((err as Record<string, unknown>)?.message || 'Failed to onboard student'));
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in motion-safe:duration-300">
        <div className="flex items-center justify-between p-6 border-b border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-xl font-bold text-primary">Onboard New Student</h2>
            <p className="text-sm text-secondary mt-1">Fill in the details to create a student account.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-input rounded-full text-secondary motion-safe:transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="p-3 bg-danger-bg border border-danger text-danger rounded-lg text-sm">
              {error}
            </div>
          )}
          {/* Student Details */}
          <section>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Full Name *</label>
                <input type="text" name="name" required value={String(formData.name || '')} onChange={handleChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Email *</label>
                <input type="email" name="email" required value={String(formData.email || '')} onChange={handleChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Phone Number *</label>
                <input type="tel" name="phone" required value={String(formData.phone || '')} onChange={handleChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Temporary Password</label>
                <input type="text" name="password" value={String(formData.password || '')} onChange={handleChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary" placeholder="Default: Student@123" />
              </div>
            </div>
          </section>
          {/* Stay Details */}
          <section>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Home className="w-4 h-4" /> Stay Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Select Room & Bed *</label>
                <select name="bedId" required value={String(formData.bedId || '')} onChange={handleBedChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary">
                  <option value="">-- Select Available Bed --</option>
                  {availableBeds.map(bed => {
                    const room = rooms.find(r => String(r.id) === String(bed.roomId));
                    return (
                      <option key={String(bed.id)} value={String(bed.id)}>
                        Room {String(room?.roomNumber || room?.number || 'Unknown')} - Bed {String(bed.code || bed.name || 'Unknown')}
                      </option>
                    );
                  })}
                </select>
                {availableBeds.length === 0 && <p className="text-xs text-warning mt-1">No vacant beds available in this PG.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Monthly Rent *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-secondary" />
                  <input type="number" name="rentAmount" required value={String(formData.rentAmount || '')} onChange={handleChange} className="w-full bg-input border border rounded-lg pl-9 pr-3 py-2 text-primary focus:outline-none focus:border-primary" placeholder="8000" />
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1">Stay Duration (Months) *</label>
                <select name="stayDuration" required value={String(formData.stayDuration || '3')} onChange={handleChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary">
                  {[1, 2, 3, 4, 5, 6, 9, 12].map(months => (
                    <option key={months} value={months}>{months} {months === 1 ? 'Month' : 'Months'}</option>
                  ))}
                </select>
                <p className="text-xs text-secondary mt-1">Rent schedule will be generated automatically for this duration.</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="flex items-center gap-3 p-3 bg-input border border rounded-lg cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="hasMessFacility" 
                    checked={Boolean(formData.hasMessFacility)} 
                    onChange={handleChange} 
                    className="w-5 h-5 accent-[var(--primary)]"
                  />
                  <div>
                    <div className="font-bold text-primary">Enable Mess Facility</div>
                    <div className="text-xs text-secondary">If checked, include the mess charges in the Monthly Rent above.</div>
                  </div>
                </label>
              </div>
            </div>
          </section>
          {/* Parent Details */}
          <section>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Parent/Guardian Details (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Parent Name</label>
                <input type="text" name="parentName" value={String(formData.parentName || '')} onChange={handleChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary" placeholder="Parent's Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Parent Email</label>
                <input type="email" name="parentEmail" value={String(formData.parentEmail || '')} onChange={handleChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary" placeholder="For Parent App Access" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Parent Phone</label>
                <input type="tel" name="parentPhone" value={String(formData.parentPhone || '')} onChange={handleChange} className="w-full bg-input border border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary" placeholder="+91 9876543210" />
              </div>
            </div>
          </section>
          <div className="pt-4 border-t border flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-secondary hover:bg-input rounded-lg font-medium motion-safe:transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold motion-safe:transition-colors disabled:opacity-50">
              {loading ? 'Creating...' : 'Onboard Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}