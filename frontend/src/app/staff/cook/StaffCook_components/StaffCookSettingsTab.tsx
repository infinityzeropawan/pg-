import React from 'react';
import { Settings, User, Bell, Clock, Save, Shield } from 'lucide-react';

export function StaffCookSettingsTab() {
  return (
    <div className="space-y-6">
      
      {/* Settings Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" /> Preferences & Settings
        </h2>
        <button className="bg-[#3498DB] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-600 flex items-center gap-2">
          <Save className="w-4 h-4"/> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
             <User className="w-5 h-5 text-[#8E44AD]" /> Profile Information
           </h3>
           <div className="space-y-4">
             <div className="flex gap-4 items-center mb-6">
               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                 C
               </div>
               <div>
                 <button className="text-sm font-bold text-[#3498DB] border border-[#3498DB] px-3 py-1.5 rounded-lg hover:bg-blue-50">Change Photo</button>
               </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]" defaultValue="Head Chef" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]" defaultValue="+91 9876543210" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]" defaultValue="chef@greenvalley.com" disabled />
                <span className="text-xs text-gray-400 mt-1 block flex items-center gap-1"><Shield className="w-3 h-3"/> Contact Manager to change email</span>
             </div>
           </div>
        </div>

        <div className="space-y-6">
          {/* Meal Timing Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
               <Clock className="w-5 h-5 text-[#F39C12]" /> Meal Timings Setup
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm font-bold text-gray-700 w-24">Breakfast</span>
                  <input type="time" defaultValue="08:00" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#F39C12]"/>
                  <span className="text-gray-400 text-sm">to</span>
                  <input type="time" defaultValue="09:30" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#F39C12]"/>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm font-bold text-gray-700 w-24">Lunch</span>
                  <input type="time" defaultValue="12:00" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#F39C12]"/>
                  <span className="text-gray-400 text-sm">to</span>
                  <input type="time" defaultValue="14:00" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#F39C12]"/>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm font-bold text-gray-700 w-24">Dinner</span>
                  <input type="time" defaultValue="20:00" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#F39C12]"/>
                  <span className="text-gray-400 text-sm">to</span>
                  <input type="time" defaultValue="22:00" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#F39C12]"/>
                </div>
             </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
               <Bell className="w-5 h-5 text-[#E74C3C]" /> Notification Preferences
             </h3>
             <div className="space-y-4">
               <label className="flex items-center justify-between cursor-pointer">
                 <div>
                   <span className="block text-sm font-bold text-gray-700">Low Stock Alerts</span>
                   <span className="text-xs text-gray-500">Get notified when inventory is running low</span>
                 </div>
                 <input type="checkbox" className="w-5 h-5 accent-[#E74C3C]" defaultChecked />
               </label>
               <label className="flex items-center justify-between cursor-pointer">
                 <div>
                   <span className="block text-sm font-bold text-gray-700">Special Meal Requests</span>
                   <span className="text-xs text-gray-500">Alert for dietary or timing requests</span>
                 </div>
                 <input type="checkbox" className="w-5 h-5 accent-[#E74C3C]" defaultChecked />
               </label>
               <label className="flex items-center justify-between cursor-pointer">
                 <div>
                   <span className="block text-sm font-bold text-gray-700">Daily Feedback Digest</span>
                   <span className="text-xs text-gray-500">Receive summary of mess feedback</span>
                 </div>
                 <input type="checkbox" className="w-5 h-5 accent-[#E74C3C]" />
               </label>
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}
