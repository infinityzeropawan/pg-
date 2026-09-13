// @ts-nocheck
// RESPONSIBILITY: Renders the ManagerCheckinFormSteps1to5 component.
import { User, FileText, Users, BedDouble, HeartHandshake } from 'lucide-react';

import { InputError } from '@/components/ui/InputError';

import type { ManagerCheckinFormData } from '@/app/manager/check-in/ManagerCheckin_types/ManagerCheckin.types';
interface Props {
  step: number;
  formData: ManagerCheckinFormData;
  setFormData: React.Dispatch<React.SetStateAction<ManagerCheckinFormData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  vacantBeds: unknown[];
  compatibilityScore: number | null;
}
export function ManagerCheckinFormSteps1to5({ step, formData, setFormData, errors, setErrors, vacantBeds, compatibilityScore }: Props) {
  if (step > 5) return null;
  return (
    <>
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><User className="text-primary" /> Personal Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>              <input type="text" value={formData.personal.name} onChange={e => {setFormData({...formData, personal: {...formData.personal, name: e.target.value}}); setErrors({...errors, name: ''});}} className={`w-full bg-input border ${errors.name ? 'border-danger' : 'border'} rounded px-3 py-2 text-primary focus:border-primary outline-none`} />
              <InputError message={errors.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Phone</label>              <input type="tel" value={formData.personal.phone} onChange={e => {setFormData({...formData, personal: {...formData.personal, phone: e.target.value}}); setErrors({...errors, phone: ''});}} className={`w-full bg-input border ${errors.phone ? 'border-danger' : 'border'} rounded px-3 py-2 text-primary focus:border-primary outline-none`} />
              <InputError message={errors.phone} />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Email</label>              <input type="email" value={formData.personal.email} onChange={e => setFormData({...formData, personal: {...formData.personal, email: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Date of Birth</label>              <input type="date" value={formData.personal.dob} onChange={e => setFormData({...formData, personal: {...formData.personal, dob: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Gender</label>              <select value={formData.personal.gender} onChange={e => setFormData({...formData, personal: {...formData.personal, gender: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">College / Workplace</label>              <input type="text" value={formData.personal.college} onChange={e => setFormData({...formData, personal: {...formData.personal, college: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none" />
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><FileText className="text-primary" /> Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Aadhar Number</label>              <input type="text" placeholder="12-digit Aadhar" value={formData.documents.aadharNumber} onChange={e => setFormData({...formData, documents: {...formData.documents, aadharNumber: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">PAN Number</label>              <input type="text" placeholder="10-digit PAN (Optional)" value={formData.documents.panNumber} onChange={e => setFormData({...formData, documents: {...formData.documents, panNumber: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none uppercase" />
            </div>
          </div>
          <div className="border-2 border-dashed border rounded-xl p-8 text-center bg-primary-subtle mt-4">
            <FileText className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="text-secondary text-sm mb-4">Simulate file upload for Document Proofs.</p>            <button onClick={() => setFormData({...formData, documents: { ...formData.documents, files: [{name: 'aadhar_front.jpg'}, {name: 'aadhar_back.jpg'}] }})} className="px-4 py-2 bg-input border border text-primary rounded text-sm hover:bg-primary-subtle motion-safe:transition-colors">              {formData.documents.files.length > 0 ? 'Files Attached (2)' : 'Attach Dummy Files'}
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><Users className="text-primary" /> Parent Details</h2>
          <p className="text-sm text-secondary mb-4">A parent user will be automatically created and linked.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Parent Name</label>              <input type="text" value={formData.parent.name} onChange={e => {setFormData({...formData, parent: {...formData.parent, name: e.target.value}}); setErrors({...errors, parentName: ''});}} className={`w-full bg-input border ${errors.parentName ? 'border-danger' : 'border'} rounded px-3 py-2 text-primary focus:border-primary outline-none`} />
              <InputError message={errors.parentName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Parent Phone</label>              <input type="tel" value={formData.parent.phone} onChange={e => {setFormData({...formData, parent: {...formData.parent, phone: e.target.value}}); setErrors({...errors, parentPhone: ''});}} className={`w-full bg-input border ${errors.parentPhone ? 'border-danger' : 'border'} rounded px-3 py-2 text-primary focus:border-primary outline-none`} />
              <InputError message={errors.parentPhone} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-secondary mb-1">Parent Email (Optional)</label>              <input type="email" value={formData.parent.email} onChange={e => setFormData({...formData, parent: {...formData.parent, email: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none" />
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><BedDouble className="text-primary" /> Select Vacant Bed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {vacantBeds.length === 0 ? (
              <div className="col-span-full text-secondary p-4 text-center bg-input rounded-lg">
                No vacant beds available in this property.
              </div>
            ) : (
              vacantBeds.map((bed) => (
                <button                  key={beString((d as Record<string, unknown>).id)}                  onClick={() => setFormData({...formData, room: { bedId: beString((d as Record<string, unknown>).id) }})}
                  className={`p-4 rounded-xl border text-left motion-safe:transition-all ${                    formData.room.bedId === beString((d as Record<string, unknown>).id) 
                      ? 'border-primary bg-primary-subtle' 
                      : 'border hover:border-primary-hover bg-input'
                  }`}
                >                  <div className="font-bold text-primary">Room {bed.roomNumber}</div>                  <div className="text-sm text-secondary">Bed {bed.code}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
      {step === 5 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">

          <h2 className="text-xl font-bold text-primary flex items-center gap-2"><HeartHandshake className="text-primary" /> Roommate Compatibility</h2>

          <div className="bg-success-bg border border-success rounded-xl p-4 flex items-center justify-between">
            <div>

              <h3 className="font-bold text-primary">Compatibility Score</h3>
              <p className="text-xs text-secondary">Based on lifestyle preferences vs occupying roommate.</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-success-bg border-2 border-success flex items-center justify-center font-bold text-lg text-success">
              {compatibilityScore || '--'}%

            </div>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
             <div>
                <label className="block text-sm font-medium text-secondary mb-1">Sleep Schedule</label>                <select value={formData.compatibility.sleepSchedule} onChange={e => setFormData({...formData, compatibility: {...formData.compatibility, sleepSchedule: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none">
                  <option value="early">Early Bird</option><option value="normal">Normal</option><option value="late">Night Owl</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-secondary mb-1">Study Habits</label>                <select value={formData.compatibility.studyHabits} onChange={e => setFormData({...formData, compatibility: {...formData.compatibility, studyHabits: e.target.value}})} className="w-full bg-input border border rounded px-3 py-2 text-primary focus:border-primary outline-none">
                  <option value="quiet">Needs Absolute Quiet</option><option value="moderate">Moderate Noise OK</option><option value="loud">Loud / Group Study</option>
                </select>
             </div>
          </div>
        </div>
      )}
    </>
  );
}