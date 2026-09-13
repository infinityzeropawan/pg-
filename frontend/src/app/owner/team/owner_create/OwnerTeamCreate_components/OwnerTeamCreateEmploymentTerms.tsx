// RESPONSIBILITY: Renders the OwnerTeamCreateEmploymentTerms component. Receives data via props/hooks.

export interface OwnerTeamCreateEmploymentTermsProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function OwnerTeamCreateEmploymentTerms({ formData, setFormData }: OwnerTeamCreateEmploymentTermsProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)]">
        <h2 className="text-base font-semibold text-primary">Employment Terms</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary">Monthly Salary (₹)</label>
          <input 
            required type="number" min="0"
// @ts-expect-error
            value={(formData as any).salary} onChange={e => setFormData((p: unknown) => ({...p, salary: parseInt(e.target.value)||0}))}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary">Join Date</label>
          <input 
            required type="date"
// @ts-expect-error
            value={(formData as any).joinDate} onChange={e => setFormData((p: unknown) => ({...p, joinDate: e.target.value}))}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary">Working Shift</label>
          <select
// @ts-expect-error
            value={(formData as any).shift} onChange={e => setFormData((p: unknown) => ({...p, shift: e.target.value as unknown}))}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>
    </div>
  );
}
