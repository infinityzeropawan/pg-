const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('Main.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/Rohit/Desktop/Project_to_work/Pg-Management/src/app/student');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // ONLY replace main layout constraints, e.g. max-w-2xl up to 7xl
  const newContent = content.replace(/max-w-[2-7]xl\s+mx-auto/g, 'w-full');
  if(newContent !== content) {
    fs.writeFileSync(f, newContent, 'utf8');
    console.log('Updated ' + f);
  }
});
