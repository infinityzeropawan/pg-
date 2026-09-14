// RESPONSIBILITY: Business logic + state for the Student Feedback screen.
// DATA FLOW: POST /api/v1/student/feedback -> useStudentFeedback -> StudentFeedbackMain

'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export interface FeedbackRatings {
  cleanliness: number;
  food: number;
  staff: number;
}

export interface UseStudentFeedbackResult {
  submitting: boolean;
  submitFeedback: (ratings: FeedbackRatings, text: string, anonymous: boolean) => Promise<void>;
}

export function useStudentFeedback(): UseStudentFeedbackResult {
  const { profile } = useStudentContext();
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = useCallback(
    async (ratings: FeedbackRatings, text: string, _anonymous: boolean) => {
      if (!profile) {
        toast.error('You must be logged in to submit feedback.');
        return;
      }
      if (ratings.cleanliness === 0 || ratings.food === 0 || ratings.staff === 0) {
        toast.error('Please provide all ratings before submitting.');
        return;
      }
      setSubmitting(true);
      try {
        // Bundle the star ratings and free-text into the ticket description
        const description = [
          `Cleanliness: ${ratings.cleanliness}/5`,
          `Food Quality: ${ratings.food}/5`,
          `Staff Behavior: ${ratings.staff}/5`,
          '',
          `Detailed feedback: ${text || 'No additional comments'}`,
        ].join('\n');

        await studentOperationsApi.submitFeedback({
          title: 'PG Feedback & Ratings',
          description,
          priority: ratings.cleanliness <= 2 || ratings.food <= 2 || ratings.staff <= 2
            ? 'HIGH'
            : 'MEDIUM',
        });
        toast.success('Feedback submitted successfully. Thank you!');
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to submit feedback.');
      } finally {
        setSubmitting(false);
      }
    },
    [profile]
  );

  return { submitting, submitFeedback };
}
