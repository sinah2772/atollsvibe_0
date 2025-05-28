// A simple script to copy service-worker.js to the root of the dev server
// This helps ensure the service worker is available at the correct path
import * as fs from 'fs';
import * as path from 'path';

// Get the base path from environment or default
const basePath = process.env.BASE_PATH || '/atollsvibe/';
console.log(`Base path: ${basePath}`);

// Source and destination paths
const sourcePath = path.resolve('./public/service-worker.js');
const destPath = path.resolve('./', 'service-worker.js');

// Copy the service worker file
try {
  // Read the source file
  const sourceContent = fs.readFileSync(sourcePath, 'utf8');
  
  console.log(`Copying service worker from ${sourcePath} to ${destPath}`);
  
  // Write to the destination
  fs.writeFileSync(destPath, sourceContent, 'utf8');
  
  console.log('Service worker copied successfully');
} catch (err) {
  console.error('Error copying service worker:', err);
}
