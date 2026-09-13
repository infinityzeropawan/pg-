// RESPONSIBILITY: Renders the OwnerTeamCreatePropertyAssignment component. Receives data via props/hooks.

export interface OwnerTeamCreatePropertyAssignmentProps {
  properties: unknown[];
  formData: any;
  handlePropertyToggle: (propId: string) => void;
}

export function OwnerTeamCreatePropertyAssignment({ properties, formData, handlePropertyToggle }: OwnerTeamCreatePropertyAssignmentProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)]">
        <h2 className="text-base font-semibold text-primary">Property Assignment</h2>
        <p className="text-xs text-secondary mt-0.5">Select which properties this staff member can access.</p>
      </div>
      <div className="p-6">
        {properties.length === 0 ? (
          <p className="text-sm text-danger">You have no properties. Please create a property first.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {properties.map(prop => (
              <label key={(prop as any).id} className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer motion-safe:transition-colors ${
                (formData as any).assignedPropertyIds.includes((prop as any).id)
                  ? 'border-primary bg-primary-subtle'
                  : 'border-border bg-input hover:border-primary-subtle'
              }`}>
                <input 
                  type="checkbox"
                  className="mt-1 accent-[var(--primary)] w-4 h-4"
                  checked={(formData as any).assignedPropertyIds.includes((prop as any).id)}
                  onChange={() => handlePropertyToggle((prop as any).id)}
                />
                <div>
                  <div className={`font-semibold text-sm ${(formData as any).assignedPropertyIds.includes((prop as any).id) ? 'text-primary' : 'text-primary'}`}>
                    {(prop as any).name}
                  </div>
                  <div className="text-xs text-secondary mt-1">{(prop as any).address}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
