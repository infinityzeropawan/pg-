'use client';

// RESPONSIBILITY: Renders the OwnerTeamDetailsMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, User, Phone, Mail, IndianRupee, Clock, Calendar, 
  Building2, CheckCircle2, XCircle, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

import { teamApi } from '@/app/owner/owner_lib/owner_api/OwnerTeam';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';

import type { TeamMember } from '@/app/owner/owner_lib/owner_api/OwnerTeam';

export function OwnerTeamDetailsMain() {
  const params = useParams();
  const router = useRouter();
  const { properties } = useOwnerPropertyContext();
  
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const data = teamApi.getTeamMemberById(params.id as string);
      setMember(data);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full motion-safe:animate-spin"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-danger-bg text-danger rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Profile Not Found</h2>
        <p className="text-secondary mb-6">This team member might have been removed.</p>
        <button onClick={() => router.push('/owner/team')} className="bg-primary text-white px-5 py-2 rounded-md font-medium">
          Back to Team
        </button>
      </div>
    );
  }

  const assignedProps = properties.filter(p => member.user.assignedPropertyIds?.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-6 animate-in fade-in motion-safe:duration-300 motion-safe:ease-in-out">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/owner/team" className="p-2 border border-border rounded-full hover:bg-card motion-safe:transition-colors text-secondary hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold text-primary leading-tight">Staff Profile</h1>
            <p className="text-[12px] font-medium text-secondary uppercase tracking-wider">Dashboard / Staff & Users / Profile</p>
          </div>
        </div>
      </div>

      {/* Top Banner Profile Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow motion-safe:duration-300">
        {/* Accent Strip */}
        <div className="h-24 bg-primary/10 border-b border-primary/20 relative overflow-hidden flex items-end">
           {/* Abstract subtle shape */}
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
        </div>
        
        <div className="px-8 pb-8 relative flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-10">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-bg-card shadow-sm bg-primary-subtle flex items-center justify-center relative shrink-0 z-10">
            <span className="text-3xl font-bold text-primary tracking-tight">
              {member.user.name.substring(0, 2).toUpperCase()}
            </span>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-success border-2 border-bg-card rounded-full"></div>
          </div>
          
          {/* Main Info */}
          <div className="flex-1 pb-1">
            <h2 className="text-[22px] font-bold text-primary">{member.user.name}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-primary-subtle text-primary capitalize">
                {member.profile.staffType}
              </div>
              <div className="flex items-center gap-1.5 text-[14px] text-secondary">
                <Phone className="w-4 h-4" /> {member.user.phone || 'N/A'}
              </div>
              <div className="flex items-center gap-1.5 text-[14px] text-secondary">
                <Mail className="w-4 h-4" /> {member.user.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Stats & Properties */}
        <div className="space-y-6">
          {/* Employment Details */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-primary mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Employment Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-page border border-border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-sm bg-primary-subtle flex items-center justify-center">
                    <IndianRupee className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[11px] font-semibold text-secondary uppercase">Monthly Salary</span>
                </div>
                <div className="text-[24px] font-bold text-primary pl-9">
                  ₹{member.profile.salary.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 bg-page border border-border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-sm bg-primary-subtle flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[11px] font-semibold text-secondary uppercase">Work Shift</span>
                </div>
                <div className="text-[20px] font-bold text-primary pl-9 mt-1">
                  {member.profile.shift}
                </div>
              </div>
              
              <div className="p-4 bg-page border border-border rounded-md sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-sm bg-primary-subtle flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[11px] font-semibold text-secondary uppercase">Date Joined</span>
                </div>
                <div className="text-[18px] font-semibold text-primary pl-9">
                  {new Date(member.profile.joinDate).toLocaleDateString('en-IN', {day: '2-digit', month:'long', year:'numeric'})}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Branches */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col">
            <h3 className="text-[16px] font-semibold text-primary mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Assigned Branches
            </h3>
            
            <div className="flex-1">
              {assignedProps.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 bg-page rounded-md border border-dashed border-border">
                  <Building2 className="w-8 h-8 text-secondary opacity-50 mb-3" />
                  <p className="text-[14px] font-medium text-secondary">No properties assigned yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assignedProps.map(prop => (
                    <div key={prop.id} className="p-3 bg-page border border-border rounded-md flex items-start gap-3 hover:border-primary motion-safe:transition-colors motion-safe:duration-200">
                      <div className="w-8 h-8 rounded-sm bg-primary-subtle flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[14px] font-bold text-primary truncate" title={prop.name}>{prop.name}</p>
                        <p className="text-[11px] font-medium text-secondary uppercase mt-0.5">Branch Access</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Permissions & Security */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-semibold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Role Permissions
              </h3>
              <div className="px-2.5 py-1 bg-page border border-border rounded-full text-[11px] font-semibold text-secondary uppercase">
                Security Matrix
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Edit Rent & Bills', key: 'canEditRent', desc: 'Can modify student rent amounts and generate bills.' },
                { label: 'Add Expenses', key: 'canAddExpense', desc: 'Can log daily expenses for assigned properties.' },
                { label: 'Onboard New Students', key: 'canOnboardStudent', desc: 'Can admit new students and assign beds.' },
                { label: 'Broadcast Messages', key: 'canBroadcast', desc: 'Can send WhatsApp broadcasts to students.' },
                { label: 'Collect Cash Payments', key: 'canCollectCash', desc: 'Authorized to collect and log cash payments.' },
              ].map((perm) => {
                const hasPerm = member.profile.permissions[perm.key as keyof typeof member.profile.permissions];
                return (
                  <div key={perm.key} className="flex items-start gap-4 p-4 rounded-md bg-page border border-border hover:bg-card motion-safe:transition-colors motion-safe:duration-200">
                    <div className="mt-0.5 shrink-0">
                      {hasPerm ? (
                        <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                           <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center">
                           <XCircle className="w-3.5 h-3.5 text-secondary" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className={`text-[14px] font-bold ${hasPerm ? 'text-primary' : 'text-secondary'}`}>
                        {perm.label}
                      </span>
                      <p className="text-[12px] text-secondary mt-0.5 leading-relaxed">
                        {perm.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
