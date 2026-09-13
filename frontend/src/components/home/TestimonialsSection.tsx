'use client';
import { Star } from 'lucide-react';
import Link from 'next/link';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "This system transformed my PG management. Rent collection is now easy and automated!",
      author: "Rajesh Kumar",
      role: "PG Owner",
      company: "Green Valley PG"
    },
    {
      quote: "Managing my PG business has never been easier! The dashboard is incredibly intuitive.",
      author: "Priya Singh",
      role: "PG Manager",
      company: "Sunshine Hostel"
    },
    {
      quote: "The student app makes it so easy to pay rent and track meals! Love it.",
      author: "Amit Sharma",
      role: "Student",
      company: "ABC College"
    },
    {
      quote: "Kitchen management has become so much simpler with this tool!",
      author: "Chef Ravi",
      role: "Cook",
      company: "Foodie Kitchen"
    },
    {
      quote: "The analytics and reports help me make better business decisions!",
      author: "Ananya Reddy",
      role: "PG Owner",
      company: "MyStay PG"
    },
    {
      quote: "Finally, a system that actually works for all of us! Very highly recommended.",
      author: "Vikram Singh",
      role: "Student",
      company: "City Hostel"
    }
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="section-header">⭐ What Our Users Say</h2>
        <p className="section-subheader">Join thousands of satisfied users managing their PGs efficiently</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="card home-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-current" style={{ color: 'var(--primary-gold)' }} />
                ))}
              </div>
              <p className="mb-6 italic" style={{ color: 'var(--text-dark)' }}>"{testimonial.quote}"</p>
              <div>
                <p className="font-bold" style={{ color: 'var(--primary-navy)' }}>{testimonial.author}</p>
                <p className="text-sm" style={{ color: 'var(--text-medium)' }}>{testimonial.role}</p>
                <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--primary-teal)' }}>{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/testimonials" className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80" style={{ color: 'var(--primary-navy)' }}>
            📝 Read All Testimonials <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
