'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export function FAQSection() {
  const faqs = [
    {
      q: "What is PG Management System?",
      a: "PG Management System is a complete software solution that helps PG owners, managers, and students manage all aspects of PG/hostel operations efficiently."
    },
    {
      q: "Is it free to start?",
      a: "Yes! We offer a 14-day free trial with all features. No credit card required."
    },
    {
      q: "Can I manage multiple PGs from one account?",
      a: "Yes! All plans support multiple PG management. The number depends on your selected plan."
    },
    {
      q: "Is there a mobile app?",
      a: "Yes! We have mobile apps for iOS and Android. Students can use it for payments, complaints, and more."
    },
    {
      q: "How secure is my data?",
      a: "We use bank-grade encryption, secure servers, and regular backups. Your data is 100% safe with us."
    },
    {
      q: "Can I customize the system for my needs?",
      a: "Yes! Enterprise and Custom plans offer full customization. We can add custom features as per your requirements."
    },
    {
      q: "What support do you provide?",
      a: "24/7 email, chat, and phone support. We also provide onboarding assistance and training."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes! No long-term contracts. Cancel anytime without any cancellation fees."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-4 bg-white" style={{ backgroundColor: 'var(--primary-white)' }}>
      <div className="max-w-[800px] mx-auto">
        <h2 className="section-header text-center">❓ Frequently Asked Questions</h2>
        <p className="section-subheader text-center mb-12">Everything you need to know about the product</p>
        
        <div className="space-y-4 mb-10">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-lg overflow-hidden fade-in" style={{ borderColor: 'rgba(0,0,0,0.1)', animationDelay: `${i * 0.05}s` }}>
              <button 
                className="w-full px-6 py-4 flex items-center justify-between bg-white text-left font-semibold transition-colors"
                style={{ color: 'var(--primary-navy)' }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex gap-3">
                  <span style={{ color: 'var(--primary-teal)' }}>❓</span>
                  {faq.q}
                </div>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-[var(--text-medium)]" /> : <ChevronDown className="w-5 h-5 text-[var(--text-medium)]" />}
              </button>
              
              {openIndex === i && (
                <div className="px-6 pb-4 pt-2 bg-white flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                  <span style={{ color: 'var(--primary-gold)' }}>💡</span>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/faq" className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80" style={{ color: 'var(--primary-navy)' }}>
            📚 View All FAQs &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
