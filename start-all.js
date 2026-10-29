import { spawn } from 'node:child_process';

console.log('🚀 Starting JSON Server on port 3000 and Vite Frontend...');

const jsonServer = spawn(process.execPath, ['./node_modules/json-server/lib/bin.js', 'db.json', '-p', '3000'], {
  stdio: 'inherit',
  shell: false
});

const vite = spawn(process.execPath, ['./node_modules/vite/bin/vite.js', '--host'], {
  stdio: 'inherit',
  shell: false
});

const handleExit = () => {
  jsonServer.kill();
  vite.kill();
  process.exit();
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
