// RESPONSIBILITY: Renders the ManagerFoodEmptyState component.
import { UtensilsCrossed } from 'lucide-react';
export function ManagerFoodEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-card border border rounded-[var(--radius-lg,12px)] text-center">
      <UtensilsCrossed className="w-12 h-12 text-secondary opacity-50 mb-4" />
      <h3 className="text-lg font-semibold text-primary mb-1">No Menu Available</h3>
      <p className="text-secondary text-sm max-w-sm">
        The owner hasn't set a food menu for this property yet.
      </p>
    </div>
  );
}