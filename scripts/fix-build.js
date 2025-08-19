const fs = require('fs');
const path = require('path');

// distディレクトリのindex.htmlを修正
const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf-8');
  
  // faviconタグを削除または置き換え
  html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '<link rel="icon" href="data:,">');
  html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
  
  fs.writeFileSync(indexPath, html);
  console.log('✅ Fixed index.html');
}

// 空のfavicon.icoを作成
const faviconPath = path.join(distPath, 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  fs.writeFileSync(faviconPath, '');
  console.log('✅ Created empty favicon.ico');
}