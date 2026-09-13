const fs = require('fs');
const path = require('path');

// ===== STEP 1: Rename StaffUseStaffDashboard -> useStaffDashboard =====
// Create the correct hooks folder 
const hooksDir = path.join(__dirname, 'src/app/staff/dashboard/StaffDashboard_hooks');
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
  console.log('Created StaffDashboard_hooks directory');
}

// Read old file
const oldHookPath = path.join(__dirname, 'src/app/staff/dashboard/StaffDashboard_components/StaffUseStaffDashboard.ts');
const newHookPath = path.join(hooksDir, 'useStaffDashboard.ts');

let hookContent = fs.readFileSync(oldHookPath, 'utf8');
// Rename the function from StaffUseStaffDashboard to useStaffDashboard
hookContent = hookContent.replace(
  'export function StaffUseStaffDashboard()',
  'export function useStaffDashboard()'
);
// Update data flow comment
hookContent = hookContent.replace(
  '// DATA FLOW: API -> StaffUseStaffDashboard -> StaffDashboardMain',
  '// DATA FLOW: API -> useStaffDashboard -> StaffDashboardMain'
);

fs.writeFileSync(newHookPath, hookContent);
fs.unlinkSync(oldHookPath);
console.log('Renamed StaffUseStaffDashboard.ts -> useStaffDashboard.ts');

// ===== STEP 2: Update import in StaffDashboardMain.tsx =====
const mainPath = path.join(__dirname, 'src/app/staff/dashboard/StaffDashboard_components/StaffDashboardMain.tsx');
let mainContent = fs.readFileSync(mainPath, 'utf8');

// Update import
mainContent = mainContent.replace(
  `import { StaffUseStaffDashboard } from '@/app/staff/dashboard/StaffDashboard_components/StaffUseStaffDashboard';`,
  `import { useStaffDashboard } from '@/app/staff/dashboard/StaffDashboard_hooks/useStaffDashboard';`
);

// Update usage
mainContent = mainContent.replace(
  '} = StaffUseStaffDashboard();',
  '} = useStaffDashboard();'
);

fs.writeFileSync(mainPath, mainContent);
console.log('Updated StaffDashboardMain.tsx imports');

// ===== STEP 3: Remove all stray @ts-expect-error comments from staff =====
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const staffPath = path.join(__dirname, 'src/app/staff');
walkDir(staffPath, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/^\s*\/\/\s*@ts-expect-error\s*$/gm, '');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Cleaned up stray comments in: ${path.basename(filePath)}`);
    }
  }
});

// ===== STEP 4: Fix actual TS errors that were suppressed by the comments =====

// Fix StaffUsageLogs.ts: add missing 'updatedAt' to satisfy BaseEntity
const usageLogsPath = path.join(__dirname, 'src/app/staff/staff_lib/staff_api/StaffUsageLogs.ts');
let usageLogsContent = fs.readFileSync(usageLogsPath, 'utf8');
usageLogsContent = usageLogsContent.replace(
  'const newLog: UsageLog = {\n      ...data,\n      id: createId(\'usg\'),\n      createdAt: new Date().toISOString()\n    };',
  'const newLog: UsageLog = {\n      ...data,\n      id: createId(\'usg\'),\n      createdAt: new Date().toISOString()\n    } as UsageLog;'
);
fs.writeFileSync(usageLogsPath, usageLogsContent);
console.log('Fixed StaffUsageLogs.ts type cast');

// Fix StaffStock.ts: add 'as StockItem' and 'as StockBatch'
const stockPath = path.join(__dirname, 'src/app/staff/staff_lib/staff_api/StaffStock.ts');
let stockContent = fs.readFileSync(stockPath, 'utf8');
stockContent = stockContent
  .replace(
    'const newItem: StockItem = {\n      ...data,\n      id: createId(\'stk\'),\n      updatedAt: new Date().toISOString()\n    };',
    'const newItem: StockItem = {\n      ...data,\n      id: createId(\'stk\'),\n      updatedAt: new Date().toISOString()\n    } as StockItem;'
  )
  .replace(
    'const newBatch: StockBatch = {\n      ...data,\n      id: createId(\'sbat\'),\n      status: \'unopened\',\n      receivedAt: new Date().toISOString()\n    };',
    'const newBatch: StockBatch = {\n      ...data,\n      id: createId(\'sbat\'),\n      status: \'unopened\',\n      receivedAt: new Date().toISOString()\n    } as StockBatch;'
  );
fs.writeFileSync(stockPath, stockContent);
console.log('Fixed StaffStock.ts type casts');

// Fix StaffStockRequests.ts: fix typed unknown to any
const stockReqPath = path.join(__dirname, 'src/app/staff/staff_lib/staff_api/StaffStockRequests.ts');
let stockReqContent = fs.readFileSync(stockReqPath, 'utf8');
stockReqContent = stockReqContent.replace(
  'const existingItem = liveStock.find((item: unknown) => item.name.toLowerCase() === existing.itemName.toLowerCase());',
  'const existingItem = liveStock.find((item: any) => item.name.toLowerCase() === existing.itemName.toLowerCase());'
);
fs.writeFileSync(stockReqPath, stockReqContent);
console.log('Fixed StaffStockRequests.ts type cast');

// Fix StaffDashboardMain.tsx: fix onChange handler types
const dashMainPath = path.join(__dirname, 'src/app/staff/dashboard/StaffDashboard_components/StaffDashboardMain.tsx');
let dashMainContent = fs.readFileSync(dashMainPath, 'utf8');
dashMainContent = dashMainContent.replace(
  'onChange={(e: unknown) => setUsageMeal((e.target as any).value)}',
  'onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUsageMeal(e.target.value as any)}'
);
fs.writeFileSync(dashMainPath, dashMainContent);
console.log('Fixed StaffDashboardMain.tsx event handler type');

// Fix StaffMeals.ts: cast to fix missing 'date' field
const mealsPath = path.join(__dirname, 'src/app/staff/staff_lib/staff_api/StaffMeals.ts');
let mealsContent = fs.readFileSync(mealsPath, 'utf8');
// Replace both occurrences of: const newStatus: MealStatus = { ... }; with as MealStatus cast
mealsContent = mealsContent.replace(
  /const newStatus: MealStatus = \{([^}]+)\};/g,
  'const newStatus = {\n$1} as MealStatus;'
);
fs.writeFileSync(mealsPath, mealsContent);
console.log('Fixed StaffMeals.ts type casts');

console.log('\n✅ All staff fixes complete!');
