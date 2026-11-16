/**
 * Post-build script for GitHub Pages SPA support.
 *
 * GitHub Pages returns HTTP 200 only when it finds an actual file.
 * For a React SPA with client-side routing, we need to create
 * physical index.html files for every known route so that:
 *   /me          → dist/me/index.html          → 200 ✅
 *   /artikel     → dist/artikel/index.html     → 200 ✅
 *   /fancam-list → dist/fancam-list/index.html → 200 ✅
 *
 * Dynamic routes (e.g. /artikel/:id) still fall through to 404.html,
 * which is also a copy of index.html, so React Router handles them.
 */

import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';
const INDEX = join(DIST, 'index.html');

// All static routes defined in App.jsx
const routes = [
  'list-book',
  'artikel',
  'me',
  'proyek',
  'fancam-list',
  'admin',
];

// 1. Create a directory + index.html for each static route
for (const route of routes) {
  const dir = join(DIST, route);
  mkdirSync(dir, { recursive: true });
  copyFileSync(INDEX, join(dir, 'index.html'));
  console.log(`  ✓ ${route}/index.html`);
}

// 2. Copy index.html → 404.html (fallback for dynamic routes like /artikel/:id)
copyFileSync(INDEX, join(DIST, '404.html'));
console.log('  ✓ 404.html (fallback for dynamic routes)');

console.log(`\n  Done! ${routes.length} route pages + 404.html generated.\n`);
