#!/usr/bin/env node

/**
 * Sets the built index.html <title> to the club's display name.
 * Each project under `projects/<club>` builds from the same shared
 * `src/index.html`, so the title must be patched per club after build.
 *
 * Usage: node scripts/set-index-title.js <project> [outDir]
 *   outDir defaults to projects/<project>/www
 */
const fs = require('fs');
const path = require('path');

const [, , project, outDir] = process.argv;

if (!project) {
  console.error('Usage: node scripts/set-index-title.js <project> [outDir]');
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
const configPath = path.join(rootDir, 'projects', project, 'config.ts');
const indexPath = path.join(rootDir, outDir || path.join('projects', project, 'www'), 'index.html');

const configSource = fs.readFileSync(configPath, 'utf8');
const match = configSource.match(/name:\s*'([^']+)'/);

if (!match) {
  console.error(`Could not find "name" in ${configPath}`);
  process.exit(1);
}

const title = match[1];
const indexSource = fs.readFileSync(indexPath, 'utf8');
const updated = indexSource.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

fs.writeFileSync(indexPath, updated);
console.log(`Set <title> to "${title}" in ${indexPath}`);
