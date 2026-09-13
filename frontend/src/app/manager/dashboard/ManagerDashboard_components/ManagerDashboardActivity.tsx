import { UserPlus, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ManagerDashboardActivity() {
  const activities = [
    { id: 1, text: 'Rahul Kumar completed check-in for Room 101', time: '10 mins ago', icon: CheckCircle2, color: 'text-success', bg: 'bg-success-bg' },
    { id: 2, text: 'New complaint logged: AC not working in Room 204', time: '1 hour ago', icon: AlertCircle, color: 'text-danger', bg: 'bg-danger-bg' },
    { id: 3, text: 'Rent payment of ₹5,000 received from Amit Singh', time: '3 hours ago', icon: Wallet, color: 'text-theme-primary', bg: 'bg-theme-primary/10' },
    { id: 4, text: 'Visitor approved for Student Rohan (Room 302)', time: '5 hours ago', icon: UserPlus, color: 'text-info', bg: 'bg-info-bg' },
  ];

  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 h-full shadow-sm">
      <h3 className="font-black text-primary text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">Recent Activity</h3>
      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {activities.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6 last:pb-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 bg-card">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.bg}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-input/50 p-3 rounded-[var(--radius-md,8px)] border border border-transparent hover:border-border transition-colors">
                <p className="text-sm font-medium text-primary mb-1">{item.text}</p>
                <span className="text-xs font-bold text-secondary">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
