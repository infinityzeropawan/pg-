// RESPONSIBILITY: Renders the OwnerPropertiesCreateAmenities component. Receives data via props/hooks.

export interface OwnerPropertiesCreateAmenitiesProps {
  amenities: string[];
  handleToggleAmenity: (am: string) => void;
  availableAmenities: string[];
}

export function OwnerPropertiesCreateAmenities({ amenities, handleToggleAmenity, availableAmenities }: OwnerPropertiesCreateAmenitiesProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)]">
        <h2 className="text-base font-semibold text-primary">Amenities Provided</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-3">
          {availableAmenities.map(am => (
            <button
              key={am}
              type="button"
              onClick={() => handleToggleAmenity(am)}
              className={`px-4 py-2 rounded-full text-sm font-medium motion-safe:transition-colors border ${
                amenities.includes(am) 
                  ? 'bg-primary-subtle border-primary text-primary' 
                  : 'bg-input border-border text-secondary hover:border-text-primary'
              }`}
            >
              {am}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
