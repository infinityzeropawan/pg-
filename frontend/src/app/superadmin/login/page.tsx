'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi as api } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminAuth';
import { setSession } from '@/app/superadmin/superadmin_lib/superadmin_auth/SuperadminSession';
import '../../homepage.css';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Shield, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@gmail.com');
  const [password, setPassword] = useState('Super@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = api.login({ email, password, expectedRole: 'superadmin' });
      setSession(user);
      router.push('/superadmin/dashboard');
    } catch (err: any) {
      setError((err as any).message || 'Login failed');
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
          <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-xl mb-6 border border-red-100 shadow-sm">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--primary-navy)] tracking-tight mb-2">
            Platform Admin
          </h2>
          <p className="text-sm text-[var(--text-medium)] mb-8">
            Access the superadmin console to manage the SaaS platform.
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-[var(--radius-sm)] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] focus:border-transparent text-gray-800 transition-all"
                placeholder="admin@smartpg.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-1">
                Admin Password
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
              className="w-full py-3 px-4 rounded-[var(--radius-sm)] shadow-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 transition-all transform hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Access Console'}
            </button>
          </form>
          
          <div className="mt-8 p-4 bg-[var(--bg-medium)] rounded-[var(--radius-sm)] border border-gray-200 text-xs text-[var(--text-dark)]">
            <strong>Demo Credentials:</strong><br/>
            Email: superadmin@gmail.com<br/>
            Password: Super@123
          </div>
        </div>
      </div>

      {/* Right side: Dynamic Gradient / Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--primary-navy)] items-center justify-center">
        {/* Dynamic Abstract Shapes for SuperAdmin */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{ background: 'linear-gradient(135deg, #7F1D1D 0%, #1A3A5C 100%)' }}></div>
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-red-500 blur-[120px] opacity-40 mix-blend-screen"></div>
        <div className="absolute bottom-[10%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[var(--primary-teal)] blur-[120px] opacity-30 mix-blend-screen"></div>
        
        <div className="absolute top-8 right-8 z-20"><ThemeToggle /></div>

        <div className="relative z-10 p-12 max-w-lg text-center text-white">
          <h3 className="text-4xl font-bold mb-4 leading-tight">System Control Center</h3>
          <p className="text-lg text-red-100 opacity-90 leading-relaxed">
            Monitor infrastructure, manage enterprise subscriptions, and oversee the entire SmartPG multi-tenant ecosystem.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="font-bold text-2xl text-red-400 mb-1">Secure</div>
              <div className="text-xs text-red-100 uppercase tracking-wider">End-to-End Encryption</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="font-bold text-2xl text-red-400 mb-1">Global</div>
              <div className="text-xs text-red-100 uppercase tracking-wider">Multi-Region Scale</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

