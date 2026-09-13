// RESPONSIBILITY: Renders the OwnerTeamCreateManagerPermissions component. Receives data via props/hooks.

export interface OwnerTeamCreateManagerPermissionsProps {
  formData: any;
  handlePermissionToggle: (key: unknown) => void;
}

export function OwnerTeamCreateManagerPermissions({ formData, handlePermissionToggle }: OwnerTeamCreateManagerPermissionsProps) {
  if ((formData as any).roleType !== 'manager') return null;

  return (
    <div className="bg-card border border-primary rounded-lg overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.1)]">
      <div className="p-4 border-b border-primary-subtle bg-[rgba(99,102,241,0.05)]">
        <h2 className="text-base font-semibold text-primary">Manager Permissions</h2>
        <p className="text-xs text-secondary mt-0.5">Control what this manager can do inside the Manager Portal.</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'canEditRent', label: 'Edit Rent Amounts', desc: 'Allow manager to modify monthly rent during check-in.' },
            { key: 'canCollectCash', label: 'Collect Cash Payments', desc: 'Allow manager to log manual cash/UPI receipts.' },
            { key: 'canAddExpense', label: 'Add Expenses', desc: 'Allow manager to record property maintenance expenses.' },
            { key: 'canOnboardStudent', label: 'Onboard Students', desc: 'Allow manager to add new students to the system.' },
            { key: 'canBroadcast', label: 'Send Broadcasts', desc: 'Allow manager to send announcements to all students.' }
          ].map(perm => (
            <label key={perm.key} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-page cursor-pointer hover:border-primary-subtle motion-safe:transition-colors">
              <input 
                type="checkbox"
                className="mt-1 accent-[var(--primary)] w-4 h-4"
                checked={!!(formData as any).permissions?.[perm.key]}
                onChange={() => handlePermissionToggle(perm.key)}
              />
              <div>
                <div className="font-semibold text-sm text-primary">{perm.label}</div>
                <div className="text-[11px] text-secondary mt-0.5">{perm.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
