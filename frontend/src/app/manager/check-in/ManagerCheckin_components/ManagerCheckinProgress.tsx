// @ts-nocheck
// RESPONSIBILITY: Renders the ManagerCheckinProgress component.
import { MANAGER_CHECKIN_WIZARD_STEPS } from '@/app/manager/check-in/ManagerCheckin_utils/ManagerCheckin.constants';
interface Props {
  step: number;
}
export function ManagerCheckinProgress({ step }: Props) {
  return (
    <div className="flex items-center justify-between overflow-x-auto pb-4 scrollbar-hide">
      {MANAGER_CHECKIN_WIZARD_STEPS.map((s) => {
        const Icon = s.icon;
        const isActive = s.id === step;
        const isPassed = s.id < step;
        return (
          <div key={s.id} className="flex flex-col items-center gap-2 min-w-[64px]">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 motion-safe:transition-colors ${
              isActive ? 'border-primary bg-primary-subtle text-primary' : 
              isPassed ? 'border-success bg-success text-white' : 
              'border bg-input text-secondary'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-medium hidden sm:block ${isActive ? 'text-primary' : 'text-secondary'}`}>
              {s.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}