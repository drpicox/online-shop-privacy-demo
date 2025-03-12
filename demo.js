#!/usr/bin/env node
const { spawn, exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Check if ngrok is installed
exec('which ngrok', (error, stdout) => {
  if (error) {
    console.error('❌ ngrok not found. Please install ngrok: npm install -g ngrok');
    process.exit(1);
  }
  
  console.log('✅ ngrok found, starting demo...');
  startDemo();
});

function startDemo() {
  console.log('🚀 Starting demo environment...');
  
  // Use the static domain for ngrok
  console.log('🔄 Starting ngrok with static domain...');
  
  // Start ngrok in a separate process with static domain
  const staticDomain = 'fresh-grubworm-partly.ngrok-free.app';
  const ngrokUrl = `https://${staticDomain}`;
  
  const ngrok = spawn('ngrok', ['http', '--url', staticDomain, '3000'], { 
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: true 
  });
  
  // Wait a moment for ngrok to start up
  setTimeout(() => {
    console.log(`🌐 ngrok URL: ${ngrokUrl}`);
    startApp(ngrokUrl);
  }, 2000); // Wait 2 seconds for ngrok to initialize
  
  // Handle ngrok output for debugging
  ngrok.stdout.on('data', (data) => {
    console.log('ngrok: ' + data.toString());
  });
  
  ngrok.stderr.on('data', (data) => {
    console.error('ngrok error: ' + data.toString());
  });
  
  ngrok.on('close', (code) => {
    console.log(`ngrok process exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    ngrok.kill();
    process.exit(0);
  });
}

function startApp(ngrokUrl) {
  // Replace the baseUrl in the viewer page with ngrok URL
  console.log('🔧 Setting up QR code with ngrok URL in the viewer...');
  
  // Make a temporary copy of lib/ngrokUrl.js to store the URL
  const ngrokUrlFile = path.join(__dirname, 'lib', 'ngrokUrl.js');
  fs.writeFileSync(ngrokUrlFile, `export const NGROK_URL = '${ngrokUrl}';\n`);
  
  console.log('📱 QR code will point to:', `${ngrokUrl}/shop`);
  console.log('🔗 View the demo at:', `${ngrokUrl}/viewer`);
  
  // Start the Next.js application
  const app = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NGROK_URL: ngrokUrl
    }
  });
  
  app.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    process.exit(code);
  });
}