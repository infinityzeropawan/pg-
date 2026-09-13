// RESPONSIBILITY: Renders the ManagerEnquiriesLost component.
import { MessageCircle, Mail } from 'lucide-react';

import { Pagination } from '@/components/ui/Pagination';

import type { Enquiry, EnquiryStatus } from '@/app/manager/manager_lib/manager_api/managerEnquiries';
interface Props {
  paginatedLostEnquiries: Enquiry[];
  lostEnquiries: Enquiry[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setWaMenuEnquiry: (enq: Enquiry) => void;
  handleStatusChange: (id: string, status: EnquiryStatus) => void;
}
export function ManagerEnquiriesLost({
  paginatedLostEnquiries, lostEnquiries, currentPage, totalPages,
  setCurrentPage, setWaMenuEnquiry, handleStatusChange
}: Props) {
  const renderCardContactActions = (enq: Enquiry) => (
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border">
      <button 
        onClick={() => setWaMenuEnquiry(enq)}
        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-500/10 text-emerald-600 rounded border border-emerald-500/20 hover:bg-emerald-500/20 motion-safe:transition-colors text-xs font-bold"
      >
        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
      </button>
      {enq.email && (
        <a 
          href={`mailto:${enq.email}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-primary-bg text-primary rounded border border-primary/20 hover:bg-primary/10 motion-safe:transition-colors text-xs font-bold"
        >
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
      )}
    </div>
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedLostEnquiries.map(enq => (
          <div key={enq.id} className="bg-card border border rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-primary">{enq.name}</h3>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-danger-bg text-danger">Lost</span>
              </div>
              <p className="text-sm text-secondary">{enq.phone}</p>
              {enq.notes && (
                <div className="mt-2">
                  <span className="text-sm text-secondary leading-relaxed">{enq.notes}</span>
                </div>
              )}
              <div className="bg-danger-bg p-3 rounded-lg border border-danger/20 mb-4 mt-3">
                <p className="text-xs font-semibold text-danger uppercase tracking-wider mb-1">Reason for Loss</p>
                <p className="text-sm text-primary font-medium">{enq.lossReason || 'Not specified'}</p>
              </div>
            </div>
            <div>
              {renderCardContactActions(enq)}
              <div className="mt-3 pt-3 border-t border">
                <select 
                  value={enq.status}
                  onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                  className="w-full bg-input border border rounded-lg px-2 py-2 text-sm text-primary focus:outline-none"
                >
                  <option value="lost">Status: Lost</option>
                  <option value="new">Move to New</option>
                  <option value="contacted">Move to Contacted</option>
                  <option value="interested">Move to Interested</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {lostEnquiries.length === 0 && (
          <div className="col-span-full text-center p-12 text-secondary bg-card border border rounded-3xl">
            <p className="font-medium text-lg">No lost leads</p>
            <p className="text-sm mt-1">Great job! All your leads are active or converted.</p>
          </div>
        )}
      </div>
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  );
}