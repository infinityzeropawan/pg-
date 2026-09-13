'use client';

// RESPONSIBILITY: Renders the StudentMessMain component based on new checklist.

import { useState, useEffect } from 'react';
import { Zap, Utensils, CheckCircle, XCircle, QrCode, Star, CalendarDays, Coffee, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { getSession } from '@/app/student/student_lib/student_auth/StudentSession';

export function StudentMessMain() {
  const { profile } = useStudentContext();
  const session = typeof window !== 'undefined' ? getSession() : null;
  const [wallet, setWallet] = useState(0);
  const [menu, setMenu] = useState<any>(null);
  const [showRecharge, setShowRecharge] = useState(false);
  const [amount, setAmount] = useState('500');
  const [activeTab, setActiveTab] = useState<'today' | 'weekly'>('today');

  const loadData = () => {
    if (profile) {
      setWallet(studentOperationsApi.getWalletBalance((profile as any).studentId || (profile as any).userId));
      setMenu(studentOperationsApi.getTodayMenu((profile as any).propertyId));
    }
  };

  useEffect(() => {
    loadData();
  }, [profile]);

  const handleRecharge = () => {
    if (!session || !profile) return;
    studentOperationsApi.rechargeWallet((profile as any).studentId || (profile as any).userId, parseInt(amount), (session as any).id);
    toast.success('Wallet recharged! (Mock)');
    setShowRecharge(false);
    loadData();
  };

  const handleOrder = (type: 'breakfast'|'lunch'|'dinner', cost: number) => {
    if (!session || !profile) return;
    try {
      studentOperationsApi.orderMeal((profile as any).studentId || (profile as any).userId, (profile as any).propertyId, type, cost, (session as any).id);
      toast.success(`Ordered ${type}. ₹${cost} deducted from wallet.`);
      loadData();
    } catch (e: any) {
      toast.error(e.message);
      setShowRecharge(true);
    }
  };

  const handleOptOut = (type: string) => {
    toast.success(`Opted out of ${type}. Refund processed (if applicable).`);
  };

  if (!profile) return <div className="p-4 motion-safe:animate-pulse">Loading...</div>;

  const meals = [
    { type: 'breakfast', label: 'Breakfast', menu: menu?.breakfast || 'Poha + Tea + Banana', cost: 40, icon: Coffee, color: 'text-warning', bg: 'bg-warning-bg' },
    { type: 'lunch', label: 'Lunch', menu: menu?.lunch || 'Rice + Dal + Roti + Sabji', cost: 70, icon: Sun, color: 'text-info', bg: 'bg-info-bg' },
    { type: 'dinner', label: 'Dinner', menu: menu?.dinner || 'Roti + Paneer + Salad', cost: 70, icon: Moon, color: 'text-primary', bg: 'bg-primary-subtle' },
  ] as const;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          🍽️ Mess & Food Management
        </h1>
        <p className="text-sm text-secondary mt-1">View menu, opt in/out, check-in, and recharge wallet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Wallet & QR Code (Check-in) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-[var(--bg-card)] to-[var(--warning-bg)] border border-warning/20 rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col justify-between text-center relative overflow-hidden">
            <Zap className="absolute -left-4 -bottom-4 w-24 h-24 text-warning/10" />
            <div className="relative z-10">
              <div className="text-sm text-secondary font-bold uppercase tracking-wider mb-2">Wallet Balance</div>
              <div className="text-4xl font-black text-warning">₹{wallet}</div>
              <div className="text-xs text-secondary mt-1">For extra items / snacks</div>
            </div>
            <button onClick={() => setShowRecharge(true)} className="mt-6 w-full px-6 py-3 bg-warning text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-yellow-600 transition-colors relative z-10">
              Recharge Wallet
            </button>
          </div>

          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm text-center">
             <h3 className="font-black text-primary text-lg mb-4 flex justify-center items-center gap-2">
               <QrCode className="w-5 h-5" /> Mess Check-in
             </h3>
             <div className="w-40 h-40 mx-auto bg-input border-2 border-dashed border-border rounded flex flex-col items-center justify-center p-4">
               <QrCode className="w-20 h-20 text-secondary mb-2 opacity-50" />
               <span className="text-xs font-bold text-secondary uppercase tracking-wider">Scan at counter</span>
             </div>
             <p className="text-xs text-secondary mt-4">Show this QR code at the mess counter to mark your attendance for the meal.</p>
          </div>
        </div>

        {/* Menu & Opt-out */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-border bg-input flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-black text-lg text-primary flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary"/> Menu & Opt-out
              </h2>
              <div className="flex bg-card rounded-[var(--radius-full)] p-1 border border-border text-sm font-bold">
                <button onClick={()=>setActiveTab('today')} className={`px-4 py-1.5 rounded-[var(--radius-full)] transition-colors ${activeTab === 'today' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}>
                  Today's Menu
                </button>
                <button onClick={()=>setActiveTab('weekly')} className={`px-4 py-1.5 rounded-[var(--radius-full)] transition-colors ${activeTab === 'weekly' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}>
                  Weekly Plan
                </button>
              </div>
            </div>

            {activeTab === 'today' ? (
              <div className="divide-y divide-border flex-1">
                {meals.map(m => (
                  <div key={m.type} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-input transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${m.bg} ${m.color}`}>
                        <m.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">{m.label}</div>
                        <div className="text-lg font-bold text-primary mb-2">{m.menu}</div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-secondary">Rate:</span>
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-border hover:text-warning cursor-pointer transition-colors" />)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                      <button onClick={() => handleOptOut(m.label)} className="flex-1 md:flex-none px-4 py-2 border border-danger text-danger text-sm rounded-[var(--radius-md)] font-bold bg-danger-bg hover:bg-danger hover:text-white transition-colors">
                        Opt-Out
                      </button>
                      <button onClick={() => handleOrder(m.type, m.cost)} className="flex-1 md:flex-none px-4 py-2 bg-success text-white text-sm rounded-[var(--radius-md)] font-bold shadow-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4"/> Eat Extra (₹{m.cost})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                <CalendarDays className="w-16 h-16 text-secondary mb-4 opacity-20" />
                <h3 className="font-bold text-primary mb-2">Weekly Menu Coming Soon</h3>
                <p className="text-sm text-secondary">The complete weekly mess schedule will be displayed here.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {showRecharge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-[var(--radius-lg)] shadow-2xl p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-black text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Zap className="w-5 h-5 text-warning"/> Recharge Wallet
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-secondary uppercase mb-2">Amount (₹)</label>
                <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] font-bold text-primary focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-2 pt-2">
                {[500, 1000, 2000].map(amt => (
                  <button key={amt} onClick={() => setAmount(amt.toString())} className="flex-1 py-2 border border-border rounded-[var(--radius-md)] text-sm font-bold text-secondary hover:bg-primary-subtle hover:text-primary hover:border-primary transition-colors">₹{amt}</button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowRecharge(false)} className="flex-1 px-4 py-3 bg-input text-primary rounded-[var(--radius-md)] font-bold hover:bg-border transition-colors">Cancel</button>
              <button onClick={handleRecharge} className="flex-1 px-4 py-3 bg-warning text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-yellow-600 transition-colors">Pay ₹{amount}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
