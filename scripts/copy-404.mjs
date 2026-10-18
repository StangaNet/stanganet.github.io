import { copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const index = resolve(root, 'dist/index.html');
const notFound = resolve(root, 'dist/404.html');

if (!existsSync(index)) {
  console.error('copy-404: dist/index.html not found');
  process.exit(1);
}

copyFileSync(index, notFound);
console.log('copy-404: wrote dist/404.html');
