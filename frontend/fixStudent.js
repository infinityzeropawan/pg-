const fs = require('fs');
const path = require('path');

// ===== Fix 1: StudentUseStudentDashboard -> useStudentDashboard =====
const dashboardHooksDir = path.join(__dirname, 'src/app/student/dashboard/StudentDashboard_hooks');
if (!fs.existsSync(dashboardHooksDir)) {
  fs.mkdirSync(dashboardHooksDir, { recursive: true });
}

const oldDashHook = path.join(__dirname, 'src/app/student/dashboard/StudentDashboard_components/StudentUseStudentDashboard.ts');
const newDashHook = path.join(dashboardHooksDir, 'useStudentDashboard.ts');

let dashHookContent = fs.readFileSync(oldDashHook, 'utf8');
dashHookContent = dashHookContent
  .replace('export function StudentUseStudentDashboard()', 'export function useStudentDashboard()')
  .replace('// DATA FLOW: API -> StudentUseStudentDashboard -> StudentDashboardMain', '// DATA FLOW: API -> useStudentDashboard -> StudentDashboardMain');
fs.writeFileSync(newDashHook, dashHookContent);
fs.unlinkSync(oldDashHook);
console.log('✅ Renamed StudentUseStudentDashboard -> useStudentDashboard');

// Update StudentDashboardMain.tsx
const dashMainPath = path.join(__dirname, 'src/app/student/dashboard/StudentDashboard_components/StudentDashboardMain.tsx');
let dashMainContent = fs.readFileSync(dashMainPath, 'utf8');
dashMainContent = dashMainContent
  .replace(
    `import { StudentUseStudentDashboard } from '@/app/student/dashboard/StudentDashboard_components/StudentUseStudentDashboard';`,
    `import { useStudentDashboard } from '@/app/student/dashboard/StudentDashboard_hooks/useStudentDashboard';`
  )
  .replace('} = StudentUseStudentDashboard();', '} = useStudentDashboard();')
  .replace('// DATA FLOW: useStudentDashboard.ts -> StudentDashboardMain.tsx', '// DATA FLOW: useStudentDashboard.ts -> StudentDashboardMain.tsx');
fs.writeFileSync(dashMainPath, dashMainContent);
console.log('✅ Updated StudentDashboardMain.tsx imports');

// ===== Fix 2: StudentUseStudentProfile -> useStudentProfile =====
const profileHooksDir = path.join(__dirname, 'src/app/student/profile/StudentProfile_hooks');
if (!fs.existsSync(profileHooksDir)) {
  fs.mkdirSync(profileHooksDir, { recursive: true });
}

const oldProfileHook = path.join(__dirname, 'src/app/student/profile/StudentProfile_components/StudentUseStudentProfile.ts');
const newProfileHook = path.join(profileHooksDir, 'useStudentProfile.ts');

let profileHookContent = fs.readFileSync(oldProfileHook, 'utf8');
profileHookContent = profileHookContent
  .replace('export function StudentUseStudentProfile()', 'export function useStudentProfile()')
  .replace('// DATA FLOW: API -> StudentUseStudentProfile -> StudentProfileMain', '// DATA FLOW: API -> useStudentProfile -> StudentProfileMain');
fs.writeFileSync(newProfileHook, profileHookContent);
fs.unlinkSync(oldProfileHook);
console.log('✅ Renamed StudentUseStudentProfile -> useStudentProfile');

// Update StudentProfileMain.tsx
const profileMainPath = path.join(__dirname, 'src/app/student/profile/StudentProfile_components/StudentProfileMain.tsx');
let profileMainContent = fs.readFileSync(profileMainPath, 'utf8');
profileMainContent = profileMainContent
  .replace(
    `import { StudentUseStudentProfile } from '@/app/student/profile/StudentProfile_components/StudentUseStudentProfile';`,
    `import { useStudentProfile } from '@/app/student/profile/StudentProfile_hooks/useStudentProfile';`
  )
  .replace('} = StudentUseStudentProfile();', '} = useStudentProfile();')
  .replace('// DATA FLOW: StudentUseStudentProfile.ts -> StudentProfileMain.tsx', '// DATA FLOW: useStudentProfile.ts -> StudentProfileMain.tsx');
fs.writeFileSync(profileMainPath, profileMainContent);
console.log('✅ Updated StudentProfileMain.tsx imports');

console.log('\n🎉 All student fixes complete!');
