import React from 'react';
import { Users, CheckCircle, XCircle, Clock, Download, TrendingUp } from 'lucide-react';

export function StaffCookMealAttendanceTab() {
  return (
    <div className="space-y-6">
      
      {/* Today's Attendance Overview */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#3498DB]" /> Today's Meal Attendance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">🍳</div>
            <div className="font-bold text-gray-800 text-lg">72/80</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Breakfast</div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">🍛</div>
            <div className="font-bold text-gray-800 text-lg">81/85</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Lunch</div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">🍽️</div>
            <div className="font-bold text-gray-800 text-lg">79/85</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Dinner</div>
          </div>
          <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#27AE60]/30 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-[#27AE60] text-lg">90%</div>
            <div className="text-xs text-[#27AE60] font-medium uppercase tracking-wider">Overall Att.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Student Meal Attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#F39C12]" /> Student Meal Attendance
            </h3>
            <span className="text-xs font-bold text-gray-500 uppercase">Breakfast</span>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Student</th>
                  <th className="px-4 py-3 font-bold">Room</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Time</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">Rahul Sharma</td>
                  <td className="px-4 py-3 text-gray-600">203-B</td>
                  <td className="px-4 py-3 text-[#27AE60] font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Taken</td>
                  <td className="px-4 py-3 text-gray-600">08:15</td>
                  <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium">View</button></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">Amit Kumar</td>
                  <td className="px-4 py-3 text-gray-600">203-C</td>
                  <td className="px-4 py-3 text-[#E74C3C] font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Not Taken</td>
                  <td className="px-4 py-3 text-gray-400">-</td>
                  <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium">View</button></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">Sneha Reddy</td>
                  <td className="px-4 py-3 text-gray-600">304-A</td>
                  <td className="px-4 py-3 text-[#F39C12] font-bold flex items-center gap-1"><Clock className="w-4 h-4"/> Pending</td>
                  <td className="px-4 py-3 text-gray-400">-</td>
                  <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
            <button className="text-sm font-bold text-[#3498DB] px-4 py-2 border border-[#3498DB] rounded-lg hover:bg-blue-50">Mark Attendance</button>
          </div>
        </div>

        {/* Opted Out Students */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[#E74C3C]" /> Opt-Outs Today
            </h3>
            <span className="text-xs font-bold text-gray-500 uppercase">Lunch</span>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Student</th>
                  <th className="px-4 py-3 font-bold">Room</th>
                  <th className="px-4 py-3 font-bold">Reason</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">Vikram Singh</td>
                  <td className="px-4 py-3 text-gray-600">102-B</td>
                  <td className="px-4 py-3 text-gray-600 italic">Going out with friends</td>
                  <td className="px-4 py-3 text-gray-600">06/09/2024</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">Anjali Gupta</td>
                  <td className="px-4 py-3 text-gray-600">202-C</td>
                  <td className="px-4 py-3 text-gray-600 italic">Not hungry</td>
                  <td className="px-4 py-3 text-gray-600">06/09/2024</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
            <button className="text-sm font-bold text-gray-600 flex items-center gap-2 hover:text-gray-800">
              <Download className="w-4 h-4"/> Opt-Out Report
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
