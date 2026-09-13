import { useState } from 'react';
import { X, User as UserIcon, MapPin, IndianRupee, ShieldCheck, MessageSquare, Calendar, Users, ClipboardList, CheckSquare, FileText, Clock } from 'lucide-react';
import type { ManagerStudentData } from '@/app/manager/students/ManagerStudents_types/ManagerStudents.types';

interface Props {
  student: ManagerStudentData | null;
  isOpen: boolean;
  onClose: () => void;
}

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'room', label: 'Room', icon: MapPin },
  { id: 'rent', label: 'Rent', icon: IndianRupee },
  { id: 'payments', label: 'Payments', icon: ClipboardList },
  { id: 'complaints', label: 'Complaints', icon: MessageSquare },
  { id: 'leave', label: 'Leave', icon: Calendar },
  { id: 'visitors', label: 'Visitors', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: CheckSquare },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'agreement', label: 'Agreement', icon: FileText },
  { id: 'history', label: 'History', icon: Clock },
];

export function ManagerStudentDrawer({ student, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState('profile');

  if (!isOpen || !student) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-card shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-border manager-theme animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-input/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {student.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-black text-primary">{student.user?.name || 'Unknown Student'}</h2>
              <p className="text-xs text-secondary font-medium">ID: {student.profile.id.slice(-6)} | {student.user?.phone}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-input rounded-full text-secondary hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-center bg-card">
          <div className="p-3">
            <p className="text-[10px] uppercase font-bold text-secondary mb-1">Accommodation</p>
            <p className="text-sm font-bold text-primary">Room 101, Bed A</p>
          </div>
          <div className="p-3">
            <p className="text-[10px] uppercase font-bold text-secondary mb-1">Rent Status</p>
            {student.profile.duesAmount > 0 ? (
              <p className="text-sm font-bold text-danger">Due: ₹{student.profile.duesAmount}</p>
            ) : (
              <p className="text-sm font-bold text-success">Cleared</p>
            )}
          </div>
          <div className="p-3">
            <p className="text-[10px] uppercase font-bold text-secondary mb-1">KYC Status</p>
            <p className="text-sm font-bold text-success flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Verified
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border scrollbar-hide bg-input/20">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'border-theme-primary text-theme-primary bg-theme-primary/5' 
                  : 'border-transparent text-secondary hover:text-primary hover:bg-input/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-card">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-primary mb-3 uppercase tracking-wider">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary text-xs block mb-1">Full Name</span>
                    <span className="font-medium">{student.user?.name}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-xs block mb-1">Email</span>
                    <span className="font-medium">{student.user?.email || '-'}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-xs block mb-1">Phone Number</span>
                    <span className="font-medium">{student.user?.phone}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-xs block mb-1">Emergency Contact</span>
                    <span className="font-medium">9988776655</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-black text-primary mb-3 uppercase tracking-wider">PG Trust Score</h3>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-black ${student.profile.pgScore >= 80 ? 'text-success' : 'text-warning'}`}>
                    {student.profile.pgScore}/100
                  </div>
                  <p className="text-xs text-secondary max-w-[200px]">
                    Score based on rent payment history, attendance, and adherence to rules.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab !== 'profile' && (
            <div className="flex flex-col items-center justify-center h-full text-secondary opacity-60">
              <div className="p-4 bg-input rounded-full mb-3">
                {TABS.find(t => t.id === activeTab)?.icon({ className: 'w-8 h-8' })}
              </div>
              <p className="font-bold">{TABS.find(t => t.id === activeTab)?.label} Data</p>
              <p className="text-xs mt-1">This section will show detailed data soon.</p>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-input/50 flex justify-end gap-3">
          <button className="px-4 py-2 text-xs font-bold text-secondary hover:text-primary transition-colors">
            Disable Account
          </button>
          <button className="px-4 py-2 text-xs font-bold bg-theme-primary text-white rounded-[var(--radius-md)] hover:bg-theme-primary-hover shadow-sm transition-colors">
            Edit Student
          </button>
        </div>
      </div>
    </>
  );
}
