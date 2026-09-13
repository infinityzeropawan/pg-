// RESPONSIBILITY: Renders the ManagerStudentsMain component.
'use client';
import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';

import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { ManagerAddStudentModal } from '@/app/manager/manager_components/ManagerAddStudentModal';
import { useManagerStudents } from '@/app/manager/students/ManagerStudents_hooks/useManagerStudents';
import { ManagerStudentsTable } from '@/app/manager/students/ManagerStudents_components/ManagerStudentsTable';
import { ManagerStudentDrawer } from '@/app/manager/students/ManagerStudents_components/ManagerStudentDrawer';
import type { ManagerStudentData } from '@/app/manager/students/ManagerStudents_types/ManagerStudents.types';

export function ManagerStudentsMain() {
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Drawer state
  const [selectedStudent, setSelectedStudent] = useState<ManagerStudentData | null>(null);

  const { students, fetchStudents } = useManagerStudents(selectedPropertyId, ctxLoading);
  
  if (ctxLoading) return <div className="p-6 text-secondary motion-safe:animate-pulse">Loading students...</div>;
  if (!selectedPropertyId) return <div className="p-6 text-center text-secondary">Property Required</div>;
  
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.user?.phone?.includes(searchTerm);
    if (filterStatus === 'dues') return matchesSearch && s.profile.duesAmount > 0;
    if (filterStatus === 'paid') return matchesSearch && s.profile.duesAmount <= 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 manager-theme animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Student Management</h1>
          <p className="text-sm text-secondary mt-1">Manage residents, rent, and KYC.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-theme-primary text-white px-5 py-2.5 rounded-[var(--radius-md,8px)] hover:bg-theme-primary-hover motion-safe:transition-colors text-sm font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      <div className="bg-card border border-border rounded-[var(--radius-lg,12px)] p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full bg-input border border-border rounded-[var(--radius-md,8px)] pl-10 pr-4 py-2 text-sm text-primary focus:outline-none focus:border-theme-primary transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-secondary" />
          <select 
            className="bg-input border border-border rounded-[var(--radius-md,8px)] px-4 py-2 text-sm text-primary focus:outline-none focus:border-theme-primary transition-colors font-bold"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All Students</option>
            <option value="dues">Pending Dues</option>
            <option value="paid">Rent Cleared</option>
          </select>
        </div>
      </div>

      <ManagerStudentsTable 
        students={filteredStudents} 
        onRowClick={(student) => setSelectedStudent(student)}
      />
      
      {/* Side Drawer */}
      <ManagerStudentDrawer 
        student={selectedStudent} 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />

      {showAddModal && selectedPropertyId && (
        <ManagerAddStudentModal
          propertyId={selectedPropertyId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
}