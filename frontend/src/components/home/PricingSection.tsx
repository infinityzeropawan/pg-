'use client';
import { Check } from 'lucide-react';
import Link from 'next/link';

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      icon: "💡",
      price: "₹999",
      period: "/month",
      desc: "Perfect for small PGs",
      features: [
        "Up to 5 PG",
        "100 Students",
        "Basic Reports",
        "Email Support",
        "1 Staff Role",
        "Basic Security"
      ],
      cta: "Start Free",
      btnClass: "btn-outline",
      popular: false
    },
    {
      name: "Pro",
      icon: "🚀",
      price: "₹1,999",
      period: "/month",
      desc: "Ideal for growing PGs",
      features: [
        "Up to 15 PG",
        "500 Students",
        "Advanced Reports",
        "Priority Support",
        "Mobile App",
        "5 Staff Roles",
        "Advanced Security",
        "WhatsApp Integ."
      ],
      cta: "Start Free",
      btnClass: "btn-gold",
      popular: true
    },
    {
      name: "Enterprise",
      icon: "🏢",
      price: "Custom",
      period: " Pricing",
      desc: "For large PG chains",
      features: [
        "Unlimited PG",
        "Unlimited Students",
        "Custom Reports",
        "24/7 Support",
        "Dedicated Manager",
        "API Access",
        "White Label",
        "Custom Integ."
      ],
      cta: "Contact Us",
      btnClass: "btn-navy",
      popular: false
    },
    {
      name: "Custom",
      icon: "🎯",
      price: "Contact",
      period: " Us",
      desc: "Tailored solutions",
      features: [
        "Custom features",
        "Dedicated support",
        "SLA based",
        "Training included",
        "API Access",
        "White Label"
      ],
      cta: "Contact",
      btnClass: "btn-outline",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-white" style={{ backgroundColor: 'var(--primary-white)' }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="section-header">💲 Simple & Transparent Pricing</h2>
        <p className="section-subheader">Choose the right plan for your PG business</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan, i) => (
            <div key={i} className={`card home-card flex flex-col relative fade-in ${plan.popular ? 'border-2' : ''}`} 
                 style={{ 
                   borderColor: plan.popular ? 'var(--primary-gold)' : 'transparent',
                   animationDelay: `${i * 0.1}s`,
                   transform: plan.popular ? 'scale(1.05)' : 'none',
                   zIndex: plan.popular ? 10 : 1
                 }}>
              
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" 
                     style={{ background: 'var(--primary-gold)', color: 'var(--primary-white)' }}>
                  Most Popular
                </div>
              )}
              
              <div className="mb-6 text-center">
                <div className="text-3xl mb-2">{plan.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--primary-navy)' }}>{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold" style={{ color: 'var(--primary-teal)' }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--text-medium)' }}>{plan.period}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-medium)' }}>{plan.desc}</p>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-medium)' }}>
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary-teal)' }} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <button className={`w-full ${plan.btnClass}`}>
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center mt-12 fade-in">
          <div className="bg-[var(--bg-light)] p-6 rounded-xl text-sm" style={{ color: 'var(--text-dark)' }}>
            <p className="font-bold mb-2">💡 All plans include:</p>
            <div className="flex flex-wrap justify-center gap-4 text-[var(--text-medium)]">
              <span>• 14-day free trial</span>
              <span>• No hidden charges</span>
              <span>• Cancel anytime</span>
              <span>• GST extra as applicable</span>
              <span>• Free onboarding support</span>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/pricing-details" className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80" style={{ color: 'var(--primary-teal)' }}>
              🔄 Compare all plans &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
