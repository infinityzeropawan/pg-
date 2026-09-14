'use client';

// RESPONSIBILITY: Renders the Student Mess & Food UI.
// DATA FLOW: useStudentMess.ts -> StudentMessMain.tsx

import { useState } from 'react';
import { Zap, Utensils, CheckCircle, Star, CalendarDays, Coffee, Sun, Moon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { useStudentMess, MEAL_TYPES, type MealType } from '@/app/student/mess/StudentMess_hooks/useStudentMess';
import { formatPaise } from '@/lib/utils/money';

const MEAL_META: Record<MealType, { label: string; icon: typeof Coffee; className: string }> = {
  BREAKFAST: { label: 'Breakfast', icon: Coffee, className: 'text-warning bg-warning-bg' },
  LUNCH: { label: 'Lunch', icon: Sun, className: 'text-info bg-info-bg' },
  DINNER: { label: 'Dinner', icon: Moon, className: 'text-primary bg-primary-subtle' },
};

const RECHARGE_PRESETS = [500, 1000, 2000];

export function StudentMessMain() {
  const {
    loading, ordering, error, walletBalancePaise, todayMenu, weekMenu, recentOrders,
    orderMeal, rateOrder, rechargeWallet, refetch,
  } = useStudentMess();

  const [showRecharge, setShowRecharge] = useState(false);
  const [amount, setAmount] = useState('500');
  const [activeTab, setActiveTab] = useState<'today' | 'weekly'>('today');
  const [ratedOrders, setRatedOrders] = useState<Record<string, boolean>>({});

  if (loading) {
    return <div className="p-4 md:p-6 motion-safe:animate-pulse text-secondary">Loading mess details...</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-card border border-border rounded-[var(--radius-lg)] text-center">
        <AlertTriangle className="w-8 h-8 text-danger mx-auto mb-3" />
        <p className="font-bold text-primary">Unable to load mess information</p>
        <p className="text-sm text-secondary mt-1">{error}</p>
        <button onClick={() => void refetch()} className="mt-3 px-4 py-2 bg-primary text-white rounded-[var(--radius-md)] text-sm font-bold">
          Retry
        </button>
      </div>
    );
  }

  const handleRecharge = async () => {
    const parsed = Number.parseInt(amount, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error('Enter a valid recharge amount.');
      return;
    }
    await rechargeWallet(parsed);
    setShowRecharge(false);
  };

  const handleRate = async (orderId: string, rating: number) => {
    setRatedOrders(prev => ({ ...prev, [orderId]: true }));
    await rateOrder(orderId, rating);
  };

  const hasWeekMenu = Boolean(weekMenu && Object.keys(weekMenu).length > 0);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">🍽️ Mess &amp; Food</h1>
        <p className="text-sm text-secondary mt-1">View the menu, book your meals, and manage your mess wallet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-page)] border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Zap className="w-5 h-5 text-warning" /> Mess Wallet
            </h3>
            <div className="text-center py-2">
              <div className="text-[10px] font-black text-secondary uppercase tracking-wider mb-1">Available Balance</div>
              <div className="text-3xl font-black text-primary">{formatPaise(walletBalancePaise)}</div>
            </div>
            <button
              onClick={() => setShowRecharge(true)}
              className="mt-4 w-full py-3 bg-warning text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-yellow-600 transition-colors"
            >
              Add Wallet Credit
            </button>
            <p className="text-[11px] text-secondary mt-3 text-center leading-relaxed">
              Credits are added to your mess wallet balance. Online payment capture is not wired yet,
              so your PG manager reconciles wallet top-ups offline.
            </p>
          </div>
{/* Recent orders + rating */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Utensils className="w-5 h-5 text-primary" /> Recent Orders
            </h3>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-secondary text-center py-4">No meal orders yet.</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {recentOrders.map(order => {
                  const key = (order.mealType as MealType) in MEAL_META ? (order.mealType as MealType) : 'LUNCH';
                  const meal = MEAL_META[key];
                  return (
                    <div key={order.id} className="bg-input rounded-[var(--radius-md)] p-3 border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-primary">{meal.label}</span>
                        <span className="text-[10px] text-secondary">
                          {new Date(order.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      {order.rating ? (
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={`w-3.5 h-3.5 ${order.rating && order.rating >= star ? 'fill-warning text-warning' : 'text-border'}`} />
                          ))}
                        </div>
                      ) : ratedOrders[order.id] ? (
                        <div className="text-[11px] text-success mt-2">Rating submitted</div>
                      ) : (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-bold text-secondary uppercase">Rate:</span>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              onClick={() => void handleRate(order.id, star)}
                              className="w-3.5 h-3.5 text-border hover:text-warning cursor-pointer transition-colors"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

{/* Menu */}
        <div className="md:col-span-2 bg-card border border-border rounded-[var(--radius-lg)] shadow-sm flex flex-col">
          <div className="p-4 border-b border-border bg-input flex items-center gap-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-colors ${activeTab === 'today' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}
            >
              Today&apos;s Menu
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-colors ${activeTab === 'weekly' ? 'bg-primary text-white shadow' : 'text-secondary hover:text-primary'}`}
            >
              Weekly Menu
            </button>
          </div>

          <div className="p-5 flex-1">
            {activeTab === 'today' ? (
              todayMenu ? (
                <div className="space-y-4">
                  {MEAL_TYPES.map(mealType => {
                    const meta = MEAL_META[mealType];
                    const Icon = meta.icon;
                    const items = todayMenu[mealType.toLowerCase()];
                    const alreadyOrdered = recentOrders.some(o => o.mealType === mealType);
                    return (
                      <div key={mealType} className="bg-page border border-border rounded-[var(--radius-md)] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${meta.className}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-primary text-sm uppercase tracking-wide">{meta.label}</div>
                            <div className="text-sm text-secondary mt-1">{items || 'Menu not published yet.'}</div>
                          </div>
                        </div>
                        {alreadyOrdered ? (
                          <span className="inline-flex items-center gap-1 text-success text-xs font-bold bg-success-bg px-3 py-2 rounded-[var(--radius-md)] shrink-0">
                            <CheckCircle className="w-4 h-4" /> Ordered
                          </span>
                        ) : (
                          <button
                            onClick={() => void orderMeal(mealType)}
                            disabled={ordering === mealType}
                            className="px-4 py-2 bg-success text-white text-sm rounded-[var(--radius-md)] font-bold shadow-sm hover:bg-green-600 transition-colors shrink-0 disabled:opacity-60"
                          >
                            {ordering === mealType ? 'Booking...' : 'Book Meal'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <Utensils className="w-14 h-14 text-secondary mb-3 opacity-30" />
                  <div className="font-bold text-primary">Today&apos;s menu is not published yet</div>
                  <p className="text-sm text-secondary mt-1">Your PG has not published today&apos;s mess menu.</p>
                </div>
              )
            ) : null}

{activeTab === 'weekly' ? (
              hasWeekMenu ? (
                <div className="space-y-3">
                  {Object.entries(weekMenu as Record<string, Record<string, string>>).map(([day, meals]) => (
                    <div key={day} className="bg-page border border-border rounded-[var(--radius-md)] p-4">
                      <div className="font-black text-primary text-sm uppercase tracking-wide mb-2">{day}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div><span className="font-bold text-secondary">Breakfast:</span> <span className="text-primary">{meals.breakfast || '—'}</span></div>
                        <div><span className="font-bold text-secondary">Lunch:</span> <span className="text-primary">{meals.lunch || '—'}</span></div>
                        <div><span className="font-bold text-secondary">Dinner:</span> <span className="text-primary">{meals.dinner || '—'}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <CalendarDays className="w-14 h-14 text-secondary mb-3 opacity-30" />
                  <div className="font-bold text-primary">Weekly menu not published</div>
                  <p className="text-sm text-secondary mt-1">The weekly schedule appears here once your PG publishes it.</p>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {showRecharge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-[var(--radius-lg)] shadow-2xl p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-black text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Zap className="w-5 h-5 text-warning" /> Add Wallet Credit
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="mess-recharge-amount" className="block text-sm font-bold text-secondary uppercase mb-2">Amount (₹)</label>
                <input
                  id="mess-recharge-amount"
                  type="number"
                  min="1"
                  onKeyDown={e => { if (['-', 'e', 'E', '+', '.'].includes(e.key)) e.preventDefault(); }}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] font-bold text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2 pt-2">
                {RECHARGE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="flex-1 py-2 border border-border rounded-[var(--radius-md)] text-sm font-bold text-secondary hover:bg-primary-subtle hover:text-primary hover:border-primary transition-colors"
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowRecharge(false)} className="flex-1 px-4 py-3 bg-input text-primary rounded-[var(--radius-md)] font-bold hover:bg-border transition-colors">Cancel</button>
              <button onClick={() => void handleRecharge()} className="flex-1 px-4 py-3 bg-warning text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-yellow-600 transition-colors">Add ₹{amount || 0}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
