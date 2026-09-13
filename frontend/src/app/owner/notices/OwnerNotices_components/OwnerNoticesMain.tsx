// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the Owner Notices & Communication main component.

import { useState, useEffect } from 'react';
import {
  Megaphone, Plus, Send, Bell, Edit3, Trash2,
  MessageSquare, Mail, Phone, Smartphone, RefreshCw,
  ChevronDown, AlertCircle, Info, CheckCircle
} from 'lucide-react';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';

const PRIORITY_CONFIG = {
  high:   { label: 'Urgent',    color: 'text-danger',   bg: 'bg-danger-bg',   icon: AlertCircle },
  medium: { label: 'Important', color: 'text-warning',  bg: 'bg-warning-bg',  icon: Bell },
  low:    { label: 'Normal',    color: 'text-success',  bg: 'bg-success-bg',  icon: Info },
};

const EMPTY_FORM = { title: '', category: 'general', priority: 'medium', content: '', targetPG: 'all' };

export function OwnerNoticesMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId } = useOwnerPropertyContext();

  const [notices, setNotices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastChannels, setBroadcastChannels] = useState({ whatsapp: true, sms: false, email: false, push: false });
  const [broadcastHistory, setBroadcastHistory] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadNotices = () => {
    const all: any[] = JSON.parse(localStorage.getItem('spg_notices') || '[]');
    const hist: any[] = JSON.parse(localStorage.getItem('spg_broadcast_history') || '[]');
    const filtered = selectedPropertyId === 'all' ? all.filter(n => !n.isDeleted) : all.filter(n => n.propertyId === selectedPropertyId && !n.isDeleted);
    setNotices(filtered);
    setBroadcastHistory(hist.slice(-10).reverse());
  };

  useEffect(() => { loadNotices(); }, [selectedPropertyId]);

  const saveNotice = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    const all: any[] = JSON.parse(localStorage.getItem('spg_notices') || '[]');
    const propId = selectedPropertyId === 'all' ? (properties[0]?.id || 'prop_1') : selectedPropertyId;
    const now = new Date().toISOString();

    if (editId) {
      const updated = all.map(n => n.id === editId ? { ...n, ...form, propertyId: propId, updatedAt: now } : n);
      localStorage.setItem('spg_notices', JSON.stringify(updated));
      showToast('Notice updated successfully!');
    } else {
      const newNotice = { id: `not_${Date.now()}`, ...form, propertyId: propId, targetRole: 'all', createdAt: now, updatedAt: now, isDeleted: false };
      localStorage.setItem('spg_notices', JSON.stringify([...all, newNotice]));
      showToast('Notice published successfully!');
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
    setSaving(false);
    loadNotices();
  };

  const deleteNotice = (id: string) => {
    const all: any[] = JSON.parse(localStorage.getItem('spg_notices') || '[]');
    const updated = all.map(n => n.id === id ? { ...n, isDeleted: true } : n);
    localStorage.setItem('spg_notices', JSON.stringify(updated));
    showToast('Notice deleted.');
    loadNotices();
  };

  const startEdit = (notice: any) => {
    setForm({ title: notice.title, category: notice.category || 'general', priority: notice.priority || 'medium', content: notice.content, targetPG: 'all' });
    setEditId(notice.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    setBroadcasting(true);
    const hist: any[] = JSON.parse(localStorage.getItem('spg_broadcast_history') || '[]');
    const channels = Object.entries(broadcastChannels).filter(([, v]) => v).map(([k]) => k);
    const newEntry = {
      id: `bcast_${Date.now()}`,
      message: broadcastMsg,
      channels,
      sentAt: new Date().toISOString(),
      deliveredCount: 10,
      status: 'Delivered',
    };
    hist.push(newEntry);
    localStorage.setItem('spg_broadcast_history', JSON.stringify(hist));
    setTimeout(() => {
      setBroadcastMsg('');
      setBroadcasting(false);
      showToast(`✅ Broadcast sent via ${channels.join(', ')}!`);
      loadNotices();
    }, 800);
  };

  const channelIcons: Record<string, any> = { whatsapp: Phone, sms: Smartphone, email: Mail, push: Bell };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-success text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#2D7D9A]" /> Communication & Notices
          </h1>
          <p className="text-sm text-secondary mt-1">Create notices, broadcast messages to all tenants.</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2D7D9A] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6680] transition-colors shadow-md">
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Create Notice'}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Notices',    value: notices.length,                                       color: 'text-[#2D7D9A]', bg: 'bg-[rgba(45,125,154,0.1)]', icon: Megaphone },
          { label: 'Urgent',           value: notices.filter(n => n.priority === 'high').length,    color: 'text-danger',    bg: 'bg-danger-bg',              icon: AlertCircle },
          { label: 'Important',        value: notices.filter(n => n.priority === 'medium').length,  color: 'text-warning',   bg: 'bg-warning-bg',             icon: Bell },
          { label: 'Broadcasts Sent',  value: broadcastHistory.length,                              color: 'text-success',   bg: 'bg-success-bg',             icon: Send },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-primary">{value}</div>
            <div className="text-xs text-secondary uppercase tracking-wider mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-card border border-[#2D7D9A]/40 rounded-2xl p-6 shadow-lg">
          <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#2D7D9A]" /> {editId ? 'Edit Notice' : 'Create New Notice'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1.5">Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Water supply shutdown on Sunday..."
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-[#2D7D9A] transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-[#2D7D9A] transition-colors">
                <option value="general">General</option>
                <option value="rent">Rent & Finance</option>
                <option value="maintenance">Maintenance</option>
                <option value="food">Food & Mess</option>
                <option value="event">Events</option>
                <option value="safety">Safety</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-[#2D7D9A] transition-colors">
                <option value="high">🔴 Urgent</option>
                <option value="medium">🟡 Important</option>
                <option value="low">🟢 Normal</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1.5">Target PG</label>
              <select value={form.targetPG} onChange={e => setForm(f => ({ ...f, targetPG: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-[#2D7D9A] transition-colors">
                <option value="all">All PGs</option>
                {properties.map(p => <option key={p.id} value={p.id}>{(p as any).name}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-5">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1.5">Content *</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={4} placeholder="Write the notice content here..."
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-[#2D7D9A] transition-colors resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={saveNotice} disabled={saving || !form.title.trim() || !form.content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#2D7D9A] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6680] transition-colors disabled:opacity-50">
              <Send className="w-4 h-4" /> {saving ? 'Publishing...' : editId ? 'Update Notice' : 'Publish Notice'}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}
              className="px-4 py-2.5 bg-page border border-border text-secondary rounded-lg text-sm font-medium hover:text-primary transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Broadcast Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
          <Send className="w-4 h-4 text-[#F5A623]" /> Broadcast Message
        </h2>
        <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
          rows={3} placeholder="Type your broadcast message to all tenants..."
          className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-primary outline-none focus:border-[#2D7D9A] transition-colors resize-none mb-4" />
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Channels:</span>
          {Object.entries(broadcastChannels).map(([channel, checked]) => {
            const Icon = channelIcons[channel];
            return (
              <label key={channel} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={checked} onChange={e => setBroadcastChannels(prev => ({ ...prev, [channel]: e.target.checked }))}
                  className="w-4 h-4 accent-[#2D7D9A] cursor-pointer" />
                <Icon className="w-4 h-4 text-secondary" />
                <span className="text-sm text-primary capitalize">{channel === 'sms' ? 'SMS' : channel === 'push' ? 'Push' : channel}</span>
              </label>
            );
          })}
        </div>
        <button onClick={sendBroadcast} disabled={broadcasting || !broadcastMsg.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F5A623] text-black rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md">
          <Send className="w-4 h-4" /> {broadcasting ? 'Sending...' : 'Send Broadcast'}
        </button>
      </div>

      {/* Notices List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-primary">Published Notices ({notices.length})</h2>
          <button onClick={loadNotices} className="text-secondary hover:text-primary transition-colors"><RefreshCw className="w-4 h-4" /></button>
        </div>
        {notices.length === 0 ? (
          <div className="text-center py-16 text-secondary">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No notices yet</p>
            <p className="text-sm mt-1">Create your first notice above</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notices.map(notice => {
              const pri = PRIORITY_CONFIG[notice.priority] || PRIORITY_CONFIG.low;
              const PriIcon = pri.icon;
              return (
                <div key={notice.id} className="p-5 hover:bg-page/40 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${pri.bg}`}>
                        <PriIcon className={`w-4 h-4 ${pri.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-primary text-sm">{notice.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pri.color} ${pri.bg}`}>{pri.label}</span>
                          {notice.category && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(45,125,154,0.1)] text-[#2D7D9A] capitalize">{notice.category}</span>
                          )}
                        </div>
                        <p className="text-sm text-secondary leading-relaxed line-clamp-2">{notice.content}</p>
                        <p className="text-xs text-secondary/60 mt-2">{new Date(notice.createdAt).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(notice)} className="p-1.5 text-secondary hover:text-primary hover:bg-page rounded-md transition-colors" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteNotice(notice.id)} className="p-1.5 text-secondary hover:text-danger hover:bg-danger-bg rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Broadcast History */}
      {broadcastHistory.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-base font-semibold text-primary">Broadcast History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-page">
                  {['Date', 'Message', 'Channels', 'Delivered', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {broadcastHistory.map(b => (
                  <tr key={b.id} className="border-b border-border hover:bg-page/50">
                    <td className="px-4 py-3 text-xs text-secondary whitespace-nowrap">{new Date(b.sentAt).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-primary max-w-[200px]"><div className="truncate">{b.message}</div></td>
                    <td className="px-4 py-3 text-secondary text-xs">{b.channels?.join(', ')}</td>
                    <td className="px-4 py-3 text-primary font-medium">{b.deliveredCount}</td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold text-success bg-success-bg px-2 py-0.5 rounded-full">✅ {b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
