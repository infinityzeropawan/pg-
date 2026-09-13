'use client';

// RESPONSIBILITY: Renders the OwnerSubscriptionMain component. Receives data via props/hooks.

import { teamApi } from '@/app/owner/owner_lib/owner_api/OwnerTeam';
import { propertiesApi } from '@/app/owner/owner_lib/owner_api/OwnerProperties';
import { ownersApi } from '@/app/owner/owner_lib/owner_api/owners';
import { studentsApi } from '@/app/owner/owner_lib/owner_api/OwnerStudents';
import { plansApi } from '@/app/owner/owner_lib/owner_api/OwnerPlans';
import { useState, useEffect } from 'react';

import { authApi } from '@/app/owner/owner_lib/owner_api/OwnerAuth';

import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';

import { toast } from 'sonner';
import { Crown, CheckCircle2, Building, Users, Bed, CreditCard, ShieldCheck, Loader2, X, AlertCircle } from 'lucide-react';

import { OwnerSubscriptionPaymentModal } from './OwnerSubscriptionPaymentModal';

export function OwnerSubscriptionMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  
  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Form State
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const loadSubscriptionData = () => {
    if (!user) return;
    setLoading(true);
    
    // Fetch owner and plan data
// @ts-expect-error
    const ownerRecord = ownersApi.listOwners().find((o: unknown) => o.userId === user.id);
    const plans = plansApi.listPlans() || [];
    
    const activePlan = ownerRecord?.planId && ownerRecord.planId !== 'none' && ownerRecord.planId !== 'None' 

      ? plans.find((p: any) => p.id === ownerRecord.planId || `plan_${p.id}` === ownerRecord.planId || p.id === `plan_${ownerRecord.planId}`)
      : null;

    // Actual usage logic:
    const propsCount = propertiesApi.listByOwner(user.id).length;
    const staffCount = teamApi.listByOwner(user.id).length;
    const studentsCount = studentsApi.listByOwner(user.id).length; 

    setAllPlans(plans);
    setData({
      ownerRecord,
      plan: activePlan,
      usage: {
        properties: propsCount,
        staff: staffCount,
        students: studentsCount
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    loadSubscriptionData();
  }, [user?.id]);

  const handleOpenPaymentModal = (plan: unknown) => {
    setSelectedPlan(plan);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (planId: string) => {
    try {
      ownersApi.upgradePlan(data.ownerRecord.id, planId);
      toast.success('Payment successful! Your plan has been upgraded.');
      setPaymentModalOpen(false);
      loadSubscriptionData();
    } catch (err: any) {
      toast.error(err.message || 'Payment processing failed.');
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full motion-safe:animate-spin"></div>
      </div>
    );
  }

  const { plan, usage } = data;

  const getMeterColor = (current: number, max: number) => {
    const ratio = max === 0 ? 0 : current / max;
    if (ratio >= 0.9) return 'bg-danger';
    if (ratio >= 0.75) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="pb-20 space-y-10 animate-in fade-in motion-safe:duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Subscription & Billing</h1>
          <p className="text-[12px] font-medium text-secondary mt-1">Manage your plan, quotas, and billing</p>
        </div>
      </div>

      {/* Active Plan & Usage */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Current Plan Overview */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-subtle rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-primary">Current Plan</h2>
                <div className="text-[14px] text-primary font-semibold">{plan ? plan.name : 'No Active Plan'}</div>
              </div>
            </div>
            
            {plan ? (
              <p className="text-sm text-secondary mb-6 leading-relaxed">
                You are currently on the {plan.name} plan. This plan allows you to manage up to {plan.maxProperties === 999 ? 'Unlimited' : plan.maxProperties} properties and {plan.maxBeds === 9999 ? 'Unlimited' : plan.maxBeds} beds.
              </p>
            ) : (
              <p className="text-sm text-secondary mb-6 leading-relaxed">
                You do not have an active plan. Please purchase a subscription to unlock PG management features.
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-secondary">Status</span>
                <span className={`font-semibold flex items-center gap-1 ${plan ? 'text-success' : 'text-danger'}`}>
                  {plan ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {plan ? 'Active' : 'Inactive - Pending Purchase'}
                </span>
              </div>
              {plan && (
                <>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="flex flex-col">
                    <span className="text-secondary">Billing Cycle</span>
                    <span className="font-semibold text-primary">Monthly</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Usage Meters */}
          <div className="space-y-5 bg-page p-5 rounded-md border border-border">
            <h3 className="font-semibold text-[14px] text-primary mb-4">Resource Usage</h3>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-secondary flex items-center gap-1"><Building className="w-3 h-3"/> Properties</span>
                <span className="font-medium text-primary">{usage.properties} / {plan ? (plan.maxProperties === 999 ? '∞' : plan.maxProperties) : 0}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getMeterColor(usage.properties, plan?.maxProperties || 0)} motion-safe:transition-all duration-500`} 
                     style={{ width: `${Math.min(100, plan && plan.maxProperties > 0 ? (usage.properties / plan.maxProperties) * 100 : 0)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-secondary flex items-center gap-1"><Users className="w-3 h-3"/> Staff Accounts</span>
                <span className="font-medium text-primary">{usage.staff} / {plan ? (plan.maxStaff === 999 ? '∞' : plan.maxStaff) : 0}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getMeterColor(usage.staff, plan?.maxStaff || 0)} motion-safe:transition-all duration-500`} 
                     style={{ width: `${Math.min(100, plan && plan.maxStaff > 0 ? (usage.staff / plan.maxStaff) * 100 : 0)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* Pricing / Upgrade Plans Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-[22px] font-bold text-primary mb-2">Upgrade Your Plan</h2>
          <p className="text-[14px] text-secondary">
            Unlock more properties, higher staff limits, and advanced features by upgrading to a higher tier plan. Payments are processed securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(allPlans || []).map((p: any) => {
            const isActive = plan?.id === p.id;

            return (
              <div 
                key={p.id} 
                className={`relative bg-card border rounded-lg p-6 flex flex-col motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl
                  ${isActive ? 'border-primary shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'border-border'}
                `}
              >
                {/* Active Badge */}
                {isActive && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Current Plan
                  </div>
                )}

                <div className="text-center mb-6 pt-2">
                  <h3 className="text-[18px] font-bold text-primary mb-2">{(p as any).name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[28px] font-bold text-primary">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-[13px] text-secondary">/mo</span>
                  </div>
                </div>

                {/* Plan Limits */}
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3 text-[14px] text-secondary">
                    <Building className="w-4 h-4 text-primary" />
                    <span>Up to <strong>{p.maxProperties === 999 ? 'Unlimited' : p.maxProperties}</strong> Properties</span>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] text-secondary">
                    <Bed className="w-4 h-4 text-primary" />
                    <span>Up to <strong>{p.maxBeds === 9999 ? 'Unlimited' : p.maxBeds}</strong> Beds</span>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] text-secondary">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Up to <strong>{p.maxStaff === 999 ? 'Unlimited' : p.maxStaff}</strong> Staff</span>
                  </div>
                  
                  {/* Features */}
                  {(p.features || []).map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-[14px] text-secondary">
                      <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span className="capitalize">{feat.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleOpenPaymentModal(p)}
                  disabled={isActive}
                  className={`w-full py-3 px-4 rounded-md text-[14px] font-bold flex items-center justify-center gap-2 motion-safe:transition-all
                    ${isActive 
                      ? 'bg-page text-secondary border border-border cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-hover hover:shadow-lg'
                    }
                  `}
                >
                  {isActive ? (
                    'Current Plan'
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Pay ₹{p.price.toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payment Modal */}
      {paymentModalOpen && selectedPlan && (
        <OwnerSubscriptionPaymentModal
          selectedPlan={selectedPlan}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
}
