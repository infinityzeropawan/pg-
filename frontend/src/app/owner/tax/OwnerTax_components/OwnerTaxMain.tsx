// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the Owner Tax & Compliance main component.

import { useState } from 'react';
import {
  Receipt, FileText, CheckCircle2, Clock, AlertTriangle,
  Download, ChevronRight, Building, TrendingUp, Shield,
  FileCheck, ExternalLink
} from 'lucide-react';

const GST_REPORTS = [
  { id: 'gstr1',    name: 'GSTR-1',  desc: 'Outward Supplies Return',     frequency: 'Monthly',  dueDate: '11th of next month', status: 'Filed' },
  { id: 'gstr3b',   name: 'GSTR-3B', desc: 'Monthly Summary Return',      frequency: 'Monthly',  dueDate: '20th of next month', status: 'Due' },
  { id: 'gstr9',    name: 'GSTR-9',  desc: 'Annual Return',               frequency: 'Annual',   dueDate: '31st December',      status: 'NA' },
  { id: 'taxinv',   name: 'Tax Invoice Summary', desc: 'All GST invoices', frequency: 'Monthly',  dueDate: 'On demand',          status: 'Ready' },
  { id: 'salesreg', name: 'Sales Register',      desc: 'All sales records',frequency: 'Monthly',  dueDate: 'On demand',          status: 'Ready' },
];

const TDS_REPORTS = [
  { id: 'tds_rent',    name: 'TDS on Rent',            desc: 'Section 194I — For rent > ₹2.4L/year', dueDate: 'Quarterly', status: 'NA' },
  { id: 'tds_fees',    name: 'TDS on Professional Fees', desc: 'Section 194J',                       dueDate: 'Monthly',   status: 'NA' },
  { id: 'tds_cont',    name: 'TDS on Contractors',      desc: 'Section 194C',                        dueDate: 'Monthly',   status: 'Filed' },
  { id: 'form26q',     name: 'Form 26Q',                desc: 'Quarterly TDS Statement',             dueDate: 'Quarterly', status: 'Filed' },
];

const COMPLIANCE_ITEMS = [
  { id: 'gst',   label: 'GST Registration',           status: 'Done',    number: '19AARCG1234D1Z9', dueDate: null },
  { id: 'pan',   label: 'PAN Registration',            status: 'Done',    number: 'ABCDE1234F',      dueDate: null },
  { id: 'tan',   label: 'TAN Registration',            status: 'Done',    number: 'BLRS12345A',      dueDate: null },
  { id: 'shop',  label: 'Shop & Establishment License',status: 'Done',    number: 'SH-2024-00123',   dueDate: null },
  { id: 'fire',  label: 'Fire Safety Certificate',     status: 'Done',    number: 'FIRE-2024-456',   dueDate: '2025-03-31' },
  { id: 'trade', label: 'Trade License',               status: 'Done',    number: 'TL-2024-789',     dueDate: '2024-12-31' },
  { id: 'itr',   label: 'Income Tax Return FY 2023-24',status: 'Pending', number: null,              dueDate: '2024-10-31' },
  { id: 'tds_q', label: 'TDS Quarterly Filing Q2',     status: 'Pending', number: null,              dueDate: '2024-10-15' },
];

const statusBadge = (status: string) => {
  if (status === 'Filed' || status === 'Done' || status === 'Ready')
    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-success bg-success-bg">✅ {status}</span>;
  if (status === 'Due' || status === 'Pending')
    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-warning bg-warning-bg">⏳ {status}</span>;
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-secondary bg-page">— {status}</span>;
};

export function OwnerTaxMain() {
  const [activeTab, setActiveTab] = useState<'gst' | 'tds' | 'compliance'>('gst');

  // Derived metrics
  const totalRevenue = 3560000; // ₹35.6L
  const gstRate = 0.18;
  const gstDue = Math.round(totalRevenue * gstRate / 12); // Monthly GST
  const pendingReturns = COMPLIANCE_ITEMS.filter(c => c.status === 'Pending').length;
  const filedReturns = GST_REPORTS.filter(g => g.status === 'Filed').length + TDS_REPORTS.filter(t => t.status === 'Filed').length;

  const handleDownload = (reportName: string) => {
    // Simulate download
    const data = { report: reportName, generatedAt: new Date().toISOString(), note: 'Demo data — integrate with real backend' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-primary flex items-center gap-2">
          <Receipt className="w-6 h-6 text-[#2D7D9A]" /> Tax & Compliance
        </h1>
        <p className="text-sm text-secondary mt-1">Manage GST returns, TDS filings and statutory compliance.</p>
      </div>

      {/* Tax Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp,  label: 'Total Revenue',    value: `₹${(totalRevenue / 100000).toFixed(1)}L`,  color: 'text-[#2D7D9A]', bg: 'bg-[rgba(45,125,154,0.1)]' },
          { icon: Receipt,     label: 'GST Due (Monthly)',value: `₹${(gstDue / 1000).toFixed(0)}K`,          color: 'text-warning',   bg: 'bg-warning-bg' },
          { icon: Clock,       label: 'Pending Returns',  value: String(pendingReturns),                     color: 'text-danger',    bg: 'bg-danger-bg' },
          { icon: CheckCircle2,label: 'Returns Filed',    value: String(filedReturns),                       color: 'text-success',   bg: 'bg-success-bg' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-primary">{value}</div>
            <div className="text-xs text-secondary uppercase tracking-wider mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Business Info Banner */}
      <div className="bg-[rgba(45,125,154,0.08)] border border-[#2D7D9A]/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-[#2D7D9A] shrink-0" />
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <span className="text-secondary">Business: <span className="text-primary font-semibold">Rajesh Enterprises</span></span>
            <span className="text-secondary">GST: <span className="text-primary font-semibold">19AARCG1234D1Z9</span></span>
            <span className="text-secondary">PAN: <span className="text-primary font-semibold">ABCDE1234F</span></span>
            <span className="text-secondary">Type: <span className="text-primary font-semibold">PG / Hostel</span></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit">
        {([
          { key: 'gst',        label: 'GST Reports',     icon: FileText },
          { key: 'tds',        label: 'TDS Reports',     icon: FileCheck },
          { key: 'compliance', label: 'Compliance',      icon: Shield },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === key ? 'bg-[#2D7D9A] text-white' : 'text-secondary hover:text-primary'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* GST Tab */}
      {activeTab === 'gst' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-base font-bold text-primary">GST Reports</h2>
            <p className="text-xs text-secondary mt-1">Goods & Services Tax filings and summaries</p>
          </div>
          <div className="divide-y divide-border">
            {GST_REPORTS.map(report => (
              <div key={report.id} className="p-5 flex items-center justify-between gap-4 hover:bg-page/40 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(45,125,154,0.1)] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#2D7D9A]" />
                  </div>
                  <div>
                    <div className="font-semibold text-primary text-sm">{report.name}</div>
                    <div className="text-xs text-secondary">{report.desc}</div>
                    <div className="text-xs text-secondary/60 mt-0.5">{report.frequency} · Due: {report.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(report.status)}
                  <button onClick={() => handleDownload(report.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-page border border-border text-secondary rounded-md text-xs font-medium hover:text-primary hover:border-primary transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border bg-page/50">
            <button onClick={() => handleDownload('GST_Bundle')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2D7D9A] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6680] transition-colors">
              <Download className="w-4 h-4" /> Generate All GST Reports
            </button>
          </div>
        </div>
      )}

      {/* TDS Tab */}
      {activeTab === 'tds' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-base font-bold text-primary">TDS Reports</h2>
            <p className="text-xs text-secondary mt-1">Tax Deducted at Source — filings and forms</p>
          </div>
          <div className="divide-y divide-border">
            {TDS_REPORTS.map(report => (
              <div key={report.id} className="p-5 flex items-center justify-between gap-4 hover:bg-page/40 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-warning-bg flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <div className="font-semibold text-primary text-sm">{report.name}</div>
                    <div className="text-xs text-secondary">{report.desc}</div>
                    <div className="text-xs text-secondary/60 mt-0.5">Due: {report.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(report.status)}
                  <button onClick={() => handleDownload(report.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-page border border-border text-secondary rounded-md text-xs font-medium hover:text-primary hover:border-primary transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border bg-page/50">
            <button onClick={() => handleDownload('TDS_Bundle')}
              className="flex items-center gap-2 px-5 py-2.5 bg-warning text-black rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              <Download className="w-4 h-4" /> Generate All TDS Reports
            </button>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Compliant',  value: COMPLIANCE_ITEMS.filter(c => c.status === 'Done').length,    color: 'text-success', bg: 'bg-success-bg' },
              { label: 'Pending',    value: COMPLIANCE_ITEMS.filter(c => c.status === 'Pending').length, color: 'text-warning', bg: 'bg-warning-bg' },
              { label: 'Total Items',value: COMPLIANCE_ITEMS.length,                                     color: 'text-[#2D7D9A]', bg: 'bg-[rgba(45,125,154,0.1)]' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
                <div className={`text-3xl font-black ${color}`}>{value}</div>
                <div className="text-xs text-secondary uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#2D7D9A]" /> Compliance Checklist
              </h2>
            </div>
            <div className="divide-y divide-border">
              {COMPLIANCE_ITEMS.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-page/40 transition-colors">
                  <div className="flex items-center gap-3">
                    {item.status === 'Done' ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-primary text-sm">{item.label}</div>
                      {item.number && <div className="text-xs text-secondary mt-0.5">Reg #: {item.number}</div>}
                      {item.dueDate && <div className="text-xs text-warning mt-0.5">Due: {new Date(item.dueDate).toLocaleDateString('en-IN')}</div>}
                    </div>
                  </div>
                  {statusBadge(item.status)}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border bg-page/50 flex gap-3">
              <button onClick={() => handleDownload('Compliance_Report')}
                className="flex items-center gap-2 px-4 py-2 bg-[#2D7D9A] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6680] transition-colors">
                <Download className="w-4 h-4" /> Download Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-page border border-border text-secondary rounded-lg text-sm font-medium hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" /> Upload Documents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
