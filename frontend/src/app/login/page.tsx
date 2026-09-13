'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Briefcase, Users, Utensils, UserCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

import { authApi as api } from '@/app/login/login_lib/login_api/LoginAuth';
import { setSession } from '@/app/login/login_lib/login_auth/LoginSession';
import '../homepage.css';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const DEMO_ACCOUNTS = [
  { id: 'superadmin', label: 'SuperAdmin', email: 'superadmin@gmail.com', password: 'Super@123', icon: Shield },
  { id: 'owner', label: 'Owner (Seed Data)', email: 'owner@gmail.com', password: 'Owner3@123', icon: Briefcase },
  { id: 'manager', label: 'Manager', email: 'manager3@gmail.com', password: 'Manager@123', icon: Users },
  { id: 'cook', label: 'Cook', email: 'cook3@gmail.com', password: 'Cook@123', icon: Utensils },
  { id: 'student', label: 'Student', email: 'student3@gmail.com', password: 'Student@123', icon: UserCheck }
];

export default function UnifiedLogin() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0]!.email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS[0]!.password);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(DEMO_ACCOUNTS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedRole(acc);
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = api.login({ email, password });
      setSession(user);
      
      router.push(`/${user.role}/dashboard`);
    } catch (err) {
      setError((err as Error).message || 'Login failed. Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="home-theme min-h-screen flex bg-[var(--bg-light)] font-sans">
      
      {/* Left side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        
        <div className="absolute top-8 right-8 lg:hidden"><ThemeToggle /></div>
        <div className="absolute top-8 left-8 lg:left-16">
          <Link href="/" className="font-bold text-2xl tracking-tight text-[var(--primary-navy)]">
            <span style={{ color: 'var(--primary-teal)' }}>Smart</span>PG
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-16">
          <h2 className="text-3xl font-extrabold text-[var(--primary-navy)] tracking-tight mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-medium)] mb-8">
            Select a role below to auto-fill demo credentials or sign in manually.
          </p>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = selectedRole?.id === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleRoleSelect(acc)}
                  className={`flex flex-col items-center justify-center p-3 rounded-[var(--radius-md)] border transition-all duration-200 ${
                    isSelected 
                      ? 'border-[var(--primary-teal)] bg-blue-50 ring-1 ring-[var(--primary-teal)] transform -translate-y-1 shadow-md' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <acc.icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-[var(--primary-teal)]' : 'text-[var(--text-medium)]'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-[var(--primary-teal)]' : 'text-[var(--text-medium)]'}`}>
                    {acc.label}
                  </span>
                </button>
              );
            })}
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-[var(--radius-sm)] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] focus:border-transparent text-gray-800 transition-all"
                placeholder="name@example.com"
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
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-[var(--radius-sm)] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] focus:border-transparent text-gray-800 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-[var(--radius-sm)] flex items-center gap-2">
                <Shield className="w-4 h-4" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-[var(--radius-sm)] shadow-lg text-sm font-bold text-white bg-[var(--primary-teal)] hover:bg-[var(--primary-navy)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-teal)] disabled:opacity-70 transition-all transform hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In Securely'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-[var(--text-light)]">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>

      {/* Right side: Dynamic Gradient / Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--primary-navy)] items-center justify-center">
        {/* Dynamic Abstract Shapes */}
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
          <h3 className="text-4xl font-bold mb-4 leading-tight">Elevate Your Hostel Management</h3>
          <p className="text-lg text-blue-100 opacity-90 leading-relaxed">
            Join thousands of property owners, managers, and students who rely on SmartPG for seamless daily operations.
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
