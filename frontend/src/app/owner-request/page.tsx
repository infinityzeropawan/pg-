'use client';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { Navbar } from '@/app/(public)/_components/Navbar';
import { authApi as api } from '@/app/owner-request/owner-request_lib/owner-request_api/OwnerRequestAuth';

export default function OwnerRequestPage() {
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const plans = [
    { id: 'basic', name: 'Basic', price: '₹999/mo', desc: 'Perfect for single PG owners.', features: ['1 Property', 'Up to 50 Beds', 'Basic Student Portal', 'Email Support'] },
    { id: 'pro', name: 'Pro', price: '₹2,499/mo', desc: 'For growing operators.', features: ['Up to 3 Properties', 'Up to 200 Beds', 'Advanced Finance', 'Priority Support'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', desc: 'For large networks.', features: ['Unlimited Properties', 'Unlimited Beds', 'White-labeled App', 'Dedicated Manager'] }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    api.ownerRequests.create({
      name: fd.get('name') as string,
      businessName: fd.get('businessName') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      city: fd.get('city') as string,
      pgCount: Number(fd.get('pgCount')),
      bedCount: Number(fd.get('bedCount')),
      planId: selectedPlan,
      gst: fd.get('gst') as string,
      message: fd.get('message') as string,
    });
    
// @ts-expect-error
    api.audit.write({
      actorId: 'public',
      actorRole: 'superadmin', // Anonymous/System
      action: 'OWNER_REQUEST_SUBMITTED',
      entity: 'owner_request',
      entityId: 'new'
    });
    
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        {success ? (
          <div className="bg-card p-12 rounded-3xl border border shadow-sm text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">✓</div>
            <h2 className="text-3xl font-bold text-primary mb-4">Request bhej di gayi.</h2>
            <p className="text-secondary text-lg">SuperAdmin ise review karenge aur aapse jald hi contact karenge.</p>
          </div>
        ) : (
          <div className="bg-card p-8 rounded-3xl border border shadow-sm">
            <h1 className="text-3xl font-bold text-primary mb-2">Partner with SmartPG</h1>
            <p className="text-secondary mb-8">Fill the details below to request your PG Owner account.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Full Name *</label>
                  <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Business / PG Name *</label>
                  <input required name="businessName" type="text" className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Email *</label>
                  <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Phone *</label>
                  <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">City *</label>
                  <input required name="city" type="text" className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">GST (Optional)</label>
                  <input name="gst" type="text" className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Total PGs *</label>
                  <input required name="pgCount" type="number" min="1" className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Total Beds *</label>
                  <input required name="bedCount" type="number" min="1" className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" />
                </div>
              </div>

              {/* PLAN SELECTION */}
              <div className="pt-6 border-t border">
                <label className="block text-xl font-bold text-primary mb-6">Select Your Plan *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`cursor-pointer rounded-2xl p-6 border-2 motion-safe:transition-all ${selectedPlan === p.id ? 'border-primary bg-primary-subtle shadow-md relative' : 'border bg-page hover:border-indigo-300'}`}
                    >
                      {selectedPlan === p.id && <div className="absolute -top-3 -right-3 bg-success text-white rounded-full p-1"><CheckCircle2 className="w-5 h-5"/></div>}
                      <h3 className="text-lg font-bold text-primary">{(p as any).name}</h3>
                      <div className="text-2xl font-black text-primary my-2">{p.price}</div>
                      <p className="text-xs text-secondary mb-4 h-8">{p.desc}</p>
                      <ul className="space-y-2">
                        {p.features.map((f, i) => (
// @ts-expect-error
                          <li key={f.id || f.name || f.title || i} className="text-xs font-medium text-primary flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border">
                <label className="block text-sm font-bold text-primary mb-2">Message</label>
                <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border focus:ring-2 focus:ring-primary outline-none motion-safe:transition-all" placeholder="Tell us more about your requirements..."></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 motion-safe:transition-colors shadow-lg hover:-translate-y-0.5">
                Submit Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
