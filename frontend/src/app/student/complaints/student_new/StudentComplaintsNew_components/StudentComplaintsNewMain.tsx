'use client';

// RESPONSIBILITY: Renders the New Complaint Form.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ImagePlus, AlertCircle, Send } from 'lucide-react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export function StudentComplaintsNewMain() {
  const router = useRouter();
  const { profile } = useStudentContext();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    priority: 'Medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    studentOperationsApi.createComplaint({
      propertyId: (profile as any).propertyId,
      category: formData.category,
      description: formData.description,
      priority: formData.priority,
      title: formData.title
    }, (profile as any).id);
    toast.success('Complaint raised successfully!');
    router.push('/student/complaints');
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary">Raise a New Complaint</h1>
        <p className="text-sm text-secondary">Provide details about the issue you are facing.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-2">Category</label>
          <select required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm text-primary focus:outline-none focus:border-primary">
            <option value="">Select Category</option>
            <option value="Electrical">Electrical (Bulb, Fan, AC)</option>
            <option value="Plumbing">Plumbing (Tap, Flush, Leakage)</option>
            <option value="Cleaning">Cleaning & Hygiene</option>
            <option value="Food/Mess">Food / Mess Issue</option>
            <option value="Internet">Wi-Fi / Internet</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-2">Complaint Title</label>
          <input required type="text" placeholder="Short description of the issue" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm text-primary focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-2">Priority Level</label>
          <div className="flex gap-4">
            {['Low', 'Medium', 'High'].map(p => (
              <label key={p} className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-[var(--radius-md)] cursor-pointer transition-colors ${formData.priority === p ? 'border-primary bg-primary-subtle text-primary font-bold' : 'border-border text-secondary hover:bg-input'}`}>
                <input type="radio" name="priority" value={p} checked={formData.priority === p} onChange={e=>setFormData({...formData, priority: e.target.value})} className="hidden" />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-2">Detailed Description</label>
          <textarea required rows={4} placeholder="Explain the issue in detail..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm text-primary focus:outline-none focus:border-primary resize-none"></textarea>
        </div>

        <div className="border-2 border-dashed border-border rounded-[var(--radius-md)] p-6 text-center hover:border-primary transition-colors cursor-pointer bg-page">
          <ImagePlus className="w-8 h-8 text-secondary mx-auto mb-2" />
          <div className="font-bold text-primary text-sm">Upload Photo (Optional)</div>
          <div className="text-xs text-secondary mt-1">PNG, JPG up to 5MB</div>
          <input type="file" className="hidden" accept="image/*" />
        </div>

        <div className="bg-info-bg border border-info/20 rounded-[var(--radius-md)] p-4 flex gap-3 text-sm text-info">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>Most complaints are resolved within 24-48 hours. Please be patient.</p>
        </div>

        <div className="pt-4 flex gap-3">
          <button type="button" onClick={() => router.back()} className="flex-1 py-3 px-4 bg-input text-primary font-bold rounded-[var(--radius-md)] hover:bg-border transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-[var(--radius-md)] shadow-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
}
