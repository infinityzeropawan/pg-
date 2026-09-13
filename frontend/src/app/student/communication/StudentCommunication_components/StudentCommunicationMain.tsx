'use client';

// RESPONSIBILITY: Renders the Student Communication UI.

import { useState } from 'react';
import { MessageCircle, Shield, Users, Search, Send, CheckCircle2, Menu, X } from 'lucide-react';

export function StudentCommunicationMain() {
  const [activeChat, setActiveChat] = useState<'admin' | 'roommates'>('admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // mock send
    setMessage('');
  };

  return (
    <div className="space-y-6 w-full h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          💬 Communication
        </h1>
        <p className="text-sm text-secondary mt-1">Connect with the Warden, Admin, and your Roommates.</p>
      </div>

      <div className="flex-1 bg-card border border-border rounded-[var(--radius-lg)] shadow-sm overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Sidebar / Chat List */}
        <div className={`w-full md:w-80 border-r border-border flex-col bg-page absolute md:relative z-20 h-full transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 flex' : '-translate-x-full hidden md:flex'}`}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input type="text" placeholder="Search chats..." className="w-full bg-input border border-border rounded-[var(--radius-md)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary text-primary" />
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-2 text-primary p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <button 
              onClick={() => { setActiveChat('admin'); setIsSidebarOpen(false); }}
              className={`w-full text-left p-4 flex items-center gap-3 border-b border-border transition-colors ${activeChat === 'admin' ? 'bg-primary-subtle' : 'hover:bg-input'}`}
            >
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-primary truncate">PG Admin & Warden</h3>
                  <span className="text-[10px] text-secondary">10:30 AM</span>
                </div>
                <p className="text-xs text-secondary truncate">Warden: Okay, I will send someone to fix it.</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveChat('roommates')}
              className={`w-full text-left p-4 flex items-center gap-3 border-b border-border transition-colors ${activeChat === 'roommates' ? 'bg-primary-subtle' : 'hover:bg-input'}`}
            >
              <div className="w-12 h-12 rounded-full bg-info text-white flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-primary truncate">Room 203 Group</h3>
                  <span className="text-[10px] text-secondary">Yesterday</span>
                </div>
                <p className="text-xs text-secondary truncate">Amit: Are you coming for dinner?</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-card relative">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-page flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-primary hover:bg-input rounded-full">
              <Menu className="w-5 h-5" />
            </button>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${activeChat === 'admin' ? 'bg-primary' : 'bg-info'}`}>
              {activeChat === 'admin' ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-primary">{activeChat === 'admin' ? 'PG Admin & Warden' : 'Room 203 Group'}</h3>
              <p className="text-xs text-success font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> Online
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card/50">
            {activeChat === 'admin' ? (
              <>
                <div className="flex justify-center">
                  <span className="text-[10px] bg-input text-secondary px-2 py-1 rounded-full">Today</span>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%] bg-primary text-white p-3 rounded-2xl rounded-tr-sm shadow-sm">
                    <p className="text-sm">Hi Sir, the AC in my room is making a weird noise.</p>
                    <div className="text-[10px] text-white/70 mt-1 flex justify-end items-center gap-1">
                      10:15 AM <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[75%] bg-page border border-border text-primary p-3 rounded-2xl rounded-tl-sm shadow-sm">
                    <p className="text-sm">Okay, I will send someone to fix it by afternoon.</p>
                    <div className="text-[10px] text-secondary mt-1">
                      10:30 AM
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <span className="text-[10px] bg-input text-secondary px-2 py-1 rounded-full">Yesterday</span>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[75%] bg-page border border-border text-primary p-3 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="text-xs font-bold text-info mb-1">Amit Verma</div>
                    <p className="text-sm">Are you coming for dinner?</p>
                    <div className="text-[10px] text-secondary mt-1">
                      08:00 PM
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%] bg-primary text-white p-3 rounded-2xl rounded-tr-sm shadow-sm">
                    <p className="text-sm">Yes, I'll be there in 10 mins.</p>
                    <div className="text-[10px] text-white/70 mt-1 flex justify-end items-center gap-1">
                      08:05 PM <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border bg-page">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <input 
                type="text" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-input border border-border rounded-[var(--radius-full)] pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary text-primary"
              />
              <button type="submit" disabled={!message.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
