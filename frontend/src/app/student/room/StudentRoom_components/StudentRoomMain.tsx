'use client';

// RESPONSIBILITY: Renders the Student Room & Accommodation UI.

import { MapPin, Users, IndianRupee, Bed, Wind, Wifi, Droplet, Sun, CheckCircle2, XCircle, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export function StudentRoomMain() {
  const { profile } = useStudentContext();

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          🏠 My Room & Accommodation
        </h1>
        <p className="text-sm text-secondary mt-1">View your room details, roommates, facilities, and inventory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Details */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="w-5 h-5 text-secondary" /> Location Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">PG Name</span>
              <span className="font-medium text-primary">{profile?.propertyName || 'Green Valley PG'}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">Address</span>
              <span className="font-medium text-primary text-right max-w-[200px]">123, MG Road, Kolkata, West Bengal - 700001</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">Building</span>
              <span className="font-medium text-primary">Tower A</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">Floor</span>
              <span className="font-medium text-primary">2nd Floor</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-secondary font-bold uppercase">Room</span>
              <span className="font-medium text-primary font-bold">{profile?.roomNumber || '203'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary font-bold uppercase">Bed</span>
              <span className="font-medium text-primary font-bold">{profile?.bedCode || 'B'}</span>
            </div>
          </div>
        </div>

        {/* Room Type & Rent Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-subtle border border-primary/20 rounded-[var(--radius-lg)] p-5 flex flex-col justify-center items-center text-center">
            <div className="text-xs font-bold text-primary/70 uppercase mb-2">Room Type</div>
            <Bed className="w-8 h-8 text-primary mb-2" />
            <div className="font-black text-primary text-lg">Double Sharing</div>
          </div>
          <div className="bg-success-bg border border-success/20 rounded-[var(--radius-lg)] p-5 flex flex-col justify-center items-center text-center">
            <div className="text-xs font-bold text-success/70 uppercase mb-2">Sharing With</div>
            <Users className="w-8 h-8 text-success mb-2" />
            <div className="font-black text-success text-lg">2 Students</div>
          </div>
          <div className="bg-warning-bg border border-warning/20 rounded-[var(--radius-lg)] p-5 flex flex-col justify-center items-center text-center">
            <div className="text-xs font-bold text-warning/70 uppercase mb-2">Rent</div>
            <IndianRupee className="w-8 h-8 text-warning mb-2" />
            <div className="font-black text-warning text-lg">₹8,000<span className="text-xs font-medium">/mo</span></div>
          </div>
          <div className="bg-info-bg border border-info/20 rounded-[var(--radius-lg)] p-5 flex flex-col justify-center items-center text-center">
            <div className="text-xs font-bold text-info/70 uppercase mb-2">Deposit</div>
            <ShieldAlert className="w-8 h-8 text-info mb-2" />
            <div className="font-black text-info text-lg">₹10,000</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roommates */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            👥 Roommates
          </h3>
          <div className="space-y-4">
            {[
              { bed: 'A', name: 'Amit Verma', age: 23, course: 'BTech 3rd Yr' },
              { bed: 'C', name: 'Priya Patel', age: 22, course: 'MBA 1st Yr' },
              { bed: 'D', name: 'Sumit Kumar', age: 21, course: 'BCom 2nd Yr' }
            ].map((rm, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-input rounded-[var(--radius-md)] border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-[var(--radius-full)] flex items-center justify-center font-bold">
                    {rm.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-primary">Bed {rm.bed}: {rm.name}</div>
                    <div className="text-xs text-secondary font-medium">Age: {rm.age} | {rm.course}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-primary-subtle text-primary text-xs font-bold rounded-[var(--radius-sm)] hover:bg-primary-hover hover:text-white transition-colors">Call</button>
                  <button className="px-3 py-1.5 bg-primary-subtle text-primary text-xs font-bold rounded-[var(--radius-sm)] hover:bg-primary-hover hover:text-white transition-colors">Msg</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Room Facilities */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              🛋️ Room Facilities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="w-4 h-4 text-success" /> AC</div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="w-4 h-4 text-success" /> WiFi</div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="w-4 h-4 text-success" /> Hot Water</div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="w-4 h-4 text-success" /> Balcony</div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="w-4 h-4 text-success" /> Cupboard</div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="w-4 h-4 text-success" /> Study Table</div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary col-span-2"><CheckCircle2 className="w-4 h-4 text-success" /> Attached Bathroom</div>
            </div>
          </div>

          {/* Room Transfer */}
          <div className="bg-gradient-to-r from-primary/5 to-purple/5 border border-primary/20 rounded-[var(--radius-lg)] p-6 shadow-sm relative overflow-hidden">
             <ArrowRightLeft className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/10" />
             <h3 className="font-black text-primary text-lg mb-2 relative z-10">🔄 Room Transfer</h3>
             <p className="text-xs text-secondary mb-4 relative z-10">Want to switch your room? Submit a transfer request to the management.</p>
             <button className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-[var(--radius-md)] shadow-sm hover:bg-primary-hover transition-colors relative z-10">
               Request Transfer
             </button>
          </div>
        </div>
      </div>
      
      {/* Inventory */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
        <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
          📋 Inventory
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { item: 'Bed with Mattress', qty: 1, available: true },
            { item: 'Wardrobe/Cupboard', qty: 1, available: true },
            { item: 'Study Table', qty: 1, available: true },
            { item: 'Chair', qty: 1, available: true },
            { item: 'Curtains', qty: 2, available: true },
            { item: 'Fan', qty: 0, available: false },
            { item: 'AC Remote', qty: 1, available: true },
          ].map((inv, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-[var(--radius-md)] border ${inv.available ? 'bg-input border-border' : 'bg-danger-bg/30 border-danger/20'}`}>
              <div className="flex items-center gap-2">
                {inv.available ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" />}
                <span className={`text-sm font-medium ${inv.available ? 'text-primary' : 'text-danger'}`}>{inv.item}</span>
              </div>
              <span className="text-xs font-bold text-secondary">Qty: {inv.qty}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button className="text-sm font-bold text-primary hover:underline">Request Inventory Item &rarr;</button>
        </div>
      </div>

    </div>
  );
}
