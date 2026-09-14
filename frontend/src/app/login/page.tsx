'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Briefcase, Users, Utensils, GraduationCap, HeartHandshake, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { authApi as api } from '@/app/login/login_lib/login_api/LoginAuth';
import { setSession } from '@/app/login/login_lib/login_auth/LoginSession';
import '../homepage.css';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const ROLE_OPTIONS = [
  { id: 'owner', label: 'PG Owner', role: 'owner', icon: Briefcase, path: '/owner/login' },
  { id: 'manager', label: 'Manager', role: 'manager', icon: Users, path: '/manager/login' },
  { id: 'staff', label: 'Staff & Cook', role: 'staff', icon: Utensils, path: '/staff/login' },
  { id: 'student', label: 'Student', role: 'student', icon: GraduationCap, path: '/student/login' },
  { id: 'parent', label: 'Parent', role: 'parent', icon: HeartHandshake, path: '/parent/login' }
];

export default function UnifiedLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<(typeof ROLE_OPTIONS)[number]>(ROLE_OPTIONS[0]!);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleObj: typeof ROLE_OPTIONS[0]) => {
    setSelectedRole(roleObj);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login({ email, password, expectedRole: selectedRole.role as any });
      setSession(user);
      
      const rolePath = user.role ? user.role.toLowerCase() : selectedRole.role;
      router.push(`/${rolePath}/dashboard`);
    } catch (err) {
      setError((err as Error).message || 'Login failed. Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="home-theme min-h-screen flex bg-[var(--bg-light)] font-sans">
      
      {/* Left side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 relative z-10 py-12">
        
        <div className="absolute top-8 right-8 lg:hidden"><ThemeToggle /></div>
        <div className="absolute top-8 left-8 lg:left-16">
          <Link href="/" className="font-bold text-2xl tracking-tight text-[var(--primary-navy)]">
            <span style={{ color: 'var(--primary-teal)' }}>Smart</span>PG
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-8">
          <h2 className="text-3xl font-extrabold text-[var(--primary-navy)] tracking-tight mb-2">
            Sign In to SmartPG
          </h2>
          <p className="text-sm text-[var(--text-medium)] mb-6">
            Select your role to access your personalized dashboard portal.
          </p>

          {/* Role Tabs */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {ROLE_OPTIONS.map((acc) => {
              const isSelected = selectedRole.id === acc.id;
              const IconComp = acc.icon;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleRoleSelect(acc)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${
                    isSelected 
                      ? 'border-[var(--primary-teal)] bg-blue-50/80 ring-2 ring-[var(--primary-teal)] transform -translate-y-0.5 shadow-sm' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <IconComp className={`w-5 h-5 mb-1 ${isSelected ? 'text-[var(--primary-teal)]' : 'text-gray-500'}`} />
                  <span className={`text-[10px] font-bold text-center leading-tight ${isSelected ? 'text-[var(--primary-teal)]' : 'text-gray-600'}`}>
                    {acc.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs bg-gray-100/70 px-3 py-2 rounded-lg mb-6 text-gray-700">
            <span>Role: <strong className="text-[var(--primary-navy)]">{selectedRole.label} Portal</strong></span>
            <Link href={selectedRole.path} className="text-[var(--primary-teal)] font-semibold hover:underline flex items-center gap-1">
              Direct Link <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-[var(--radius-sm)] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] focus:border-transparent text-gray-800 transition-all text-sm"
                placeholder={`Enter your ${selectedRole.label.toLowerCase()} email`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-[var(--radius-sm)] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] focus:border-transparent text-gray-800 transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-[var(--radius-sm)] flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0" /> <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-[var(--radius-sm)] shadow-md text-sm font-bold text-white bg-[var(--primary-teal)] hover:bg-[var(--primary-navy)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-teal)] disabled:opacity-70 transition-all transform hover:-translate-y-0.5 mt-2 flex justify-center items-center gap-2"
            >
              {loading ? 'Signing in...' : `Sign In as ${selectedRole.label}`}
            </button>
          </form>
          
          <div className="mt-6 p-4 rounded-xl border border-blue-100 bg-blue-50/50 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Looking for live preview?</span>
              <p className="text-[11px] text-slate-500">Test all roles with 1-click demo buttons in our sandbox.</p>
            </div>
            <Link href="/demo" className="shrink-0 font-bold px-3 py-1.5 bg-white text-[var(--primary-teal)] border border-[var(--primary-teal)] rounded-md hover:bg-[var(--primary-teal)] hover:text-white transition-colors">
              Open Demo
            </Link>
          </div>

          <div className="mt-8 text-center text-xs text-[var(--text-light)] space-y-2">
            <div>
              System Administrator? <Link href="/superadmin/login" className="text-[var(--primary-navy)] font-semibold hover:underline">SuperAdmin Login</Link>
            </div>
            <div>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Dynamic Gradient / Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--primary-navy)] items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ background: 'var(--gradient-hero)' }}></div>
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[var(--primary-teal)] blur-[120px] opacity-50 mix-blend-screen"></div>
        <div className="absolute bottom-[10%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[var(--primary-gold)] blur-[120px] opacity-30 mix-blend-screen"></div>
        
        <div className="absolute top-8 right-8 z-20"><ThemeToggle /></div>

        <div className="relative z-10 p-12 max-w-lg text-center text-white">
          <div className="mb-8 flex justify-center">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
               <Shield className="w-10 h-10 text-[var(--primary-gold)]" />
             </div>
          </div>
          <h3 className="text-4xl font-bold mb-4 leading-tight">Elevate Your PG Management</h3>
          <p className="text-lg text-blue-100 opacity-90 leading-relaxed">
            Join thousands of property owners, managers, staff, parents, and students who rely on SmartPG for seamless daily operations.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="font-bold text-2xl text-[var(--primary-gold)] mb-1">99.9%</div>
              <div className="text-xs text-blue-100 uppercase tracking-wider">Uptime SLA</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="font-bold text-2xl text-[var(--primary-gold)] mb-1">24/7</div>
              <div className="text-xs text-blue-100 uppercase tracking-wider">Support Access</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

