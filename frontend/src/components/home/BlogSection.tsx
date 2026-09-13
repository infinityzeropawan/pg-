'use client';
import Link from 'next/link';

export function BlogSection() {
  const blogs = [
    {
      icon: "📝",
      title: "How to Increase PG Occupancy by 30%",
      date: "5th Sep 2024",
      readTime: "4 min read",
      type: "Article",
      cta: "Read More"
    },
    {
      icon: "📊",
      title: "5 Tips to Reduce PG Operational Costs",
      date: "2nd Sep 2024",
      readTime: "6 min read",
      type: "Article",
      cta: "Read More"
    },
    {
      icon: "🎯",
      title: "The Future of PG Management in India",
      date: "28th Aug 2024",
      readTime: "5 min read",
      type: "Article",
      cta: "Read More"
    },
    {
      icon: "🎥",
      title: "Video: How to Setup Your PG on Our Platform",
      date: "25th Aug 2024",
      readTime: "12 mins",
      type: "Duration",
      cta: "Watch Now"
    },
    {
      icon: "📋",
      title: "Complete Guide for First-Time PG Owners",
      date: "Free PDF",
      readTime: "25 pages",
      type: "Download",
      cta: "Download"
    },
    {
      icon: "📖",
      title: "Case Study: How ABC PG Increased Revenue by 40%",
      date: "20th Aug 2024",
      readTime: "8 min read",
      type: "Article",
      cta: "Read More"
    }
  ];

  return (
    <section id="blog" className="py-20 px-4" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="section-header text-center">📚 Latest Resources & Blog</h2>
        <p className="section-subheader text-center mb-12">Insights, guides, and tips to grow your PG business</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog, i) => (
            <div key={i} className="card home-card flex flex-col fade-in hover-lift" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-4">{blog.icon}</div>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--primary-navy)', minHeight: '56px' }}>
                {blog.title}
              </h3>
              
              <div className="flex justify-between items-center text-sm mb-6 pb-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-medium)' }}>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-xs">{blog.type === 'Download' ? 'Download:' : blog.type === 'Duration' ? 'Duration:' : 'Published:'}</span>
                  <span>{blog.date}</span>
                </div>
                <div className="text-right">
                  <span>{blog.readTime}</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link href={`/blog/${i}`} className="inline-flex items-center gap-2 font-semibold transition-colors hover:text-[var(--primary-navy)]" style={{ color: 'var(--primary-teal)' }}>
                  {blog.cta} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/resources" className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80" style={{ color: 'var(--primary-navy)' }}>
            📝 View All Resources &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
