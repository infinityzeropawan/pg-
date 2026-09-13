export interface OccupancyStats {
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
  maintenanceBeds: number;
  occupancyRate: number;
}

export interface FinancialStats {
  expectedRent: number;
  collectedRent: number;
  pendingRent: number;
  collectionRate: number;
}

export interface Defaulter {
  id: string;
  studentName: string;
  room: string;
  amount: number;
  daysOverdue: number;
}
