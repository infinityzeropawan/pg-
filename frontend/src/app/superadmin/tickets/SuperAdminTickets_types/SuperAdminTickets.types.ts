export interface SuperAdminTicket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
}

export interface TicketOwnerContext {
  id: string;
  name: string;
  businessName: string;
}

export interface CreateTicketFormData {
  ownerId: string;
  title: string;
  description: string;
  priority: string;
}

// Component Props Interfaces
export interface SuperAdminTicketsHeaderProps {
  onCreateClick: () => void;
}

export interface SuperAdminTicketsTableProps {
  tickets: SuperAdminTicket[];
  owners: TicketOwnerContext[];
  loading: boolean;
  search: string;
  setSearch: (s: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export interface SuperAdminTicketsCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  owners: TicketOwnerContext[];
  formData: CreateTicketFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreateTicketFormData>>;
  onSubmit: (e: React.FormEvent) => void;
}
