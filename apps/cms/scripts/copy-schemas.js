/**
 * Copy schema.json files from src/api/ to dist/src/api/.
 * Strapi's TS compiler (tsc) only emits .js files — JSON schemas must be copied manually.
 */
const fs = require('fs');
const path = require('path');

function copyJsonFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyJsonFiles(srcPath, destPath);
    } else if (entry.name.endsWith('.json')) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  copied ${srcPath} -> ${destPath}`);
    }
  }
}

console.log('Copying content type schemas to dist...');
copyJsonFiles(
  path.join(__dirname, '..', 'src', 'api'),
  path.join(__dirname, '..', 'dist', 'src', 'api')
);
console.log('Done.');
