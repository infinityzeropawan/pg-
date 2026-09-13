// RESPONSIBILITY: Renders the OwnerTeamCreateCredentials component. Receives data via props/hooks.

export interface OwnerTeamCreateCredentialsProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function OwnerTeamCreateCredentials({ formData, setFormData }: OwnerTeamCreateCredentialsProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)]">
        <h2 className="text-base font-semibold text-primary">Login Credentials</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary">Login Email *</label>
          <input 
            required type="email" placeholder="e.g. rahul@pg.com"
// @ts-expect-error
            value={(formData as any).email} onChange={e => setFormData((p: unknown) => ({...p, email: e.target.value}))}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary">Temporary Password *</label>
          <input 
            required type="text" placeholder="e.g. Staff@123" minLength={6}
// @ts-expect-error
            value={(formData as any).password} onChange={e => setFormData((p: unknown) => ({...p, password: e.target.value}))}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
          />
          <p className="text-xs text-secondary mt-1">They will be forced to change this upon first login.</p>
        </div>
      </div>
    </div>
  );
}
