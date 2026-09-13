'use client';

// RESPONSIBILITY: Entry point for the SuperAdmin Dashboard page. Composes KPI grid, latest requests table, acquisition chart, and new Quick Actions/Broadcast.
import React, { useState } from 'react';
import { Megaphone, PlusCircle, ArrowRight, Zap, Bell, Server } from 'lucide-react';

import { SuperAdminDashboardKpiGrid } from '@/app/superadmin/dashboard/SuperAdminDashboard_components/SuperAdminDashboardKpiGrid';
import { SuperAdminDashboardLatestRequestsTable } from '@/app/superadmin/dashboard/SuperAdminDashboard_components/SuperAdminDashboardLatestRequestsTable';
import { SuperAdminDashboardAcquisitionChart } from '@/app/superadmin/dashboard/SuperAdminDashboard_components/SuperAdminDashboardAcquisitionChart';
import { SuperadminUseSuperAdminDashboardData } from '@/app/superadmin/dashboard/SuperAdminDashboard_hooks/SuperadminUseSuperAdminDashboardData';
import { SUPER_ADMIN_DASHBOARD_ACQUISITION_MOCK } from '@/app/superadmin/dashboard/SuperAdminDashboard_utils/SuperAdminDashboard.constants';
import Link from 'next/link';

export default function SuperAdminDashboardPage() {
  const { data } = SuperadminUseSuperAdminDashboardData();
  const [broadcastMessage, setBroadcastMessage] = useState('');

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if(broadcastMessage.trim()) {
      alert(`Broadcast sent to all active properties: ${broadcastMessage}`);
      setBroadcastMessage('');
    }
  };

  return (
    <div className="home-theme space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Premium Header - Matching Homepage Hero */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{ background: 'var(--gradient-hero)' }}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--primary-white)' }}>Platform Overview</h1>
            <p className="max-w-xl text-sm leading-relaxed" style={{ color: 'var(--bg-medium)' }}>
              Welcome back, SuperAdmin. Network occupancy is up by 2.1% this week. Revenue generation is stable. Review the KPIs and manage incoming PG owner requests below.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/superadmin/create-owner" className="btn-gold shadow-md hover:-translate-y-0.5">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Owner
            </Link>
            <button className="btn-outline-white shadow-sm hover:-translate-y-0.5">
              <Server className="w-4 h-4 mr-2" />
              System Status
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <SuperAdminDashboardKpiGrid data={data} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Left Column (Tables & Charts) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Latest Requests Table */}
          <div className="bg-card border border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b bg-[var(--bg-input)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-primary">Pending Owner Requests</h3>
                <p className="text-sm text-secondary">Review and approve new property owners.</p>
              </div>
              <Link href="/superadmin/owner-requests" className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-0">
              <SuperAdminDashboardLatestRequestsTable requests={data.latestRequests} />
            </div>
          </div>

          {/* Acquisition Chart */}
          <div className="bg-card border border rounded-2xl shadow-sm overflow-hidden p-6">
            <h3 className="font-bold text-lg text-primary mb-1">Student Acquisition Trend</h3>
            <p className="text-sm text-secondary mb-6">Monthly platform growth across all active properties.</p>
            <SuperAdminDashboardAcquisitionChart data={SUPER_ADMIN_DASHBOARD_ACQUISITION_MOCK} />
          </div>

        </div>

        {/* Right Sidebar (Quick Actions & Broadcast) */}
        <div className="space-y-6 xl:col-span-1">
          
          {/* Quick Actions */}
          <div className="bg-card border border rounded-2xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--info-bg)] rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
            <h3 className="font-bold text-lg text-primary flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-warning" /> Quick Actions
            </h3>
            
            <div className="space-y-3 relative z-10">
              <Link href="/superadmin/plans" className="flex items-center justify-between p-3 rounded-lg border hover:border-[var(--primary)] hover:bg-[var(--primary-subtle)] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-primary">Manage Pricing Plans</span>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link href="/superadmin/settings" className="flex items-center justify-between p-3 rounded-lg border hover:border-[var(--primary)] hover:bg-[var(--primary-subtle)] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-primary">Platform Settings</span>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link href="/superadmin/tickets" className="flex items-center justify-between p-3 rounded-lg border hover:border-[var(--primary)] hover:bg-[var(--primary-subtle)] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[var(--danger)]/10 flex items-center justify-center text-[var(--danger)]">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-primary">View Open Tickets ({data.openTicketsCount})</span>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Broadcast / Annoucements Feature (NEW) */}
          <div className="bg-card border border rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2 mb-2">
              <Megaphone className="w-5 h-5 text-[var(--info)]" /> Global Broadcast
            </h3>
            <p className="text-xs text-secondary mb-4">
              Send an announcement to all active PG Owners and Managers. It will appear on their dashboards.
            </p>
            
            <form onSubmit={handleBroadcast} className="space-y-3">
              <textarea 
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type your announcement here..."
                required
                rows={3}
                className="w-full text-sm p-3 border rounded-lg bg-[var(--bg-input)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
              />
              <button 
                type="submit" 
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex justify-center items-center gap-2"
              >
                Send Broadcast
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
