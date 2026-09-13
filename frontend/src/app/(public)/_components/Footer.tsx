export function Footer() {
  return (
    <footer className="bg-card border-t border py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 text-center text-secondary text-sm">
        <p>&copy; {new Date().getFullYear()} SmartPG. All rights reserved.</p>
        <p className="mt-2">Premium Indian SaaS for Hostel Management.</p>
      </div>
    </footer>
  );
}
