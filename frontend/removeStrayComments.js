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

walkDir(srcPath, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace any line that contains only whitespace and // @ts-expect-error
    let newContent = content.replace(/^\s*\/\/\s*@ts-expect-error\s*$/gm, '');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Cleaned up stray comments in: ${path.basename(filePath)}`);
    }
  }
});

console.log('Cleanup complete!');
