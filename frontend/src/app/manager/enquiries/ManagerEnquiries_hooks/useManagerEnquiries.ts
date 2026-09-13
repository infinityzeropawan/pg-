// @ts-nocheck
// DATA FLOW: ManagerPropertyContext → api.managerEnquiries → local state → ManagerEnquiriesMain
// [DATA HOOK] useManagerEnquiries
// Responsibility: Manages enquiry Kanban board state, form state, and status transitions.
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';

import type { Enquiry, EnquiryStatus } from '@/app/manager/manager_lib/manager_api/managerEnquiries';
import type { EnquiryFormData, EnquiriesTab } from '@/app/manager/enquiries/ManagerEnquiries_types/ManagerEnquiries.types';

export function useManagerEnquiries(selectedPropertyId: string | null, ctxLoading: boolean, userId: string | undefined) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<EnquiriesTab>('pipeline');
  const [waMenuEnquiry, setWaMenuEnquiry] = useState<Enquiry | null>(null);
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '', phone: '', email: '', expectedMoveIn: '', budget: '', notes: ''
  });

  // Fetches enquiry list for the selected property.
  const loadData = useCallback(() => {
    if (ctxLoading || !selectedPropertyId) return;
    setLoading(true);
    const data = api.managerEnquiries.listByProperty(selectedPropertyId);
    setEnquiries(data);
    setLoading(false);
  }, [ctxLoading, selectedPropertyId]);

  // Re-fetch enquiries when property changes or context loading completes.
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedPropertyId) return;
    api.managerEnquiries.create({
      ...formData,
      propertyId: selectedPropertyId,
      assignedManagerId: userId,
      budget: parseInt(formData.budget) || 0
    });
    setShowAddModal(false);
    setFormData({ name: '', phone: '', email: '', expectedMoveIn: '', budget: '', notes: '' });
    loadData();
  };

  const handleStatusChange = (id: string, status: EnquiryStatus) => {
    if (!userId) return;
    let lossReason = undefined;
    if (status === 'lost') {
      const reason = window.prompt('Why was this lead lost? (e.g. Budget, No Beds, Location)');
      if (reason === null) return;
      lossReason = reason || 'Unspecified';
    }
    api.managerEnquiries.updateStatus(id, status, userId, lossReason);
    loadData();
  };

  const handleConvertToCheckin = (enquiryId: string) => {
    router.push(`/manager/check-in?enquiryId=${enquiryId}`);
  };

  const openWhatsAppMsg = (phone: string, text: string) => {
    const encoded = encodeURIComponent(text);
    const formattedPhone = phone.replace(/\D/g, '');
    const finalPhone = formattedPhone.length === 10 ? `91${formattedPhone}` : formattedPhone;
    window.open(`https://wa.me/${finalPhone}?text=${encoded}`, '_blank');
  };

  const handleRoomAvailable = () => {
    if (!waMenuEnquiry) return;
    const msg = `Hello ${waMenuEnquiry.name}, a bed matching your requirements is now available at our PG. Let us know if you are still looking to book!`;
    openWhatsAppMsg(waMenuEnquiry.phone, msg);
    setWaMenuEnquiry(null);
  };

  const handleRentOffer = () => {
    if (!waMenuEnquiry) return;
    const msg = `Hello ${waMenuEnquiry.name}, we are running a special discount offer on rent right now! Check out the attached image for details. Let us know if you're interested.`;
    alert("WhatsApp will now open with the text. Please manually attach your Offer Image in the chat window!");
    openWhatsAppMsg(waMenuEnquiry.phone, msg);
    setWaMenuEnquiry(null);
  };

  // Pagination for Lost Enquiries
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);
  const itemsPerPage = 12;

  // Reset to page 1 whenever search query, property, or active tab changes to avoid empty pages.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPropertyId, activeTab, setCurrentPage]);

  const filteredEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.phone.includes(searchQuery)
  );
  const activeEnquiries = filteredEnquiries.filter(e => e.status !== 'lost' && e.status !== 'converted');
  const lostEnquiries = filteredEnquiries.filter(e => e.status === 'lost');

  return {
    enquiries, loading, showAddModal, setShowAddModal, searchQuery, setSearchQuery,
    activeTab, setActiveTab, waMenuEnquiry, setWaMenuEnquiry, formData, setFormData,
    currentPage, setCurrentPage, itemsPerPage,
    activeEnquiries, lostEnquiries,
    handleAdd, handleStatusChange, handleConvertToCheckin, handleRoomAvailable, handleRentOffer
  };
}