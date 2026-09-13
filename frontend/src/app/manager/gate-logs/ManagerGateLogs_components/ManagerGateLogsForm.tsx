// RESPONSIBILITY: Renders the ManagerGateLogsForm component.
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GateLogFormSchema } from '@/app/manager/gate-logs/ManagerGateLogs_types/ManagerGateLogs.types';
import type { GateLogFormData } from '@/app/manager/gate-logs/ManagerGateLogs_types/ManagerGateLogs.types';

interface ManagerGateLogsFormProps {
  students?: any[];
  handleAdd: (
    studentId: string, 
    type: 'entry' | 'exit', 
    isLate: boolean,
    reason?: string,
    destination?: string,
    expectedReturnTime?: string
  ) => void;
}

const COMMON_REASONS = [
  'College / Classes',
  'Coaching / Library',
  'Market / Shopping',
  'Food / Dining',
  'Gym / Sports',
  'Medical / Doctor',
  'Home Visit',
  'Work / Internship',
  'Other Purpose'
];

export function ManagerGateLogsForm({ students = [], handleAdd }: ManagerGateLogsFormProps) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<GateLogFormData>({
    resolver: zodResolver(GateLogFormSchema) as any,
    defaultValues: { 
      studentId: '', 
      type: 'entry', 
      isLate: false, 
      reason: 'College / Classes',
      destination: '',
      expectedReturnTime: '06:00 PM'
    },
  });

  const watchedType = watch('type');

  const onSubmit = (data: GateLogFormData) => {
    handleAdd(
      data.studentId, 
      data.type, 
      data.isLate, 
      data.reason, 
      data.destination, 
      data.expectedReturnTime
    );
    reset({ 
      studentId: '', 
      type: 'entry', 
      isLate: false, 
      reason: 'College / Classes',
      destination: '',
      expectedReturnTime: '06:00 PM'
    });
  };

  return (
    <div className="bg-card border border-border p-5 rounded-[var(--radius-lg,12px)] shadow-sm sticky top-6">
      <h2 className="font-bold text-base text-primary mb-1">Manual Gate Entry</h2>
      <p className="text-xs text-secondary mb-4">Record resident entry/exit on their behalf.</p>
      
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-1">Select Resident</label>
          {students.length > 0 ? (
            <select
              {...register('studentId')}
              className="w-full bg-input border border-border px-3 py-2 rounded-lg text-xs text-primary focus:outline-none focus:border-primary font-medium"
            >
              <option value="">-- Choose Resident --</option>
              {students.map(s => (
                <option key={s.profile.id} value={s.profile.id}>
                  {s.user.name} ({s.roomNumber ? `Room ${s.roomNumber}` : 'Unassigned'})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              {...register('studentId')}
              placeholder="Enter Student ID (e.g. stu_123)"
              className="w-full bg-input border border-border px-3 py-2 rounded-lg text-xs text-primary focus:outline-none focus:border-primary"
            />
          )}
          {errors.studentId && <p className="text-xs text-danger mt-1">{errors.studentId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-1">Movement</label>
          <select
            {...register('type')}
            className="w-full bg-input border border-border px-3 py-2 rounded-lg text-xs text-primary focus:outline-none focus:border-primary font-medium"
          >
            <option value="entry">🟢 Check-In (Entering PG)</option>
            <option value="exit">🔴 Check-Out (Leaving PG)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-1">Reason / Category</label>
          <select
            {...register('reason')}
            className="w-full bg-input border border-border px-3 py-2 rounded-lg text-xs text-primary focus:outline-none focus:border-primary font-medium"
          >
            {COMMON_REASONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-1">Destination / Notes</label>
          <input
            type="text"
            {...register('destination')}
            placeholder="e.g. City Library"
            className="w-full bg-input border border-border px-3 py-2 rounded-lg text-xs text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {watchedType === 'exit' && (
          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">Expected Return Time</label>
            <input
              type="text"
              {...register('expectedReturnTime')}
              placeholder="e.g. 07:30 PM"
              className="w-full bg-input border border-border px-3 py-2 rounded-lg text-xs text-primary focus:outline-none focus:border-primary"
            />
          </div>
        )}

        {watchedType === 'entry' && (
          <label className="flex items-center gap-2 cursor-pointer text-xs text-primary pt-1">
            <input
              type="checkbox"
              {...register('isLate')}
              className="accent-rose-500 w-4 h-4 rounded"
            />
            <span className="font-semibold text-rose-600">Flag as Late / Past Curfew</span>
          </label>
        )}

        <button 
          type="submit" 
          className="w-full py-2.5 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider mt-2 hover:bg-primary-hover active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          Record {watchedType === 'entry' ? 'Check-In' : 'Check-Out'}
        </button>
      </form>
    </div>
  );
}