'use client';

// RESPONSIBILITY: Renders the Student Dashboard UI layer.
// DATA FLOW: useStudentDashboard.ts -> StudentDashboardMain.tsx

import Link from 'next/link';
import { IndianRupee, MapPin, Bell, Utensils, TriangleAlert, Home, MessageSquareWarning, ArrowRight, User, Plus, DoorOpen, CalendarOff, FileText } from 'lucide-react';

import { useStudentDashboard } from '@/app/student/dashboard/StudentDashboard_hooks/useStudentDashboard';
import { STUDENT_ROUTES } from '@/app/student/student_url_config';

export function StudentDashboardMain() {
  const { profile, loading, menu, notices, handleReferralSubmit } = useStudentDashboard();

  if (loading || !profile) return <div className="p-4 md:p-6 motion-safe:animate-pulse">Loading dashboard...</div>;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6 w-full h-full">
      
      {/* 1. Dashboard Top Banner */}
      <div className="bg-primary text-white rounded-[var(--radius-lg)] p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Home className="w-32 h-32" /></div>
        <div className="relative z-10">
          <p className="text-white/90 text-lg font-medium mb-1">🧑‍🎓 Good Morning, {profile.name || 'Student'}! 👋</p>
          <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
            <span>📅 {dateStr}</span> | <span>⏰ {timeStr}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-bold backdrop-blur-sm shadow-sm border border-white/10">
            🏠 {profile.propertyName || 'Green Valley PG'} - Room {profile.roomNumber || '-'}, Bed {profile.bedCode || '-'}
          </div>
        </div>
      </div>

      {/* 2. Rent Status Card */}
      <div className="bg-gradient-to-br from-bg-card to-bg-page border border-border rounded-[var(--radius-lg)] p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:border-primary motion-safe:hover:-translate-y-1 motion-safe:transition-all shadow-sm group relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-danger-bg rounded-[var(--radius-full)] blur-2xl opacity-40 group-hover:scale-150 transition-transform duration-[700ms]"></div>
        <div className="flex items-start sm:items-center gap-4 relative z-10 mb-4 sm:mb-0">
          <div className="p-3 bg-danger-bg rounded-[var(--radius-md)] text-danger">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-secondary font-bold text-sm mb-1 uppercase tracking-wider">💳 Rent Status</div>
            <div className={`text-2xl font-black ${profile.duesAmount > 0 ? 'text-danger' : 'text-success'}`}>
              ₹{profile.duesAmount > 0 ? profile.duesAmount : '0'}
            </div>
            <div className="text-sm font-medium text-secondary mt-1">
              {profile.duesAmount > 0 ? (
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-warning"></span> Pending | Due: 10th Sep 2024 (⏰ 4 days left)
                </span>
              ) : 'All cleared for this month!'}
            </div>
          </div>
        </div>
        {profile.duesAmount > 0 && (
          <div className="relative z-10 w-full sm:w-auto">
            <Link href={STUDENT_ROUTES.RENT} className="inline-flex items-center justify-center w-full sm:w-auto bg-primary text-white text-sm font-bold px-6 py-3 rounded-[var(--radius-md)] shadow hover:bg-primary-hover transition-colors">
              Pay Now <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
      </div>

      {/* 3. Horizontal Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'My Room', icon: Home, link: STUDENT_ROUTES.ROOM, subtext: 'View →', color: 'text-info', bg: 'bg-info-bg' },
          { label: 'Rent', icon: IndianRupee, link: STUDENT_ROUTES.RENT, subtext: 'History', color: 'text-success', bg: 'bg-success-bg' },
          { label: 'Complaints', icon: MessageSquareWarning, link: STUDENT_ROUTES.COMPLAINTS, subtext: '(2 Open)', color: 'text-danger', bg: 'bg-danger-bg' },
          { label: "Today's Menu", icon: Utensils, link: STUDENT_ROUTES.MESS, subtext: 'View', color: 'text-warning', bg: 'bg-warning-bg' },
          { label: 'Notices', icon: Bell, link: STUDENT_ROUTES.NOTICES, subtext: '(3 New)', color: 'text-purple', bg: 'bg-purple-bg' },
        ].map((action, idx) => (
          <Link key={idx} href={action.link} className="bg-card border border-border p-4 rounded-[var(--radius-md)] flex flex-col items-center justify-center text-center hover:border-primary hover:shadow-sm transition-all group">
            <div className={`p-2 rounded-full ${action.bg} ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div className="font-bold text-primary text-sm mb-1">{action.label}</div>
            <div className="text-xs text-secondary font-medium">{action.subtext}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 4. Today's Menu */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-sm">
          <h3 className="font-black text-primary text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">
            🍳 Today's Menu
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Breakfast (8-9:30 AM)</div>
              <div className="flex items-center gap-2 text-primary font-medium bg-input p-3 rounded-[var(--radius-md)]">
                🍛 {menu?.breakfast || 'Poha + Tea'}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Lunch (12-2 PM)</div>
              <div className="flex items-center gap-2 text-primary font-medium bg-input p-3 rounded-[var(--radius-md)]">
                🍚 {menu?.lunch || 'Dal + Rice + Sabji'}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Dinner (8-10 PM)</div>
              <div className="flex items-center gap-2 text-primary font-medium bg-input p-3 rounded-[var(--radius-md)]">
                🫓 {menu?.dinner || 'Roti + Paneer + Salad'}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Quick Actions Links */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-sm">
          <h3 className="font-black text-primary text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">
            📌 Quick Actions
          </h3>
          <div className="space-y-2">
            <Link href={STUDENT_ROUTES.NEW_COMPLAINT || STUDENT_ROUTES.COMPLAINTS} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-input transition-colors group">
              <span className="flex items-center gap-3 font-medium text-primary"><Plus className="w-5 h-5 text-secondary" /> Raise Complaint</span>
            </Link>
            <Link href={STUDENT_ROUTES.VISITORS} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-input transition-colors group">
              <span className="flex items-center gap-3 font-medium text-primary"><DoorOpen className="w-5 h-5 text-secondary" /> Visitor Request</span>
            </Link>
            <Link href={STUDENT_ROUTES.LEAVES} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-input transition-colors group">
              <span className="flex items-center gap-3 font-medium text-primary"><CalendarOff className="w-5 h-5 text-secondary" /> Leave Request</span>
            </Link>
            <Link href={STUDENT_ROUTES.MESS} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-input transition-colors group">
              <span className="flex items-center gap-3 font-medium text-primary"><Utensils className="w-5 h-5 text-secondary" /> Meal Opt-Out</span>
            </Link>
            <Link href={STUDENT_ROUTES.DOCUMENTS} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-input transition-colors group">
              <span className="flex items-center gap-3 font-medium text-primary"><FileText className="w-5 h-5 text-secondary" /> View Agreement</span>
            </Link>
            <Link href={STUDENT_ROUTES.RENT} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-input transition-colors group">
              <span className="flex items-center gap-3 font-medium text-primary"><IndianRupee className="w-5 h-5 text-secondary" /> Pay Rent</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Monthly Activity Summary */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-sm">
        <h3 className="font-black text-primary text-lg mb-4">📊 Monthly Activity Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-input rounded-[var(--radius-md)] text-center">
            <div className="text-2xl font-black text-success mb-1">28/30</div>
            <div className="text-xs font-bold text-secondary uppercase tracking-wider">Present</div>
          </div>
          <div className="p-4 bg-input rounded-[var(--radius-md)] text-center">
            <div className="text-2xl font-black text-info mb-1">85%</div>
            <div className="text-xs font-bold text-secondary uppercase tracking-wider">Attendance</div>
          </div>
          <div className="p-4 bg-input rounded-[var(--radius-md)] text-center">
            <div className="text-2xl font-black text-warning mb-1">3</div>
            <div className="text-xs font-bold text-secondary uppercase tracking-wider">Leaves</div>
          </div>
          <div className="p-4 bg-input rounded-[var(--radius-md)] text-center">
            <div className="text-2xl font-black text-purple mb-1 flex items-center justify-center gap-1">4.8 ⭐</div>
            <div className="text-xs font-bold text-secondary uppercase tracking-wider">Rating</div>
          </div>
        </div>
      </div>

      {/* 7. Recent Updates */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-sm">
        <h3 className="font-black text-primary text-lg mb-4 border-b border-border pb-3">📝 Recent Updates</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-primary">Notice: Water supply will be off tomorrow 10-11 AM</div>
              <div className="text-xs text-secondary mt-1">Today at 5:00 PM</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-primary">Your complaint #234 has been resolved</div>
              <div className="text-xs text-secondary mt-1">Today at 2:30 PM</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-primary">Visitor request approved for Saturday</div>
              <div className="text-xs text-secondary mt-1">Today at 11:00 AM</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-primary">Rent reminder: Due in 4 days</div>
              <div className="text-xs text-secondary mt-1">Today at 9:00 AM</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
