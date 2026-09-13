const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const srcPath = path.join(__dirname, 'src', 'app', 'manager');

// 1. Rename files and update their contents
walkDir(srcPath, (filePath) => {
  if (filePath.includes('ManagerUseManager') && filePath.endsWith('.ts')) {
    const newFilePath = filePath.replace(/ManagerUseManager([^\\\/]+)\.ts$/, 'useManager$1.ts');
    fs.renameSync(filePath, newFilePath);
    
    // Also replace the function name inside the file
    let content = fs.readFileSync(newFilePath, 'utf8');
    content = content.replace(/ManagerUseManager/g, 'useManager');
    fs.writeFileSync(newFilePath, content);
    console.log(`Renamed and updated: ${path.basename(newFilePath)}`);
  }
});

// 2. Update imports and usages in ALL .tsx and .ts files
walkDir(srcPath, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('ManagerUseManager')) {
      content = content.replace(/ManagerUseManager/g, 'useManager');
      fs.writeFileSync(filePath, content);
      console.log(`Updated imports in: ${path.basename(filePath)}`);
    }
  }
});

console.log('Refactoring complete!');
