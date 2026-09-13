'use client';

// RESPONSIBILITY: Renders the Student Profile UI layer.
// DATA FLOW: useStudentProfile.ts -> StudentProfileMain.tsx

import Link from 'next/link';
import { User, Shield, Star, Award, TrendingUp, TrendingDown, Phone, Mail, MapPin, Home, FileText, CheckCircle, Clock, AlertCircle, Edit, Settings } from 'lucide-react';
import { STUDENT_ROUTES } from '@/app/student/student_url_config';

import { useStudentProfile } from '@/app/student/profile/StudentProfile_hooks/useStudentProfile';

export function StudentProfileMain() {
  const { profile, session, formData, setFormData, handleSubmit } = useStudentProfile();

  if (!profile) return <div className="p-4 motion-safe:animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          👤 My Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Photo & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 text-center shadow-sm relative overflow-hidden">
            <div className="w-24 h-24 bg-primary-subtle text-primary rounded-[var(--radius-full)] mx-auto flex items-center justify-center text-4xl font-black border-4 border-white shadow-md mb-4 relative">
              {session?.name?.charAt(0) || 'S'}
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary-hover shadow transition-colors">
                <Edit className="w-3 h-3" />
              </button>
            </div>
            <h2 className="text-xl font-black text-primary">{session?.name || 'Rahul Sharma'}</h2>
            <p className="text-sm font-medium text-secondary mb-4">{session?.email || 'rahul.sharma@email.com'}</p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-subtle rounded-[var(--radius-full)] text-xs font-bold text-primary mb-4">
              <span>Room {(profile as any).roomNumber || '203'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
              <span>Bed {(profile as any).bedId || 'B'}</span>
            </div>

            <div className="w-full">
              <button className="w-full bg-input text-primary font-bold text-sm py-2 rounded-[var(--radius-md)] hover:bg-border transition-colors flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-sm">
             <h3 className="font-bold text-primary mb-3 flex items-center gap-2 border-b border-border pb-2">
               <Shield className="w-4 h-4 text-secondary" /> Emergency Contact
             </h3>
             <div className="space-y-3 text-sm">
               <div>
                 <div className="text-xs font-bold text-secondary uppercase">Name</div>
                 <div className="font-medium text-primary">{(formData as any).parentName || 'Mr. Suresh Sharma (Father)'}</div>
               </div>
               <div>
                 <div className="text-xs font-bold text-secondary uppercase">Mobile</div>
                 <div className="font-medium text-primary flex items-center gap-2">
                   <Phone className="w-3 h-3 text-secondary" /> {(formData as any).parentPhone || '+91 9876543211'}
                 </div>
               </div>
               <div>
                 <div className="text-xs font-bold text-secondary uppercase">Address</div>
                 <div className="font-medium text-primary flex items-center gap-2">
                   <MapPin className="w-3 h-3 text-secondary" /> 456, Village Road, Patna
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Details & KYC */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-black text-primary text-lg mb-4 border-b border-border pb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Gender</span>
                <span className="font-medium text-primary">Male</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Age</span>
                <span className="font-medium text-primary">22</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Date of Birth</span>
                <span className="font-medium text-primary">15th May 2000</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Blood Group</span>
                <span className="font-medium text-danger">O+</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Nationality</span>
                <span className="font-medium text-primary">Indian</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-secondary uppercase mb-1">Religion</span>
                <span className="font-medium text-primary">Hindu</span>
              </div>
            </div>

            <h3 className="font-black text-primary text-lg mt-6 mb-4 border-b border-border pb-3">Contact Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary" />
                <span className="font-medium text-primary">{(formData as any).phone || '+91 9876543210'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary" />
                <span className="font-medium text-primary">{session?.email || 'rahul.sharma@email.com'}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                <span className="font-medium text-primary">123, Park Street, Kolkata</span>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-4 h-4 text-secondary mt-0.5" />
                <span className="font-medium text-primary">Permanent: 456, Village Road, Patna</span>
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2">
              📋 KYC Documents
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-input text-secondary text-xs uppercase font-bold">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-[var(--radius-sm)]">Document</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Uploaded</th>
                    <th className="px-4 py-3 rounded-tr-[var(--radius-sm)] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-input transition-colors">
                    <td className="px-4 py-3 font-medium text-primary flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" /> Aadhar Card
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-success font-bold text-xs bg-success-bg px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">01/08/2024</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-primary hover:underline font-bold text-xs mr-3">View</button>
                      <button className="text-secondary hover:text-primary font-bold text-xs">Update</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-input transition-colors">
                    <td className="px-4 py-3 font-medium text-primary flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" /> PAN Card
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-success font-bold text-xs bg-success-bg px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">01/08/2024</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-primary hover:underline font-bold text-xs mr-3">View</button>
                      <button className="text-secondary hover:text-primary font-bold text-xs">Update</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-input transition-colors">
                    <td className="px-4 py-3 font-medium text-primary flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" /> Address Proof
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-warning font-bold text-xs bg-warning-bg px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">-</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-primary hover:underline font-bold text-xs">Upload</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-sm flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Settings className="w-5 h-5 text-primary" />
               <div>
                 <div className="font-bold text-primary">⚙️ Preferences & Settings</div>
                 <div className="text-xs text-secondary">Manage password, privacy, and notifications</div>
               </div>
             </div>
             <Link href={STUDENT_ROUTES.SETTINGS} className="px-4 py-2 bg-input text-primary font-bold text-sm rounded-[var(--radius-md)] hover:bg-border transition-colors">
               Go to Settings &rarr;
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
