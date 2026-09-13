'use client';

// RESPONSIBILITY: Renders the Student Feedback UI.

import { useState } from 'react';
import { Star, Send, ShieldAlert, Sparkles, Utensils, Users } from 'lucide-react';
import { toast } from 'sonner';

export function StudentFeedbackMain() {
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    food: 0,
    staff: 0
  });
  const [feedbackText, setFeedbackText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratings.cleanliness === 0 || ratings.food === 0 || ratings.staff === 0) {
      toast.error('Please provide all ratings before submitting.');
      return;
    }
    toast.success('Feedback submitted successfully. Thank you!');
    setRatings({ cleanliness: 0, food: 0, staff: 0 });
    setFeedbackText('');
    setIsAnonymous(false);
  };

  const renderStars = (category: keyof typeof ratings) => {
    return (
      <div className="flex gap-2 w-full h-full">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-all hover:scale-110 ${ratings[category] >= star ? 'fill-warning text-warning drop-shadow-sm' : 'text-border hover:text-warning/50'}`}
            onClick={() => setRatings({ ...ratings, [category]: star })}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          ⭐ Feedback & Ratings
        </h1>
        <p className="text-sm text-secondary mt-1">Help us improve by providing your honest feedback.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-sm space-y-8">
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-[var(--radius-md)] bg-input/30 hover:border-primary/50 transition-colors">
            <div>
              <div className="font-bold text-primary flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-info" /> PG Cleanliness
              </div>
              <div className="text-xs text-secondary mt-1">Rate the hygiene of rooms, washrooms, and common areas.</div>
            </div>
            {renderStars('cleanliness')}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-[var(--radius-md)] bg-input/30 hover:border-primary/50 transition-colors">
            <div>
              <div className="font-bold text-primary flex items-center gap-2 text-lg">
                <Utensils className="w-5 h-5 text-success" /> Mess Food Quality
              </div>
              <div className="text-xs text-secondary mt-1">Rate the taste, variety, and quality of food.</div>
            </div>
            {renderStars('food')}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-[var(--radius-md)] bg-input/30 hover:border-primary/50 transition-colors">
            <div>
              <div className="font-bold text-primary flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-purple" /> Warden / Staff Behavior
              </div>
              <div className="text-xs text-secondary mt-1">Rate the helpfulness and behavior of the PG staff.</div>
            </div>
            {renderStars('staff')}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-2">Detailed Feedback (Optional)</label>
          <textarea 
            rows={4} 
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tell us more about your experience or specific areas of improvement..." 
            className="w-full bg-input border border-border px-4 py-3 rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-primary text-primary resize-none"
          ></textarea>
        </div>

        <div className="flex items-center gap-3 p-4 bg-warning-bg/30 border border-warning/20 rounded-[var(--radius-md)]">
          <input 
            type="checkbox" 
            id="anonymous" 
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-5 h-5 accent-warning cursor-pointer" 
          />
          <div>
            <label htmlFor="anonymous" className="font-bold text-primary cursor-pointer text-sm">Submit Anonymously</label>
            <p className="text-xs text-secondary">Your name and room details will not be shared with the management.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Submit Feedback
          </button>
        </div>

      </form>

    </div>
  );
}
