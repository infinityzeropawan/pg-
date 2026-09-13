const fs = require('fs');
const path = require('path');

const files = [
  {
    path: 'src/app/manager/login/ManagerLogin_components/ManagerLoginMain.tsx',
    roleLabel: 'Manager',
    apiImport: 'import { api } from \'@/app/manager/manager_lib/manager_api/ManagerApi\';',
    sessionImport: 'import { setSession } from \'@/app/manager/manager_lib/manager_auth/ManagerSession\';',
    roleParam: "'manager'",
    email: 'manager3@gmail.com',
    pass: 'Manager@123',
    isFirst: false,
    dashboardUrl: '/manager/dashboard',
    firstLoginUrl: '/manager/first-login'
  },
  {
    path: 'src/app/owner/login/OwnerLogin_components/OwnerLoginMain.tsx',
    roleLabel: 'Owner',
    apiImport: 'import { api } from \'@/app/owner/owner_lib/owner_api/OwnerApi\';',
    sessionImport: 'import { setSession } from \'@/app/owner/owner_lib/owner_auth/OwnerSession\';',
    roleParam: "'owner'",
    email: 'owner@gmail.com',
    pass: 'Owner3@123',
    isFirst: false,
    dashboardUrl: '/owner/dashboard',
    firstLoginUrl: '/owner/first-login'
  },
  {
    path: 'src/app/parent/login/ParentLogin_components/ParentLoginMain.tsx',
    roleLabel: 'Parent',
    apiImport: 'import { api } from \'@/app/parent/parent_lib/parent_api/ParentApi\';',
    sessionImport: 'import { setSession } from \'@/app/parent/parent_lib/parent_auth/ParentSession\';',
    roleParam: "'parent'",
    email: 'peter.m@example.com',
    pass: 'Parent@123',
    isFirst: false,
    dashboardUrl: '/parent/dashboard',
    firstLoginUrl: '' // Parents might not have first-login
  },
  {
    path: 'src/app/staff/login/StaffLogin_components/StaffLoginMain.tsx',
    roleLabel: 'Staff',
    apiImport: 'import { api } from \'@/app/staff/staff_lib/staff_api/StaffApi\';',
    sessionImport: 'import { setSession } from \'@/app/staff/staff_lib/staff_auth/StaffSession\';',
    roleParam: "'staff'",
    email: 'cook3@gmail.com',
    pass: 'Cook@123',
    isFirst: false,
    dashboardUrl: '/staff/dashboard', // Wait, staff goes to `/staff/${user.staffType}` mostly. I will check the original file. Let's extract from the file.
  },
  {
    path: 'src/app/student/login/StudentLogin_components/StudentLoginMain.tsx',
    roleLabel: 'Student',
    apiImport: 'import { api } from \'@/app/student/student_lib/student_api/StudentApi\';',
    sessionImport: 'import { setSession } from \'@/app/student/student_lib/student_auth/StudentSession\';',
    roleParam: "'student'",
    email: 'student3@gmail.com',
    pass: 'Student@123',
    isFirst: false,
    dashboardUrl: '/student/dashboard',
    firstLoginUrl: ''
  },
  // First Logins
  {
    path: 'src/app/manager/first-login/ManagerFirstLogin_components/ManagerFirstLoginMain.tsx',
    roleLabel: 'Manager',
    apiImport: 'import { api } from \'@/app/manager/manager_lib/manager_api/ManagerApi\';',
    sessionImport: 'import { getSession, setSession } from \'@/app/manager/manager_lib/manager_auth/ManagerSession\';',
    isFirst: true,
    dashboardUrl: '/manager/dashboard'
  },
  {
    path: 'src/app/owner/first-login/OwnerFirstLogin_components/OwnerFirstLoginMain.tsx',
    roleLabel: 'Owner',
    apiImport: 'import { api } from \'@/app/owner/owner_lib/owner_api/OwnerApi\';',
    sessionImport: 'import { getSession, setSession } from \'@/app/owner/owner_lib/owner_auth/OwnerSession\';',
    isFirst: true,
    dashboardUrl: '/owner/dashboard'
  },
  {
    path: 'src/app/staff/first-login/StaffFirstLogin_components/StaffFirstLoginMain.tsx',
    roleLabel: 'Staff',
    apiImport: 'import { api } from \'@/app/staff/staff_lib/staff_api/StaffApi\';',
    sessionImport: 'import { getSession, setSession } from \'@/app/staff/staff_lib/staff_auth/StaffSession\';',
    isFirst: true,
    dashboardUrl: '/staff/dashboard' // I'll fix this manually if needed.
  }
];

// Instead of hardcoding, I will read the original file, extract exact imports and router.push logic!

function generateScript() {
  const allFiles = [
    'src/app/manager/login/ManagerLogin_components/ManagerLoginMain.tsx',
    'src/app/owner/login/OwnerLogin_components/OwnerLoginMain.tsx',
    'src/app/parent/login/ParentLogin_components/ParentLoginMain.tsx',
    'src/app/staff/login/StaffLogin_components/StaffLoginMain.tsx',
    'src/app/student/login/StudentLogin_components/StudentLoginMain.tsx',
    'src/app/manager/first-login/ManagerFirstLogin_components/ManagerFirstLoginMain.tsx',
    'src/app/owner/first-login/OwnerFirstLogin_components/OwnerFirstLoginMain.tsx',
    'src/app/staff/first-login/StaffFirstLogin_components/StaffFirstLoginMain.tsx'
  ];

  for (let f of allFiles) {
    if(!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    
    let isFirst = f.includes('first-login');
    let compNameMatch = content.match(/export function ([A-Za-z0-9_]+)\(/);
    let compName = compNameMatch ? compNameMatch[1] : '';
    
    let roleNameMatch = compName.match(/^(Manager|Owner|Parent|Staff|Student)/);
    let roleName = roleNameMatch ? roleNameMatch[1] : 'Role';
    
    let emailMatch = content.match(/useState\('([^']+)'\)/);
    let email = emailMatch ? emailMatch[1] : '';
    
    let passMatch = content.match(/useState\('([^']+)'\)/g);
    let pass = passMatch && passMatch.length > 1 ? passMatch[1].match(/useState\('([^']+)'\)/)[1] : '';
    
    let importsMatch = content.match(/import \{ [^}]+\} from '@\/app\/[^']+';/g);
    let imports = importsMatch ? importsMatch.join('\n') : '';

    let routerPushBlockMatch = content.match(/try \{([\s\S]*?)\} catch/);
    let tryBlock = routerPushBlockMatch ? routerPushBlockMatch[1].trim() : '';
    
    // Create new content
    let newContent = `// RESPONSIBILITY: Renders the ${compName} component.
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

${imports}
import '../../../../../homepage.css';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function ${compName}() {
  const router = useRouter();
`;

    if(isFirst) {
      newContent += `  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      ${tryBlock.replace(/setSession/g, 'setSession').replace(/router\.push/g, 'router.push')}
    } catch (err: any) {
      setError(err.message || 'Action failed');
      setLoading(false);
    }
  };

  return (
    <div className="home-theme min-h-screen flex bg-[var(--bg-light)] font-sans">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <div className="absolute top-8 right-8 lg:hidden"><ThemeToggle /></div>
        <div className="absolute top-8 left-8 lg:left-16">
          <Link href="/" className="font-bold text-2xl tracking-tight text-[var(--primary-navy)]">
            <span style={{ color: 'var(--primary-teal)' }}>Smart</span>PG
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-6 border border-blue-100 shadow-sm">
            <Shield className="w-8 h-8 text-[var(--primary-teal)]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--primary-navy)] tracking-tight mb-2">
            Set Your Password
          </h2>
          <p className="text-sm text-[var(--text-medium)] mb-8">
            Please set a permanent password to continue to the ${roleName} dashboard.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
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
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--primary-navy)] items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ background: 'var(--gradient-hero)' }}></div>
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[var(--primary-teal)] blur-[120px] opacity-50 mix-blend-screen"></div>
        <div className="absolute bottom-[10%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[var(--primary-gold)] blur-[120px] opacity-30 mix-blend-screen"></div>
        <div className="absolute top-8 right-8 z-20"><ThemeToggle /></div>
        <div className="relative z-10 p-12 max-w-lg text-center text-white">
          <h3 className="text-4xl font-bold mb-4 leading-tight">Secure Your Account</h3>
          <p className="text-lg text-blue-100 opacity-90 leading-relaxed">
            Create a strong password to ensure your data stays safe and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
`;
    } else {
      newContent += `  const [email, setEmail] = useState('${email}');
  const [password, setPassword] = useState('${pass}');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      ${tryBlock}
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="home-theme min-h-screen flex bg-[var(--bg-light)] font-sans">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <div className="absolute top-8 right-8 lg:hidden"><ThemeToggle /></div>
        <div className="absolute top-8 left-8 lg:left-16">
          <Link href="/" className="font-bold text-2xl tracking-tight text-[var(--primary-navy)]">
            <span style={{ color: 'var(--primary-teal)' }}>Smart</span>PG
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-6 border border-blue-100 shadow-sm">
            <Shield className="w-8 h-8 text-[var(--primary-teal)]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--primary-navy)] tracking-tight mb-2">
            ${roleName} Login
          </h2>
          <p className="text-sm text-[var(--text-medium)] mb-8">
            Access your specific role dashboard securely.
          </p>

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

          <div className="mt-8 p-4 bg-[var(--bg-medium)] rounded-[var(--radius-sm)] border border-gray-200 text-xs text-[var(--text-dark)]">
            <strong>Demo Credentials:</strong><br/>
            Email: {email}<br/>
            Password: {password}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--primary-navy)] items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ background: 'var(--gradient-hero)' }}></div>
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[var(--primary-teal)] blur-[120px] opacity-50 mix-blend-screen"></div>
        <div className="absolute bottom-[10%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[var(--primary-gold)] blur-[120px] opacity-30 mix-blend-screen"></div>
        <div className="absolute top-8 right-8 z-20"><ThemeToggle /></div>
        <div className="relative z-10 p-12 max-w-lg text-center text-white">
          <h3 className="text-4xl font-bold mb-4 leading-tight">${roleName} Portal</h3>
          <p className="text-lg text-blue-100 opacity-90 leading-relaxed">
            Manage your daily operations, view important updates, and streamline your workflow with SmartPG.
          </p>
        </div>
      </div>
    </div>
  );
}
`;
    }

    fs.writeFileSync(f, newContent);
    console.log("Updated", f);
  }
}

generateScript();
